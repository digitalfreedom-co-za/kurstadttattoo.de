// FAQ entries, defined once in the dictionaries (faq.items). The landing page shows the featured ones,
// the FAQ page (#6) all of them, and the FAQPage JSON-LD reads the same list. Answers are plain text,
// the first sentence is the direct answer. {phone} and {email} come from src/config/site.ts.
import type { FaqEntry } from '../components/ui/Faq.astro';
import { studio } from '../config/site';
import { t, type Dictionary, type Locale } from '../i18n';

export type FaqId = keyof Dictionary['faq']['items'];

/** Shown in the FAQ preview on the landing page, in this order. */
export const featuredFaqIds: FaqId[] = ['booking', 'ownDesign', 'finishing', 'care', 'removal', 'reopening'];

function fill(text: string): string {
  return text.replaceAll('{phone}', studio.phone.display).replaceAll('{email}', studio.email.display);
}

export function faqEntries(ids: readonly FaqId[], locale: Locale): FaqEntry[] {
  const items = t(locale).faq.items;
  return ids.map((id) => ({ question: items[id].question, answer: fill(items[id].answer) }));
}
