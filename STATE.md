# STATE — apartment-shopping

**Phase:** ✅ QA + Review done, must-fixes applied, **PM acceptance PASSED** → awaiting **deploy approval** (human gate). NOT deployed.
**Updated:** 2026-06-29

## Final status
- Build clean (tsc 0 err), **173 tests pass**, browser-verified (distance offline + persist, XSS guard, no console errors, light+dark, compare, Gone-hidden).
- QA: 11/11 acceptance criteria PASS. Reviewer: SHIP-WITH-MUST-FIXES → all 3 must-fixes + S2/S5 + QA gap fixed by PM and re-verified.
- Dev server running locally at http://localhost:5180 for review.

## Deferred (accepted low-risk; not blocking — pick up later if wanted)
- S1: lease-target min/max can't be cleared to null (snaps to 6/12). 
- S3: a 5-digit street number can mis-resolve as a ZIP (remote geocode fallback mitigates).
- S6: petFriendly↔petPolicy cross-check only runs on form-create, not seed/import.
- N1: URL-hash *share writer* not built (reader removed for security). N3–N6: cosmetic/perf.

## Next action
User chose (2026-06-29): **HOLD deploy, add real listings first.** Not deployed, not yet git-committed
(user didn't request a commit). Dev server left running at http://localhost:5180. Awaiting listing
screenshots + links → I geocode + append to data/apartments.ts. Deploy available on request.

## Verified working (PM, in real browser at :5180)
Build clean (tsc 0 err), 116 tests pass, no console errors, light+dark, distance offline (94103→0.6/10.7mi),
Nearest sort, Nominatim browser CORS 200 (address fallback works), Compare best/worst, Gone hidden.
Next gates: QA (acceptance criteria + coverage) → Reviewer (correctness/security) → PM acceptance → deploy gate.

## Done (added)
- Tech Lead delivered docs/api-contract.md + docs/tech-plan.md; PM reviewed + froze.
- PM scope cut applied: NO derived/total cost (track cost fields only). Contract updated.
- Geo data de-risked: 429 Bay Area ZIP + 106 city centroids staged at app/src/data/geo/_bay_*.json.
- Launched Frontend + Data engineers in parallel (non-overlapping lanes).

## Done (earlier)
- Triage: FULL BUILD, reuse-first (adapt the `garage` template). Crew chosen.
- Clarified with user: name = `apartment-shopping`; distance = straight-line/offline; anchor entered at runtime (city/zip/address), rank by distance from it.
- Scaffolded by copying garage `app/` (minus node_modules, dist, car images, TCO engine, car extract script) + CI workflow + .gitignore.
- PM authored the frozen contract `app/src/types.ts` (Apartment, Amen, Anchor, Settings).
- Logging up: RUN_LOG.md, DECISIONS.md, STATE.md. PRD.md authored.

## In progress
- (next) Tech Lead → tech-plan.md + api-contract.md (distance/geocode module, cost derive, flags, file lanes).

## Blocked / open questions
- User to provide a real anchor (city/zip/address) at runtime — not needed to build; the anchor UI + offline table make it work for any user input.
- Driving-time distance deferred (v2) — v1 is straight-line only (user chose free/offline).
- Listing seed starts effectively empty (1 example row) — user will feed screenshots/links to populate.

## Who's running
- Orchestrator/PM: this session (Opus 4.8).
