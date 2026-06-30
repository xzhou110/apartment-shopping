import type { ReactElement } from 'react';
import type { Apartment } from '../types';
import type { FlagCtx } from '../lib/flags';
import { Card } from './Card';
import { IconHome } from './icons';

interface Props {
  /** Apartments after filter + sort. */
  apartments: Apartment[];
  /** Total count (drives the "no listings yet" vs "no matches" empty state). */
  totalCount: number;
  /** Flag context — settings + resolved primary anchor coord. Threaded into each card. */
  ctx: FlagCtx;
  /** Primary anchor label (for the per-card distance chip). null when no anchor. */
  anchorLabel: string | null;
  compareSet: Set<string>;
  onToggleCompare: (id: string) => void;
  onOpen: (id: string) => void;
  onSetYou: (id: string, n: number) => void;
}

function Empty({ title, msg }: { title: string; msg: string }): ReactElement {
  return (
    <div className="empty" style={{ gridColumn: '1 / -1' }}>
      <IconHome />
      <h3>{title}</h3>
      <p>{msg}</p>
    </div>
  );
}

export function Grid({
  apartments,
  totalCount,
  ctx,
  anchorLabel,
  compareSet,
  onToggleCompare,
  onOpen,
  onSetYou,
}: Props): ReactElement {
  if (totalCount === 0) {
    return (
      <div className="grid">
        <Empty
          title="No listings yet"
          msg="Send me a screenshot of a listing and I'll add it here — or tap “Add listing” to enter one manually."
        />
      </div>
    );
  }
  if (apartments.length === 0) {
    return (
      <div className="grid">
        <Empty title="No matches" msg="Nothing fits these filters. Try clearing a chip or the search box." />
      </div>
    );
  }
  return (
    <div className="grid">
      {apartments.map((a) => (
        <Card
          key={a.id}
          apt={a}
          ctx={ctx}
          anchorLabel={anchorLabel}
          inCompare={compareSet.has(a.id)}
          onToggleCompare={onToggleCompare}
          onOpen={onOpen}
          onSetYou={onSetYou}
        />
      ))}
    </div>
  );
}
