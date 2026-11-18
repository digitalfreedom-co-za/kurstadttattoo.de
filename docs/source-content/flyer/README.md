# Studio flyer (November 2026)

Print and social material of the studio, sent by Marcello on 2026-11-18 as `kurstadttattoo-flyer.tgz`. The three files are archived unchanged. They are the source of the colour system of the site (#52).

| File | Size | Content |
|---|---|---|
| `flyer-hochformat.jpg` | 861 x 1827 | Portrait flyer: logo lettering, statue and fountain, services, opening hours, address, phone, e-mail, web address |
| `banner-logo.jpg` | 1774 x 887 | Logo banner: KurstadtTattoo lettering, fountain, Bad Nauheim in script |
| `banner-umgezogen.jpg` | 2048 x 682 | Moving banner: new address Friedrich-Ebert-Platz 1a, 61231 Bad Nauheim |

## Facts stated on the flyer

All of them match `src/config/site.ts`: Friedrich-Ebert-Platz 1a, 61231 Bad Nauheim; 0173 160 51 62; kurstadttattoo@web.de; Montag bis Freitag 12 bis 18 Uhr oder nach Vereinbarung. The flyer also lists Tattoos, Piercings and Gutachten, the claims Kunst, Leidenschaft, Charakter and Mehr als Tinte / More than ink. The images show AI style artwork (statue, fountain, gold splashes): use the colours, not the pictures.

## Colours

Sampled with sharp from fixed regions of the three files (most frequent colours in 8 step buckets, average of the brightest quarter for thin glyphs):

| Region | Sampled | Used as |
|---|---|---|
| Background, all three files | `#070503` to `#0b0703`, brightest areas `#1b1308` | `night` / dark `wall` `#0b0703`, `night-soft` `#18120a` |
| Script lettering Tattoo, logo banner (average) | `#e5bd63` | `gold-glow`, dark `gold` |
| Icon rings, flyer (average) | `#dab16c`, highlights `#f8d890` to `#f8e0a0` | basis of the gold, not used directly |
| Gold text 12 bis 18 Uhr, address on the banner | `#f8e0a0` to `#fcf3ab` | too pale for small text on light; not used |
| Dark edges of the gold glyphs | `#a89868` to `#b09868` | darkened to `#7a5a1e` = `gold` on the light wall (5.73:1) |
| Body text and spaced capitals | `#f8f8f0` to `#fffff8` | `chalk` / dark `ink` `#f8f4e8` |

Contrast (WCAG 2.2): `gold` `#7a5a1e` on wall `#f7f3ea` 5.73:1 and on wall-deep `#ede5d3` 5.06:1; `gold-glow` `#e5bd63` on night 11.27:1 and on night-soft 10.44:1; chalk on night 18.26:1; chalk-muted `#b3a892` on night-soft 7.91:1; muted `#5c5246` on wall 6.89:1. Bright gold never stands on the light wall.

## Type cues

- Display: distressed serif capitals (KURSTADT) with a brush script (Tattoo, Bad Nauheim). The site keeps Syne and Instrument Sans; a lettering face is part of the logo, not of running text.
- Body: a book serif in mixed case, centred.
- Small text: widely tracked capitals (KUNST, LEIDENSCHAFT, CHARAKTER, MORE THAN INK). Taken over as the wider tracking of the `.label` style (0.18em).
- Thin gold rules separate the blocks. Taken over as the gold basin rule of the section openers.
