// FAQ entries, defined once in the dictionaries (faq.items). The landing page shows the featured ones,
// the FAQ page all of them in topic groups, and the FAQPage JSON-LD reads the same lists. Answers are plain text,
// the first sentence is the direct answer. {phone} and {email} are filled from src/config/site.ts.
import type { FaqEntry } from '../components/ui/Faq.astro';
import { fillStudio } from '../lib/placeholders';
import { t, type Dictionary, type Locale } from '../i18n';

export type FaqId = keyof Dictionary['faq']['items'];

/** Shown in the FAQ preview on the landing page, in this order. */
export const featuredFaqIds: FaqId[] = ['booking', 'ownDesign', 'finishing', 'care', 'removal', 'reopening'];

export type FaqGroupId = keyof Dictionary['pages']['faq']['groups'];

/** FAQ page: every written answer once, grouped by topic. Questions without known facts get a video link. */
export const faqGroups: { id: FaqGroupId; ids: FaqId[] }[] = [
  { id: 'booking', ids: ['booking', 'ownDesign', 'finishing', 'styles', 'artist'] },
  { id: 'session', ids: ['fainting', 'care', 'aftercare', 'removal'] },
  { id: 'studio', ids: ['reopening', 'hours', 'expert'] },
];

export function faqEntries(ids: readonly FaqId[], locale: Locale): FaqEntry[] {
  const items = t(locale).faq.items;
  return ids.map((id) => ({ question: items[id].question, answer: fillStudio(items[id].answer) }));
}
