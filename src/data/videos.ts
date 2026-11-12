// Patrick's answers on YouTube, embedded on the old site (docs/source-content, Videos). We link them
// instead of embedding: no request to YouTube without consent. Only the titles are known, so the site
// never states what is said in a video. Link texts live in the dictionaries under videos.<id>.
import { t, type Dictionary, type Locale } from '../i18n';

export type VideoId = keyof Dictionary['videos']['items'];

const youtubeIds: Record<VideoId, string> = {
  howStarted: 'MhzPgwdSqKU',
  care: '-bt8M9ESxDc',
  colour: '5i6BeQQSOa0',
  cost: 'V07-y2oLB-k',
  finishing: 'XLK2HFlwZQc',
  eczema: 'mBovL93rZLQ',
  vegan: 'UQ8yaqGwPgQ',
  fainting: 'dVTYxFSH67I',
  eagleBack: '198nUgRtIJU',
};


export interface VideoLink {
  title: string;
  text: string;
  href: string;
}

export function video(id: VideoId, locale: Locale): VideoLink {
  const copy = t(locale).videos.items[id];
  return { ...copy, href: `https://www.youtube.com/watch?v=${youtubeIds[id]}` };
}

export function videos(ids: readonly VideoId[], locale: Locale): VideoLink[] {
  return ids.map((id) => video(id, locale));
}
