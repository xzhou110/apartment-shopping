import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  resolveAnchor,
  geocodeRemote,
  normalizeQuery,
  cacheGet,
  cacheSet,
} from './geocode';

const CACHE_KEY = 'apt.geocache';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// normalizeQuery
// ---------------------------------------------------------------------------
describe('normalizeQuery', () => {
  it('lowercases + trims + collapses whitespace', () => {
    expect(normalizeQuery('  San   Francisco ')).toBe('san francisco');
  });
  it('strips a trailing ", CA"', () => {
    expect(normalizeQuery('Oakland, CA')).toBe('oakland');
  });
  it('strips " California"', () => {
    expect(normalizeQuery('Palo Alto California')).toBe('palo alto');
  });
  it('strips a trailing USA token', () => {
    expect(normalizeQuery('Berkeley, CA, USA')).toBe('berkeley');
  });
});

// ---------------------------------------------------------------------------
// resolveAnchor — OFFLINE, SYNC, never network
// ---------------------------------------------------------------------------
describe('resolveAnchor — offline table', () => {
  it('resolves a bare ZIP', () => {
    const c = resolveAnchor('94103');
    expect(c).not.toBeNull();
    expect(c!.lat).toBeCloseTo(37.77, 1);
  });

  it('resolves a ZIP embedded in an address ("SF, 94103")', () => {
    const c = resolveAnchor('SF, 94103');
    expect(c).not.toBeNull();
    expect(c!.lat).toBeCloseTo(37.77, 1);
  });

  it('resolves an exact city name', () => {
    expect(resolveAnchor('San Francisco')).not.toBeNull();
  });

  it('resolves a messy city query ("  oakland, CA ")', () => {
    const c = resolveAnchor('  oakland, CA ');
    expect(c).not.toBeNull();
    expect(c!.lat).toBeCloseTo(37.8, 1);
  });

  it('resolves a neighborhood key (rockridge)', () => {
    expect(resolveAnchor('Rockridge')).not.toBeNull();
  });

  it('unknown query → null', () => {
    expect(resolveAnchor('Narnia, Middle Earth')).toBeNull();
  });

  it('empty query → null', () => {
    expect(resolveAnchor('')).toBeNull();
  });

  it('does NOT call fetch (pure offline)', () => {
    const spy = vi.fn();
    vi.stubGlobal('fetch', spy);
    resolveAnchor('San Francisco');
    resolveAnchor('nope nowhere');
    expect(spy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// cache read/write + resolveAnchor cache hit
// ---------------------------------------------------------------------------
describe('geocache (localStorage)', () => {
  it('cacheSet then cacheGet round-trips by normalized key', () => {
    cacheSet('123 Made Up Ave, Springfield', { lat: 1.5, lng: 2.5 });
    expect(cacheGet('123 made up ave springfield')).toEqual({ lat: 1.5, lng: 2.5 });
  });

  it('resolveAnchor hits the cache when not in the offline table', () => {
    cacheSet('999 Imaginary Blvd', { lat: 10, lng: 20 });
    expect(resolveAnchor('999 Imaginary Blvd')).toEqual({ lat: 10, lng: 20 });
  });

  it('cache uses the separate apt.geocache namespace', () => {
    cacheSet('somewhere', { lat: 3, lng: 4 });
    expect(localStorage.getItem(CACHE_KEY)).toContain('somewhere');
  });
});

// ---------------------------------------------------------------------------
// geocodeRemote — fetch is MOCKED; no real network in tests
// ---------------------------------------------------------------------------
describe('geocodeRemote (mocked fetch)', () => {
  it('success → returns coord and writes the cache', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ lat: '37.5', lon: '-122.3' }],
      }),
    );
    const c = await geocodeRemote('123 Some Real St, Foster City');
    expect(c).toEqual({ lat: 37.5, lng: -122.3 });
    // cached → next resolveAnchor is offline-instant
    expect(resolveAnchor('123 Some Real St, Foster City')).toEqual({ lat: 37.5, lng: -122.3 });
  });

  it('non-200 → null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => [] }));
    expect(await geocodeRemote('anything')).toBeNull();
  });

  it('empty results array → null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    expect(await geocodeRemote('nowhere at all')).toBeNull();
  });

  it('fetch throws (network/CORS) → null, never throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('CORS')));
    await expect(geocodeRemote('blocked')).resolves.toBeNull();
  });

  it('malformed coords → null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ lat: 'NaN', lon: 'x' }] }),
    );
    expect(await geocodeRemote('garbage')).toBeNull();
  });

  it('empty query → null without calling fetch', async () => {
    const spy = vi.fn();
    vi.stubGlobal('fetch', spy);
    expect(await geocodeRemote('')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('sends only the Accept header (UA/Referer are forbidden fetch headers the browser sets itself)', async () => {
    const spy = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ lat: '1', lon: '2' }] });
    vi.stubGlobal('fetch', spy);
    await geocodeRemote('123 Real St');
    const [, opts] = spy.mock.calls[0];
    expect(opts.headers).toEqual({ Accept: 'application/json' });
    expect(opts.headers['User-Agent']).toBeUndefined();
  });
});
