import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Apartment } from './types';
import type { Coord } from './lib/distance';
import type { FlagCtx } from './lib/flags';
import { useApartments } from './state/useApartments';
import type { HidingStatus } from './components/helpers';
import { applyFilters, applySort, toggleStatus } from './components/helpers';
import { Filters } from './components/Filters';
import { Grid } from './components/Grid';
import { CompareTable } from './components/CompareTable';
import { DetailModal } from './components/DetailModal';
import { ApartmentForm } from './components/ApartmentForm';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { FindModal } from './components/FindModal';
import { ThemeToggle } from './components/ThemeToggle';
import { IconBrand, IconCompare, IconExport, IconGrid, IconPlus, IconSearch, IconSettings } from './components/icons';

/** Popover API support (Chrome 114+ / Safari 17+ / Firefox 125+) — see the toast comment below. */
const POPOVER_SUPPORTED =
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';

export default function App() {
  const g = useApartments();
  const [detailId, setDetailId] = useState<string | null>(null);
  // undefined = closed, null = add mode, Apartment = edit mode
  const [formApt, setFormApt] = useState<Apartment | null | undefined>(undefined);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  /**
   * Toasts must out-paint an open modal. `<dialog>.showModal()` promotes the dialog into the
   * browser's TOP LAYER, which paints above ALL normal-flow content no matter its z-index — so a
   * plain z-index toast fired while the detail / export / settings modal is open is invisible
   * underneath it (it's in the DOM and reads correctly, which is exactly why a DOM assertion
   * misses this). The fix: make the toast a popover, which also lives in the top layer, where
   * entries stack in the order they open — a toast shown after the dialog therefore paints above.
   * Feature-guarded: the `popover` attribute is only attached when supported, because the UA rule
   * `[popover]:not(:popover-open) { display: none }` would otherwise hide the toast outright.
   * useLayoutEffect so the attach + show happen before paint (no flash).
   */
  const toastRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = toastRef.current;
    if (!el || !toast || !POPOVER_SUPPORTED) return;
    try {
      // Re-enter the top layer on EVERY toast. Entries stack in INSERTION order, and
      // showPopover() throws on an already-open popover (leaving it where it was) — so a toast
      // still on screen when a modal opened would otherwise stay stranded UNDER that dialog.
      // hide→show reinserts it last, i.e. topmost. (Verified in a real browser: without this,
      // a stale popover renders beneath a dialog opened after it.)
      if (el.matches(':popover-open')) el.hidePopover();
      el.showPopover();
    } catch {
      // If the UA refuses to show it, drop the attribute — otherwise the UA rule
      // `[popover]:not(:popover-open) { display: none }` would hide the toast ENTIRELY,
      // which is worse than the old z-index behaviour we're falling back to.
      el.removeAttribute('popover');
    }
  }, [toast]);

  // The integration seam (tech-plan §6 "sort-context trap"): resolve the primary anchor coord ONCE
  // and thread it — plus unit + settings — into applySort AND the flag context. g.primaryAnchor is
  // already the resolved Coord|null; the anchor label feeds the per-card distance chip.
  const primaryAnchor: Coord | null = g.primaryAnchor;
  const anchorLabel = g.primaryAnchorObj?.label ?? null;
  const flagCtx: FlagCtx = useMemo(
    () => ({ settings: g.settings, primaryAnchor }),
    [g.settings, primaryAnchor],
  );

  const visible = useMemo(
    () =>
      applySort(applyFilters(g.apartments, g.filters, g.settings), g.filters.sort, {
        primaryAnchor,
        unit: g.settings.distanceUnit,
        settings: g.settings,
      }),
    [g.apartments, g.filters, g.settings, primaryAnchor],
  );
  const compareApts = useMemo(
    () => g.apartments.filter((a) => g.compareSet.has(a.id)),
    [g.apartments, g.compareSet],
  );
  const detailApt = detailId ? g.apartments.find((a) => a.id === detailId) ?? null : null;

  const handleSave = useCallback(
    (saved: Apartment) => {
      const isEdit = g.apartments.some((a) => a.id === saved.id);
      if (isEdit) g.updateApartment(saved.id, saved);
      else g.addApartment(saved);
      setFormApt(undefined);
      showToast(isEdit ? 'Listing updated' : 'Listing added');
    },
    [g, showToast],
  );

  const handleEdit = useCallback(
    (id: string) => {
      const a = g.apartments.find((x) => x.id === id);
      if (!a) return;
      setDetailId(null);
      setFormApt(a);
    },
    [g.apartments],
  );

  const handleDelete = useCallback(
    (id: string) => {
      g.deleteApartment(id);
      setDetailId(null);
      showToast('Listing removed');
    },
    [g, showToast],
  );

  /**
   * Gone / Ruled out are toggles — clicking the status a listing already has un-marks it back to
   * 'New' (mistake recovery). The modal deliberately STAYS OPEN either way: `detailApt` resolves
   * from the unfiltered `g.apartments`, so the card can vanish from the grid behind it while the
   * undo button stays right there under the cursor. Closing on mark would make the undo a hunt.
   */
  const toggleHidingStatus = useCallback(
    (id: string, target: HidingStatus) => {
      const apt = g.apartments.find((a) => a.id === id);
      if (!apt) return;
      const next = toggleStatus(apt.status, target);
      g.setStatus(id, next);
      const chip = target === 'Gone' ? 'Show gone' : 'Show ruled out';
      showToast(
        next === 'New'
          ? 'Back on the list — status reset to New'
          : `${target === 'Gone' ? 'Marked gone' : 'Ruled out'} — hidden from the list ("${chip}" brings it back)`,
      );
    },
    [g, showToast],
  );

  const handleToggleGone = useCallback((id: string) => toggleHidingStatus(id, 'Gone'), [toggleHidingStatus]);
  const handleToggleRuledOut = useCallback(
    (id: string) => toggleHidingStatus(id, 'Ruled out'),
    [toggleHidingStatus],
  );

  // Distance anchors are managed in Settings → Distance anchors (the inline "rank by distance"
  // bar was removed 2026-06-30). primaryAnchor/anchorLabel above still drive the Nearest sort,
  // the per-card distance chip, and the flag context.

  return (
    <>
      <header className="cowl">
        <div className="cowl-inner">
          <div className="brand">
            <div className="brand-mark">
              <IconBrand />
            </div>
            <div className="brand-text">
              <span className="brand-name">Apartment Shopping</span>
              <span className="brand-sub">Shortlist, rank &amp; compare</span>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="stat-v num">{g.apartments.length}</span>
              <span className="stat-l">Listings</span>
            </div>
            <div className="stat">
              <span className="stat-v num">{g.compareSet.size}</span>
              <span className="stat-l">Comparing</span>
            </div>
          </div>

          <div className="cowl-actions">
            <div className="seg" role="tablist" aria-label="View">
              <button
                className={g.view === 'grid' ? 'on' : ''}
                onClick={() => g.setView('grid')}
                role="tab"
                aria-selected={g.view === 'grid'}
              >
                <IconGrid />
                Grid
              </button>
              <button
                className={g.view === 'compare' ? 'on' : ''}
                onClick={() => g.setView('compare')}
                role="tab"
                aria-selected={g.view === 'compare'}
              >
                <IconCompare />
                Compare
              </button>
            </div>
            <ThemeToggle theme={g.theme} onToggle={g.toggleTheme} />
            <button className="btn btn-ghost" onClick={() => setExportOpen(true)}>
              <IconExport />
              Export
            </button>
            <button className="btn btn-ghost" onClick={() => setSettingsOpen(true)}>
              <IconSettings />
              Settings
            </button>
            <button className="btn btn-ghost" onClick={() => setFindOpen(true)}>
              <IconSearch />
              Find
            </button>
            <button className="btn btn-accent" onClick={() => setFormApt(null)}>
              <IconPlus />
              Add listing
            </button>
          </div>
        </div>
      </header>

      <Filters
        filters={g.filters}
        activeFilterCount={g.activeFilterCount}
        shownCount={visible.length}
        totalCount={g.apartments.length}
        compareCount={g.compareSet.size}
        view={g.view}
        setFilters={g.setFilters}
        resetFilters={g.resetFilters}
        toggleReqAmenity={g.toggleReqAmenity}
        onClearCompare={g.clearCompare}
      />

      <main>
        {g.view === 'compare' ? (
          compareApts.length >= 2 ? (
            <CompareTable
              apartments={compareApts}
              settings={g.settings}
              primaryAnchor={primaryAnchor}
              anchorLabel={anchorLabel}
              onToggleCompare={g.toggleCompare}
              onGoToGrid={() => g.setView('grid')}
            />
          ) : (
            <div className="empty">
              <p>Tick at least two listings in the grid, then come back here to compare them side by side.</p>
              <button className="btn-mini" onClick={() => g.setView('grid')}>
                Back to grid
              </button>
            </div>
          )
        ) : (
          <Grid
            apartments={visible}
            totalCount={g.apartments.length}
            ctx={flagCtx}
            anchorLabel={anchorLabel}
            compareSet={g.compareSet}
            onToggleCompare={g.toggleCompare}
            onOpen={(id) => setDetailId(id)}
            onSetYou={(id, n) => g.setRating(id, 'you', n)}
          />
        )}
      </main>

      <DetailModal
        apt={detailApt}
        settings={g.settings}
        primaryAnchor={primaryAnchor}
        anchorLabel={anchorLabel}
        inCompare={detailApt ? g.compareSet.has(detailApt.id) : false}
        onClose={() => setDetailId(null)}
        onToggleCompare={g.toggleCompare}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleGone={handleToggleGone}
        onToggleRuledOut={handleToggleRuledOut}
        onSetExpert={(id, n) => g.setRating(id, 'expert', n)}
        onSetYou={(id, n) => g.setRating(id, 'you', n)}
        onAddComment={g.addComment}
        onDeleteComment={g.deleteComment}
        onEditComment={g.editComment}
      />

      <ApartmentForm apt={formApt} onClose={() => setFormApt(undefined)} onSave={handleSave} />

      <ExportModal
        open={exportOpen}
        apartments={g.apartments}
        settings={g.settings}
        sheetUrl={g.settings.sheetUrl ?? ''}
        onClose={() => setExportOpen(false)}
        onToast={showToast}
      />

      <FindModal open={findOpen} onClose={() => setFindOpen(false)} />

      <SettingsModal
        open={settingsOpen}
        settings={g.settings}
        onClose={() => setSettingsOpen(false)}
        onSave={g.setSettings}
        onToast={showToast}
        addAnchor={g.addAnchor}
        updateAnchor={g.updateAnchor}
        removeAnchor={g.removeAnchor}
        setPrimaryAnchor={g.setPrimaryAnchor}
      />

      {toast && (
        <div
          className="toast"
          role="status"
          ref={toastRef}
          {...(POPOVER_SUPPORTED ? ({ popover: 'manual' } as Record<string, string>) : {})}
        >
          {toast}
        </div>
      )}
    </>
  );
}
