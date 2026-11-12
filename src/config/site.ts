// Single source for site wide facts. Every component reads from here; never hard-code these values in markup.

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
