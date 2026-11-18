# Fotobriefing für die Galerie

Offener Punkt aus dem UI Review (#11, `ui.md` Befund 7), festgehalten in #43. Empfänger: Patrick Wolf, über Marcello. Stand: 18. November 2026.

## Ausgangslage

Die 24 Arbeiten in `src/data/gallery.ts` stammen aus der Galerie der alten Website (`docs/source-content/images`). Die Website verwendet sie unverändert: Wasserzeichen werden nicht entfernt, nichts wird retuschiert oder nachgezeichnet. Für die Startseite sind deshalb die Fotos ohne großes Overlay als Leitarbeiten gewählt (Hundeporträt und Libelle in Feinlinie), die stark überlagerten Fotos stehen nur in der Galerie.

Gesichtet am 18. November 2026 (Dateien in `src/assets/images`, Breite × Höhe in Pixeln):

| Datei | Beobachtung |
| --- | --- |
| `galerie-schriftzug-memories-unterarm.jpg` (1548 × 1500) | Großes, halbtransparentes Logo mit Schriftzug BAD NAUHEIM über dem ganzen Bild, das Foto ist stark abgedunkelt, der Schriftzug selbst ist klein im Bild |
| `galerie-unterschrift-elvis-presley-fuss.png` (1500 × 2000) | Großer Schriftzug BAD NAUHEIM und Logo über dem Fuß, dunkle Vignette, die Unterschrift ist fein und nur klein zu sehen |
| Übrige 22 Fotos | Kleineres Logo KURSTADTTATTOO BAD NAUHEIM, bei vielen auf der Haut neben dem Motiv; Hintergrund meist das pinke Leuchtschild des alten Studios, Licht und Farbe wechseln von Foto zu Foto |

Die Auflösung reicht für die Website (alle Fotos mindestens 936 Pixel breit). Das Problem ist die uneinheitliche Aufnahme, nicht die Größe.

## Bitte an Patrick

1. Originalexporte ohne Wasserzeichen für die vorhandenen Arbeiten, soweit es sie gibt. Vorrang haben Memories und Elvis Presley, danach die Arbeiten auf der Startseite: Fuchs, Hundeporträt, Libelle, Schachkönig, Hase, Kompass, Blackwork am Arm.
2. Falls ein Kennzeichen gewünscht ist: ein kleines, einheitliches Logo immer in derselben Ecke, nie auf der Haut oder dem Motiv.
3. Kurze Bestätigung, dass die gezeigten Personen der Veröffentlichung zugestimmt haben (gilt auch für die bisherigen Fotos).

## Aufnahmeregeln für neue Fotos

- Licht: gleichmäßiges, neutrales Licht ohne farbigen Schein des Leuchtschilds auf der Haut; immer dieselbe Lichtquelle und derselbe Weißabgleich.
- Hintergrund: ruhig und neutral (dunkelgrau oder schwarz), ohne Logo, Schrift oder Neonschild.
- Zwei Aufnahmen je Arbeit: eine Gesamtansicht der ganzen Körperstelle, damit Platzierung und Größe erkennbar sind, und eine Detailansicht, in der Linien und Schattierungen scharf sind.
- Haut: Folie und Pflegecreme vor dem Foto abnehmen, keine Reflexionen auf dem Motiv.
- Format: Hochformat 4:5 als Regel, Querformat nur für breite Motive (zum Beispiel Schriftzug quer über den Unterarm). Mindestens 2000 Pixel an der langen Seite, JPG in hoher Qualität.
- Angaben je Arbeit: Motiv, Stil, Körperstelle und ob das Tattoo frisch gestochen oder abgeheilt ist. Diese Angaben gehen in Bildunterschriften und Alt-Texte; die Website ergänzt keine eigenen.
- Gesichter nur mit Einwilligung der Person zeigen.

## Umsetzung auf der Website

Sobald neue Fotos vorliegen: Dateien in `src/assets/images` ersetzen (gleiche Dateinamen oder Import in `src/data/gallery.ts` anpassen), die Rahmung je Arbeit (`framing`) bei 375 und 1280 Pixeln prüfen, die Leitarbeiten (`leadWorks`) nach der Bildqualität neu wählen und Bildunterschriften und Alt-Texte in `src/i18n/de.json` und `src/i18n/en.json` nur mit den gelieferten Angaben ergänzen.
