// robots.txt, built from the site config so the sitemap URL follows the deploy target.
// Search and AI crawlers are allowed in both modes: on the noindex preview they must be able to
// fetch the pages to see the noindex. Tokens as documented by the vendors (list from the wiki,
// websites.md, AI crawler control).
import type { APIRoute } from 'astro';
import { indexable } from '../config/site';
import { absoluteUrl } from '../lib/url';

const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'Meta-WebIndexer',
  'YouBot',
  'Diffbot',
  'Amazonbot',
  'Amzn-SearchBot',
  'Amzn-User',
  'DuckAssistBot',
  'MistralAI-User',
  'MistralAI-Index',
  'MistralAI-Training',
];

export const GET: APIRoute = ({ site }) => {
  const lines = [
    indexable
      ? '# Search engines and AI crawlers are welcome.'
      : '# Preview build: every page carries noindex. Crawling stays allowed so the noindex is seen.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...aiCrawlers.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /']),
    '',
    `Sitemap: ${absoluteUrl('/sitemap-index.xml', site)}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
