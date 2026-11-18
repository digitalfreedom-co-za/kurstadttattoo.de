// Online booking via cal.com, configured in one place.
//
// CAL_LINK is a DEMO event (hidden in the cal.com account of the web developer) until Patrick Wolf has
// his own cal.com link for the studio. To switch, set PUBLIC_CAL_LINK at build time (repository variable
// of the deploy workflow, e.g. PUBLIC_CAL_LINK=kurstadttattoo/beratung). The demo notice above the
// calendar and the demo wording of the privacy policy follow CAL_IS_DEMO and disappear with the real link.
//
// The demo calendar books nothing at the studio, so no public page embeds it: without the studio's link
// the site has no calendar at all (CAL_ENABLED false), and the privacy policy and the consent dialog say
// so. Only a test build with PUBLIC_CAL_DEMO=true shows the demo calendar, labelled as a test, on the
// booking page. The deploy workflow never sets it.
const DEMO_CAL_LINK = 'marcelrgberger/kurstadttattoo-demo';
export const CAL_LINK: string = import.meta.env.PUBLIC_CAL_LINK || DEMO_CAL_LINK;

/** True while the calendar is the demo event of the preview, not the studio's own one. */
export const CAL_IS_DEMO = CAL_LINK === DEMO_CAL_LINK;

/** True when this build embeds a calendar: the studio's own one, or the demo in an explicit test build. */
export const CAL_ENABLED = !CAL_IS_DEMO || import.meta.env.PUBLIC_CAL_DEMO === 'true';

/**
 * Label of every booking call to action. While the demo calendar is configured nothing can be booked
 * online, so the actions ask for a request (by phone) instead of promising a booking.
 */
export function bookingLabel(copy: { label: string; requestLabel: string }): string {
  return CAL_IS_DEMO ? copy.requestLabel : copy.label;
}

/** Holder of the demo cal.com account, named in the privacy policy while CAL_IS_DEMO. */
export const CAL_DEMO_ACCOUNT_HOLDER = 'Marcel R. G. Berger';

/** Origin of the hosted cal.com app and its official embed loader. */
export const CAL_ORIGIN = 'https://app.cal.com';
export const CAL_EMBED_SCRIPT = `${CAL_ORIGIN}/embed/embed.js`;

/** Public booking page, the target for visitors without JavaScript. */
export const CAL_PUBLIC_URL = `https://cal.com/${CAL_LINK}`;

/** Anchor of the calendar section on the booking page, the same in both locales. */
export const BOOKING_ANCHOR = 'kalender';

/** Anchor of the cal.com section in the privacy policy (rendered there by BookingPrivacy). */
export const BOOKING_PRIVACY_ANCHOR = 'terminbuchung';

/**
 * cal.com theme in the site palette (mirrors the tokens in src/styles/global.css), passed to Cal('ui').
 * Keys are the documented embed CSS variables without the leading dashes. The calendar follows the
 * site theme: light by default, dark after the visitor's explicit toggle.
 */
export const CAL_THEME_VARS: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    'cal-brand': '#7a5a1e',
    'cal-brand-emphasis': '#120d08',
    'cal-brand-text': '#f7f3ea',
    'cal-text': '#2a2219',
    'cal-text-emphasis': '#120d08',
    'cal-text-subtle': '#5c5246',
    'cal-text-muted': '#5c5246',
    'cal-bg': '#f7f3ea',
    'cal-bg-emphasis': '#ede5d3',
    'cal-bg-subtle': '#ede5d3',
    'cal-bg-muted': '#ede5d3',
    'cal-border': '#cdc1a8',
    'cal-border-subtle': '#cdc1a8',
    'cal-border-emphasis': '#120d08',
    'cal-border-booker': '#120d08',
    'cal-border-booker-width': '0px',
    radius: '2px',
  },
  dark: {
    'cal-brand': '#e5bd63',
    'cal-brand-emphasis': '#f8f4e8',
    'cal-brand-text': '#0b0703',
    'cal-text': '#e6dece',
    'cal-text-emphasis': '#f8f4e8',
    'cal-text-subtle': '#b3a892',
    'cal-text-muted': '#b3a892',
    'cal-bg': '#0b0703',
    'cal-bg-emphasis': '#18120a',
    'cal-bg-subtle': '#18120a',
    'cal-bg-muted': '#18120a',
    'cal-border': '#3b3022',
    'cal-border-subtle': '#3b3022',
    'cal-border-emphasis': '#f8f4e8',
    'cal-border-booker': '#f8f4e8',
    'cal-border-booker-width': '0px',
    radius: '2px',
  },
};
