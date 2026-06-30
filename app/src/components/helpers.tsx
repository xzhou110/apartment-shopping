// UI-layer helpers: orchestration that COMPOSES the pure lib/* engine (it never reimplements
// domain logic) plus presentational shared bits (asset URLs, flag icons, status classes).
import type { ReactElement } from 'react';
import type { Apartment, FlagLevel, LaundryType, ListingType, Settings, Status } from '../types';
import type { Coord } from '../lib/distance';
import { distanceToAnchor } from '../lib/distance';
import { amenState } from '../lib/format';
import { leaseFits, amenCount } from '../lib/derive';
import { IconCheck, IconInfo, IconRisk, IconWarn } from './icons';
import type { Filters, SortKey } from '../state/useApartments';

/** Resolve a public/ asset (e.g. "img/a1.jpg") against Vite's base so it works in dev and built dist/. */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:|\/\/)/i.test(path)) return path; // absolute / data / blob — leave as-is
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

/** Flag-level → the matching status icon (risk→risk, good→check, info→info, warn→warn). */
export function flagIcon(lvl: FlagLevel, className?: string): ReactElement {
  if (lvl === 'risk') return <IconRisk className={className} />;
  if (lvl === 'good') return <IconCheck className={className} />;
  if (lvl === 'info') return <IconInfo className={className} />;
  return <IconWarn className={className} />;
}

/** Status → badge color class. */
export const STATUS_BADGE: Record<Status, string> = {
  New: 'b-neutral',
  Shortlist: 'b-info',
  Contacted: 'b-info',
  Toured: 'b-info',
  Applied: 'b-warn',
  Rejected: 'b-risk',
  Leased: 'b-good',
  Gone: 'b-neutral',
};

/**
 * listingType → friendly "Listed by" label for the card pill + detail row. Captures the
 * private-owner-vs-company distinction the user wanted at a glance. '' = don't show the pill
 * (we don't surface "Unknown" — it'd be noise). The raw listingType stays the source of truth.
 */
export const LISTED_BY_LABEL: Record<ListingType, string> = {
  Landlord: 'Private owner',
  'Property mgmt': 'Property mgmt',
  Broker: 'Broker / agent',
  Sublet: 'Sublet',
  Unknown: '',
};

/** Card/detail label for the laundry field. */
export const LAUNDRY_LABEL: Record<LaundryType, string> = {
  'in-unit': 'In-unit laundry',
  'on-site': 'On-site laundry',
  none: 'No laundry',
  unknown: 'Laundry',
};

/** Pill color state for laundry: in-unit/on-site read positive, none negative, unknown muted. */
export function laundryState(l: LaundryType): 'yes' | 'no' | 'unk' {
  return l === 'in-unit' || l === 'on-site' ? 'yes' : l === 'none' ? 'no' : 'unk';
}

/**
 * Search + chip + panel filters (contract §10). Calls the pure lib for the conditional bits:
 * amenState (so required-amenity matching honors implications) and leaseFits (lease-fit filter).
 */
export function applyFilters(apts: Apartment[], f: Filters, settings: Settings): Apartment[] {
  const q = f.search.trim().toLowerCase();
  return apts.filter((a) => {
    if (q) {
      const hay = `${a.id || ''} ${a.title || ''} ${a.neighborhood || ''} ${a.city || ''} ${
        a.address || ''
      } ${(a.amenities || []).join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.hideRejected && a.status === 'Rejected') return false;
    if (!f.showGone && a.status === 'Gone') return false;
    if (f.maxRent != null && (a.rent == null || a.rent > f.maxRent)) return false;
    if (f.minBeds != null && (a.beds == null || a.beds < f.minBeds)) return false;
    if (f.furnishedOnly && a.furnished !== true) return false;
    // leaseFitsTarget requires a DEFINITE fit: a null/unknown lease does NOT pass (conservative, opt-in).
    if (f.leaseFitsTarget && leaseFits(a, settings) !== true) return false;
    // amenState (not raw a.amen) so amenity implications hold.
    for (const k of f.reqAmenities) {
      if (amenState(a, k) !== 'yes') return false;
    }
    return true;
  });
}

/**
 * Sort (contract §10). 'added' keeps insertion order. THE INTEGRATION TRAP: the 'nearest' sort
 * needs the resolved primary-anchor coord + unit passed in via ctx — App.tsx threads it; if you
 * forget, Nearest silently no-ops (all distances null → Infinity → stable). Nulls sink to the end.
 */
export function applySort(
  apts: Apartment[],
  sort: SortKey,
  ctx: { primaryAnchor: Coord | null; unit: 'mi' | 'km'; settings: Settings },
): Apartment[] {
  const arr = [...apts];
  const cmp: Partial<Record<SortKey, (a: Apartment, b: Apartment) => number>> = {
    nearest: (a, b) =>
      (distanceToAnchor(a, ctx.primaryAnchor, ctx.unit) ?? Infinity) -
      (distanceToAnchor(b, ctx.primaryAnchor, ctx.unit) ?? Infinity),
    'rent-asc': (a, b) => (a.rent ?? Infinity) - (b.rent ?? Infinity),
    'rent-desc': (a, b) => (b.rent ?? -Infinity) - (a.rent ?? -Infinity),
    'beds-desc': (a, b) => (b.beds ?? -Infinity) - (a.beds ?? -Infinity),
    'sqft-desc': (a, b) => (b.sqft ?? -Infinity) - (a.sqft ?? -Infinity),
    'you-desc': (a, b) => (b.rating || 0) - (a.rating || 0),
    'expert-desc': (a, b) => (b.expertRating || 0) - (a.expertRating || 0),
  };
  const fn = cmp[sort];
  if (fn) arr.sort(fn);
  return arr;
}

// Re-export for compare-row "most amenities" highlight callers.
export { amenCount };
