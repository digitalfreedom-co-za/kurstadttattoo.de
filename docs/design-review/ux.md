# KurstadtTattoo UX and Conversion Review

**Overall verdict: 6/10.** Real tattoo photography, a recognisable artist and a consistent DE/EN structure provide a strong foundation. Art has a clear identity, but hygiene and consultation rely too heavily on general assurances. The primary booking journey currently ends at a developer demo, and first-time visitors encounter a booking-consent modal before they can assess the studio. The public conversion journey needs correction before launch.

Reviewed on 12 November 2026 for [ticket #11](https://github.com/digitalfreedom-co-za/kurstadttattoo.de/issues/11), Tester role. Source baseline: main, `28aabd6`. Curl returned HTTP 200 for all 24 DE/EN content pages. All 48 supplied screenshots were inspected at 375 and 1280 px, covering home, gallery, artists, hygiene, consultation, aftercare, FAQ, contact, appointment, engraving, imprint and privacy in both languages. The 404 source was also inspected. Fixed headers appearing mid-capture were treated as screenshot artifacts.

This is a UX review of rendered pages, supplied screenshots and source, not a completed interactive booking test or a legal/medical audit. No appointment, email or phone call was submitted. Competitor comparisons use `docs/competitor-analysis.md`, dated 12 November 2026; competitor claims were not independently revalidated. Legal pages are readable without the automatic consent modal, distinguish operator and studio addresses, and have no additional standalone UX finding here. Numbering is confined to genuine process/aftercare steps; no prohibited decorative 01/02/03 pattern was found. Product source remains unchanged.

1. **[blocker] The primary conversion action offers a booking that is not a studio appointment.**

   **Where:** All primary CTAs; /termin/ and /en/appointment/. `src/config/booking.ts:8`, `src/components/pages/BookingPage.astro:28`, `src/components/booking/BookingEmbed.astro:79`.

   **Problem and impact:** The live pages invite visitors to choose a consultation slot and promise confirmation by email, then disclose that the calendar belongs to the developer and creates no KurstadtTattoo appointment. The warning is honest, but it appears after the main promise. A visitor can spend effort on an unusable booking and send their details to an unexpected recipient. This is a public conversion blocker even though the site is a preview.

   **Fix:** While demo mode is active, make the public journey a consultation request by phone/email, remove the functioning demo calendar and its external fallback booking link from that journey, and change upstream CTA labels accordingly. Keep any demonstration in an explicitly separate test surface. Enable booking language only once the studio calendar, event, recipient and confirmation flow are verified.

2. **[major] Booking consent interrupts visitors who only want to see tattoos.**

   **Where:** Every non-legal entry page in both languages. `src/components/layout/ConsentDialog.astro:45` and `:344`.

   **Problem and impact:** The first visit automatically opens a modal about cal.com even on gallery, artist and care pages. The screenshots show the content dimmed and a large consent sheet competing with the first impression. Source confirms modal focus handling and an inert background. Visitors must make an unrelated decision before judging the artwork. This repeats the kind of entry barrier criticised in the competitor analysis of AMC's age gate.

   **Fix:** With analytics disabled, request booking consent only when the visitor explicitly loads the calendar. Retain the inline consent placeholder and footer settings. If analytics is enabled later, handle that choice separately without making calendar consent a prerequisite to browsing. Keep rejection as straightforward as acceptance.

3. **[major] The site gives conflicting instructions about how to request an appointment.**

   **Where:** Home process, consultation, contact, FAQ and booking. `src/i18n/de.json:645`, `:1016`, `src/i18n/en.json:645`, `:1016`, `src/data/process.ts`, `src/components/ui/CtaBand.astro:33`.

   **Problem and impact:** The process and FAQ say requests are taken by phone; contact labels email as being for other questions; booking and consent alternatives invite appointment requests by phone or email. Meanwhile the prominent action says to book online. Users cannot tell which channel actually reaches the studio or whether email is acceptable.

   **Fix:** Confirm the accepted channels with Patrick and use one consistent first step across both dictionaries, FAQs, process, header and CTAs. Distinguish requesting a consultation from a confirmed tattoo session. For an approved email route, provide a concise subject and optional prompts for motif, placement and approximate size. Do not invent response-time promises.

4. **[major] Hygiene is prominently named but weakly evidenced.**

   **Where:** Home hygiene section and /hygiene/ in both languages. `src/components/home/HomePage.astro:128`, `src/i18n/de.json:348`, `src/i18n/en.json:348`.

   **Problem and impact:** The content repeats hygiene, professionalism and satisfaction as values. Photos show gloves and a covered machine, but most concrete instructions concern what the customer does after treatment. The home section links to aftercare rather than the dedicated studio-hygiene page. It does not adequately answer a prospective client's question about preparation and hygiene during their session. The documented Studio One and Skull content is more specific.

   **Fix:** Obtain Patrick's confirmation of actual preparation, materials, cleaning and between-client procedures; publish a short explanation organised around the session. Keep unsupported measures and certifications out. Link the home section directly to the hygiene page and reduce duplicated aftercare content. Until facts are confirmed, describe only what the images establish and clearly offer a consultation about the procedures.

5. **[major] Price is a key decision question with no written answer.**

   **Where:** Consultation, FAQ and home FAQ selection. `src/components/pages/ConsultationPage.astro:58`, `src/components/pages/FaqPage.astro:42`, `src/data/faq.ts:11`, `src/i18n/de.json:455`.

   **Problem and impact:** “What does a tattoo cost?” sends people to a video or a phone call. The English version links to the German video. The homepage FAQ includes removal but omits cost. Comparison shoppers receive less help than the documented holyZia pricing information or Studio One/Prime Ink explanations.

   **Fix:** Get an approved written explanation of how an individual quote is prepared, what information is needed and when the client learns the price. Add it to consultation and both FAQ versions, including the homepage preview. Publish minimum charges, deposit rules or ranges only if confirmed. Keep the video as supplementary content.

6. **[major] Visitors cannot assess the commitment involved in a consultation.**

   **Where:** /beratung-ablauf/, /termin/ and English equivalents. `src/components/pages/BookingPage.astro:2`, `src/i18n/de.json:412` and `:670`; corresponding EN entries.

   **Problem and impact:** Preparation guidance is useful, but duration, consultation cost, format/location and what happens after the consultation are unspecified. These are distinct from the tattoo's price. Competitors in the supplied analysis explain more of this commitment. EN “Pick a free slot” can also suggest a free consultation when that has not been confirmed.

   **Fix:** Confirm and display a compact consultation summary before the action: format, place, duration, fee status and next step. Explain the distinction between consultation and tattoo scheduling. Use “available time” in English. Do not assume a free consultation, remote availability, deposit or cancellation policy.

7. **[major] Current closure is less prominent than historical opening hours.**

   **Where:** Home hero, contact, mobile menu and footer in both languages. `src/components/home/HomePage.astro:62`, `src/components/layout/Header.astro:116`, `src/i18n/de.json:51` and `:64`, `src/config/site.ts:82`.

   **Problem and impact:** The new address and 1 December 2026 date are repeated clearly, but the hero still presents Monday-Friday hours with a smaller caveat. “Until then the studio is closed” is buried in the later reopening panel or FAQ. A scanning visitor can mistake the old schedule for current availability. Existing studio images are also not identified as evidence of a particular location; the source archive explicitly says their location is unknown.

   **Fix:** Lead every opening-hours surface with the current temporary closure and reopening date. Present unconfirmed future hours as unconfirmed, rather than leading with the previous schedule. State whether enquiries can be made during closure once confirmed. Label archive images without implying they depict the new premises. Prepare a coordinated reopening content update, including the hard-coded dictionary copy, when the studio opens.

8. **[major] Mobile ordering delays the three central reasons to choose the studio.**

   **Where:** DE/EN home at 375 px. `src/components/home/HomePage.astro:52`, `:62`, `:84`, `:110`; `src/components/ui/TrustStrip.astro:26`.

   **Problem and impact:** The long heading, intro, actions, address and hours all precede the hero artwork on mobile. Four stacked trust statements and five style descriptions then precede the portfolio grid. Substantive hygiene and consultation sections arrive much later. This is visible in the full-page captures, independently of the header artifact.

   **Fix:** Shorten the visible hero copy while keeping location and specialty clear. Put a real work image before the extended logistics block. Offer compact, linked entry points to art, hygiene and consultation near the top. Move style explanations beside the relevant images or into the gallery; keep closure status concise and prominent.

9. **[minor] Mobile conversion and language controls lose their visible labels.**

   **Where:** Shared header at 375 px. `src/components/layout/Header.astro:64`, `src/components/layout/LanguageSwitch.astro:46`.

   **Problem and impact:** The calendar and globe become icon-only while the theme icon retains equal prominence. Accessible names exist, but sighted visitors have to infer booking and the alternate language. On long portfolio pages this weakens the persistent conversion control.

   **Fix:** Keep a short visible consultation/request label and an EN/DE label at narrow widths. Give these tasks priority over the theme control, which can move into the menu. Preserve the existing equivalent-page language routing.

10. **[minor] English pages do not clarify the language of the actual consultation.**

    **Where:** EN consultation/contact/appointment pages and shared phone display. `src/i18n/en.json:412`, `:645`, `:670`; `src/config/site.ts:27`.

    **Problem and impact:** Fully translated pages invite English-speaking visitors to telephone, without saying whether the conversation can take place in English. The visible number uses the German domestic format, although its tel link correctly includes +49. This leaves unnecessary uncertainty for Frankfurt international residents and visitors to Bad Nauheim.

    **Fix:** Confirm supported consultation languages and state them near the EN contact action. Display +49 173 160 51 62 in EN while keeping the correct tel link. Offer a written request route if the studio accepts it. Do not infer spoken-language capability from the translated website.

11. **[minor] Gallery categories do not consistently support style comparison.**

    **Where:** /galerie/ and /en/gallery/. `src/data/gallery.ts:75`, `src/i18n/de.json:232`; corresponding EN entries.

    **Problem and impact:** The hero's fox is described as colour realism but appears only under Colour; Realism contains a broad mix of symbols and objects. Fine Line includes a flower captioned Black and Grey. Users exploring the stated specialities can miss relevant evidence or find labels less informative than expected.

    **Fix:** Have Patrick validate the classifications. Give works multiple appropriate style tags and allow the same work to be discoverable through each relevant category without copying asset files. Prioritise clear portrait and fine-line evidence. Do not create human-portrait examples or claim specialist results that are absent from the supplied portfolio.

12. **[minor] An admired gallery piece has no contextual route to an enquiry.**

    **Where:** Gallery groups and lightbox, DE/EN. `src/components/pages/GalleryPage.astro:56`, `src/components/ui/Gallery.astro:137`.

    **Problem and impact:** The enlarged view contains navigation and a caption, but no way to discuss that work or style. The main body conversion section follows all five groups. A mobile visitor must leave the image, locate the booking icon or continue a long scroll, then explain the reference again.

    **Fix:** Add a discreet “Discuss an idea in this style” action after each group and an enquiry action associated with the selected work. Carry its title/reference into an approved request route. Explain that examples inspire a personal design; avoid implying another client's tattoo will simply be copied. No separate project-page system is necessary.

13. **[minor] Patrick's personal story is outsourced instead of supporting trust on-site.**

    **Where:** Artist page and shared video FAQ. `src/components/pages/ArtistsPage.astro:103`, `src/i18n/de.json:322`, `src/i18n/en.json:322`.

    **Problem and impact:** The story heading promises to explain how Patrick started tattooing, but the answer is a YouTube link. General phrases about detail and a steady hand dominate the written profile. The English reader reaches German media. This underuses the personal-artist advantage identified against larger Friedberg and Frankfurt studios.

    **Fix:** Obtain an approved short story or accurately summarise the source video, then translate it. Retain the original video as supporting evidence. Apply the same written-summary approach to the remaining video-only decision questions in the FAQ, after confirming their content and currency. Do not manufacture years of experience or credentials.

14. **[minor] The contact page promises directions but offers little arrival guidance.**

    **Where:** /kontakt/ and /en/contact/. `src/components/pages/ContactPage.astro:45`, `src/i18n/de.json:647`, `src/i18n/en.json:647`.

    **Problem and impact:** The address and Maps link are useful, but regional copy stops at being near Friedberg and Frankfurt. There is no confirmed entrance description, public-transport guidance, parking information or access information for the new premises. holyZia's documented arrival guidance better supports visitors travelling for an appointment.

    **Fix:** Add a compact arrival block after verifying the new location: entrance, useful public transport, legitimate parking options and physical access details. Link to route planning. Avoid invented journey times, parking availability or accessibility claims. Use one useful local section rather than interchangeable city pages.

15. **[minor] Trust evidence lacks a customer perspective near the enquiry decision.**

    **Where:** Home trust strip and booking/contact conversion areas. `src/components/ui/TrustStrip.astro:28`, `src/components/pages/BookingPage.astro:26`.

    **Problem and impact:** Trust comes from studio-authored claims and photographs. There is no sourced customer account or verified review-profile link to help someone compare the experience of consultation and care. House of Ink places review quotes near booking according to the supplied analysis.

    **Fix:** Verify the studio's own review profile and add a plain link near the request action. If suitable permission and sourcing are available, add one or two accurately attributed excerpts about consultation or the experience. Link translations to their originals and identify them as translations. If no verified evidence is available, leave testimonials out; never invent ratings or testimonials, or use the separate expert service's credentials as tattoo-service reviews.

16. **[major] Engraving expands the public promise beyond the tattoo-and-art brief.**

    **Where:** /gravur-service/, /en/engraving/ and footer. `src/components/pages/EngravingPage.astro:34`, `src/config/site.ts:95`, `src/i18n/de.json:556`.

    **Problem and impact:** A full sales page promotes engraving on commercial materials and objects, while the archive explicitly leaves continuation of this service at the new location unresolved. Its CTA sends users into tattoo consultation booking. This creates both a focus problem and an unverified future-service expectation.

    **Fix:** Remove engraving from the public conversion/navigation surface under the current tattoo-and-art-only brief, preserving source/archive material. If a separately authorised scope later includes the service, first confirm its continuation and provide a service-specific enquiry route. Keep Gutachter material limited to its existing secondary external pointer; do not expand it into replacement content.

17. **[minor] Aftercare questions lead to a new-tattoo consultation CTA.**

    **Where:** /pflegetipps/, /en/aftercare/ closing section. `src/layouts/SubpageLayout.astro:47`, `src/i18n/de.json:517` and `:520`.

    **Problem and impact:** The page already provides a useful direct phone contact and a separate medical warning, but its final “Questions about caring for your tattoo?” action promotes booking a new consultation. The German support text also says “jederzeit”, which can imply availability beyond the stated hours.

    **Fix:** Make direct aftercare contact the primary action on this page, with a clear purpose-specific label. Remove any implication of round-the-clock response unless confirmed. Preserve the distinction between routine studio support and the existing instruction to seek medical help; this finding does not assess the clinical advice.

18. **[polish] Video labels break the German Sie voice.**

    **Where:** Artist and FAQ video links. `src/i18n/de.json:1133` and `:1149`.

    **Problem and impact:** “Wie bist du zum Tätowieren gekommen?” and “Macht ihr auch Tattoos von anderen fertig?” appear as website labels among otherwise formal copy. They reproduce conversational video titles rather than the site's chosen voice.

    **Fix:** Use neutral labels such as “Patricks Weg zum Tätowieren” and “Tattoos aus anderen Studios fertigstellen”. Preserve the original linked videos. Keep the rest of the edit free of decorative numbering, typographic quotation marks, Gedankenstrich dashes and arrows.

## Top 5 quick wins

1. Replace the public demo-booking path with an honest consultation-request action and the studio's approved contact channels.
2. Stop automatically opening calendar consent on browsing pages; use the existing inline consent control when requested.
3. Put “temporarily closed until reopening on 1 December 2026” ahead of historical hours on every opening-hours surface.
4. Make appointment-channel wording consistent across the process, FAQ, contact page and CTAs in both languages.
5. Show visible consultation and EN/DE labels in the mobile header, and give aftercare its own direct-contact CTA.
