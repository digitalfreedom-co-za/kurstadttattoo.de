# Design review: fix status

Status of every finding in the four reports after the fix round on branch `ticket/11` (12 November 2026, remaining scope updated 18 November 2026). Fixed means implemented in DE and EN and checked in the local build; open means the fix needs facts or a decision from the studio, which the site does not invent. Fix tickets: #43 UI, #44 UX, #45 mobile, #46 accessibility.

Checks of this round: `npm run check` (0 errors, 0 warnings), `npm run build` (25 pages), and a Chromium run against `astro preview` at 320, 375, 768 and 1280 px:

- No horizontal overflow on home, gallery, artists, hygiene, consultation, aftercare, contact, booking, engraving, privacy, 404 and the English home at 320, 375 and 1280 px.
- The consent dialog no longer opens by itself on first visit (DE and EN appointment pages).
- Layout shift when loading the calendar (non-input entries): 375 px 0.539 before, 0.006 after; 768 px 0.001; 1280 px 0.
- The calendar iframe carries the localized title on both pages.
- Lightbox at 375 px with touch: one status per change (position, motif, style and placement); a diagonal drag does not change the work, a horizontal swipe does; a failed image shows the retry and the direct link and is announced.

Re-review: an independent Codex review of the full diff reported two points (failure not announced in the lightbox; the selected work not carried into the request). The first is fixed, the second is recorded as open under UX 12.

Not tested: physical iOS and Android devices, VoiceOver and NVDA speech, Safari and Firefox, a booking submission (none was made).

## Scope of PR #47 and closing conditions of #11

Scope note of 18 November 2026 on #11: PR #47 delivers the four review files and the fixes listed as fixed below. Every remaining finding is implemented in its fix ticket, not in this PR. The PR is accepted when the review files are committed, #43 to #46 list the exact remaining scope and the PR builds and deploys. #11 is closed after #43 to #46.

On 18 November 2026 the branch was brought up to date with `main` (merge, no conflicts); `npm run check` (0 errors, 0 warnings, 0 hints) and `npm run build` (25 pages) pass.

Deployment acceptance is still open. `.github/workflows/deploy.yml` deploys on a push to `main` (or a manual dispatch), not on a pull request, as `websites.md` prescribes, so the PR state can only be deployed after the merge. On 18 November 2026 the PR checks (CodeQL, commit messages) passed and the last deploy run on `main` (run 44321306990, #48) succeeded. After the merge, the successful run of the "Deploy to GitHub Pages" workflow for the merge commit is posted on #11 as the acceptance evidence.

## Remaining scope per fix ticket

The same lists are posted as comments on the fix tickets.

| Ticket | Remaining after PR #47 |
| --- | --- |
| #43 UI | 7: replacement photos from owner originals (capture brief). 2: only if Marcello grants an exception to wiki content rule 2, shorter h2 headings. Definition of done check: screenshots at 375 and 1280, light and dark, for the listed pages after the merge |
| #44 UX | 1 done in #44. Owner facts: 3 (email channel), 4 (hygiene procedures), 5 (price wording), 6 (consultation format, duration, fee), 10 (consultation languages), 11 (style classification), 12 (selected work carried into the request, after 3), 13 (artist story), 14 (arrival details), 15 (review profile), 16 (engraving decision by Marcello). Verify 8 and 18 after the merge |
| #45 mobile | 2 done in #45 within the wiki rule; 6 completed in #45 (caption and counter wait for the picture). 3, 4: not implemented, the wiki header rule (36 px icon-only below 640 px) applies unless Marcello grants an exception. Verification: physical iOS and Android swipe check, rotation on a real device |
| #46 a11y | 3: recheck the calendar reservation and CLS with the studio's real calendar. 4: cal.com offers no locale control, the notice above the frame stays until it does. axe, Lighthouse and Firefox keyboard scrolling done (see Verification of #46). Still manual: VoiceOver or NVDA for 1, 6, 7, 8; real Safari keyboard scrolling for 1 |

## Wiki conflicts

| Finding | Wiki rule | Outcome |
| --- | --- | --- |
| Mobile 2, 3, 4; UX 9 | `websites.md`, Header: 36 × 36 px icon-only controls below 640 px | 2 fixed within the rule (36 px icons, 44 px hit areas); 3, 4 and UX 9 not implemented, the header keeps the wiki pattern |
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
| 1 | Fixed (#44) | While the demo calendar is configured every booking action reads `Termin anfragen` / `Request appointment` and the booking page leads with phone and email. No public page embeds the demo calendar: it appears only in a test build with `PUBLIC_CAL_DEMO=true`. Without a calendar the privacy policy and the cookie settings state that no service needs consent |
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
| 2 | Fixed (#45) | Icons stay 36 px (wiki), each with a 44 px hit area and 8 px gaps, so the areas touch but never overlap. While the menu button shows (below 1024 px or enlarged text), the theme switch moves into the menu with its label; this also removes the 67 to 79 px row overflow at 640 px |
| 3, 4 | Open, needs a decision | Not implemented: the wiki header rule (36 px icon-only below 640 px) forbids a visible `Termin` / `Book` label and a visible `EN` / `DE`. Done only after Marcello grants a wiki exception or removes 3 and 4 from #45; PR #56 therefore does not close #45 |
| 5 | Fixed | Swipe only on the image stage, one primary pointer, clearly horizontal, cancel resets, controls excluded, `touch-action: pan-y pinch-zoom` |
| 6 | Fixed | Loading note; picture, caption and counter appear together only once the picture has loaded (hidden they keep their space); retry and direct link on error |
| 7 | Fixed | Expand badge always visible without hover |
| 8 | Fixed | Style links wrap; link back to the styles after each group |
| 9 | Fixed | Home preview one column below 360 px |
| 10 | Fixed | Open menu repositions on header or viewport resize |
| 11 | Fixed | Lightbox side padding includes the safe area insets |
| 12 | Fixed | Rule 320 ms, image 450 to 500 ms; on touch screens a plain fade and no parallax |
| 13 | Fixed | See UI 1 |
| 14 | Fixed | See a11y 1 |

Checks of the #45 fix round (18 November 2026), Playwright engines Chromium, Firefox and WebKit against `astro preview`, DE and EN:

- Lightbox at 375 px with image requests held back 1.2 s: while loading, picture, caption and counter are hidden and the loading note shows; after loading all three appear together; a failed request keeps them hidden and shows the retry and the direct link; the retry brings all three back. The stage height stays the same (551 px) in every state.
- Menu open during a simulated rotation on the home page: 375 x 812, 812 x 375, back to 375 x 812, then 1023 x 600 and 320 x 568. The panel top equals the header bottom in every step (113 / 101 px), no horizontal overflow.
- WebKit is the engine of Safari, but a desktop engine build is not iOS Safari. Not done, because no device is available to this run: physical iOS Safari and Android Chrome swipe check and rotation on a real device. These stay open for a manual check.

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

### Verification of #46 (18 November 2026, main at 168bb6b)

Run with Playwright, axe-core and Lighthouse from `/tmp` against `astro preview` and, for Lighthouse, also against the deployed github.io build of the same commit. No code change was needed.

- axe WCAG 2.2 A/AA: 0 violations on all 25 pages at 375 and 1280 px, light and dark. Also clean with the mobile menu open (375), the lightbox open and the cookie settings open (375 and 1280, light and dark, DE and EN).
- Lighthouse mobile, deployed build: home DE 99, home EN 99 to 100, gallery DE and EN 100; accessibility 100; CLS 0. Against the uncompressed local preview the home pages score 96, the baseline commit 28aabd6 scores the same there (DE 96), so the local number is not a regression. The gallery showed one run of 66 on the deployed build; four reruns gave 100 each.
- Finding 1: below 640 px the storage entries are a named list of term and definition pairs; from 640 px a named region (`Einträge im Speicher Ihres Browsers` / `Entries in your browser storage`) holds the table with caption and header cells. The region is reached with Tab and shows a 2 px outline in Chromium, Firefox and WebKit; arrow keys scroll it at 700 px in Chromium and Firefox. In WebKit under Playwright arrow keys scroll no focused region, not even a minimal test page, so real Safari remains a manual check. No horizontal page overflow at 640 to 1024 px since #45.
- Finding 6: one status per change, e.g. `Bild 2 von 7: Schachkönig. Black and Grey, Unterarm` / `Image 2 of 7: Chess king. Black and grey, forearm`; focus stays on the next button.
- Finding 7: outline on both hygiene pages is h2 `Was gehört nach dem Termin zur Hygiene?`, then h3 `Wann Sie zum Arzt gehen` (EN: `When to see a doctor`).
- Finding 8: the settings dialog is named by its title, has no `aria-describedby`, and the title takes focus.
- Finding 3 stays open: no `PUBLIC_CAL_LINK` repository variable is set, so the studio's own calendar does not exist yet and its reservation cannot be measured.
- Finding 4 stays as is: cal.com main (ae027bb70, 13 November 2026) still takes the language only from a login or `Accept-Language` (`getLocale.ts`, last changed February 2026), and `embed.ts` has no locale option.
- Not done: VoiceOver or NVDA speech (the checks above use the browser accessibility tree), real Safari.
