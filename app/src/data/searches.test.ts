import { describe, it, expect } from 'vitest';
import { SEARCH_LINKS, CRITERIA, SEARCH_CRITERIA_LABEL } from './searches';

describe('search launcher links', () => {
  it('has craigslist + facebook sources', () => {
    expect(SEARCH_LINKS.length).toBeGreaterThanOrEqual(4);
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

  it('craigslist links carry the bed/bath minimums and exclude East Bay (no /eby/)', () => {
    const cl = SEARCH_LINKS.filter((s) => s.url.includes('craigslist.org'));
    for (const s of cl) {
      expect(s.url).toContain(`min_bedrooms=${CRITERIA.minBeds}`);
      expect(s.url).toContain(`min_bathrooms=${CRITERIA.minBaths}`);
      expect(s.url).not.toContain('/eby/'); // east-bay subregion must never be a source
    }
  });

  it('criteria label mentions San Mateo + the radius', () => {
    expect(SEARCH_CRITERIA_LABEL).toContain('San Mateo');
    expect(SEARCH_CRITERIA_LABEL).toContain(String(CRITERIA.radiusMi));
  });
});
