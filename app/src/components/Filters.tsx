import { useState } from 'react';
import type { ReactElement } from 'react';
import { AMENITIES } from '../data/amenities';
import type { Filters as FilterState, SortKey } from '../state/useApartments';
import { IconClose, IconFilter, IconSearch } from './icons';

interface Props {
  filters: FilterState;
  activeFilterCount: number;
  shownCount: number;
  totalCount: number;
  compareCount: number;
  view: 'grid' | 'compare';
  setFilters: (patch: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleReqAmenity: (k: (typeof AMENITIES)[number][0]) => void;
  onClearCompare: () => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'added', label: 'Sort: Recently added' },
  { value: 'nearest', label: 'Nearest first (distance)' },
  { value: 'rent-asc', label: 'Rent: Low → High' },
  { value: 'rent-desc', label: 'Rent: High → Low' },
  { value: 'beds-desc', label: 'Beds: Most first' },
  { value: 'sqft-desc', label: 'Sqft: Largest first' },
  { value: 'you-desc', label: 'Your rating: High → Low' },
  { value: 'expert-desc', label: 'Expert rating: High → Low' },
];

export function Filters({
  filters,
  activeFilterCount,
  shownCount,
  totalCount,
  compareCount,
  view,
  setFilters,
  resetFilters,
  toggleReqAmenity,
  onClearCompare,
}: Props): ReactElement {
  const [panelOpen, setPanelOpen] = useState(false);

  // (The inline "Rank by distance from" bar was removed 2026-06-30 — distance is just the
  // "Nearest first (distance)" sort option below; the place you measure from is set in
  // Settings → Distance anchors.)

  return (
    <>
      <div className="controls">
        <div className="search">
          <IconSearch />
          <input
            type="text"
            placeholder="Search title, neighborhood, city…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            aria-label="Search listings"
          />
        </div>

        <div className="select-wrap">
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value as SortKey })}
            aria-label="Sort listings"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`btn-mini ${panelOpen ? 'on' : ''}`}
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
        >
          <IconFilter />
          Filters
          {activeFilterCount > 0 && <span className="fcount">{activeFilterCount}</span>}
        </button>

        <div className="chips">
          <button
            className={`chip ${filters.furnishedOnly ? 'on' : ''}`}
            onClick={() => setFilters({ furnishedOnly: !filters.furnishedOnly })}
          >
            Furnished only
          </button>
          <button
            className={`chip ${filters.leaseFitsTarget ? 'on' : ''}`}
            onClick={() => setFilters({ leaseFitsTarget: !filters.leaseFitsTarget })}
          >
            Lease fits my target
          </button>
          <button
            className={`chip ${filters.hideRejected ? 'on' : ''}`}
            onClick={() => setFilters({ hideRejected: !filters.hideRejected })}
          >
            Hide rejected
          </button>
          <button
            className={`chip ${filters.showGone ? 'on' : ''}`}
            onClick={() => setFilters({ showGone: !filters.showGone })}
          >
            {filters.showGone ? 'Hide gone' : 'Show gone'}
          </button>
        </div>

        <div className="controls-right">
          {compareCount > 0 && (
            <button className="btn-mini" onClick={onClearCompare}>
              <IconClose />
              Clear compare
            </button>
          )}
        </div>
      </div>

      {panelOpen && (
        <div className="filter-panel">
          <div className="fp-inner">
            <div className="fp-row">
              <label className="fp-field">
                Max rent ($/mo)
                <input
                  type="number"
                  placeholder="any"
                  value={filters.maxRent ?? ''}
                  onChange={(e) => setFilters({ maxRent: e.target.value === '' ? null : Number(e.target.value) })}
                />
              </label>
              <label className="fp-field">
                Min beds
                <input
                  type="number"
                  placeholder="any"
                  value={filters.minBeds ?? ''}
                  onChange={(e) => setFilters({ minBeds: e.target.value === '' ? null : Number(e.target.value) })}
                />
              </label>
            </div>

            <div className="fp-feats">
              <span className="fp-label">Must have</span>
              <div className="chips">
                {AMENITIES.map(([k, short]) => (
                  <button
                    key={k}
                    className={`chip fchip ${filters.reqAmenities.includes(k) ? 'on' : ''}`}
                    onClick={() => toggleReqAmenity(k)}
                  >
                    {short}
                  </button>
                ))}
              </div>
            </div>

            <div className="fp-foot">
              <button className="btn-mini" onClick={resetFilters}>
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="result-line">
        {view === 'grid'
          ? `${shownCount} of ${totalCount} listing${totalCount !== 1 ? 's' : ''} shown`
          : `${compareCount} selected for comparison`}
      </div>
    </>
  );
}
