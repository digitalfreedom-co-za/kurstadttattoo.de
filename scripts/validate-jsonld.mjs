#!/usr/bin/env node
// Validates the JSON-LD and the hreflang alternates of the built site. Run after `astro build`:
//   node scripts/validate-jsonld.mjs [distDir]
// Per HTML page: exactly one ld+json block that parses and uses the schema.org context, the site
// wide entities are present, every node type has its required fields, every @id reference resolves
// to a node defined somewhere on the site, @ids and canonical URLs sit under the site root, the
// WebPage url equals the canonical URL. Every hreflang alternate points to a built page, the page
// lists itself among its alternates, and x-default is present. The 404 page must carry noindex and
// neither canonical nor JSON-LD. Exits with 1 if anything fails.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';

/** Required properties per @type; dotted paths are checked on nested objects. */
const REQUIRED = {
  WebSite: ['name', 'url', 'inLanguage'],
  WebPage: ['name', 'url', 'description', 'inLanguage', 'isPartOf'],
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer.text'],
};

/** Entities every indexable page carries. */
const SITE_ENTITIES = ['WebSite'];

const CANONICAL = /<link rel="canonical" href="([^"]+)"/;
const LD_JSON = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const HREFLANG = /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g;

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
  pages.push({ page, canonical, nodes });
}

for (const { page, canonical, nodes } of pages) {
  const present = new Set(nodes.flatMap(({ node }) => typesOf(node)));
  for (const type of SITE_ENTITIES) if (!present.has(type)) fail(page, `site entity ${type} missing`);

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

if (errors.length) {
  console.error(`JSON-LD validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log(`JSON-LD and hreflang valid: ${pages.length} pages, ${definedIds.size} entities, site root ${siteRoot}`);
