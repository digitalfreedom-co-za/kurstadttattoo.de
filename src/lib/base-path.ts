/**
 * Prefixes a site-internal path with a base path. Pure, so it runs in the pages (via url())
 * and in astro.config.mjs (sitemap alternates), which has no access to import.meta.env.
 * Page paths get a trailing slash (trailingSlash: 'always'), file paths do not.
 * Query string and fragment are split off at the first ? or # and appended unchanged.
 */
export function withBase(base: string, path = '/'): string {
  const root = base.replace(/\/+$/, '');
  const suffixStart = path.search(/[?#]/);
  const pathname = suffixStart === -1 ? path : path.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? '' : path.slice(suffixStart);

  const clean = pathname.replace(/^\/+/, '');
  if (clean === '') return `${root}/${suffix}`;
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  const normalized = isFile || clean.endsWith('/') ? clean : `${clean}/`;
  return `${root}/${normalized}${suffix}`;
}

/** The inverse of withBase(): strips the base path, matching whole path segments only. */
export function stripBase(base: string, pathname: string): string {
  const root = base.replace(/\/+$/, '');
  if (root === '') return pathname;
  if (pathname === root) return '/';
  return pathname.startsWith(`${root}/`) ? pathname.slice(root.length) : pathname;
}
