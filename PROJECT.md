---
name: apartment-shopping
summary: Single-user Bay Area rental shortlist — capture listings from a link/screenshot, scam-triage, rank by distance, compare, track status; static SPA on GitHub Pages
status: live
live: https://xzhou110.github.io/apartment-shopping/
repo: https://github.com/xzhou110/apartment-shopping
updated: 2026-08-15
---

# Apartment Shopping — shortlist, compare & rank rentals

## 1. Summary
A single-user dashboard for xzhou's **6-month Bay Area rental hunt**: each candidate is captured
from a listing link (or screenshot), auto-flagged (scam / income-restricted / lease-fit / market
price / days-on-market), **ranked by straight-line distance** from an anchor (default ZIP 94030),
compared side-by-side, rated, commented on, and tracked through a status pipeline. Static, free,
no backend; state lives in the browser; export to Google Sheets. It is the apartment sibling of
[`garage`](../garage/PROJECT.md) (used cars) — same architecture, adapted not greenfielded.
**Live and in daily use**; iterating on user requests.

## 2. Key facts
| | |
|---|---|
| **Kind** | web app (static SPA, single user) |
| **Stack** | Vite + React + TypeScript · Vitest (~300 tests) · CSS tokens, light/dark · localStorage |
| **Local path** | `D:\Meaningful\AI\claude_projects\apartment-shopping` (Vite app in `app/`) |
| **Run** | `cd app; npm run dev` → http://localhost:5173 · `npm test` · `npm run build` |
| **Deploy** | push to `main` → `.github/workflows/deploy.yml` → GitHub Pages (a push **is** a deploy) |
| **Data / backends** | Seed listings in `app/src/data/apartments.ts` (a7–a35, hand-curated); offline Bay Area ZIP/city centroids (Census); free Nominatim geocode fallback; Google Sheets sync via the user's own Apps Script (URL in localStorage only). **$0/month.** |
| **Related** | [`garage`](../garage/PROJECT.md) (template it was adapted from) · built with the [`/build` plugin](../claude-marketplace/PROJECT.md) · skills: `web-data-snapshot` (browser-capture recipe), `web-sheets-sync`, `ship-web-app`, `web-ship-check` |
| **Started · last major change** | 2026-06-29 · 2026-07-24 (a35 added) |

## 3. Key things to know
- **Seed = catalog, browser = sticky notes.** `app/src/data/apartments.ts` is the source of truth I edit; the user's ratings / statuses / comments / removals live in *their* browser's localStorage and are overlaid on load (`mergeWithSeed`). Multi-device drift is by design — re-converge by baking the user's "JSON for Claude" export into the seed (apply **only deltas**, preserve comment ids/timestamps verbatim).
- **Ids are stable, never renumbered** (they key the overlay + `public/img/aN.jpg`). Gaps (a7 is the first live id) are retirements. Retiring a seed listing is safe (ADR-010) — **never bump `STORE_KEY`** for removals (it wipes all user state).
- **Adding a listing: a link alone is enough.** Browse the live page in the in-app browser (fee tabs, FAQ, lease menu, the site's own rent comps), geocode the address, grab an **exterior** photo (filenames lie — eyeball a contact sheet), append to the seed. **Scam-triage first and flag a likely scam to the user BEFORE adding** — they skip suspected ones too. `marketRent` = the tightest *honest* comp, or `null` (furnished / AMI-priced / one-offs) — never pick a number to dodge or trigger a flag.
- **Red flags always sort first** (scam > income-restricted > lease-conflict; then the lease verdict leads). When the user says "flag" they mean *my auto-flag system*, not the user-comment feature. Lease goal is a single **6-month** target.
- **Site bot walls:** Zillow arms a PerimeterX "Press & Hold" CAPTCHA if you browse fast — go one page at a time, never solve it, cool off then fall back to user screenshots. apartments.com 403s server-side image fetches → capture via the browser (`web-data-snapshot` → `references/browser-capture.md`). Zillow + Craigslist images fetch fine server-side.
- **`mergeWithSeed` overlays seed listings via a hand-maintained 3-field allowlist** (rating/status/comments) — any *new* per-listing field meant to persist is silently dropped on reload unless added there; tsc won't catch it (ADR-011).
- **Toasts must be popovers:** an open `<dialog>` sits in the browser's top layer and hides z-indexed toasts; DOM assertions still pass, so verify visually.
- The Google Sheet Web-App URL is per-user secret: localStorage only, never in the bundle. Repo is **public**.
- Standing OK to push/deploy after validation (tests + build + live check) — no need to ask each time.

## 4. Details
### How it works
Frozen data model in `types.ts` → **pure, unit-tested domain logic** in `lib/*` and `data/*` (flags,
derive, distance, format, export; no DOM) → a thin React UI that only formats and renders.
`state/useApartments.ts` holds listings + settings + filters, autosaves to localStorage, and merges
the browser overlay onto the seed on load. Distance resolves offline for Bay Area ZIPs/cities and
falls back to Nominatim for arbitrary addresses (cached).
```
app/src/
  types.ts            data model (Apartment, Amen, Anchor, Settings, Flag)
  data/               apartments.ts (seed) · searches.ts (Find-launcher CRITERIA) · amenities.ts · geocode.ts · geo/bayAreaGeo.ts
  lib/                distance · derive · flags · format · exportSheet   (PURE, tested)
  state/              useApartments.ts (overlay merge, persistence, migrations)
  components/         Card · Grid · CompareTable · DetailModal · Filters · ApartmentForm · Find/Export/Settings modals
docs/                 PRD.md · tech-plan.md · api-contract.md · test-report.md · review-findings.md
```

### How to work on it
`cd app; npm install` (once) → `npm run dev` / `npm test` / `npm run build`. Validate every change
in the running app (in-app browser or real Chrome for pixel truth), then commit + push (`main`
auto-deploys) and confirm the live URL serves the new bundle. Standing workflow: user sends links
→ I extract, geocode, triage, append, validate, push. `Find` (header) opens pre-built Zillow /
Apartments.com / Craigslist / FB searches with the criteria baked in (`data/searches.ts`).

### Current state & open items
Live and in daily use. 29 seed listings (a7–a35), curated statuses baked in as of 2026-07-22.
Deferred (accepted): lease-target min/max can't be cleared to null; a 5-digit street number can
mis-resolve as a ZIP; URL-hash share writer not built; GitHub Actions Node-20 deprecation warning.
Detail: [STATE.md](STATE.md).

### Change highlights
- 2026-07-24 — a35 (Chateau Sandel, Belmont) added.
- 2026-07-22 — 4th curation re-bake; in-place comment editing; card comment cap-with-scroll.
- 2026-07-21 — days-on-market flag tiered (30–60 amber, >60 red); San Carlos/Belmont batch; Zillow bot-wall lesson.
- 2026-07-17 — default anchor ZIP 94030 (fresh devices + idempotent migration).
- 2026-07-16 — capture-from-link workflow; apartments.com image unlock; "Ruled out" status + reversible toggles; toast→popover fix.
- 2026-07-15 — income-restricted = first-class red flag; red-first ordering; Find price cap $3,000.
- 2026-06-29/30 — built by `/build` (adapt garage), deployed, real listings replace placeholders.

## 5. Pointers
- [README.md](README.md) — product face: how the user uses every feature (public).
- [docs/PRD.md](docs/PRD.md) · [docs/tech-plan.md](docs/tech-plan.md) · [docs/api-contract.md](docs/api-contract.md) — spec + architecture.
- [DECISIONS.md](DECISIONS.md) — ADR-001…011 (why it is the way it is; ADR-010/011 matter most day to day).
- [STATE.md](STATE.md) — live status + detailed change log · [RUN_LOG.md](RUN_LOG.md) — build log.
- Memory: `apartment-shopping-app.md`, `flag-scam-listings-before-adding.md` (per-project memory; this file supersedes the durable parts).
- Skills: `web-data-snapshot` (browser-capture + bot-wall cheat sheet), `web-sheets-sync`, `web-ship-check`.
