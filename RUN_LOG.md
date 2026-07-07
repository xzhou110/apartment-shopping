# RUN_LOG — apartment-shopping

Append before and after every spawn. Times are local (PT).

---

### 2026-06-29 — Setup (Orchestrator/PM · Opus 4.8)
- Triaged request → FULL BUILD, reuse-first (adapt `garage`). Wrote acceptance criteria into PRD.md.
- Explored garage template: types.ts, state/useGarage.ts, lib/{flags,derive,format,exportSheet}.ts, data/{cars,features,sheetCols}.ts, App.tsx, vite/ts config, CI workflow. Result: architecture understood; reusable spine confirmed.
- Clarified 3 decisions with the user (name, distance type, anchor model).
- Scaffolded apartment-shopping by copying garage `app/` (excl. node_modules/dist/img/tco/_extract) + .github + .gitignore.
- Authored frozen contract app/src/types.ts; created STATE/DECISIONS/RUN_LOG + PRD.md.
- Status: ✅ scaffold + contract ready.

---
<!-- New entries below -->

### 2026-06-29 — ✔ Reviewer (Opus 4.8) — DONE
- Verdict: SHIP-WITH-MUST-FIXES. 3 must-fix, 6 should-fix, 6 nice-to-have. Report: docs/review-findings.md. (109k tok, 37 tools, 279s)
- Confirmed clean: sort-context trap threaded, haversine/null-degrade, geocode precedence+cache, leaseFits, flag engine, hydrate/seed-merge, no dangerouslySetInnerHTML/eval, Sheets POST data-only, no garage/TCO remnants.

### 2026-06-29 — ✔ PM remediation — DONE (re-verified)
- Fixed M1 (XSS safeHref guard ×3 sites + form-save + 8 tests), M2 (removed share-hash import path → also resolves S4), M3 (mergeWithSeed order: user-added first), S2 (compare null no longer "best"), S5 (dropped forbidden fetch headers + test), QA reset-chips gap.
- Deferred (accepted, low-risk): S1, S3, S6, N1–N6. Tracked in STATE.md.
- Re-verify: `npm run build` exit 0; `npm test` **173/173**; browser reload — no console errors, distance persists (0.6/10.7mi), XSS guard rejects javascript:.

### 2026-06-29 — ✔ PM ACCEPTANCE GATE — PASSED
- Vs original ask: named folder (apartment-shopping) ✓; garage-style compare ✓; dropped TCO/car fields, kept price/location/photo/your★/my★ ✓; screenshot+link → I append to seed ✓; search/filter/rank ✓; rank by distance (Bay Area, offline) ✓; 6–12mo lease fit ✓; cost tracked-not-computed (scope cut) ✓.
- Status: **product accepted.** Next: deploy gate (human approval) — NOT yet deployed.

### 2026-06-29 — ▶ Tech Lead (Opus 4.8) — STARTED
- Why: freeze the api-contract (lib/* + data/* signatures) before the parallel build; design the distance/geocode subsystem + cost derive + file layout.
- Inputs: docs/PRD.md, app/src/types.ts, garage template (lib/derive,flags,format; data/features,sheetCols).
- Expected out: docs/tech-plan.md + docs/api-contract.md. Status: ✔ done (282s, 67k tok). Contract is complete: SortKey, Filters, distance resolver (offline-first), import DAG. 3 risks flagged (thresholds → PM accepted; Nominatim unverified → non-blocking, offline path primary; geo sourcing → PM handled below).

### 2026-06-29 — PM scope cut + geo data prep
- User cut derived/total cost mid-run: track cost fields only, no effectiveMonthly/moveInCost/cost-asc. Updated api-contract §4/§6/§9/§10, tech-plan §2/§4/§5, DECISIONS ADR-002. Contract re-frozen.
- De-risked geo sourcing (PM): downloaded US Census 2023 ZCTA + Place gazetteers (schannel TLS), filtered to 9-county Bay Area bounding box → **429 ZIP centroids** + **106 city/neighborhood centroids** (cities derived from trusted ZIP centroids to avoid Census place-centroid pollution, e.g. SF/Farallones). Staged at app/src/data/geo/_bay_zips.json + _bay_cities.json. Spot-checks pass.

### 2026-06-29 — ▶ Parallel build (Frontend + Data engineers, Opus 4.8) — STARTED
- Contract frozen → fan out two non-overlapping lanes per tech-plan §2. Status: ✔ both done.

### 2026-06-29 — ✔ Frontend Engineer (Opus 4.8) — DONE
- Output: state/useApartments.ts, App.tsx, styles.css, components/{Card,Grid,CompareTable,DetailModal,ApartmentForm,Filters,ExportModal,SettingsModal,Modal,RatingStars,ThemeToggle,icons,helpers}. Deleted useGarage.ts/CarForm.tsx. (189k tok, 87 tools, 833s)
- Self-reported: tsc 0 errors, build ok, 116 tests, offline distance smoke ok. Anchor UX split: Filters sets primary anchor, Settings manages full list.

### 2026-06-29 — ✔ PM Integration checkpoint — PASSED
- Authoritative `npm run build` exit 0 (56 modules, 224KB/70KB gz); `npm test` 116/116.
- Browser verify (preview :5180): no console errors; light+dark render clean; **distance offline** (94103→0.6/10.7mi, persisted); Nearest sort correct; **Nominatim browser CORS 200** (address fallback works — open question RESOLVED); Compare best/worst (rent/beds/sqft/$ per sqft/distance); Gone hidden (2 of 3). Screenshots captured.

### 2026-06-29 — ▶ QA (Sonnet 4.6) + Reviewer (Opus 4.8) — STARTED (parallel)
- App already verified working by PM; QA maps acceptance criteria + coverage gaps, Reviewer audits correctness/security. Status: QA ✔, Reviewer running.

### 2026-06-29 — ✔ QA (Sonnet 4.6) — DONE
- 11/11 acceptance criteria PASS. Tests 116 → **165** (+49 in components/helpers.test.ts for applyFilters/applySort; all green). Build exit 0. Report: docs/test-report.md. (90k tok, 34 tools, 250s)
- Finding (low): resetFilters() doesn't clear furnishedOnly/leaseFitsTarget chips → PM to fix in integration cleanup.
- Untestable without DOM lib (covered by PM browser smoke): component render, localStorage round-trip, ExportModal sync fetch.

### 2026-06-29 — ✔ Data/Pure-Lib Engineer (Opus 4.8) — DONE
- Output: lib/{distance,derive,flags,format,exportSheet}.ts + tests; data/{amenities,sheetCols,apartments}.ts; data/geo/bayAreaGeo.ts (429 ZIP + 106 city, BOM-stripped) + data/geocode.ts; _fixtures.ts. Deleted garage cars.ts/features.ts. (101k tok, 59 tools, 520s)
- Validation: `vitest run src/lib src/data` → **116 tests passing**; lane tsc-clean. Full build deferred to PM integration.
- Nominatim probe: HTTP 000 (no egress from subagent). Non-blocking — offline table is primary. PM to verify browser CORS in-app at integration.
- Product finding (ACCEPTED, no change): `leaseFits` per frozen formula treats a min-12mo lease as fitting a 6–12 target (12≤12). Correct for user intent ("6–12 mo" includes a standard 12-mo lease); only min≥13 trips the lease-risk flag. Seed a2 set to min-18 as the genuine "doesn't fit" example.

---

### 2026-07-01 — Deployed + real listings (Opus 4.8, direct with user)
- User approved deploy. Live at https://xzhou110.github.io/apartment-shopping/ (GitHub Pages, push-to-main). Placeholder seed a1/a2 replaced with real listings a3–a7 (San Carlos, Woodside Place MV, Fiesta San Mateo, Imperial Burlingame, Tradewind Foster City) — each geocoded, scam-screened, notes written.

### 2026-07-02 — Owner/contact + comments + 6-mo lease + doc pass (Opus 4.8, direct with user)
- **Owner/management contact** added to the model (`Contact`) — card (name + tap-to-call/email/site rows), detail, form, export. Safe `tel:`/`mailto:`/`https:`; `tel:` encodes extensions (`;ext=`). Populated a4 (Woodside Place, (510) 899-5584 x66 + leasing page) and a7 (Blvd Residential, (650) 547-8025). Fixed a7 missing contact/comments (latent type error). See ADR-006.
- **User comments** added (`Comment`) — timestamped add/delete; latest on card below flags, full thread in detail; persisted + seed-merged like ratings/status. See ADR-006.
- **Lease goal → 6 months** (single-point; was 6–12) + safe localStorage migration (old 6/12 → 6/6). Goal-aware flag copy; "flex shorter" warn scoped to range goals. All listing notes updated. See ADR-007.
- **New flags:** green **month-to-month** (a7), amber **"lease term not stated"** (a3/a4). See ADR-008.
- Validation each step: `tsc` clean, **228 tests** pass, prod build clean, browser-verified (flags/colors/contact/comments/migration/no-overflow), live site 200 + serves current bundle. Pushed to `main`; deploy succeeded.
- **Docs pass (this entry):** refreshed README (live status, 6-mo, contact/comments, flags, amenity count), STATE.md (current), DECISIONS ADR-006/007/008, api-contract post-launch addendum.

---

### 2026-07-07 — Availability + lease labels + flag order + retire a3/a4/a5 (Fable 5 → Opus 4.8, direct with user)
- **Availability status** (`availability: 'now'|'unavailable'|'unknown'` behind `availableDate`): card/detail/compare/export show a real date when stated, else "Now" (green) / "Unavailable — ask" (amber) + a new amber warn for rolling-availability communities. Populated all listings. See ADR-009.
- **Friendly lease labels** (`leaseSummary` moved format→derive w/ shared `isMonthToMonth`): Month-to-month / Flexible (1–N mo) / Short-term (N mo) / N mo / N–M mo. Card/detail/compare/export consume it.
- **Flag order:** scam first → **lease-term flag (any level) leads the rest** (lease fit is the #1 factor; cards preview only 3 flags). **Removed** the "Unfurnished — extra setup" info flag (user brings own furniture). Amenity order → parking/balcony/gym.
- **Retired a3/a4/a5** (no longer available): deleted from the seed + their images. Hardened `mergeWithSeed` with `looksUserAdded` so retiring a seed listing no longer ghost-resurrects it from stale localStorage — enabling seed cleanups WITHOUT a `STORE_KEY` bump (which would wipe the user's ratings/status/comments). New `state/useApartments.test.ts`. See ADR-010.
- **Review:** ran a 6-agent adversarial workflow on the availability diff; fixed 2 confirmed low-sev issues (label/flag date-validity mismatch; "Available: Unavailable — ask" contradiction → detail/compare row relabeled "Availability").
- **Validation:** `tsc` clean, **258 tests** pass (+30 across derive/flags/format/useApartments), prod build clean. Browser-verified in the preview: reload with a3/a4/a5 still in localStorage → they vanish cleanly (no ghost), 11 of 11 listings show, no console errors, both themes. Pushed to `main` → auto-deploy; live verified.



