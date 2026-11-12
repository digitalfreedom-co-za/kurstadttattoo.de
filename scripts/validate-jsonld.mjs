#!/usr/bin/env node
// Validates the SEO layer of the built site: JSON-LD, hreflang, meta, OG image, NAP and llms files.
// Run after `astro build`:
//   node scripts/validate-jsonld.mjs [distDir]
// Per HTML page: exactly one ld+json block that parses and uses the schema.org context, the site
// wide entities are present, every node type has its required fields, no rating, review, award or
// price range markup (unproven claims), every @id reference resolves to a node defined somewhere on
// the site, @ids and canonical URLs sit under the site root, the WebPage url equals the canonical URL.
// Every hreflang alternate points to a built page, the page lists itself among its alternates, and
// x-default is present. Title and description are unique across pages and follow the copy rules (no
// en or em dash, no typographic quotes, no arrows). og:image and twitter:image point to a built file.
// Local SEO: the studio's street and phone number in the JSON-LD are the ones the page shows (NAP).
// llms.txt and llms-full.txt exist per locale and link only built URLs. The 404 page must carry
// noindex and neither canonical nor JSON-LD. Exits with 1 if anything fails.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';

/** Required properties per @type; dotted paths are checked on nested objects. */
const PAGE = ['name', 'url', 'description', 'inLanguage', 'isPartOf', 'about', 'publisher'];
const REQUIRED = {
  WebSite: ['name', 'url', 'inLanguage', 'publisher'],
  WebPage: PAGE,
  CollectionPage: PAGE,
  AboutPage: PAGE,
  ContactPage: PAGE,
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer.text'],
  TattooParlor: [
    'name',
    'url',
    'telephone',
    'address.streetAddress',
    'address.postalCode',
    'address.addressLocality',
    'address.addressCountry',
    'geo.latitude',
    'geo.longitude',
    'openingHoursSpecification',
    'areaServed',
  ],
  Organization: ['name', 'legalName', 'address.streetAddress'],
  Person: ['name', 'jobTitle', 'url'],
  ImageObject: ['url'],
  Service: ['name', 'provider'],
  BreadcrumbList: ['itemListElement'],
  ListItem: ['position', 'name', 'item'],
};

/** Entities every indexable page carries. */
const SITE_ENTITIES = ['WebSite', 'TattooParlor', 'Organization', 'Person', 'ImageObject'];

/** No rating, review, award or price markup: none of it is proven for this studio (ticket #9). */
const FORBIDDEN_TYPES = ['AggregateRating', 'Review', 'Rating'];
const FORBIDDEN_PROPERTIES = ['aggregateRating', 'review', 'award', 'priceRange'];

/** Copy rules for titles and descriptions: no en or em dash, no typographic quotes, no arrows. */
const FORBIDDEN_CHARACTERS = /[\u2013\u2014\u201C\u201D\u201E\u2018\u2019\u201A\u00AB\u00BB\u2190-\u21FF]/;

const LLMS_FILES = ['llms.txt', 'llms-full.txt', 'en/llms.txt', 'en/llms-full.txt'];

const CANONICAL = /<link rel="canonical" href="([^"]+)"/;
const LD_JSON = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const HREFLANG = /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g;
const TITLE = /<title>([^<]*)<\/title>/;
const DESCRIPTION = /<meta name="description" content="([^"]*)"/;
const META_IMAGE = /<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g;

/** HTML attribute and text values come entity encoded; enough decoding for the comparisons below. */
const decode = (value) =>
  value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.name.endsWith('.html') ? [path] : [];
    }),
  );
  return nested.flat();
}

const get = (node, path) => path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), node);
const isEmpty = (value) => value == null || value === '' || (Array.isArray(value) && value.length === 0);
const typesOf = (node) => [node['@type']].flat().filter(Boolean);
/** A reference is an object whose only key is @id. */
const isReference = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 1 && '@id' in value;

/** Calls visit(node, path) for every object inside a JSON-LD value. */
function walk(value, visit, path = '$') {
  if (Array.isArray(value)) value.forEach((item, index) => walk(item, visit, `${path}[${index}]`));
  else if (value !== null && typeof value === 'object') {
    visit(value, path);
    for (const [key, child] of Object.entries(value)) walk(child, visit, `${path}.${key}`);
  }
}

const errors = [];
const fail = (page, message) => errors.push(`${page}: ${message}`);

const files = (await htmlFiles(dist)).sort();
if (files.length === 0) {
  console.error(`No HTML files in ${dist}. Run the build first.`);
  process.exit(1);
}

const siteRoot = (await readFile(join(dist, 'index.html'), 'utf8')).match(CANONICAL)?.[1];
if (!siteRoot) {
  console.error('The start page has no canonical URL, so the site root is unknown.');
  process.exit(1);
}

/** Absolute URL of a built page, from its path below dist (index.html files only, build.format directory). */
const pageUrl = (page) => new URL(page.replace(/index\.html$/, ''), siteRoot).href;
const builtUrls = new Set(files.map((file) => pageUrl(relative(dist, file))));
/** Built file (not page) behind an absolute URL under the site root, or null for other URLs. */
const builtFile = (href) => (href.startsWith(siteRoot) ? join(dist, decodeURIComponent(href.slice(siteRoot.length))) : null);
const exists = (path) =>
  readFile(path).then(
    () => true,
    () => false,
  );
const seenTitles = new Map();
const seenDescriptions = new Map();

const definedIds = new Set();
const pages = [];

for (const file of files) {
  const page = relative(dist, file);
  const html = await readFile(file, 'utf8');
  const canonical = html.match(CANONICAL)?.[1];
  const blocks = [...html.matchAll(LD_JSON)].map((match) => match[1]);
  const alternates = [...html.matchAll(HREFLANG)].map(([, hreflang, href]) => ({ hreflang, href }));

  if (page === '404.html') {
    if (!html.includes('<meta name="robots" content="noindex"')) fail(page, 'must carry noindex');
    if (canonical) fail(page, 'must not have a canonical URL');
    if (blocks.length) fail(page, 'must not carry JSON-LD');
    if (alternates.length) fail(page, 'must not carry hreflang alternates');
    continue;
  }

  const title = decode(html.match(TITLE)?.[1] ?? '');
  const description = decode(html.match(DESCRIPTION)?.[1] ?? '');
  for (const [label, value, seen] of [
    ['title', title, seenTitles],
    ['description', description, seenDescriptions],
  ]) {
    if (!value) fail(page, `${label} missing`);
    else if (seen.has(value)) fail(page, `${label} duplicates ${seen.get(value)}`);
    else seen.set(value, page);
    if (FORBIDDEN_CHARACTERS.test(value)) fail(page, `${label} breaks the copy rules (dash, typographic quote or arrow)`);
  }
  const images = [...html.matchAll(META_IMAGE)].map((match) => match[1]);
  if (images.length !== 2) fail(page, `expected og:image and twitter:image, found ${images.length}`);
  for (const image of images) {
    const file = builtFile(image);
    if (!file || !(await exists(file))) fail(page, `social image ${image} is not a built file`);
  }

  if (!canonical) fail(page, 'canonical URL missing');
  else if (!canonical.startsWith(siteRoot)) fail(page, `canonical ${canonical} is outside ${siteRoot}`);
  if (blocks.length !== 1) fail(page, `expected one JSON-LD block, found ${blocks.length}`);

  if (!alternates.some(({ hreflang }) => hreflang === 'x-default')) fail(page, 'hreflang x-default missing');
  if (canonical && !alternates.some(({ hreflang, href }) => hreflang !== 'x-default' && href === canonical)) {
    fail(page, 'hreflang alternates do not include the page itself');
  }
  for (const { hreflang, href } of alternates) {
    if (!builtUrls.has(href)) fail(page, `hreflang ${hreflang} points to ${href}, which is not a built page`);
  }

  const nodes = [];
  for (const block of blocks) {
    let data;
    try {
      data = JSON.parse(block);
    } catch (error) {
      fail(page, `JSON-LD does not parse: ${error.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org') fail(page, `unexpected @context ${JSON.stringify(data['@context'])}`);
    walk(data, (node, path) => {
      if (isReference(node)) return;
      nodes.push({ node, path });
      if (typeof node['@id'] === 'string') definedIds.add(node['@id']);
    });
  }
  pages.push({ page, canonical, nodes, html });
}

for (const { page, canonical, nodes, html } of pages) {
  const present = new Set(nodes.flatMap(({ node }) => typesOf(node)));
  for (const type of SITE_ENTITIES) if (!present.has(type)) fail(page, `site entity ${type} missing`);
  for (const type of FORBIDDEN_TYPES) if (present.has(type)) fail(page, `${type} markup is not allowed`);
  for (const { node, path } of nodes) {
    for (const property of FORBIDDEN_PROPERTIES) if (property in node) fail(page, `${property} at ${path} is not allowed`);
  }

  // NAP: the page shows the street and links the phone number the TattooParlor node states.
  const studio = nodes.find(({ node }) => typesOf(node).includes('TattooParlor'))?.node;
  if (studio) {
    const visible = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ');
    const text = decode(visible).replace(/\s+/g, ' ');
    if (!text.includes(studio.address?.streetAddress)) fail(page, `studio street ${studio.address?.streetAddress} not shown on the page`);
    if (!html.includes(`href="tel:${studio.telephone}"`)) fail(page, `studio phone ${studio.telephone} not linked on the page`);
  }

  const webPage = nodes.find(({ node }) => String(node['@id'] ?? '').endsWith('#webpage'))?.node;
  if (!webPage) fail(page, 'WebPage node (#webpage) missing');
  // Typed with WebPage or a subtype listed in REQUIRED, so the required field check below applies to it.
  else if (!typesOf(webPage).some((type) => type.endsWith('Page') && type in REQUIRED)) {
    fail(page, `#webpage node has no known page @type (${JSON.stringify(webPage['@type'])})`);
  } else if (canonical && webPage.url !== canonical) fail(page, `WebPage url ${webPage.url} differs from canonical ${canonical}`);

  for (const { node, path } of nodes) {
    for (const type of typesOf(node)) {
      for (const field of REQUIRED[type] ?? []) if (isEmpty(get(node, field))) fail(page, `${type} at ${path} lacks ${field}`);
    }
    if (typeof node['@id'] === 'string' && !node['@id'].startsWith(siteRoot)) fail(page, `@id ${node['@id']} is outside ${siteRoot}`);
  }

  for (const { node, path } of nodes) {
    for (const [key, value] of Object.entries(node)) {
      for (const item of [value].flat()) {
        if (isReference(item) && !definedIds.has(item['@id'])) fail(page, `unresolved @id ${item['@id']} at ${path}.${key}`);
      }
    }
  }
}

for (const name of LLMS_FILES) {
  const path = join(dist, name);
  if (!(await exists(path))) {
    fail(name, 'missing');
    continue;
  }
  const text = await readFile(path, 'utf8');
  if (!text.startsWith('# ')) fail(name, 'must start with an H1 (llmstxt.org)');
  if (/undefined|\[object Object\]|\{(phone|email)\}/.test(text)) fail(name, 'contains an unfilled value');
  // Markdown links and bare URLs. Every URL on the site's origin must sit under the base path and be built.
  for (const [match] of text.matchAll(/https?:\/\/[^\s)]+/g)) {
    const href = match.replace(/[.,;:]+$/, '');
    if (new URL(href).origin !== new URL(siteRoot).origin) continue;
    if (!href.startsWith(siteRoot)) fail(name, `links ${href}, outside the base path ${siteRoot}`);
    else if (!builtUrls.has(href) && !(await exists(builtFile(href)))) fail(name, `links ${href}, which is not built`);
  }
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log(
  `SEO layer valid: ${pages.length} pages, ${definedIds.size} entities, ${LLMS_FILES.length} llms files, site root ${siteRoot}`,
);
