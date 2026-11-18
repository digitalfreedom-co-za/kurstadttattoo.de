// Regression tests for the gallery publish flow (#51). Every test runs publish.mjs against its own temporary
// project folder, so real photos and gallery data are never touched.
// Run: npm run test:gallery
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { chmod, cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const SCRIPT = fileURLToPath(new URL('./publish.mjs', import.meta.url));
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const DATE = '2026-11-01';

let project;
const inbox = () => path.join(project, 'gallery-inbox');
const outputDir = () => path.join(project, 'src/assets/images/galerie-neu');
const dataFile = () => path.join(project, 'src/data/gallery-new.json');

const publish = () => promisify(execFile)(process.execPath, [SCRIPT, `--root=${project}`, `--date=${DATE}`], { env: {} });
const readEntries = async () => JSON.parse(await readFile(dataFile(), 'utf8'));
const inboxFiles = async () => (await readdir(inbox())).sort();

/** A JPG of the given size; the seed changes the colour, so photos with different seeds are different files. */
const photo = (width, height, seed = 0, metadata) => {
  const image = sharp({ create: { width, height, channels: 3, background: { r: seed, g: 120, b: 80 } } });
  return (metadata ? image.withExif(metadata.exif).withMetadata({ orientation: metadata.orientation }) : image).jpeg().toBuffer();
};

beforeEach(async () => {
  project = await mkdtemp(path.join(tmpdir(), 'gallery-publish-'));
  await mkdir(inbox());
  await mkdir(path.dirname(dataFile()), { recursive: true });
  await writeFile(dataFile(), '[]\n');
  await cp(path.join(ROOT, 'src/i18n'), path.join(project, 'src/i18n'), { recursive: true });
});

afterEach(async () => {
  await rm(project, { recursive: true, force: true });
});

test('publishes a photo upright, scaled down and without metadata, with the cleaned caption in both languages', async () => {
  // Orientation 6: the camera stored the portrait photo lying on its side.
  const exif = { IFD0: { Make: 'TestCamera', Model: 'Model X' }, IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '50/1 21/1 0/1' } };
  await writeFile(path.join(inbox(), 'IMG_1.jpg'), await photo(3000, 2000, 10, { orientation: 6, exif }));
  await writeFile(path.join(inbox(), 'IMG_1.txt'), '„Rose“ ➡ Unterarm ➡️ Schrift ⬅ Linie -> Ende\nEN: Rose ⮕ forearm => lettering\n');

  await publish();

  const [entry] = await readEntries();
  assert.deepEqual(entry.caption, { de: 'Rose Unterarm Schrift Linie Ende', en: 'Rose forearm lettering' });
  assert.equal(entry.alt.de, 'Tattoo aus dem Studio KurstadtTattoo Bad Nauheim: Rose Unterarm Schrift Linie Ende');
  assert.equal(entry.added, DATE);
  assert.match(entry.file, /^tattoo-rose-unterarm-schrift-linie-ende-2026-11-01-[0-9a-f]{10}\.jpg$/);

  const meta = await sharp(path.join(outputDir(), entry.file)).metadata();
  assert.deepEqual([meta.format, meta.width, meta.height], ['jpeg', 1333, 2000]);
  assert.equal(meta.exif, undefined);
  assert.equal(meta.orientation, undefined);
  assert.deepEqual(await inboxFiles(), []);
});

test('removes a photo that is already in the gallery from the inbox without publishing it twice', async () => {
  const image = await photo(1600, 1200, 20);
  await writeFile(path.join(inbox(), 'IMG_2.jpg'), image);
  await publish();
  await writeFile(path.join(inbox(), 'IMG_2-again.jpg'), image);
  await writeFile(path.join(inbox(), 'IMG_2-again.txt'), 'Zweiter Bildtext');

  const { stdout } = await publish();

  assert.equal((await readEntries()).length, 1);
  assert.equal((await readdir(outputDir())).length, 1);
  assert.deepEqual(await inboxFiles(), []);
  assert.match(stdout, /Schon in der Galerie, aus dem Eingang entfernt: 1\n- IMG_2-again\.jpg/);
});

test('removes the gallery entry of a photo the studio deleted', async () => {
  await writeFile(path.join(inbox(), 'IMG_3.jpg'), await photo(1600, 1200, 30));
  await writeFile(path.join(inbox(), 'IMG_4.jpg'), await photo(1600, 1200, 40));
  await publish();
  const [deleted, kept] = await readEntries();
  await rm(path.join(outputDir(), deleted.file));

  await publish();

  assert.deepEqual(await readEntries(), [kept]);
});

test('keeps an unusable photo and its caption in the inbox', async () => {
  await writeFile(path.join(inbox(), 'IMG_5.jpg'), await photo(800, 600, 50));
  await writeFile(path.join(inbox(), 'IMG_5.txt'), 'Bildtext');
  // Same base name as the rejected photo: it is published, the shared caption has to wait.
  await writeFile(path.join(inbox(), 'IMG_5.png'), await sharp(await photo(1600, 1200, 60)).png().toBuffer());

  const { stdout } = await publish();

  assert.equal((await readEntries()).length, 1);
  assert.deepEqual(await inboxFiles(), ['IMG_5.jpg', 'IMG_5.txt']);
  assert.match(stdout, /IMG_5\.jpg: Bild ist zu klein/);
});

test('leaves the photos in the inbox when the gallery data cannot be saved', { skip: process.getuid?.() === 0 && 'root ignores file permissions' }, async () => {
  await writeFile(path.join(inbox(), 'IMG_6.jpg'), await photo(1600, 1200, 70));
  await writeFile(path.join(inbox(), 'IMG_6.txt'), 'Bildtext');
  await chmod(dataFile(), 0o444);

  await assert.rejects(publish());

  assert.deepEqual(await inboxFiles(), ['IMG_6.jpg', 'IMG_6.txt']);
  assert.deepEqual(await readEntries(), []);
});
