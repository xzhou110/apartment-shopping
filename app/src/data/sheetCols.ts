import type { LaundryType, SheetCol, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { AMENITIES } from './amenities';
import { pricePerSqft } from '../lib/derive';
import { amenState } from '../lib/format';

/** Concise spreadsheet cell for laundry (kept here so the data layer stays UI-free). */
const LAUNDRY_CELL: Record<LaundryType, string> = {
  'in-unit': 'In-unit',
  'on-site': 'On-site',
  none: 'None',
  unknown: '?',
};

/**
 * Export/spreadsheet column order for apartments (contract §9). [title, accessor].
 * First export row = titles; one row per apt. Mirrors garage's buildSheetCols structure:
 * raw cost fields are tracked/exported as plain values (NO computed effective-monthly /
 * move-in-cost columns — those were cut 2026-06-29), one derived rent/sqft column, and all
 * 10 amenities as Yes/No/? via amenState. `settings` is taken for parity/forward-compat.
 */
export function buildSheetCols(settings: Settings = DEFAULT_SETTINGS): SheetCol[] {
  // settings is reserved for forward-compat (e.g. titling a column with the lease target);
  // v1 columns do not vary by settings. Reference it so the param isn't dead.
  void settings;
  return [
    ['Status', (a) => a.status || ''],
    ['ID', (a) => a.id || ''],
    ['Title', (a) => a.title || ''],
    ['Address', (a) => a.address || ''],
    ['Neighborhood', (a) => a.neighborhood || ''],
    ['City', (a) => a.city || ''],

    ['Beds', (a) => a.beds ?? ''],
    ['Baths', (a) => a.baths ?? ''],
    ['Sqft', (a) => a.sqft ?? ''],
    ['Floor', (a) => a.floor || ''],
    ['Laundry', (a) => LAUNDRY_CELL[a.laundry] || ''],

    ['Rent', (a) => a.rent ?? ''],
    ['Parking cost', (a) => a.parkingCost ?? ''],
    ['Pet rent', (a) => a.petRent ?? ''],
    [
      'Utilities incl',
      (a) =>
        a.utilitiesIncluded === true
          ? 'Yes'
          : a.utilitiesIncluded === false
            ? 'No'
            : '',
    ],
    ['Utilities est', (a) => a.utilitiesEstimate ?? ''],

    ['Deposit', (a) => a.deposit ?? ''],
    ['App fee', (a) => a.appFee ?? ''],
    ['Broker fee', (a) => a.brokerFee ?? ''],

    ['Lease term', (a) => a.leaseTermMonths ?? ''],
    ['Min lease', (a) => a.minLeaseMonths ?? ''],
    ['Max lease', (a) => a.maxLeaseMonths ?? ''],
    ['Available', (a) => a.availableDate || ''],
    [
      'Furnished',
      (a) => (a.furnished === true ? 'Yes' : a.furnished === false ? 'No' : ''),
    ],

    ['Pet policy', (a) => a.petPolicy || ''],
    ['Listing type', (a) => a.listingType || ''],

    ['Days on market', (a) => a.daysOnMarket ?? ''],
    ['Market rent', (a) => a.marketRent ?? ''],
    ['Rent/sqft', (a) => pricePerSqft(a) ?? ''],

    ['Expert rating', (a) => a.expertRating ?? ''],
    ['Your rating', (a) => a.rating ?? ''],

    ...AMENITIES.map(([k, , long]): SheetCol => [
      long,
      (a) => {
        const s = amenState(a, k);
        return s === 'yes' ? 'Yes' : s === 'no' ? 'No' : '?';
      },
    ]),
    ['Other amenities', (a) => (a.amenities || []).join('; ')],

    ['Notes', (a) => a.notes || ''],
    ['Listing URL', (a) => a.sourceUrl || ''],
  ];
}

/** Default columns (default Settings). In-app exports rebuild with the user's settings. */
export const SHEET_COLS: SheetCol[] = buildSheetCols();
