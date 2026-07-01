// ============================================================================
// SEARCH LAUNCHER (2026-06-30) — pre-built external search links encoding the user's
// criteria so they open ready-to-skim in the browser (no scraping — craigslist 403s
// automated fetches, so the reliable path is the user's own browser). Paste any hit into
// "Add listing" or send it to me and I'll scam-check + add it.
//
// Criteria: within ~20 mi of San Mateo · EXCLUDING East Bay · $1,500–2,500 · 1+ bd / 1+ ba.
// craigslist's West-Bay subregions (pen/sfc/sby) exclude East Bay by construction; the radius
// link is the exact 20 mi but includes some East Bay (skip those). FB Marketplace needs login
// and a couple of filters set in its own UI (its URL params are limited).
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
  radiusMi: 20,
  postal: '94402', // central San Mateo
} as const;

export const SEARCH_CRITERIA_LABEL = `Within ~${CRITERIA.radiusMi} mi of San Mateo · excluding East Bay · $${CRITERIA.minPrice.toLocaleString()}–${CRITERIA.maxPrice.toLocaleString()} · ${CRITERIA.minBeds}+ bd / ${CRITERIA.minBaths}+ ba`;

const CL = 'https://sfbay.craigslist.org/search';
const CL_Q = `min_price=${CRITERIA.minPrice}&max_price=${CRITERIA.maxPrice}&min_bedrooms=${CRITERIA.minBeds}&min_bathrooms=${CRITERIA.minBaths}`;

export const SEARCH_LINKS: SearchLink[] = [
  {
    label: 'Craigslist · Peninsula',
    sub: 'San Mateo County (Daly City → Menlo Park) — no East Bay',
    url: `${CL}/pen/apa?${CL_Q}`,
  },
  {
    label: 'Craigslist · San Francisco',
    sub: 'SF proper (~18 mi, west bay) — no East Bay',
    url: `${CL}/sfc/apa?${CL_Q}`,
  },
  {
    label: 'Craigslist · South Bay',
    sub: 'Palo Alto / Mountain View edge (also shows farther San Jose — skim by price)',
    url: `${CL}/sby/apa?${CL_Q}`,
  },
  {
    label: 'Craigslist · 20-mi radius',
    sub: 'Everything within 20 mi of San Mateo — includes some East Bay (skip those)',
    url: `${CL}/apa?${CL_Q}&search_distance=${CRITERIA.radiusMi}&postal=${CRITERIA.postal}`,
  },
  {
    label: 'Facebook Marketplace',
    sub: 'San Mateo rentals — set radius 20 mi + beds in FB (login required)',
    url: `https://www.facebook.com/marketplace/sanmateo/propertyrentals?minPrice=${CRITERIA.minPrice}&maxPrice=${CRITERIA.maxPrice}&sortBy=creation_time_descend&exact=false`,
  },
];
