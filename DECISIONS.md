# DECISIONS — apartment-shopping (ADR log)

## ADR-001 — Reuse the `garage` template; adapt, don't greenfield
- **Decision:** Copy the garage (used-car comparator) app as the scaffold and adapt the domain, rather than build from scratch.
- **Context:** garage is a clean Vite+React+TS SPA with a pure tested `lib/*` core, seed+localStorage+URL-share state, theming, Sheets export, and a GitHub Pages deploy workflow — ~90% of an apartment comparator is identical.
- **Alternatives:** Full greenfield pipeline (researcher→designer→…); a fresh `ship-web-app` scaffold.
- **Rationale:** Fastest path to a high-fidelity result; reuses battle-tested patterns; cost-conscious. The only genuinely new subsystem is distance ranking.
- **Reversible?** Yes — it's a copy; nothing in garage is touched.

## ADR-002 — Drop the TCO engine; track cost fields, do NOT compute total cost
- **Decision:** Remove the car TCO engine. Initially planned a lightweight `effectiveMonthly` + `moveInCost` derive — **reversed on 2026-06-29 per the user:** *"no need to compare total cost — I simply keep track of cost for my own compare purpose."* So there is **no `lib/cost.ts`**, no derived/effective/amortized cost, and no `cost-asc` sort. Raw cost fields (rent, parking, pet rent, utilities, deposit, app/broker fees) are tracked, displayed, and exported as plain values; cost ranking is by base **rent** only.
- **Context:** User flagged TCO as not useful (apartments don't depreciate), then explicitly scoped out any total-cost computation.
- **Rationale:** Match the user's actual workflow (eyeball the fields themselves); simpler build, fewer moving parts, nothing to mistrust. Reduces the lib lane by one module + its tests.
- **Reversible?** Yes — a derived metric can be added later if they ever want a ranked total.

## ADR-003 — Distance: offline straight-line (haversine) + runtime anchor
- **Decision:** v1 ranks by **straight-line** distance. Each *listing* is geocoded precisely at add-time (by me, via free Nominatim) and its lat/lng baked into the seed. The *anchor* (where the user ranks from) is entered at **runtime** as a city/ZIP/address and resolved against a **bundled offline Bay Area ZIP+city → lat/lng table** (instant, free, no key), with a Nominatim client-side fallback (cached in localStorage) for arbitrary addresses.
- **Context:** User chose "straight-line, free & offline" and said the anchor is provided at runtime ("each user may have a different city/zip; rank by distance from provided address").
- **Alternatives:** Driving/transit time via Google/Mapbox (needs key + $), baking a fixed anchor.
- **Rationale:** Keeps the app static, free, offline-capable, multi-user (each visitor's anchor lives in their own localStorage). Bay Area bridges make straight-line approximate — acceptable for ranking; driving time is a noted v2.
- **Reversible?** Yes — distance is a pure module; a driving-time provider can slot in behind the same interface.

## ADR-004 — Skip the researcher and a standalone designer agent
- **Decision:** Do not spawn `researcher` or `designer`. PM specifies the apartment amenity set + distance UX in the PRD; visual language is inherited from garage + the `frontend-baseline` tokens.
- **Context:** This is a personal tool for the user; demand is self-evident (they asked for it), and a polished design system already exists in the template.
- **Rationale:** Cost-conscious; scale ceremony to stakes. Spend agent budget on the genuinely new work (distance, data model, UI wiring).
- **Reversible?** Yes — can add a design pass later if the look needs lifting.

## ADR-005 — Name = `apartment-shopping`
- **Decision:** Folder/app name is `apartment-shopping` (→ xzhou110.github.io/apartment-shopping). App display title "Apartment Shopping".
- **Context:** Offered nest/digs/pad/roost; user chose `apartment-shopping`.
- **Reversible?** Yes, but renaming the GitHub Pages path later breaks the URL.
