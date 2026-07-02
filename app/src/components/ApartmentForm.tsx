import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { Amen, Apartment, LaundryType, ListingType, PetPolicy, Status } from '../types';
import { AMENITIES } from '../data/amenities';
import { Modal } from './Modal';
import { IconClose } from './icons';
import { safeHref } from '../lib/format';

interface Props {
  /** null = add mode; an Apartment = edit mode. undefined = closed. */
  apt: Apartment | null | undefined;
  onClose: () => void;
  onSave: (apt: Apartment) => void;
}

const STATUSES: Status[] = ['New', 'Shortlist', 'Contacted', 'Toured', 'Applied', 'Rejected', 'Leased', 'Gone'];
const LISTING_TYPES: ListingType[] = ['Property mgmt', 'Landlord', 'Sublet', 'Broker', 'Unknown'];
const PET_POLICIES: PetPolicy[] = ['Allowed', 'Cats only', 'Dogs only', 'No pets', 'Unknown'];

/** Tri-state select value for one amenity. */
type AmenChoice = '?' | 'Yes' | 'No';
function amenToChoice(v: boolean | null | undefined): AmenChoice {
  return v === true ? 'Yes' : v === false ? 'No' : '?';
}
function choiceToAmen(c: AmenChoice): boolean | null {
  return c === 'Yes' ? true : c === 'No' ? false : null;
}

/** The draft shape: every field as a string/select-friendly value, plus per-amenity tri-state. */
interface Draft {
  status: Status;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  beds: string;
  baths: string;
  sqft: string;
  floor: string;
  laundry: LaundryType;
  rent: string;
  parkingCost: string;
  petRent: string;
  utilitiesIncluded: '' | 'Yes' | 'No';
  utilitiesEstimate: string;
  deposit: string;
  appFee: string;
  brokerFee: string;
  leaseTermMonths: string;
  minLeaseMonths: string;
  maxLeaseMonths: string;
  availableDate: string;
  furnished: '' | 'Yes' | 'No';
  petPolicy: PetPolicy;
  listingType: ListingType;
  company: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  daysOnMarket: string;
  marketRent: string;
  amen: Record<string, AmenChoice>;
  amenities: string;
  sourceUrl: string;
  image: string;
  expertRating: string;
  scamRisk: boolean;
  rating: string;
  notes: string;
}

function emptyDraft(): Draft {
  const amen: Record<string, AmenChoice> = {};
  AMENITIES.forEach(([k]) => (amen[k] = '?'));
  return {
    status: 'New',
    title: '',
    address: '',
    neighborhood: '',
    city: '',
    beds: '',
    baths: '',
    sqft: '',
    floor: '',
    laundry: 'unknown',
    rent: '',
    parkingCost: '',
    petRent: '',
    utilitiesIncluded: '',
    utilitiesEstimate: '',
    deposit: '',
    appFee: '',
    brokerFee: '',
    leaseTermMonths: '',
    minLeaseMonths: '',
    maxLeaseMonths: '',
    availableDate: '',
    furnished: '',
    petPolicy: 'Unknown',
    listingType: 'Unknown',
    company: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
    daysOnMarket: '',
    marketRent: '',
    amen,
    amenities: '',
    sourceUrl: '',
    image: '',
    expertRating: '',
    scamRisk: false,
    rating: '',
    notes: '',
  };
}

function s(v: number | null | undefined): string {
  return v == null ? '' : String(v);
}
function triStr(v: boolean | null | undefined): '' | 'Yes' | 'No' {
  return v === true ? 'Yes' : v === false ? 'No' : '';
}

function aptToDraft(a: Apartment): Draft {
  const amen: Record<string, AmenChoice> = {};
  AMENITIES.forEach(([k]) => (amen[k] = amenToChoice(a.amen[k])));
  return {
    status: a.status,
    title: a.title,
    address: a.address,
    neighborhood: a.neighborhood,
    city: a.city,
    beds: s(a.beds),
    baths: s(a.baths),
    sqft: s(a.sqft),
    floor: a.floor,
    laundry: a.laundry,
    rent: s(a.rent),
    parkingCost: s(a.parkingCost),
    petRent: s(a.petRent),
    utilitiesIncluded: triStr(a.utilitiesIncluded),
    utilitiesEstimate: s(a.utilitiesEstimate),
    deposit: s(a.deposit),
    appFee: s(a.appFee),
    brokerFee: s(a.brokerFee),
    leaseTermMonths: s(a.leaseTermMonths),
    minLeaseMonths: s(a.minLeaseMonths),
    maxLeaseMonths: s(a.maxLeaseMonths),
    availableDate: a.availableDate,
    furnished: triStr(a.furnished),
    petPolicy: a.petPolicy,
    listingType: a.listingType,
    company: a.contact?.company || '',
    contactName: a.contact?.name || '',
    contactPhone: a.contact?.phone || '',
    contactEmail: a.contact?.email || '',
    contactWebsite: a.contact?.website || '',
    daysOnMarket: s(a.daysOnMarket),
    marketRent: s(a.marketRent),
    amen,
    amenities: (a.amenities || []).join(', '),
    sourceUrl: a.sourceUrl,
    image: a.image,
    expertRating: s(a.expertRating),
    scamRisk: a.scamRisk,
    rating: s(a.rating),
    notes: a.notes,
  };
}

function num(v: string): number | null {
  const t = v.trim();
  return t === '' ? null : Number(t);
}
function triBool(v: '' | 'Yes' | 'No'): boolean | null {
  return v === 'Yes' ? true : v === 'No' ? false : null;
}

/** Build a complete Apartment from the draft. */
function draftToApt(d: Draft, existing: Apartment | null): Apartment {
  const amen: Amen = {};
  AMENITIES.forEach(([k]) => {
    amen[k] = choiceToAmen(d.amen[k] || '?');
  });
  // (petFriendly is no longer a tracked amenity — pet info lives in petPolicy. The old
  // "No pets" → petFriendly:false cross-check was removed with the amenity, 2026-06-30.)

  return {
    id: existing ? existing.id : 'a' + Date.now(),
    status: d.status || 'New',
    title: d.title.trim() || 'Untitled listing',
    address: d.address.trim(),
    neighborhood: d.neighborhood.trim(),
    city: d.city.trim(),
    lat: existing?.lat ?? null,
    lng: existing?.lng ?? null,
    beds: num(d.beds) ?? 0,
    baths: num(d.baths) ?? 1,
    sqft: num(d.sqft),
    floor: d.floor.trim(),
    laundry: d.laundry || 'unknown',
    rent: num(d.rent) ?? 0,
    parkingCost: num(d.parkingCost),
    petRent: num(d.petRent),
    utilitiesIncluded: triBool(d.utilitiesIncluded),
    utilitiesEstimate: num(d.utilitiesEstimate),
    deposit: num(d.deposit),
    appFee: num(d.appFee),
    brokerFee: num(d.brokerFee),
    leaseTermMonths: num(d.leaseTermMonths),
    minLeaseMonths: num(d.minLeaseMonths),
    maxLeaseMonths: num(d.maxLeaseMonths),
    availableDate: d.availableDate.trim(),
    furnished: triBool(d.furnished),
    petPolicy: d.petPolicy || 'Unknown',
    listingType: d.listingType || 'Unknown',
    contact: {
      company: d.company.trim(),
      name: d.contactName.trim(),
      phone: d.contactPhone.trim(),
      email: d.contactEmail.trim(),
      website: d.contactWebsite.trim(),
    },
    amen,
    amenities: d.amenities
      ? d.amenities
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      : [],
    dateSeen: existing?.dateSeen || new Date().toISOString().slice(0, 10),
    daysOnMarket: num(d.daysOnMarket),
    marketRent: num(d.marketRent),
    expertRating: num(d.expertRating) ?? 0,
    scamRisk: d.scamRisk,
    rating: num(d.rating) ?? 0,
    notes: d.notes,
    comments: existing?.comments ?? [], // user overlay — never edited via this form, preserve as-is
    image: d.image.trim(),
    sourceUrl: safeHref(d.sourceUrl) ?? '', // store only safe schemes (defense in depth — review M1)
  };
}

export function ApartmentForm({ apt, onClose, onSave }: Props): ReactElement {
  const open = apt !== undefined;
  const isEdit = !!apt;
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  // Reset the draft whenever we (re)open in add or edit mode.
  useEffect(() => {
    if (apt === undefined) return;
    setDraft(apt ? aptToDraft(apt) : emptyDraft());
  }, [apt]);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }
  function setAmen(k: string, v: AmenChoice) {
    setDraft((d) => ({ ...d, amen: { ...d.amen, [k]: v } }));
  }

  // Paste an image file → data URI (so a screenshot can be dropped into a listing with no upload).
  function onImageFile(file: File | null | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('image', String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!draft.title.trim() && !draft.address.trim()) {
      window.alert('Add at least a title or address');
      return;
    }
    onSave(draftToApt(draft, apt ?? null));
  }

  const txt = (k: keyof Draft, label: string, type = 'text', span = false, opt = false, hint?: string) => (
    <div className={`field ${span ? 'span2' : ''}`}>
      <label>
        {label}
        {opt && <span className="opt"> (optional)</span>}
        {hint && <span className="opt"> — {hint}</span>}
      </label>
      <input type={type} value={draft[k] as string} onChange={(e) => set(k, e.target.value as Draft[typeof k])} />
    </div>
  );

  const tri = (k: 'utilitiesIncluded' | 'furnished', label: string) => (
    <div className="field">
      <label>
        {label} <span className="opt">(optional)</span>
      </label>
      <select value={draft[k]} onChange={(e) => set(k, e.target.value as Draft[typeof k])}>
        <option value="">—</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} labelledBy="form-title">
      <div className="modal-head">
        <div>
          <div className="modal-title" id="form-title">
            {isEdit ? 'Edit listing' : 'Add a listing'}
          </div>
          <div className="modal-sub">Most fields are optional — fill what the listing shows.</div>
        </div>
        <button className="x" onClick={onClose} aria-label="Close">
          <IconClose />
        </button>
      </div>

      <div className="modal-body">
        <div className="form-grid">
          <div className="section-label">Identity &amp; location</div>
          {txt('title', 'Title / building name', 'text', true)}
          {txt('address', 'Street address', 'text', true, true, 'used to geocode — I bake lat/lng into the data file')}
          {txt('neighborhood', 'Neighborhood', 'text', false, true)}
          {txt('city', 'City', 'text', false, true)}

          <div className="section-label">Unit</div>
          {txt('beds', 'Beds (0 = studio)', 'number')}
          {txt('baths', 'Baths', 'number')}
          {txt('sqft', 'Sqft', 'number', false, true)}
          {txt('floor', 'Floor', 'text', false, true, 'e.g. "3rd floor", "garden level"')}
          <div className="field">
            <label>Laundry</label>
            <select value={draft.laundry} onChange={(e) => set('laundry', e.target.value as LaundryType)}>
              <option value="unknown">? Unknown</option>
              <option value="in-unit">In-unit</option>
              <option value="on-site">On-site</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="section-label">Cost (tracked, not totaled — for your own compare)</div>
          {txt('rent', 'Base rent ($/mo)', 'number')}
          {txt('parkingCost', 'Parking cost ($/mo)', 'number', false, true)}
          {txt('petRent', 'Pet rent ($/mo)', 'number', false, true)}
          {tri('utilitiesIncluded', 'Utilities included')}
          {txt('utilitiesEstimate', 'Utilities est. ($/mo)', 'number', false, true, 'when not included')}
          {txt('deposit', 'Deposit ($)', 'number', false, true)}
          {txt('appFee', 'Application fee ($)', 'number', false, true)}
          {txt('brokerFee', 'Broker fee ($)', 'number', false, true)}
          {txt('marketRent', 'Comparable market rent ($)', 'number', false, true, 'drives over/under-market flags')}

          <div className="section-label">Lease &amp; policy</div>
          {txt('leaseTermMonths', 'Lease term (months)', 'number', false, true)}
          {txt('minLeaseMonths', 'Min lease (months)', 'number', false, true)}
          {txt('maxLeaseMonths', 'Max lease (months)', 'number', false, true)}
          {txt('availableDate', 'Available date', 'date', false, true)}
          {tri('furnished', 'Furnished')}
          <div className="field">
            <label>Pet policy</label>
            <select value={draft.petPolicy} onChange={(e) => set('petPolicy', e.target.value as PetPolicy)}>
              {PET_POLICIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Listing type</label>
            <select value={draft.listingType} onChange={(e) => set('listingType', e.target.value as ListingType)}>
              {LISTING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {txt('daysOnMarket', 'Days on market', 'number', false, true)}

          <div className="section-label">Owner / contact</div>
          {txt('company', 'Company / owner', 'text', true, true, 'management company or owner name')}
          {txt('contactName', 'Contact person', 'text', false, true, 'e.g. "Chris"')}
          {txt('contactPhone', 'Phone', 'tel', false, true)}
          {txt('contactEmail', 'Email', 'email', false, true)}
          {txt('contactWebsite', 'Website', 'text', true, true, 'leasing/management site (separate from the listing URL)')}

          <div className="section-label">Amenities (Yes / No / ? unknown)</div>
          {AMENITIES.map(([k, , long]) => (
            <div className="field" key={k}>
              <label>{long}</label>
              <select value={draft.amen[k] || '?'} onChange={(e) => setAmen(k, e.target.value as AmenChoice)}>
                <option value="?">?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ))}

          <div className="section-label">Extras, link &amp; your take</div>
          {txt('amenities', 'Other amenities (comma-separated)', 'text', true, true)}
          {txt('sourceUrl', 'Listing URL', 'text', true, true)}
          {txt('image', 'Image URL or data URI', 'text', true, true, 'paste a listing image URL, or use the file picker below')}
          <div className="field span2">
            <label>
              Image file <span className="opt">(optional — stored inline as a data URI)</span>
            </label>
            <input type="file" accept="image/*" onChange={(e) => onImageFile(e.target.files?.[0])} />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={draft.status} onChange={(e) => set('status', e.target.value as Status)}>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          {txt('expertRating', 'Expert rating (0–5)', 'number', false, true, 'my take — leave as is')}
          {txt('rating', 'Your rating (0–5)', 'number', false, true)}
          <div className="field span2">
            <label>
              <input
                type="checkbox"
                checked={draft.scamRisk}
                onChange={(e) => set('scamRisk', e.target.checked)}
              />{' '}
              Mark as possible scam <span className="opt">— shows a red flag on the card</span>
            </label>
          </div>
          <div className="field span2">
            <label>
              Notes <span className="opt">(optional)</span>
            </label>
            <textarea value={draft.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>

        <div className="form-foot">
          <button className="btn-mini" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-accent" onClick={handleSave}>
            Save listing
          </button>
        </div>
      </div>
    </Modal>
  );
}
