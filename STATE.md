# STATE — apartment-shopping

**Phase:** ✅ **DEPLOYED & LIVE.** Iterating on features per user requests.
**Updated:** 2026-07-02
**Live:** https://xzhou110.github.io/apartment-shopping/ (GitHub Pages; push to `main` auto-deploys)

## Current status
- **228 tests pass**, `tsc --noEmit` clean, production build clean, live site verified 200 + serves current bundle.
- Deployed from `main`; local == remote == GitHub HEAD (in sync).
- 5 real listings seeded (a3–a7), each geocoded, with owner/management contact populated from the listing.

## Feature set (as shipped)
- **Capture → compare:** screenshot + link → I extract fields, geocode, append to `data/apartments.ts`. Grid + Compare views, filters, sorts, status pipeline, ratings, Sheets export.
- **Distance ranking:** offline Bay Area ZIP/city table (429 ZIP + 106 city centroids) + cached Nominatim fallback; per-card chip + Nearest sort; runtime anchors in Settings.
- **Owner / management contact** (per listing): company/owner, contact person, phone, email, website — shown on the card (name + tap-to-call/email/website rows below it) and the detail modal; editable in the form; exported. Safe `tel:`/`mailto:`/`https:` links; `tel:` encodes extensions (`;ext=`).
- **Your comments** (per listing): timestamped, add/delete; latest shown on the card below the flags, full thread in detail. Persisted as a user overlay and merged onto seed listings on reload (like ratings/status).
- **Lease goal = 6 months** (single-point). Flags: 12-mo term → **red** "doesn't fit your 6 mo goal"; no lease term stated → **amber** "confirm they'll do a 6 mo term"; true **month-to-month** → **green** "maximum flexibility". A safe localStorage migration bumps browsers still on the old 6/12 default → 6/6.

## Recent changes (2026-07)
- Added owner/contact + comments (data model, card, detail, form, export). New `Contact`/`Comment` types.
- Retargeted lease to a single 6-mo goal; new green month-to-month flag; new amber "lease term not stated" flag; goal-aware flag copy.
- Populated real contact for a4 (Woodside Place, phone +ext + leasing page) and a7 (Blvd Residential, phone); fixed a latent type error where a7 lacked contact/comments.

## Deferred (accepted low-risk; not blocking)
- S1: lease-target min/max can't be cleared to null (snaps to defaults).
- S3: a 5-digit street number can mis-resolve as a ZIP (remote geocode fallback mitigates).
- N1: URL-hash *share writer* not built (reader removed for security).
- Ops: GitHub Actions logs a harmless "Node 20 deprecation" warning — bump the action versions when convenient.

## Standing workflow
- User feeds listing screenshots + links → I extract, geocode, populate contact, append to the seed, validate, and (with standing OK) push. Push to `main` auto-deploys; always validate live before reporting done.
