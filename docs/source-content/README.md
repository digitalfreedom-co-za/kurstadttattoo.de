# Source content of the old site www.kurstadttattoo.de

Archive of the old Webador site, fetched with curl on 2026-11-12. This folder is the only source of facts for the new site. Rework the texts, never copy them 1:1, and never add facts that are not listed here.

- `html/`: original HTML of every page plus `sitemap.xml` and `robots.txt`, unchanged
- `pages/`: text per page as Markdown (title, meta description, og:image, header banner, headings, text, links, embedded videos, image references). Wording is unchanged, only the structure is cleaned up. Navigation and footer are removed from the pages; the footer, which is the same on every page, is in `pages/_footer.md`
- `images/`: every image of the site in the largest size Webador delivers, deduplicated, with descriptive names

## Pages

The sitemap lists exactly these 9 pages. `/datenschutz`, `/datenschutzerklaerung` and `/impressum` return 404, so the old site has no privacy policy page. `/kontakt` (target of the contact buttons) answers with a 301 redirect.

| Page | File | Title | Content |
|---|---|---|---|
| `/` | `pages/home.md` | Tattoo Studio Bad Nauheim \| KurstadtTattoo | Welcome text, closure and reopening notice (image), opening hours, TikTok link, 3 FAQ, studio photos, contact form, location Parkstr. 22, about us |
| `/unsere-kuenstler` | `pages/unsere-kuenstler.md` | Tätowierer Bad Nauheim \| Unsere Tattoo-Künstler | Artists and team, Patrick as specialist for realistic portraits and fine lines |
| `/galerie` | `pages/galerie.md` | Tattoo Galerie Bad Nauheim \| Bilder & Motive | Short intro and 26 gallery slots (25 different photos, one shown twice) |
| `/pflegetipps` | `pages/pflegetipps.md` | Tattoo-Pflege & Heilung \| Tipps zur Nachsorge | Aftercare for tattoos and piercings: general, avoiding complications, long term care |
| `/haeufig-gestellte-fragen` | `pages/haeufig-gestellte-fragen.md` | Tattoo FAQ \| Schmerzen, Pflege, Kosten & Heilung | FAQ as 7 embedded YouTube videos, no written answers |
| `/kontakt-und-impressum` | `pages/kontakt-und-impressum.md` | Tattoo Termin Bad Nauheim \| Kontakt & Anfahrt | Contact form, location, phone, social links, Impressum |
| `/gravur-service` | `pages/gravur-service.md` | Lasergravur Bad Nauheim \| Individuelle Gravuren | Laser engraving on plastic, aluminium, brass and stainless steel, wood, glass |
| `/sachverstaendigen-und-gutachten` | `pages/sachverstaendigen-und-gutachten.md` | Tattoo-Gutachter & Sachverständiger \| Patrick Wolf | Expert opinions (DGuSV). No own content on the new site, see Decision Log #14 |
| `/schiedsrichter-und-mediator` | `pages/schiedsrichter-und-mediator.md` | Tattoo-Pfusch? Mediation & Hilfe \| Patrick Wolf | Mediation for botched tattoos. No own content on the new site, see Decision Log #14 |

Navigation order of the old site: Home, Unsere Künstler, Sachverständigen und Gutachten, Schiedsrichter und Mediator, Pflegetipps, Kontakt und Impressum, Häufig gestellte Fragen, Galerie, Gravur Service.

## Fact sheet

Everything below is stated on the old site; the source page is given in brackets.

### Studio

- Name: KurstadtTattoo Bad Nauheim (site title, footer, logo). The logo reads KURSTADTTATTOO BAD NAUHEIM above a fountain in a basin (`images/logo-kurstadttattoo-schwarz.png`)
- The neon wall in many photos reads TATTOO, PIERCINGs & MORE (visible in images only, not in the text)
- Offer: tattoos and piercings (home, galerie). Meta description of home: Individuelle Tattoos, Fine Line, Realistic Tattoos und Piercings
- Customers can bring their own designs (galerie)
- The studio finishes tattoos started elsewhere (video title XLK2HFlwZQc: Macht ihr auch Tattoos von anderen fertig? Ja, machen wir!)
- Tattoo removal: by laser at dermatologists, the studio gives information (home FAQ)
- Laser engraving service (gravur-service): plastic (max. engraving size 400 x 115 mm, indoor and outdoor, name plates, door and bell plates, pens, signs, trophy plates), aluminium (e.g. business cards, type plates, weatherproof), brass and stainless steel (indoor and outdoor, logos and graphics), wood (bread boards, wooden spoons, gifts), glass (wheat beer glasses, beer mugs, champagne glasses). The intro also names leather
- Region wording: in Bad Nauheim in Hessen kurz vor den Toren von Frankfurt (home); Tattoo Studio Wetterau (home)
- Values named: Qualität, Hygiene und Kundenzufriedenheit (home); Hygiene, Professionalität und Kundenzufriedenheit (unsere-kuenstler); aftercare support offered: bieten Ihnen gerne eine Nachsorge an (pflegetipps)

### Address and reopening

- Old address: KurstadtTattoo Bad Nauheim, Parkstr. 22, 61231 Bad Nauheim, Deutschland (home and kontakt, section Standort, still shown there)
- Closure notice on home (`images/aushang-geschlossen-neueroeffnung-1-dezember.jpg`), wording: Wir haben geschlossen. Neueröffnung am 1. Dezember. Ab 1. Dezember findet ihr uns im neuen Laden. Friedrich-Ebert-Platz 1A. Neuer Standort. Neues Studio. Gleiche Leidenschaft.
- New address: Friedrich-Ebert-Platz 1A (notice). The notice names neither postcode, town nor year. 61231 Bad Nauheim and the year 2026 come from ticket #1, not from the old site

### Contact

- Phone: 0173 160 51 62 (kontakt), +49 1731605162 (Impressum). Kontakt page: Für Terminanfragen rufe Sie uns bitte an (sic)
- Email: Kurstadttattoo@web.de (Impressum)
- Contact form with name, email, message (home, kontakt; Webador form with reCAPTCHA)
- Opening hours: Montag - Freitag 12-18 Uhr oder nach Vereinbarung (home). Not stated whether they apply to the new location

### Social media

| Channel | URL | Where | Checked 2026-11-12 |
|---|---|---|---|
| TikTok (Patrick) | https://www.tiktok.com/@patrickkurstadttattoo | home | account exists |
| TikTok (studio) | https://tiktok.com/@kurstadttattoo | kontakt | account exists |
| Instagram | https://instagram.com/kurstadttattoo/ | kontakt | not verifiable without login |
| Facebook | https://facebook.com/profile.php?id=61562038843611 | kontakt | not checked |
| YouTube | https://www.youtube.com/@KurstadtTattoo (channel name Kurstadttattoo Bad Nauheim) | author of all embedded videos (oEmbed) | channel exists |

### Team

- Patrick: unser Spezialist für realistische Porträts und feine Linien (unsere-kuenstler). Full name Patrick Wolf, Geschäftsführer of the operator (Impressum)
- The texts speak of several artists and piercers but name nobody else
- `images/team-frau-studio-shirt.jpg` shows a woman in a KurstadtTattoo shirt on the artists page, without name or role

### Operator and Impressum (kontakt-und-impressum, as published)

- RuW Lifestyle GmbH, Beneke Str. 9, 61231 Bad Nauheim
- Geschäftsführer: Patrick Wolf
- Telefon +49 1731605162, E-Mail Kurstadttattoo@web.de
- USt-ID DE323734171, Steuernummer 020 24293213
- Berufsbezeichnung: Tätowierer und Piercer
- Not willing or obliged to take part in consumer dispute resolution; refers to the EU ODR platform
- Design credit: Diese Website wurde von Fuckyou4ze Mediadesign umgesetzt
- Cites § 5 TMG and §§ 7 to 10 TMG; these references are outdated (TMG replaced by DDG) and must be checked when the new Impressum is written
- Footer: © 2024 - 2026 KurstadtTattoo Bad Nauheim, Mit Unterstützung von Webador

### Gutachter, Sachverständiger, Mediator (only for the secondary teaser to tattoogutachten.de)

Decision Log #14: no own content on the new site, only a short teaser and a footer link to https://www.tattoogutachten.de/. Stated on the old site: Patrick Wolf is geprüfter und zertifizierter Gutachter des DGuSV (seal 2026, Bestätigungs-Register Nr. DE-8#17024/70-03), einer von nur vier anerkannten Tattoo-Gutachtern in Deutschland, über 22 Jahre Erfahrung im Tattoo- und Piercinghandwerk, Mitglied im Bundesverband Tattoo, Laserspezialist für Tattooentfernung bis 2021, Erstberatungsgespräch kostenlos. Links on the old page: https://www.tattoogutachten.de/ and https://tattoogutachten.dgusv.de/.

### Videos (YouTube, embedded on the old site, titles via oEmbed)

| Video | Title | Page |
|---|---|---|
| 3XznCCfiK7s | Herzlich Willkommen bei Kurstadttattoo | home |
| oioWU94jZ1E | Fuchstattoo realistic | home |
| MhzPgwdSqKU | Wie bist du zum Tätowieren gekommen??? | unsere-kuenstler |
| -bt8M9ESxDc | Wie pflegt man ein #Tattoo | pflegetipps, FAQ |
| 5i6BeQQSOa0 | Darf man wieder bunt tätowieren? | FAQ |
| V07-y2oLB-k | Was kostet ein Tattoo | FAQ |
| XLK2HFlwZQc | Macht ihr auch Tattoos von anderen fertig? Ja, machen wir! | FAQ |
| mBovL93rZLQ | #Neurodermitis und #Tattoos | FAQ |
| UQ8yaqGwPgQ | Sind die Farben vegan! | FAQ |
| dVTYxFSH67I | Frage: Ist schon mal jemand #ohnmächtig geworden? Ja | FAQ |
| 198nUgRtIJU | Rücken#tattoo Xxl - #adlertattoo | galerie |
| xYoJRpQzUro | Tattoopfusch Anwalt und dann Gericht | sachverstaendigen |
| zAxaQblIOk4 | Verpfuschtes Tattoo und Geld zurück? | sachverstaendigen |

Only the titles are archived. What is said in the videos is not transcribed; do not use it as a fact without watching them.

## Images

All 47 images of the site. Webador serves `-standard` (800 px) and `-high` variants; the `-high` variant was downloaded wherever it exists, crop and resize parameters were removed. Size variants and re-uploads of the same picture were compared and stored once (no two files share a checksum). Four pictures exist only in standard size. Webador strips all metadata (no EXIF), so the origin of a picture can only be judged by looking at it. The old site has no alt texts.

Files starting with `nicht-verwenden-` must not be used on the new site.

### Do not use

| File | Shows | Reason |
|---|---|---|
| `nicht-verwenden-ki-illustration-taetowiert.jpg` | Cartoon: bald child covered in tattoos, text Es fing ganz harmlos an und plötzlich war ich überall TATOWIERT!, logo, phone | AI style illustration (visual assessment), og:image of home |
| `nicht-verwenden-ki-illustration-schmerz-vergaenglich.jpg` | Cartoon: child tattooing a red haired woman, text Schmerz ist vergänglich, Tattoos sind für immer, Instagram and phone | AI style illustration (visual assessment), og:image of home |
| `nicht-verwenden-stock-unsplash-taetowierer.jpg` | Bearded tattooer with blue gloves at work | Unsplash stock (served from `primary.jwwb.nl/unsplash/`), pflegetipps |
| `nicht-verwenden-stock-unsplash-rose.jpg` | Rose tattoo close up | Unsplash stock, pflegetipps |
| `nicht-verwenden-stock-unsplash-taetowieren-nahaufnahme.jpg` | Gloved hands tattooing an arm | Unsplash stock, header banner of gravur-service |

### Brand and notice

| File | Size | Shows | Page |
|---|---|---|---|
| `logo-kurstadttattoo-schwarz.png` | 1920x1920 | Logo, black on transparent | kontakt |
| `aushang-geschlossen-neueroeffnung-1-dezember.jpg` | 1122x1402 | Neon style notice: closed, reopening 1 December, Friedrich-Ebert-Platz 1A | home (og:image) |

### Patrick Wolf and team

Identified as Patrick Wolf by page context (artists page; Mediator page with Mein Name ist Patrick).

| File | Size | Shows | Page |
|---|---|---|---|
| `patrick-wolf-arme-verschraenkt-neonlogo.jpg` | 1536x2048 | Patrick with sunglasses, arms crossed, in front of the neon logo wall | unsere-kuenstler |
| `patrick-wolf-stehend-studio.jpg` | 1080x1882 | Patrick standing and smiling in a bright studio | schiedsrichter |
| `patrick-wolf-beim-taetowieren-breit.jpg` | 1120x642 | Patrick tattooing, landscape (standard size only) | sachverstaendigen |
| `patrick-wolf-sitzend-studio-breit.jpg` | 1286x642 | Patrick sitting at his workstation (standard size only) | sachverstaendigen |
| `patrick-wolf-sitzend-lachend-breit.jpg` | 922x633 | Patrick sitting and laughing at his workstation (standard size only) | pflegetipps |
| `team-frau-studio-shirt.jpg` | 984x1520 | Woman with curly hair in a KurstadtTattoo shirt in front of the neon wall, name and role unknown | unsere-kuenstler |

### Studio

The old site does not say which location these photos show.

| File | Size | Shows | Page |
|---|---|---|---|
| `studio-empfangstheke-schriftzug.jpg` | 1399x1848 | Reception counter with @KURSTADTTATTOO lettering | home |
| `studio-empfang-sitzbereich.jpg` | 1500x1640 | Reception and waiting area, hexagon ceiling light | home |
| `studio-pflanzen-wabenlicht.jpg` | 1500x2000 | Work area with plants and hexagon ceiling light | home |
| `studio-lampen-neonlogo-breit.jpg` | 1919x1029 | Pendant lamps, plants, round neon logo (standard size only) | header banner of sachverstaendigen |

### Gallery (tattoo work)

All on `/galerie`, in the order of the old gallery. Most photos carry the KurstadtTattoo watermark and stand in front of the pink neon logo wall.

| File | Size | Shows |
|---|---|---|
| `galerie-fuchs-farbe-unterarm.jpg` | 1024x1536 | Realistic fox in colour with leaves, forearm |
| `galerie-biomechanik-hand.png` | 1024x1388 | Biomechanical skeleton hand, back of the hand |
| `galerie-hai-koordinaten-oberarm.png` | 1298x1211 | Shark with coordinates, black and grey, arm |
| `galerie-schriftzuege-ewigkeit-dna-bein.jpg` | 941x1672 | Lettering (Ewigkeit, Its in my DNA, Der Osten), leg |
| `galerie-unterschrift-elvis-presley-fuss.png` | 1500x2000 | Signature lettering Elvis Presley, foot |
| `galerie-maori-blackwork-unterarm.png` | 941x1240 | Maori style blackwork (original file name maori1), forearm |
| `galerie-blackwork-arm-innen.jpg` | 1489x1671 | Geometric blackwork sleeve, inner side |
| `galerie-bluetenzweige-fuss.jpg` | 986x1343 | Blossom branches, foot |
| `galerie-bluete-handruecken.jpg` | 940x1531 | Flower, back of the hand |
| `galerie-libelle-fineline-unterarm.jpg` | 936x1233 | Fine line dragonfly with geometric line, forearm |
| `galerie-hase-farbe-wade.jpg` | 1119x1368 | Colour rabbit with moon, calf |
| `galerie-schlumpf-cyborg-wade.png` | 1024x1360 | Smurf as half cyborg in colour, calf |
| `galerie-kompass-family-rippen.jpg` | 940x1442 | Compass, Family lettering, heartbeat line and years, ribs |
| `galerie-ankh-strahlen-oberarm.png` | 1024x1380 | Ankh with knotwork and rays, upper arm |
| `galerie-tribal-hals-mann.jpg` | 1024x1108 | Tribal, neck and shoulder, man |
| `galerie-taetowieren-gesicht-verpixelt-logo.jpg` | 1536x2048 | Tattooing in progress, face blurred, large logo watermark |
| `galerie-tribal-hals-frau.png` | 1024x1400 | Tribal with spider web, neck, woman (shown twice in the gallery) |
| `galerie-kreuz-taube-unterarm.png` | 1024x1352 | Cross, dove and crown, forearm |
| `galerie-armband-valknut-unterarm.png` | 1024x1328 | Armband with valknut, forearm |
| `galerie-schach-koenig-unterarm.png` | 1024x1116 | Chess king, black and grey, forearm |
| `galerie-hundeportrait-pfote-unterarm.jpg` | 941x1672 | Dog portrait in a paw with name Charly and date, forearm |
| `galerie-schriftzug-memories-unterarm.jpg` | 1548x1500 | Lettering Memories, forearm |
| `galerie-blackwork-arm-aussen.jpg` | 1393x1623 | Same blackwork sleeve, outer side |
| `galerie-faust-mit-schrift-unterarm.jpg` | 941x1292 | Fist with lettering, forearm |
| `galerie-auge-dreieck-knie.png` | 1024x1248 | Eye in a triangle with ornaments, knee |

### Engraving

| File | Size | Shows | Page |
|---|---|---|---|
| `gravur-glas-logo.jpg` | 1356x2048 | Glass engraved with the logo | gravur-service |
| `gravur-tasse-schwarz-logo.jpg` | 1425x2048 | Black mug engraved with the logo | gravur-service |
| `gravur-holzscheibe-logo.jpg` | 1126x1382 | Wooden slice engraved with the logo | gravur-service |

### Gutachter (only for the tattoogutachten.de teaser, if at all)

| File | Size | Shows | Page |
|---|---|---|---|
| `siegel-dgusv-2026.png` | 308x500 | DGuSV seal 2026, Bestätigungs-Register Nr. DE-8#17024/70-03 | sachverstaendigen |
| `dgusv-gutachteremblem-monogramm.png` | 1920x640 | DGuSV emblem with monogram, Geprüfter und zertifizierter Gutachter des DGuSV | sachverstaendigen |

## Gaps (not on the old site: ask Patrick, never invent)

- Postcode, town and year of the new address Friedrich-Ebert-Platz 1A (only ticket #1 says 61231 Bad Nauheim and 1 Dec 2026)
- Opening hours at the new location
- Whether the studio photos show the old or the new location; photos of the new studio
- Founding year (footer only says © 2024 - 2026; the text says seit unserer Gründung without a year)
- Names, styles and photos of other artists and piercers; name and role of the woman in `team-frau-studio-shirt.jpg`
- Whether piercing and the engraving service continue at the new location
- Prices (only the video title Was kostet ein Tattoo)
- Written FAQ answers (the FAQ page has videos only)
- Hygiene details (procedures, certifications): the site only names Hygiene as a value
- Handelsregister entry of RuW Lifestyle GmbH (not in the Impressum); a privacy policy does not exist
- Consent of the customers shown in gallery photos for use on the new site
- Facebook page status (not checked), Instagram (not verifiable without login)
- Whether the pink neon wall behind the gallery photos is the real studio wall or a digital background
