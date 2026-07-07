# PRD — Apartment Shopping

A single-user web app to **capture, compare, and rank apartments** while hunting for a place. The user
sends screenshots + links of listings; Claude extracts the data and appends it to the seed; the user
searches, filters, ranks (including **by distance** from a place they type in), rates, and tracks each
candidate through a pipeline. Static, free, no backend — deployable to GitHub Pages like its sibling `garage`.

This is the apartment adaptation of the **garage** used-car comparator. Read it alongside `garage/README.md`
for the patterns being reused. The frozen data model is `app/src/types.ts`.

> **Original build spec — corrected inline to match what shipped (2026-07-07).** Several items changed after
> planning; see `DECISIONS.md` (ADR-002 cost scope-cut, ADR-007 single 6-mo lease, ADR-009 amenity/availability,
> ADR-010 persistence) and `STATE.md` for the authoritative current state. Key deltas: **no effective-monthly /
> move-in cost engine** (cost fields are tracked, not computed); a single **6-month** lease goal (not 6–12); the
> tracked amenity pills are **parking · balcony · gym** with laundry its own field; no URL-hash share.

## Problem & user
- **User:** xzhou (solo). Hunting a **6-month lease in the Bay Area** right now.
- **Job to be done:** "I see lots of listings across Zillow / Craigslist / Furnished Finder / apartments.com /
  building sites. I want one board where I can dump them, see them side by side, rank by what matters
  (price, real monthly cost, distance from work, amenities), record my take, and not lose track."
- **Why a tool:** browser tabs and spreadsheets lose context (no photos, no flags, no distance, no compare).

## What carries over from garage (reuse as-is, just retyped to `Apartment`)
- Card grid · **Compare** table (auto best/worst highlight) · **Detail** modal · **Add/Edit** form.
- **Search / filter / sort.** Quick chips + a filter panel + a sort dropdown.
- **Your ★ + my ★** ratings (persist instantly), **Status** pipeline, notes, source URL, per-listing photo.
- Auto **flags** engine (risk/warn/info/good) + an overall card signal border.
- **Seed = source of truth** in `data/apartments.ts` (Claude edits it from screenshots); **localStorage**
  overlays the user's in-app state (rating + status + comments) and remembers added/removed listings.
  *(The originally-planned URL-hash share was removed post-launch for data-integrity/security.)*
- **Google Sheets export** (Sync / Copy / CSV / JSON-for-Claude). Light/dark theme. Responsive + a11y baseline.

## What's dropped (car-specific, not useful)
TCO engine, mileage, VIN, drivetrain, engine, fuel, colors, accidents, title status, owners, theft,
service records, warranty. `sellerType` → `listingType` (Property mgmt / Landlord / Sublet / Broker).

## What's new (apartment-specific)
1. **Distance ranking (the headline new feature).**
   - Each **listing** is geocoded at add-time → `lat`/`lng` baked into the seed (done by Claude; no runtime cost).
   - The **anchor** (where to measure from) is entered **at runtime** by the user — a **city, ZIP, or address**
     — in the Filters/Settings UI. Resolved against a **bundled offline Bay Area ZIP+city → lat/lng table**
     (instant, free, no key); fall back to a cached client-side geocode for arbitrary addresses.
   - Distance = **straight-line (haversine)** in the user's unit (default miles). Per-card chip shows
     "≈ X mi to <anchor label>". A **Sort → Nearest** option ranks the board by distance to the primary anchor.
   - Support **multiple named anchors** (Work, Gym, …); one is "primary" and drives the sort + card chip.
2. ~~**Effective monthly cost** + **move-in cost** derives + a "Lowest monthly cost" sort.~~ **Scope-cut
   2026-06-29 (ADR-002):** the app tracks the raw cost fields (rent, parking, pet rent, utilities, deposit,
   app/broker fees) for eyeballing only — it does **not** compute an effective-monthly or move-in total, and
   cost ranking is by base **rent**.
3. **Lease fit** for the **6-month** goal: fields `leaseTermMonths` / `minLeaseMonths` / `maxLeaseMonths` and a
   standing `targetMinLease`/`targetMaxLease` (default **6/6**, a single-point goal — ADR-007) that drive a flag
   when a unit can't meet the window.
4. **Apartment fields:** beds/baths/sqft, furnished, utilities-included, pet policy, available date, neighborhood/city.
5. **Tracked amenities** (tri-state pills): **parking · balcony/patio · gym** (trimmed from the original 10 on
   2026-06-30). **Laundry** is its own first-class field (in-unit/on-site/none/unknown), shown as a separate
   pill; pets live in `petPolicy`; other extras (A/C, dishwasher, pool, elevator, EV…) go in free-text `amenities`.

## Flags (apartment engine — pure, in `lib/flags.ts`)
Adapt garage's pattern. Suggested rules (tech-lead/data-engineer to finalize thresholds):
- **risk:** lease window can't be met (e.g. `minLeaseMonths` > `targetMaxLease`, or unit is long-term only when user wants short).
- **warn:** no in-unit laundry; no parking (when `parking` confirmed absent); rent > `marketRent`×1.05; utilities not included AND no estimate; available date already passed.
- **info:** broker fee present; far from primary anchor (> threshold, only if an anchor is set); listing stale (high `daysOnMarket` = negotiation leverage); rent well below market (verify why). *(The originally-planned "unfurnished for short-term" info flag was removed 2026-07-07 — user brings own furniture; the field + "Furnished only" filter remain.)*
- **good:** in-unit laundry + parking + furnished + within lease window → low-friction short-term fit.

## Acceptance criteria (checkable — QA tests against these; PM signs off against them)
1. **Builds clean:** `npm run build` (tsc --noEmit + vite build) passes with **zero** TS errors; `npm test` green.
2. **Renders:** app loads at the dev URL with **no console errors**, no horizontal overflow, in **both** light and dark themes.
3. **Add a listing:** "Add" form creates an Apartment with the new fields (beds/baths/rent/lease/furnished/amenities/address); it appears in the grid and persists across reload (localStorage).
4. **Edit + rate:** editing a listing and clicking Your ★ both persist across reload. My ★ editable in detail.
5. **Filter:** search matches title/neighborhood/city/id; filter panel includes **max rent**, **min beds**, **furnished**, **lease length fits target**, and **required amenities**; the shown-count updates correctly.
6. **Sort:** sort options include at least **Nearest** (distance), **Rent low→high / high→low**, **Beds**, **Sqft**, **Your rating**, **Expert rating**, **Recently added**. Each reorders the grid correctly. *(The planned "Lowest monthly cost" sort was dropped with the cost scope-cut.)*
7. **Distance works end-to-end:** with ≥1 seed listing that has lat/lng, the user types a Bay Area **ZIP** (e.g. 94103) or **city** (e.g. "Oakland") as an anchor → each card shows a plausible "≈ X mi" chip and **Sort → Nearest** orders by it. A nonsense anchor degrades gracefully (no crash; chips hidden). All offline (no network call for ZIP/city).
8. **Compare:** ticking ≥2 listings → Compare table shows them side by side and highlights best/worst per row (cheapest rent, lowest rent/sqft, nearest, most amenities, biggest sqft).
9. **Status pipeline:** marking a listing **Gone** hides it; a "Show gone" toggle brings it back. Other statuses settable.
10. **Export:** Export dialog offers Copy-for-Sheets / Download-CSV / JSON-for-Claude and (if a Sheet URL is set) Sync; columns reflect the apartment model.
11. **Pure logic is tested:** distance (haversine + offline lookup), lease-fit/flags, and filter/sort have Vitest unit tests that pass.

## Success metrics (post-launch, informal)
User actually dumps real listings in, ranks by distance to their workplace, and uses Compare to make a decision —
replacing the tab/spreadsheet sprawl.

## Non-goals (v1)
- No driving/transit time (straight-line only — noted v2). No live listing scraping/auto-import (user feeds screenshots).
- No backend/auth/accounts (static; per-browser localStorage). No maps embed (a distance number, not a rendered map). No price predictions.

## File lanes (so the two build agents don't collide) — PM owns shared files
- **Shared (PM sets up, agents do NOT touch):** `types.ts` (frozen), `package.json`, `vite.config.ts`,
  `tsconfig.json`, `index.html`, `main.tsx`, `test-setup.ts`, `.github/`, `.gitignore`, README.
- **Data/pure-lib lane → `data-engineer`:** `src/lib/**` (`distance.ts`, `cost.ts`, `flags.ts`, `derive.ts`,
  `format.ts`, + `.test.ts`), `src/data/**` (`apartments.ts` seed, `amenities.ts`, `sheetCols.ts`,
  `geo/bayAreaGeo.ts` offline table + `geocode.ts` resolver), `scripts/` (optional geocode helper).
- **UI lane → `frontend-engineer`:** `src/components/**`, `src/state/useApartments.ts`, `src/App.tsx`,
  `src/styles.css`. Imports types from `types.ts` and pure functions from `lib/*` + `data/*` per the api-contract.

The **api-contract.md** (tech-lead) is the keystone the two lanes share: exact signatures of every `lib/*` and
`data/*` function the UI imports. Freeze it before fan-out.
