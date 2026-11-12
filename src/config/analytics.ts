// Google Analytics 4 with Consent Mode v2 Basic (wiki websites.md): gtag.js loads only after consent,
// never before and never on decline. Switched by PUBLIC_GA4_ID at build time (repository variable of the
// deploy workflow). Without a valid measurement ID analytics does not exist on the site: no snippet in
// the head, no analytics category in the consent dialog (Decision Log #14).
const id = (import.meta.env.PUBLIC_GA4_ID ?? '').trim();

/** GA4 measurement ID, or an empty string while analytics is off. */
export const GA4_ID = /^G-[A-Z0-9]+$/.test(id) ? id : '';

export const ANALYTICS_ENABLED = GA4_ID !== '';
