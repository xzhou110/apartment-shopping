import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import type { Apartment, Settings } from '../types';
import type { Coord } from '../lib/distance';
import { AMENITIES } from '../data/amenities';
import { amenState, availabilityLabel, money, num, bedsLabel, safeHref, telHref, mailtoHref, siteHref } from '../lib/format';
import { isIncomeRestrictedComment, pricePerSqft, leaseFits, leaseSummary } from '../lib/derive';
import { distanceToAnchor, formatDistance } from '../lib/distance';
import { getFlags } from '../lib/flags';
import { Modal } from './Modal';
import { RatingStars } from './RatingStars';
import { hasContact } from './ContactLinks';
import { assetUrl, flagIcon, LAUNDRY_LABEL, LISTED_BY_LABEL } from './helpers';
import { IconExt, IconClose, IconHome, IconTrash } from './icons';

interface Props {
  apt: Apartment | null;
  settings: Settings;
  /** Resolved primary anchor coord + label — for the flag ctx + the distance field. */
  primaryAnchor: Coord | null;
  anchorLabel: string | null;
  inCompare: boolean;
  onClose: () => void;
  onToggleCompare: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  /** Toggle: sets 'Gone', or un-marks back to 'New' when it's already Gone. */
  onToggleGone: (id: string) => void;
  /** Toggle: sets 'Ruled out', or un-marks back to 'New' when it's already Ruled out. */
  onToggleRuledOut: (id: string) => void;
  onSetExpert: (id: string, n: number) => void;
  onSetYou: (id: string, n: number) => void;
  onAddComment: (id: string, text: string) => void;
  onDeleteComment: (id: string, commentId: string) => void;
}

/** Renders a labelled field only when the value is meaningful. */
function Field({ label, children }: { label: string; children: ReactNode }): ReactElement | null {
  if (children == null || children === '') return null;
  return (
    <div className="dfield">
      <span className="dfield-l">{label}</span>
      <span className="dfield-v">{children}</span>
    </div>
  );
}

function DetailImage({ apt }: { apt: Apartment }): ReactElement {
  const [failed, setFailed] = useState(false);
  if (apt.image && !failed) {
    return <img className="det-img" src={assetUrl(apt.image)} alt={apt.title} onError={() => setFailed(true)} />;
  }
  return (
    <div className="det-img-ph">
      <IconHome />
      <span>{apt.title}</span>
    </div>
  );
}

function triNode(v: boolean | null | undefined, yes = 'Yes', no = 'No'): ReactNode {
  if (v === true) return <b style={{ color: 'var(--good)' }}>{yes}</b>;
  if (v === false) return <span style={{ color: 'var(--ink-3)' }}>{no}</span>;
  return <span style={{ color: 'var(--warn)' }}>Unknown</span>;
}

function leaseFitNode(a: Apartment, settings: Settings): ReactNode {
  const fit = leaseFits(a, settings);
  if (fit === true) return <b style={{ color: 'var(--good)' }}>Fits your window</b>;
  if (fit === false) return <b style={{ color: 'var(--risk)' }}>Outside your window</b>;
  return <span style={{ color: 'var(--warn)' }}>Unknown</span>;
}

/** A contact value as a link when it resolves to a safe href, else the raw text (or '' → Field hides it). */
function contactLink(value: string, href: string | undefined, external = false): ReactNode {
  if (!value) return '';
  if (!href) return value;
  return (
    <a className="clink" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {value}
    </a>
  );
}

/** Full timestamp for a comment ("Jul 1, 2026, 3:42 PM"). Safe for a real instant (not a date-only value). */
function fmtTs(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Your comments on a listing: newest-at-bottom list with delete, plus an add box. */
function CommentsSection({
  apt,
  onAdd,
  onDelete,
}: {
  apt: Apartment;
  onAdd: (id: string, text: string) => void;
  onDelete: (id: string, commentId: string) => void;
}): ReactElement {
  const [text, setText] = useState('');
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onAdd(apt.id, t);
    setText('');
  };
  return (
    <section className="det-section">
      <h4>Comments</h4>
      {apt.comments.length > 0 ? (
        <ul className="cmt-list">
          {apt.comments.map((c) => (
            <li key={c.id} className={`cmt${isIncomeRestrictedComment(c.text) ? ' cmt-risk' : ''}`}>
              <div className="cmt-main">
                <div className="cmt-text">{c.text}</div>
                <div className="cmt-ts">{fmtTs(c.ts)}</div>
              </div>
              <button
                className="cmt-del"
                onClick={() => onDelete(apt.id, c.id)}
                aria-label="Delete comment"
                title="Delete comment"
              >
                <IconTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="cmt-empty">No comments yet — add your first note below.</div>
      )}
      <div className="cmt-add">
        <textarea
          className="cmt-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment… e.g. Called Chris — unit still open, tour booked Sat 2pm"
          rows={2}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button className="btn btn-accent cmt-submit" onClick={submit} disabled={!text.trim()}>
          Add comment
        </button>
      </div>
    </section>
  );
}

export function DetailModal({
  apt,
  settings,
  primaryAnchor,
  anchorLabel,
  inCompare,
  onClose,
  onToggleCompare,
  onEdit,
  onDelete,
  onToggleGone,
  onToggleRuledOut,
  onSetExpert,
  onSetYou,
  onAddComment,
  onDeleteComment,
}: Props): ReactElement {
  const open = !!apt;
  const unit = settings.distanceUnit;
  const dist = apt ? distanceToAnchor(apt, primaryAnchor, unit) : null;
  const ppsf = apt ? pricePerSqft(apt) : null;
  const flags = apt ? getFlags(apt, { settings, primaryAnchor }) : [];

  return (
    <Modal open={open} onClose={onClose} wide labelledBy="detail-title">
      {apt && (
        <>
          <div className="modal-head">
            <div>
              <div className="modal-title" id="detail-title">
                {apt.title}
              </div>
              <div className="modal-sub">
                {[apt.neighborhood, apt.city].filter(Boolean).join(' · ')}
                {apt.status && apt.status !== 'New' ? (
                  <>
                    {' '}
                    · <span style={{ color: 'var(--accent)' }}>{apt.status}</span>
                  </>
                ) : null}
              </div>
            </div>
            <button className="x" onClick={onClose} aria-label="Close">
              <IconClose />
            </button>
          </div>

          <div className="modal-body">
            <DetailImage apt={apt} />

            <section className="det-section">
              <h4>Unit &amp; location</h4>
              <div className="det-grid">
                <Field label="Rent">
                  <b className="num" style={{ fontSize: 18 }}>
                    {money(apt.rent)}
                  </b>{' '}
                  <span style={{ color: 'var(--ink-3)', fontWeight: 500, fontSize: 12 }}>/mo</span>
                </Field>
                <Field label="Beds">{bedsLabel(apt.beds)}</Field>
                <Field label="Baths">{apt.baths}</Field>
                <Field label="Sqft">{apt.sqft != null ? num(apt.sqft) : ''}</Field>
                <Field label="Rent / sqft">{ppsf != null ? '$' + ppsf : ''}</Field>
                <Field label="Floor">{apt.floor}</Field>
                <Field label="Laundry">{LAUNDRY_LABEL[apt.laundry]}</Field>
                <Field label="Address">{apt.address}</Field>
                <Field label="Neighborhood">{apt.neighborhood}</Field>
                <Field label="City">{apt.city}</Field>
                <Field label={anchorLabel ? `Distance to ${anchorLabel}` : 'Distance'}>
                  {dist != null ? <b className="num">{formatDistance(dist, unit)}</b> : ''}
                </Field>
                <Field label="Market rent">{apt.marketRent != null ? money(apt.marketRent) : ''}</Field>
              </div>
            </section>

            <section className="det-section">
              <h4>Cost</h4>
              <div className="det-grid">
                <Field label="Parking cost">{apt.parkingCost != null ? money(apt.parkingCost) : ''}</Field>
                <Field label="Pet rent">{apt.petRent != null ? money(apt.petRent) : ''}</Field>
                <Field label="Utilities included">{triNode(apt.utilitiesIncluded)}</Field>
                <Field label="Utilities est.">{apt.utilitiesEstimate != null ? money(apt.utilitiesEstimate) : ''}</Field>
                <Field label="Deposit">{apt.deposit != null ? money(apt.deposit) : ''}</Field>
                <Field label="App fee">{apt.appFee != null ? money(apt.appFee) : ''}</Field>
                <Field label="Broker fee">{apt.brokerFee != null ? money(apt.brokerFee) : ''}</Field>
              </div>
            </section>

            <section className="det-section">
              <h4>Lease &amp; policy</h4>
              <div className="det-grid">
                <Field label="Lease fit">{leaseFitNode(apt, settings)}</Field>
                <Field label="Lease term">{leaseSummary(apt)}</Field>
                <Field label="Min lease">{apt.minLeaseMonths != null ? `${apt.minLeaseMonths} mo` : ''}</Field>
                <Field label="Max lease">{apt.maxLeaseMonths != null ? `${apt.maxLeaseMonths} mo` : ''}</Field>
                {/* "Availability", not "Available" — the value can be "Unavailable — ask". */}
                <Field label="Availability">{availabilityLabel(apt)}</Field>
                <Field label="Furnished">{triNode(apt.furnished)}</Field>
                <Field label="Pet policy">{apt.petPolicy}</Field>
                <Field label="Listed by">{LISTED_BY_LABEL[apt.listingType] || apt.listingType}</Field>
                <Field label="Days on market">{apt.daysOnMarket}</Field>
                <Field label="Date seen">{apt.dateSeen}</Field>
              </div>
            </section>

            {hasContact(apt.contact) && (
              <section className="det-section">
                <h4>Owner / contact</h4>
                <div className="det-grid">
                  <Field label="Company / owner">{apt.contact.company}</Field>
                  <Field label="Contact person">{apt.contact.name}</Field>
                  <Field label="Phone">{contactLink(apt.contact.phone, telHref(apt.contact.phone))}</Field>
                  <Field label="Email">{contactLink(apt.contact.email, mailtoHref(apt.contact.email))}</Field>
                  <Field label="Website">{contactLink(apt.contact.website, siteHref(apt.contact.website), true)}</Field>
                </div>
              </section>
            )}

            <section className="det-section">
              <h4>Ratings</h4>
              <div className="ratings">
                <RatingStars label="Expert" value={apt.expertRating} variant="r-exp" onSet={(n) => onSetExpert(apt.id, n)} />
                <RatingStars label="You" value={apt.rating} variant="r-you" onSet={(n) => onSetYou(apt.id, n)} />
              </div>
            </section>

            <section className="det-section">
              <h4>Amenities</h4>
              <div className="det-feats">
                {AMENITIES.map(([k, , long]) => {
                  const st = amenState(apt, k);
                  const mark = st === 'yes' ? '✓' : st === 'no' ? '✕' : '?';
                  return (
                    <div key={k} className={`dfeat dfeat-${st}`}>
                      <span className="dfeat-m">{mark}</span>
                      {long}
                    </div>
                  );
                })}
              </div>
              {(apt.amenities || []).length > 0 && (
                <div className="feat-tags" style={{ marginTop: 11 }}>
                  {apt.amenities.map((f, i) => (
                    <span key={i} className="ftag">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="det-section">
              <h4>Flags</h4>
              {flags.length ? (
                flags.map((f, i) => (
                  <div key={i} className={`flag f-${f.lvl}`} style={{ marginBottom: 6 }}>
                    {flagIcon(f.lvl)}
                    <span>{f.t}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--good)', fontSize: 13 }}>No flags raised.</div>
              )}
            </section>

            {apt.notes && (
              <section className="det-section">
                <h4>Notes</h4>
                <div className="det-notes">{apt.notes}</div>
              </section>
            )}

            <CommentsSection key={apt.id} apt={apt} onAdd={onAddComment} onDelete={onDeleteComment} />

            <div className="det-actions">
              {safeHref(apt.sourceUrl) && (
                <a className="btn btn-accent" href={safeHref(apt.sourceUrl)} target="_blank" rel="noopener noreferrer">
                  Open listing <IconExt />
                </a>
              )}
              <button className="btn-mini" onClick={() => onEdit(apt.id)}>
                Edit
              </button>
              <label className="btn-mini" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inCompare}
                  onChange={() => onToggleCompare(apt.id)}
                  style={{ marginRight: 6, accentColor: 'var(--accent)' }}
                />
                Compare
              </label>
              {/* Gone / Ruled out are TOGGLES (user 2026-07-16: "select them and unselect them, in
                  case mistakes"). Both always render — a button that unmounts once clicked is a
                  one-way door. Lit (`.on`) = the listing currently has that status; the label always
                  names what the next click does, matching the filter chips' Show/Hide convention. */}
              <button
                className={`btn-mini ${apt.status === 'Gone' ? 'on' : ''}`}
                onClick={() => onToggleGone(apt.id)}
                title={
                  apt.status === 'Gone'
                    ? 'Undo — puts it back on the active list with status New'
                    : "Off the market entirely — hides the listing (the Show gone chip brings it back)"
                }
              >
                {apt.status === 'Gone' ? 'Put back on list' : 'Mark as gone'}
              </button>
              <button
                className={`btn-mini ${apt.status === 'Ruled out' ? 'on' : ''}`}
                onClick={() => onToggleRuledOut(apt.id)}
                title={
                  apt.status === 'Ruled out'
                    ? 'Undo — puts it back on the active list with status New'
                    : "Not available to you / didn't qualify — hides the listing (the Show ruled out chip brings it back)"
                }
              >
                {apt.status === 'Ruled out' ? 'Put back on list' : 'Rule out'}
              </button>
              <button className="btn-mini" onClick={() => onDelete(apt.id)} style={{ color: 'var(--risk)' }}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
