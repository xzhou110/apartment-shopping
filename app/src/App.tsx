import { useCallback, useMemo, useRef, useState } from 'react';
import type { Apartment } from './types';
import type { Coord } from './lib/distance';
import type { FlagCtx } from './lib/flags';
import { useApartments } from './state/useApartments';
import { applyFilters, applySort } from './components/helpers';
import { Filters } from './components/Filters';
import { Grid } from './components/Grid';
import { CompareTable } from './components/CompareTable';
import { DetailModal } from './components/DetailModal';
import { ApartmentForm } from './components/ApartmentForm';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { ThemeToggle } from './components/ThemeToggle';
import { IconBrand, IconCompare, IconExport, IconGrid, IconPlus, IconSettings } from './components/icons';

export default function App() {
  const g = useApartments();
  const [detailId, setDetailId] = useState<string | null>(null);
  // undefined = closed, null = add mode, Apartment = edit mode
  const [formApt, setFormApt] = useState<Apartment | null | undefined>(undefined);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

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

  const handleMarkGone = useCallback(
    (id: string) => {
      g.setStatus(id, 'Gone');
      setDetailId(null);
      showToast('Marked gone — hidden from the list ("Show gone" brings it back)');
    },
    [g, showToast],
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
        onMarkGone={handleMarkGone}
        onSetExpert={(id, n) => g.setRating(id, 'expert', n)}
        onSetYou={(id, n) => g.setRating(id, 'you', n)}
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
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
