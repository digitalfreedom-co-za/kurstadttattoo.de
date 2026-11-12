// Dictionary access. Both JSON files share one shape; the German file is the reference type, so a key
// missing in English fails astro check.
import de from './de.json';
import en from './en.json';
import type { Locale, RouteKey } from './routes';

export type Dictionary = typeof de;

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from './routes';

/**
 * Section anchors of a page, mapped from one locale to its translation (e.g. arbeiten to work), so the
 * language switch and the language hint keep the visitor at the same section. Read from the "id"
 * fields of the page dictionary, which both locales share in shape.
 */
export function anchorMap(key: RouteKey, from: Locale, to: Locale): Record<string, string> {
  const pairs: Record<string, string> = {};
  const collect = (source: unknown, target: unknown) => {
    if (!source || typeof source !== 'object' || !target || typeof target !== 'object') return;
    for (const [field, value] of Object.entries(source)) {
      const counterpart = (target as Record<string, unknown>)[field];
      if (field === 'id' && typeof value === 'string' && typeof counterpart === 'string') pairs[value] = counterpart;
      else collect(value, counterpart);
    }
  };
  const pages = (locale: Locale) => (t(locale).pages as Record<string, unknown>)[key];
  collect(pages(from), pages(to));
  return pairs;
}
