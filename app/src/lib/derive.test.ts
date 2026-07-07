import { describe, it, expect } from 'vitest';
import { pricePerSqft, leaseFits, leaseSummary, isMonthToMonth, amenCount } from './derive';
import { makeApt } from './_fixtures';
import { DEFAULT_SETTINGS } from '../types';
import type { Settings } from '../types';

// Explicit 6–12 range so the truth table exercises leaseFits' overlap logic independent of the
// app default (which is now a single-point 6-mo goal — asserted separately below).
const settings: Settings = { ...DEFAULT_SETTINGS, targetMinLease: 6, targetMaxLease: 12 };

describe('pricePerSqft', () => {
  it('rent / sqft, two decimals', () => {
    expect(pricePerSqft(makeApt({ rent: 3000, sqft: 800 }))).toBe(3.75);
  });
  it('null when sqft is null', () => {
    expect(pricePerSqft(makeApt({ rent: 3000, sqft: null }))).toBeNull();
  });
  it('null when sqft is 0 (no divide-by-zero)', () => {
    expect(pricePerSqft(makeApt({ rent: 3000, sqft: 0 }))).toBeNull();
  });
});

describe('leaseFits — truth table (target 6–12)', () => {
  it('fits: listing 6–12 overlaps target → true', () => {
    expect(leaseFits(makeApt({ minLeaseMonths: 6, maxLeaseMonths: 12 }), settings)).toBe(true);
  });

  it("can't fit: listing 18–24 entirely above target → false", () => {
    expect(leaseFits(makeApt({ minLeaseMonths: 18, maxLeaseMonths: 24 }), settings)).toBe(false);
  });

  it("can't fit: listing min 13 (>tMax 12) → false", () => {
    expect(
      leaseFits(makeApt({ minLeaseMonths: 13, maxLeaseMonths: 13, leaseTermMonths: 13 }), settings),
    ).toBe(false);
  });

  it('unknown: both bounds null (no lease info) → null', () => {
    expect(
      leaseFits(makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: null }), settings),
    ).toBe(null);
  });

  it('one-sided open: only leaseTermMonths=12 known → fits (true)', () => {
    expect(
      leaseFits(makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: 12 }), settings),
    ).toBe(true);
  });

  it('one-sided: only min=18 known (hi open) → does not fit (false)', () => {
    expect(
      leaseFits(makeApt({ minLeaseMonths: 18, maxLeaseMonths: null, leaseTermMonths: null }), settings),
    ).toBe(false);
  });

  it('one-sided: only max=12 known (lo open) → fits (true)', () => {
    expect(
      leaseFits(makeApt({ minLeaseMonths: null, maxLeaseMonths: 12, leaseTermMonths: null }), settings),
    ).toBe(true);
  });

  it('lo/hi fall back to leaseTermMonths when min/max null', () => {
    expect(
      leaseFits(makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: 18 }), settings),
    ).toBe(false);
  });

  it('app default is a single-point 6-mo goal (DEFAULT_SETTINGS)', () => {
    expect(DEFAULT_SETTINGS.targetMinLease).toBe(6);
    expect(DEFAULT_SETTINGS.targetMaxLease).toBe(6);
  });

  it('open target (both null) → anything with lease info fits', () => {
    const openTarget: Settings = { ...settings, targetMinLease: null, targetMaxLease: null };
    expect(leaseFits(makeApt({ minLeaseMonths: 18, maxLeaseMonths: 24 }), openTarget)).toBe(true);
  });
});

describe('isMonthToMonth', () => {
  it('min 1, open-ended → true', () =>
    expect(isMonthToMonth(makeApt({ minLeaseMonths: 1, maxLeaseMonths: null, leaseTermMonths: null }))).toBe(true));
  it('exact 1-mo term alone → true', () =>
    expect(isMonthToMonth(makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: 1 }))).toBe(true));
  it('a 1–12 range has a ceiling → false', () =>
    expect(isMonthToMonth(makeApt({ minLeaseMonths: 1, maxLeaseMonths: 12, leaseTermMonths: null }))).toBe(false));
  it('a fixed 12-mo term → false', () =>
    expect(isMonthToMonth(makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: 12 }))).toBe(false));
});

describe('leaseSummary — consolidated friendly labels', () => {
  const lease = (leaseTermMonths: number | null, minLeaseMonths: number | null, maxLeaseMonths: number | null) =>
    leaseSummary(makeApt({ leaseTermMonths, minLeaseMonths, maxLeaseMonths }));
  it('month-to-month (min 1, open-ended)', () => expect(lease(null, 1, null)).toBe('Month-to-month'));
  it('month-to-month (exact 1-mo term)', () => expect(lease(1, null, null)).toBe('Month-to-month'));
  it('flexible: offers monthly AND fixed terms up to a ceiling', () =>
    expect(lease(null, 1, 18)).toBe('Flexible (1–18 mo)'));
  it('short-term: a fixed term under 6 months', () => expect(lease(3, null, null)).toBe('Short-term (3 mo)'));
  it('exact term ≥ 6 stays compact', () => expect(lease(9, null, null)).toBe('9 mo'));
  it('exact 12-mo (the standard year lease)', () => expect(lease(12, null, null)).toBe('12 mo'));
  it('min–max range', () => expect(lease(null, 6, 12)).toBe('6–12 mo'));
  it('min === max collapses to exact', () => expect(lease(null, 6, 6)).toBe('6 mo'));
  it('min only → open-ended', () => expect(lease(null, 6, null)).toBe('6+ mo'));
  it('max only → upper bound', () => expect(lease(null, null, 12)).toBe('≤12 mo'));
  it('nothing known → "" (the amber "not stated" flag covers it)', () => expect(lease(null, null, null)).toBe(''));
});

describe('amenCount', () => {
  it('counts only definitive yes (false excluded)', () => {
    const apt = makeApt({ amen: { parking: true, gym: false } });
    expect(amenCount(apt)).toBe(1);
  });
  it('0 when all unknown', () => {
    expect(amenCount(makeApt({ amen: {} }))).toBe(0);
  });
  it('counts laundry as an amenity (in-unit/on-site = has laundry)', () => {
    expect(amenCount(makeApt({ laundry: 'on-site', amen: {} }))).toBe(1);
    expect(amenCount(makeApt({ laundry: 'none', amen: {} }))).toBe(0);
  });
  it('all tracked when all true (laundry + parking + gym + balcony = 4)', () => {
    const apt = makeApt({ laundry: 'in-unit', amen: { parking: true, gym: true, balcony: true } });
    expect(amenCount(apt)).toBe(4);
  });
});
