# Design review: fix status

Status of every finding in the four reports after the fix round on branch `ticket/11` (12 November 2026). Fixed means implemented in DE and EN and checked in the local build; open means the fix needs facts or a decision from the studio, which the site does not invent. Fix tickets: #43 UI, #44 UX, #45 mobile, #46 accessibility.

Checks of this round: `npm run check` (0 errors, 0 warnings), `npm run build` (25 pages), and a Chromium run against `astro preview` at 320, 375, 768 and 1280 px:

- No horizontal overflow on home, gallery, artists, hygiene, consultation, aftercare, contact, booking, engraving, privacy, 404 and the English home at 320, 375 and 1280 px.
- The consent dialog no longer opens by itself on first visit (DE and EN appointment pages).
- Layout shift when loading the calendar (non-input entries): 375 px 0.539 before, 0.006 after; 768 px 0.001; 1280 px 0.
- The calendar iframe carries the localized title on both pages.
- Lightbox at 375 px with touch: one status per change (position, motif, style and placement); a diagonal drag does not change the work, a horizontal swipe does; a failed image shows the retry and the direct link and is announced.

Re-review: an independent Codex review of the full diff reported two points (failure not announced in the lightbox; the selected work not carried into the request). The first is fixed, the second is recorded as open under UX 12.

Not tested: physical iOS and Android devices, VoiceOver and NVDA speech, Safari and Firefox, a booking submission (none was made).

## Closing conditions of #11

#11 is not done with this branch. Still open on 12 November 2026:

- Acceptance of the technical fixes by the team lead; the fix tickets #43, #44, #45 and #46 are open until then.
- Merge of PR #47 to `main` and a successful run of `.github/workflows/deploy.yml` for that merge, linked in #11.
- Only then #11 is closed. The open studio facts below are not part of this condition.

## Wiki conflicts

| Finding | Wiki rule | Outcome |
| --- | --- | --- |
| Mobile 2, 3, 4; UX 9 | `websites.md`, Header: 36 × 36 px icon-only controls below 640 px | Not implemented, the header keeps the wiki pattern |
| UI 2 (section headings) | `websites.md`, content rule 2: question-shaped headings | The h2 questions stay; the h1 headings are shortened |

## UI and visual design (`ui.md`)

| # | Status | What changed |
| --- | --- | --- |
| 1 | Fixed | Home hero on phones: heading, intro, work, then actions; address and hours only in the location section; works before the style descriptions; trust strip items link to hygiene, consultation, aftercare, contact |
| 2 | Fixed within the wiki rule | Shorter h1 headings, location in the eyebrow; h2 questions kept (wiki) |
| 3 | Fixed | Basin rule only on chapter sections; support sections open with a thin line; gallery styles as compact groups on one surface |
| 4 | Fixed | Per-work framing in `src/data/gallery.ts`: whole photo (contain) for the wide and long compositions, chosen from the source proportions; lightbox unchanged |
| 5 | Fixed | Home preview with two lead works (portrait, fine line) spanning two columns, then one row of four; three-work groups as a row of three |
| 6 | Fixed | `.caption` style (13 px, sentence case) for work metadata and photo captions |
| 7 | Partly, rest open | Lead works chosen from photos without large overlaid branding; replacement photos need owner-supplied originals |
| 8 | Fixed | Artist page shows a portrait tattoo and a fine line piece linked to their gallery groups; second portrait smaller |
| 9 | Fixed | Hygiene leads with the work photo, standards condensed beside it; consultation pairs the planning with a finished tattoo captioned as an example; aftercare instructions first, portrait small further down |
| 10 | Fixed | See UX 2 |
| 11 | Fixed | See UX 1 |
| 12 | Fixed | Closing action per page: phone with visible call label on hygiene, aftercare, FAQ, engraving, contact, booking; booking elsewhere |
| 13 | Fixed | Footer: pages in two columns, hours grouped with address and contact, thin line instead of a second basin rule, shorter gap |
| 14 | Fixed | Related links 2 × 2 or one row of three; five-item lists with the last item spanning; engraving examples as a row of three |
| 15 | Fixed | See a11y 2 |
| 16 | Fixed | See a11y 1 |
| 17 | Fixed | `Patricks Weg zum Tätowieren`, `Begonnene Tattoos fertigstellen` |
| 18 | Fixed | Offset rectangles removed (home, artists) |
| 19 | Fixed | 404 on the shared container, type scale and buttons |

## UX and conversion (`ux.md`)

| # | Status | What changed |
| --- | --- | --- |
| 1 | Fixed | While the demo calendar is configured every booking action reads `Termin anfragen` / `Request appointment`; the booking page leads with phone and email; the demo calendar sits last, closed, labelled as a test; the external cal.com link is gone in demo mode |
| 2 | Fixed | The consent dialog opens by itself only once statistics are configured; until then consent is asked at the calendar placeholder; privacy policy text updated |
| 3 | Fixed, confirmation open | One channel everywhere: appointment requests by phone, other questions by email (old contact page). Open: Patrick confirms whether email requests are welcome |
| 4 | Partly, rest open | Home hygiene section links to the hygiene page. Open: Patrick's actual procedures |
| 5 | Open | Written price explanation needs Patrick |
| 6 | Partly, rest open | EN `Pick an available time.` Open: format, duration, fee and next step of the consultation |
| 7 | Fixed | Every hours surface leads with `Bis zur Neueröffnung am 1. Dezember 2026 geschlossen.` |
| 8 | Fixed | See UI 1 |
| 9 | Superseded | Wiki header rule |
| 10 | Partly, rest open | EN pages show `+49 173 160 51 62`. Open: consultation languages |
| 11 | Open | Classification needs Patrick |
| 12 | Partly, rest open | Each gallery group ends with `Eine Idee in diesem Stil besprechen` and a link back to the styles; the lightbox offers a request; note that works are inspiration. Open: carrying the selected work into the request waits for the confirmed request channel (UX 3) |
| 13 | Open | Approved story needed |
| 14 | Open | Verified arrival details needed |
| 15 | Open | Verified review profile needed |
| 16 | Open | Marcello decides about engraving |
| 17 | Fixed | Aftercare closes with the phone; `jederzeit` removed |
| 18 | Fixed | See UI 17 |

## Mobile, interaction and motion (`mobile.md`)

| # | Status | What changed |
| --- | --- | --- |
| 1 | Fixed | See UX 2 |
| 2, 3, 4 | Superseded | Wiki header rule |
| 5 | Fixed | Swipe only on the image stage, one primary pointer, clearly horizontal, cancel resets, controls excluded, `touch-action: pan-y pinch-zoom` |
| 6 | Fixed | Loading note, picture shown only once loaded, retry and direct link on error |
| 7 | Fixed | Expand badge always visible without hover |
| 8 | Fixed | Style links wrap; link back to the styles after each group |
| 9 | Fixed | Home preview one column below 360 px |
| 10 | Fixed | Open menu repositions on header or viewport resize |
| 11 | Fixed | Lightbox side padding includes the safe area insets |
| 12 | Fixed | Rule 320 ms, image 450 to 500 ms; on touch screens a plain fade and no parallax |
| 13 | Fixed | See UI 1 |
| 14 | Fixed | See a11y 1 |

## Accessibility and performance (`a11y.md`)

| # | Status | What changed |
| --- | --- | --- |
| 1 | Fixed | Below 640 px labelled blocks; from 640 px a focusable named region with caption and a visible scroll hint |
| 2 | Fixed | Hover and focus colours follow the surface tone (`neon-glow` on night) |
| 3 | Fixed | Reservation re-measured on this site's embed: 106 px + 0.831 × frame width below 770 px, 572 px above |
| 4 | Fixed within cal.com | Iframe title localized. cal.com sets the calendar language from a cal.com login or the browser `Accept-Language` header only (source `packages/features/auth/lib/getLocale.ts`; no effect of `lang`, `locale`, `lng` or an `/en/` path in the test), so the page cannot set it. Both pages now state the calendar language above the frame, visible before anything loads |
| 5 | Fixed | Hero candidates 360, 512, 720, 960 with `sizes` from the real column width |
| 6 | Fixed | One atomic status with position, motif and style; counter hidden from assistive tech |
| 7 | Fixed | Warning title is an h3 |
| 8 | Fixed | Settings view has no dialog description; switches keep theirs |
