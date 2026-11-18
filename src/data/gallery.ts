// Tattoo work from the old site's gallery (docs/source-content/images) and the new studio photos of
// November 2026 (docs/source-content/images/neue-bilder-2026-11, #50), defined once. The landing page
// shows the hero piece and the preview selection; the gallery page groups every published work by style.
// Not shown: the photo of a session in progress (it shows no finished work).
// Captions and alt texts live in the dictionaries under works.<id>, so both locales share one list.
import type { ImageMetadata } from 'astro';
import type { GalleryItem } from '../components/ui/Gallery.astro';
import { t, type Dictionary, type Locale } from '../i18n';
import newPhotos from './gallery-new.json';

import fox from '../assets/images/galerie-fuchs-farbe-unterarm.jpg';
import dogPortrait from '../assets/images/galerie-hundeportrait-pfote-unterarm.jpg';
import chessKing from '../assets/images/galerie-schach-koenig-unterarm.png';
import shark from '../assets/images/galerie-hai-koordinaten-oberarm.png';
import dragonfly from '../assets/images/galerie-libelle-fineline-unterarm.jpg';
import flower from '../assets/images/galerie-bluete-handruecken.jpg';
import rabbit from '../assets/images/galerie-hase-farbe-wade.jpg';
import compass from '../assets/images/galerie-kompass-family-rippen.jpg';
import blackwork from '../assets/images/galerie-blackwork-arm-innen.jpg';
import blackworkOuter from '../assets/images/galerie-blackwork-arm-aussen.jpg';
import biomech from '../assets/images/galerie-biomechanik-hand.png';
import lettering from '../assets/images/galerie-schriftzuege-ewigkeit-dna-bein.jpg';
import signature from '../assets/images/galerie-unterschrift-elvis-presley-fuss.png';
import maori from '../assets/images/galerie-maori-blackwork-unterarm.png';
import blossoms from '../assets/images/galerie-bluetenzweige-fuss.jpg';
import smurf from '../assets/images/galerie-schlumpf-cyborg-wade.png';
import ankh from '../assets/images/galerie-ankh-strahlen-oberarm.png';
import tribalNeck from '../assets/images/galerie-tribal-hals-mann.jpg';
import tribalWeb from '../assets/images/galerie-tribal-hals-frau.png';
import crossDove from '../assets/images/galerie-kreuz-taube-unterarm.png';
import valknut from '../assets/images/galerie-armband-valknut-unterarm.png';
import memories from '../assets/images/galerie-schriftzug-memories-unterarm.jpg';
import fist from '../assets/images/galerie-faust-mit-schrift-unterarm.jpg';
import eye from '../assets/images/galerie-auge-dreieck-knie.png';
import knotwork from '../assets/images/portfolio/galerie-flechtwerk-ornament-unterarm.jpg';
import faithHopeLove from '../assets/images/portfolio/galerie-schriftzug-faith-hope-love-unterarm.jpg';
import eagleEmblem from '../assets/images/portfolio/galerie-adler-mit-motorradlogo-wade.jpg';
import iceHockey from '../assets/images/portfolio/galerie-eishockeyspieler-wade.jpg';
import cartoonRabbit from '../assets/images/portfolio/galerie-cartoon-hase-mit-cap-wade.jpg';
import partnerBands from '../assets/images/portfolio/galerie-partner-armbaender-anker-unterarme.jpg';
import ornamentFlower from '../assets/images/portfolio/galerie-ornament-bluete-dotwork-unterarm.jpg';
import cartoonPanther from '../assets/images/portfolio/galerie-cartoon-panther-farbe-wade.jpg';
import eagleCrest from '../assets/images/portfolio/galerie-adler-vereinswappen-skyline-wade.jpg';
import always from '../assets/images/portfolio/galerie-schriftzug-always-rippen.jpg';
import roseQuote from '../assets/images/portfolio/galerie-rose-schriftzug-ewigkeit-unterarm.jpg';
import footballer from '../assets/images/portfolio/galerie-fussballer-mit-pokal-wade.jpg';

export type WorkId = keyof Dictionary['works'];

export const works: Record<WorkId, ImageMetadata> = {
  fox,
  dogPortrait,
  chessKing,
  shark,
  dragonfly,
  flower,
  rabbit,
  compass,
  blackwork,
  blackworkOuter,
  biomech,
  lettering,
  signature,
  maori,
  blossoms,
  smurf,
  ankh,
  tribalNeck,
  tribalWeb,
  crossDove,
  valknut,
  memories,
  fist,
  eye,
  knotwork,
  faithHopeLove,
  eagleEmblem,
  iceHockey,
  cartoonRabbit,
  partnerBands,
  ornamentFlower,
  cartoonPanther,
  eagleCrest,
  always,
  roseQuote,
  footballer,
};

/**
 * Works that stay in the data but on no page (gallery, landing page, page Markdown) until the owners
 * confirm them. lettering: the leg piece with the federal eagle, Einigkeit Recht Freiheit and Der Osten,
 * held back until Patrick and Marcello confirm it is appropriate (#50).
 */
const publication: Partial<Record<WorkId, { published: false }>> = {
  lettering: { published: false },
};

export const isPublished = (id: WorkId) => publication[id]?.published !== false;

/** The piece in the landing page hero: realism in colour, the studio's speciality. */
export const heroWork: WorkId = 'fox';

/**
 * Landing page preview: two lead works, a portrait and a fine line piece (the stated specialities, chosen
 * from the clearer photos without large overlaid branding), then one row of four supporting works, three
 * of them from the new studio photos (#50). Never on the landing page while Patrick has not confirmed the
 * rights: works with brand or club logos, cartoon characters or a recognisable real person (eagleEmblem,
 * iceHockey, cartoonRabbit, cartoonPanther, eagleCrest, footballer), and ornamentFlower, whose 4:5 crop
 * shows a name and a date tattooed above it.
 */
export const leadWorks: WorkId[] = ['dogPortrait', 'dragonfly'];
export const previewWorks: WorkId[] = [...leadWorks, 'roseQuote', 'knotwork', 'partnerBands', 'rabbit'];

/**
 * Thumbnail framing per work, checked against the source photos. contain shows the whole photo where the
 * 4:5 crop would cut the composition: wide or near square pieces (lettering across the forearm, the shark,
 * the chess king, the neck tribal) and long placements (portrait, lettering on the leg, blossom, compass).
 * Every other work takes the centred 4:5 crop. The lightbox always shows the full, unchanged photo.
 */
const framing: Partial<Record<WorkId, Pick<GalleryItem, 'fit' | 'position'>>> = {
  memories: { fit: 'contain' },
  faithHopeLove: { fit: 'contain' },
  shark: { fit: 'contain' },
  chessKing: { fit: 'contain' },
  tribalNeck: { fit: 'contain' },
  dogPortrait: { fit: 'contain' },
  lettering: { fit: 'contain' },
  flower: { fit: 'contain' },
  compass: { fit: 'contain' },
};

export type StyleGroupId = keyof Dictionary['pages']['gallery']['groups'];

/**
 * Gallery page: every published work once, grouped by style. Realism first, the studio's speciality,
 * then the groups competitors rank with (competitor analysis #2). Each group is its own gallery and
 * lightbox. Newest first: the photos of November 2026 (#50) lead each group, in the order of the archive,
 * since the files carry no shooting date.
 */
const allStyleGroups: { id: StyleGroupId; works: WorkId[] }[] = [
  {
    id: 'realism',
    works: ['eagleEmblem', 'iceHockey', 'cartoonRabbit', 'eagleCrest', 'footballer', 'dogPortrait', 'chessKing', 'shark', 'crossDove', 'biomech', 'ankh', 'fist'],
  },
  { id: 'colour', works: ['cartoonPanther', 'fox', 'rabbit', 'smurf'] },
  { id: 'fineLine', works: ['always', 'dragonfly', 'blossoms', 'flower'] },
  { id: 'lettering', works: ['faithHopeLove', 'roseQuote', 'lettering', 'signature', 'memories', 'compass'] },
  {
    id: 'blackwork',
    works: ['knotwork', 'partnerBands', 'ornamentFlower', 'blackwork', 'blackworkOuter', 'maori', 'tribalNeck', 'tribalWeb', 'valknut', 'eye'],
  },
];

export const styleGroups = allStyleGroups.map((group) => ({ ...group, works: group.works.filter(isPublished) }));

export function work(id: WorkId, locale: Locale): GalleryItem {
  const copy = t(locale).works[id];
  return { src: works[id], alt: copy.alt, title: copy.title, meta: copy.meta, ...framing[id], featured: leadWorks.includes(id) };
}

export function galleryItems(ids: readonly WorkId[], locale: Locale): GalleryItem[] {
  return ids.filter(isPublished).map((id) => work(id, locale));
}

/**
 * Photos the studio published through gallery-inbox/ (#51): scripts/gallery-inbox/publish.mjs writes the
 * optimised image to assets/images/galerie-neu/ and the entry to gallery-new.json, newest first. An entry
 * whose image was deleted is skipped, so removing a photo needs only the file deletion; the next run of
 * the script drops the entry as well. contain, because nobody checks the 4:5 crop of these photos.
 */
interface NewPhoto {
  file: string;
  /** Publication date, YYYY-MM-DD. */
  added: string;
  alt: Record<Locale, string>;
  caption?: Partial<Record<Locale, string>>;
}

const newImages = import.meta.glob<ImageMetadata>('../assets/images/galerie-neu/*.jpg', { eager: true, import: 'default' });

export function newWorkItems(locale: Locale): GalleryItem[] {
  const copy = t(locale).gallery.newWork;
  const month = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (newPhotos as NewPhoto[]).flatMap((photo) => {
    const src = newImages[`../assets/images/galerie-neu/${photo.file}`];
    if (!src) return [];
    return [{ src, alt: photo.alt[locale], title: photo.caption?.[locale] ?? copy.title, meta: month.format(new Date(photo.added)), fit: 'contain' }];
  });
}
