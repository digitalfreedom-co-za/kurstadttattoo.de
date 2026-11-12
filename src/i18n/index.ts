// Dictionary access. Both JSON files share one shape; the German file is the reference type, so a key
// missing in English fails astro check.
import de from './de.json';
import en from './en.json';
import type { Locale } from './routes';

export type Dictionary = typeof de;

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from './routes';
