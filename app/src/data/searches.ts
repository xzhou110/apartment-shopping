// ============================================================================
// SEARCH LAUNCHER (2026-06-30, expanded 2026-07-07) — pre-built external search links
// encoding the user's criteria so they open ready-to-skim in the browser (no scraping —
// these sites 403 automated fetches, so the reliable path is the user's own browser). Paste
// any hit into "Add listing" or send it to me and I'll scam-check + add it.
//
// Criteria: within ~15 mi of San Mateo / Redwood City · $1,500–3,000 · 1+ bd / 1+ ba ·
//   short-term (6-mo / 1-mo / month-to-month).
//
// Per-platform lease handling ("as appropriate"):
//   • Apartments.com — NATIVE `/short-term/` path filter (composes with beds; verified pattern).
//   • Craigslist     — no lease filter, so a keyword `query` with craigslist's OR (`|`) + exact
//                      phrases ("short term"|"6 month"|…) narrows to short-term posts. Results are
//                      sorted NEAREST-FIRST (`sort=dist` — distance ascending from the search ZIP).
//   • Facebook       — keyword `query=short term` (FB can't preset location/radius via URL — you
//                      set those in FB's own UI; login required).
//   • Zillow         — no lease-length filter, so price/beds are baked via `searchQueryState` and
//                      you skim for short-term / 6-mo.
//
// Craigslist links are true RADIUS searches (search_distance + postal). Zillow/Apartments.com are
// REGION searches, so we cover both anchor cities (San Mateo + Redwood City) to mirror the criteria.
// A straight-line radius will include a few across-the-bay listings — there's no reliable
// region-exclude, so we don't pretend to filter them; skim past what you don't want.
//
// NOTE: these sites block automated verification, so the deep-linked filters are best-effort — if a
// slug/param ever drifts, the link degrades gracefully to the city/region page (never a 404). Eyeball
// that the filters applied when the tab opens.
// ============================================================================

export interface SearchLink {
  label: string;
  sub: string;
  url: string;
}

/** The user's rental criteria (edit here to retune every link at once). */
export const CRITERIA = {
  minPrice: 1500,
  maxPrice: 3000,
  minBeds: 1,
  minBaths: 1,
  radiusMi: 15,
  /** Short display of the lease-term criterion (shown in the criteria label). */
  leaseLabel: '6-mo / 1-mo / short-term',
} as const;

/** "$1,500–3,000" — derived so the label + every link sub retune with CRITERIA (one edit point). */
const PRICE_LABEL = `$${CRITERIA.minPrice.toLocaleString()}–${CRITERIA.maxPrice.toLocaleString()}`;

export const SEARCH_CRITERIA_LABEL = `Within ~${CRITERIA.radiusMi} mi of San Mateo or Redwood City · ${PRICE_LABEL} · ${CRITERIA.minBeds}+ bd / ${CRITERIA.minBaths}+ ba · ${CRITERIA.leaseLabel}`;

// ---- Zillow (region search; filters baked via searchQueryState) --------------------------------
// Zillow encodes its own filtered searches as a JSON `searchQueryState`. We bake for-rent + price +
// bed/bath mins; Zillow has no lease-length filter, so short-term is a skim.
const zillowRental = (citySlug: string, term: string): string => {
  const searchQueryState = {
    pagination: {},
    usersSearchTerm: term,
    filterState: {
      fr: { value: true }, // for-rent
      fsba: { value: false },
      fsbo: { value: false },
      nc: { value: false },
      cmsn: { value: false },
      auc: { value: false },
      fore: { value: false },
      mp: { min: CRITERIA.minPrice, max: CRITERIA.maxPrice }, // monthly rent range
      beds: { min: CRITERIA.minBeds },
      baths: { min: CRITERIA.minBaths },
    },
    isListVisible: true,
    isMapVisible: true,
  };
  return `https://www.zillow.com/${citySlug}/rentals/?searchQueryState=${encodeURIComponent(JSON.stringify(searchQueryState))}`;
};

// ---- Apartments.com (region search; beds + price + NATIVE short-term all in the path) -----------
const apartmentsCom = (citySlug: string): string =>
  `https://www.apartments.com/${citySlug}/${CRITERIA.minBeds}-bedrooms-${CRITERIA.minPrice}-to-${CRITERIA.maxPrice}/short-term/`;

// ---- Craigslist (radius search + short-term keyword, sorted nearest-first) ----------------------
const CL = 'https://sfbay.craigslist.org/search/apa';
// `sort=dist` = craigslist's "distance" sort (ascending from the search ZIP) — valid because these
// are geo-anchored searches (postal + search_distance present).
const CL_Q = `min_price=${CRITERIA.minPrice}&max_price=${CRITERIA.maxPrice}&min_bedrooms=${CRITERIA.minBeds}&min_bathrooms=${CRITERIA.minBaths}&search_distance=${CRITERIA.radiusMi}&sort=dist`;
// Craigslist supports `|` = OR and "…" = exact phrase. Narrow to short-term posts.
const CL_SHORT_TERM = encodeURIComponent('"short term"|"month to month"|"6 month"|"1 month"');

/** A craigslist apartments search within CRITERIA.radiusMi of a ZIP, keyworded to short-term posts. */
const clRadius = (postal: string): string => `${CL}?${CL_Q}&postal=${postal}&query=${CL_SHORT_TERM}`;

export const SEARCH_LINKS: SearchLink[] = [
  {
    label: 'Zillow · San Mateo',
    sub: `San Mateo rentals · ${PRICE_LABEL} · 1+ bd/ba baked in — no lease filter, skim for short-term`,
    url: zillowRental('san-mateo-ca', 'San Mateo, CA'),
  },
  {
    label: 'Zillow · Redwood City',
    sub: `Redwood City rentals · ${PRICE_LABEL} · 1+ bd/ba baked in — no lease filter, skim for short-term`,
    url: zillowRental('redwood-city-ca', 'Redwood City, CA'),
  },
  {
    label: 'Apartments.com · San Mateo',
    sub: `San Mateo · ${PRICE_LABEL} · 1+ bd · Short-Term filter applied`,
    url: apartmentsCom('san-mateo-ca'),
  },
  {
    label: 'Apartments.com · Redwood City',
    sub: `Redwood City · ${PRICE_LABEL} · 1+ bd · Short-Term filter applied`,
    url: apartmentsCom('redwood-city-ca'),
  },
  {
    label: `Craigslist · ${CRITERIA.radiusMi} mi of San Mateo`,
    sub: `Within ${CRITERIA.radiusMi} mi of San Mateo (94402) · ${PRICE_LABEL} · nearest first · short-term / 6-mo / 1-mo keywords`,
    url: clRadius('94402'),
  },
  {
    label: `Craigslist · ${CRITERIA.radiusMi} mi of Redwood City`,
    sub: `Within ${CRITERIA.radiusMi} mi of Redwood City (94063) · ${PRICE_LABEL} · nearest first · short-term / 6-mo / 1-mo keywords`,
    url: clRadius('94063'),
  },
  {
    // One generic FB link: FB can't preset location/radius via URL, so per-city links would be
    // identical — you set San Mateo / Redwood City + the 15-mi radius in FB's own filters.
    label: 'Facebook Marketplace · rentals',
    sub: `Set location (San Mateo / Redwood City) + ${CRITERIA.radiusMi}-mi radius + beds in FB · ${PRICE_LABEL} baked in · short-term search applied — login required`,
    url: `https://www.facebook.com/marketplace/category/propertyrentals?minPrice=${CRITERIA.minPrice}&maxPrice=${CRITERIA.maxPrice}&sortBy=creation_time_descend&exact=false&query=${encodeURIComponent('short term')}`,
  },
];
