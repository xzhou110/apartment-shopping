// ============================================================================
// SEARCH LAUNCHER (2026-06-30) — pre-built external search links encoding the user's
// criteria so they open ready-to-skim in the browser (no scraping — craigslist 403s
// automated fetches, so the reliable path is the user's own browser). Paste any hit into
// "Add listing" or send it to me and I'll scam-check + add it.
//
// Criteria: within ~15 mi of San Mateo / Redwood City · $1,500–2,500 · 1+ bd / 1+ ba.
// These are true RADIUS searches (craigslist search_distance + postal). A straight-line
// radius will include a few across-the-bay listings — there's no reliable region-exclude,
// so we don't pretend to filter them; skim past what you don't want. FB Marketplace needs
// login and a couple of filters set in its own UI (its URL params are limited).
// ============================================================================

export interface SearchLink {
  label: string;
  sub: string;
  url: string;
}

/** The user's rental criteria (edit here to retune every link at once). */
export const CRITERIA = {
  minPrice: 1500,
  maxPrice: 2500,
  minBeds: 1,
  minBaths: 1,
  radiusMi: 15,
} as const;

export const SEARCH_CRITERIA_LABEL = `Within ~${CRITERIA.radiusMi} mi of San Mateo or Redwood City · $${CRITERIA.minPrice.toLocaleString()}–${CRITERIA.maxPrice.toLocaleString()} · ${CRITERIA.minBeds}+ bd / ${CRITERIA.minBaths}+ ba`;

const CL = 'https://sfbay.craigslist.org/search/apa';
const CL_Q = `min_price=${CRITERIA.minPrice}&max_price=${CRITERIA.maxPrice}&min_bedrooms=${CRITERIA.minBeds}&min_bathrooms=${CRITERIA.minBaths}&search_distance=${CRITERIA.radiusMi}`;

/** A craigslist apartments search within CRITERIA.radiusMi of a ZIP. */
const clRadius = (postal: string) => `${CL}?${CL_Q}&postal=${postal}`;

export const SEARCH_LINKS: SearchLink[] = [
  {
    label: 'Craigslist · 15 mi of San Mateo',
    sub: 'Rentals within 15 miles of San Mateo (94402)',
    url: clRadius('94402'),
  },
  {
    label: 'Craigslist · 15 mi of Redwood City',
    sub: 'Rentals within 15 miles of Redwood City (94063)',
    url: clRadius('94063'),
  },
  {
    label: 'Facebook Marketplace · San Mateo',
    sub: 'San Mateo rentals — set the 15-mi radius + beds in FB (login required)',
    url: `https://www.facebook.com/marketplace/sanmateo/propertyrentals?minPrice=${CRITERIA.minPrice}&maxPrice=${CRITERIA.maxPrice}&sortBy=creation_time_descend&exact=false`,
  },
];
