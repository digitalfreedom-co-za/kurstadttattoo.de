// Consent state shared by the consent dialog, the booking calendar and analytics. Nothing here contacts a
// third party; it only reads and writes the visitor's own choice and announces changes on window.
import {
  CONSENT_CATEGORIES,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type ConsentCategory,
  type ConsentRecord,
} from '../config/consent';

export const CONSENT_CHANGE_EVENT = 'consent:change';
export const CONSENT_OPEN_EVENT = 'consent:open';

/** Choice made on this page view, used when localStorage refuses to store it. */
let sessionConsent: ConsentRecord | null = null;

/** The stored choice of the current dialog version, or null when there is none (or storage is blocked). */
export function readConsent(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw) as Partial<ConsentRecord>;
    if (
      record.version !== CONSENT_VERSION ||
      typeof record.timestamp !== 'string' ||
      Number.isNaN(Date.parse(record.timestamp)) ||
      !CONSENT_CATEGORIES.every((category) => typeof record.categories?.[category] === 'boolean')
    )
      return null;
    return record as ConsentRecord;
  } catch {
    return null;
  }
}

export function currentConsent(): ConsentRecord | null {
  // The latest choice on this page view wins over what storage holds.
  return sessionConsent ?? readConsent();
}

export function hasConsent(category: ConsentCategory): boolean {
  return currentConsent()?.categories[category] === true;
}

/** The same answer for every category the dialog offers (accept all, reject all). */
export function allCategories(granted: boolean): Partial<Record<ConsentCategory, boolean>> {
  return Object.fromEntries(CONSENT_CATEGORIES.map((category) => [category, granted]));
}

/**
 * Stores the choice and announces it. Categories not passed keep their current answer. If storage is
 * blocked, the choice still applies to this page view, and the dialog asks again on the next one.
 */
export function saveConsent(categories: Partial<Record<ConsentCategory, boolean>>): ConsentRecord {
  const previous = currentConsent()?.categories ?? {};
  const merged = Object.fromEntries(
    CONSENT_CATEGORIES.map((category) => [category, categories[category] ?? previous[category] === true]),
  );
  const record: ConsentRecord = { version: CONSENT_VERSION, timestamp: new Date().toISOString(), categories: merged };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable or full: at least make sure an older acceptance cannot come back on the next
    // page. The choice itself still applies to this page view (sessionConsent).
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Storage blocked entirely: nothing stored, nothing to remove.
    }
  }
  sessionConsent = record;
  window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_CHANGE_EVENT, { detail: record }));
  return record;
}

// A choice made in another tab of this site replaces the one of this page view.
window.addEventListener('storage', (event) => {
  if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
  sessionConsent = null;
  window.dispatchEvent(new CustomEvent<ConsentRecord | null>(CONSENT_CHANGE_EVENT, { detail: readConsent() }));
});

/** Asks the consent dialog to open in its settings view (footer link, booking placeholder). */
export function openConsentSettings(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
