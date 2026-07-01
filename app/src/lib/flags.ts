import type { Apartment, Flag, SignalLevel, Settings } from '../types';
import type { Coord } from './distance';
import { distanceToAnchor } from './distance';
import { leaseFits } from './derive';
import { amenState, money } from './format';

/** Context the flag engine needs beyond the apartment itself. Contract §6. */
export interface FlagCtx {
  settings: Settings; // for targetMinLease / targetMaxLease / distanceUnit
  primaryAnchor: Coord | null; // resolved coord of the PRIMARY anchor (null if none/unresolved)
  today?: string; // ISO date, INJECTABLE for deterministic tests (default: new Date())
}

/** Far-from-anchor thresholds (contract §6 info rule): > 10 mi or > 16 km. */
const FAR_THRESHOLD = { mi: 10, km: 16 } as const;

/** Today as a date-only value (drops time) for stable "available date passed" comparison. */
function todayDate(ctx: FlagCtx): Date {
  const iso = ctx.today ?? new Date().toISOString().slice(0, 10);
  return new Date(iso + 'T00:00:00');
}

/** Parse an ISO date string to a date-only Date, or null if empty/invalid. */
function parseDate(iso: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso.slice(0, 10) + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Risk / warn / info / good flags for one apartment. PURE: no DOM, no Date.now()
 * except via the injectable ctx.today. Order: risk first, then warn, info, good
 * (push in this order) so the card's first-3 preview shows the most severe first.
 */
export function getFlags(apt: Apartment, ctx: FlagCtx): Flag[] {
  const f: Flag[] = [];
  const { settings } = ctx;
  const unit = settings.distanceUnit || 'mi';
  const tMin = settings.targetMinLease ?? 6;
  const tMax = settings.targetMaxLease ?? 12;

  // ---- risk -------------------------------------------------------------
  // Possible scam — pushed FIRST so it's the top (red) flag on the card. Set by hand
  // (apt.scamRisk) when the listing shows scam signals; the specifics live in notes.
  if (apt.scamRisk)
    f.push({ lvl: 'risk', t: 'Possible scam — verify the listing before you contact or pay.' });

  // Lease window can't be met — only fires on a definite false, never null.
  if (leaseFits(apt, settings) === false)
    f.push({
      lvl: 'risk',
      t: `Lease window doesn't fit your ${tMin}–${tMax} mo goal.`,
    });

  // ---- warn -------------------------------------------------------------
  if (apt.laundry === 'none')
    f.push({ lvl: 'warn', t: 'No laundry — none in-unit or on-site.' });

  if (amenState(apt, 'parking') === 'no')
    f.push({ lvl: 'warn', t: 'No parking.' });

  if (apt.marketRent != null && apt.rent > apt.marketRent * 1.05)
    f.push({
      lvl: 'warn',
      t: `Rent ~${money(apt.rent - apt.marketRent)} over comparable market.`,
    });

  if (apt.utilitiesIncluded === false)
    f.push({
      lvl: 'warn',
      t: 'Utilities not included — budget extra on top of rent.',
    });

  {
    const avail = parseDate(apt.availableDate);
    if (avail != null && avail < todayDate(ctx))
      f.push({
        lvl: 'warn',
        t: "Listed available date has passed — confirm it's still open.",
      });
  }

  // ---- info -------------------------------------------------------------
  if (apt.furnished === false && (settings.targetMaxLease ?? 0) <= 12)
    f.push({
      lvl: 'info',
      t: 'Unfurnished — extra setup cost for a short stay.',
    });

  if (apt.brokerFee != null && apt.brokerFee > 0)
    f.push({
      lvl: 'info',
      t: `Broker fee ${money(apt.brokerFee)} — one-time, non-refundable.`,
    });

  // Far from primary anchor — only when an anchor is set AND the apt has coords.
  {
    const dist = distanceToAnchor(apt, ctx.primaryAnchor, unit);
    if (dist != null && dist > FAR_THRESHOLD[unit])
      f.push({
        lvl: 'info',
        t: `≈ ${dist.toFixed(1)} ${unit} from your primary place — farther than most.`,
      });
  }

  if (apt.daysOnMarket != null && apt.daysOnMarket >= 30)
    f.push({
      lvl: 'info',
      t: `On market ${apt.daysOnMarket} days — possible negotiation leverage.`,
    });

  if (apt.marketRent != null && apt.rent < apt.marketRent * 0.85)
    f.push({
      lvl: 'info',
      t: 'Rent well below market — verify why (condition, fees, fine print).',
    });

  // ---- good -------------------------------------------------------------
  if (
    apt.laundry === 'in-unit' &&
    amenState(apt, 'parking') === 'yes' &&
    apt.furnished === true &&
    leaseFits(apt, settings) === true
  )
    f.push({
      lvl: 'good',
      t: 'Furnished, in-unit laundry, parking, fits your lease window — low-friction short stay.',
    });

  return f;
}

/**
 * Overall card signal, mirroring garage's rule:
 *   risk if any risk → warn if any warn → good if any good → '' otherwise.
 */
export function signalLevel(apt: Apartment, ctx: FlagCtx): SignalLevel {
  const f = getFlags(apt, ctx);
  if (f.some((x) => x.lvl === 'risk')) return 'risk';
  if (f.some((x) => x.lvl === 'warn')) return 'warn';
  if (f.some((x) => x.lvl === 'good')) return 'good';
  return '';
}
