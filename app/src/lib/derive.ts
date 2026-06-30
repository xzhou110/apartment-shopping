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
