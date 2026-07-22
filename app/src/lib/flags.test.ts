import { describe, it, expect } from 'vitest';
import { getFlags, signalLevel, type FlagCtx } from './flags';
import { makeApt } from './_fixtures';
import { DEFAULT_SETTINGS } from '../types';
import type { Coord } from './distance';

const TODAY = '2026-06-29';
const SF: Coord = { lat: 37.7793, lng: -122.4193 };

/** Base ctx: single-point 6-mo goal (DEFAULT_SETTINGS), no anchor, fixed today. */
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

describe('warn: no lease term stated (amber)', () => {
  it('fires an amber warn when no lease info at all (leaseFits === null)', () => {
    const apt = makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: null });
    const f = getFlags(apt, ctx());
    expect(f.some((x) => x.lvl === 'warn' && x.t.includes('Lease term not stated'))).toBe(true);
  });
  it('does NOT fire when a term IS stated', () => {
    expect(has(makeApt({ leaseTermMonths: 12 }), ctx(), 'Lease term not stated')).toBe(false);
  });
  it('does NOT fire when only a min bound is known', () => {
    expect(
      has(makeApt({ minLeaseMonths: 6, maxLeaseMonths: null, leaseTermMonths: null }), ctx(), 'Lease term not stated'),
    ).toBe(false);
  });
});

// ---- risk: scam -----------------------------------------------------------
describe('risk: possible scam', () => {
  it('scamRisk true → red risk flag, pushed first', () => {
    const f = getFlags(makeApt({ scamRisk: true }), ctx());
    expect(f[0].lvl).toBe('risk');
    expect(f[0].t.toLowerCase()).toContain('scam');
  });
  it('scamRisk false → no scam flag', () => {
    expect(has(makeApt({ scamRisk: false }), ctx(), 'scam')).toBe(false);
  });
});

// ---- risk: income-restricted ------------------------------------------------
describe('risk: income-restricted (hard eligibility gate)', () => {
  it('incomeRestricted true → red risk flag', () => {
    const f = getFlags(makeApt({ incomeRestricted: true }), ctx());
    const flag = f.find((x) => x.t.includes('Income-restricted'));
    expect(flag).toBeTruthy();
    expect(flag!.lvl).toBe('risk');
  });
  it('incomeRestricted false → no flag', () => {
    expect(has(makeApt({ incomeRestricted: false }), ctx(), 'Income-restricted')).toBe(false);
  });
  it('sorts to the TOP, above warns (red flags always first)', () => {
    // amber "lease not stated" + warn "no laundry" would otherwise lead
    const apt = makeApt({
      incomeRestricted: true,
      minLeaseMonths: null,
      maxLeaseMonths: null,
      leaseTermMonths: null,
      laundry: 'none',
    });
    const f = getFlags(apt, ctx());
    expect(f[0].lvl).toBe('risk');
    expect(f[0].t).toContain('Income-restricted');
  });
  it('scam stays first when both fire; income-restricted is second', () => {
    const f = getFlags(makeApt({ scamRisk: true, incomeRestricted: true }), ctx());
    expect(f[0].t.toLowerCase()).toContain('scam');
    expect(f[1].t).toContain('Income-restricted');
    expect(f[0].lvl).toBe('risk');
    expect(f[1].lvl).toBe('risk');
  });
  it('drives the card signal to risk (red top border)', () => {
    expect(signalLevel(makeApt({ incomeRestricted: true, leaseTermMonths: null }), ctx())).toBe('risk');
  });
});

// ---- ordering: red flags always on top ---------------------------------------
describe('flag ordering: risk (red) flags always sort first', () => {
  it('every risk flag precedes every non-risk flag (scam + income + red lease vs warns)', () => {
    const apt = makeApt({
      scamRisk: true,
      incomeRestricted: true,
      minLeaseMonths: 18, // red lease conflict
      maxLeaseMonths: 24,
      laundry: 'none', // warn
      utilitiesIncluded: false, // warn
    });
    const f = getFlags(apt, ctx());
    const lastRisk = f.map((x) => x.lvl).lastIndexOf('risk');
    const firstNonRisk = f.findIndex((x) => x.lvl !== 'risk');
    expect(lastRisk).toBeGreaterThanOrEqual(0);
    expect(firstNonRisk).toBeGreaterThan(lastRisk);
    // and the within-risk precedence: scam > income-restricted > lease
    expect(f[0].t.toLowerCase()).toContain('scam');
    expect(f[1].t).toContain('Income-restricted');
    expect(f[2].t).toContain('Lease');
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
  it("availability 'unavailable' (rolling community) → warn to call and ask", () => {
    expect(has(makeApt({ availability: 'unavailable' }), ctx(), 'currently unavailable')).toBe(true);
  });
  it("availability 'now' / 'unknown' do NOT fire the unavailable warn", () => {
    expect(has(makeApt({ availability: 'now' }), ctx(), 'currently unavailable')).toBe(false);
    expect(has(makeApt({ availability: 'unknown' }), ctx(), 'currently unavailable')).toBe(false);
  });
  it('a stated date suppresses the unavailable warn (the date wins)', () => {
    expect(
      has(makeApt({ availability: 'unavailable', availableDate: '2026-08-01' }), ctx(), 'currently unavailable'),
    ).toBe(false);
  });
  it('a MALFORMED date does not suppress the warn (same validity predicate as the label)', () => {
    expect(
      has(makeApt({ availability: 'unavailable', availableDate: '2026-8-1' }), ctx(), 'currently unavailable'),
    ).toBe(true);
  });
});

describe('warn: stated lease term at/above target max (RANGE goal only)', () => {
  // The "confirm they'll flex shorter" warn is a range-goal concern; use an explicit 6–12 window.
  const rangeCtx = ctx({ settings: { ...DEFAULT_SETTINGS, targetMinLease: 6, targetMaxLease: 12 } });
  it('fires at exactly the target max (12 mo — "1 year")', () => {
    expect(has(makeApt({ leaseTermMonths: 12 }), rangeCtx, 'stated 12 mo term')).toBe(true);
  });
  it('fires for a longer stated term too (e.g. 24 mo)', () => {
    expect(has(makeApt({ leaseTermMonths: 24 }), rangeCtx, 'stated 24 mo term')).toBe(true);
  });
  it('does NOT fire below the target max (e.g. 9 mo)', () => {
    expect(has(makeApt({ leaseTermMonths: 9 }), rangeCtx, 'mo term')).toBe(false);
  });
  it('does NOT fire when no single term is stated (null = unknown)', () => {
    expect(has(makeApt({ leaseTermMonths: null }), rangeCtx, 'mo term')).toBe(false);
  });
  it('respects a custom target max from settings', () => {
    const looseCtx = ctx({ settings: { ...DEFAULT_SETTINGS, targetMinLease: 6, targetMaxLease: 18 } });
    expect(has(makeApt({ leaseTermMonths: 12 }), looseCtx, 'mo term')).toBe(false);
    expect(has(makeApt({ leaseTermMonths: 18 }), looseCtx, 'mo term')).toBe(true);
  });
  it('does NOT fire for a single-point 6-mo goal at a 6-mo term (that IS the goal)', () => {
    // A 6-mo term perfectly matches the default 6-mo goal → no "flex shorter" warn.
    expect(has(makeApt({ leaseTermMonths: 6 }), ctx(), 'mo term')).toBe(false);
  });
});

// ---- info -----------------------------------------------------------------
describe('info rules', () => {
  it('unfurnished info flag was removed (2026-07-07, user brings own furniture)', () => {
    expect(has(makeApt({ furnished: false }), ctx(), 'extra setup cost')).toBe(false);
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
  it('time on market < 30 days: no flag', () => {
    expect(has(makeApt({ daysOnMarket: 20 }), ctx(), 'On market')).toBe(false);
  });
  it('time on market 30–60 days: AMBER warn (negotiation leverage)', () => {
    const m = getFlags(makeApt({ daysOnMarket: 41 }), ctx()).find((x) => x.t.includes('On market'));
    expect(m?.lvl).toBe('warn');
    expect(m?.t).toContain('negotiation leverage');
  });
  it('time on market boundary 60 days: still AMBER warn (not red)', () => {
    expect(getFlags(makeApt({ daysOnMarket: 60 }), ctx()).find((x) => x.t.includes('On market'))?.lvl).toBe('warn');
  });
  it('time on market > 60 days: RED risk (likely stale/outdated)', () => {
    const m = getFlags(makeApt({ daysOnMarket: 61 }), ctx()).find((x) => x.t.includes('On market'));
    expect(m?.lvl).toBe('risk');
    expect(m?.t).toContain('stale');
  });
  it('time on market > 60 days drives the red card signal + partitions ahead of non-risk flags', () => {
    const apt = makeApt({ daysOnMarket: 488 });
    expect(signalLevel(apt, ctx())).toBe('risk');
    const f = getFlags(apt, ctx());
    const firstNonRisk = f.findIndex((x) => x.lvl !== 'risk');
    if (firstNonRisk !== -1) expect(f.findIndex((x) => x.lvl === 'risk')).toBeLessThan(firstNonRisk);
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

describe('good rule: month-to-month is a green flag', () => {
  it('minLeaseMonths=1, open-ended → green "month-to-month" good flag', () => {
    const apt = makeApt({ minLeaseMonths: 1, maxLeaseMonths: null, leaseTermMonths: null });
    const f = getFlags(apt, ctx());
    expect(f.some((x) => x.lvl === 'good' && /month-to-month/i.test(x.t))).toBe(true);
  });
  it('leaseTermMonths=1 alone counts as month-to-month', () => {
    const apt = makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: 1 });
    expect(getFlags(apt, ctx()).some((x) => /month-to-month/i.test(x.t))).toBe(true);
  });
  it('a fixed 12-mo term is NOT month-to-month', () => {
    const apt = makeApt({ minLeaseMonths: null, maxLeaseMonths: null, leaseTermMonths: 12 });
    expect(getFlags(apt, ctx()).some((x) => /month-to-month/i.test(x.t))).toBe(false);
  });
  it('a 1–12 range (has a 12-mo ceiling) is NOT month-to-month', () => {
    const apt = makeApt({ minLeaseMonths: 1, maxLeaseMonths: 12, leaseTermMonths: null });
    expect(getFlags(apt, ctx()).some((x) => /month-to-month/i.test(x.t))).toBe(false);
  });
  it('month-to-month escalates the card signal to good', () => {
    // Isolate: furnished true (no unfurnished info), no other signals.
    const apt = makeApt({ minLeaseMonths: 1, maxLeaseMonths: null, leaseTermMonths: null, furnished: true });
    expect(signalLevel(apt, ctx())).toBe('good');
  });
});

// ---- order + signalLevel --------------------------------------------------
describe('flag order: scam first, then the lease-term flag, then the rest', () => {
  it('risk appears first when both risk and warn fire', () => {
    const apt = makeApt({
      minLeaseMonths: 18, // risk: can't fit
      maxLeaseMonths: 24,
      amen: { parking: false }, // warn
    });
    const f = getFlags(apt, ctx());
    expect(f[0].lvl).toBe('risk');
  });
  it('the lease flag leads even other warns (lease not stated + no parking)', () => {
    const apt = makeApt({
      leaseTermMonths: null,
      minLeaseMonths: null,
      maxLeaseMonths: null, // warn: lease term not stated
      amen: { parking: false }, // warn: no parking
    });
    const f = getFlags(apt, ctx());
    expect(f[0].t).toContain('Lease term not stated');
  });
  it('the GREEN month-to-month flag leads other warns too (lease is the #1 factor)', () => {
    const apt = makeApt({
      minLeaseMonths: 1,
      maxLeaseMonths: null,
      leaseTermMonths: null, // good: month-to-month
      laundry: 'none', // warn: no laundry
    });
    const f = getFlags(apt, ctx());
    expect(f[0].lvl).toBe('good');
    expect(f[0].t).toContain('Month-to-month');
  });
  it('scam stays absolutely first, ahead of the lease flag', () => {
    const apt = makeApt({ scamRisk: true, minLeaseMonths: 18, maxLeaseMonths: 24 });
    const f = getFlags(apt, ctx());
    expect(f[0].t.toLowerCase()).toContain('scam');
    expect(f[1].t).toContain('Lease');
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
      leaseTermMonths: null, // isolate from the "stated term at/above max" warn rule
    });
    expect(signalLevel(apt, ctx())).toBe('good');
  });
  it('nothing fires → ""', () => {
    // neutral: lease fits, no market/amenity/date signals, furnished true so no unfurnished info
    const apt = makeApt({ furnished: true, laundry: 'in-unit', amen: { parking: true }, leaseTermMonths: null });
    expect(signalLevel(apt, ctx())).toBe('good'); // this combo also hits good
  });
  it('truly empty signal → ""', () => {
    // lease fits (true) but not the full good combo (furnished unknown), nothing else fires
    const apt = makeApt({ furnished: null, leaseTermMonths: null });
    expect(signalLevel(apt, ctx())).toBe('');
  });
});
