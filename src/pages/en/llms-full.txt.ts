// /en/llms-full.txt, English, generated from the site data (src/lib/llms.ts).
import type { APIRoute } from 'astro';
import { llmsFull, textResponse } from '../../lib/llms';

export const GET: APIRoute = ({ site }) => textResponse(llmsFull('en', site));
