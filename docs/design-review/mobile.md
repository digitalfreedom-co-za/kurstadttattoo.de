# Mobile, Responsive and Interaction Design Review

**Overall verdict: 7/10.** The site has a coherent studio identity, readable stacked content, generous primary buttons and a credible art, hygiene and consultation hierarchy. The main mobile weaknesses are premature consent interruption, an ambiguous sticky booking action, and incomplete touch handling in the lightbox. No blocker was established by this review.

Reviewed on 12 November 2026 for [ticket #11](https://github.com/digitalfreedom-co-za/kurstadttattoo.de/issues/11), as Tester. Source baseline: `main`, `28aabd6`. Product code was not changed.

Evidence: curl GET checks passed for all 24 public DE/EN pages, each returning HTTP 200 and the expected HTML language. All 48 supplied full-page screenshots in `/tmp/kt-shots/` were inspected: home, gallery, artists, hygiene, consultation, aftercare, FAQ, contact, appointment, engraving, imprint and privacy in both languages at 375 and 1280 px. Responsive rules were reviewed for the 320 to 1440 px range, including 360, 640, 768, 1024 and 1280 px transitions. The 404 source was also read; no 404 capture was supplied.

This is a screenshot and source review, not a physical-device or browser-interaction test. Layouts at 320, intermediate widths and 1440 px, swipe behavior, rotation and animation timing have not been runtime-verified. Findings below distinguish source-derived issues from visual observations. Fixed headers appearing midway through full-page captures are capture artifacts and are not findings. The captures include the open consent dialog, limiting inspection of the content underneath it.

Positive source checks: the header already sticks; desktop navigation has an overflow fallback; language switching preserves mapped anchors; FAQ summaries and most links have generous targets; lightbox buttons are 44 px; reduced-motion CSS suppresses transitions, reveals and smooth scrolling, and the script stops parallax when the preference changes. Keep these behaviors.

## Findings

1. **Major | Site-wide first-visit consent interrupts browsing before booking is relevant.**  
   **Location:** `src/components/layout/ConsentDialog.astro:45`, `:285`, `:344`; `src/components/booking/BookingEmbed.astro:98`.  
   **Evidence:** Screenshots and source. The calendar consent sheet automatically opens as a modal on every non-legal page without a stored choice. At 375 px it consumes a substantial part of the visible page and makes the art, navigation and consultation content behind it unavailable. The site already has an inline, consent-gated calendar placeholder.  
   **Why it matters:** Someone opening a tattoo photograph or reading aftercare must first make an unrelated third-party booking decision. This competes directly with the requested art-first experience.  
   **Fix:** While booking is the only optional service, request permission at the calendar placeholder when the visitor chooses to load it. Retain footer settings and the ability to decline or withdraw. If analytics is enabled later, handle its consent separately without prematurely loading either service.

2. **Minor, superseded by the wiki rule | Mobile header controls are smaller than the site's other touch controls.**  
   **Wiki alignment:** the binding header rule in [wiki `websites.md`, Header](https://github.com/digitalfreedom-co-za/wiki/blob/main/websites.md) requires every header control to be a 36 × 36 px icon-only button below 640 px, with `aria-label` and `title` from the same i18n key. The 44 px recommendation below conflicts with it and is not implemented; no exception has been decided. The header keeps the wiki pattern.  
   **Location:** `src/components/layout/Header.astro:58`, `:64`, `:75`; `src/components/layout/LanguageSwitch.astro:29`; `src/components/layout/ThemeToggle.astro:16`.  
   **Evidence:** Source: below 640 px all four controls are 36 by 36 px, separated by only 4 px. The lightbox and general buttons use at least 44 px.  
   **Why it matters:** The most frequently repeated navigation controls require more precise thumb placement, especially when walking or holding the phone in one hand. This is a usability target, not a claim that 36 px alone violates an accessibility criterion.  
   **Fix:** Use non-overlapping hit areas of at least 44 by 44 px. Rebalance the wordmark and move the theme control into the menu if necessary. Check the entire row at 320, 360, 375 and 640 px, including enlarged text; do not simply increase widths and create overflow.

3. **Major, superseded by the wiki rule | The sticky mobile booking CTA loses its visible meaning.**  
   **Wiki alignment:** a visible `Termin` / `Book` label below 640 px is what the wiki header rule excludes (icon-only below `sm`; the row must not break at 360 to 414 px). Not implemented; the accessible name and title stay. Visible booking actions remain in the hero, the closing band and the page actions.  
   **Location:** `src/components/layout/Header.astro:61` and `:69`.  
   **Evidence:** Screenshots and source. The persistent action becomes only a calendar icon below 640 px. Its accessible label exists, but sighted touch users cannot rely on a hover title to understand it.  
   **Why it matters:** Once the introductory buttons scroll away, the only persistent booking action can be mistaken for opening hours or an events calendar.  
   **Fix:** Preserve a short visible label such as `Termin` / `Book` beside the icon in the sticky header. Reallocate the theme control or wordmark space together with finding 2. Keep one persistent CTA; a second bottom bar is unnecessary if the header action is clear and reachable.

4. **Minor, superseded by the wiki rule | The mobile language switch does not reveal its destination.**  
   **Wiki alignment:** an `EN` / `DE` text inside the 36 px control is a text label, which the wiki header rule excludes below 640 px. Not implemented; the switch keeps its localized `aria-label` and `title` naming the target language.  
   **Location:** `src/components/layout/LanguageSwitch.astro:31` and `:46`.  
   **Evidence:** Screenshots and source. Mobile visitors see a globe, but tapping it immediately navigates to the other language. The destination label is hidden.  
   **Why it matters:** A globe commonly suggests a language picker; an immediate page change is less predictable, particularly on long pages.  
   **Fix:** Display the target language abbreviation, `EN` or `DE`, within the enlarged touch target. Keep the full accessible name, same-page routing and translated anchor mapping. Do not introduce automatic language redirects.

5. **Major | Lightbox swipe recognition does not distinguish navigation from other gestures.**  
   **Location:** `src/components/ui/Gallery.astro:221`.  
   **Evidence:** Source-derived. The handler stores only the horizontal start coordinate for any non-mouse pointer anywhere in the dialog. It has no vertical-direction check, pointer identity, multi-touch guard or cancellation cleanup. There is no gesture-specific touch-action rule.  
   **Why it matters:** A diagonal drag or multi-finger interaction can be interpreted as changing the artwork, while browser gesture cancellation can make intended swipes unreliable. Controls and captions also participate in swipe detection.  
   **Fix:** Limit recognition to the image stage. Track a single primary pointer and both coordinates; navigate only for a clearly horizontal gesture. Reset on pointer cancellation and additional touches, exclude buttons, and preserve pinch zoom. Define touch behavior deliberately, for example allowing vertical panning and pinch zoom while handling horizontal swipes. Verify on iOS Safari and Android Chrome before closing the fix.

6. **Minor | Lightbox image loading has no visible progress or useful recovery.**  
   **Location:** `src/components/ui/Gallery.astro:185`, `:198`.  
   **Evidence:** Source-derived. Changing the image sets its opacity to zero immediately, but the new caption and counter appear at once. A slow request leaves an unexplained empty stage. Failure merely restores opacity and exposes the broken image/alt text.  
   **Why it matters:** On mobile connections, a successful tap can look like a failed interaction, encouraging repeated swipes.  
   **Fix:** Add a localized loading status, preserve the stage dimensions, and provide an explicit retry plus an original-image link on error. Only reveal the current requested image after it loads. Keep feedback static under reduced motion.

7. **Minor | Touch users lack a persistent cue that gallery thumbnails expand.**  
   **Location:** `src/components/ui/Gallery.astro:96`.  
   **Evidence:** Screenshots and source. The expand badge is initially transparent and appears only on hover or focus. The gallery page provides introductory guidance, but home previews and engraving examples rely mainly on the pictures themselves.  
   **Why it matters:** Small crops are easy to interpret as non-interactive illustrations, so visitors may never inspect the tattoo detail.  
   **Fix:** Keep the existing expand badge visible for `(hover: none)` or `(pointer: coarse)`. Retain the whole image as the target, rather than making the badge a separate tiny button.

8. **Minor | Gallery category navigation hides options without a strong scroll cue.**  
   **Location:** `src/components/pages/GalleryPage.astro:27` and `:29`.  
   **Evidence:** Screenshots and source. Five non-wrapping style links sit in a horizontally scrolling row with its scrollbar explicitly hidden. Only part of the category set is visible on a phone. The row also scrolls away before the long image groups.  
   **Why it matters:** Later categories are less discoverable, and switching styles after browsing requires a long return scroll.  
   **Fix:** Use a wrapping set of category links on narrow screens so every style is visible. Add a compact localized return-to-styles link after each group. Keep work counts distinct from sequence numbers and retain the existing anchor destinations.

9. **Minor | The home gallery is unusually dense at the smallest supported width.**  
   **Location:** `src/components/ui/Gallery.astro:30` and `:103`.  
   **Evidence:** Source-derived at 320 px, with the caption density visible at 375 px. The full gallery uses one column below 360 px, but the home preview always uses two. At 320 px, after gutters and the column gap, each preview is approximately 136 px wide. Uppercase metadata must wrap within that width.  
   **Why it matters:** Fine tattoo detail becomes difficult to judge and captions fragment into narrow blocks at precisely the width where space is most limited.  
   **Fix:** Give the preview the same one-column rule below 360 px, or establish an equivalent minimum tile width. Keep two columns at 375 px and four only when the tiles have adequate space.

10. **Minor | An open mobile menu does not update its top edge after rotation or header resizing.**  
    **Location:** `src/components/layout/Header.astro:240` and `:288`.  
    **Evidence:** Source-derived. The panel's inline top position is measured only when opening. The resize observer recalculates compact mode but does not update that position while the menu remains open.  
    **Why it matters:** Rotation, changed text size or a change in reopening-strip wrapping can move the header bottom, leaving the panel overlapping the header or separated by an exposed gap.  
    **Fix:** Share a panel-position function between opening and resize handling. While open, recompute from the real header bottom when viewport dimensions or relevant header/strip geometry changes. Check portrait-to-landscape changes that remain below 1024 px.

11. **Minor | The lightbox omits horizontal safe-area protection.**  
    **Location:** `src/components/ui/Gallery.astro:111`, `:113`, `:125`, `:129`.  
    **Evidence:** Source-derived. The page enables `viewport-fit=cover`. The shared Container protects left/right safe areas, but the full-screen lightbox uses fixed horizontal padding and only handles top/bottom insets.  
    **Why it matters:** On a notched phone in landscape, the counter, side navigation or close control can sit too close to or underneath the display cutout.  
    **Fix:** Apply the same max-of-gutter-and-safe-area calculation to the lightbox header, image stage and navigation controls, including the absolutely positioned desktop-style controls at 768 px. Verify both landscape orientations.

12. **Polish | Image reveals and decorative rule animations take too long for mobile scrolling.**  
    **Location:** `src/styles/global.css:237`, `:251`, `:259`; `src/scripts/motion.ts:48`.  
    **Evidence:** Source timing, not a recorded animation test. Rules and image clipping run for 1100 ms; image translation runs for 1500 ms. Reveals begin only after the observer's inset and threshold are reached.  
    **Why it matters:** Art can remain partially concealed during a normal scroll pause, and repeated long transitions compete with looking at the work.  
    **Fix:** Shorten image reveals to roughly 350–500 ms and rule draws to 250–350 ms. Prefer a simple fade on narrow/coarse-pointer devices and remove mobile parallax. Preserve the existing reduced-motion safeguards, including preference changes while the page is open. Validate by scrolling at normal reading speed, not only by waiting for the final state.

13. **Minor | Home-page mobile ordering postpones the first artwork behind practical details.**  
    **Location:** `src/components/home/HomePage.astro:52`, `:62`, `:84`.  
    **Evidence:** The 375 px DE/EN captures and source order. The first column contains the heading, introduction, two actions, address and hours; only then does the hero artwork appear. Desktop places the artwork alongside these details.  
    **Why it matters:** The mobile first impression is primarily text and logistics despite the site's art-first brief.  
    **Fix:** On narrow screens place the hero artwork after the introduction and primary actions, ahead of the full address/hours block. Keep the short reopening notice visible. Use a deliberate mobile composition while preserving a sensible reading order.

14. **Minor | The privacy storage table hides several columns on phones without explaining how to reach them.**  
    **Location:** `src/components/pages/PrivacyPage.astro:116`; `src/components/legal/LegalProse.astro:34`.  
    **Evidence:** Screenshots and source. Five columns each have a minimum width of 9 rem, inside a horizontal overflow wrapper. At 375 px the visitor sees only the leading part of the table; there is no visible scrolling instruction.  
    **Why it matters:** Storage purpose, duration and consent information are difficult to compare and may appear absent.  
    **Fix:** For this three-entry table, render a labeled stacked layout below 640 px using the same data and complete field names. Keep the table at wider widths. If horizontal scrolling is retained instead, add a visible localized cue and a clear overflow affordance.

## Top 5 quick wins

1. Remove automatic booking-consent interruption from ordinary browsing pages; retain contextual permission at the calendar.
2. (Superseded by the wiki header rule, see findings 2 and 3.)
3. (Superseded by the wiki header rule, see finding 4.)
4. Keep gallery expand badges visible on touch devices.
5. Shorten the image/rule reveals and remove parallax on narrow touch screens.
