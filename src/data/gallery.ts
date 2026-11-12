// Tattoo work from the old site's gallery (docs/source-content/images), defined once. The landing page
// shows the hero piece and the preview selection; the gallery page groups every work by style.
// Not shown: the photo of a session in progress (it shows no finished work).
// Captions and alt texts live in the dictionaries under works.<id>, so both locales share one list.
import type { ImageMetadata } from 'astro';
import type { GalleryItem } from '../components/ui/Gallery.astro';
import { t, type Dictionary, type Locale } from '../i18n';

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
};

/** The piece in the landing page hero: realism in colour, the studio's speciality. */
export const heroWork: WorkId = 'fox';

/** Landing page preview, realism first, then fine line, colour and blackwork (competitor analysis #2). */
export const previewWorks: WorkId[] = ['dogPortrait', 'chessKing', 'shark', 'dragonfly', 'flower', 'rabbit', 'compass', 'blackwork'];

export type StyleGroupId = keyof Dictionary['pages']['gallery']['groups'];

/**
 * Gallery page: every work once, grouped by style. Realism first, the studio's speciality, then the
 * groups competitors rank with (competitor analysis #2). Each group is its own gallery and lightbox.
 */
export const styleGroups: { id: StyleGroupId; works: WorkId[] }[] = [
  { id: 'realism', works: ['dogPortrait', 'chessKing', 'shark', 'crossDove', 'biomech', 'ankh', 'fist'] },
  { id: 'colour', works: ['fox', 'rabbit', 'smurf'] },
  { id: 'fineLine', works: ['dragonfly', 'blossoms', 'flower'] },
  { id: 'lettering', works: ['lettering', 'signature', 'memories', 'compass'] },
  { id: 'blackwork', works: ['blackwork', 'blackworkOuter', 'maori', 'tribalNeck', 'tribalWeb', 'valknut', 'eye'] },
];

export function work(id: WorkId, locale: Locale): GalleryItem {
  const copy = t(locale).works[id];
  return { src: works[id], alt: copy.alt, title: copy.title, meta: copy.meta };
}

export function galleryItems(ids: readonly WorkId[], locale: Locale): GalleryItem[] {
  return ids.map((id) => work(id, locale));
}
