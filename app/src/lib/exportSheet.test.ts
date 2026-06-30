import { describe, it, expect } from 'vitest';
import { sheetMatrix, toCSV, toTSV, toJSON } from './exportSheet';
import { SHEET_COLS } from '../data/sheetCols';
import { AMENITIES } from '../data/amenities';
import { makeApt } from './_fixtures';

const apt = () =>
  makeApt({
    id: 'a1',
    status: 'Shortlist',
    title: 'Sunny 1BR',
    address: '500 Hayes St',
    neighborhood: 'Hayes Valley',
    city: 'San Francisco',
    rent: 3300,
    sqft: 720,
    laundry: 'in-unit',
    amen: { parking: false, gym: null },
    amenities: ['Roof deck'],
    notes: 'Line1\nLine2',
    sourceUrl: 'https://example.com/a1',
  });

describe('sheetMatrix', () => {
  it('first row is the column titles', () => {
    const m = sheetMatrix([apt()]);
    expect(m[0]).toEqual(SHEET_COLS.map((c) => c[0]));
  });

  it('one data row per apartment', () => {
    const m = sheetMatrix([apt(), apt()]);
    expect(m).toHaveLength(3); // header + 2
  });

  it('amenities render Yes/No/? via amenState; laundry is its own column', () => {
    const titles = SHEET_COLS.map((c) => c[0]);
    const row = sheetMatrix([apt()])[1];
    const laundryIdx = titles.indexOf('Laundry');
    const parkingIdx = titles.indexOf('Parking');
    const gymIdx = titles.indexOf('On-site gym');
    expect(row[laundryIdx]).toBe('In-unit');
    expect(row[parkingIdx]).toBe('No');
    expect(row[gymIdx]).toBe('?');
  });

  it('includes derived Rent/sqft column', () => {
    const titles = SHEET_COLS.map((c) => c[0]);
    const idx = titles.indexOf('Rent/sqft');
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(sheetMatrix([apt()])[1][idx]).toBeCloseTo(4.58, 2); // 3300/720
  });
});

describe('column set (scope-cut: no effective-monthly / move-in-cost)', () => {
  const titles = SHEET_COLS.map((c) => c[0]);
  it('has all 10 amenity long labels', () => {
    for (const [, , long] of AMENITIES) expect(titles).toContain(long);
  });
  it('keeps the raw cost columns', () => {
    for (const t of ['Rent', 'Parking cost', 'Pet rent', 'Deposit', 'App fee', 'Broker fee'])
      expect(titles).toContain(t);
  });
  it('does NOT contain cut computed columns', () => {
    expect(titles).not.toContain('Effective monthly');
    expect(titles).not.toContain('Move-in cost');
    expect(titles.some((t) => /effective/i.test(t))).toBe(false);
    expect(titles.some((t) => /move.?in/i.test(t))).toBe(false);
  });
});

describe('toTSV', () => {
  it('flattens internal newlines so a paste into A1 stays a grid', () => {
    const tsv = toTSV([apt()]);
    // the notes cell had \n — must be flattened to spaces, no raw newline mid-row
    const lines = tsv.split('\n');
    expect(lines).toHaveLength(2); // header + 1 row, no extra line from notes
  });
  it('uses tabs as the column delimiter', () => {
    expect(toTSV([apt()]).split('\n')[0]).toContain('\t');
  });
});

describe('toCSV', () => {
  it('quotes cells containing commas/quotes/newlines', () => {
    const csv = toCSV([makeApt({ title: 'Has, comma', sqft: 700 })]);
    expect(csv).toContain('"Has, comma"');
  });
});

describe('toJSON', () => {
  it('pretty-prints the raw objects', () => {
    const json = toJSON([apt()]);
    expect(JSON.parse(json)[0].id).toBe('a1');
  });
});
