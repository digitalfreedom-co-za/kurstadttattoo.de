// Google Analytics 4 with Consent Mode v2 Basic (wiki websites.md): gtag.js loads only after consent,
// never before and never on decline. Switched by PUBLIC_GA4_ID at build time (repository variable of the
// deploy workflow). Without a valid measurement ID analytics does not exist on the site: no snippet in
// the head, no analytics category in the consent dialog (Decision Log #14).
const id = (import.meta.env.PUBLIC_GA4_ID ?? '').trim();

/** GA4 measurement ID, or an empty string while analytics is off. */
export const GA4_ID = /^G-[A-Z0-9]+$/.test(id) ? id : '';

export const ANALYTICS_ENABLED = GA4_ID !== '';

/**
 * Lifetime of the GA4 cookies _ga and _ga_<ID> in months, set explicitly instead of Google's two year default
 * (legal website/COOKIE_POLICY.en.md § 5.1: up to 24 months, state the configured value). gtag renews the
 * expiry with every hit, so the lifetime counts from the last visit. The privacy policy and the consent
 * dialog state this value through the {months} placeholder.
 */
export const GA4_COOKIE_MONTHS = 13;

/** cookie_expires for gtag in seconds. A month counts as 30 days, so the cookie never outlives the stated months. */
export const GA4_COOKIE_EXPIRES_SECONDS = GA4_COOKIE_MONTHS * 30 * 24 * 60 * 60;
