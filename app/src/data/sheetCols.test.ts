import { describe, it, expect } from 'vitest';
import { buildSheetCols, SHEET_COLS } from './sheetCols';
import { AMENITIES } from './amenities';
import { DEFAULT_SETTINGS } from '../types';
import { makeApt } from '../lib/_fixtures';

describe('buildSheetCols', () => {
  it('returns a stable column list (default == builder with default settings)', () => {
    const built = buildSheetCols(DEFAULT_SETTINGS);
    expect(built.map((c) => c[0])).toEqual(SHEET_COLS.map((c) => c[0]));
  });

  it('column order matches the contract §9 head', () => {
    const titles = SHEET_COLS.map((c) => c[0]);
    expect(titles.slice(0, 10)).toEqual([
      'Status', 'ID', 'Title', 'Address', 'Neighborhood', 'City',
      'Beds', 'Baths', 'Sqft', 'Floor',
    ]);
  });

  it('includes all tracked amenities as long labels', () => {
    const titles = SHEET_COLS.map((c) => c[0]);
    for (const [, , long] of AMENITIES) expect(titles).toContain(long);
  });

  it('accessors produce expected cells', () => {
    const a = makeApt({
      id: 'a1',
      rent: 3000,
      sqft: 750,
      furnished: false,
      utilitiesIncluded: true,
      amenities: ['Roof deck', 'Bike room'],
      amen: { parking: true },
    });
    const cell = (title: string) => {
      const col = SHEET_COLS.find((c) => c[0] === title)!;
      return col[1](a);
    };
    expect(cell('ID')).toBe('a1');
    expect(cell('Rent')).toBe(3000);
    expect(cell('Rent/sqft')).toBe(4); // 3000/750
    expect(cell('Furnished')).toBe('No');
    expect(cell('Utilities incl')).toBe('Yes');
    expect(cell('Parking')).toBe('Yes');
    expect(cell('Other amenities')).toBe('Roof deck; Bike room');
  });

  it('null numeric fields export as empty string, not 0', () => {
    const a = makeApt({ parkingCost: null, sqft: null });
    const cell = (title: string) => SHEET_COLS.find((c) => c[0] === title)![1](a);
    expect(cell('Parking cost')).toBe('');
    expect(cell('Sqft')).toBe('');
    expect(cell('Rent/sqft')).toBe(''); // pricePerSqft null → ''
  });

  it('takes a Settings param (forward-compat) without throwing', () => {
    expect(() => buildSheetCols({ ...DEFAULT_SETTINGS, targetMaxLease: 24 })).not.toThrow();
  });
});
