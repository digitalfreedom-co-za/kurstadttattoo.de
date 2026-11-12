// Single source for site wide facts. Every component reads from here; never hard-code these values in markup.
// Facts come from docs/source-content (old site) and the ticket for the new address; see the fact sheet there.
import type { Locale, RouteKey } from '../i18n/routes';

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
  /** display: German domestic form; displayIntl: the same number for international visitors (EN pages). */
  phone: { display: '0173 160 51 62', displayIntl: '+49 173 160 51 62', href: 'tel:+491731605162' },
  email: { display: 'Kurstadttattoo@web.de', href: 'mailto:Kurstadttattoo@web.de' },
  tiktok: { handle: '@patrickkurstadttattoo', href: 'https://www.tiktok.com/@patrickkurstadttattoo' },
  /** The studio's own channels, both checked to exist (docs/source-content, Social media). */
  studioTiktok: { handle: '@kurstadttattoo', href: 'https://www.tiktok.com/@kurstadttattoo' },
  youtube: { handle: '@KurstadtTattoo', href: 'https://www.youtube.com/@KurstadtTattoo' },
  /** Route planner link instead of an embedded map: no third party request without consent. */
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Friedrich-Ebert-Platz%201A%2C%2061231%20Bad%20Nauheim',
  /**
   * Coordinates of Friedrich-Ebert-Platz 1A: Google Geocoding API, location_type ROOFTOP, checked
   * 2026-11-12; OpenStreetMap places the square within 50 m of it.
   */
  geo: { latitude: 50.36023, longitude: 8.73802 },
  region: 'Hessen',
  /**
   * Opening hours of the old site (Montag bis Freitag 12 bis 18 Uhr oder nach Vereinbarung), the only
   * stated hours. The ticket asks for them in the JSON-LD; the pages mark them as not yet confirmed for
   * the new location.
   */
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '12:00', closes: '18:00' },
  /** Towns for areaServed, from the competitor analysis (docs/competitor-analysis.md), plus the district. */
  areaServed: ['Bad Nauheim', 'Friedberg (Hessen)', 'Butzbach', 'Rosbach vor der Höhe', 'Ober-Mörlen', 'Bad Vilbel', 'Frankfurt am Main'],
  areaServedRegion: 'Wetteraukreis',
} as const;

/** Phone number as shown on a page: domestic on German pages, with the country code on English ones. */
export function phoneDisplay(locale: Locale): string {
  return locale === 'en' ? studio.phone.displayIntl : studio.phone.display;
}

/** Social preview card per locale, rendered by scripts/og-image/render.sh (1200 x 630, committed PNGs). */
export const ogImage = {
  path: { de: '/og/kurstadttattoo-og-de.png', en: '/og/kurstadttattoo-og-en.png' },
  width: 1200,
  height: 630,
} as const;

/**
 * Operator of the website and controller under the GDPR, as stated in the imprint of the old site
 * (docs/source-content/pages/kontakt-und-impressum.md). Read by the privacy policy and the imprint.
 * The old site gives no register entry; court and number are those the same company publishes in the
 * imprint of tattoogutachten.de. The tax number of the old imprint stays out (§ 5 DDG asks only for the
 * VAT ID).
 */
export const operator = {
  name: 'RuW Lifestyle GmbH',
  street: 'Beneke Str. 9',
  postalCode: '61231',
  city: 'Bad Nauheim',
  managingDirector: 'Patrick Wolf',
  registerCourt: 'Amtsgericht Friedberg (Hessen)',
  registerNumber: 'HRB 8945',
  vatId: 'DE323734171',
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
