import { describe, it, expect } from 'vitest';
import { pricePerSqft, leaseFits, amenCount } from './derive';
import { makeApt } from './_fixtures';
import { DEFAULT_SETTINGS } from '../types';
import type { Settings } from '../types';

const settings: Settings = DEFAULT_SETTINGS; // target 6–12

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

  it('target defaults to 6–12 when settings bounds present (DEFAULT_SETTINGS)', () => {
    expect(DEFAULT_SETTINGS.targetMinLease).toBe(6);
    expect(DEFAULT_SETTINGS.targetMaxLease).toBe(12);
  });

  it('open target (both null) → anything with lease info fits', () => {
    const openTarget: Settings = { ...settings, targetMinLease: null, targetMaxLease: null };
    expect(leaseFits(makeApt({ minLeaseMonths: 18, maxLeaseMonths: 24 }), openTarget)).toBe(true);
  });
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
  it('all tracked when all true (laundry + parking + gym = 3)', () => {
    const apt = makeApt({ laundry: 'in-unit', amen: { parking: true, gym: true } });
    expect(amenCount(apt)).toBe(3);
  });
});
