import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { sitemapLinks } from './src/i18n/routes.ts';

// Single place for the deploy target. Switching to the real domain later:
// SITE = { url: 'https://www.kurstadttattoo.de', base: '/' } plus the custom domain in the Pages settings
// (see README, Domainwechsel).
const SITE = {
  url: 'https://digitalfreedom-co-za.github.io',
  base: '/kurstadttattoo.de',
};

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  trailingSlash: 'always',
  output: 'static',
  // German and English pages use translated URL segments, so the sitemap alternates come from the
  // route table in src/i18n/routes.ts instead of the prefix based i18n option of the integration.
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
      serialize: (item) => ({ ...item, links: sitemapLinks(item.url, SITE) }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: { format: 'directory' },
});
