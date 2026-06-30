import type { Apartment, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { buildSheetCols } from '../data/sheetCols';

/** [titles row, ...one row per apt] using the column order at the given settings (ported from garage). */
export function sheetMatrix(
  apts: Apartment[],
  settings: Settings = DEFAULT_SETTINGS,
): (string | number)[][] {
  const cols = buildSheetCols(settings);
  return [cols.map((col) => col[0]), ...apts.map((a) => cols.map((col) => col[1](a)))];
}

/** Tab-separated; tabs/newlines inside cells flattened so a paste into A1 stays a clean grid. */
export function toTSV(apts: Apartment[], settings: Settings = DEFAULT_SETTINGS): string {
  return sheetMatrix(apts, settings)
    .map((r) =>
      r.map((v) => String(v).replace(/\t/g, ' ').replace(/\r?\n/g, '  ')).join('\t'),
    )
    .join('\n');
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/** RFC-4180-style CSV. */
export function toCSV(apts: Apartment[], settings: Settings = DEFAULT_SETTINGS): string {
  return sheetMatrix(apts, settings)
    .map((r) => r.map(csvCell).join(','))
    .join('\n');
}

/** Pretty JSON of the raw apartment objects. */
export function toJSON(apts: Apartment[]): string {
  return JSON.stringify(apts, null, 2);
}
