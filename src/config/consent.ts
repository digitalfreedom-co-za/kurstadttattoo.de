// Consent for optional third party services, configured in one place. The site itself sets no cookies.
// Optional categories: the cal.com booking calendar, always; statistics (GA4) only while a measurement ID
// is configured (src/config/analytics.ts).
//
// The choice is stored in localStorage under CONSENT_STORAGE_KEY as
// { version, timestamp, categories: { booking, analytics? } }. No identifier, only read by this site,
// written only when the visitor answers: strictly necessary under § 25 Abs. 2 Nr. 2 TDDDG (legal repo,
// website/COOKIE_POLICY.en.md § 3.1). Raise CONSENT_TEXT_VERSION whenever the purpose, the recipient or
// the wording of the dialog changes in substance; a stored choice of an older version counts as no choice
// and the dialog asks again. Switching analytics on changes the version too, so every visitor is asked.
import { ANALYTICS_ENABLED } from './analytics';

export const CONSENT_STORAGE_KEY = 'kt-consent';

const CONSENT_TEXT_VERSION = '2026-11-12';

/** Version of the dialog a stored choice refers to (Art. 7 Abs. 1 DSGVO). */
export const CONSENT_VERSION = ANALYTICS_ENABLED ? `${CONSENT_TEXT_VERSION}+analytics` : CONSENT_TEXT_VERSION;

export type ConsentCategory = 'booking' | 'analytics';

/** Categories the dialog offers on this build. */
export const CONSENT_CATEGORIES: ConsentCategory[] = ANALYTICS_ENABLED ? ['booking', 'analytics'] : ['booking'];

export interface ConsentRecord {
  version: string;
  /** ISO 8601 time of the decision. */
  timestamp: string;
  categories: Partial<Record<ConsentCategory, boolean>>;
}

/** Anchor of the consent section in the privacy policy, also the no-JS target of the footer link. */
export const CONSENT_ANCHOR = 'einwilligung';
