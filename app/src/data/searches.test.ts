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

  it('criteria label states the radius but no longer claims to exclude East Bay', () => {
    expect(SEARCH_CRITERIA_LABEL).toContain(String(CRITERIA.radiusMi));
    expect(SEARCH_CRITERIA_LABEL).toContain('San Mateo');
    expect(SEARCH_CRITERIA_LABEL.toLowerCase()).not.toContain('east bay');
  });
});
