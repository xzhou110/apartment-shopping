import type { Apartment, Settings } from '../types';
import { AMENITIES } from '../data/amenities';
import { amenState } from './format';

/**
 * Rent per square foot. null if sqft is null or 0 (can't divide). Two decimals.
 * Uses base rent (not any computed/effective monthly) — it's a sticker/size metric.
 */
export function pricePerSqft(apt: Apartment): number | null {
  if (apt.sqft == null || apt.sqft === 0) return null;
  return +(apt.rent / apt.sqft).toFixed(2);
}

/**
 * Does this listing's lease window overlap the user's target window?
 * Uses Settings.targetMinLease / targetMaxLease (defaults 6 / 12).
 *   true  — the listing can be signed for SOME term within [targetMin, targetMax].
 *   false — it cannot (its allowable range is entirely outside the target window).
 *   null  — not enough lease info on the listing to decide.
 *
 * Listing's allowable range:
 *   lo = minLeaseMonths ?? leaseTermMonths ?? null
 *   hi = maxLeaseMonths ?? leaseTermMonths ?? null
 * If both lo and hi are null → return null (unknown).
 * If only one bound is known, treat the unknown side as open (lo→0, hi→Infinity)
 * for the overlap test — we only claim "false" when we're sure it can't fit.
 * Target bounds: tMin = targetMinLease ?? 0, tMax = targetMaxLease ?? Infinity.
 * Fit = (lo ?? 0) <= tMax && (hi ?? Infinity) >= tMin.
 */
export function leaseFits(apt: Apartment, settings: Settings): boolean | null {
  const lo = apt.minLeaseMonths ?? apt.leaseTermMonths ?? null;
  const hi = apt.maxLeaseMonths ?? apt.leaseTermMonths ?? null;
  if (lo == null && hi == null) return null;

  const tMin = settings.targetMinLease ?? 0;
  const tMax = settings.targetMaxLease ?? Infinity;

  return (lo ?? 0) <= tMax && (hi ?? Infinity) >= tMin;
}

/**
 * Month-to-month: shortest term is 1 month with no fixed longer commitment (max/term open or also 1).
 * A range like min 1 / max 12 is NOT month-to-month — it has a 12-mo ceiling (it OFFERS monthly
 * billing, rendered as "Flexible" by leaseSummary). Single source of truth — flags.ts (the green
 * flag) and leaseSummary (the card label) both key off this.
 */
export function isMonthToMonth(apt: Apartment): boolean {
  const lo = apt.minLeaseMonths ?? apt.leaseTermMonths;
  const hiFixed = apt.maxLeaseMonths ?? apt.leaseTermMonths;
  return lo === 1 && (hiFixed == null || hiFixed === 1);
}

/**
 * Friendly lease-term label from a listing's term/min/max — the card/detail/compare/export value.
 * Consolidated vocabulary (2026-07-06):
 *   "Month-to-month"      — open-ended 1-mo commitment (isMonthToMonth)
 *   "Flexible (1–N mo)"   — offers monthly AND fixed terms up to N (min 1 with a ceiling)
 *   "Short-term (N mo)"   — a fixed term under 6 months
 *   "N mo"                — one fixed term (exact term, or min === max)
 *   "N–M mo"              — a range of fixed terms
 *   "N+ mo" / "≤N mo"     — only one bound known
 *   ''                    — nothing known (row hides; the amber "not stated" flag covers it)
 */
export function leaseSummary(apt: Apartment): string {
  if (isMonthToMonth(apt)) return 'Month-to-month';
  const t = apt.leaseTermMonths;
  if (t != null) return t < 6 ? `Short-term (${t} mo)` : `${t} mo`;
  const lo = apt.minLeaseMonths;
  const hi = apt.maxLeaseMonths;
  if (lo === 1 && hi != null) return `Flexible (1–${hi} mo)`;
  if (lo != null && hi != null) return lo === hi ? `${lo} mo` : `${lo}–${hi} mo`;
  if (lo != null) return `${lo}+ mo`;
  if (hi != null) return `≤${hi} mo`;
  return '';
}

/**
 * Does a user comment call out the income-restricted eligibility gate? ("income restricted",
 * "income-restricted", any case/spacing.) Such comments render highlighted RED wherever comments
 * show (card "Your note" + detail thread) — income qualification is a hard gate, not a nice-to-know.
 */
export function isIncomeRestrictedComment(text: string): boolean {
  return /income[\s-]*restricted/i.test(text);
}

/** Total amenities in the "X/N" tally: the tracked tri-state amenities PLUS the laundry field. */
export const AMENITY_TOTAL = AMENITIES.length + 1;

/**
 * Count of amenities the listing definitively HAS ('yes'), out of AMENITY_TOTAL. Includes the
 * dedicated `laundry` field (in-unit or on-site = has laundry) so the card's "X/N" matches the
 * pills shown — laundry is rendered as a pill but isn't part of AMENITIES. amenState honors
 * AMENITY_IMPLIES. Also drives the "most amenities" compare-row highlight.
 */
export function amenCount(apt: Apartment): number {
  const tri = AMENITIES.reduce((n, [k]) => n + (amenState(apt, k) === 'yes' ? 1 : 0), 0);
  const laundryYes = apt.laundry === 'in-unit' || apt.laundry === 'on-site' ? 1 : 0;
  return tri + laundryYes;
}
