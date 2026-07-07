import { describe, it, expect } from 'vitest';
import { mergeWithSeed, looksUserAdded } from './useApartments';
import { makeApt } from '../lib/_fixtures';

describe('looksUserAdded — timestamp id vs short seed id', () => {
  it('a timestamp id (a + Date.now(), 13 digits) → true', () =>
    expect(looksUserAdded('a1751430000000')).toBe(true));
  it('short seed ids → false', () => {
    expect(looksUserAdded('a3')).toBe(false);
    expect(looksUserAdded('a16')).toBe(false);
  });
  it('empty / undefined / garbage → false', () => {
    expect(looksUserAdded('')).toBe(false);
    expect(looksUserAdded(undefined)).toBe(false);
    expect(looksUserAdded('x')).toBe(false);
  });
});

describe('mergeWithSeed — retiring a seed listing leaves no ghost', () => {
  // A minimal 2-listing seed standing in for data/apartments.ts.
  const seed = [makeApt({ id: 'a6', rating: 0 }), makeApt({ id: 'a7' })];

  it('a saved overlay for a REMOVED seed listing (short id) is not resurrected', () => {
    // a3 used to be a seed listing; the user still has its rating overlay in localStorage.
    const saved = [
      { id: 'a3', rating: 5 },
      { id: 'a6', rating: 4 },
    ];
    const out = mergeWithSeed(saved, [], seed);
    expect(out.map((a) => a.id)).toEqual(['a6', 'a7']); // a3 gone — no ghost card
    expect(out.find((a) => a.id === 'a6')!.rating).toBe(4); // surviving overlay preserved
  });

  it('a genuinely user-added listing (timestamp id) IS preserved, newest-first', () => {
    const saved = [{ id: 'a1751430000000', title: 'Added by hand', rating: 3 }];
    const out = mergeWithSeed(saved, [], seed);
    expect(out.map((a) => a.id)).toEqual(['a1751430000000', 'a6', 'a7']);
  });

  it('a removed id stays gone even if it looks user-added', () => {
    const saved = [{ id: 'a1751430000000', rating: 3 }];
    const out = mergeWithSeed(saved, ['a1751430000000'], seed);
    expect(out.map((a) => a.id)).not.toContain('a1751430000000');
  });

  it('a seed listing marked removed is skipped', () => {
    const out = mergeWithSeed([], ['a6'], seed);
    expect(out.map((a) => a.id)).toEqual(['a7']);
  });
});
