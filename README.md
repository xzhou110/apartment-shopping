# Apartment Shopping — shortlist, compare & rank rentals

A single-user dashboard for hunting an apartment: capture each candidate from a screenshot + link,
see auto flags, **rank by distance** from any place you type in (city / ZIP / address), compare
side-by-side, record your rating, and track each listing through a pipeline. Static, free, no backend.

Built for a **6–12 month Bay Area** search, but works anywhere (Bay Area ZIP/city distance is offline;
other places fall back to on-the-fly geocoding). It's the apartment sibling of [`garage`](../garage) (used cars).

**Live:** _not deployed yet_ → will be `https://xzhou110.github.io/apartment-shopping/` (GitHub Pages via
`.github/workflows/deploy.yml`, same as garage). The Google Sheet sync URL is **never** in the bundle (it
lives only in your browser's localStorage), so it's not exposed by the public site.

## Run it
```bash
cd app
npm install        # first time only (already done)
npm run dev        # → http://localhost:5173
```
Other commands (from `app/`): `npm run build` (type-check + production bundle), `npm run preview`,
`npm test` (pure-logic unit tests).

> Data persists in your browser's localStorage (your in-app edits: ratings, status, listings you add).
> The committed seed lives in `app/src/data/apartments.ts` and is the source of truth I edit when you
> send screenshots.

## How you'll use it
1. **Add a listing** — paste me a listing screenshot (+ the URL). I extract rent, beds/baths/sqft, lease
   term, furnished, utilities, amenities, address, etc., **geocode the address** (so distance works),
   and append it to `app/src/data/apartments.ts`. You can also click **+ Add** to enter one by hand, and
   **Edit** any card.
2. **Rank by distance** — type a **city, ZIP, or address** into "Rank by distance from …". Each card then
   shows "≈ X mi to {your place}", and **Sort → Nearest** orders the board by it. Common Bay Area ZIPs and
   cities resolve **instantly and offline** (a bundled Census centroid table — no API key, no cost);
   arbitrary street addresses fall back to a free geocoder and are cached. *Straight-line distance* — fast
   and free; it doesn't account for bridges/traffic (driving time is a future add). Save several places
   (Work, Gym, …) in **Settings** and pick which one is primary.
3. **Triage** — each card shows rent + the cost fields, beds/baths/sqft, the amenity pill row (✓ / ✕ /
   **? = unknown**), a distance chip, and auto **flags** (e.g. lease window doesn't fit, no in-unit
   laundry, over market, broker fee). A colored top border flags overall risk (red) / caution (amber) /
   good (green). A small id badge (e.g. `a2`) on each photo maps the card to the data file / chat
   references — and the search box matches the id.
4. **Filter / sort** — search (title / neighborhood / city / address / id); quick chips (Furnished only,
   Lease fits my target, Hide rejected, Show gone); a filter panel (max rent, min beds, must-have
   amenities); and sorts (Nearest, Rent low→high / high→low, Beds, Sqft, Your rating, Added).
5. **Compare** — tick ≥2 listings → the Compare tab shows them side-by-side and auto-highlights the
   **best (green) / worst (red)** in each row (cheapest rent, nearest, most amenities, biggest sqft).
6. **Rate** — click the **You ★** stars on a card (or in detail) to rate; saves instantly and persists.
   **Expert ★** is my rating.
7. **Track status** — New → Shortlist → Contacted → Toured → Applied → Rejected → **Leased** / **Gone**.
   Marking a listing **Gone** (off market / leased to someone else) hides it; the **Show gone** chip
   brings it back.
8. **Export to Google Sheets** — the **Export** button: **Sync** (push every listing straight into your
   sheet, updated in place), **Copy for Sheets** / **Download CSV** (zero-setup), and **JSON for Claude**
   (paste back to me so I can save your in-app edits into the data file). One-time Sheet setup is the same
   as garage — see that project's README for the Apps Script recipe and the "access = Anyone" gotcha.

## What's tracked (and what's deliberately not)
**Tracked:** rent + all cost fields (deposit, app/broker fees, parking, pet rent, utilities) · beds/baths/
sqft · lease term (+ min/max) · available date · furnished · pet policy · listing type · neighborhood/city/
address (+ geocoded lat/lng) · 10 amenities · your ★ / my ★ · status · photo · source URL · notes.

**Tracked, not computed:** cost fields are shown as plain values for your own comparison — there's no
"total cost"/amortization engine (you asked to keep it simple). Cost ranking is by base **rent**.

**The 10 amenities** (tri-state ✓ / ✕ / **?**): in-unit laundry · parking · A/C · dishwasher · pet-friendly ·
on-site gym · pool · balcony/patio/yard · elevator · EV charging.

## Project layout
```
app/src/
  types.ts             data model (Apartment, Amen, Anchor, Settings, Flag)
  data/                apartments.ts (seed = source of truth) · amenities.ts · sheetCols.ts
  data/geo/            bayAreaGeo.ts (offline ZIP+city centroids) · geocode.ts (anchor resolver)
  lib/                 distance.ts · derive.ts · flags.ts · format.ts · exportSheet.ts  (PURE, unit-tested)
  state/useApartments.ts  listings + settings + filters; localStorage autosave + URL-hash share
  components/          Card · Grid · CompareTable · DetailModal · Filters · ApartmentForm · Export/Settings
docs/                  PRD.md · tech-plan.md · api-contract.md
```
Design rule: all domain logic is pure functions in `lib/*` + `data/*` (no DOM), covered by Vitest; the UI
only formats and renders. The distance feature works **offline** for Bay Area ZIPs/cities by design.
See `docs/` for the full spec and `DECISIONS.md` for the architecture rationale.
