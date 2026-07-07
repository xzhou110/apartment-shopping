import { useState } from 'react';
import type { ReactElement } from 'react';
import type { Apartment } from '../types';
import type { FlagCtx } from '../lib/flags';
import { AMENITIES } from '../data/amenities';
import { amenState, availabilityLabel, money, num, bedsLabel, safeHref, shortDate } from '../lib/format';
import { amenCount, leaseSummary, pricePerSqft, AMENITY_TOTAL } from '../lib/derive';
import { distanceToAnchor, formatDistance } from '../lib/distance';
import { getFlags, signalLevel } from '../lib/flags';
import { assetUrl, flagIcon, LAUNDRY_LABEL, laundryState, LISTED_BY_LABEL, STATUS_BADGE } from './helpers';
import { RatingStars } from './RatingStars';
import { ContactRows, contactLabel, hasContact } from './ContactLinks';
import { IconBath, IconBed, IconChat, IconExt, IconHome, IconPin, IconRoute, IconRuler } from './icons';

interface Props {
  apt: Apartment;
  /** Flag context — settings + the RESOLVED primary anchor coord (the integration seam). */
  ctx: FlagCtx;
  /** The primary anchor's label (e.g. "Work") for the distance chip. null when no anchor. */
  anchorLabel: string | null;
  inCompare: boolean;
  onToggleCompare: (id: string) => void;
  onOpen: (id: string) => void;
  onSetYou: (id: string, n: number) => void;
}

function ImageBlock({ apt }: { apt: Apartment }): ReactElement {
  const [failed, setFailed] = useState(false);
  if (apt.image && !failed) {
    return (
      <img
        className="card-img"
        src={assetUrl(apt.image)}
        alt={apt.title}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="ph">
      <IconHome />
      <span className="ph-txt">{apt.title || 'No image'}</span>
    </div>
  );
}

export function Card({ apt, ctx, anchorLabel, inCompare, onToggleCompare, onOpen, onSetYou }: Props): ReactElement {
  const sig = signalLevel(apt, ctx);
  const flags = getFlags(apt, ctx).slice(0, 3);
  const unit = ctx.settings.distanceUnit;
  const dist = distanceToAnchor(apt, ctx.primaryAnchor, unit);
  const showChip = dist != null && anchorLabel != null;
  const ppsf = pricePerSqft(apt);
  const loc = [apt.neighborhood, apt.city].filter(Boolean).join(' · ');
  const listedBy = LISTED_BY_LABEL[apt.listingType] || '';
  const availStr = availabilityLabel(apt);
  // Color the availability value: "Now" reads good, "Unavailable — ask" reads amber; a date stays neutral.
  const availCls = availStr === 'Now' ? ' term-good' : availStr.startsWith('Unavailable') ? ' term-warn' : '';
  const leaseStr = leaseSummary(apt);
  const lState = laundryState(apt.laundry);
  const lMark = lState === 'yes' ? '✓' : lState === 'no' ? '✕' : '?';
  const showContact = hasContact(apt.contact);
  const cWho = showContact ? contactLabel(apt.contact) || 'Contact' : '';
  const commentCount = apt.comments.length;
  const latestComment = commentCount > 0 ? apt.comments[commentCount - 1] : null;

  return (
    <article
      className={`card ${sig ? 'signal-' + sig : ''} ${apt.status === 'Rejected' ? 'is-rejected' : ''}`}
      onClick={() => onOpen(apt.id)}
      role="button"
      tabIndex={0}
      aria-label={`${apt.title} — open details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(apt.id);
        }
      }}
    >
      <div className="card-imgwrap">
        <ImageBlock apt={apt} />
        <span className="card-id" title="Listing ID (matches the data file & image)">
          {apt.id}
        </span>
        {apt.status && apt.status !== 'New' && <span className="status-tag">{apt.status}</span>}
        <div className="card-cmp" onClick={(e) => e.stopPropagation()}>
          <label className="cmp-box">
            <input
              type="checkbox"
              checked={inCompare}
              onChange={() => onToggleCompare(apt.id)}
              aria-label={`Compare ${apt.title}`}
            />
            Compare
          </label>
        </div>
      </div>

      <div className="card-body">
        <div className="card-head">
          <div>
            <div className="card-title">{apt.title}</div>
            {loc && <div className="card-trim">{loc}</div>}
          </div>
        </div>

        <div className="price-row">
          <span className="price num">
            {money(apt.rent)}
            <span className="price-per">/mo</span>
          </span>
          {apt.marketRent ? <span className="price-sub num">vs {money(apt.marketRent)} mkt</span> : null}
        </div>

        <div className="spec-row">
          <span className="spec">
            <IconBed />
            <b>{bedsLabel(apt.beds)}</b>
          </span>
          <span className="spec">
            <IconBath />
            <b>{apt.baths} ba</b>
          </span>
          {apt.sqft != null && (
            <span className="spec">
              <IconRuler />
              <b>{num(apt.sqft)} sqft</b>
            </span>
          )}
          {ppsf != null && <span className="spec spec-muted">${ppsf}/sqft</span>}
        </div>

        {(apt.deposit != null || availStr || leaseStr) && (
          <div className="terms-row">
            {apt.deposit != null && (
              <span className="term">
                <span className="term-l">Deposit</span> {money(apt.deposit)}
              </span>
            )}
            {availStr && (
              <span className={`term${availCls}`}>
                {/* "Available Unavailable — ask" reads contradictory — that state stands alone. */}
                {!availStr.startsWith('Unavailable') && <span className="term-l">Available</span>}{' '}
                {availStr}
              </span>
            )}
            {leaseStr && (
              <span className="term">
                <span className="term-l">Lease</span> {leaseStr}
              </span>
            )}
          </div>
        )}

        {/* Distance chip — hidden when no anchor or the listing has no coord. */}
        {showChip && (
          <div className="dist-chip" title={`Straight-line distance to ${anchorLabel}`}>
            <IconRoute />
            <span>
              {formatDistance(dist, unit)} to <b>{anchorLabel}</b>
            </span>
          </div>
        )}

        {loc && (
          <div className="loc">
            <IconPin />
            {apt.address || loc}
          </div>
        )}

        {listedBy && (
          <span className="listed-by" title="Who's renting it out (owner vs. company)">
            Listed by <b>{listedBy}</b>
          </span>
        )}

        {showContact && (
          <div className="contact-block" title="Owner / management contact">
            <span className="contact-who">{cWho}</span>
            <ContactRows contact={apt.contact} />
          </div>
        )}

        <div className="kf-block">
          <div className="kf-head">
            Amenities <span className="kf-score num">{amenCount(apt)}/{AMENITY_TOTAL}</span>
          </div>
          <div className="kf-tags">
            <span className={`kf kf-${lState}`} title="Laundry — in-unit vs on-site">
              <b>{lMark}</b>
              {LAUNDRY_LABEL[apt.laundry]}
            </span>
            {AMENITIES.map(([k, short]) => {
              const st = amenState(apt, k);
              const mark = st === 'yes' ? '✓' : st === 'no' ? '✕' : '?';
              return (
                <span key={k} className={`kf kf-${st}`}>
                  <b>{mark}</b>
                  {short}
                </span>
              );
            })}
          </div>
        </div>

        {flags.length > 0 && (
          <div className="flags">
            {flags.map((f, i) => (
              <div key={i} className={`flag f-${f.lvl}`}>
                {flagIcon(f.lvl)}
                <span>{f.t}</span>
              </div>
            ))}
          </div>
        )}

        {latestComment && (
          <div className="card-comment" title="Your latest comment — open the card to see all">
            <div className="card-comment-head">
              <IconChat />
              <span>Your note</span>
              {commentCount > 1 && <span className="card-comment-more">+{commentCount - 1} earlier</span>}
              <span className="card-comment-ts">{shortDate(latestComment.ts)}</span>
            </div>
            <div className="card-comment-text">{latestComment.text}</div>
          </div>
        )}

        <div className="card-foot" onClick={(e) => e.stopPropagation()}>
          <div className="ratings">
            <RatingStars label="Expert" value={apt.expertRating} variant="r-exp" />
            <RatingStars label="You" value={apt.rating} variant="r-you" onSet={(n) => onSetYou(apt.id, n)} />
          </div>
          <div className="card-foot-right">
            <span className={`badge ${STATUS_BADGE[apt.status] || 'b-neutral'}`}>{apt.status || 'New'}</span>
            {safeHref(apt.sourceUrl) ? (
              <a
                className="listing-link"
                href={safeHref(apt.sourceUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View listing <IconExt />
              </a>
            ) : (
              <span className="listing-link disabled">No link</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
