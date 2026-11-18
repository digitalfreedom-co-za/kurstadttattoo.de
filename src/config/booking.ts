// Online booking via cal.com, configured in one place.
//
// CAL_LINK is a DEMO event (hidden in the cal.com account of the web developer) until Patrick Wolf has
// his own cal.com link for the studio. To switch, set PUBLIC_CAL_LINK at build time (repository variable
// of the deploy workflow, e.g. PUBLIC_CAL_LINK=kurstadttattoo/beratung). The demo notice above the
// calendar and the demo wording of the privacy policy follow CAL_IS_DEMO and disappear with the real link.
const DEMO_CAL_LINK = 'marcelrgberger/kurstadttattoo-demo';
export const CAL_LINK: string = import.meta.env.PUBLIC_CAL_LINK || DEMO_CAL_LINK;

/** True while the calendar is the demo event of the preview, not the studio's own one. */
export const CAL_IS_DEMO = CAL_LINK === DEMO_CAL_LINK;

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
    'cal-brand': '#a3157c',
    'cal-brand-emphasis': '#121113',
    'cal-brand-text': '#ffffff',
    'cal-text': '#2b292e',
    'cal-text-emphasis': '#121113',
    'cal-text-subtle': '#56535b',
    'cal-text-muted': '#56535b',
    'cal-bg': '#f5f4f1',
    'cal-bg-emphasis': '#eae8e3',
    'cal-bg-subtle': '#eae8e3',
    'cal-bg-muted': '#eae8e3',
    'cal-border': '#cfcbc3',
    'cal-border-subtle': '#cfcbc3',
    'cal-border-emphasis': '#121113',
    'cal-border-booker': '#121113',
    'cal-border-booker-width': '0px',
    radius: '2px',
  },
  dark: {
    'cal-brand': '#f472d0',
    'cal-brand-emphasis': '#f1efeb',
    'cal-brand-text': '#0f0e10',
    'cal-text': '#dcd9d4',
    'cal-text-emphasis': '#f1efeb',
    'cal-text-subtle': '#aaa6ae',
    'cal-text-muted': '#aaa6ae',
    'cal-bg': '#0f0e10',
    'cal-bg-emphasis': '#1a181c',
    'cal-bg-subtle': '#1a181c',
    'cal-bg-muted': '#1a181c',
    'cal-border': '#36333a',
    'cal-border-subtle': '#36333a',
    'cal-border-emphasis': '#f1efeb',
    'cal-border-booker': '#f1efeb',
    'cal-border-booker-width': '0px',
    radius: '2px',
  },
};
