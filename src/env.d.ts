interface ImportMetaEnv {
  /** 'true' makes all pages indexable (launch on the real domain). Default: noindex preview. */
  readonly PUBLIC_INDEXABLE?: string;
  /** cal.com link of the studio (user/event). Unset: the hidden demo event (src/config/booking.ts). */
  readonly PUBLIC_CAL_LINK?: string;
  /** 'true' shows the demo calendar on the booking page of a test build. Never set for deploys. */
  readonly PUBLIC_CAL_DEMO?: string;
  /** GA4 measurement ID (G-...). Unset: no analytics at all (src/config/analytics.ts). */
  readonly PUBLIC_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
