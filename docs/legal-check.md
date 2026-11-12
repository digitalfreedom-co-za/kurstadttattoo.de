# Legal compliance check kurstadttattoo.de

Date: 2026-11-12. Ticket #13. Checked against the legal repo digitalfreedom-co-za/legal at commit 972471f (2026-11-10): `website/README.md`, `website/BUILDING_A_WEBSITE.en.md`, `website/COOKIE_POLICY.en.md`, `website/IMPRESSUM.en.md`, `internal/LAWFUL_BASIS_REGISTER.de.md`, `processors/github.md`, `processors/cal-com.md`, `shared/_meta/LOCALIZATION_POLICY.en.md`. Site state: main at a88c001 (imprint, privacy policy, consent dialog, booking embed, GA4 switch).

Method: read the legal texts, the site code (`src/components/pages/ImprintPage.astro`, `PrivacyPage.astro`, `src/components/layout/ConsentDialog.astro`, `src/config/consent.ts`, `src/config/analytics.ts`, `src/components/seo/Analytics.astro`, `src/scripts/*.ts`) and the dictionaries `src/i18n/{de,en}.json`. Built the site and opened /termin/ in a fresh browser (Playwright, preview build) before any choice: only requests to the own host, no cookie, no localStorage entry, dialog open, booking switch off, Ablehnen and Akzeptieren with identical classes. `grep '{{'` over `dist/`: no match.

Site type: Type B brand site (`BUILDING_A_WEBSITE.en.md` section 1). Provider and controller is RuW Lifestyle GmbH, not DigitalFreedom Global LLC (Decision Log #14, entry for #8). Every rule that exists only because the provider is the LLC is marked n/a below and is not a deviation.

Result legend: OK, deviation (with ticket), n/a (does not apply, with reason).

## Pages and artefacts

| Requirement (source) | Result | Note |
|---|---|---|
| Imprint, always (README, BUILDING section 3) | OK | /impressum/ and /en/imprint/ |
| Provider block names the actual provider (BUILDING section 3 and 6) | OK | RuW Lifestyle GmbH, Beneke Str. 9, managing director, register, VAT ID |
| Why a US LLC link and page (README, BUILDING section 3) | n/a | Required only where the provider block names DigitalFreedom Global LLC. Wiki websites.md says every site; the legal repo is narrower and wins (Decision Log #14) |
| Privacy policy if the site processes anything (BUILDING section 3) | OK | /datenschutz/ and /en/privacy/ |
| Cookie policy where more than strictly necessary is set (README) | deviation #32 | Cookie facts are in the privacy policy, not in the template structure |
| Consent banner as a gate, no tag before consent (README, COOKIE_POLICY section 4 and 5.2) | OK | Verified in the browser, see method |
| Terms of service only if the site offers something (README) | n/a | Brochure site, booking runs at cal.com |
| Account deletion, health data policy, acceptable use (README) | n/a | No accounts, no health data, no shared resource |
| security.txt, security information page, declaration of conformity (README) | n/a | BUILDING section 3: a Type B site needs nothing else from the repo; no product with digital elements |
| Trademark notice, open source notices (README) | n/a | No store badges or third party marks; no third party code shipped beyond the site's own bundle |
| Alias domains data-protection., security., support.apps.digitalfreedom.co.za | n/a | DigitalFreedom channels; the controller here is the GmbH with its own contact |
| Social profiles link the imprint (BUILDING section 4) | deviation #40 | Not verifiable now; the imprint lives on the preview until launch |
| Languages English and German (BUILDING section 5, LOCALIZATION_POLICY) | OK | Same keys and facts in DE and EN for imprint and privacy policy |

## Imprint (IMPRESSUM.en.md structure)

| Section | Result | Note |
|---|---|---|
| 1 Service provider, 2 legal form and representative | OK | GmbH in the name, managing director named in full (the abbreviation rule belongs to the LLC) |
| 3 Contact, rapid electronic contact | OK | Phone and email |
| 4.1 Commercial register | OK | Amtsgericht Friedberg (Hessen), HRB 8945 |
| 4.2 Professional regulations | deviation #31 | No not applicable statement; a job title is shown instead |
| 4.3 DSA contact points Art. 11 and 12 | deviation #30 | Missing |
| 4.4 Insurance | n/a | Template data belongs to the LLC; no facts for the GmbH in docs/source-content |
| 5 Editorial responsibility § 18(2) MStV | deviation #31 | No statement |
| 6.1 ODR platform closed | deviation #31 | Topic dropped completely |
| 6.2 Consumer arbitration (VSBG) | OK | |
| 7 Liability for content | OK | Shorter wording, same position (own content under general law) |
| 8 Liability for links | OK | |
| 9 Copyright | deviation #29 | Site names German law as the default, the template rejects that |
| 10 International disclosure list | n/a | Orientation list for the LLC's global services; local German studio |
| 11 Data protection contact, no DPO statement | OK | Imprint links the privacy policy, which names controller and contact. data-protection@digitalfreedom.co.za is the LLC's channel, n/a |

## Privacy policy and cookies (COOKIE_POLICY.en.md, LAWFUL_BASIS_REGISTER.de.md)

| Requirement | Result | Note |
|---|---|---|
| Strictly necessary storage: § 25(2) No. 2 TDDDG for access, Art. 6(1)(f) for processing (COOKIE_POLICY section 3.1, register LB-COOKIE-001) | OK | Both bases named for `kt-consent` |
| Consent record without identifier, written only on the visitor's action (section 3.1) | OK | `kt-consent`: version, timestamp, choices |
| Theme and language choice (section 3.1 and 3.2) | deviation #33 | `theme` and `locale-explicit` kept without limit, no notice at the control; theme is listed as functional |
| Section 3.5 storage table: Key, Where, Written when, Purpose, Category, Retention, Consent | deviation #32 | Where and Category missing |
| Section 5.1 per vendor table | deviation #32 | `__cf_bm` and `_ga` only in prose |
| Granular categories, nothing pre-ticked, Reject as easy as Accept, persistent settings link (section 5.2, BUILDING section 6) | OK | Footer link Cookie-Einstellungen on every page |
| Consent record with IP, retained 36 months (section 5.2) | deviation #34 | Browser side only, no IP, no expiry |
| Withdrawal at any time, effect for the future (section 4.2) | OK | Reload removes a loaded calendar or GA4 |
| GA4 Consent Mode v2 Basic, nothing loads before consent (section 5.1) | OK | No static gtag tag; GA4 is off until PUBLIC_GA4_ID exists |
| GA4 cookie lifetime set explicitly (section 5.1 note) | deviation #35 | Google default used, two years stated |
| Do Not Track respected (section 7) | deviation #36 | Applies once GA4 is on |
| Third country transfer named with its basis (section 5.1, processors) | OK | GitHub, cal.com, Google: DPF plus SCC as stated |
| Lawful bases match the register pattern (LB-COOKIE-001, LB-SUP-001) | OK | Consent for cal.com and GA4, lit. b and f for contact, lit. f for hosting logs |
| Register and records documented for this controller (register, Art. 5(2) GDPR) | deviation #39 | None for RuW Lifestyle GmbH |
| No named supervisory authority (wiki README) | n/a | The rule exists because the LLC has no EU establishment; the GmbH sits in Hessen, so naming the HBDI is correct |

## Processors

| Requirement | Result | Note |
|---|---|---|
| GitHub Pages disclosed with IP logging and US transfer (`processors/github.md`) | OK | Hosting section of the privacy policy |
| Hosting relationship and record (`processors/github.md`) | deviation #37 | Hosted in the DigitalFreedom org for a GmbH controller; site not in the record; entity naming differs |
| cal.com record (`processors/cal-com.md`) | deviation #38 | kurstadttattoo.de not listed; studio account and DPA open |
| WEB.DE mailbox | OK | Named in the privacy policy; not a DigitalFreedom processor, so no record in the legal repo |

## Tickets

#29, #30, #31, #32, #33, #34, #35, #36, #37, #38, #39, #40. None of them is fixed in this PR.
