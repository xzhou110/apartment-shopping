import type { Apartment, Flag, SignalLevel, Settings } from '../types';
import type { Coord } from './distance';
import { distanceToAnchor } from './distance';
import { isMonthToMonth, leaseFits } from './derive';
import { amenState, money, shortDate } from './format';

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
 * except via the injectable ctx.today.
 *
 * Order (2026-07-15, user): RED (risk) flags always sort to the TOP — enforced by a stable
 * partition on the way out, so it holds for any future rule too. Within the risks, insertion
 * order sets precedence: scam (the "don't touch this" override) > income-restricted (a hard
 * eligibility gate) > lease-conflict. After the risks, the earlier rule (2026-07-07) still
 * applies: the LEASE-TERM flag — whatever its level (warn / good) — leads the remaining
 * warns, infos, goods, because lease fit is the user's #1 decision factor. The card previews
 * only the first 3 flags, so this order guarantees the dealbreakers + the lease verdict are
 * always visible.
 */
export function getFlags(apt: Apartment, ctx: FlagCtx): Flag[] {
  const f: Flag[] = [];
  const { settings } = ctx;
  const unit = settings.distanceUnit || 'mi';
  const tMin = settings.targetMinLease ?? 6;
  const tMax = settings.targetMaxLease ?? 6;
  // "6 mo" for a single-point goal, "6–12 mo" for a range — used in the lease flag copy.
  const goalLabel = tMin === tMax ? `${tMin} mo` : `${tMin}–${tMax} mo`;

  // ---- scam (absolute first) ---------------------------------------------
  // Possible scam — pushed FIRST so it's the top (red) flag on the card. Set by hand
  // (apt.scamRisk) when the listing shows scam signals; the specifics live in notes.
  if (apt.scamRisk)
    f.push({ lvl: 'risk', t: 'Possible scam — verify the listing before you contact or pay.' });

  // Income-restricted (affordable/AMI) housing — a hard ELIGIBILITY gate, not a price signal:
  // if you don't income-qualify, nothing else about the listing matters. Set by hand
  // (apt.incomeRestricted) when I add such a listing (e.g. a20/a24); program specifics live in notes.
  if (apt.incomeRestricted)
    f.push({
      lvl: 'risk',
      t: 'Income-restricted — you must income-qualify to rent; check the income cap before you invest time.',
    });

  // ---- lease term (the first flag after any risks, whatever its level) ----
  // Lease window can't be met — only fires on a definite false, never null.
  if (leaseFits(apt, settings) === false)
    f.push({
      lvl: 'risk',
      t: apt.leaseTermMonths != null
        ? `Lease is a stated ${apt.leaseTermMonths} mo term — doesn't fit your ${goalLabel} goal; ask if they'll do ${goalLabel}.`
        : `Lease window doesn't fit your ${goalLabel} goal.`,
    });

  // No lease term stated at all (leaseFits can't decide → null). You can't tell whether it fits your
  // goal until you ask, so surface an amber caveat rather than silently passing.
  if (leaseFits(apt, settings) === null)
    f.push({
      lvl: 'warn',
      t: `Lease term not stated — confirm they'll do a ${goalLabel} term.`,
    });

  // A stated single lease term at/above your target max, but ONLY for a RANGE goal (tMax > tMin):
  // e.g. a 12-mo term can satisfy a 6–12 window yet a landlord's fixed year-long default signals they
  // may not flex to the shorter end, so it's worth a caveat even when leaseFits() says true. For a
  // single-point goal (tMin === tMax) this doesn't apply: a matching term is a perfect fit, and a
  // longer term is already the risk flag above — so we skip it to avoid a redundant/wrong warning.
  if (apt.leaseTermMonths != null && apt.leaseTermMonths >= tMax && tMax > tMin)
    f.push({
      lvl: 'warn',
      t: `Lease is a stated ${apt.leaseTermMonths} mo term — at/above your ${tMax}-mo max; confirm they'll flex shorter.`,
    });

  // Month-to-month = the most flexible term there is (leave on ~30 days' notice), so it always
  // accommodates a short goal → a green highlight, shown up here (not with the other goods)
  // because it IS the lease verdict for such listings.
  if (isMonthToMonth(apt))
    f.push({
      lvl: 'good',
      t: `Month-to-month lease — maximum flexibility, easily fits your ${goalLabel} goal.`,
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

  // Rolling-availability communities list units as "Currently unavailable" — worth a caveat, not a
  // dealbreaker: the fix is one phone call. Only when no exact date is stated (a date wins) — and
  // "stated" means a VALID date, the same shortDate() predicate availabilityLabel uses, so the
  // amber label and this warn can never disagree on a malformed date string.
  if (apt.availability === 'unavailable' && !shortDate(apt.availableDate))
    f.push({
      lvl: 'warn',
      t: "Listed unit shows currently unavailable — call to ask what's actually open.",
    });

  // ---- info -------------------------------------------------------------
  // (The "Unfurnished — extra setup cost" info flag was removed 2026-07-07: the user brings
  // their own furniture, so it was pure noise. The furnished field/filter itself stays.)
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

  // RED flags always surface first (user rule 2026-07-15). Stable partition: relative order is
  // preserved within each group, so scam > income-restricted > lease-conflict holds among the
  // risks, and the lease-verdict-leads rule holds among the rest.
  return [...f.filter((x) => x.lvl === 'risk'), ...f.filter((x) => x.lvl !== 'risk')];
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
