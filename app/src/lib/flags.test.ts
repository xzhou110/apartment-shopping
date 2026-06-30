import { describe, it, expect } from 'vitest';
import { getFlags, signalLevel, type FlagCtx } from './flags';
import { makeApt } from './_fixtures';
import { DEFAULT_SETTINGS } from '../types';
import type { Coord } from './distance';

const TODAY = '2026-06-29';
const SF: Coord = { lat: 37.7793, lng: -122.4193 };

/** Base ctx: target 6–12, no anchor, fixed today. */
function ctx(overrides: Partial<FlagCtx> = {}): FlagCtx {
  return { settings: DEFAULT_SETTINGS, primaryAnchor: null, today: TODAY, ...overrides };
}

const has = (apt: Parameters<typeof getFlags>[0], c: FlagCtx, t: string) =>
  getFlags(apt, c).some((f) => f.t.includes(t));

// ---- risk -----------------------------------------------------------------
describe('risk: lease window can\'t be met', () => {
  it('fires on leaseFits === false', () => {
    const apt = makeApt({ minLeaseMonths: 18, maxLeaseMonths: 24 });
    const f = getFlags(apt, ctx());
    expect(f.some((x) => x.lvl === 'risk' && x.t.includes("doesn't fit"))).toBe(true);
  });
  it('does NOT fire on null (unknown lease info)', () => {
    const apt = makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: null });
    expect(getFlags(apt, ctx()).some((x) => x.lvl === 'risk')).toBe(false);
  });
});

// ---- warn -----------------------------------------------------------------
describe('warn rules', () => {
  it('no laundry (none in-unit or on-site)', () => {
    expect(has(makeApt({ laundry: 'none' }), ctx(), 'No laundry')).toBe(true);
  });
  it('on-site laundry does NOT trip the no-laundry warn', () => {
    expect(has(makeApt({ laundry: 'on-site' }), ctx(), 'No laundry')).toBe(false);
  });
  it('no parking', () => {
    expect(has(makeApt({ amen: { parking: false } }), ctx(), 'No parking')).toBe(true);
  });
  it('over market (> 1.05×)', () => {
    expect(has(makeApt({ rent: 3200, marketRent: 3000 }), ctx(), 'over comparable market')).toBe(true);
  });
  it('NOT over market at exactly 1.05× (strict >)', () => {
    expect(has(makeApt({ rent: 3150, marketRent: 3000 }), ctx(), 'over comparable market')).toBe(false);
  });
  it('utilities not included', () => {
    expect(has(makeApt({ utilitiesIncluded: false }), ctx(), 'Utilities not included')).toBe(true);
  });
  it('available date passed (before today)', () => {
    expect(has(makeApt({ availableDate: '2026-05-01' }), ctx(), 'available date has passed')).toBe(true);
  });
  it('available date in the future does NOT fire', () => {
    expect(has(makeApt({ availableDate: '2026-08-01' }), ctx(), 'available date has passed')).toBe(false);
  });
});

// ---- info -----------------------------------------------------------------
describe('info rules', () => {
  it('unfurnished for short-term (target max ≤ 12)', () => {
    expect(has(makeApt({ furnished: false }), ctx(), 'extra setup cost')).toBe(true);
  });
  it('broker fee present', () => {
    expect(has(makeApt({ brokerFee: 1200 }), ctx(), 'Broker fee')).toBe(true);
  });
  it('far from primary anchor (> 10 mi) — San Jose apt vs SF anchor', () => {
    const farApt = makeApt({ lat: 37.2956, lng: -121.8941 }); // San Jose ≈ 42 mi
    expect(has(farApt, ctx({ primaryAnchor: SF }), 'farther than most')).toBe(true);
  });
  it('near apt does NOT trip the far flag', () => {
    const nearApt = makeApt({ lat: 37.78, lng: -122.42 }); // ~0 mi from SF anchor
    expect(has(nearApt, ctx({ primaryAnchor: SF }), 'farther than most')).toBe(false);
  });
  it('far flag never fires without an anchor', () => {
    const farApt = makeApt({ lat: 37.2956, lng: -121.8941 });
    expect(has(farApt, ctx({ primaryAnchor: null }), 'farther than most')).toBe(false);
  });
  it('stale listing (≥ 30 days)', () => {
    expect(has(makeApt({ daysOnMarket: 41 }), ctx(), 'negotiation leverage')).toBe(true);
  });
  it('well below market (< 0.85×)', () => {
    expect(has(makeApt({ rent: 2400, marketRent: 3000 }), ctx(), 'well below market')).toBe(true);
  });
});

// ---- good -----------------------------------------------------------------
describe('good rule: low-friction short-term fit', () => {
  it('in-unit laundry + parking + furnished + leaseFits=true', () => {
    const apt = makeApt({
      laundry: 'in-unit',
      amen: { parking: true },
      furnished: true,
      minLeaseMonths: 6,
      maxLeaseMonths: 12,
    });
    const f = getFlags(apt, ctx());
    expect(f.some((x) => x.lvl === 'good' && x.t.includes('low-friction'))).toBe(true);
  });
});

// ---- order + signalLevel --------------------------------------------------
describe('flag order: risk pushed before warn/info/good', () => {
  it('risk appears first when both risk and warn fire', () => {
    const apt = makeApt({
      minLeaseMonths: 18, // risk: can't fit
      maxLeaseMonths: 24,
      amen: { parking: false }, // warn
    });
    const f = getFlags(apt, ctx());
    expect(f[0].lvl).toBe('risk');
  });
});

describe('signalLevel escalation', () => {
  it('any risk → risk', () => {
    const apt = makeApt({ minLeaseMonths: 18, maxLeaseMonths: 24 });
    expect(signalLevel(apt, ctx())).toBe('risk');
  });
  it('warn (no risk) → warn', () => {
    const apt = makeApt({ amen: { parking: false } });
    expect(signalLevel(apt, ctx())).toBe('warn');
  });
  it('good only → good', () => {
    const apt = makeApt({
      laundry: 'in-unit',
      amen: { parking: true },
      furnished: true,
      minLeaseMonths: 6,
      maxLeaseMonths: 12,
    });
    expect(signalLevel(apt, ctx())).toBe('good');
  });
  it('nothing fires → ""', () => {
    // neutral: lease fits, no market/amenity/date signals, furnished true so no unfurnished info
    const apt = makeApt({ furnished: true, laundry: 'in-unit', amen: { parking: true } });
    expect(signalLevel(apt, ctx())).toBe('good'); // this combo also hits good
  });
  it('truly empty signal → ""', () => {
    // lease fits (true) but not the full good combo (furnished unknown), nothing else fires
    const apt = makeApt({ furnished: null });
    expect(signalLevel(apt, ctx())).toBe('');
  });
});
