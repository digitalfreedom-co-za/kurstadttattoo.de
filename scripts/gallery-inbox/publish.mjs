#!/usr/bin/env node
// Publishes the photos the studio drops into gallery-inbox/ (#51). For every image: check type and size,
// turn it upright, strip all metadata (EXIF, GPS, camera data), scale it down, save it as an optimised JPG
// under src/assets/images/galerie-neu/ and add an entry to src/data/gallery-new.json with the date and the
// alt text in German and English. A text file with the same name (foto.jpg, foto.txt) adds an optional
// caption. Processed files leave the inbox; files that cannot be used stay there and are listed in the
// report. Entries whose image was deleted from galerie-neu/ are removed from the data.
//
// Usage: node scripts/gallery-inbox/publish.mjs [--date=YYYY-MM-DD]
// In GitHub Actions the report goes to the job summary and changed/published to the step outputs.
import { createHash } from 'node:crypto';
import { appendFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const INBOX_DIR = path.join(ROOT, 'gallery-inbox');
const OUTPUT_DIR = path.join(ROOT, 'src/assets/images/galerie-neu');
const DATA_FILE = path.join(ROOT, 'src/data/gallery-new.json');
const DICTIONARIES = { de: path.join(ROOT, 'src/i18n/de.json'), en: path.join(ROOT, 'src/i18n/en.json') };

/** Files that belong to the inbox folder itself, not uploads. */
const INBOX_FILES = new Set(['README.md', '.gitkeep']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const IMAGE_FORMATS = new Set(['jpeg', 'png', 'webp']);
const CAPTION_EXTENSION = '.txt';
/** GitHub's web upload accepts files up to 25 MB. */
const MAX_BYTES = 25 * 1024 * 1024;
/** Smaller photos look blurred in the lightbox, which shows up to 1600 px. */
const MIN_LONG_EDGE = 1200;
const MAX_LONG_EDGE = 2000;
const JPEG_QUALITY = 82;
const MAX_CAPTION_LENGTH = 160;
const MAX_SLUG_LENGTH = 48;
const HASH_LENGTH = 10;

const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.replace(/^--/, '').split('=')));
const today = args.date ?? new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error(`--date must be YYYY-MM-DD, got ${today}`);

/**
 * Applies the site's text rules to a caption: no typographic quotes, no dashes used as Gedankenstriche,
 * no arrows, one line, limited length (cut at a word boundary).
 */
function cleanCaption(text) {
  let clean = text
    .replace(/[„“”‚‘«»‹›]/g, '')
    .replace(/’/g, "'")
    .replace(/[←-⇿⟰-⟿⤀-⥿]/g, '')
    .replace(/\s+[-‒-―]+\s+/g, ', ')
    .replace(/[‒-―]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.]+|[\s,]+$/g, '');
  if (clean.length > MAX_CAPTION_LENGTH) clean = clean.slice(0, MAX_CAPTION_LENGTH).replace(/\s+\S*$/, '');
  return clean;
}

/** Caption file: lines starting with EN: are English, lines with DE: or without prefix German. */
function parseCaption(text) {
  const lines = { de: [], en: [] };
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(de|en)\s*:(.*)$/i);
    const [locale, value] = match ? [match[1].toLowerCase(), match[2]] : ['de', line];
    if (value.trim()) lines[locale].push(value);
  }
  const caption = {};
  for (const locale of ['de', 'en']) {
    const clean = cleanCaption(lines[locale].join(' '));
    if (clean) caption[locale] = clean;
  }
  return caption;
}

/** ASCII file name part from the German caption: Rose mit Schriftzug, Unterarm becomes rose-mit-schriftzug-unterarm. */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/^-+|-+$/g, '');
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

/** Reads type, size and pixel dimensions; returns the reason when the photo cannot be used. */
async function checkImage(name, input) {
  const extension = path.extname(name).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(extension)) return `Dateityp ${extension || 'ohne Endung'} wird nicht verarbeitet, bitte als JPG hochladen`;
  if (input.length > MAX_BYTES) return 'Datei ist größer als 25 MB';
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch {
    return 'Datei ist kein lesbares Bild';
  }
  if (!IMAGE_FORMATS.has(meta.format)) return `Bildformat ${meta.format} wird nicht verarbeitet, bitte als JPG hochladen`;
  // Orientation 5 to 8: the camera stored the photo turned by 90 degrees.
  const [width, height] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  if (Math.max(width, height) < MIN_LONG_EDGE) {
    return `Bild ist zu klein (${width} x ${height} Pixel, nötig sind mindestens ${MIN_LONG_EDGE} Pixel an der langen Seite)`;
  }
  return undefined;
}

/**
 * Upright, at most MAX_LONG_EDGE, sRGB JPG. sharp writes no metadata unless asked to, so EXIF, GPS, XMP
 * and the ICC profile are gone; transparent areas of a PNG become white.
 */
const optimise = (input) =>
  sharp(input)
    .rotate()
    .resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .toColourspace('srgb')
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

async function main() {
  const fallbackAlt = {
    de: (await readJson(DICTIONARIES.de)).gallery.newWork.alt,
    en: (await readJson(DICTIONARIES.en)).gallery.newWork.alt,
  };
  const entries = (await exists(DATA_FILE)) ? await readJson(DATA_FILE) : [];
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Photos the studio deleted from galerie-neu/ leave the gallery data as well.
  const kept = [];
  const removed = [];
  for (const entry of entries) {
    if (await exists(path.join(OUTPUT_DIR, entry.file))) kept.push(entry);
    else removed.push(entry.file);
  }

  const inbox = (await exists(INBOX_DIR)) ? await readdir(INBOX_DIR, { withFileTypes: true }) : [];
  const names = inbox
    .filter((entry) => entry.isFile() && !INBOX_FILES.has(entry.name) && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
  const captionFiles = new Map(
    names.filter((name) => path.extname(name).toLowerCase() === CAPTION_EXTENSION).map((name) => [path.parse(name).name.toLowerCase(), name]),
  );

  const published = [];
  const duplicates = [];
  const rejected = [];
  // Inbox files leave only after the data is saved, so an error never loses a photo. A Set, because
  // photos with the same base name (foto.jpg, foto.png) share one caption file.
  const processed = new Set();
  const knownHashes = new Set(kept.map((entry) => entry.hash));

  for (const name of names) {
    if (path.extname(name).toLowerCase() === CAPTION_EXTENSION) continue;
    const source = path.join(INBOX_DIR, name);
    const input = await readFile(source);
    const reason = await checkImage(name, input);
    if (reason) {
      rejected.push({ name, reason });
      continue;
    }

    const captionName = captionFiles.get(path.parse(name).name.toLowerCase());
    const removeFromInbox = () => [name, captionName].filter(Boolean).forEach((file) => processed.add(file));
    const hash = createHash('sha256').update(input).digest('hex').slice(0, HASH_LENGTH);
    if (knownHashes.has(hash)) {
      duplicates.push(name);
      removeFromInbox();
      continue;
    }

    const caption = captionName ? parseCaption(await readFile(path.join(INBOX_DIR, captionName), 'utf8')) : {};
    const file = `tattoo-${slugify(caption.de ?? '') || 'kurstadttattoo'}-${today}-${hash}.jpg`;
    let output;
    try {
      output = await optimise(input);
    } catch {
      // A damaged file can pass the header check and fail only while decoding the pixels.
      rejected.push({ name, reason: 'Bild ist beschädigt und konnte nicht gelesen werden' });
      continue;
    }
    await writeFile(path.join(OUTPUT_DIR, file), output);
    const alt = {
      de: caption.de ? `${fallbackAlt.de}: ${caption.de}` : fallbackAlt.de,
      en: caption.en ? `${fallbackAlt.en}: ${caption.en}` : fallbackAlt.en,
    };
    published.push({ file, added: today, hash, alt, ...(Object.keys(caption).length > 0 && { caption }) });
    knownHashes.add(hash);
    removeFromInbox();
  }

  // Newest first; within one day the inbox order (by file name) is kept, since the sort is stable.
  const next = [...published, ...kept].sort((a, b) => b.added.localeCompare(a.added));
  const changed = published.length + removed.length + duplicates.length > 0;
  if (changed) await writeFile(DATA_FILE, `${JSON.stringify(next, null, 2)}\n`);
  // A caption stays as long as a photo with its base name is still waiting in the inbox.
  const waiting = new Set(rejected.map((item) => path.parse(item.name).name.toLowerCase()));
  for (const file of processed) {
    const isWaitingCaption = path.extname(file).toLowerCase() === CAPTION_EXTENSION && waiting.has(path.parse(file).name.toLowerCase());
    if (!isWaitingCaption) await rm(path.join(INBOX_DIR, file));
  }

  // A caption file without its photo stays in the inbox until the photo arrives.
  const list = (items) => items.map((item) => `- ${item}`);
  const report = [
    '## Galerie: Fotos aus gallery-inbox',
    '',
    `Datum: ${today}`,
    '',
    `Veröffentlicht: ${published.length}`,
    ...list(published.map((entry) => entry.file)),
    '',
    `Schon in der Galerie, aus dem Eingang entfernt: ${duplicates.length}`,
    ...list(duplicates),
    '',
    `Nicht verarbeitet, bleiben im Eingang: ${rejected.length}`,
    ...list(rejected.map((item) => `${item.name}: ${item.reason}`)),
    '',
    `Aus der Galerie entfernt, weil das Bild gelöscht wurde: ${removed.length}`,
    ...list(removed),
    '',
  ].join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, report);
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\npublished=${published.length}\n`);
}

await main();
