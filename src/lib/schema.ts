// JSON-LD graph. Every page carries the WebSite plus its own WebPage, linked by @id. The studio,
// its people and further page types are added by the SEO ticket (#9) on top of these nodes.
import { site } from '../config/site';
import { absoluteUrl } from './url';
import { locales, localeMeta, type Locale } from '../i18n/routes';

export type JsonLdNode = Record<string, unknown>;

export const websiteId = (base: URL | undefined) => `${absoluteUrl('/', base)}#website`;
export const webPageId = (path: string, base: URL | undefined) => `${absoluteUrl(path, base)}#webpage`;

export function websiteNode(base: URL | undefined): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(base),
    name: site.name,
    url: absoluteUrl('/', base),
    inLanguage: locales.map((locale) => localeMeta[locale].lang),
  };
}

export function webPageNode(
  page: { path: string; name: string; description: string; locale: Locale },
  base: URL | undefined,
): JsonLdNode {
  return {
    '@type': 'WebPage',
    '@id': webPageId(page.path, base),
    url: absoluteUrl(page.path, base),
    name: page.name,
    description: page.description,
    inLanguage: localeMeta[page.locale].lang,
    isPartOf: { '@id': websiteId(base) },
  };
}

/** FAQPage for a page that shows questions and answers; the answers are plain text. */
export function faqPageNode(
  page: { path: string; locale: Locale },
  items: { question: string; answer: string }[],
  base: URL | undefined,
): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(page.path, base)}#faq`,
    inLanguage: localeMeta[page.locale].lang,
    isPartOf: { '@id': webPageId(page.path, base) },
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
