// SVG icon set — adapted from the garage icon map for apartments. Each is a presentational
// <svg>; size/color come from the consuming CSS (currentColor). Apartment-specific marks added:
// IconBrand (building), IconHome, IconBed, IconBath, IconRuler, IconPin (kept).
import type { ReactElement } from 'react';

type IconProps = { className?: string };

/** Building/apartment brand mark (home stack). */
export const IconBrand = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 21V8.5a1 1 0 01.4-.8l7-5.2a1 1 0 011.2 0l7 5.2a1 1 0 01.4.8V21M4 21h16"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 21v-5h6v5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 11h.01M15 11h.01" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** Generic home/placeholder mark (used in empty states + image fallbacks). */
export const IconHome = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3 11.5L12 4l9 7.5M5 10v10h14V10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

/** Bed icon (beds spec). */
export const IconBed = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3 17V7m0 6h18m0 4v-4a3 3 0 00-3-3H8m-2 0a2 2 0 100-4 2 2 0 000 4z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Bath / shower icon (baths spec). */
export const IconBath = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 12V6a2 2 0 012-2 2 2 0 012 2m-4 6h16a1 1 0 011 1v1a4 4 0 01-4 4H7a4 4 0 01-4-4v-1a1 1 0 011-1zm2 9l-1 1m13-1l1 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Ruler / area icon (sqft spec). */
export const IconRuler = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="8" width="18" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 8v3m4-3v4m4-4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconPin = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/** Walking/distance route mark — used for the distance chip. */
export const IconRoute = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="6" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="18" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 19h6a3 3 0 003-3V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconWarn = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 3l9.5 16.5H2.5L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 10v4m0 3h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconRisk = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 8v5m0 3h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconInfo = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 11v5m0-8h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconCheck = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClose = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconStar = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z" />
  </svg>
);

/** External-link / open arrow (listing links, detail open). */
export const IconExt = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M14 5h5v5M19 5l-8 8M12 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconGrid = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconCompare = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 3v18" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const IconSettings = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7.7 2 2 0 01-3.8 0 1.6 1.6 0 00-2.7-.7l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.5-2.7 2 2 0 010-3.8 1.6 1.6 0 001.5-2.7l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H8a1.6 1.6 0 001-1.5 2 2 0 013.8 0 1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1 2 2 0 010 3.8 1.6 1.6 0 00-1.5 1z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export const IconExport = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlus = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconSearch = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconFilter = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const IconSun = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const IconMoon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 009.8 9.8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const IconCopy = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const IconDownload = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 19h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Phone handset — contact phone link. */
export const IconPhone = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 5c0 8.3 6.7 15 15 15a1.5 1.5 0 001.5-1.5v-2.6a1 1 0 00-.8-1l-3-.6a1 1 0 00-1 .4l-.9 1.2A11.5 11.5 0 019.7 10l1.2-.9a1 1 0 00.4-1l-.6-3a1 1 0 00-1-.8H7.5A1.5 1.5 0 004 5z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

/** Envelope — contact email link. */
export const IconMail = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Globe — contact website link. */
export const IconGlobe = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-6-3.5-9S9.5 5.5 12 3z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/** Speech bubble — comments section + card count. */
export const IconChat = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M21 12a8 8 0 01-11.5 7.2L4 20l.9-5A8 8 0 1121 12z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

/** Trash — delete a comment. */
export const IconTrash = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0v12a1 1 0 001 1h8a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Pencil — edit a comment in place. */
export const IconEdit = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 20h4L18.5 9.5a1.5 1.5 0 000-2.12l-1.88-1.88a1.5 1.5 0 00-2.12 0L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
