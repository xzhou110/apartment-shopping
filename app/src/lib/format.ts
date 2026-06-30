import type { Apartment, AmenityKey, AmenState } from '../types';
import { AMENITY_IMPLIES } from '../data/amenities';

/** "$2,750" — em-dash for null/undefined (ported verbatim from garage). 0 renders as "$0". */
export function money(n: number | null | undefined): string {
  return n || n === 0 ? '$' + Number(n).toLocaleString('en-US') : '—';
}

/** "1,150" with thousands separators — em-dash for null/undefined. 0 renders "0". */
export function num(n: number | null | undefined): string {
  return n || n === 0 ? Number(n).toLocaleString('en-US') : '—';
}

/**
 * Tri-state for an amenity: 'yes' | 'no' | 'unk'. 'unk' must NEVER collapse to 'no'.
 * Honors AMENITY_IMPLIES: if a stronger amenity that implies `key` is true, this returns
 * 'yes' even if `key` itself is unset (mirror garage's featState). Reads apt.amen[key]:
 * true→'yes', false→'no', null/undefined→'unk' (unless implied).
 */
export function amenState(apt: Apartment, key: AmenityKey): AmenState {
  const amen = apt.amen || {};
  if (amen[key] === true) return 'yes';
  for (const src in AMENITY_IMPLIES) {
    if (
      AMENITY_IMPLIES[src as AmenityKey]!.includes(key) &&
      amen[src as AmenityKey] === true
    )
      return 'yes';
  }
  return amen[key] === false ? 'no' : 'unk';
}

/** Plain-text tri-state for export cells: 'yes'→"Yes", 'no'→"No", 'unk'→"?". */
export function yn(state: AmenState): string {
  return state === 'yes' ? 'Yes' : state === 'no' ? 'No' : '?';
}

/** 0–5 rating as filled/empty stars "★★★★☆" (ported from garage). */
export function stars(n: number): string {
  const v = Math.max(0, Math.min(5, Math.round(n || 0)));
  return '★'.repeat(v) + '☆'.repeat(5 - v);
}

/** "Studio" when beds === 0, else "{beds} bd" — small helper for cards/compare. */
export function bedsLabel(beds: number): string {
  return beds === 0 ? 'Studio' : `${beds} bd`;
}

/**
 * ISO "YYYY-MM-DD" → "Aug 1, 2026". '' / invalid → ''. Parsed by hand (no `new Date()`) so it
 * never shifts a day across time zones — the bug that made an "available today" date read as passed.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function shortDate(iso: string | null | undefined): string {
  const s = (iso || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '';
  const [y, m, d] = s.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return '';
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * Compact lease-term label from a listing's term/min/max. '' when nothing is known.
 * Prefers an exact term; else a min–max range; else an open-ended bound.
 */
export function leaseSummary(apt: Apartment): string {
  if (apt.leaseTermMonths != null) return `${apt.leaseTermMonths} mo`;
  const lo = apt.minLeaseMonths;
  const hi = apt.maxLeaseMonths;
  if (lo != null && hi != null) return lo === hi ? `${lo} mo` : `${lo}–${hi} mo`;
  if (lo != null) return `${lo}+ mo`;
  if (hi != null) return `≤${hi} mo`;
  return '';
}

/**
 * A safe link target: returns the trimmed URL only if it is http(s) or mailto, else undefined.
 * React escapes text but NOT URL schemes — a `javascript:` / `data:text/html` sourceUrl (typed in
 * the form, or arrived via pasted JSON) would execute on click. Use this everywhere apt.sourceUrl
 * becomes an <a href>, and at form-save time as defense in depth. (Code review M1.)
 */
export function safeHref(u: string | null | undefined): string | undefined {
  const s = (u || '').trim();
  return /^(https?:\/\/|mailto:)/i.test(s) ? s : undefined;
}
