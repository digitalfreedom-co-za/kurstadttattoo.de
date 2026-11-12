// Lazy cal.com inline embed behind consent. Without consent for the booking category
// (src/scripts/consent.ts) nothing from cal.com loads: the block stays blocked and shows its click to load
// placeholder. With consent, the embed loads once the calendar frame (.booking-frame) of a [data-booking]
// block is in the viewport, not the notice or text around it; then the official embed snippet is installed
// and the calendar rendered into the reserved frame. The skeleton fades out once cal.com reports the
// booking page as ready. Withdrawing consent after cal.com has loaded reloads the page, so embed.js and the
// iframe are gone; before that, the block simply returns to blocked. Texts come from data attributes, so
// the script serves both locales.
import { CAL_THEME_VARS } from '../config/booking';
import { CONSENT_CHANGE_EVENT, hasConsent, readConsent, saveConsent } from './consent';

type CalFn = ((...args: unknown[]) => void) & {
  q?: unknown[];
  ns?: Record<string, CalFn>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

type State = 'blocked' | 'pending' | 'loading' | 'ready' | 'failed';

/** Gives up waiting for cal.com after this long and offers the direct alternatives. */
const LOAD_TIMEOUT_MS = 15000;

/* eslint-disable */
// Official cal.com embed snippet (calcom/cal.com, packages/embeds/embed-snippet), unchanged apart from the
// types. It defines window.Cal as a queue and appends embed.js on the first call.
function installCalSnippet(src: string): void {
  (function (C: any, A: string, L: string) {
    let p = function (a: any, ar: any) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, src, 'init');
}
/* eslint-enable */

const siteTheme = (): 'light' | 'dark' => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function setState(root: HTMLElement, state: State): void {
  root.dataset.state = state;
  // A half loaded iframe under the fallback must not stay in the focus order.
  const target = root.dataset.target ? document.getElementById(root.dataset.target) : null;
  if (target) target.inert = state === 'failed';
  if (state === 'pending' || state === 'blocked') return;
  const status = root.querySelector<HTMLElement>('[data-booking-status]');
  if (status) status.textContent = root.dataset[`status${state[0].toUpperCase()}${state.slice(1)}`] ?? '';
}

/** German names of the IANA regions for the timezone select; English uses the IANA names. */
const REGIONS_DE: Record<string, string> = {
  Africa: 'Afrika',
  America: 'Amerika',
  Antarctica: 'Antarktis',
  Arctic: 'Arktis',
  Asia: 'Asien',
  Atlantic: 'Atlantik',
  Australia: 'Australien',
  Europe: 'Europa',
  Indian: 'Indischer Ozean',
  Pacific: 'Pazifik',
};

/** Selected timezone per booking block; the device timezone until the visitor picks another. */
const timezones = new WeakMap<HTMLElement, string>();
const deviceTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';

/** Fills the timezone select (grouped by region, device zone preselected) and swaps out the static text. */
function setupTimezone(root: HTMLElement): void {
  timezones.set(root, deviceTimezone());
  const select = root.querySelector<HTMLSelectElement>('[data-timezone]');
  if (!select || typeof Intl.supportedValuesOf !== 'function') return;

  const german = document.documentElement.lang === 'de';
  const device = deviceTimezone();
  const zones = Intl.supportedValuesOf('timeZone');
  if (!zones.includes(device)) zones.push(device);
  const groups = new Map<string, HTMLOptGroupElement>();
  for (const zone of zones) {
    const [region, ...rest] = zone.split('/');
    const regionLabel = (german && REGIONS_DE[region]) || region;
    const place = rest.length > 0 ? rest.join(', ').replaceAll('_', ' ') : zone;
    let group = groups.get(regionLabel);
    if (!group) {
      group = document.createElement('optgroup');
      group.label = regionLabel;
      groups.set(regionLabel, group);
    }
    const label = zone === device ? `${place}, ${select.dataset.deviceLabel ?? ''}` : place;
    group.append(new Option(label, zone, false, zone === device));
  }
  select.replaceChildren(...groups.values());
  select.hidden = false;
  root.querySelector<HTMLElement>('[data-timezone-static]')?.setAttribute('hidden', '');

  select.addEventListener('change', () => {
    timezones.set(root, select.value);
    // A loaded calendar is rendered again in the new timezone; before that the choice simply waits.
    if (root.dataset.state === 'ready' || root.dataset.state === 'loading') render(root);
  });
}

/**
 * Outcome of a load. Ignored once the block is blocked again: a late cal.com event or timeout of a load
 * the visitor has since withdrawn must not replace the placeholder.
 */
function settle(root: HTMLElement, state: 'ready' | 'failed'): void {
  window.clearTimeout(Number(root.dataset.timeout));
  if (root.dataset.state === 'blocked') return;
  setState(root, state);
}

/** Installs the embed snippet for a block and wires its events, once. */
function mount(root: HTMLElement): void {
  const { calOrigin, calScript, namespace } = root.dataset;
  if (!calOrigin || !calScript || !namespace) return;

  installCalSnippet(calScript);
  const Cal = window.Cal!;
  Cal('init', namespace, { origin: calOrigin });
  const api = Cal.ns![namespace];

  api('on', {
    action: 'linkReady',
    callback: () => {
      // cal.com titles its iframe in English ("Book a call"); name it in the page language. Its content
      // follows the visitor's browser language: cal.com resolves the locale from a login or the
      // Accept-Language header only, not from the embed (source and test, November 2026). BookingEmbed
      // states this above the frame.
      const frame = root.querySelector<HTMLIFrameElement>('.booking-target iframe');
      if (frame && root.dataset.iframeTitle) frame.title = root.dataset.iframeTitle;
      settle(root, 'ready');
    },
  });
  const failed = () => settle(root, 'failed');
  api('on', { action: 'linkFailed', callback: failed });

  // embed.js blocked (content blocker, offline): no cal.com event will ever fire.
  document.querySelector<HTMLScriptElement>(`script[src="${calScript}"]`)?.addEventListener('error', failed);
  render(root);
}

/** Sends the site palette and theme to cal.com. */
function applyTheme(api: CalFn): void {
  const theme = siteTheme();
  api('ui', {
    theme,
    layout: 'month_view',
    // The event details stay hidden: the page around the calendar says what the appointment is for, and
    // the timezone select of the page replaces the one inside the details.
    hideEventTypeDetails: true,
    cssVarsPerTheme: CAL_THEME_VARS,
  });
}

/** Renders (or renders again, after a timezone change) the inline calendar into the reserved frame. */
function render(root: HTMLElement): void {
  // Not data-cal-link on the block: embed.js opens a cal.com modal for clicks inside any element with
  // that attribute.
  const { bookingLink: calLink, namespace, target } = root.dataset;
  const api = namespace ? window.Cal?.ns?.[namespace] : undefined;
  const container = target ? document.getElementById(target) : null;
  if (!calLink || !api || !container) return;

  // cal.com ignores a second inline call while its previous element is still in the page.
  container.replaceChildren();
  setState(root, 'loading');
  window.clearTimeout(Number(root.dataset.timeout));
  root.dataset.timeout = String(window.setTimeout(() => settle(root, 'failed'), LOAD_TIMEOUT_MS));

  api('inline', {
    elementOrSelector: `#${target}`,
    calLink,
    config: { layout: 'month_view', theme: siteTheme(), 'cal.tz': timezones.get(root) ?? deviceTimezone() },
  });
  applyTheme(api);
}

function init(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-booking]'));
  if (roots.length === 0) return;
  const mounted = new Set<HTMLElement>();
  const installed = new Set<HTMLElement>();
  const frameOf = (root: HTMLElement) => root.querySelector<HTMLElement>('.booking-frame') ?? root;

  const load = (root: HTMLElement) => {
    // Checked again here: an intersection entry queued before a withdrawal must not load cal.com.
    if (mounted.has(root) || !hasConsent('booking')) return;
    mounted.add(root);
    // After an in-place withdrawal the snippet and its event handlers already exist: render only.
    if (installed.has(root)) render(root);
    else {
      installed.add(root);
      mount(root);
    }
  };

  const observer =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              observer!.unobserve(entry.target);
              const root = entry.target.closest<HTMLElement>('[data-booking]');
              if (root) load(root);
            }
          },
          // Load only once the frame is in view; the skeleton holds the height until then, so no layout shift.
          { rootMargin: '0px' },
        )
      : null;

  const arm = (root: HTMLElement) => {
    if (mounted.has(root)) return;
    setState(root, 'pending');
    if (observer) observer.observe(frameOf(root));
    else load(root);
  };

  const block = (root: HTMLElement) => {
    observer?.unobserve(frameOf(root));
    setState(root, 'blocked');
  };

  // The inline script in BookingEmbed already painted the right state; this confirms it.
  roots.forEach((root) => {
    setupTimezone(root);
    if (hasConsent('booking')) arm(root);
    else block(root);

    // Consent inline, from the placeholder. The frame is in view, so the calendar loads at once; focus
    // moves to the frame, since the button it was on disappears.
    root.querySelector<HTMLElement>('[data-booking-consent]')?.addEventListener('click', () => {
      saveConsent({ booking: true });
      frameOf(root).focus({ preventScroll: true });
    });
  });

  // The theme toggle switches the loaded calendar too.
  new MutationObserver(() => {
    roots.forEach((root) => {
      const api = mounted.has(root) && root.dataset.namespace ? window.Cal?.ns?.[root.dataset.namespace] : undefined;
      if (api) applyTheme(api);
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener(CONSENT_CHANGE_EVENT, () => {
    if (hasConsent('booking')) {
      roots.forEach(arm);
      return;
    }
    // Withdrawn: a loaded embed (script, iframe, cal.com state in memory) only goes away fully with a
    // reload. If the withdrawal could not be stored, a reload would bring the old acceptance back, so the
    // iframe is removed in place instead.
    if (mounted.size > 0 && readConsent()?.categories.booking !== true) {
      window.location.reload();
      return;
    }
    roots.forEach((root) => {
      if (mounted.has(root)) {
        window.clearTimeout(Number(root.dataset.timeout));
        const target = root.dataset.target ? document.getElementById(root.dataset.target) : null;
        target?.replaceChildren();
        // embed.js may still be downloading: drop queued render commands, so it cannot draw the calendar
        // after the withdrawal. Event handlers ('on') stay for a renewed consent. In place, because once
        // loaded, embed.js empties the same array and replaces its push.
        const queue = root.dataset.namespace ? window.Cal?.ns?.[root.dataset.namespace]?.q : undefined;
        for (let i = (queue?.length ?? 0) - 1; i >= 0; i--) {
          if (['inline', 'ui'].includes(String((queue![i] as ArrayLike<unknown>)[0]))) queue!.splice(i, 1);
        }
        mounted.delete(root);
      }
      block(root);
    });
  });
}

init();
