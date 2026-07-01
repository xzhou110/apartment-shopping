import type { ReactElement } from 'react';
import { Modal } from './Modal';
import { IconClose, IconExt } from './icons';
import { SEARCH_LINKS, SEARCH_CRITERIA_LABEL } from '../data/searches';

/**
 * "Find listings" launcher — opens the pre-built craigslist / FB Marketplace searches (criteria
 * baked in) in a new tab. The user skims in their own browser, then pastes hits into Add listing
 * (or hands them to me to scam-check + add). No scraping here — craigslist blocks automation.
 */
export function FindModal({ open, onClose }: { open: boolean; onClose: () => void }): ReactElement {
  return (
    <Modal open={open} onClose={onClose} labelledBy="find-title">
      <div className="modal-head">
        <div>
          <div className="modal-title" id="find-title">
            Find listings
          </div>
          <div className="modal-sub">{SEARCH_CRITERIA_LABEL}</div>
        </div>
        <button className="x" onClick={onClose} aria-label="Close">
          <IconClose />
        </button>
      </div>

      <div className="modal-body">
        <div className="find-links">
          {SEARCH_LINKS.map((s) => (
            <a key={s.url} className="find-link" href={s.url} target="_blank" rel="noopener noreferrer">
              <span className="find-link-main">
                {s.label}
                <IconExt />
              </span>
              <span className="find-link-sub">{s.sub}</span>
            </a>
          ))}
        </div>
        <p className="find-note">
          Each opens ready-filtered in a new tab (craigslist needs no login). Skim, then paste any candidate’s
          link into <b>Add listing</b> — or send it to me and I’ll scam-check it and add it for you.
        </p>
      </div>
    </Modal>
  );
}
