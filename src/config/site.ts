// Single source for site wide facts. Every component reads from here; never hard-code these values in markup.
// Facts come from docs/source-content (old site) and the ticket for the new address; see the fact sheet there.
import type { RouteKey } from '../i18n/routes';

export const site = {
  name: 'KurstadtTattoo',
  domain: 'kurstadttattoo.de',
} as const;

/**
 * Search engine switch. Off (default) on the github.io preview: every page carries noindex, robots.txt
 * still allows crawling so the noindex is seen. At launch on the real domain, build with
 * PUBLIC_INDEXABLE=true (deploy workflow env). Only the 404 page is never indexed.
 */
export const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';

/** The studio: name, artist, address of the new location from 1 December 2026, direct contact. */
export const studio = {
  name: 'KurstadtTattoo Bad Nauheim',
  artist: 'Patrick Wolf',
  address: {
    street: 'Friedrich-Ebert-Platz 1A',
    postalCode: '61231',
    city: 'Bad Nauheim',
    countryCode: 'DE',
  },
  phone: { display: '0173 160 51 62', href: 'tel:+491731605162' },
  email: { display: 'Kurstadttattoo@web.de', href: 'mailto:Kurstadttattoo@web.de' },
  tiktok: { handle: '@patrickkurstadttattoo', href: 'https://www.tiktok.com/@patrickkurstadttattoo' },
  /** The studio's own channels, both checked to exist (docs/source-content, Social media). */
  studioTiktok: { handle: '@kurstadttattoo', href: 'https://www.tiktok.com/@kurstadttattoo' },
  youtube: { handle: '@KurstadtTattoo', href: 'https://www.youtube.com/@KurstadtTattoo' },
  /** Route planner link instead of an embedded map: no third party request without consent. */
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Friedrich-Ebert-Platz%201A%2C%2061231%20Bad%20Nauheim',
} as const;

/**
 * Operator of the website and controller under the GDPR, as stated in the imprint of the old site
 * (docs/source-content/pages/kontakt-und-impressum.md). Read by the privacy policy and the imprint.
 */
export const operator = {
  name: 'RuW Lifestyle GmbH',
  street: 'Beneke Str. 9',
  postalCode: '61231',
  city: 'Bad Nauheim',
  managingDirector: 'Patrick Wolf',
} as const;

/**
 * Reopening at the new location. While active, the layout shows the reopening strip and the footer marks
 * the address as new. Switch off after the opening day; the build stays free of date logic so the HTML
 * is deterministic (wiki websites.md, IndexNow).
 */
export const reopening = {
  active: true,
  date: '2026-12-01',
} as const;

/** Patrick Wolf's expert office. Linked secondary only (teaser and footer), no own content here. */
export const expertSite = {
  href: 'https://www.tattoogutachten.de/',
  display: 'tattoogutachten.de',
} as const;

/** Header and footer navigation, in this order. Pages that do not exist yet are left out (see lib/pages). */
export const mainNav: RouteKey[] = ['gallery', 'artists', 'hygiene', 'consultation', 'aftercare', 'faq', 'contact'];
export const footerNav: RouteKey[] = [...mainNav, 'booking', 'engraving'];
export const legalNav: RouteKey[] = ['imprint', 'privacy'];
