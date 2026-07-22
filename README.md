# Apartment Shopping — shortlist, compare & rank rentals

A single-user dashboard for hunting an apartment: capture each candidate from a screenshot + link,
see auto flags, **rank by distance** from any place you type in (city / ZIP / address), compare
side-by-side, record your rating, and track each listing through a pipeline. Static, free, no backend.

Built for a **6-month Bay Area** search, but works anywhere (Bay Area ZIP/city distance is offline;
other places fall back to on-the-fly geocoding). It's the apartment sibling of [`garage`](../garage) (used cars).

**Live:** **https://xzhou110.github.io/apartment-shopping/** (GitHub Pages via `.github/workflows/deploy.yml`;
push to `main` auto-deploys). The Google Sheet sync URL is **never** in the bundle (it lives only in your
browser's localStorage), so it's not exposed by the public site.

## Run it
```bash
cd app
npm install        # first time only (already done)
npm run dev        # → http://localhost:5173
```
Other commands (from `app/`): `npm run build` (type-check + production bundle), `npm run preview`,
`npm test` (pure-logic unit tests).

> Data persists in your browser's localStorage (your in-app edits: ratings, status, comments, deletions,
> and listings you add). Clicking **Remove** on a listing keeps it gone in your browser — you don't need a
> code change for your own view. The committed seed in `app/src/data/apartments.ts` is the source of truth I
> edit when you send screenshots; retiring a seed listing there is safe and won't wipe or ghost your local
> state (see DECISIONS ADR-010).

## How you'll use it
1. **Find listings** — the header **Find** button opens pre-built external searches with the criteria
   baked in (within ~15 mi of San Mateo or Redwood City · **$1,500–3,000** · 1+ bd / 1+ ba · 6-mo /
   1-mo / short-term): Zillow + Apartments.com + Craigslist (each covering both cities) + Facebook
   Marketplace. Craigslist opens **sorted nearest-first** (distance from the search ZIP). A **Copy**
   button next to the criteria line copies it for pasting anywhere. These sites block automated
   fetching, so the links open in *your* browser — skim, then feed me the hits (step 2). Criteria live
   in one place (`app/src/data/searches.ts` `CRITERIA`) so every link + label retunes together.
2. **Add a listing — just send the link.** I open the page in my own browser and read the whole thing
   (rent, beds/baths/sqft, lease terms, fees, pet rules, utilities, amenities, address), **geocode the
   address** (so distance works), grab an **exterior photo of the building**, and append it to
   `app/src/data/apartments.ts`. Reading the live page beats a screenshot — it surfaces fee tabs, FAQs,
   and the site's own neighborhood rent comps that a hero image never shows. Screenshots are still
   welcome as a supplement, and remain the fallback for anything login-walled. You can also click
   **+ Add** to enter one by hand, and **Edit** any card.
3. **Rank by distance** — out of the box the board ranks from **ZIP 94030 (Millbrae)**, the default anchor,
   so a fresh browser (or your phone) shows distance chips immediately. Change it any time in **Settings →
   Distance anchors**: rename it, remove it, add your own (Work, Gym, …), or make another primary. Type a
   **city, ZIP, or address**; each card then shows "≈ X mi to {your place}", and **Sort → Nearest** orders
   the board by it. Common Bay Area ZIPs and cities resolve **instantly and offline** (a bundled Census
   centroid table — no API key, no cost); arbitrary street addresses fall back to a free geocoder and are
   cached. *Straight-line distance* — fast and free; it doesn't account for bridges/traffic (driving time is
   a future add). The default reflects on every device on refresh (a fresh install ships it; a browser that
   never set an anchor gets it injected on load).
4. **Triage** — each card shows rent + the cost fields, beds/baths/sqft, the amenity pill row (✓ / ✕ /
   **? = unknown**), a distance chip, the **owner / management contact** (company/owner name + tap-to-call
   phone, email, website), and auto **flags**. Lease flags track your **6-month goal**: a stated 12-mo term
   reads **red** (doesn't fit — ask if they'll do 6), a listing with **no lease term stated** reads **amber**
   (confirm before you commit), and a true **month-to-month** listing reads **green** (maximum flexibility).
   Two hand-set **red flags** mark hard gates when I add (or you edit) a listing: **possible scam** and
   **income-restricted** (affordable/AMI housing — you must income-qualify to rent, e.g. a20/a24; both are
   checkboxes in the Edit form). Other flags: no laundry, over/under market, utilities not included, available
   date passed, broker fee, far from your anchor. **Red (risk) flags always sort to the top** of the flag
   list — order: scam, income-restricted, lease conflict — so a dealbreaker is never pushed out of the card's
   3-flag preview. A colored top border flags overall risk (red) / caution (amber) / good (green). Your
   latest **comment** shows on the card below the flags. A small id badge (e.g. `a6`) on each photo maps the
   card to the data file / chat references — and the search box matches the id.
5. **Filter / sort** — search (title / neighborhood / city / address / id); quick chips (Furnished only,
   Lease fits my target, Hide rejected, Show gone, Show ruled out); a filter panel (max rent, min beds, must-have
   amenities); and sorts (**Nearest — the default**, Rent low→high / high→low, Beds, Sqft, Your rating, Added).
   Nearest ranks from your primary anchor (default **94030 / Millbrae**); if you delete every anchor it falls back to insertion order (no distance chips) until you add one — but on the next refresh the 94030 default is re-injected.
6. **Compare** — tick ≥2 listings → the Compare tab shows them side-by-side and auto-highlights the
   **best (green) / worst (red)** in each row (cheapest rent, nearest, most amenities, biggest sqft).
7. **Rate & comment** — click the **You ★** stars on a card (or in detail) to rate; **Expert ★** is my
   rating. Open a card to add **comments** (timestamped) in the detail view; each one has an **edit** (pencil)
   and **delete** button — editing updates the note in place, keeping its timestamp and position (⌘/Ctrl+Enter
   saves, Esc cancels). Your latest comment also shows on the card with the line breaks you type preserved (no
   ellipsis truncation); to keep every card in a row the same height, the on-card note is capped at ~6 lines
   and scrolls inside its box if it's longer — the full text is always in the detail thread. The detail thread
   is never capped. A comment that mentions **"income restricted"** renders highlighted **red**
   (on the card and in the detail thread) — income qualification is a hard eligibility gate, not a
   nice-to-know. Ratings, status, and comments are your per-listing state and persist in your
   browser even when I refresh the seed data.
8. **Track status** — New → Shortlist → Contacted → Toured → Applied → Rejected → **Leased** /
   **Ruled out** / **Gone**. Two statuses hide a listing from the board (each has a chip to bring it
   back): **Gone** = off the market entirely (leased to someone else, delisted) — the market took it
   away; **Ruled out** = not available *to you* or you don't qualify (e.g. an income-restricted
   community over/under your income cap, a unit that turned out not to be open) — reality took it
   away. **Rejected** (= you passed on it by preference) stays visible unless you turn on Hide
   rejected. Both live in a listing's detail view as **toggles you can select and unselect** —
   click **Mark as gone** / **Rule out** to hide it (the button lights up and its label flips to
   **Put back on list**); click it again to undo a mis-click and put the listing straight back on
   the board. The detail view **stays open** while you toggle, so the undo is always one click
   away, and clicking the *other* one switches over directly (a listing can only be one or the
   other). Un-marking resets the status to **New** — it doesn't restore a previous Shortlist/Toured,
   so the toast says so and you can re-set any status via **Edit**.
9. **Export to Google Sheets** — the **Export** button: **Sync** (push every listing straight into your
   sheet, updated in place), **Copy for Sheets** / **Download CSV** (zero-setup), and **JSON for Claude**
   (paste back to me so I can save your in-app edits into the data file). One-time Sheet setup is the same
   as garage — see that project's README for the Apps Script recipe and the "access = Anyone" gotcha.

## What's tracked (and what's deliberately not)
**Tracked:** rent + all cost fields (deposit, app/broker fees, parking, pet rent, utilities) · beds/baths/
sqft · laundry · lease term (+ min/max) · available date · furnished · pet policy · listing type ·
**owner / management contact** (company/owner, contact person, phone, email, website) · neighborhood/city/
address (+ geocoded lat/lng) · amenities · your ★ / my ★ · status · photo · source URL · my notes ·
**your comments** (timestamped, add/delete — the one field that persists per-listing in your browser).

**Tracked, not computed:** cost fields are shown as plain values for your own comparison — there's no
"total cost"/amortization engine (you asked to keep it simple). Cost ranking is by base **rent**.

**Amenities** (tri-state ✓ / ✕ / **?**): **parking**, **balcony/patio**, and **on-site gym** are the tracked
pills, in that order after the laundry pill; **laundry** is its own field (in-unit / on-site / none), and any
other perks a listing mentions live in free-text "other amenities".

**Availability** (2026-07-07): each listing shows a real move-in **date** when the listing states one; otherwise
a status — **"Now"** (green) or **"Unavailable — ask"** (amber, for rolling-availability communities that list
units as "currently unavailable", plus a caveat flag to call and ask what's actually open). The **lease term**
shows a friendly label: *Month-to-month*, *Flexible (1–N mo)*, *Short-term (N mo)*, *N mo*, or *N–M mo*.

## How your data is stored (and why deleting is safe)
Think of it as **a printed catalog plus your sticky notes**:
- **The catalog** = the listings baked into the code (`app/src/data/apartments.ts`, the "seed"). It's what a fresh
  browser or a new device starts with, and it's what I edit when you send me screenshots.
- **Your sticky notes** = everything that lives only in *your* browser (localStorage): your ★ ratings, statuses,
  comments, which listings you deleted, and any you typed in by hand.

Every time the app opens it **lays your sticky notes on top of the catalog**. So your ratings/notes survive even
when I refresh the catalog data.

**Deleting is safe both ways.** When you click **Remove**, that listing stays gone in your browser — you don't need
a code change or a redeploy for your own view. And when *I* retire a listing from the catalog (e.g. it's no longer
available), it disappears cleanly for everyone: the app tells a hand-added listing (a long timestamp id like
`a1751430000000`) apart from a retired catalog listing (a short id like `a6`), so a removed catalog listing never
"ghosts" back, and none of your saved ratings/notes are disturbed. (Earlier this required wiping *all* your local
data to avoid the ghost — no longer. See `DECISIONS.md` ADR-010.)

## Project layout
```
app/src/
  types.ts             data model (Apartment, Amen, Anchor, Settings, Flag)
  data/                apartments.ts (seed = source of truth) · searches.ts (Find-launcher links + CRITERIA) · amenities.ts · sheetCols.ts · geocode.ts (anchor resolver)
  data/geo/            bayAreaGeo.ts (offline ZIP+city centroids)
  lib/                 distance.ts · derive.ts · flags.ts · format.ts · exportSheet.ts  (PURE, unit-tested)
  state/useApartments.ts  listings + settings + filters + comments; localStorage autosave (+ seed-merge)
  components/          Card · Grid · CompareTable · DetailModal · Filters · ApartmentForm · ContactLinks · Export/Settings
docs/                  PRD.md · tech-plan.md · api-contract.md
```
Design rule: all domain logic is pure functions in `lib/*` + `data/*` (no DOM), covered by Vitest; the UI
only formats and renders. The distance feature works **offline** for Bay Area ZIPs/cities by design.
See `docs/` for the full spec and `DECISIONS.md` for the architecture rationale.
