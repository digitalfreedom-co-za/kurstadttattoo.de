// Consent for optional third party services, configured in one place. The site itself sets no cookies.
// Optional categories: the cal.com booking calendar only while the build embeds one (CAL_ENABLED in
// src/config/booking.ts); statistics (GA4) only while a measurement ID is configured
// (src/config/analytics.ts). With neither there is nothing to consent to: the dialog says so and no
// choice is stored.
//
// The choice is stored in localStorage under CONSENT_STORAGE_KEY as
// { version, timestamp, categories: { booking, analytics? } }. No identifier, only read by this site,
// written only when the visitor answers: strictly necessary under § 25 Abs. 2 Nr. 2 TDDDG (legal repo,
// website/COOKIE_POLICY.en.md § 3.1). Raise CONSENT_TEXT_VERSION whenever the purpose, the recipient or
// the wording of the dialog changes in substance; a stored choice of an older version counts as no choice
// and the dialog asks again. Switching analytics on changes the version too, so every visitor is asked.
//
// Proof of consent (legal website/COOKIE_POLICY.en.md § 5.2) stays on the visitor's side: the site is static
// and the operator keeps no consent log (Decision Log #14, ticket #34). A record expires CONSENT_MAX_AGE_MONTHS
// after its timestamp, the retention § 5.2 names; it is then removed and the dialog asks again.
import { ANALYTICS_ENABLED } from './analytics';
import { CAL_ENABLED } from './booking';

export const CONSENT_STORAGE_KEY = 'kt-consent';

/** Months a stored choice stays valid (COOKIE_POLICY § 5.2: 36 months). */
export const CONSENT_MAX_AGE_MONTHS = 36;

const CONSENT_TEXT_VERSION = '2026-11-12';

/** Version of the dialog a stored choice refers to (Art. 7 Abs. 1 DSGVO). */
export const CONSENT_VERSION = ANALYTICS_ENABLED ? `${CONSENT_TEXT_VERSION}+analytics` : CONSENT_TEXT_VERSION;

export type ConsentCategory = 'booking' | 'analytics';

/** Categories the dialog offers on this build. */
export const CONSENT_CATEGORIES: ConsentCategory[] = [
  ...(CAL_ENABLED ? (['booking'] as const) : []),
  ...(ANALYTICS_ENABLED ? (['analytics'] as const) : []),
];

export interface ConsentRecord {
  version: string;
  /** ISO 8601 time of the decision. */
  timestamp: string;
  categories: Partial<Record<ConsentCategory, boolean>>;
}

/**
 * End of validity of a choice made at made: the same day CONSENT_MAX_AGE_MONTHS later, capped at the last day
 * of that month (29 Feb 2024 expires on 28 Feb 2027), so the record never outlives the 36 calendar months.
 * The inline scripts in BookingEmbed.astro and Analytics.astro repeat this calculation.
 */
export function consentExpiry(made: Date): Date {
  const expires = new Date(made);
  expires.setDate(1);
  expires.setMonth(expires.getMonth() + CONSENT_MAX_AGE_MONTHS);
  const lastDay = new Date(expires.getFullYear(), expires.getMonth() + 1, 0).getDate();
  expires.setDate(Math.min(made.getDate(), lastDay));
  return expires;
}

/** True when a choice made at timestamp is older than CONSENT_MAX_AGE_MONTHS (or lies in the future). */
export function consentExpired(timestamp: string, now: Date = new Date()): boolean {
  const made = new Date(timestamp);
  return made > now || now >= consentExpiry(made);
}

/** Anchor of the consent section in the privacy policy, also the no-JS target of the footer link. */
export const CONSENT_ANCHOR = 'einwilligung';
