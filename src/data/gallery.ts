// Tattoo work from the old site's gallery (docs/source-content/images), defined once. The landing page
// shows the hero piece and the preview selection; the gallery page (#6) adds the remaining works here.
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
};

/** The piece in the landing page hero: realism in colour, the studio's speciality. */
export const heroWork: WorkId = 'fox';

/** Landing page preview, realism first, then fine line, colour and blackwork (competitor analysis #2). */
export const previewWorks: WorkId[] = ['dogPortrait', 'chessKing', 'shark', 'dragonfly', 'flower', 'rabbit', 'compass', 'blackwork'];

export function work(id: WorkId, locale: Locale): GalleryItem {
  const copy = t(locale).works[id];
  return { src: works[id], alt: copy.alt, title: copy.title, meta: copy.meta };
}

export function galleryItems(ids: readonly WorkId[], locale: Locale): GalleryItem[] {
  return ids.map((id) => work(id, locale));
}
