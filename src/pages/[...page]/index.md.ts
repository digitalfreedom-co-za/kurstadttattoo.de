// <page url>index.md: the Markdown version of every content page in both locales (llmstxt.org, wiki
// websites.md), generated from the same dictionaries as the HTML page (src/lib/page-markdown.ts).
import type { APIRoute, GetStaticPaths } from 'astro';
import { markdownPages, markdownResponse, pageMarkdown } from '../../lib/page-markdown';
import { locales, localizedPath, type Locale, type RouteKey } from '../../i18n';

export const getStaticPaths = (() =>
  locales.flatMap((locale) =>
    markdownPages.map((key) => ({
      // The start page of the default locale sits at the root, so its rest parameter is empty.
      params: { page: localizedPath(key, locale).replace(/^\/|\/$/g, '') || undefined },
      props: { key, locale },
    })),
  )) satisfies GetStaticPaths;

export const GET: APIRoute<{ key: RouteKey; locale: Locale }> = ({ props, site }) =>
  markdownResponse(pageMarkdown(props.key, props.locale, site));
