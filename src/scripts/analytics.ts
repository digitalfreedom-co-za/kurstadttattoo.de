// GA4 Consent Mode v2 Basic, the part after the first paint (wiki websites.md, sections 1 and 2). The inline
// head snippet (src/components/seo/Analytics.astro) already set the consent defaults to denied, defined
// window.loadGtag and restored a stored grant. Here the visitor's later answers take effect:
// - granted: consent update, then gtag.js is injected, then the consent event. No reload.
// - withdrawn after gtag.js loaded: consent update to denied, the _ga cookies are deleted and the page
//   reloads, so the loaded tag is gone (unless storage refused the withdrawal, see below).
// - declined before anything loaded: nothing happens, no Google request, no event.
import { CONSENT_CHANGE_EVENT, hasConsent, readConsent } from './consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    loadGtag?: () => void;
    __gtagLoaded?: boolean;
  }
}

/** Deletes the GA cookies on this host and its parent domains. */
function deleteGaCookies(): void {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const labels = window.location.hostname.split('.');
  const domains = labels.map((_, index) => labels.slice(index).join('.')).filter((domain) => domain.includes('.'));
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
  }
}

window.addEventListener(CONSENT_CHANGE_EVENT, () => {
  const { gtag, loadGtag } = window;
  if (!gtag || !loadGtag) return;
  if (hasConsent('analytics')) {
    if (window.__gtagLoaded) return;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGtag();
    gtag('event', 'cookie_consent_granted');
    return;
  }
  if (!window.__gtagLoaded) return;
  gtag('consent', 'update', { analytics_storage: 'denied' });
  deleteGaCookies();
  // If the withdrawal could not be stored, a reload would restore the old grant and load the tag again;
  // the denied consent state then stays in force for this page view instead.
  if (readConsent()?.categories.analytics !== true) window.location.reload();
});
