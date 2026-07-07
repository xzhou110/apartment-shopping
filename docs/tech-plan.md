# Tech Plan — Apartment Shopping

Architecture for the apartment adaptation of **garage**. Pairs with **api-contract.md** (the frozen
seam between the two build lanes). Scope: the minimum architecture that satisfies the PRD — no more.

> **Partially superseded (kept as the original build record).** For CURRENT behavior see `STATE.md`,
> `DECISIONS.md` (ADR-002/006/007/008/009/010), and the **api-contract.md addendums**. Key deltas since this
> plan: the cost engine was **scope-cut** (no `effectiveMonthly`/`moveInCost`/`cost-asc` — §4 already notes this,
> but §5/§6/§8 still mention them); the **URL-hash share/import path was removed** (data-integrity/security); the
> persistence key is **`apt.v2`** (not `apt.v2`) and the overlay also carries **comments**; the lease goal is a
> single **6-mo** target (not 6–12); tracked amenities are **parking/balcony/gym** with laundry its own field; a
> new **`availability`** field + label; flag order is **scam → lease-term → rest** and the "unfurnished" info flag
> was removed; retiring a seed listing is now safe via `looksUserAdded` (no `STORE_KEY` bump — ADR-010).

## 1. Stack (confirmed) + the two non-negotiable rules

- **Vite + React 18 + TypeScript + Vitest.** Static SPA, deployed to **GitHub Pages**. **No backend,
  no auth, no accounts** — single user, per-browser `localStorage`. This is fixed by the PRD and
  inherited from garage; it's the right call (one user, no server-side state, free hosting).
- **Rule 1 — pure core / thin UI.** ALL domain logic is pure functions in `lib/*` and `data/*`,
  fully unit-tested. Components only format and render; they never reimplement a calculation. This is
  what lets the two lanes build in parallel against the contract and what makes the logic testable
  without a DOM.
- **Rule 2 — no new npm dependencies.** Haversine, geocoding, CSV/TSV, and the offline geo table are
  all hand-rolled. Rationale: the app must stay static and work **offline** for the headline feature;
  every dependency is a bundle-size, supply-chain, and offline-reliability liability for zero gain
  here. (Rejected: a geo/haversine npm lib — ~30 lines of trig is not worth a dep.)

**Why no backend / data layer is needed:** there is no shared state, no multi-user data, no secrets,
no server-side compute. Geocoding for common Bay Area inputs is a **bundled table** (no API). The only
network touch is an optional best-effort Nominatim call for arbitrary street addresses, done
**client-side** and cached. So: **BE not needed. A "data layer" exists only as bundled static files.**

## 2. File / module layout (mirrors the PRD file lanes)

**Shared — PM owns, neither agent touches:**
`app/src/types.ts` (frozen), `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`,
`src/main.tsx`, `src/test-setup.ts`, `.github/`, `.gitignore`, `README.md`.

**Data / pure-lib lane → `data-engineer`** (every file this agent creates):
```
src/lib/distance.ts          + distance.test.ts
src/lib/derive.ts            + derive.test.ts
src/lib/flags.ts            + flags.test.ts
src/lib/format.ts           + format.test.ts
src/lib/exportSheet.ts      + exportSheet.test.ts   (ported verbatim from garage, Car→Apartment)
src/data/apartments.ts      (the SEED — source of truth; geocoded lat/lng baked in)
src/data/amenities.ts
src/data/sheetCols.ts       + sheetCols.test.ts
src/data/geo/bayAreaGeo.ts  (offline table)
src/data/geocode.ts         + geocode.test.ts
scripts/buildGeo.*          (OPTIONAL — emits bayAreaGeo.ts from Census/GeoNames; not shipped)
```

**UI lane → `frontend-engineer`** (every file this agent creates):
```
src/state/useApartments.ts   (ported from garage useGarage; namespaces apt.v2 / apt.theme)
src/App.tsx
src/styles.css
src/components/*.tsx          (Card, Grid, CompareTable, DetailModal, ApartmentForm,
                              ExportModal, SettingsModal, Filters, Modal, RatingStars,
                              ThemeToggle, icons, helpers — mirror garage's component set)
```
`components/helpers.tsx` owns `applyFilters` / `applySort` (they CALL lib fns; see contract §10).

## 3. Distance subsystem (the one genuinely new piece)

The headline feature. Designed so the **critical path needs zero network**.

**Data:**
- Each *listing* is geocoded **at add-time by the PM/Claude** → `lat`/`lng` baked into the seed.
  No runtime geocoding of listings, ever. A null coord just hides that card's distance chip.
- The *anchor* is typed at runtime (city / ZIP / address) and resolved against the bundled table.

**Offline table — `data/geo/bayAreaGeo.ts`** (contract §2): `BAY_AREA_ZIPS` (5-digit string →
`[lat,lng]`) and `BAY_AREA_CITIES` (normalized city → `[lat,lng]`). Sourced from US Census ZCTA
centroids (ZIPs) + Census/GeoNames place centroids (cities), hand-curated to the 9-county Bay Area
(~250–400 ZIPs, ~80–120 cities/neighborhoods). It's a static generated artifact, ~15–25 KB.

**Resolver flow — `data/geocode.ts`** (contract §3):
1. `resolveAnchor(query)` — SYNC, OFFLINE. Normalizes (trim/lowercase/strip "CA"/parse ZIP), tries
   ZIP → city → geocache. Returns `{lat,lng}` or `null`.
2. If null, the UI may call `geocodeRemote(query)` — async Nominatim, first result, **caches** the
   hit into `localStorage['apt.geocache']`. On ANY failure returns `null` (never throws).
3. Distance is `haversine` (contract §1), in the user's unit. Per-card chip "≈ X mi to {label}";
   `Sort → Nearest` ranks by `distanceToAnchor` to the **primary** anchor.

**Graceful degradation (criterion #7):**
- No anchor set → `primaryAnchor` is null → all distances null → chips hidden, Nearest sort is a
  no-op (stable). No crash.
- Nonsense anchor → `resolveAnchor` null + `geocodeRemote` null → Anchor.lat/lng stays null → same
  hidden-chip behavior. No crash.
- Listing with null lat/lng → `distanceToAnchor` returns null → that one card hides its chip;
  others still show. In Nearest sort, null distances sink to the end (`?? Infinity`).

### Spike of the one external assumption (honest status)
Per the architect mandate I tried to empirically probe **Nominatim** (reachability, response shape,
datacenter-IP/CORS/ToS behavior) before freezing the contract. **I could not run the live probe in
this environment** (no shell/network access from the planning agent) — so I am NOT claiming it
passed. What I did instead, which is the more important architectural decision:

- **The architecture deliberately does not depend on Nominatim.** The headline feature and
  acceptance criterion #7 ("All offline — no network call for ZIP/city") are satisfied entirely by
  the bundled table. Nominatim is a **best-effort enhancement** for arbitrary street addresses only,
  and the contract specifies it returns `null` on any failure. So even if Nominatim is blocked,
  rate-limited, CORS-restricted, ToS-restricted, or down, the app still ships and passes QA — the
  user just falls back to typing a ZIP/city for those addresses.
- **Action for whoever has network access (data-engineer during build, or PM):** run the throwaway
  probe and record the result before relying on the remote path —
  `GET https://nominatim.openstreetmap.org/search?format=json&limit=1&q=Oakland,CA` with a
  descriptive `User-Agent`. Confirm: 200, JSON array, `[{lat:"...",lng:"..."}]` shape, and that the
  browser-origin call isn't CORS-blocked (Nominatim does send permissive CORS, but verify from the
  GH Pages origin). Nominatim's usage policy caps you at **~1 req/sec** and forbids heavy use — the
  UI MUST debounce (resolve on blur/submit, not per keystroke) and the cache makes repeats free.
  If the probe fails, **nothing in the architecture changes** — we simply document the remote path as
  unavailable and rely on the offline table (which is why it's the primary path, not the fallback).

This is the inversion of the canonical trap: rather than betting the feature on a network call that
might die on a datacenter IP / ToS / CORS, the critical path is offline-by-design and the network is
pure upside.

## 4. Cost handling + flag rules — rationale

**Cost (contract §4) — SCOPE CUT 2026-06-29:** No derived/total cost. There is **no `lib/cost.ts`**, no
`effectiveMonthly`, no `moveInCost`, no `cost-asc` sort. The user keeps cost fields (rent, parking, pet
rent, utilities, deposit, app/broker fees) as plain tracked values for their own eyeball comparison.
Cost ranking is by base **rent** (`rent-asc`/`rent-desc`); compare highlights lowest rent.

**Flags (contract §6):** ported pattern from garage's pure, injectable-`today` engine. Concrete
thresholds chosen to match the PRD's intent and the user's 6–12 mo short-term lens:
- risk reserved for the one truly disqualifying case (lease window can't be met) — keep risk rare so
  the red border means something.
- "over market" at **>1.05×** (garage used 1.04 for price; rent is noisier, 5% is a sensible floor).
- "far from anchor" at **>10 mi / >16 km**, and ONLY when an anchor is set and the listing has coords
  (so it never fires spuriously before the user has set up distance).
- "stale" at **>=30 days** (rentals turn faster than cars; 60d was the car threshold).
The engine takes a `FlagCtx { settings, primaryAnchor, today? }` — it needs the lease targets and the
resolved anchor coord, and `today` is injectable for deterministic tests.

## 5. Test plan (Vitest)

Every pure module gets a spec. Key cases:

- **distance.test.ts** — haversine known-distance sanity (e.g. SF City Hall → Oakland ≈ 8 mi, assert
  within a tolerance; identical points → 0; mi vs km ratio ≈ 1.609). `distanceToAnchor` null when
  apt or anchor lacks coords. `formatDistance` rounding + em-dash on null.
- **geocode.test.ts** — `resolveAnchor('94103')` and `'San Francisco'` and `'  oakland, CA '` all hit
  the offline table (no network); ZIP-in-address parsing; unknown query → null; geocache read path
  (seed `localStorage` then resolve hits cache). `geocodeRemote` is mocked (`vi.fn` over `fetch`):
  success → caches + returns coord; non-200 / throw / empty → null. **No real network in tests.**
- (no cost.test.ts — cost is tracked, not computed; see §4 scope cut)
- **derive.test.ts** — `pricePerSqft` null on 0/null sqft; `leaseFits` truth table (fits / can't-fit
  false / unknown null; one-sided bounds; target defaults 6–12).
- **flags.test.ts** — ONE assertion per rule (lease-can't-fit risk; each warn; each info incl. the
  far-anchor rule with a fixed `primaryAnchor` and a near vs far listing; the good combo) + the
  `signalLevel` escalation order. Use a fixed `ctx.today` so "available date passed" is deterministic.
- **format.test.ts** — `amenState` tri-state incl. AMENITY_IMPLIES (wire even if currently empty);
  `money`/`num` em-dash + `$0`; `yn`; `stars` clamp 0–5.
- **sheetCols.test.ts** — column count/order stable; derived cells (effectiveMonthly, moveInCost,
  pricePerSqft) present; amenities render Yes/No/? via amenState.
- **filter/sort** — pinned in the contract (§10) and tested where `applyFilters`/`applySort` live
  (UI lane), but the lib fns they call are covered above. UI lane should add a small helpers.test.ts:
  search across id/title/neighborhood/city/address; `reqAmenities` honors implications;
  `leaseFitsTarget` drops null; `nearest` sort orders by distance and is a stable no-op with a null
  anchor; `cost-asc` orders by effectiveMonthly; `showGone` default-hides Gone.

## 6. Integration notes (cross-lane)

- **localStorage namespaces (UI lane must use exactly these):**
  - `apt.v2` — the persisted `{ apartments, settings, removed }` blob (the data overlay).
  - `apt.theme` — `'light' | 'dark'`.
  - `apt.geocache` — the geocode cache (OWNED by `data/geocode.ts`, contract §3). Keep it separate
    from `apt.v2` so clearing app data doesn't wipe the cache and vice-versa.
- **Seed-merge pattern (ported from garage `useGarage` → `useApartments`):** the seed
  `data/apartments.ts` is the **source of truth** for the listing SET + data. `localStorage` overlays
  only the user's **rating + status + comments**, keeps user-added listings, and remembers **removed** ids so a
  deleted seed listing doesn't reappear. Hydrate every saved apartment over a `DEFAULT_APARTMENT` so older
  saves missing a newly-added field can't crash a render (same `hydrateCar`→`hydrateApartment` guard).
  - **URL-hash share/import REMOVED (post-launch, code review M2/N1):** localStorage is the sole overlay
    source — there is no hash read. A crafted `#hash` could have silently persisted attacker listings + a
    `sheetUrl`, so the reader was deleted. If share links return, build an explicit writer + an "accept" gate
    that strips `settings.sheetUrl` on import.
  - **Retiring a seed listing is safe (ADR-010):** `mergeWithSeed` only resurrects a saved-not-in-seed listing
    when `looksUserAdded(id)` (a timestamp id), so deleting a listing from the seed doesn't ghost-resurrect its
    stale overlay — no `STORE_KEY` bump needed (a bump would wipe all of the user's overlay state).
  - **Carry-over note:** the merge persists `rating`, `status`, and `comments` from the overlay
    (editing other fields of a *seed* listing in the form isn't persisted — the data file is truth).
- **The sort-context trap (most likely integration failure):** `applySort` for `nearest`/`cost`
  needs the resolved **primary-anchor coord** + **unit** + **settings** passed in (contract §10), not
  read from a global. `App.tsx` resolves the primary anchor's coord ONCE (it's already stored on the
  `Anchor` after the user adds it) and threads `{ primaryAnchor, unit, settings }` into `applySort`
  and into `getFlags`'s `FlagCtx`. If the UI lane forgets this, Nearest sort and the far-anchor flag
  silently no-op — call it out in the hook's return so it's obvious.
- **One-runtime check (mandate item 4):** there is **no second runtime** here — no email cron, no
  Edge Function, no server. All logic runs once, in the browser, from `lib/*`. `effectiveMonthly`,
  the flag engine, and haversine each have exactly one implementation imported everywhere (cards,
  sort, compare, export). No hand-synced duplicate exists or should be introduced. (If a future
  Sheets-sync digest ever needs `effectiveMonthly` server-side, import the same module — do not
  reimplement.)
- **No coordinate change to `types.ts`.** The frozen model already carries `lat/lng` on both
  `Apartment` and `Anchor`, the cost fields, the lease fields, and `Settings.anchors/primaryAnchorId/
  distanceUnit/targetMin|MaxLease`. Nothing in this plan requires a type change. (One soft note for
  the PM, not a blocker: the contract introduces a local `Coord = {lat,lng}` alias in `lib/distance`;
  it is intentionally NOT added to the frozen types to keep the seam minimal — the lib owns it.)

## 7. Out of scope (intentional — resist over-engineering)
Driving/transit time (straight-line only — v2). Live listing scraping / auto-import (user feeds
screenshots; Claude edits the seed). Backend / auth / accounts. Map embed (a number, not a rendered
map). Price prediction. Multi-device sync (localStorage is per-browser; Sheets export is the manual
bridge). Bundling the whole-US geo table (Bay Area only).

## 8. Decision log (non-obvious choices + rejected alternatives)
- **Offline geo table is the PRIMARY path, Nominatim is the fallback** — not the reverse. *Rejected:*
  geocode everything via Nominatim at runtime (dies offline, hits the 1 req/sec policy, CORS/ToS risk,
  fails criterion #7). The table makes the headline feature free, instant, and network-independent.
- **`effectiveMonthly` always returns a number; `moveInCost` can return null.** *Rejected:* both
  return null on missing data (breaks the cost sort's total order) OR both default to $0 (lies about
  move-in cost). The asymmetry matches what each value can guarantee.
- **No new npm deps; hand-rolled haversine + CSV.** *Rejected:* a geo/csv library (offline/bundle/
  supply-chain cost for ~50 lines of code).
- **`flags` is a sink module** (imports derive/format/distance; nothing imports it but the UI).
  Prevents import cycles and keeps the dependency graph a DAG (contract §"import direction").
- **`leaseFitsTarget` filter and the lease-risk flag both fire only on a definite result** (filter
  requires `true`; flag fires only on `false`) — `null`/unknown lease info is never treated as a fail,
  so we never wrongly hide or red-flag a listing we simply lack data on.

---
### Needs human (PM) sign-off
1. **Flag thresholds** (over-market 1.05×, far-anchor 10 mi / 16 km, stale 30 days). Defensible
   defaults, but they're product judgment — confirm or adjust.
2. **Nominatim remote-geocode path is UNVERIFIED from this planning environment.** The architecture
   doesn't depend on it (offline table is primary), but someone with network access should run the
   one-line probe during build and confirm CORS from the GH Pages origin before the UI advertises
   "address geocoding". If it fails, no redesign — just don't promise the address path.
3. **Geo table coverage** (which counties/neighborhoods to include) is a data-completeness call the
   data-engineer will make against the Census source; PM may want to confirm the 9-county scope.
