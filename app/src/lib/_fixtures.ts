import type { Apartment } from '../types';

/**
 * Test-only Apartment factory. A fully-populated, neutral baseline (no flags fire by
 * default: clean rent vs market, lease info present and fitting, amenities unknown).
 * Override per-test. Shared across the lib/data specs so the long shape lives once.
 */
export function makeApt(overrides: Partial<Apartment> = {}): Apartment {
  return {
    id: 'x',
    status: 'New',
    title: 'Test Apt',
    address: '1 Test St, San Francisco, CA',
    neighborhood: 'Testville',
    city: 'San Francisco',
    lat: null,
    lng: null,
    beds: 1,
    baths: 1,
    sqft: 700,
    floor: '',
    laundry: 'unknown',
    rent: 3000,
    parkingCost: null,
    petRent: null,
    utilitiesIncluded: null,
    utilitiesEstimate: null,
    deposit: null,
    appFee: null,
    brokerFee: null,
    leaseTermMonths: 12,
    minLeaseMonths: 6,
    maxLeaseMonths: 12,
    availableDate: '',
    furnished: null,
    petPolicy: 'Unknown',
    listingType: 'Unknown',
    amen: {},
    amenities: [],
    dateSeen: '',
    daysOnMarket: null,
    marketRent: null,
    expertRating: 0,
    scamRisk: false,
    rating: 0,
    notes: '',
    image: '',
    sourceUrl: '',
    ...overrides,
  };
}
