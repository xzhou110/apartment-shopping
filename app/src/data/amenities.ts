import type { AmenityKey } from '../types';

/**
 * Canonical amenity catalog: [key, shortLabel, longLabel], in display order.
 * Order matches the frozen AmenityKey union in types.ts and drives card pills, the
 * detail checklist, the compare table, and the export columns. Contract §8.
 */
export const AMENITIES: ReadonlyArray<readonly [AmenityKey, string, string]> = [
  ['parking', 'Parking', 'Parking'],
  ['woodenFloor', 'Wood floor', 'Wooden floor'],
  ['balcony', 'Balcony', 'Balcony / patio'],
  ['gym', 'Gym', 'On-site gym'],
];

/**
 * One-way amenity subsumption — having KEY implies each listed amenity is present too.
 * Shipped EMPTY: there is no obvious one-way implication among these (a gym does NOT
 * imply a pool, etc.). The mechanism stays wired in amenState() (lib/format.ts) so a
 * future implication is a one-line data change here. Contract §8.
 */
export const AMENITY_IMPLIES: Partial<Record<AmenityKey, readonly AmenityKey[]>> = {};
