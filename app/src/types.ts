// ============================================================================
// FROZEN CONTRACT — owned by the orchestrator/PM. Do NOT edit in a build lane.
// If a type change is needed, route it through the PM (it affects both lanes:
// the pure lib/data lane AND the UI lane). This is the apartment data model,
// adapted from the garage (used-car) template.
// ============================================================================

/**
 * Tracked amenities shown as tri-state pills, in display order.
 * Trimmed (2026-06-30) to the few that matter at a glance. Other facts live elsewhere:
 * laundry → its own `laundry` field (in-unit vs on-site is a real distinction, not yes/no);
 * pets → petPolicy; one-offs (A/C, EV, dishwasher, deck…) → free-text `amenities`; who's
 * renting it → listingType ("Listed by" pill).
 */
export type AmenityKey =
  | 'parking' // dedicated/garage/assigned parking
  | 'woodenFloor' // wood / hardwood (or wood-style) flooring
  | 'balcony' // private outdoor space — balcony / patio / deck
  | 'gym'; // on-site fitness

/** Laundry as a first-class field: in-unit and on-site are meaningfully different (and "none"). */
export type LaundryType = 'in-unit' | 'on-site' | 'none' | 'unknown';

/**
 * Coarse availability status, used when the listing states no exact date. Rolling-availability
 * communities routinely show "Currently unavailable" (= call and ask what's open) while private
 * listings say "Available now" — meaningfully different, and neither has a date. When
 * `availableDate` IS set, it wins and this field is ignored for display.
 */
export type Availability = 'now' | 'unavailable' | 'unknown';

/** Tri-state per amenity: true = has · false = confirmed absent · null/undefined = unknown. */
export type Amen = { [K in AmenityKey]?: boolean | null };

/** Rendered tri-state. 'unk' must always stay visually distinct from 'no'. */
export type AmenState = 'yes' | 'no' | 'unk';

export type Status =
  | 'New'
  | 'Shortlist'
  | 'Contacted'
  | 'Toured'
  | 'Applied'
  | 'Rejected'
  | 'Leased' // you signed it (won) — kept, but flagged as the chosen one
  | 'Ruled out' // not available to you / didn't qualify (e.g. income cap) — hidden by default like Gone
  | 'Gone'; // off the market / leased to someone else — hidden from the active list by default

export type ListingType = 'Property mgmt' | 'Landlord' | 'Sublet' | 'Broker' | 'Unknown';
export type PetPolicy = 'Allowed' | 'Cats only' | 'Dogs only' | 'No pets' | 'Unknown';

/**
 * Owner / management-company contact for a listing. LISTING DATA (part of the seed, editable in
 * the form) — not user state. Every field '' = unknown → nothing rendered for it. `website` is the
 * leasing/management site and is kept separate from the listing's `sourceUrl`.
 */
export interface Contact {
  company: string; // management company or owner entity, e.g. "Woodside Place (AMC-CA)"
  name: string; // named contact person, e.g. "Chris"
  phone: string; // as listed ('' = none)
  email: string; // '' = none
  website: string; // management/leasing site ('' = none)
}

/**
 * A user-authored note on a listing. USER STATE — persisted in localStorage and overlaid onto seed
 * listings on reload (exactly like rating/status), so your comments survive a seed data refresh.
 */
export interface Comment {
  id: string; // 'c' + timestamp
  text: string;
  ts: string; // ISO timestamp when added
}

export interface Apartment {
  id: string; // 'a1', 'a2', … (matches the id badge on the photo + chat references)
  status: Status;

  // identity / location
  title: string; // building name or a short label, e.g. "Sunny 1BR — Hayes Valley"
  address: string; // street address as listed (used for geocoding at add-time)
  neighborhood: string;
  city: string;
  lat: number | null; // geocoded at add-time; null = not yet geocoded (distance hidden)
  lng: number | null;

  // unit
  beds: number; // 0 = studio
  baths: number; // 1, 1.5, 2 …
  sqft: number | null;
  floor: string; // free text, e.g. "3rd floor", "garden level" ('' = unknown)
  laundry: LaundryType; // in-unit / on-site / none / unknown — shown as its own pill

  // monthly cost
  rent: number; // base monthly rent
  parkingCost: number | null; // monthly, if parking is paid separately (null = unknown/none)
  petRent: number | null; // monthly pet rent (null = none/unknown)
  utilitiesIncluded: boolean | null; // null = unknown
  utilitiesEstimate: number | null; // monthly est. when utilities are NOT included

  // one-time / move-in cost
  deposit: number | null; // refundable security deposit
  appFee: number | null; // non-refundable application fee
  brokerFee: number | null; // one-time broker/leasing fee (non-refundable)

  // lease
  leaseTermMonths: number | null; // the offered/desired term for THIS listing
  minLeaseMonths: number | null; // shortest term the landlord will sign
  maxLeaseMonths: number | null; // longest term offered
  availableDate: string; // ISO date the unit is available ('' = none stated → see availability)
  availability: Availability; // now / unavailable / unknown — display fallback when no date
  furnished: boolean | null; // null = unknown (first-class: matters for short-term)

  // policy / source
  petPolicy: PetPolicy;
  listingType: ListingType;
  contact: Contact; // owner / management-company contact (structured listing data)

  // amenities
  amen: Amen; // tri-state tracked amenities
  amenities: string[]; // free-text extras the listing mentions

  // tracking / market
  dateSeen: string; // ISO date you saw it
  daysOnMarket: number | null;
  marketRent: number | null; // comparable rent for the area/size, if known (drives over/under-market flags)

  // ratings / notes / media
  expertRating: number; // 0–5 — my (Claude's) rating
  scamRisk: boolean; // true = I judged it a possible scam → a red 'risk' flag shows on the card
  incomeRestricted: boolean; // true = income-qualified (affordable/AMI) housing → a red 'risk' flag: you must income-qualify to rent (e.g. a20/a24)
  rating: number; // 0–5 — your rating
  notes: string; // supports \n
  comments: Comment[]; // your own running notes on this listing (persisted as a user overlay)
  image: string; // path under public/ (e.g. "img/a1.jpg") OR a data: URI fallback
  sourceUrl: string;
}

/** A saved place the user ranks distance against (entered at runtime, e.g. a city, zip, or address). */
export interface Anchor {
  id: string;
  label: string; // "Work", "Gym", "Partner's place"
  query: string; // exactly what the user typed: a city, ZIP, or full address
  lat: number | null; // resolved via the bundled offline table or geocode fallback
  lng: number | null;
}

export interface Settings {
  anchors: Anchor[]; // user-entered places (empty until they add one)
  primaryAnchorId: string | null; // which anchor "Sort → Nearest" and the per-card distance use
  distanceUnit: 'mi' | 'km'; // default 'mi'
  targetMinLease: number | null; // your desired lease window (months) — drives the lease-fit flag
  targetMaxLease: number | null;
  sheetUrl?: string; // Google Apps Script Web App URL for direct Sheets sync ('' = not configured)
}

/**
 * Default distance anchor a fresh install ranks against — Millbrae ZIP 94030, resolved offline from
 * the bundled Census table (data/geo/bayAreaGeo.ts: "94030" → [37.5997, -122.4033]). Stable id so the
 * parsePersist migration can inject it for existing browsers that never set an anchor (so the default
 * reflects on refresh across devices). Fully editable in Settings → Distance anchors: rename, remove,
 * make another primary, or add your own.
 */
export const DEFAULT_ANCHOR: Anchor = {
  id: 'anchor-default-94030',
  label: '94030',
  query: '94030',
  lat: 37.5997,
  lng: -122.4033,
};

export const DEFAULT_SETTINGS: Settings = {
  anchors: [DEFAULT_ANCHOR],
  primaryAnchorId: DEFAULT_ANCHOR.id,
  distanceUnit: 'mi',
  targetMinLease: 6, // the user is looking for a 6-month lease (single-point goal, updated 2026-07)
  targetMaxLease: 6,
  sheetUrl: '',
};

export type FlagLevel = 'risk' | 'warn' | 'info' | 'good';
export interface Flag {
  lvl: FlagLevel;
  t: string;
}

/** Overall card signal. '' = none. */
export type SignalLevel = 'risk' | 'warn' | 'good' | '';

/** A SHEET_COLS column: [title, accessor]. Accessor returns a cell value. */
export type SheetCol = [string, (a: Apartment) => string | number];
