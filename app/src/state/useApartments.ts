import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Anchor, Apartment, AmenityKey, Settings, Status } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import type { Coord } from '../lib/distance';
import { APARTMENTS } from '../data/apartments';

export type View = 'grid' | 'compare';

/** Sort keys (contract §10). 'added' keeps insertion order; 'nearest' needs the resolved anchor. */
export type SortKey =
  | 'nearest'
  | 'rent-asc'
  | 'rent-desc'
  | 'beds-desc'
  | 'sqft-desc'
  | 'you-desc'
  | 'expert-desc'
  | 'added';

/** Filter state (contract §10). Owned by the UI lane; consumed by applyFilters/applySort. */
export interface Filters {
  search: string;
  maxRent: number | null;
  minBeds: number | null;
  furnishedOnly: boolean;
  leaseFitsTarget: boolean;
  reqAmenities: AmenityKey[];
  hideRejected: boolean;
  showGone: boolean;
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = {
  search: '',
  maxRent: null,
  minBeds: null,
  furnishedOnly: false,
  leaseFitsTarget: false,
  reqAmenities: [],
  hideRejected: false,
  showGone: false,
  // Default = rank by distance from your primary Settings anchor. If no anchor is set, applySort's
  // 'nearest' comparator degrades cleanly to insertion order (NaN→0, stable sort) and no distance
  // chips show — so a fresh visitor still sees a sensible board until they pick an anchor.
  sort: 'nearest',
};

// Bumped v1 → v2 when the seed switched from the 3 placeholder examples to real listings
// (2026-06-29). A bump abandons any placeholder-era localStorage so deleted seed listings
// (old a2/a3) can't linger as ghost "user-added" cards via mergeWithSeed. Safe here: the app
// is pre-deploy with no real in-app-added listings/settings to preserve. Bump again only if a
// future data change must force-reset existing users' stores.
const STORE_KEY = 'apt.v2';
const THEME_KEY = 'apt.theme';

/**
 * A complete default Apartment used as the hydrate-merge base: every saved/shared apartment is
 * spread OVER this so older saves that lack a newly-added field can never crash a render.
 */
const DEFAULT_APARTMENT: Apartment = {
  id: '',
  status: 'New',
  title: '',
  address: '',
  neighborhood: '',
  city: '',
  lat: null,
  lng: null,
  beds: 0,
  baths: 1,
  sqft: null,
  floor: '',
  laundry: 'unknown',
  rent: 0,
  parkingCost: null,
  petRent: null,
  utilitiesIncluded: null,
  utilitiesEstimate: null,
  deposit: null,
  appFee: null,
  brokerFee: null,
  leaseTermMonths: null,
  minLeaseMonths: null,
  maxLeaseMonths: null,
  availableDate: '',
  availability: 'unknown',
  furnished: null,
  petPolicy: 'Unknown',
  listingType: 'Unknown',
  contact: { company: '', name: '', phone: '', email: '', website: '' },
  amen: {},
  amenities: [],
  dateSeen: '',
  daysOnMarket: null,
  marketRent: null,
  expertRating: 0,
  scamRisk: false,
  incomeRestricted: false,
  rating: 0,
  notes: '',
  comments: [],
  image: '',
  sourceUrl: '',
};

/** Spread a saved/shared partial apartment over the full default so missing fields are filled. */
function hydrateApartment(saved: Partial<Apartment>): Apartment {
  return {
    ...DEFAULT_APARTMENT,
    ...saved,
    contact: { ...DEFAULT_APARTMENT.contact, ...(saved.contact || {}) },
    amen: { ...(saved.amen || {}) },
    amenities: Array.isArray(saved.amenities) ? [...saved.amenities] : [],
    comments: Array.isArray(saved.comments) ? saved.comments.map((c) => ({ ...c })) : [],
  };
}

interface PersistShape {
  apartments: Apartment[];
  settings: Settings;
  removed: string[]; // ids the user deleted (so deleted seed listings don't reappear from the seed)
}

interface RawPersist {
  apartments: Partial<Apartment>[];
  settings: Settings;
  removed: string[];
}

/**
 * A GENUINELY user-added listing has a timestamp id (`'a' + Date.now()`, ≥13 digits); seed ids are
 * short (`a3`…`a16`). mergeWithSeed uses this to resurrect a saved listing that's NOT in the current
 * seed ONLY when it looks user-added — so RETIRING a listing from data/apartments.ts makes it vanish
 * cleanly, instead of lingering as a ghost "user-added" card (its leftover rating/status overlay in
 * localStorage would otherwise be mistaken for an in-app addition). This lets me delete seed listings
 * anytime WITHOUT bumping STORE_KEY — a bump would wipe every one of the user's ratings/statuses/
 * comments/removals. (Supersedes the old "bump STORE_KEY when you delete a seed listing" workaround.)
 */
export function looksUserAdded(id: string | undefined): boolean {
  return !!id && /^a\d{5,}$/.test(id);
}

/**
 * The seed (data/apartments.ts) is authoritative for the listing SET + DATA — so listings I add or
 * update there (from your screenshots) always show up. localStorage only overlays YOUR in-app state
 * (rating + status incl. "Gone", and your comments), keeps listings you added in-app, and remembers
 * deletions. (Editing a seed listing's other fields — including owner/contact — in the form isn't
 * persisted; tell me and I'll update the data file, which is the source of truth.)
 * `seed` is injectable for tests; defaults to the real APARTMENTS.
 */
export function mergeWithSeed(
  saved: Partial<Apartment>[],
  removed: string[],
  seed: Apartment[] = APARTMENTS,
): Apartment[] {
  const removedSet = new Set(removed);
  const savedById = new Map(saved.filter((a) => a.id).map((a) => [a.id as string, a]));
  const out: Apartment[] = [];
  // User-added listings FIRST, preserving saved order (addApartment prepends → newest first), so a
  // freshly added listing stays at the top of the default "Added" view after a reload (review M3).
  // Gate on looksUserAdded so a retired-seed remnant (short id) is NOT mistaken for an addition.
  for (const s of saved) {
    if (looksUserAdded(s.id) && !removedSet.has(s.id as string)) out.push(hydrateApartment(s));
  }
  // Then the authoritative seed listings, with the user's rating/status overlay.
  for (const seedApt of seed) {
    if (removedSet.has(seedApt.id)) continue;
    const base = hydrateApartment(seedApt);
    const s = savedById.get(seedApt.id);
    out.push(
      s
        ? {
            ...base,
            rating: s.rating ?? base.rating,
            status: s.status ?? base.status,
            // Comments are USER content → the saved overlay wins (base/seed has none).
            comments: Array.isArray(s.comments) ? s.comments.map((c) => ({ ...c })) : base.comments,
          }
        : base,
    );
  }
  return out;
}

function parsePersist(raw: string | null): RawPersist | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as {
      apartments?: Partial<Apartment>[];
      settings?: Partial<Settings>;
      removed?: string[];
    };
    if (!data || !Array.isArray(data.apartments)) return null;
    const settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
    // Migration (2026-07): the lease target moved from a 6–12 window to a single 6-mo goal. A browser
    // still holding the exact OLD default (6/12) is bumped to 6/6 so the deployed app reflects the new
    // target; anyone who deliberately set a different window is left untouched.
    if (settings.targetMinLease === 6 && settings.targetMaxLease === 12) settings.targetMaxLease = 6;
    return {
      apartments: data.apartments,
      settings,
      removed: Array.isArray(data.removed) ? data.removed : [],
    };
  } catch {
    return null;
  }
}

/**
 * Load persisted state from localStorage, overlaid on the authoritative seed.
 * (No URL-hash import: a read-only share path with no writer was a data-integrity/security risk —
 * a crafted #hash could silently persist attacker listings + a sheetUrl into the store. Removed per
 * code review M2/N1. If share links are added later, build an explicit writer + an "accept" gate,
 * and strip settings.sheetUrl on import.)
 */
function loadInitial(): PersistShape {
  const persisted = parsePersist(localStorage.getItem(STORE_KEY));
  const removed = persisted?.removed ?? [];
  return {
    apartments: mergeWithSeed(persisted?.apartments ?? [], removed),
    settings: persisted?.settings ?? { ...DEFAULT_SETTINGS },
    removed,
  };
}

function initialTheme(): 'light' | 'dark' {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'dark' || t === 'light') return t;
  } catch {
    /* ignore */
  }
  return 'light';
}

export function useApartments() {
  const initial = useRef<PersistShape>(loadInitial());
  const [apartments, setApartments] = useState<Apartment[]>(initial.current.apartments);
  const [settings, setSettingsState] = useState<Settings>(initial.current.settings);
  const [removed, setRemoved] = useState<string[]>(initial.current.removed);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [compareSet, setCompareSet] = useState<Set<string>>(() => new Set());
  const [view, setView] = useState<View>('grid');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => initialTheme());

  // Autosave apartments + settings under apt.v1 (filters/compare/view are session-only).
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ apartments, settings, removed }));
    } catch {
      /* quota / private mode — non-fatal */
    }
  }, [apartments, settings, removed]);

  // Keep <html data-theme> + persisted theme in sync.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // ---- apartment CRUD ----
  const addApartment = useCallback((apt: Apartment) => {
    setApartments((prev) => [apt, ...prev]);
  }, []);

  const updateApartment = useCallback((id: string, patch: Partial<Apartment>) => {
    setApartments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const deleteApartment = useCallback((id: string) => {
    setApartments((prev) => prev.filter((a) => a.id !== id));
    setRemoved((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCompareSet((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setRating = useCallback((id: string, which: 'expert' | 'you', n: number) => {
    const key = which === 'expert' ? 'expertRating' : 'rating';
    setApartments((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: n } : a)));
  }, []);

  const setStatus = useCallback((id: string, status: Status) => {
    setApartments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  // ---- comments (your own overlay; persisted + merged onto the seed) ----
  const addComment = useCallback((id: string, text: string) => {
    const t = text.trim();
    if (!t) return;
    const comment = { id: 'c' + Date.now(), text: t, ts: new Date().toISOString() };
    setApartments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, comments: [...a.comments, comment] } : a)),
    );
  }, []);

  const deleteComment = useCallback((id: string, commentId: string) => {
    setApartments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, comments: a.comments.filter((c) => c.id !== commentId) } : a,
      ),
    );
  }, []);

  // ---- compare ----
  const toggleCompare = useCallback((id: string) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => setCompareSet(new Set()), []);

  // ---- settings / filters ----
  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    // Clears the panel fields AND the quick chips (furnished / lease-fit); search + sort stay put.
    setFiltersState((prev) => ({
      ...prev,
      maxRent: null,
      minBeds: null,
      reqAmenities: [],
      furnishedOnly: false,
      leaseFitsTarget: false,
    }));
  }, []);

  const toggleReqAmenity = useCallback((k: AmenityKey) => {
    setFiltersState((prev) => {
      const has = prev.reqAmenities.includes(k);
      return {
        ...prev,
        reqAmenities: has ? prev.reqAmenities.filter((x) => x !== k) : [...prev.reqAmenities, k],
      };
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // ---- anchor CRUD (distance feature) ----
  /**
   * Add (or replace) a primary anchor and make it primary. Pass the resolved coord if known
   * (offline table or geocode hit); pass null lat/lng if unresolved (chips hide, sort no-ops).
   * Returns the new anchor's id so callers can patch its coord later (async geocode).
   */
  const addAnchor = useCallback((anchor: Omit<Anchor, 'id'>): string => {
    const id = 'an' + Date.now() + Math.floor(Math.random() * 1000);
    setSettingsState((prev) => ({
      ...prev,
      anchors: [...prev.anchors, { ...anchor, id }],
      primaryAnchorId: prev.primaryAnchorId ?? id,
    }));
    return id;
  }, []);

  const updateAnchor = useCallback((id: string, patch: Partial<Omit<Anchor, 'id'>>) => {
    setSettingsState((prev) => ({
      ...prev,
      anchors: prev.anchors.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const removeAnchor = useCallback((id: string) => {
    setSettingsState((prev) => {
      const anchors = prev.anchors.filter((a) => a.id !== id);
      const primaryAnchorId =
        prev.primaryAnchorId === id ? (anchors[0]?.id ?? null) : prev.primaryAnchorId;
      return { ...prev, anchors, primaryAnchorId };
    });
  }, []);

  const setPrimaryAnchor = useCallback((id: string | null) => {
    setSettingsState((prev) => ({ ...prev, primaryAnchorId: id }));
  }, []);

  /** The resolved primary anchor object (or null if none set). */
  const primaryAnchorObj: Anchor | null = useMemo(() => {
    if (!settings.primaryAnchorId) return null;
    return settings.anchors.find((a) => a.id === settings.primaryAnchorId) ?? null;
  }, [settings.anchors, settings.primaryAnchorId]);

  /**
   * The resolved primary-anchor COORD threaded into applySort + getFlags' FlagCtx.
   * null when no anchor is set OR the anchor hasn't resolved (lat/lng still null) —
   * the graceful-degrade path (distance chips hide, Nearest sort no-ops). This is the
   * integration trap: App.tsx MUST pass this into applySort and the flag ctx.
   */
  const primaryAnchor: Coord | null = useMemo(() => {
    if (primaryAnchorObj && primaryAnchorObj.lat != null && primaryAnchorObj.lng != null) {
      return { lat: primaryAnchorObj.lat, lng: primaryAnchorObj.lng };
    }
    return null;
  }, [primaryAnchorObj]);

  // Number of active *panel* filters (drives the badge).
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.maxRent != null) n++;
    if (filters.minBeds != null) n++;
    n += filters.reqAmenities.length;
    return n;
  }, [filters]);

  return {
    apartments,
    settings,
    filters,
    compareSet,
    view,
    theme,
    activeFilterCount,
    primaryAnchor, // resolved Coord | null — thread into applySort + FlagCtx
    primaryAnchorObj, // the Anchor (for the distance-chip label)
    // actions
    addApartment,
    updateApartment,
    deleteApartment,
    setRating,
    setStatus,
    addComment,
    deleteComment,
    toggleCompare,
    clearCompare,
    setSettings,
    setFilters,
    resetFilters,
    toggleReqAmenity,
    setView,
    toggleTheme,
    // anchor CRUD
    addAnchor,
    updateAnchor,
    removeAnchor,
    setPrimaryAnchor,
  };
}

export type ApartmentsStore = ReturnType<typeof useApartments>;
