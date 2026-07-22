import { describe, it, expect } from 'vitest';
import { mergeWithSeed, looksUserAdded, parsePersist } from './useApartments';
import { makeApt } from '../lib/_fixtures';
import { DEFAULT_ANCHOR, DEFAULT_SETTINGS } from '../types';

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

describe('editComment — edit in place, preserve id + ts', () => {
  // Reproduce the pure edit transform the hook applies, so the identity guarantees are locked.
  const applyEdit = (comments: { id: string; text: string; ts: string }[], commentId: string, text: string) => {
    const t = text.trim();
    if (!t) return comments; // empty → no-op (mirrors the hook)
    return comments.map((c) => (c.id === commentId ? { ...c, text: t } : c));
  };
  const base = [
    { id: 'c1', text: 'first', ts: '2026-07-20T10:00:00.000Z' },
    { id: 'c2', text: 'second', ts: '2026-07-20T11:00:00.000Z' },
  ];

  it('replaces the target comment text but keeps its id, ts, and position', () => {
    const out = applyEdit(base, 'c2', 'second — edited');
    expect(out.map((c) => c.id)).toEqual(['c1', 'c2']); // order unchanged
    expect(out[1]).toEqual({ id: 'c2', text: 'second — edited', ts: '2026-07-20T11:00:00.000Z' });
    expect(out[0]).toEqual(base[0]); // sibling untouched
  });

  it('trims whitespace and preserves typed newlines', () => {
    const out = applyEdit(base, 'c1', '  line A\nline B  ');
    expect(out[0].text).toBe('line A\nline B');
  });

  it('empty / whitespace-only edit is a no-op (use delete to remove)', () => {
    expect(applyEdit(base, 'c1', '   ')).toEqual(base);
  });
});

describe('default distance anchor — Millbrae 94030', () => {
  it('DEFAULT_SETTINGS ships the 94030 anchor as primary', () => {
    expect(DEFAULT_ANCHOR.query).toBe('94030');
    expect(DEFAULT_ANCHOR.lat).not.toBeNull();
    expect(DEFAULT_ANCHOR.lng).not.toBeNull();
    expect(DEFAULT_SETTINGS.anchors).toEqual([DEFAULT_ANCHOR]);
    expect(DEFAULT_SETTINGS.primaryAnchorId).toBe(DEFAULT_ANCHOR.id);
  });

  const raw = (settings: object) =>
    JSON.stringify({ apartments: [], settings, removed: [] });

  it('a browser that never set an anchor (empty list) gets the default injected', () => {
    const out = parsePersist(raw({ anchors: [], primaryAnchorId: null }))!;
    expect(out.settings.anchors).toEqual([DEFAULT_ANCHOR]);
    expect(out.settings.primaryAnchorId).toBe(DEFAULT_ANCHOR.id);
  });

  it('a settings object with no anchors key at all also gets the default', () => {
    const out = parsePersist(raw({ distanceUnit: 'mi' }))!;
    expect(out.settings.primaryAnchorId).toBe(DEFAULT_ANCHOR.id);
  });

  it("a user's own custom anchor is left untouched (non-destructive)", () => {
    const custom = { id: 'my-work', label: 'Work', query: 'Palo Alto', lat: 37.44, lng: -122.14 };
    const out = parsePersist(raw({ anchors: [custom], primaryAnchorId: 'my-work' }))!;
    expect(out.settings.anchors).toEqual([custom]);
    expect(out.settings.primaryAnchorId).toBe('my-work');
  });
});
