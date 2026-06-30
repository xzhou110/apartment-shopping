import type { Apartment } from '../types';

/** A bare lat/lng pair — the local geo alias (NOT exported from types; the lib owns it). */
export interface Coord {
  lat: number;
  lng: number;
}

// Mean Earth radius (WGS84-ish) in each unit. Contract §1.
const EARTH_RADIUS = { mi: 3958.7613, km: 6371.0088 } as const;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Great-circle (haversine) distance between two coordinates.
 * Returns a non-negative number; 0 for identical points. Pure, no rounding
 * (callers round for display). `unit` defaults to 'mi'.
 */
export function haversine(a: Coord, b: Coord, unit: 'mi' | 'km' = 'mi'): number {
  const R = EARTH_RADIUS[unit];
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  // clamp to [0,1] to guard against tiny FP overshoot before asin
  const c = 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  return R * c;
}

/**
 * Straight-line distance from an apartment to an anchor coord, in `unit`.
 * Returns null if the apartment has no lat/lng (either is null) OR anchor is null.
 * This null is the signal the UI uses to HIDE the distance chip — never a bogus number.
 */
export function distanceToAnchor(
  apt: Apartment,
  anchor: Coord | null,
  unit: 'mi' | 'km' = 'mi',
): number | null {
  if (anchor == null) return null;
  if (apt.lat == null || apt.lng == null) return null;
  return haversine({ lat: apt.lat, lng: apt.lng }, anchor, unit);
}

/**
 * Display string for a distance value: "≈ 3.2 mi" / "≈ 5.0 km".
 * One decimal place. null / undefined → em-dash "—". `unit` defaults to 'mi'.
 */
export function formatDistance(
  d: number | null | undefined,
  unit: 'mi' | 'km' = 'mi',
): string {
  if (d == null) return '—';
  return `≈ ${d.toFixed(1)} ${unit}`;
}
