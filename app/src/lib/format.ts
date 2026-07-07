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
 * Display label for WHEN the unit is available. An exact `availableDate` wins (formatted via
 * shortDate); otherwise the coarse `availability` status: 'now' → "Now", 'unavailable' →
 * "Unavailable — ask" (rolling communities: call to hear what's actually open). '' when unknown
 * (the row hides). (leaseSummary — the term label — lives in lib/derive with the lease logic.)
 */
export function availabilityLabel(apt: Apartment): string {
  const d = shortDate(apt.availableDate);
  if (d) return d;
  if (apt.availability === 'now') return 'Now';
  if (apt.availability === 'unavailable') return 'Unavailable — ask';
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

/**
 * `tel:` href from a phone string (keeps digits, +, *, #). Recognizes a trailing extension
 * ("x66", "ext. 66") and encodes it as `;ext=` (RFC 3966) instead of merging its digits into the
 * main number — e.g. "(510) 899-5584 x 66" → "tel:5108995584;ext=66", not "tel:510899558466".
 * '' / no digits → undefined.
 */
export function telHref(phone: string | null | undefined): string | undefined {
  const raw = (phone || '').trim();
  const extMatch = raw.match(/^(.*?)\s*(?:x|ext\.?)\s*(\d+)\s*$/i);
  const mainPart = extMatch ? extMatch[1] : raw;
  const ext = extMatch ? extMatch[2] : '';
  const cleaned = mainPart.replace(/[^\d+*#]/g, '');
  if (!/\d/.test(cleaned)) return undefined;
  return 'tel:' + cleaned + (ext ? ';ext=' + ext : '');
}

/** `mailto:` href from an email. Requires a minimal `x@y` shape, else undefined. */
export function mailtoHref(email: string | null | undefined): string | undefined {
  const s = (email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? 'mailto:' + s : undefined;
}

/**
 * A website href for the contact block. Accepts a bare domain ("example.com") or a full URL and
 * normalizes to https. Rejects anything with a non-http(s) scheme (defense in depth). '' → undefined.
 */
export function siteHref(u: string | null | undefined): string | undefined {
  const s = (u || '').trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return undefined; // some other scheme (mailto:, javascript:, …) — reject
  return 'https://' + s;
}
