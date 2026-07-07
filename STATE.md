# STATE — apartment-shopping

**Phase:** ✅ **DEPLOYED & LIVE.** Iterating on features per user requests.
**Updated:** 2026-07-07
**Live:** https://xzhou110.github.io/apartment-shopping/ (GitHub Pages; push to `main` auto-deploys)

## Current status
- **258 tests pass**, `tsc --noEmit` clean, production build clean, live site verified 200 + serves current bundle.
- Deployed from `main`; local == remote == GitHub HEAD (in sync).
- **11 real listings seeded (a6–a16)**, each geocoded + scam-screened. (a3/a4/a5 retired 2026-07-07 — no longer available; ids are stable and never renumbered, so gaps are expected.)

## Feature set (as shipped)
- **Capture → compare:** screenshot + link → I extract fields, geocode, append to `data/apartments.ts`. Grid + Compare views, filters, sorts, status pipeline, ratings, Sheets export.
- **Distance ranking:** offline Bay Area ZIP/city table (429 ZIP + 106 city centroids) + cached Nominatim fallback; per-card chip + Nearest sort; runtime anchors in Settings.
- **Owner / management contact** (per listing): company/owner, contact person, phone, email, website — shown on the card (name + tap-to-call/email/website rows below it) and the detail modal; editable in the form; exported. Safe `tel:`/`mailto:`/`https:` links; `tel:` encodes extensions (`;ext=`).
- **Your comments** (per listing): timestamped, add/delete; latest shown on the card below the flags, full thread in detail. Persisted as a user overlay and merged onto seed listings on reload (like ratings/status).
- **Lease goal = 6 months** (single-point). The lease flag is always the **first non-scam flag** on a card (lease fit is the #1 decision factor): 12-mo term → **red** "doesn't fit your 6 mo goal"; no lease term stated → **amber** "confirm they'll do a 6 mo term"; true **month-to-month** → **green** "maximum flexibility". A safe localStorage migration bumps browsers still on the old 6/12 default → 6/6.
- **Availability** (2026-07-07): a first-class `availability` status ('now' | 'unavailable' | 'unknown') behind `availableDate`. Card/detail/compare show a real date when stated, else **"Now"** (green) or **"Unavailable — ask"** (amber, rolling communities) + an amber warn to call. `leaseSummary()` renders friendly labels (Month-to-month / Flexible (1–N mo) / Short-term (N mo) / N mo / N–M mo). Amenity pill order: laundry, parking, balcony, gym.

## Recent changes (2026-07)
- **2026-07-07:** Added the `availability` status field + friendly lease-term labels; reordered card flags so the lease flag leads (after any scam flag); removed the "Unfurnished — extra setup" info flag (user brings own furniture); amenity order → parking/balcony/gym. **Retired listings a3/a4/a5** (no longer available) — and hardened `mergeWithSeed` so retiring a seed listing no longer resurrects a ghost card from stale localStorage (via `looksUserAdded`), so seed listings can be deleted WITHOUT a `STORE_KEY` bump (which would wipe the user's ratings/status/comments). See ADR-009/010.
- **2026-07-02:** Added owner/contact + comments (data model, card, detail, form, export; `Contact`/`Comment` types). Retargeted lease to a single 6-mo goal; green month-to-month + amber "lease term not stated" flags; goal-aware copy. Populated real contact for a4/a7.

## Deferred (accepted low-risk; not blocking)
- S1: lease-target min/max can't be cleared to null (snaps to defaults).
- S3: a 5-digit street number can mis-resolve as a ZIP (remote geocode fallback mitigates).
- N1: URL-hash *share writer* not built (reader removed for security).
- Ops: GitHub Actions logs a harmless "Node 20 deprecation" warning — bump the action versions when convenient.

## Standing workflow
- User feeds listing screenshots + links → I extract, geocode, populate contact, append to the seed, validate, and (with standing OK) push. Push to `main` auto-deploys; always validate live before reporting done.
