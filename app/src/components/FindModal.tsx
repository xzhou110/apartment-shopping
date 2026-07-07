import { useState } from 'react';
import type { ReactElement } from 'react';
import { Modal } from './Modal';
import { IconCheck, IconClose, IconCopy, IconExt } from './icons';
import { SEARCH_LINKS, SEARCH_CRITERIA_LABEL } from '../data/searches';

/** Copy the criteria to the clipboard so it can be pasted into any app. Self-contained "Copied" feedback. */
function CopyCriteria({ text }: { text: string }): ReactElement {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older / non-secure contexts where the async Clipboard API is unavailable.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* give up silently — nothing else we can do */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      type="button"
      className={`crit-copy ${copied ? 'is-copied' : ''}`}
      onClick={copy}
      aria-label="Copy criteria to clipboard"
      title="Copy criteria"
    >
      {copied ? <IconCheck /> : <IconCopy />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

/**
 * "Find listings" launcher — opens the pre-built Zillow / Apartments.com / craigslist / FB Marketplace
 * searches (criteria baked in) in a new tab. The user skims in their own browser, then pastes hits into
 * Add listing (or hands them to me to scam-check + add). No scraping here — these sites block automation.
 */
export function FindModal({ open, onClose }: { open: boolean; onClose: () => void }): ReactElement {
  return (
    <Modal open={open} onClose={onClose} labelledBy="find-title">
      <div className="modal-head">
        <div>
          <div className="modal-title" id="find-title">
            Find listings
          </div>
          <div className="modal-sub find-crit">
            <span>{SEARCH_CRITERIA_LABEL}</span>
            <CopyCriteria text={SEARCH_CRITERIA_LABEL} />
          </div>
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
