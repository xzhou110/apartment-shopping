# API Contract — Apartment Shopping (FROZEN)

> **SCOPE UPDATE — 2026-06-29 (PM).** The user cut derived/total cost: *"no need to compare total cost
> — I simply keep track of cost for my own compare purpose."* Therefore: **no `lib/cost.ts`, no
> `effectiveMonthly`, no `moveInCost`, no `cost-asc` sort.** Raw cost fields are tracked/displayed/exported
> only; cost ranking is by base **rent**. The affected sections below (§4, §6, §9, §10) reflect this.

> **POST-LAUNCH ADDENDUM — 2026-07-02.** Changes made after the app shipped; where they conflict with the
> body below, this addendum wins (the body is kept as the original build record). See `DECISIONS.md`
> ADR-006/007/008 for rationale.
> - **Amenities trimmed (2026-06-30):** `AmenityKey` was cut from the 10 in §8 to `'parking' | 'gym'`
>   (later `'parking' | 'balcony' | 'gym'` — see the 2026-07-07 addendum). Laundry became its own first-class
>   field `laundry: 'in-unit' | 'on-site' | 'none' | 'unknown'`. `AMENITY_TOTAL = AMENITIES.length + 1` (the +1 is laundry).
> - **New model fields (`types.ts`):** `Apartment.contact: Contact` (company, name, phone, email, website — all
>   `''` = unknown) and `Apartment.comments: Comment[]` (`{ id, text, ts }`). Contact is *listing data* (seed +
>   form). Comments are *user state*: persisted in `apt.v2` and overlaid onto seed listings in `mergeWithSeed`
>   alongside `rating`/`status`. `hydrateApartment` fills defaults for older saves.
> - **Contact links (`lib/format.ts`):** `telHref` (encodes extensions as `;ext=`), `mailtoHref`, `siteHref`
>   (bare domain → https; rejects non-http(s) schemes). Rendered by `components/ContactLinks.tsx`.
> - **Lease target = single 6-mo goal** (`DEFAULT_SETTINGS.targetMinLease = targetMaxLease = 6`, was 6/12).
>   A one-time localStorage migration bumps the exact old default 6/12 → 6/6. `leaseFits`'s formula is unchanged.
> - **Flag rules (§6) updated:** lease-doesn't-fit risk copy is goal-aware and names the stated term; the
>   "stated term at/above max — flex shorter" **warn now only fires for a range goal** (`tMax > tMin`); **new
>   amber warn** when `leaseFits === null` (no lease term stated); **new green good** for month-to-month
>   (shortest term 1 mo, no fixed longer commitment). Persistence key is `apt.v2` (not `apt.v1`).
> - **Export (§9):** contact columns (company, person, phone, email, website) and a `Comments` column added.

> **POST-LAUNCH ADDENDUM — 2026-07-07.** Further changes; where they conflict with the body OR the 2026-07-02
> addendum, **this wins**. See `DECISIONS.md` ADR-009/010.
> - **Amenity set + order:** `AmenityKey = 'parking' | 'balcony' | 'gym'` — three tri-state pills in that order;
>   §8's 10-item table is fully superseded. `laundry` stays its own field, rendered as a pill BEFORE the amenity
>   pills. `AMENITY_TOTAL = AMENITIES.length + 1`.
> - **New field `Apartment.availability: 'now' | 'unavailable' | 'unknown'`** (sits behind `availableDate`).
>   `availabilityLabel(apt)` (`lib/format`) shows a valid date when stated, else "Now" / "Unavailable — ask" / ''.
>   New amber warn when `availability === 'unavailable'` AND no valid date (rolling-availability communities).
> - **`leaseSummary(apt)` and `isMonthToMonth(apt)` now live in `lib/derive`** (leaseSummary moved from
>   `lib/format`). `leaseSummary` renders friendly labels: Month-to-month / Flexible (1–N mo) / Short-term (N mo) /
>   N mo / N–M mo / N+ mo / ≤N mo. Consumed by card / detail / compare / export.
> - **Flag order (§6) is no longer strict severity order:** the hand-set **scam-risk** flag (`apt.scamRisk`) is
>   pushed first as an absolute override, then the **lease-term flag whatever its level** (the "doesn't fit" risk,
>   the amber "not stated" warn, or the green month-to-month good), then the remaining warn → info → good. The
>   card previews only 3 flags, so the lease verdict is always visible. `signalLevel`'s risk>warn>good>'' collapse is unchanged.
> - **Flag rules (§6) changed:** the old "No in-unit laundry" warn is now **`apt.laundry === 'none'`** →
>   "No laundry — none in-unit or on-site." (there is no `inUnitLaundry` amenity). The **"Unfurnished for
>   short-term" info flag was REMOVED** (the `furnished` field + "Furnished only" filter chip remain).
> - **Export (§9):** SHEET_COLS emits **3** amenity columns (Parking, Balcony / patio, On-site gym), not 10; plus a
>   **Laundry** column after Floor and a **Scam risk** column between Expert rating and Your rating. Lease term
>   exports the friendly `leaseSummary` label; Available exports the date or the availability status.
> - **Persistence (`state/useApartments.ts`):** `mergeWithSeed` resurrects a saved-not-in-seed listing only when
>   `looksUserAdded(id)` (`/^a\d{5,}$/` — a timestamp id from `'a'+Date.now()`; seed ids are short). So retiring a
>   seed listing no longer ghost-resurrects it and needs **no `STORE_KEY` bump** (which would wipe user state).
>   STORE_KEY stays `apt.v2`. (ADR-010.)
> - **Lease-fit default:** `DEFAULT_SETTINGS.targetMinLease = targetMaxLease = 6` — the §5 `leaseFits`
>   doc-comment "defaults 6 / 12" is superseded.
> - **Seed inventory:** 11 listings, ids **a6–a16** (a3/a4/a5 retired 2026-07-07; a1/a2 were earlier placeholders).

This is the **keystone seam** between the two build lanes. The **data/pure-lib lane**
(`data-engineer`) implements every signature below; the **UI lane** (`frontend-engineer`)
imports them. Both lanes import data shapes from the frozen `app/src/types.ts`.

**Rules of the contract**
- All domain logic is **pure functions** in `lib/*` / `data/*`. No DOM, no React, no I/O
  (the one exception: `data/geocode.ts` reads/writes `localStorage` and does `fetch` in its
  async fallback only — its sync surface is pure).
- **No new npm dependencies.** Everything is hand-rolled TS so the app stays static/offline.
- Signatures here are FROZEN. If a signature is genuinely impossible, raise it with the PM —
  do not silently diverge, or the lanes will fail to integrate.
- `null` semantics are spelled out per function. "Unknown" data must never silently become a
  real value (e.g. a missing rent is not `$0` for ranking; a missing coord hides distance).

Conventions used below:
- `Coord = { lat: number; lng: number }` (a local alias, not exported from types; define it in
  `lib/distance.ts` and re-import where needed, OR inline the shape — implementer's choice, but
  keep the field names `lat`/`lng`).
- "em-dash" = the string `"—"` (U+2014), the project's null-display token (ported from garage).

---

## 1. `lib/distance.ts` — haversine + apartment distance + formatter

```ts
import type { Apartment } from '../types';

export interface Coord { lat: number; lng: number }

/**
 * Great-circle (haversine) distance between two coordinates.
 * @param unit 'mi' (default) | 'km'. Returns a non-negative number; 0 for identical points.
 * Pure, no rounding (callers round for display).
 */
export function haversine(a: Coord, b: Coord, unit?: 'mi' | 'km'): number;

/**
 * Straight-line distance from an apartment to an anchor coord, in `unit`.
 * Returns null if the apartment has no lat/lng (either is null) OR anchor is null.
 * This null is the signal the UI uses to HIDE the distance chip — never render a bogus number.
 */
export function distanceToAnchor(
  apt: Apartment,
  anchor: Coord | null,
  unit?: 'mi' | 'km',
): number | null;

/**
 * Display string for a distance value: "≈ 3.2 mi" / "≈ 5.0 km".
 * One decimal place. null / undefined → em-dash "—".
 * `unit` defaults to 'mi'.
 */
export function formatDistance(d: number | null | undefined, unit?: 'mi' | 'km'): string;
```

Notes:
- Earth radius constants: `3958.7613 mi` / `6371.0088 km`.
- `distanceToAnchor` is what `applySort` (UI lane) calls for the **Nearest** sort and what the
  Card calls for the per-card chip. It must accept the **already-resolved** anchor coord — the
  UI resolves the anchor once (via `data/geocode.ts`) and passes the coord down; distance fns
  never do resolution themselves.

---

## 2. `data/geo/bayAreaGeo.ts` — the offline table

The bundled, network-free lookup table that makes the headline feature work with **no network**
for common Bay Area ZIPs and cities (acceptance criterion #7).

```ts
/** ZIP code (5-digit string) → [lat, lng] centroid. */
export const BAY_AREA_ZIPS: Readonly<Record<string, readonly [number, number]>>;

/** Normalized city name (see normalization rules) → [lat, lng] centroid. */
export const BAY_AREA_CITIES: Readonly<Record<string, readonly [number, number]>>;
```

Shape & sourcing:
- **Keys:** ZIP keys are the bare 5-digit string (`"94103"`). City keys are the **normalized**
  city name (lowercased, trimmed, punctuation collapsed; no state suffix) — e.g. `"san francisco"`,
  `"oakland"`, `"south san francisco"`, `"palo alto"`.
- **Values:** `[lat, lng]` tuple (decimal degrees, WGS84), ~4 decimal places is plenty.
- **Coverage target:** the 9-county Bay Area. Aim for **~250–400 ZIP centroids** (all SF /
  Alameda / San Mateo / Santa Clara / Contra Costa / Marin ZIPs, plus the populous parts of
  Sonoma / Napa / Solano) and **~80–120 city/neighborhood keys** (every incorporated city plus
  common SF/Oakland/San Jose neighborhood names the user is likely to type: "hayes valley",
  "mission", "soma", "rockridge", etc. — neighborhoods map to their city/area centroid).
- **Source:** US Census ZCTA gazetteer centroids (public domain) for ZIPs; GeoNames / Census
  place centroids for cities. The `data-engineer` may hand-curate from these — it is a static,
  bundled data file, generated once. An optional `scripts/buildGeo.*` helper may emit it, but the
  committed artifact is the `.ts` file (no build-time fetch in the app).
- **Size budget:** ~400 ZIP + ~120 city entries ≈ 15–25 KB of source; trivially bundled. Do not
  ship the whole US.

---

## 3. `data/geocode.ts` — anchor resolver (offline-first, cached remote fallback)

```ts
import type { Coord } from '../lib/distance';

/**
 * Resolve a user-typed anchor query to a coordinate, SYNC and OFFLINE.
 * Tries, in order: (1) ZIP match, (2) exact normalized-city match, (3) cached remote result
 * (a previous geocodeRemote write in localStorage). Returns null if none hit — the UI then may
 * call geocodeRemote() to fill the cache. NEVER throws; NEVER does network I/O.
 *
 * Normalization applied to `query` before matching:
 *  - trim, collapse internal whitespace, lowercase
 *  - strip a trailing state token: ", ca" / " ca" / ", california" / " california"
 *  - strip a trailing USA/US token
 *  - ZIP detection: if the query (after a comma/space split) contains a 5-digit run, that ZIP
 *    is tried first against BAY_AREA_ZIPS (so "94103" and "SF, 94103" both resolve by ZIP).
 *  - city match is the fully-normalized string against BAY_AREA_CITIES keys.
 */
export function resolveAnchor(query: string): Coord | null;

/**
 * Async fallback for queries not in the offline table (arbitrary street addresses).
 * Calls Nominatim (https://nominatim.openstreetmap.org/search?format=json&limit=1&q=...),
 * returns {lat,lng} of the first result or null. On ANY failure (network/CORS/HTTP/empty/parse)
 * returns null — never throws. On success it WRITES the result into the localStorage cache
 * (key namespace below) so the next resolveAnchor() call for the same normalized query is
 * instant and offline. Sets a descriptive User-Agent/Referer per Nominatim usage policy.
 * Must be called at most ~1/sec by the UI (debounce on blur/submit, not per keystroke).
 */
export function geocodeRemote(query: string): Promise<Coord | null>;

/** Optional helpers the UI may use; implementer may keep them internal instead. */
export function normalizeQuery(query: string): string;        // the normalization above
export function cacheGet(query: string): Coord | null;        // localStorage read
export function cacheSet(query: string, c: Coord): void;      // localStorage write
```

Cache:
- localStorage key: **`apt.geocache`** — a JSON object `{ [normalizedQuery: string]: [lat, lng] }`.
  This is SEPARATE from the app data namespace `apt.v2` so clearing app data does not nuke the
  geocode cache and vice-versa. Resolver writes are best-effort (wrap in try/catch; quota/private
  mode is non-fatal).

**Resolver flow (the UI implements this orchestration; the lib provides the pieces):**
1. On anchor save, call `resolveAnchor(query)`.
2. If non-null → store `{lat,lng}` onto the `Anchor` and you're done (offline path, criterion #7).
3. If null → optionally call `geocodeRemote(query)`; on success store the coord on the Anchor; on
   null leave `Anchor.lat/lng = null` (distance chips hide, sort falls back — graceful, no crash).

---

## 4. Cost fields — TRACKED, NOT COMPUTED (scope cut 2026-06-29)

**There is NO `lib/cost.ts`.** Do not build `effectiveMonthly` or `moveInCost` or any derived/total/
amortized cost. Per the user: *"no need to compare total cost — I simply keep track of cost for my own
compare purpose."*

The raw cost fields on `Apartment` — `rent`, `parkingCost`, `petRent`, `utilitiesIncluded`,
`utilitiesEstimate`, `deposit`, `appFee`, `brokerFee` — are:
- captured in the Add/Edit form,
- shown on the card / detail / compare table (as plain values the user eyeballs),
- included as columns in the Sheets export.

Cost **ranking** is by base **`rent`** only (`rent-asc` / `rent-desc`). The compare table highlights the
**lowest `rent`** in the rent row (no computed total). No cost test file is needed.

---

## 5. `lib/derive.ts` — other derives the UI needs

```ts
import type { Apartment, Settings } from '../types';

/**
 * Rent per square foot. null if sqft is null or 0 (can't divide). Two decimals.
 * Uses base rent (not effective monthly) — it's a sticker/size metric.
 */
export function pricePerSqft(apt: Apartment): number | null;

/**
 * Does this listing's lease window overlap the user's target window?
 * Uses Settings.targetMinLease / targetMaxLease (defaults 6 / 12).
 * Returns:
 *   true  — the listing can be signed for SOME term within [targetMin, targetMax].
 *   false — it cannot (its allowable range is entirely outside the target window).
 *   null  — not enough lease info on the listing to decide (see below).
 *
 * Listing's allowable range is derived as:
 *   lo = minLeaseMonths ?? leaseTermMonths ?? null
 *   hi = maxLeaseMonths ?? leaseTermMonths ?? null
 * If both lo and hi are null → return null (unknown).
 * If only one bound is known, treat the unknown side as open (lo→0, hi→Infinity) for the
 * overlap test (we only claim "false" when we're sure it can't fit).
 * Target bounds: tMin = targetMinLease ?? 0, tMax = targetMaxLease ?? Infinity.
 * Fit = (lo ?? 0) <= tMax && (hi ?? Infinity) >= tMin.
 */
export function leaseFits(apt: Apartment, settings: Settings): boolean | null;

/**
 * Count of amenities the listing definitively HAS ('yes' via amenState, honoring AMENITY_IMPLIES).
 * Drives the "most amenities" compare-row highlight. (Implemented here or re-exported from format;
 * keep ONE implementation that calls amenState so implications hold everywhere.)
 */
export function amenCount(apt: Apartment): number;
```

---

## 6. `lib/flags.ts` — flag engine + overall signal

```ts
import type { Apartment, Flag, SignalLevel, Settings } from '../types';
import type { Coord } from './distance';

/** Context the flag engine needs beyond the apartment itself. */
export interface FlagCtx {
  settings: Settings;          // for targetMinLease / targetMaxLease / distanceUnit
  primaryAnchor: Coord | null; // resolved coord of the PRIMARY anchor (null if none set/unresolved)
  today?: string;              // ISO date, INJECTABLE for deterministic tests (default: new Date())
}

/**
 * Risk / warn / info / good flags for one apartment. PURE: no DOM, no Date.now() except via
 * the injectable ctx.today. Order: risk first, then warn, info, good (push in this order).
 */
export function getFlags(apt: Apartment, ctx: FlagCtx): Flag[];

/**
 * Overall card signal, mirroring garage's rule:
 *   risk if any risk → warn if any warn → good if any good → '' otherwise.
 * (garage escalates on >=2 warn OR any warn, which is equivalent to "any warn"; keep that.)
 */
export function signalLevel(apt: Apartment, ctx: FlagCtx): SignalLevel;
```

### Concrete flag rules (finalize these thresholds — derived from the PRD)

Push in this exact order so the card's first-3 preview shows the most severe first.

**risk**
- **Lease window can't be met:** `leaseFits(apt, ctx.settings) === false`
  → "Lease window doesn't fit your {targetMin}–{targetMax} mo goal."
  (Implement via `leaseFits` so the logic lives in one place. Only fires on a definite `false`,
  never on `null`.)

**warn**
- **No in-unit laundry:** `amenState(apt,'inUnitLaundry') === 'no'`
  → "No in-unit laundry."
- **Parking confirmed absent:** `amenState(apt,'parking') === 'no'`
  → "No parking."
- **Over market:** `marketRent != null && rent > marketRent * 1.05`
  → "Rent ~{money(rent - marketRent)} over comparable market."
- **Utilities not included:** `utilitiesIncluded === false`
  → "Utilities not included — budget extra on top of rent."
- **Available date passed:** `availableDate` is a valid ISO date strictly before `ctx.today`
  → "Listed available date has passed — confirm it's still open."

**info**
- **Unfurnished for short-term:** `furnished === false && (ctx.settings.targetMaxLease ?? 0) <= 12`
  → "Unfurnished — extra setup cost for a short stay."
  (User's default target is 6–12 mo, so short-term is the default lens.)
- **Broker fee present:** `brokerFee != null && brokerFee > 0`
  → "Broker fee {money(brokerFee)} — one-time, non-refundable."
- **Far from primary anchor:** `ctx.primaryAnchor != null` AND `distanceToAnchor(apt, primary, unit)`
  exceeds the far threshold → "≈ {dist} from your primary place — farther than most."
  Threshold: **> 10 mi** (or **> 16 km** when unit is km). Only fires when an anchor is set AND
  the apartment has coords (distance non-null).
- **Stale listing:** `daysOnMarket != null && daysOnMarket >= 30`
  → "On market {daysOnMarket} days — possible negotiation leverage."
- **Well below market:** `marketRent != null && rent < marketRent * 0.85`
  → "Rent well below market — verify why (condition, fees, fine print)."

**good**
- **Low-friction short-term fit:** in-unit laundry `=== 'yes'` AND parking `=== 'yes'` AND
  `furnished === true` AND `leaseFits(apt, settings) === true`
  → "Furnished, in-unit laundry, parking, fits your lease window — low-friction short stay."

Helpers the engine uses: `amenState` (from `lib/format`), `leaseFits` (from `lib/derive`),
`distanceToAnchor` (from `lib/distance`), `money` (from `lib/format`), `formatDistance` (distance).
Keep cross-module imports one-directional: `flags` may import `derive`/`format`/`distance`;
those must NOT import `flags`.

---

## 7. `lib/format.ts` — tri-state amenity + money/number formatters

```ts
import type { Apartment, AmenityKey, AmenState } from '../types';

/**
 * Tri-state for an amenity: 'yes' | 'no' | 'unk'. 'unk' must NEVER collapse to 'no'.
 * Honors AMENITY_IMPLIES (data/amenities.ts): if a stronger amenity that implies `key`
 * is true, this returns 'yes' even if `key` itself is unset. (Mirror garage's featState.)
 * Reads apt.amen[key]: true→'yes', false→'no', null/undefined→'unk' (unless implied).
 */
export function amenState(apt: Apartment, key: AmenityKey): AmenState;

/** "$2,750" — em-dash for null/undefined. 0 renders as "$0". (Ported verbatim from garage.) */
export function money(n: number | null | undefined): string;

/** "1,150" with thousands separators — em-dash for null/undefined. 0 renders "0". */
export function num(n: number | null | undefined): string;

/** Plain-text tri-state for export cells: 'yes'→"Yes", 'no'→"No", 'unk'→"?". */
export function yn(state: AmenState): string;

/** 0–5 rating as filled/empty stars "★★★★☆" (ported from garage). */
export function stars(n: number): string;

/** "Studio" when beds === 0, else "{beds} bd" — small helper for cards/compare (optional). */
export function bedsLabel(beds: number): string;
```

---

## 8. `data/amenities.ts` — amenity catalog + implications

```ts
import type { AmenityKey } from '../types';

/** [key, shortLabel, longLabel] in display order — drives card pills, detail, compare, export. */
export const AMENITIES: ReadonlyArray<readonly [AmenityKey, string, string]>;

/** One-way subsumption: having KEY implies each listed amenity is present too. */
export const AMENITY_IMPLIES: Partial<Record<AmenityKey, readonly AmenityKey[]>>;
```

Required `AMENITIES` order (matches the frozen `AmenityKey` order in types.ts):
```
['inUnitLaundry',  'Laundry',   'In-unit laundry']
['parking',        'Parking',   'Parking']
['airConditioning','A/C',       'Air conditioning']
['dishwasher',     'Dishwasher','Dishwasher']
['petFriendly',    'Pets OK',   'Pet-friendly']
['gym',            'Gym',       'On-site gym']
['pool',           'Pool',      'Pool']
['outdoorSpace',   'Outdoor',   'Balcony / patio / yard']
['elevator',       'Elevator',  'Elevator']
['evCharging',     'EV',        'EV charging']
```
`AMENITY_IMPLIES`: ship as `{}` (no obvious one-way subsumption among these; gym does NOT imply
pool, etc.). Keep the mechanism wired so a future implication is a one-line data change.
**Cross-check `petFriendly` against `Apartment.petPolicy`** in the form/data layer (a "No pets"
policy should set `petFriendly:false`), but the contract treats `amen.petFriendly` as the tri-state
source of truth for the pill.

---

## 9. `data/sheetCols.ts` — export column builder

```ts
import type { SheetCol, Settings } from '../types';

/** Export/spreadsheet column order. [title, accessor]. First export row = titles; one row per apt. */
export function buildSheetCols(settings: Settings): SheetCol[];

/** Default columns (default Settings). In-app exports rebuild with the user's settings. */
export const SHEET_COLS: SheetCol[];
```

Column order (apartment model; mirror garage's `buildSheetCols` structure — derived values via the
lib fns, all 10 amenities as Yes/No/? via `amenState`):
```
Status, ID, Title, Address, Neighborhood, City,
Beds, Baths, Sqft, Floor,
Rent, Parking cost, Pet rent, Utilities incl, Utilities est,
Deposit, App fee, Broker fee,
Lease term, Min lease, Max lease, Available, Furnished,
Pet policy, Listing type,
Days on market, Market rent, Rent/sqft (pricePerSqft),
Expert rating, Your rating,
...10 amenities (longLabel → Yes/No/? via amenState),
Other amenities (amenities.join('; ')),
Notes, Listing URL
```
Notes:
- `buildSheetCols` takes `Settings` for parity/forward-compat (e.g. to title a column with the
  lease target) even if v1 doesn't vary columns by settings. Keep the param.
- `exportSheet.ts` (sheetMatrix/toTSV/toCSV/toJSON) is ported verbatim from garage and consumes
  `buildSheetCols`; it lives in `lib/` and is part of this contract by reference (same signatures,
  `Car`→`Apartment`).

---

## 10. The filter / sort contract (UI lane consumes these lib fns)

`applyFilters` and `applySort` LIVE IN THE UI LANE (`components/helpers.tsx`) — they are NOT in the
contract as lib functions. But they CALL the lib functions above, and they depend on these two
shapes which the UI lane owns in `state/useApartments.ts`. They are pinned here so both lanes agree.

### `SortKey` union (must include at least all of these)
```ts
export type SortKey =
  | 'nearest'    // distanceToAnchor(apt, primaryAnchorCoord, unit) ascending; nulls sink to the end
  | 'rent-asc'   // base rent ascending
  | 'rent-desc'  // base rent descending
  | 'beds-desc'  // beds descending
  | 'sqft-desc'  // sqft descending (nulls sink)
  | 'you-desc'   // your rating descending
  | 'added';     // insertion order (no sort)
```
Default sort: `'added'` (or `'nearest'` once an anchor is set — UI's call; both are valid).

### `Filters` shape
```ts
export interface Filters {
  search: string;            // matches title / neighborhood / city / id (and address) — substring, case-insensitive
  maxRent: number | null;    // hide rent > maxRent
  minBeds: number | null;    // hide beds < minBeds (0 = studio counts)
  furnishedOnly: boolean;    // when true, require furnished === true
  leaseFitsTarget: boolean;  // when true, require leaseFits(apt, settings) === true (drops false AND null)
  reqAmenities: AmenityKey[];// each must be amenState === 'yes' (honors implications)
  hideRejected: boolean;     // when true, drop status === 'Rejected'
  showGone: boolean;         // when false (default), drop status === 'Gone'
  sort: SortKey;
}
```

### What `applySort` needs passed in (PIN THIS — it's the integration trap)
`applySort` is NOT pure-over-`apt`-alone: the **Nearest** sort needs extra context (the resolved anchor).
The UI MUST pass it explicitly so sort stays a function of its inputs:
```ts
// signature the UI lane implements in helpers.tsx
function applySort(
  apts: Apartment[],
  sort: SortKey,
  ctx: { primaryAnchor: Coord | null; unit: 'mi' | 'km'; settings: Settings },
): Apartment[];
```
- `nearest` → `(a,b) => (distanceToAnchor(a, ctx.primaryAnchor, ctx.unit) ?? Infinity) - (… b …)`.
  When `primaryAnchor` is null, every distance is null → all `Infinity` → stable (no reorder);
  this is the graceful-degrade path (criterion #7's "nonsense anchor").
- `rent-asc/desc`, `beds-desc`, `sqft-desc` (nulls → sink with `?? -Infinity` for desc), `you-desc`,
  `added` (return input order).

### What `applyFilters` needs passed in
```ts
function applyFilters(
  apts: Apartment[],
  f: Filters,
  settings: Settings,   // needed for leaseFitsTarget → leaseFits(apt, settings)
): Apartment[];
```
- `search` builds a haystack of `id title neighborhood city address` (+ free-text `amenities`),
  lowercased, substring-tested.
- `reqAmenities` uses `amenState(apt,k) === 'yes'` (NOT raw `apt.amen[k]`) so implications hold.
- `leaseFitsTarget` requires `leaseFits(apt, settings) === true` (a `null`/unknown does NOT pass —
  the filter is opt-in and conservative).

---

## Cross-module import direction (enforce to avoid cycles)
```
types.ts            (leaf — imported by everything)
data/geo/bayAreaGeo.ts   (leaf data)
data/amenities.ts        (leaf data)
lib/distance.ts     → types
data/geocode.ts     → distance (Coord), data/geo
lib/format.ts       → types, data/amenities
lib/derive.ts       → types, format (amenState for amenCount)
lib/flags.ts        → types, derive, format, distance      (flags is a SINK; nothing imports it but UI)
data/sheetCols.ts   → types, data/amenities, lib/derive, lib/format
lib/exportSheet.ts  → types, data/sheetCols
UI (helpers/components/hook) → ALL of the above + types
```
No module above the line imports a module below it. `flags` and the UI are the only sinks.
