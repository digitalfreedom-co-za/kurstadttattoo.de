# kurstadttattoo.de

Neue Website von KurstadtTattoo, dem Tattoo Studio von Patrick Wolf in Bad Nauheim. Statische Astro Seite auf GitHub Pages, zweisprachig Deutsch und Englisch. Aufbau wie [tattoogutachten.de](https://github.com/digitalfreedom-co-za/tattoogutachten.de), Standards aus dem Wiki (`websites.md`).

Vorschau: https://digitalfreedom-co-za.github.io/kurstadttattoo.de/ (noindex)

## Stack

| Bereich | Werkzeug |
|---|---|
| Framework | Astro 6, statische Ausgabe, `build.format: 'directory'`, `trailingSlash: 'always'` |
| Styling | Tailwind CSS 4 über `@tailwindcss/vite`, Konfiguration im CSS per `@theme` |
| SEO | `@astrojs/sitemap` mit hreflang Alternativen, JSON-LD, `robots.txt` als Endpoint |
| Bilder | `sharp` (Astro Bildpipeline) |
| Sprache | TypeScript strict, geprüft mit `@astrojs/check` |
| Node | ab 22.12 (`engines` in `package.json`) |
| Hosting | GitHub Pages, Deploy per GitHub Actions bei Push auf `main` |

Vite ist per `overrides` auf 7.3.8 festgelegt, damit `@tailwindcss/vite` dieselbe Vite Version nutzt wie Astro 6 (Wiki, Vite pin).

## Befehle

| Befehl | Zweck |
|---|---|
| `npm install` | Abhängigkeiten installieren |
| `npm run dev` | Entwicklungsserver unter http://localhost:4321/kurstadttattoo.de/ |
| `npm run check` | Typprüfung aller `.astro` und `.ts` Dateien |
| `npm run build` | Produktionsbuild nach `dist/` |
| `npm run validate:jsonld` | Prüft JSON-LD, canonical und hreflang aller Seiten in `dist/` |
| `npm run preview` | Build lokal ansehen |

## Struktur

```text
src/
  assets/images/       Bilder für die Astro Bildpipeline
  components/
    layout/            Kopf, Fuß, Sprachwechsel
    seo/               SeoHead (Meta, canonical, hreflang, Open Graph), JsonLd
    ui/                Wiederverwendbare Bausteine
    booking/           Terminbuchung
  config/site.ts       Zentrale Fakten der Seite und Schalter PUBLIC_INDEXABLE
  content/             Inhalte als Markdown
  data/                Strukturierte Daten
  i18n/                de.json, en.json, Routentabelle routes.ts
  layouts/             BaseLayout
  lib/                 url() Helfer, Basispfad, JSON-LD
  pages/               Deutsch im Wurzelverzeichnis, Englisch unter en/
  scripts/             Clientseitige Skripte
  styles/global.css    Tailwind Einstieg
scripts/validate-jsonld.mjs   JSON-LD und hreflang Prüfung im CI
docs/                          Quellinhalte der alten Seite, Wettbewerbsanalyse
```

## Zweisprachigkeit

Deutsch ist die Standardsprache im Wurzelverzeichnis, Englisch liegt unter `/en/` mit übersetzten URL Segmenten. Jede Seite hat einen Eintrag in `src/i18n/routes.ts` mit ihrem Pfad je Sprache. Daraus entstehen die hreflang Links im Kopf (plus `x-default` auf die deutsche Startseite), der Sprachwechsel und die Alternativen in der Sitemap. Texte stehen in `src/i18n/de.json` und `src/i18n/en.json`; fehlt ein Schlüssel im Englischen, schlägt `npm run check` fehl. Es gibt keine automatische Weiterleitung nach Browsersprache.

Neue Seite anlegen:

1. Eintrag in `routes` ergänzen, z. B. `gallery: { de: '/galerie/', en: '/en/gallery/' }`
2. Texte in beiden JSON Dateien ergänzen
3. `src/pages/galerie.astro` und `src/pages/en/gallery.astro` anlegen und `BaseLayout` mit `locale` und `routeKey` aufrufen

## Basispfad und Links

Die Vorschau läuft unter dem Basispfad `/kurstadttattoo.de`. Interne Links und Dateien aus `public/` laufen deshalb immer über den Helfer `url()` aus `src/lib/url.ts`, nie als feste Pfade:

```astro
<a href={url('/galerie/')}>Galerie</a>
```

Seiten bekommen automatisch einen abschließenden Schrägstrich, Dateien nicht. Absolute URLs für canonical, hreflang und JSON-LD liefert `absoluteUrl()`.

## Indexierung

Der Schalter `PUBLIC_INDEXABLE` (gesetzt im Deploy Workflow) steuert die Suchmaschinen. Auf der github.io Vorschau steht er auf `false`: jede Seite trägt `noindex`, `robots.txt` erlaubt das Crawlen trotzdem, damit das `noindex` gelesen wird. Die 404 Seite ist nie indexierbar.

## Deploy

`.github/workflows/deploy.yml` läuft bei jedem Push auf `main`: `npm ci`, `astro check`, Build, JSON-LD Prüfung, Upload als Pages Artefakt, Deploy. Pull Requests prüft zusätzlich `.github/workflows/commit-policy.yaml` mit der Commit Message Policy aus `org-ci-config`. Die Prüfung steht direkt im Repository, weil ein öffentliches Repository keine Workflows aus dem privaten `org-ci-config` aufrufen darf. Die CodeQL Analyse für JavaScript, TypeScript und die Workflows läuft über `.github/workflows/codeql.yml` bei jedem Pull Request, jedem Push auf `main` und wöchentlich. Das Default Setup in den Repository Einstellungen bleibt aus, weil es neben dem Workflow nicht laufen darf. Dependabot schlägt wöchentlich Updates vor, Astro Major Updates und Vite Major Updates sind ausgenommen.

## Domainwechsel auf www.kurstadttattoo.de

Erst nach Freigabe. DNS wird nur auf ausdrückliche Anweisung geändert.

1. In `astro.config.mjs` das Objekt `SITE` umstellen: `url: 'https://www.kurstadttattoo.de'`, `base: '/'`
2. Datei `public/CNAME` mit dem Inhalt `www.kurstadttattoo.de` anlegen
3. In `.github/workflows/deploy.yml` `PUBLIC_INDEXABLE: 'true'` setzen
4. DNS bei INWX: `CNAME` für `www` auf `digitalfreedom-co-za.github.io`, für die nackte Domain `A` Records auf `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` und `AAAA` Records auf `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
5. In den Pages Einstellungen des Repositorys die Custom Domain eintragen und Enforce HTTPS aktivieren
6. Build und Deploy, danach canonical, `robots.txt` und `sitemap-index.xml` auf der neuen Domain prüfen

Da alle Links über `url()` und `absoluteUrl()` laufen, braucht es dafür keine weiteren Codeänderungen.
