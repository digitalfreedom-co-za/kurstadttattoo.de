// Which routes of the route table have a page yet. Header and footer link only built pages, so the
// navigation grows with the subpage and legal tickets instead of linking to 404s on the preview.
// Static output: this runs at build time from the project root, never in the browser.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { localizedPath, type Locale, type RouteKey } from '../i18n/routes';

const PAGES_DIR = join(process.cwd(), 'src', 'pages');
const PAGE_EXTENSIONS = ['astro', 'md', 'mdx'];

export function pageExists(key: RouteKey, locale: Locale): boolean {
  const path = localizedPath(key, locale).replace(/^\/+|\/+$/g, '');
  const candidates = path === '' ? ['index'] : [path, `${path}/index`];
  return candidates.some((base) => PAGE_EXTENSIONS.some((ext) => existsSync(join(PAGES_DIR, `${base}.${ext}`))));
}

/** The given route keys that have a page in this locale, in their original order. */
export function existingRoutes(keys: readonly RouteKey[], locale: Locale): RouteKey[] {
  return keys.filter((key) => pageExists(key, locale));
}
