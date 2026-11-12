// Route table for both locales. German is the default locale at the root, English lives under /en/
// with translated URL segments (wiki websites.md, i18n). Every page gets one entry here; the entry
// yields its URL per locale, the hreflang alternates, the language switch target and the sitemap
// alternates. Pure module (no import.meta.env), so astro.config.mjs can import it too.
import { stripBase, withBase } from '../lib/base-path';

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

/** Language tags for hreflang and html lang, Open Graph locales. */
export const localeMeta: Record<Locale, { lang: string; ogLocale: string }> = {
  de: { lang: 'de', ogLocale: 'de_DE' },
  en: { lang: 'en', ogLocale: 'en_US' },
};

/** Site path (without base) of every page per locale. */
// German slugs as planned in the subpage and legal tickets (#6, #8). A route may be listed before its
// page exists: navigation only links pages that are built (src/lib/pages.ts).
export const routes = {
  home: { de: '/', en: '/en/' },
  gallery: { de: '/galerie/', en: '/en/gallery/' },
  artists: { de: '/kuenstler/', en: '/en/artists/' },
  hygiene: { de: '/hygiene/', en: '/en/hygiene/' },
  consultation: { de: '/beratung-ablauf/', en: '/en/consultation/' },
  aftercare: { de: '/pflegetipps/', en: '/en/aftercare/' },
  faq: { de: '/haeufige-fragen/', en: '/en/faq/' },
  engraving: { de: '/gravur-service/', en: '/en/engraving/' },
  contact: { de: '/kontakt/', en: '/en/contact/' },
  imprint: { de: '/impressum/', en: '/en/imprint/' },
  privacy: { de: '/datenschutz/', en: '/en/privacy/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function localizedPath(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

/** Locale of a site path (without base): everything under /en/ is English, the rest German. */
export function localeOfPath(path: string): Locale {
  return path === '/en/' || path.startsWith('/en/') ? 'en' : defaultLocale;
}

/** Route key of a site path (without base), or undefined for pages outside the table (404). */
export function routeKeyOfPath(path: string): RouteKey | undefined {
  return (Object.keys(routes) as RouteKey[]).find((key) => locales.some((locale) => routes[key][locale] === path));
}

/** Sitemap alternates for an absolute page URL, used by @astrojs/sitemap in astro.config.mjs. */
export function sitemapLinks(pageUrl: string, site: { url: string; base: string }): { url: string; lang: string }[] {
  const key = routeKeyOfPath(stripBase(site.base, new URL(pageUrl).pathname));
  if (!key) return [];
  return locales.map((locale) => ({
    url: new URL(withBase(site.base, routes[key][locale]), site.url).href,
    lang: localeMeta[locale].lang,
  }));
}
