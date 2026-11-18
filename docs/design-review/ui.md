# KurstadtTattoo: senior visual design review

**Overall verdict: 6.5/10.** A credible foundation with genuine tattoo work, a distinctive fountain mark, warm white surfaces and magenta drawn from the studio photography. Keep those assets and the Syne/Instrument Sans pairing. The site avoids many stock template clichés, but its repeated question headings, ruled sections, equal columns and enormous closing blocks still feel assembled from a template. The artwork needs more editorial authority. This is a refinement of the existing identity, not a recommendation for a new theme.

Reviewed on 12 November 2026 as Tester, against local `main` at `28aabd6`, for [ticket #11](https://github.com/digitalfreedom-co-za/kurstadttattoo.de/issues/11). Evidence: all 48 supplied screenshots in `/tmp/kt-shots/`, covering all 12 page types in DE and EN at 375 and 1280 px; source components, layouts, dictionaries, image data and styles; curl GETs of all 24 live content routes and `/404.html`, all returning HTTP 200. The 404 document was reviewed in source and HTML only. No product files were changed and no runtime interaction tests were performed. This report is the only repository artifact created.

The screenshots include a consent dialog on non-legal pages. Its dimming obscures parts of the opening content; it is not evidence that the underlying palette is gray or that images have failed. Displaced headers and visible skip links in the captures are not reported as layout bugs. Dark mode, the open mobile menu, lightbox and loaded calendar were not visually captured; relevant source findings are marked accordingly. Findings apply to both locales unless specified.

## Numbered findings

1. **Major | Home: administration precedes the art on mobile**

   **Location:** `src/components/home/HomePage.astro:55`, `:62`, `:84`, `:106`, `:110`.

   **Problem:** At 375 px, the long headline, introduction, actions and address/hours block all precede the first tattoo. After that image, four trust items and five descriptive service items precede the portfolio selection. The desktop image balances the text reasonably well, but the mobile reading order turns an art studio into a long information page.

   **Why it matters:** The first impression should demonstrate Patrick's work. Visitors currently need to work through the studio's explanation before seeing its range and detail.

   **Fix:** Order the mobile hero as short heading and introduction, tattoo image and caption, then actions. Move detailed hours/address into the existing location section, keeping the reopening strip. Place the selected works before the expanded trust/service descriptions; reduce the trust area to concise links to hygiene and consultation. Preserve the desktop two-column composition. Verify the result in both languages at 375 px without an overlay.

2. **Major | Sitewide typography: search-style headings overwhelm the visual voice**

   **Wiki alignment (re-review):** the content rules in the wiki (`websites.md`, Content writing rules for AI bots, rule 2: question-shaped headings) require questions for section headings, so the h2 questions stay. Implemented within that rule: the h1 page headings are shortened (home, gallery, hygiene, consultation, FAQ, contact) with location and studio name moved into the eyebrow, and the SEO titles and descriptions are unchanged.

   **Location:** `src/i18n/de.json:118`, `:127`, `:225`, `:351`, `:638`; corresponding `pages` entries in `src/i18n/en.json`; `src/components/ui/PageHeader.astro:33`.

   **Problem:** Repeated formulations such as “Welche Rolle spielt Hygiene bei KurstadtTattoo?” and “Kontakt und Anfahrt zu KurstadtTattoo in Bad Nauheim” consume several lines of a wide display face. Almost every section asks another question and repeats the brand. The result resembles an FAQ or search landing page even when presenting art.

   **Why it matters:** Premium typography needs concise editorial hierarchy. Long, similarly weighted headings flatten the difference between a work, an artist statement and practical information.

   **Fix:** Keep descriptive metadata, but shorten visible headings: for example `Realistische Porträts. Feine Linien.`, `Arbeiten aus dem Studio`, `Hygiene im Studio`, and `Kontakt und Anfahrt`. Keep location and studio name in the eyebrow or lead where needed. Retain question headings in the actual FAQ. Edit DE and EN individually and check line breaks; do not solve this by shrinking every heading or adding forced breaks across all viewport sizes.

3. **Major | Section system: excessive repetition creates the template impression**

   **Location:** `src/components/ui/Section.astro:47`, `:53`, `:54`, `:79`; `src/styles/global.css:61`; `src/components/pages/GalleryPage.astro`.

   **Problem:** Most chapters repeat the same full-width double rule, tiny magenta eyebrow, large left heading, right introduction, large gap and bordered list. Alternating near-identical off-whites adds length more than hierarchy. Gallery categories receive the same large chapter treatment as an entire subject such as hygiene.

   **Why it matters:** The fountain-derived rule is a useful signature, but repetition at nearly every boundary makes it decorative scaffolding. The layout becomes more memorable than the tattoos.

   **Fix:** Reserve the double rule for major subject changes. Give gallery groups a compact heading/caption treatment and smaller vertical spacing. Use the existing support density for secondary information, removing redundant eyebrows when the heading already identifies the topic. Preserve generous space around featured art, while reducing stacked top/bottom padding between short informational sections. Establish these few explicit variants rather than making every page a different design.

4. **Major | Gallery: one center crop damages very different tattoo compositions**

   **Location:** `src/components/ui/Gallery.astro:40`, `:50`; `src/data/gallery.ts`; source assets `galerie-schriftzug-memories-unterarm.jpg` and `galerie-hai-koordinaten-oberarm.png`.

   **Problem:** Every thumbnail is cropped to 4:5 at the center. The original Memories photograph contains a wide forearm inscription, and the shark is a horizontal composition. The portrait crop sacrifices lateral context and portions of the work. Foot, neck, hand and full-arm pieces also need different framing.

   **Why it matters:** A tattoo is designed for a body placement. Cropping away its extent changes the apparent composition and prevents a fair assessment of the craft. Opening a full image later does not repair the first impression.

   **Fix:** Add explicit per-work thumbnail framing: focal position and either a suitable ratio or an uncropped contain treatment on a neutral surface. Use landscape slots for horizontal lettering and retain full placement context for wrapping pieces. Audit all 24 works against their originals at both widths. Keep the full image unchanged in the lightbox. Never retouch or generate missing tattoo detail.

5. **Major | Portfolio hierarchy: every work is treated as an equal thumbnail**

   **Location:** `src/components/ui/Gallery.astro:32`, `:33`; `src/data/gallery.ts:67`; `src/components/home/HomePage.astro:120`.

   **Problem:** The home selection is eight equally sized tiles, and the full gallery is a repeated equal-cell catalog. At 375 px, most images are only about 160 px wide. Fine lines and portrait shading are hard to appreciate at that scale. The three-work color and fine-line groups occupy only three of four desktop columns.

   **Why it matters:** An art portfolio needs a viewing rhythm and a clear selection of lead pieces. Uniform thumbnails communicate inventory more strongly than authorship.

   **Fix:** Feature one existing portrait and one fine-line piece at larger sizes in the home selection, followed by smaller supporting works. On mobile, allow these lead works to span both columns. Let three-work gallery groups fill three columns at desktop rather than inherit four. Keep the remaining grid orderly and the reading order predictable; do not introduce random masonry or arbitrary image scaling.

6. **Minor | Image captions: metadata has too much typographic noise**

   **Location:** `src/components/ui/Gallery.astro:101`, `:103`; `src/styles/global.css:38`, `:186`; `src/components/pages/HygienePage.astro` figure captions.

   **Problem:** Style and placement metadata use 12 px uppercase letters with 0.14em tracking. In two-column mobile galleries, long labels wrap into several short lines, competing with the motif title. The same label style is also used for full-sentence hygiene captions.

   **Why it matters:** Small captions should help viewers interpret the image without becoming visual texture. Wide tracking and capitals make these longer descriptions harder to scan.

   **Fix:** Keep the uppercase label token for short eyebrows. Give artwork metadata and photographic captions a separate sentence-case treatment, around 13–14 px with normal tracking and comfortable line height. Put motif title first and style/placement below. Check the longest DE and EN labels without truncation.

7. **Minor | Photography: inconsistent baked-in branding competes with the artwork**

   **Location:** `src/data/gallery.ts:20`, `:79`; `src/assets/images/galerie-schriftzug-memories-unterarm.jpg`; `src/assets/images/galerie-unterschrift-elvis-presley-fuss.png`; gallery screenshots.

   **Problem:** Some photographs have a small corner logo, others have a large translucent fountain across the skin, and many have a bright neon background. The Memories and Elvis signature originals show especially prominent overlaid branding. This sits inside a page already branded by the header, captions and footer.

   **Why it matters:** Inconsistent photographic treatment weakens the sense of a deliberately curated exhibition and can obscure fine detail. This is an asset limitation, not a CSS defect.

   **Fix:** Prefer owner-supplied original exports with consistent, unobtrusive attribution where available. Preserve existing attribution until an authorized replacement is supplied. For the current release, prioritize the clearest existing images as lead works and keep heavily overlaid images as supporting work. Establish a future capture brief: consistent light, neutral background, full placement and a detail view. Do not erase watermarks or invent cleaner artwork.

8. **Major | Artist page: specialties are described without showing the work**

   **Location:** `src/components/pages/ArtistsPage.astro:36`, `:52`; `src/data/gallery.ts`.

   **Problem:** The page presents two large portraits of Patrick, a three-column specialty list, values and video links, but no finished tattoo examples alongside the claim about realistic portraits and fine lines.

   **Why it matters:** An artist page should connect the person to recognizable work. The current balance resembles a professional-services biography and misses a strong opportunity for distinctiveness.

   **Fix:** Keep one principal portrait and add a compact two-work selection under the specialty introduction, using an existing portrait tattoo and fine-line example. Link each to its gallery context. Reduce the second portrait's dominance or use it as a smaller supporting image. Keep factual captions; do not add unsupported project stories, completion times or healed-status claims.

9. **Minor | Hygiene and consultation: concrete evidence arrives too late or is absent**

   **Location:** `src/components/pages/HygienePage.astro:29`, `:42`; `src/components/pages/ConsultationPage.astro:51`; `src/components/pages/AftercarePage.astro:29`.

   **Problem:** Hygiene opens with another general values section before the useful working photographs. Consultation is entirely text and ruled lists. Meanwhile, aftercare receives a prominent smiling workstation portrait that illustrates the person more than the care instructions.

   **Why it matters:** Art, hygiene and consultation are the core brand priorities. They should feel grounded in the studio's actual practice, with images used because they explain that subject.

   **Fix:** Lead hygiene with the existing working photograph and its factual caption; condense the repeated values into the introduction. Pair consultation's planning section with an existing finished tattoo explicitly captioned as an example of the result, not as evidence of a consultation session. Keep aftercare's instructions early; reduce the decorative portrait there. If new consultation/process photographs become available, use only genuine documented scenes. Do not label archived room photos as the new studio.

10. **Major | First-visit presentation: the consent sheet becomes the dominant brand experience**

    **Location:** `src/components/layout/ConsentDialog.astro:45`, `:172`, `:344`; `src/components/booking/BookingEmbed.astro:102`.

    **Problem:** The supplied non-legal captures show a large consent sheet and dark backdrop over the opening content. Source confirms it automatically opens on every eligible first-visit page, even though the currently described optional service is the booking calendar on a different page. The booking page also contains a local consent explanation.

    **Why it matters:** The first visual encounter is with cal.com and administrative prose instead of tattoo art. On a narrow phone this occupies much of the useful initial view.

    **Fix:** In the current booking-only configuration, request calendar consent at the calendar placeholder or when the visitor explicitly asks to load it. Keep footer settings and the full disclosures. Preserve equally weighted accept/reject choices. If analytics is enabled later, handle that separate purpose explicitly rather than silently applying the booking-only behavior. This is a visual hierarchy recommendation, not a legal assessment. Re-capture the clean page and consent state separately.

11. **Major | Booking preview: the strongest message contradicts the actual available service**

    **Location:** `src/components/pages/BookingPage.astro:36`; `src/components/booking/BookingEmbed.astro:55`, `:79`; `src/config/booking.ts:7`; DE/EN booking page headings and leads.

    **Problem:** “Book a consultation” and “Pick a free slot” are the dominant messages, followed by confirmation/time-zone UI. Only a lower, quieter preview notice explains that the calendar cannot book a studio appointment. The demo is intentional and disclosed, but the hierarchy still presents it as the real service.

    **Why it matters:** Visual emphasis communicates availability before someone reads the disclaimer. This makes a polished studio site feel unfinished and undermines confidence at the point of contact.

    **Fix:** While `CAL_IS_DEMO` is true, lead with the genuine phone/email appointment options. Label any retained demo explicitly before its title and controls, and place it below the real contact block. Match the page heading, lead and primary action to this state. Once a real studio calendar is configured, restore the calendar-first hierarchy. No booking was submitted during this review.

12. **Minor | Closing CTA: button emphasis does not match the page's instruction**

    **Location:** `src/layouts/SubpageLayout.astro:47`; `src/components/ui/CtaBand.astro`.

    **Problem:** All content subpages except booking receive the same calendar CTA. Hygiene and aftercare ask the visitor to call with questions, contact says the studio looks forward to their call, and engraving requests an inquiry by phone, yet the large filled button is “Termin buchen”. The relevant telephone action is smaller underneath.

    **Why it matters:** Consistent components should preserve consistent meaning. A strongly emphasized unrelated next action makes the page feel mechanically generated.

    **Fix:** Set the primary action per page. Use the existing phone variant for hygiene, aftercare, contact and engraving, with a clear visible call label where space allows. Keep booking primary on the artist, gallery and consultation pages when appropriate. Apply the demo-state treatment from finding 11 consistently.

13. **Minor | Footer and closing band: the ending outweighs the content**

    **Location:** `src/components/layout/Footer.astro:30`, `:32`, `:88`; `src/components/ui/CtaBand.astro`; `src/layouts/SubpageLayout.astro:46`.

    **Problem:** Related links, a generously padded black CTA band and another large black footer repeat across almost every subpage. On mobile, logo/about, address, hours, social links and navigation form a long stack. At desktop, nine single-column navigation links determine the footer height, leaving large empty areas beneath the other columns.

    **Why it matters:** These repeated blocks dilute each page's conclusion and make relatively short pages feel disproportionately long. The black area reads as a second site rather than a concise sign-off.

    **Fix:** Keep all useful links but use two navigation columns at desktop, reduce the CTA-to-footer gap and avoid two equally prominent double-rule openings in succession. On mobile, tighten spacing between related contact facts and group hours with the address. Preserve readable text and comfortable link targets; do not make the footer compact by reducing type size.

14. **Minor | Supporting grids: incomplete rows look accidental**

    **Location:** `src/components/ui/RelatedPages.astro:28`; `src/components/pages/BookingPage.astro` preparation grid; `src/components/pages/EngravingPage.astro` materials/examples grids.

    **Problem:** Four related links render as three plus one on consultation, aftercare, FAQ and booking. Five preparation items and five materials render as three plus two. Three engraving photos inherit a four-column gallery. These are conspicuous gaps inside otherwise rigidly aligned layouts.

    **Why it matters:** Deliberate negative space can be expressive, but repeated partial rows here look like a component that did not account for its content count.

    **Fix:** Use two columns for four-item related lists. For five-item information lists, use a deliberate two-column layout with the final item spanning the width, or a compact single list where appropriate. Make the three engraving examples a full three-column row at desktop and choose an intentional mobile treatment. Do not add filler items merely to complete a row.

15. **Major | Color system: dark-section video hover breaks the palette contract**

    **Location:** `src/components/ui/VideoLinks.astro:29`, `:33`; `src/styles/global.css:23`, `:28`.

    **Problem:** With the default light theme, the FAQ's always-dark video section uses `group-hover/video:text-neon`, which resolves to dark magenta `#a3157c` against `#0f0e10`. Calculated contrast is **2.71:1**. The component's icon correctly uses `text-neon-glow` for the same surface. Its explicit focus color also uses the dark accent.

    **Why it matters:** The link becomes less legible exactly when someone interacts with it, and magenta behaves inconsistently within one component. This finding is source-derived; hover was not visually exercised.

    **Fix:** Make hover and explicit focus colors follow the `night` prop, using `neon-glow` on always-dark surfaces. That existing pair is **7.49:1**. Check the component in both site themes and on both surface tones. The ordinary muted text pairs are sound by token calculation: approximately 6.86:1 on the light wall and 8.05:1 on the dark surface; a global palette replacement is unnecessary.

16. **Minor | Privacy page: the mobile storage table hides its own structure**

    **Location:** `src/components/pages/PrivacyPage.astro:116`; `src/components/legal/LegalProse.astro:36`.

    **Problem:** Five table columns each have a minimum width of 9rem inside a horizontally scrollable container. At 375 px, only part of the table is visible, with no persistent visual cue explaining that more fields exist to the right. The full-page capture consequently presents an incomplete account of each row.

    **Why it matters:** Practical information should be as visually composed as the portfolio. A clipped table feels like desktop content squeezed into a phone.

    **Fix:** Present each of the three storage entries as a compact label/value block on narrow screens, keeping the desktop table. Alternatively, retain the table with a clearly visible localized scroll instruction and edge cue. Do not reduce table text to make five columns fit. Preserve all legal content; this finding concerns presentation only.

17. **Minor | German video labels: the editorial voice switches to informal address**

    **Location:** `src/i18n/de.json:1133`, `:1149`; artist and FAQ video lists.

    **Problem:** “Wie bist du zum Tätowieren gekommen?” and “Macht ihr auch Tattoos von anderen fertig?” appear as ordinary site link titles amid consistent Sie copy. They originate from genuine video titles, but are not presented as quotations or archival titles.

    **Why it matters:** The abrupt change weakens the otherwise deliberate brand voice and conflicts with the requested Sie presentation.

    **Fix:** Use neutral editorial link labels such as `Patricks Weg zum Tätowieren` and `Begonnene Tattoos fertigstellen`. Keep the actual video destinations and factual summaries. This avoids altering the videos or introducing typographic quotation marks.

18. **Polish | Hero image treatment: the offset magenta rectangle is a generic embellishment**

    **Location:** `src/components/home/HomePage.astro:85`; `src/components/pages/ArtistsPage.astro:37`.

    **Problem:** The decorative rectangle offset behind both hero images adds a familiar portfolio-template flourish. It is less connected to the studio identity than the fountain mark, photo captions and restrained basin rule, and competes with magenta already present in the photographs.

    **Why it matters:** Distinctiveness improves when the site repeats its own meaningful visual vocabulary instead of accumulating unrelated decorative devices.

    **Fix:** Remove the offset rectangle. Let a clean image edge, deliberate crop and caption establish the frame. Keep magenta for short editorial accents and interactive states, with the basin rule reserved as described in finding 3.

19. **Polish | 404: the fallback page bypasses the established type and spacing system**

    **Location:** `src/pages/404.astro:12`, `:13`, `:17`.

    **Problem:** The fallback uses standalone `max-w-2xl`, fixed text sizes and raw underlined links rather than the site's container, fluid heading scale and action components. This was observed in source only; no 404 screenshot was supplied.

    **Why it matters:** A broken-link landing should still feel like the same studio and give the visitor a clearly composed route back to the art.

    **Fix:** Use the shared container, fluid heading tokens and existing button/link styling. Keep the bilingual explanation and home links, with German and English visually separated but consistent. Add no promotional filler. Verify its rendered appearance at both review widths when implementing.

## Top 5 quick wins

1. Fix the dark video hover/focus accent using `neon-glow` (finding 15).
2. Shorten visible home, gallery, hygiene and contact headings in DE and EN (finding 2).
3. Make closing CTA emphasis match the phone-led page message (finding 12).
4. Correct four-item related grids and three-item image grids (findings 5 and 14).
5. Remove the offset hero frames and simplify caption typography (findings 6 and 18).
