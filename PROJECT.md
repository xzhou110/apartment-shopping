---
name: apartment-shopping
summary: Single-user Bay Area rental shortlist — capture listings from a link/screenshot, scam-triage, rank by distance, compare, track status; static SPA on GitHub Pages
status: live
live: https://xzhou110.github.io/apartment-shopping/
repo: https://github.com/xzhou110/apartment-shopping
updated: 2026-10-21
category: products
---

# Apartment Shopping — shortlist, compare & rank rentals

## 1. Summary
A single-user dashboard for xzhou's **6-month Bay Area rental hunt**: each candidate is captured
from a listing link (or screenshot), auto-flagged (scam / income-restricted / lease-fit / market
price / days-on-market), **ranked by straight-line distance** from an anchor (default ZIP 94030),
compared side-by-side, rated, commented on, and tracked through a status pipeline. Static, free,
no backend; state lives in the browser; export to Google Sheets. It is the apartment sibling of
[`car-shopping`](../car-shopping/PROJECT.md) (used cars) — same architecture, adapted not greenfielded.
**Live and in daily use**; iterating on user requests.

## 2. Key facts
| | |
|---|---|
| **Kind** | web app (static SPA, single user) |
| **Stack** | Vite + React + TypeScript · Vitest (300 tests) · ESLint (the standard's boundary and size rules, `app/eslint.config.js`) · CSS tokens, light/dark · localStorage |
| **Local path** | `D:\Meaningful\AI\apartment-shopping` (Vite app in `app/`) |
| **Run** | `cd app; npm run dev` → http://localhost:5180 (`server.port` in `vite.config.ts`) · `npm run check` (= lint, typecheck, tests, build; the validation for any change) · `npm test` · `npm run lint` · `npm run build` |
| **Deploy** | push to `main` → `.github/workflows/deploy.yml`: `check` job (`npm run check`) → `build` → GitHub Pages (a push **is** a deploy, once the gate is green); `check.yml` runs the same gate on every other branch and pull request (ADR-012) |
| **Data / backends** | Seed listings in `app/src/data/apartments.ts` (a7–a35, hand-curated); offline Bay Area ZIP/city centroids (Census); free Nominatim geocode fallback; Google Sheets sync via the user's own Apps Script (URL in localStorage only). **$0/month.** |
| **Related** | [`car-shopping`](../car-shopping/PROJECT.md) (template it was adapted from) · built with the [`/build` plugin](../claude-marketplace/PROJECT.md) · skills: `web-data-snapshot` (browser-capture recipe), `web-sheets-sync`, `ship-web-app`, `web-ship-check` |
| **Started · last major change** | 2026-06-29 · 2026-07-24 (a35 added) |

## 3. Key things to know
- **Seed = catalog, browser = sticky notes.** `app/src/data/apartments.ts` is the source of truth I edit; the user's ratings / statuses / comments / removals live in *their* browser's localStorage and are overlaid on load (`mergeWithSeed`). Multi-device drift is by design — re-converge by baking the user's "JSON for Claude" export into the seed (apply **only deltas**, preserve comment ids/timestamps verbatim). The user's in-app **Remove** clicks are the durable truth for their own browser; a seed edit only changes the deployed baseline / fresh devices.
- **"Outdated list on the phone" = the overlay gap, not stale code** (no service worker; Pages caches 10 min). Litmus: search the newest seed id on the phone — if it is there, the PC's curation simply never travelled. Fix = re-bake the export (baked comments then ship in the public bundle, like notes); a Supabase overlay-sync backend is the accepted v2 path if phone curation becomes a habit.
- **Ids are stable, never renumbered** (they key the overlay + `public/img/aN.*`). Gaps (a7 is the first live id) are retirements. Retiring a seed listing is safe (ADR-010: `mergeWithSeed` resurrects a saved-but-unseeded listing only when `looksUserAdded`, i.e. a timestamp id `^a\d{5,}$`) — **never bump `STORE_KEY`** for removals (it wipes all user state; a bump is only for a deliberate full reset).
- **Adding a listing: a link alone is enough.** Browse the live page in the in-app browser (fee tabs, FAQ, lease menu, the site's own rent comps), geocode the address, grab an **exterior** photo (filenames lie — eyeball a contact sheet), append to the seed (`image: ''` gives a card placeholder when there is no photo). Screenshots remain the fallback for login-walled pages. `marketRent` = the tightest *honest* comp, or `null` (furnished / AMI-priced / one-offs) — never pick a number to dodge or trigger a flag.
- **Scam triage is part of every add — flag a likely scam to the user BEFORE adding and get a decision; never add it quietly with a buried warning note.** The user triages real listings to contact, so a tracked scam still costs attention, and they remove *suspected* scams, not just confirmed ones. Assess price-vs-market plus the tells in §4 Domain rules; likely scam → reply with the red flags and ask add / skip; legit → add normally, noting caveats. Rate honestly (1 = blatant/confirmed scam, 2 = strong signals / verify, 4 = looks legit); don't rubber-stamp.
- **Red flags always sort first** (scam > income-restricted > lease-conflict; then the lease verdict leads). The two hand-set red gates are `scamRisk` and `incomeRestricted` (form checkboxes; specifics go in `notes`). When the user says "flag" they mean *my auto-flag system*, not the user-comment feature. Lease goal is a single **6-month** target.
- **Site bot walls:** Zillow arms a PerimeterX "Press & Hold" CAPTCHA if you browse fast — go one page at a time, never solve it, cool off then fall back to user screenshots. apartments.com 403s server-side image fetches → capture via the browser (`web-data-snapshot` → `references/browser-capture.md`). Zillow + Craigslist images fetch fine server-side.
- **`mergeWithSeed` overlays seed listings via a hand-maintained 3-field allowlist** (rating/status/comments) — any *new* per-listing field meant to persist is silently dropped on reload unless added there; tsc won't catch it (ADR-011). The same seam means form edits to a seed listing's *other* fields (contact, rent…) don't persist — update the seed file instead. Any new **required** `Apartment` field must also land in every seed, `lib/_fixtures.ts` `makeApt` and `DEFAULT_APARTMENT` (`state/useApartments.ts`), or tsc breaks.
- **Toasts must be popovers:** an open `<dialog>` sits in the browser's top layer and hides z-indexed toasts; DOM assertions still pass, so verify visually (mechanics: ADR-011 + `App.tsx`).
- **No total-cost engine** (ADR-002): rent / deposit / fees / parking / pet / utilities are tracked for eyeballing only; ranking is by plain rent, distance or rating. Don't add amortization or a composite score.
- **No scraping.** Craigslist 403s automated fetches (and blocks datacenter IPs harder), Facebook Marketplace is login-walled, Zillow and Apartments.com 403 automated verification — so search is the semi-auto **Find** launcher in the user's own browser (§4). A paid scraper cron and a local Playwright crawler were offered and declined; revisit only if the skim gets too heavy.
- **The distance anchor is set only in Settings → Distance anchors** (plus the "Nearest first" sort); the inline "Rank by distance from" bar was removed as redundant — don't re-add it (`.anchor-bar` in `styles.css` is dead CSS).
- **Days-on-market tiers** (`lib/flags.ts`): under 30 days nothing, 30 to 60 amber, over 60 red. A red means "confirm it is really available" before touring: a long-listed rental is usually an evergreen relisted ad or a unit that will not rent (the 488-day Zillow listing).
- **Card comments show the full note**: `white-space: pre-wrap` plus word-break, never a line clamp or an ellipsis (a `-webkit-box` clamp also flattened multi-line notes); rows stay even through `max-height` + `overflow-y: auto` on the card, and the detail view is uncapped. Same rule in car-shopping, which shares the card.
- The Google Sheet Web-App URL is per-user secret: localStorage only, never in the bundle. Repo is **public**.
- Standing OK to push/deploy after validation (tests + build + live check) — no need to ask each time.

## 4. Details
### How it works
Frozen data model in `types.ts` → **pure, unit-tested domain logic** in `lib/*` and `data/*` (flags,
derive, distance, format, export; no DOM) → a thin React UI that only formats and renders.
`state/useApartments.ts` holds listings + settings + filters, autosaves to localStorage, and merges
the browser overlay onto the seed on load. Distance resolves offline for Bay Area ZIPs/cities and
falls back to Nominatim for arbitrary addresses (cached, `data/geocode.ts`); it is straight-line only —
driving time is a declared v2 (ADR-003).
```
app/src/
  types.ts            data model (Apartment, Amen, Anchor, Settings, Flag)
  data/               apartments.ts (seed) · searches.ts (Find-launcher CRITERIA) · amenities.ts · geocode.ts · geo/bayAreaGeo.ts
  lib/                distance · derive · flags · format · exportSheet   (PURE, tested)
  state/              useApartments.ts (overlay merge, persistence, migrations)
  components/         Card · Grid · CompareTable · DetailModal · Filters · ApartmentForm · Find/Export/Settings modals
docs/                 PRD.md · tech-plan.md · api-contract.md · test-report.md · review-findings.md
```
Skeleton aliases for the engineering standard (`D:/Meaningful/AI/agent-skills/rules/engineering-principles.md`):
`lib/` = engine (pure; the lint forbids framework, I/O and upward imports there), `components/` = ui,
`state/` = the hook that owns storage, the overlay merge and migrations (no adapters folder),
`App.tsx` + `main.tsx` = the app shell.

### Data model decisions
- **Laundry is its own field** (`laundry: LaundryType` = in-unit / on-site / none / unknown), not a tri-state amenity — in-unit vs on-site is a real distinction. It still counts in the card's "X/N" tally: `AMENITY_TOTAL = AMENITIES.length + 1` and `amenCount` in `lib/derive.ts`; flags warn on `none`, and the "low-friction" good flag needs `in-unit`.
- **Tracked tri-state amenities** (`AmenityKey` in `types.ts`, catalog in `data/amenities.ts`): parking, woodenFloor, balcony, gym; pill order = laundry first, then that list. Every consumer (card, detail, compare, form, export, filters) iterates `AMENITIES`, so adding one = those two files + tests. Seeds may leave one unset (shows "?") — never fabricate. Pets → `petPolicy`; one-offs (A/C, EV, deck) → free-text `amenities[]`, exported as "Other amenities".
- **Red gates** (`lib/flags.ts`): `scamRisk` pushes "Possible scam — verify the listing before you contact or pay." first; `incomeRestricted` pushes "Income-restricted — you must income-qualify to rent…" next (a20 and a24 today). Both are export columns ("Scam risk", "Income-restricted"). No current seed has `scamRisk` true — scams are flagged before adding and skipped.
- **Availability:** a *valid* `availableDate` (the `shortDate()` predicate, used everywhere) always wins; otherwise `availability` = now / unavailable / unknown → `availabilityLabel()` in `lib/format.ts` ("Now" green, "Unavailable — ask" amber); `unavailable` with no date also fires an amber "call to ask what's actually open" flag (rolling communities).
- **Lease labels** come from `leaseSummary()` + `isMonthToMonth()` in `lib/derive.ts` (Month-to-month / Flexible (1–N mo) / Short-term (N mo) / N mo / N–M mo / N+ mo / ≤N mo / ''); they live in derive, not format, because `flags.ts` shares `isMonthToMonth` and a format↔derive import would cycle. Lease target is 6/6 in `DEFAULT_SETTINGS`, with a 6/12 → 6/6 migration (ADR-007).
- **"Listed by" pill** derives from the existing `listingType` via `LISTED_BY_LABEL` (`components/helpers.tsx`; Unknown hidden) — no separate field. Owner/management `contact` is seed listing data; `comments` are the user overlay (ADR-006).
- **New persisted defaults need an idempotent `parsePersist` migration:** `{...DEFAULT_SETTINGS, ...saved}` lets a saved empty value (e.g. `anchors: []`) override a new default, so `DEFAULT_SETTINGS` alone never reaches existing browsers. The 94030 default anchor (`DEFAULT_ANCHOR` in `types.ts`) is injected this way on every load — robust to the autosave race, and a user's own anchor is untouched.

### Domain rules
- **Scam tells (Craigslist rentals):** price ~25–55% under market; "send your phone number" / off-platform contact; an up-front holding or reservation fee before a tour; the same AI-luxury copy fingerprint reused across posts ("sunlight pours through tall windows…"); mismatched or scraped hero photos; a malformed DRE license number; no street address (general-area pin only). **Legit tells:** at/near-market price; a named managed community verifiable on OSM; a valid 8-digit CA DRE/BRE number; a professional leasing flow (tour link, 3× income, Equal Housing); the building number matches the photo.
- **Status pipeline:** New → Shortlist → Contacted → Toured → Applied → Rejected → Leased / Ruled out / Gone. The three exits differ: **Gone** = the market took it (off market, leased to someone else); **Ruled out** = reality or eligibility took it (income cap, phantom availability); **Rejected** = the user passed by preference (visible unless "Hide rejected"). Gone and Ruled out are hidden by default behind independent chips and are **reversible toggles** in DetailModal — `toggleStatus(current, target)` in `components/helpers.tsx` (`current === target ? 'New' : target`): un-marking resets to New with no prior-status memory (ADR-011) and the modal stays open so undo is one click.
- A user comment mentioning "income restricted" renders red (`isIncomeRestrictedComment`, `lib/derive.ts`) — a bonus on top of the red flag, not the flag itself.

### How to work on it
`cd app; npm install` (once) → `npm run dev` while working, then `npm run check` (lint, typecheck,
tests, build) before any push: it is the validation for every change; the machine's pre-push hook runs
it through the root `package.json` forwarder, and Actions runs it again before anything deploys (ADR-012). Validate every change in the running app (in-app browser or
real Chrome for pixel truth), then commit + push (`main` auto-deploys once the gate is green) and
confirm the Actions run is green and the live page's `<meta name="build-commit">` equals the pushed
commit. Standing workflow: user sends links
→ I extract, geocode, triage, append, validate, push. `Find` (header) opens pre-built Zillow /
Apartments.com / Craigslist / FB searches with the criteria baked in (`data/searches.ts`): `CRITERIA`
and the derived `PRICE_LABEL` are the single edit point — the criteria line, every link sub and every
URL retune from them (today ~15 mi of San Mateo 94402 / Redwood City 94063 · $1,500–3,000 · 1+ bd /
1+ ba · short-term). Per platform: Apartments.com's native `/short-term/` path, Craigslist keyword
OR-query + `sort=dist` (nearest first), Facebook `query=short term`, Zillow `searchQueryState` (no lease
filter — skim). Deep links are best-effort and degrade to the region page (never a 404) — eyeball them
in a real browser; a Copy button copies the criteria. No East-Bay exclusion: a straight-line radius can't
region-filter and the user is fine skimming, so don't re-add "excludes East Bay" wording or fake
sub-region links.
Pixel truth: use real Chrome (`claude-in-chrome`) when the in-app Browser pane's screenshot times out;
its capture crops the bottom ~60 px, so a bottom-anchored toast can be absent from a screenshot yet
render fine, and `elementsFromPoint` can't prove paint order while a modal is open (everything outside
it is inert).

### Current state & open items
Live and in daily use. 29 seed listings (a7–a35), curated statuses baked in as of 2026-07-22.
Deferred (accepted): lease-target min/max can't be cleared to null; a 5-digit street number can
mis-resolve as a ZIP; URL-hash share writer not built; GitHub Actions Node-20 deprecation warning.
Detail: [STATE.md](STATE.md).
Engineering-standard debt (audit 2026-10-21): the lint found none; four files over the 300-line reading
limit (`useApartments.ts` 486, `ApartmentForm.tsx` 479, `DetailModal.tsx` 470, `App.tsx` 327; the first
three near the 500-line lint error) are split at their next touch (retrofit step 4); the Node version is
not pinned (CI runs 20, the machine 24; both pass).

### Change highlights
- 2026-10-21 — Command surface and CI gate (ADR-012): ESLint with the standard's boundary and size rules, `npm run lint` and `npm run check`, a `check` job the deploy's `build` job needs, and `check.yml` for other branches and pull requests; two unused symbols removed from `helpers.test.ts`. No behavior or UI change.
- 2026-10-16 — Build-commit stamp: the built page carries `<meta name="build-commit">` with the deployed commit (GitHub Actions' `GITHUB_SHA`; `local` for a local build), so a deploy is proven live by that id, not by a `?t=` query the Pages CDN ignores (app/index.html, app/vite.config.ts).
- 2026-07-24 — a35 (Chateau Sandel, Belmont) added.
- 2026-07-22 — 4th curation re-bake; in-place comment editing; card comment cap-with-scroll.
- 2026-07-21 — days-on-market flag tiered (30–60 amber, >60 red); San Carlos/Belmont batch; Zillow bot-wall lesson.
- 2026-07-17 — default anchor ZIP 94030 (fresh devices + idempotent migration).
- 2026-07-16 — capture-from-link workflow; apartments.com image unlock; "Ruled out" status + reversible toggles; toast→popover fix.
- 2026-07-15 — income-restricted = first-class red flag; red-first ordering; Find price cap $3,000.
- 2026-06-29/30 — built by `/build` (adapt car-shopping), deployed, real listings replace placeholders.

## 5. Pointers
- [README.md](README.md) — product face: how the user uses every feature (public).
- [docs/PRD.md](docs/PRD.md) · [docs/tech-plan.md](docs/tech-plan.md) · [docs/api-contract.md](docs/api-contract.md) — spec + architecture.
- [docs/BRANDING.md](docs/BRANDING.md) — the product icon (`app/public/favicon.svg`): concept, colors, quality bar, checks.
- [DECISIONS.md](DECISIONS.md) — ADR-001…012 (why it is the way it is; ADR-010/011 matter most day to day; ADR-012 the command surface and CI gate).
- [STATE.md](STATE.md) — live status + detailed change log · [RUN_LOG.md](RUN_LOG.md) — build log.
- Memory: the per-project memory files (`apartment-shopping-app.md`, `flag-scam-listings-before-adding.md`) were folded into this file on 2026-10-15 — this file is the source of truth; anything left in memory is history.
- Skills: `web-data-snapshot` (browser-capture + bot-wall cheat sheet), `web-sheets-sync`, `web-ship-check`.
