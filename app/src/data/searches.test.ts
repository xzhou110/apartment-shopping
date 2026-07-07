import { describe, it, expect } from 'vitest';
import { SEARCH_LINKS, CRITERIA, SEARCH_CRITERIA_LABEL } from './searches';

describe('search launcher links', () => {
  it('has craigslist + facebook sources', () => {
    expect(SEARCH_LINKS.length).toBeGreaterThanOrEqual(3);
    expect(SEARCH_LINKS.some((s) => s.url.includes('craigslist.org'))).toBe(true);
    expect(SEARCH_LINKS.some((s) => s.url.includes('facebook.com/marketplace'))).toBe(true);
  });

  it('every link is https with a label + sub', () => {
    for (const s of SEARCH_LINKS) {
      expect(s.url.startsWith('https://')).toBe(true);
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.sub.length).toBeGreaterThan(0);
    }
  });

  it('bakes the price range into every link (guards a criteria typo)', () => {
    for (const s of SEARCH_LINKS) {
      expect(s.url).toContain(String(CRITERIA.minPrice));
      expect(s.url).toContain(String(CRITERIA.maxPrice));
    }
  });

  it('craigslist links are radius searches at the configured distance with bed/bath mins', () => {
    const cl = SEARCH_LINKS.filter((s) => s.url.includes('craigslist.org'));
    for (const s of cl) {
      expect(s.url).toContain(`search_distance=${CRITERIA.radiusMi}`);
      expect(s.url).toContain(`min_bedrooms=${CRITERIA.minBeds}`);
      expect(s.url).toContain(`min_bathrooms=${CRITERIA.minBaths}`);
      expect(s.url).toMatch(/postal=\d{5}/);
    }
  });

  it('covers both San Mateo (94402) and Redwood City (94063)', () => {
    expect(SEARCH_LINKS.some((s) => s.url.includes('postal=94402'))).toBe(true);
    expect(SEARCH_LINKS.some((s) => s.url.includes('postal=94063'))).toBe(true);
  });

  it('has a single generic FB link (no fake per-city links — FB URL can’t preset location)', () => {
    const fb = SEARCH_LINKS.filter((s) => s.url.includes('facebook.com/marketplace'));
    expect(fb).toHaveLength(1);
    expect(fb[0].url).not.toMatch(/sanmateo|redwoodcity/);
  });

  it('criteria label states the radius but no longer claims to exclude East Bay', () => {
    expect(SEARCH_CRITERIA_LABEL).toContain(String(CRITERIA.radiusMi));
    expect(SEARCH_CRITERIA_LABEL).toContain('San Mateo');
    expect(SEARCH_CRITERIA_LABEL.toLowerCase()).not.toContain('east bay');
  });

  it('criteria label includes the short-term lease criterion', () => {
    expect(SEARCH_CRITERIA_LABEL).toContain(CRITERIA.leaseLabel);
    expect(SEARCH_CRITERIA_LABEL.toLowerCase()).toContain('short-term');
  });
});

describe('search launcher — Zillow + Apartments.com + short-term', () => {
  const decodeUrl = (u: string) => decodeURIComponent(u);

  it('adds Zillow and Apartments.com, ordered ABOVE craigslist and facebook', () => {
    const firstIdx = (needle: string) => SEARCH_LINKS.findIndex((s) => s.url.includes(needle));
    const zillow = firstIdx('zillow.com');
    const apts = firstIdx('apartments.com');
    const cl = firstIdx('craigslist.org');
    const fb = firstIdx('facebook.com/marketplace');
    expect(zillow).toBeGreaterThanOrEqual(0);
    expect(apts).toBeGreaterThanOrEqual(0);
    expect(zillow).toBeLessThan(cl);
    expect(zillow).toBeLessThan(fb);
    expect(apts).toBeLessThan(cl);
    expect(apts).toBeLessThan(fb);
  });

  it('covers San Mateo + Redwood City on Zillow and Apartments.com', () => {
    for (const host of ['zillow.com', 'apartments.com']) {
      const links = SEARCH_LINKS.filter((s) => s.url.includes(host));
      expect(links.some((s) => s.url.includes('san-mateo-ca'))).toBe(true);
      expect(links.some((s) => s.url.includes('redwood-city-ca'))).toBe(true);
    }
  });

  it('Zillow links are rental searches with price/bed/bath baked into searchQueryState', () => {
    const zillow = SEARCH_LINKS.filter((s) => s.url.includes('zillow.com'));
    expect(zillow.length).toBeGreaterThanOrEqual(1);
    for (const s of zillow) {
      expect(s.url).toContain('/rentals/');
      const raw = s.url.split('searchQueryState=')[1];
      expect(raw).toBeTruthy();
      const state = JSON.parse(decodeURIComponent(raw));
      expect(state.filterState.fr.value).toBe(true);
      expect(state.filterState.mp.min).toBe(CRITERIA.minPrice);
      expect(state.filterState.mp.max).toBe(CRITERIA.maxPrice);
      expect(state.filterState.beds.min).toBe(CRITERIA.minBeds);
      expect(state.filterState.baths.min).toBe(CRITERIA.minBaths);
    }
  });

  it('Apartments.com links apply the native Short-Term path filter with beds + price', () => {
    const apts = SEARCH_LINKS.filter((s) => s.url.includes('apartments.com'));
    expect(apts.length).toBeGreaterThanOrEqual(1);
    for (const s of apts) {
      expect(s.url).toContain('/short-term/');
      expect(s.url).toContain(`${CRITERIA.minBeds}-bedrooms-${CRITERIA.minPrice}-to-${CRITERIA.maxPrice}`);
    }
  });

  it('Craigslist links keyword-search short-term posts (no native lease filter)', () => {
    const cl = SEARCH_LINKS.filter((s) => s.url.includes('craigslist.org'));
    for (const s of cl) {
      expect(s.url).toContain('query=');
      const q = decodeUrl(s.url.split('query=')[1]);
      expect(q.toLowerCase()).toContain('short term');
      expect(q).toContain('|'); // craigslist OR across the lease variants
    }
  });

  it('Facebook link keyword-searches short-term', () => {
    const fb = SEARCH_LINKS.find((s) => s.url.includes('facebook.com/marketplace'))!;
    expect(decodeUrl(fb.url).toLowerCase()).toContain('short term');
  });
});
