import { defineConfig, fontProviders } from 'astro/config';
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

// Fonts are self-hosted from the installed @fontsource-variable packages (no CDN at build or run time).
// Astro copies the files into the build, adds preload links and generates metric matched fallback faces,
// so swapping in the web font does not shift the layout. Only the latin subset: it covers German including
// umlauts, sharp s and the euro sign, and English.
const UNICODE_LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

/** @font-face variants for one fontsource variable package (latin subset, wght axis). */
function fontsourceVariants(pkg, weight, styles) {
  return styles.map((style) => ({
    src: [`./node_modules/@fontsource-variable/${pkg}/files/${pkg}-latin-wght-${style}.woff2`],
    weight,
    style,
    unicodeRange: [UNICODE_LATIN],
  }));
}

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
  // Display: Syne, drawn for an art centre, wide geometric capitals close to the lettering of the studio logo.
  // Text: Instrument Sans, a quiet grotesk that stays readable at small sizes.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Syne',
      cssVariable: '--font-syne',
      fallbacks: ['Arial', 'sans-serif'],
      options: { variants: fontsourceVariants('syne', '400 800', ['normal']) },
    },
    {
      provider: fontProviders.local(),
      name: 'Instrument Sans',
      cssVariable: '--font-instrument',
      fallbacks: ['Arial', 'sans-serif'],
      options: { variants: fontsourceVariants('instrument-sans', '400 700', ['normal', 'italic']) },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: { format: 'directory' },
});
