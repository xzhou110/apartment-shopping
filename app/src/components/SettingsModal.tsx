import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { Anchor, Settings } from '../types';
import { resolveAnchor, geocodeRemote } from '../data/geocode';
import { Modal } from './Modal';
import { IconClose, IconPin, IconPlus } from './icons';

interface Props {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onSave: (patch: Partial<Settings>) => void;
  onToast: (msg: string) => void;
  // anchor CRUD (lifted from the hook)
  addAnchor: (anchor: Omit<Anchor, 'id'>) => string;
  updateAnchor: (id: string, patch: Partial<Omit<Anchor, 'id'>>) => void;
  removeAnchor: (id: string) => void;
  setPrimaryAnchor: (id: string | null) => void;
}

export function SettingsModal({
  open,
  settings,
  onClose,
  onSave,
  onToast,
  addAnchor,
  updateAnchor,
  removeAnchor,
  setPrimaryAnchor,
}: Props): ReactElement {
  const [unit, setUnit] = useState<'mi' | 'km'>(settings.distanceUnit);
  const [minLease, setMinLease] = useState(String(settings.targetMinLease ?? 6));
  const [maxLease, setMaxLease] = useState(String(settings.targetMaxLease ?? 12));
  const [sheetUrlStr, setSheetUrlStr] = useState(settings.sheetUrl || '');
  // new-anchor draft
  const [newLabel, setNewLabel] = useState('');
  const [newQuery, setNewQuery] = useState('');

  // Re-seed the inputs each time the modal opens.
  useEffect(() => {
    if (open) {
      setUnit(settings.distanceUnit);
      setMinLease(String(settings.targetMinLease ?? 6));
      setMaxLease(String(settings.targetMaxLease ?? 12));
      setSheetUrlStr(settings.sheetUrl || '');
      setNewLabel('');
      setNewQuery('');
    }
  }, [open, settings.distanceUnit, settings.targetMinLease, settings.targetMaxLease, settings.sheetUrl]);

  function apply() {
    onSave({
      distanceUnit: unit,
      targetMinLease: Number(minLease) || 6,
      targetMaxLease: Number(maxLease) || 12,
      sheetUrl: sheetUrlStr.trim(),
    });
    onToast('Settings applied');
    onClose();
  }

  /** Resolve flow for a freshly-added anchor (offline first, async fallback patches coord). */
  async function addNewAnchor() {
    const query = newQuery.trim();
    if (!query) {
      onToast('Enter a city, ZIP or address for the anchor');
      return;
    }
    const offline = resolveAnchor(query);
    const id = addAnchor({
      label: newLabel.trim() || query,
      query,
      lat: offline?.lat ?? null,
      lng: offline?.lng ?? null,
    });
    setNewLabel('');
    setNewQuery('');
    if (offline) {
      onToast('Anchor added');
      return;
    }
    // offline miss → try remote, patch coord on success
    onToast('Anchor added — resolving address…');
    try {
      const remote = await geocodeRemote(query);
      if (remote) {
        updateAnchor(id, { lat: remote.lat, lng: remote.lng });
        onToast('Anchor resolved');
      } else {
        onToast('Couldn’t resolve that place — distance hidden for this anchor');
      }
    } catch {
      onToast('Couldn’t resolve that place — distance hidden for this anchor');
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="settings-title">
      <div className="modal-head">
        <div>
          <div className="modal-title" id="settings-title">
            Settings
          </div>
          <div className="modal-sub">Distance anchors, units, your lease target, and Google Sheet sync.</div>
        </div>
        <button className="x" onClick={onClose} aria-label="Close">
          <IconClose />
        </button>
      </div>

      <div className="modal-body">
        {/* ---- Anchors ---- */}
        <section className="det-section">
          <h4>Distance anchors</h4>
          <p className="set-help">
            Places you rank distance against (Work, Gym, partner’s place…). The <b>primary</b> one drives Sort →
            Nearest and the per-card chip. Bay Area ZIPs &amp; cities resolve offline.
          </p>

          {settings.anchors.length === 0 ? (
            <div className="anchor-empty">No anchors yet — add one below.</div>
          ) : (
            <div className="anchor-list">
              {settings.anchors.map((a) => {
                const isPrimary = a.id === settings.primaryAnchorId;
                return (
                  <div key={a.id} className={`anchor-row ${isPrimary ? 'is-primary' : ''}`}>
                    <input
                      className="anchor-row-label"
                      value={a.label}
                      onChange={(e) => updateAnchor(a.id, { label: e.target.value })}
                      aria-label="Anchor label"
                    />
                    <span className="anchor-row-query">
                      <IconPin />
                      {a.query}
                      {a.lat == null && <span className="anchor-row-unresolved"> (unresolved)</span>}
                    </span>
                    <button
                      className={`chip ${isPrimary ? 'on' : ''}`}
                      onClick={() => setPrimaryAnchor(a.id)}
                      aria-pressed={isPrimary}
                    >
                      {isPrimary ? 'Primary' : 'Make primary'}
                    </button>
                    <button
                      className="btn-mini"
                      onClick={() => removeAnchor(a.id)}
                      aria-label={`Remove ${a.label}`}
                      style={{ color: 'var(--risk)' }}
                    >
                      <IconClose />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="anchor-add">
            <input
              className="anchor-add-label"
              placeholder="Label (e.g. Work)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              aria-label="New anchor label"
            />
            <input
              className="anchor-add-query"
              placeholder="city, ZIP or address"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNewAnchor();
              }}
              aria-label="New anchor place"
            />
            <button className="btn btn-accent" onClick={addNewAnchor}>
              <IconPlus />
              Add
            </button>
          </div>
        </section>

        {/* ---- Distance unit ---- */}
        <div className="set-row">
          <div className="l">
            <b>Distance unit</b>
            <span>Miles or kilometers for chips and the Nearest sort</span>
          </div>
          <div className="seg seg-light">
            <button className={unit === 'mi' ? 'on' : ''} onClick={() => setUnit('mi')}>
              mi
            </button>
            <button className={unit === 'km' ? 'on' : ''} onClick={() => setUnit('km')}>
              km
            </button>
          </div>
        </div>

        {/* ---- Lease target ---- */}
        <div className="set-row">
          <div className="l">
            <b>Target lease window (months)</b>
            <span>Drives the lease-fit flag &amp; the “Lease fits my target” filter (default 6–12)</span>
          </div>
          <div className="lease-inputs">
            <input
              className="num"
              type="number"
              value={minLease}
              onChange={(e) => setMinLease(e.target.value)}
              aria-label="Target minimum lease months"
            />
            <span className="lease-dash">–</span>
            <input
              className="num"
              type="number"
              value={maxLease}
              onChange={(e) => setMaxLease(e.target.value)}
              aria-label="Target maximum lease months"
            />
          </div>
        </div>

        {/* ---- Sheet URL ---- */}
        <div className="set-row" style={{ display: 'block' }}>
          <div className="l" style={{ marginBottom: 8 }}>
            <b>Google Sheet sync URL</b>
            <span>
              Paste your Apps Script Web App URL to enable Export → “Sync to Google Sheet”. One-time setup — see the
              README.
            </span>
          </div>
          <input
            type="url"
            placeholder="https://script.google.com/macros/s/…/exec"
            value={sheetUrlStr}
            onChange={(e) => setSheetUrlStr(e.target.value)}
            aria-label="Google Sheet sync URL"
            style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--body)', fontWeight: 500 }}
          />
        </div>

        <div className="form-foot">
          <button className="btn btn-accent" onClick={apply}>
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
}
