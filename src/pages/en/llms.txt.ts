// /en/llms.txt, English, generated from the site data (src/lib/llms.ts).
import type { APIRoute } from 'astro';
import { llmsSummary, textResponse } from '../../lib/llms';

export const GET: APIRoute = ({ site }) => textResponse(llmsSummary('en', site));
