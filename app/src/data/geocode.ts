import type { Coord } from '../lib/distance';
import { BAY_AREA_ZIPS, BAY_AREA_CITIES } from './geo/bayAreaGeo';

// ---------------------------------------------------------------------------
// Nominatim probe (build-time, this environment): GET .../search?q=Oakland,CA
// returned HTTP 000 (no response — no network egress / blocked here). Per the tech
// plan, the architecture deliberately does NOT depend on Nominatim: the offline
// BAY_AREA table is the PRIMARY path (acceptance criterion #7), and geocodeRemote
// is a best-effort enhancement for arbitrary street addresses that returns null on
// ANY failure. So a blocked/CORS/down Nominatim changes nothing — the app still
// ships and the ZIP/city path stays instant and offline. Whoever has network access
// should re-run the probe from the GH Pages origin before advertising the address path.
// ---------------------------------------------------------------------------

/** localStorage key for the geocode cache — SEPARATE from app data (apt.v1). Contract §3. */
const CACHE_KEY = 'apt.geocache';

/**
 * Normalize a user-typed anchor query for matching:
 *  - trim, collapse internal whitespace, lowercase
 *  - strip a trailing USA/US token, then a trailing state token (CA / California)
 *  - collapse punctuation (commas/periods) to spaces
 */
export function normalizeQuery(query: string): string {
  let q = (query || '').toLowerCase().trim();
  // drop trailing country token first
  q = q.replace(/[,\s]+(usa|u\.s\.a\.|u\.s\.|us)\s*$/i, '');
  // drop trailing state token
  q = q.replace(/[,\s]+(ca|california|calif\.?)\s*$/i, '');
  // commas/periods -> spaces, then collapse whitespace
  q = q.replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim();
  return q;
}

/** Extract a bare 5-digit ZIP from a raw query, or null. */
function extractZip(query: string): string | null {
  const m = (query || '').match(/\b(\d{5})\b/);
  return m ? m[1] : null;
}

function tupleToCoord(t: readonly [number, number] | undefined): Coord | null {
  return t ? { lat: t[0], lng: t[1] } : null;
}

// --- cache (best-effort; quota / private mode is non-fatal) -----------------

function readCache(): Record<string, [number, number]> {
  try {
    const raw =
      typeof localStorage !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : {};
  } catch {
    return {};
  }
}

/** localStorage read for a (raw) query, keyed by its normalized form. */
export function cacheGet(query: string): Coord | null {
  const key = normalizeQuery(query);
  if (!key) return null;
  const hit = readCache()[key];
  return Array.isArray(hit) ? { lat: hit[0], lng: hit[1] } : null;
}

/** localStorage write for a (raw) query, keyed by its normalized form. Best-effort. */
export function cacheSet(query: string, c: Coord): void {
  const key = normalizeQuery(query);
  if (!key) return;
  try {
    if (typeof localStorage === 'undefined') return;
    const cache = readCache();
    cache[key] = [c.lat, c.lng];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota / private-mode / no-localStorage — non-fatal, cache just won't persist.
  }
}

/**
 * Resolve a user-typed anchor query to a coordinate, SYNC and OFFLINE.
 * Tries, in order: (1) ZIP match, (2) exact normalized-city match, (3) cached remote
 * result (a previous geocodeRemote write in localStorage). Returns null if none hit.
 * NEVER throws; NEVER does network I/O. Contract §3.
 */
export function resolveAnchor(query: string): Coord | null {
  if (!query) return null;

  // (1) ZIP — check the raw query for a 5-digit run so "94103" and "SF, 94103" both hit.
  const zip = extractZip(query);
  if (zip) {
    const byZip = tupleToCoord(BAY_AREA_ZIPS[zip]);
    if (byZip) return byZip;
  }

  // (2) exact normalized-city match
  const norm = normalizeQuery(query);
  if (norm) {
    const byCity = tupleToCoord(BAY_AREA_CITIES[norm]);
    if (byCity) return byCity;
  }

  // (3) cached remote result
  return cacheGet(query);
}

/**
 * Async fallback for queries not in the offline table (arbitrary street addresses).
 * Calls Nominatim, returns {lat,lng} of the first result or null. On ANY failure
 * (network/CORS/HTTP/empty/parse) returns null — never throws. On success WRITES the
 * result into the localStorage cache so the next resolveAnchor() for the same normalized
 * query is instant and offline. (The browser sends its own UA + Referer — forbidden fetch headers
 * we cannot override.) The UI must call this at most ~1/sec (debounce on blur/submit, not per keystroke).
 */
export async function geocodeRemote(query: string): Promise<Coord | null> {
  if (!query || !query.trim()) return null;
  try {
    const url =
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
      encodeURIComponent(query.trim());
    // User-Agent / Referer are forbidden fetch headers — the browser sets them itself (the real page
    // Referer already identifies this app to Nominatim), so we only send Accept. (Code review S5.)
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const first = data[0];
    const lat = parseFloat(first?.lat);
    const lng = parseFloat(first?.lon);
    if (!isFinite(lat) || !isFinite(lng)) return null;
    const coord: Coord = { lat, lng };
    cacheSet(query, coord);
    return coord;
  } catch {
    return null;
  }
}
