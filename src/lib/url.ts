import { stripBase, withBase } from './base-path';

/**
 * Prefixes a site-internal path with the configured base path, so links and
 * public assets keep working under /kurstadttattoo.de/ as well as on a root domain.
 */
export function url(path = '/'): string {
  return withBase(import.meta.env.BASE_URL, path);
}

/** The inverse of url(): strips the base path, e.g. for comparing Astro.url.pathname with site paths. */
export function withoutBase(pathname: string): string {
  return stripBase(import.meta.env.BASE_URL, pathname);
}

/** Absolute URL of a site path, for canonical, hreflang, Open Graph and JSON-LD. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site).href;
}
