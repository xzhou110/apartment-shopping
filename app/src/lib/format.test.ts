import { describe, it, expect } from 'vitest';
import { money, num, amenState, availabilityLabel, yn, stars, bedsLabel, safeHref, telHref, mailtoHref, siteHref, shortDate } from './format';
import { makeApt } from './_fixtures';
import type { AmenityKey } from '../types';

describe('money', () => {
  it('formats with commas', () => expect(money(2750)).toBe('$2,750'));
  it('0 renders as "$0"', () => expect(money(0)).toBe('$0'));
  it('null → em-dash', () => expect(money(null)).toBe('—'));
  it('undefined → em-dash', () => expect(money(undefined)).toBe('—'));
  it('large value', () => expect(money(100000)).toBe('$100,000'));
});

describe('num', () => {
  it('formats with thousands separators', () => expect(num(1150)).toBe('1,150'));
  it('0 renders as "0"', () => expect(num(0)).toBe('0'));
  it('null → em-dash', () => expect(num(null)).toBe('—'));
  it('undefined → em-dash', () => expect(num(undefined)).toBe('—'));
});

describe('safeHref — only http(s)/mailto pass (XSS guard)', () => {
  it('passes https', () => expect(safeHref('https://x.com/a')).toBe('https://x.com/a'));
  it('passes http', () => expect(safeHref('http://x.com')).toBe('http://x.com'));
  it('passes mailto', () => expect(safeHref('mailto:a@b.com')).toBe('mailto:a@b.com'));
  it('blocks javascript:', () => expect(safeHref('javascript:alert(1)')).toBeUndefined());
  it('blocks data: html', () => expect(safeHref('data:text/html,<script>')).toBeUndefined());
  it('blocks relative/garbage', () => expect(safeHref('/foo')).toBeUndefined());
  it('trims then validates', () => expect(safeHref('  https://x.com  ')).toBe('https://x.com'));
  it('null/empty → undefined', () => {
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref('')).toBeUndefined();
  });
});

describe('telHref — tel: link from a phone string', () => {
  it('strips formatting, keeps digits', () => expect(telHref('(650) 555-0142')).toBe('tel:6505550142'));
  it('keeps a leading +', () => expect(telHref('+1 415 555 9000')).toBe('tel:+14155559000'));
  it('keeps extension markers * #', () => expect(telHref('555-0142 x*#')).toBe('tel:5550142*#'));
  it('encodes a "x NN" extension as ;ext= (does not merge digits)', () =>
    expect(telHref('(510) 899-5584 x 66')).toBe('tel:5108995584;ext=66'));
  it('encodes a "x66" (no space) extension', () =>
    expect(telHref('510-899-5584 x66')).toBe('tel:5108995584;ext=66'));
  it('encodes an "ext. NN" extension', () =>
    expect(telHref('510-899-5584 ext. 66')).toBe('tel:5108995584;ext=66'));
  it('no digits → undefined', () => expect(telHref('call me')).toBeUndefined());
  it('null/empty → undefined', () => {
    expect(telHref(null)).toBeUndefined();
    expect(telHref('')).toBeUndefined();
  });
});

describe('mailtoHref — mailto: link from an email', () => {
  it('valid email passes', () => expect(mailtoHref('chris@cedar.com')).toBe('mailto:chris@cedar.com'));
  it('trims first', () => expect(mailtoHref('  a@b.io ')).toBe('mailto:a@b.io'));
  it('rejects a bare word', () => expect(mailtoHref('chris')).toBeUndefined());
  it('rejects a missing TLD', () => expect(mailtoHref('a@b')).toBeUndefined());
  it('null/empty → undefined', () => {
    expect(mailtoHref(null)).toBeUndefined();
    expect(mailtoHref('')).toBeUndefined();
  });
});

describe('siteHref — website link, bare domain normalized to https', () => {
  it('bare domain → https', () => expect(siteHref('cedarstreetapts.com')).toBe('https://cedarstreetapts.com'));
  it('keeps an explicit https URL', () => expect(siteHref('https://x.com/a')).toBe('https://x.com/a'));
  it('keeps an explicit http URL', () => expect(siteHref('http://x.com')).toBe('http://x.com'));
  it('blocks javascript: (other scheme)', () => expect(siteHref('javascript:alert(1)')).toBeUndefined());
  it('blocks mailto: (other scheme)', () => expect(siteHref('mailto:a@b.com')).toBeUndefined());
  it('trims first', () => expect(siteHref('  example.org ')).toBe('https://example.org'));
  it('null/empty → undefined', () => {
    expect(siteHref(null)).toBeUndefined();
    expect(siteHref('')).toBeUndefined();
  });
});

describe('amenState — tri-state, unk never collapses to no', () => {
  it("true → 'yes'", () =>
    expect(amenState(makeApt({ amen: { parking: true } }), 'parking')).toBe('yes'));
  it("false → 'no'", () =>
    expect(amenState(makeApt({ amen: { parking: false } }), 'parking')).toBe('no'));
  it("null → 'unk'", () =>
    expect(amenState(makeApt({ amen: { parking: null } }), 'parking')).toBe('unk'));
  it("absent key → 'unk'", () =>
    expect(amenState(makeApt({ amen: {} }), 'gym')).toBe('unk'));
  it('no amen object at all → unk (graceful guard)', () =>
    expect(amenState(makeApt({ amen: undefined as never }), 'gym')).toBe('unk'));
  it('all tracked keys on empty amen → unk', () => {
    const keys: AmenityKey[] = ['parking', 'gym'];
    for (const k of keys) expect(amenState(makeApt({ amen: {} }), k)).toBe('unk');
  });
});

describe('yn', () => {
  it("'yes' → 'Yes'", () => expect(yn('yes')).toBe('Yes'));
  it("'no' → 'No'", () => expect(yn('no')).toBe('No'));
  it("'unk' → '?'", () => expect(yn('unk')).toBe('?'));
});

describe('stars', () => {
  it('3 → ★★★☆☆', () => expect(stars(3)).toBe('★★★☆☆'));
  it('clamps above 5', () => expect(stars(9)).toBe('★★★★★'));
  it('clamps below 0', () => expect(stars(-2)).toBe('☆☆☆☆☆'));
  it('rounds to nearest', () => expect(stars(3.6)).toBe('★★★★☆'));
});

describe('bedsLabel', () => {
  it('0 → Studio', () => expect(bedsLabel(0)).toBe('Studio'));
  it('1 → "1 bd"', () => expect(bedsLabel(1)).toBe('1 bd'));
  it('2 → "2 bd"', () => expect(bedsLabel(2)).toBe('2 bd'));
});

describe('shortDate', () => {
  it('formats an ISO date', () => expect(shortDate('2026-08-01')).toBe('Aug 1, 2026'));
  it('handles two-digit day', () => expect(shortDate('2026-12-25')).toBe('Dec 25, 2026'));
  it('empty → ""', () => expect(shortDate('')).toBe(''));
  it('null → ""', () => expect(shortDate(null)).toBe(''));
  it('non-date → ""', () => expect(shortDate('whenever')).toBe(''));
  it('does not TZ-shift (datetime suffix ignored)', () =>
    expect(shortDate('2026-01-01T00:00:00Z')).toBe('Jan 1, 2026'));
});

describe('availabilityLabel — exact date wins over the coarse status', () => {
  it('formats a stated date', () =>
    expect(availabilityLabel(makeApt({ availableDate: '2026-08-01' }))).toBe('Aug 1, 2026'));
  it('date wins even when the status disagrees', () =>
    expect(availabilityLabel(makeApt({ availableDate: '2026-08-01', availability: 'unavailable' }))).toBe(
      'Aug 1, 2026',
    ));
  it("'now' → Now", () => expect(availabilityLabel(makeApt({ availability: 'now' }))).toBe('Now'));
  it("'unavailable' → Unavailable — ask", () =>
    expect(availabilityLabel(makeApt({ availability: 'unavailable' }))).toBe('Unavailable — ask'));
  it("'unknown' with no date → '' (row hides)", () =>
    expect(availabilityLabel(makeApt({ availability: 'unknown', availableDate: '' }))).toBe(''));
});
