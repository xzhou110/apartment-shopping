import type { ReactElement } from 'react';
import type { Contact } from '../types';
import { telHref, mailtoHref, siteHref } from '../lib/format';
import { IconPhone, IconMail, IconGlobe } from './icons';

/** True when a contact object has anything worth rendering. */
export function hasContact(c: Contact | undefined | null): boolean {
  return !!c && !!(c.company || c.name || c.phone || c.email || c.website);
}

/** The person/company line: "Company · Name", "Company", or "Name" — '' if neither. */
export function contactLabel(c: Contact): string {
  return [c.company, c.name].filter(Boolean).join(' · ');
}

/** Compact website text for display: drop the scheme + "www." + trailing slash. */
function siteDisplay(url: string): string {
  return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');
}

/**
 * The reachable contact channels as readable, clickable rows (icon + the actual phone/email/site).
 * Each is an <a> with a safe href; the wrapper stops click propagation so tapping one inside a
 * clickable Card doesn't also open the detail. Renders nothing when no channel is provided.
 */
export function ContactRows({ contact }: { contact: Contact }): ReactElement | null {
  const tel = telHref(contact.phone);
  const mail = mailtoHref(contact.email);
  const site = siteHref(contact.website);
  if (!tel && !mail && !site) return null;
  return (
    <div className="contact-rows" onClick={(e) => e.stopPropagation()}>
      {tel && (
        <a className="contact-row" href={tel} title={`Call ${contact.phone}`}>
          <IconPhone />
          <span>{contact.phone}</span>
        </a>
      )}
      {mail && (
        <a className="contact-row" href={mail} title={`Email ${contact.email}`}>
          <IconMail />
          <span>{contact.email}</span>
        </a>
      )}
      {site && (
        <a className="contact-row" href={site} target="_blank" rel="noopener noreferrer" title="Open website">
          <IconGlobe />
          <span>{siteDisplay(contact.website)}</span>
        </a>
      )}
    </div>
  );
}
