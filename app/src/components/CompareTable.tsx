import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Apartment, Settings } from '../types';
import type { Coord } from '../lib/distance';
import { AMENITIES } from '../data/amenities';
import { amenState, availabilityLabel, money, num, bedsLabel, safeHref } from '../lib/format';
import { amenCount, pricePerSqft, leaseFits, leaseSummary, AMENITY_TOTAL } from '../lib/derive';
import { distanceToAnchor, formatDistance } from '../lib/distance';
import { getFlags } from '../lib/flags';
import { assetUrl, LAUNDRY_LABEL, STATUS_BADGE } from './helpers';
import { IconClose, IconExt, IconHome } from './icons';

interface Props {
  apartments: Apartment[]; // only those in the compare set, in stable order
  settings: Settings;
  /** Resolved primary anchor coord — drives the "nearest" compare row + flags. */
  primaryAnchor: Coord | null;
  anchorLabel: string | null;
  onToggleCompare: (id: string) => void;
  onGoToGrid: () => void;
}

/** A row's best/worst highlighting rule. dir picks the best end. */
interface RowOpts {
  numv?: (a: Apartment) => number | null;
  dir?: 'min' | 'max';
  cellClass?: (a: Apartment) => string;
  label?: string;
}
type Row = [string, (a: Apartment) => ReactNode, RowOpts];

// ---- cell renderers ----
function amenYn(a: Apartment, k: (typeof AMENITIES)[number][0]): ReactNode {
  const st = amenState(a, k);
  if (st === 'yes') return <b style={{ color: 'var(--good)' }}>Yes</b>;
  if (st === 'no') return <span style={{ color: 'var(--ink-3)' }}>No</span>;
  return <span style={{ color: 'var(--warn)' }}>?</span>;
}
function triCell(v: boolean | null | undefined, yes = 'Yes', no = 'No'): ReactNode {
  if (v === true) return <b style={{ color: 'var(--good)' }}>{yes}</b>;
  if (v === false) return <span style={{ color: 'var(--ink-3)' }}>{no}</span>;
  return <span style={{ color: 'var(--warn)' }}>?</span>;
}
function leaseFitCell(a: Apartment, settings: Settings): ReactNode {
  const fit = leaseFits(a, settings);
  if (fit === true) return <b style={{ color: 'var(--good)' }}>Fits</b>;
  if (fit === false) return <b style={{ color: 'var(--risk)' }}>No fit</b>;
  return <span style={{ color: 'var(--warn)' }}>?</span>;
}
function flagsCell(a: Apartment, settings: Settings, primaryAnchor: Coord | null): ReactNode {
  const f = getFlags(a, { settings, primaryAnchor }).filter((x) => x.lvl === 'risk' || x.lvl === 'warn');
  if (!f.length) return <span style={{ color: 'var(--good)' }}>No flags</span>;
  return (
    <div className="cmp-flags-cell">
      {f.map((x, i) => (
        <span key={i} style={{ color: `var(--${x.lvl})`, fontSize: 12 }}>
          • {x.t}
        </span>
      ))}
    </div>
  );
}

function buildRows(settings: Settings, primaryAnchor: Coord | null, anchorLabel: string | null): Row[] {
  const unit = settings.distanceUnit;
  const amenityRows: Row[] = AMENITIES.map(([k, , long]) => [
    long,
    (a: Apartment) => amenYn(a, k),
    { cellClass: (a: Apartment) => (amenState(a, k) === 'yes' ? 'best' : '') },
  ]);

  return [
    ['Rent', (a) => <b className="num">{money(a.rent)}</b>, { numv: (a) => a.rent, dir: 'min' }],
    ['Beds', (a) => bedsLabel(a.beds), { numv: (a) => a.beds, dir: 'max' }],
    ['Baths', (a) => a.baths, { numv: (a) => a.baths, dir: 'max' }],
    ['Sqft', (a) => (a.sqft != null ? num(a.sqft) : '—'), { numv: (a) => a.sqft, dir: 'max' }],
    ['Rent / sqft', (a) => (pricePerSqft(a) != null ? '$' + pricePerSqft(a) : '—'), { numv: (a) => pricePerSqft(a), dir: 'min' }],
    ['Floor', (a) => a.floor || '—', {}],
    ['Laundry', (a) => LAUNDRY_LABEL[a.laundry], { cellClass: (a) => (a.laundry === 'in-unit' ? 'best' : '') }],
    [
      anchorLabel ? `Distance to ${anchorLabel}` : 'Distance',
      (a) => formatDistance(distanceToAnchor(a, primaryAnchor, unit), unit),
      { numv: (a) => distanceToAnchor(a, primaryAnchor, unit), dir: 'min' },
    ],
    ['Parking cost', (a) => money(a.parkingCost), { numv: (a) => a.parkingCost, dir: 'min' }],
    ['Pet rent', (a) => money(a.petRent), { numv: (a) => a.petRent, dir: 'min' }],
    ['Utilities incl.', (a) => triCell(a.utilitiesIncluded), {}],
    ['Utilities est.', (a) => money(a.utilitiesEstimate), {}],
    ['Deposit', (a) => money(a.deposit), { numv: (a) => a.deposit, dir: 'min' }],
    ['App fee', (a) => money(a.appFee), { numv: (a) => a.appFee, dir: 'min' }],
    ['Broker fee', (a) => money(a.brokerFee), { numv: (a) => a.brokerFee, dir: 'min' }],
    ['Lease fit', (a) => leaseFitCell(a, settings), {}],
    ['Lease term', (a) => leaseSummary(a) || '—', {}],
    ['Availability', (a) => availabilityLabel(a) || '—', {}],
    ['Furnished', (a) => triCell(a.furnished), {}],
    ['Pet policy', (a) => a.petPolicy || '—', {}],
    ['Listing type', (a) => a.listingType || '—', {}],
    ['Days on market', (a) => a.daysOnMarket ?? '—', { numv: (a) => a.daysOnMarket, dir: 'max', label: 'leverage' }],
    ['Market rent', (a) => money(a.marketRent), {}],
    [
      'Amenities',
      (a) => (
        <>
          <b className="num">{amenCount(a)}</b> <span style={{ color: 'var(--ink-3)' }}>/ {AMENITY_TOTAL}</span>
        </>
      ),
      { numv: (a) => amenCount(a), dir: 'max' },
    ],
    ...amenityRows,
    ['Other amenities', (a) => (a.amenities || []).join(', ') || '—', {}],
    ['Expert ★', (a) => ratingMini(a.expertRating), { numv: (a) => a.expertRating, dir: 'max' }],
    ['Your ★', (a) => ratingMini(a.rating), { numv: (a) => a.rating, dir: 'max' }],
    [
      'Status',
      (a) => <span className={`badge ${STATUS_BADGE[a.status] || 'b-neutral'}`}>{a.status || 'New'}</span>,
      {},
    ],
    ['Flags', (a) => flagsCell(a, settings, primaryAnchor), {}],
    ['Notes', (a) => a.notes || '—', {}],
    [
      'Listing',
      (a) => {
        const href = safeHref(a.sourceUrl);
        return href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            Open <IconExt />
          </a>
        ) : (
          '—'
        );
      },
      {},
    ],
  ];
}

function ratingMini(v: number): ReactNode {
  if (!v) return '—';
  return (
    <>
      {'★'.repeat(v)}
      <span style={{ color: 'var(--line-2)' }}>{'★'.repeat(5 - v)}</span>
    </>
  );
}

/** Compute best/worst ids for a numeric row. Ties (all-equal) → no highlight. */
function bestWorst(apts: Apartment[], opts: RowOpts): { bestId: string | null; worstId: string | null } {
  if (!opts.numv) return { bestId: null, worstId: null };
  const vals = apts
    .map((a) => ({ id: a.id, v: opts.numv!(a) }))
    .filter((x): x is { id: string; v: number } => x.v != null && !isNaN(x.v));
  if (vals.length < 2) return { bestId: null, worstId: null };
  const sorted = [...vals].sort((a, b) => a.v - b.v);
  if (sorted[0].v === sorted[sorted.length - 1].v) return { bestId: null, worstId: null }; // all tie
  if (opts.dir === 'min') return { bestId: sorted[0].id, worstId: sorted[sorted.length - 1].id };
  return { bestId: sorted[sorted.length - 1].id, worstId: sorted[0].id };
}

function AptThumb({ apt }: { apt: Apartment }): ReactElement {
  const [failed, setFailed] = useState(false);
  if (apt.image && !failed) {
    return <img className="cmp-thumb" src={assetUrl(apt.image)} alt={apt.title} onError={() => setFailed(true)} />;
  }
  return (
    <div className="cmp-thumb-ph">
      <IconHome />
    </div>
  );
}

export function CompareTable({
  apartments,
  settings,
  primaryAnchor,
  anchorLabel,
  onToggleCompare,
  onGoToGrid,
}: Props): ReactElement {
  if (apartments.length < 2) {
    return (
      <div className="empty">
        <IconHome />
        <h3>Pick listings to compare</h3>
        <p>
          Tick the “Compare” box on at least two cards in Grid view. Best and worst values get highlighted
          automatically.
        </p>
        <button className="btn btn-accent" style={{ margin: '0 auto' }} onClick={onGoToGrid}>
          Go to grid
        </button>
      </div>
    );
  }

  const rows = buildRows(settings, primaryAnchor, anchorLabel);

  return (
    <div className="cmp-wrap">
      <table className="cmp">
        <thead className="cmp-head">
          <tr>
            <th className="cmp-attr">Attribute</th>
            {apartments.map((a) => (
              <th key={a.id} className="cmp-carhead">
                <AptThumb apt={a} />
                <div className="cmp-carname">{a.title}</div>
                <div className="cmp-cartrim">{[a.neighborhood, a.city].filter(Boolean).join(' · ')}</div>
                <button className="cmp-rm" onClick={() => onToggleCompare(a.id)}>
                  <IconClose />
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get, opts], ri) => {
            const { bestId, worstId } = bestWorst(apartments, opts);
            return (
              <tr key={ri}>
                <td className="cmp-attr">
                  {label}
                  {opts.label ? (
                    <span style={{ fontWeight: 500, textTransform: 'none', color: 'var(--ink-3)' }}>
                      {' '}
                      ({opts.label})
                    </span>
                  ) : null}
                </td>
                {apartments.map((a) => {
                  let cls = '';
                  if (opts.cellClass) {
                    cls = opts.cellClass(a) || '';
                  } else {
                    if (a.id === bestId) cls = 'best';
                    else if (a.id === worstId) cls = 'worst';
                  }
                  const showDot = a.id === bestId;
                  return (
                    <td key={a.id} className={`${cls} cmp-val`}>
                      {get(a)}
                      {showDot ? <span className="best-dot">{opts.label ? '▲' : 'BEST'}</span> : null}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
