// llms.txt (short) and llms-full.txt (fact dense) per llmstxt.org, German at the root, English under /en/.
// The framing sentences are written here per locale; every fact (address, hours, styles, steps, care,
// answers) comes from the same config and dictionaries as the pages, so the files never drift from the
// site. Only stated facts: no prices, no ratings, no certifications (ticket #9, wiki websites.md).
import { studio, operator, expertSite } from '../config/site';
import { CAL_IS_DEMO } from '../config/booking';
import { faqEntries, faqGroups } from '../data/faq';
import { absoluteUrl } from './url';
import { fillStudio } from './placeholders';
import { hasMarkdown, markdownPath } from './page-markdown';
import { localizedPath, t, type Locale, type RouteKey } from '../i18n';

/** Date the facts in these files were last checked against the source content. */
const factsAsOf = '2026-11-12';

const copy = {
  de: {
    positioning: `${studio.name} ist das Tattoo Studio von ${studio.artist} in Bad Nauheim in der Wetterau, nahe Friedberg und Frankfurt am Main. Schwerpunkte sind realistische Porträts und Fine Line; Kunst, Hygiene und persönliche Beratung stehen im Mittelpunkt.`,
    facts: [
      `Studio: ${studio.address.street}, ${studio.address.postalCode} ${studio.address.city}, Hessen, Deutschland (neuer Standort ab dem 1. Dezember 2026, vorher Parkstr. 22 in Bad Nauheim)`,
      'Neueröffnung: 1. Dezember 2026. Bis dahin ist das Studio geschlossen.',
      'Öffnungszeiten bisher: Montag bis Freitag 12 bis 18 Uhr oder nach Vereinbarung. Die Zeiten am neuen Standort sind noch nicht bestätigt.',
      `Termine: telefonisch unter ${studio.phone.display}${CAL_IS_DEMO ? '' : ' oder Beratungstermin online buchen'}`,
      `E-Mail: ${studio.email.display}`,
      `Tätowierer: ${studio.artist}`,
      'Einzugsgebiet: Bad Nauheim, Friedberg, Butzbach, Rosbach, Ober-Mörlen, Wetterau, Bad Vilbel, Frankfurt am Main',
      'Sprachen der Website: Deutsch (diese Fassung, Standard), Englisch (unter /en/)',
    ],
    sections: { pages: 'Seiten', studio: 'Studio und Kontakt', optional: 'Optional' },
    fullLink: 'Vollständige Fassung für Sprachmodelle',
    fullNote: 'Alle Fakten, Ablauf, Pflege und Antworten in einer Datei.',
    otherLocale: 'English version',
    expertNote: `Gutachten zu Tätowierungen und Piercings von ${studio.artist} gibt es auf einer eigenen Website, nicht in diesem Studio.`,
    headings: {
      who: 'Wer',
      where: 'Standort und Öffnungszeiten',
      art: 'Kunst und Stile',
      process: 'Ablauf eines Tattoos',
      hygiene: 'Hygiene',
      care: 'Pflege nach dem Stechen',
      faq: 'Häufige Fragen',
      contact: 'Kontakt',
      legal: 'Rechtliches',
    },
    who: `${studio.artist} führt das Tattoo Studio KurstadtTattoo in Bad Nauheim und tätowiert dort selbst. Er ist spezialisiert auf realistische Porträts und Fine Line.`,
    hygiene: 'Hygiene, Professionalität und Kundenzufriedenheit sind seit der Gründung die Werte, nach denen im Studio gearbeitet wird. Zur sauberen Arbeit gehört auch die Zeit nach dem Termin: Kunden erhalten Pflegehinweise und eine Nachsorge.',
    legal: `Betreiber der Website: ${operator.name}, ${operator.street}, ${operator.postalCode} ${operator.city}, Geschäftsführer ${operator.managingDirector}, ${operator.registerCourt}, ${operator.registerNumber}.`,
    updated: 'Stand der Angaben',
  },
  en: {
    positioning: `${studio.name} is the tattoo studio of ${studio.artist} in Bad Nauheim in the Wetterau region of Germany, near Friedberg and Frankfurt am Main. Its focus is realistic portraits and fine line; art, hygiene and personal consultation come first.`,
    facts: [
      `Studio: ${studio.address.street}, ${studio.address.postalCode} ${studio.address.city}, Hesse, Germany (new location from 1 December 2026, previously Parkstr. 22 in Bad Nauheim)`,
      'Reopening: 1 December 2026. The studio is closed until then.',
      'Previous opening hours: Monday to Friday, 12 noon to 6 pm or by appointment. Hours at the new location are not confirmed yet.',
      `Appointments: by phone at ${studio.phone.display}${CAL_IS_DEMO ? '' : ' or book a consultation online'}`,
      `Email: ${studio.email.display}`,
      `Tattoo artist: ${studio.artist}`,
      'Area served: Bad Nauheim, Friedberg, Butzbach, Rosbach, Ober-Mörlen, Wetterau region, Bad Vilbel, Frankfurt am Main',
      'Website languages: German (default, at the root), English (this version, under /en/)',
    ],
    sections: { pages: 'Pages', studio: 'Studio and contact', optional: 'Optional' },
    fullLink: 'Full version for language models',
    fullNote: 'All facts, process, aftercare and answers in one file.',
    otherLocale: 'German version (Deutsch)',
    expertNote: `Expert reports on tattoos and piercings by ${studio.artist} are offered on a separate website, not by this studio.`,
    headings: {
      who: 'Who',
      where: 'Location and opening hours',
      art: 'Art and styles',
      process: 'How a tattoo comes about',
      hygiene: 'Hygiene',
      care: 'Aftercare',
      faq: 'Frequently asked questions',
      contact: 'Contact',
      legal: 'Legal',
    },
    who: `${studio.artist} runs the KurstadtTattoo tattoo studio in Bad Nauheim and tattoos there himself. He specialises in realistic portraits and fine line.`,
    hygiene: 'Hygiene, professionalism and customer satisfaction have been the values the studio works by since it was founded. Clean work includes the time after the session: clients get care instructions and aftercare.',
    legal: `Website operator: ${operator.name}, ${operator.street}, ${operator.postalCode} ${operator.city}, Germany, managing director ${operator.managingDirector}, ${operator.registerCourt}, ${operator.registerNumber}.`,
    updated: 'Facts as of',
  },
} satisfies Record<Locale, unknown>;

/** Content pages listed in llms.txt, in this order. Descriptions come from the page meta. */
const contentPages: RouteKey[] = ['home', 'gallery', 'artists', 'hygiene', 'consultation', 'aftercare', 'faq'];
// The booking page is listed only once it books real studio appointments (not the cal.com demo of the preview).
const studioPages: RouteKey[] = CAL_IS_DEMO ? ['contact', 'engraving'] : ['contact', 'booking', 'engraving'];

function pageLink(key: RouteKey, locale: Locale, base: URL | undefined): string {
  const dict = t(locale);
  const page = dict.pages[key as keyof typeof dict.pages];
  const label = dict.nav.items[key as keyof typeof dict.nav.items];
  const note = 'description' in page ? fillStudio(page.description) : '';
  // Content pages link their Markdown version (llmstxt.org), the rest their HTML page.
  const path = hasMarkdown(key) ? markdownPath(key, locale) : localizedPath(key, locale);
  return `- [${label}](${absoluteUrl(path, base)})${note ? `: ${note}` : ''}`;
}

const otherLocale = (locale: Locale): Locale => (locale === 'de' ? 'en' : 'de');
const header = (locale: Locale) => [`# ${studio.name}`, '', `> ${copy[locale].positioning}`, ''];

export function llmsSummary(locale: Locale, base: URL | undefined): string {
  const c = copy[locale];
  const home = localizedPath('home', locale);
  return [
    ...header(locale),
    ...c.facts.map((fact) => `- ${fact}`),
    '',
    `## ${c.sections.pages}`,
    ...contentPages.map((key) => pageLink(key, locale, base)),
    '',
    `## ${c.sections.studio}`,
    ...studioPages.map((key) => pageLink(key, locale, base)),
    '',
    `## ${c.sections.optional}`,
    `- [${c.fullLink}](${absoluteUrl(`${home}llms-full.txt`, base)}): ${c.fullNote}`,
    `- [${c.otherLocale}](${absoluteUrl(`${localizedPath('home', otherLocale(locale))}llms.txt`, base)})`,
    `- [${t(locale).nav.items.imprint}](${absoluteUrl(localizedPath('imprint', locale), base)})`,
    `- [${t(locale).nav.items.privacy}](${absoluteUrl(localizedPath('privacy', locale), base)})`,
    `- [${expertSite.display}](${expertSite.href}): ${c.expertNote}`,
    '',
  ].join('\n');
}

export function llmsFull(locale: Locale, base: URL | undefined): string {
  const c = copy[locale];
  const dict = t(locale);
  const h = c.headings;
  const aftercare = dict.pages.aftercare;
  const faqIds = faqGroups.flatMap((group) => group.ids);

  return [
    ...header(locale),
    `${c.updated}: ${factsAsOf}. Website: ${absoluteUrl(localizedPath('home', locale), base)}`,
    '',
    `## ${h.who}`,
    '',
    c.who,
    '',
    `## ${h.where}`,
    '',
    ...c.facts.slice(0, 3).map((fact) => `- ${fact}`), // address, reopening, hours
    `- ${locale === 'de' ? 'Route' : 'Directions'}: ${studio.mapHref}`,
    '',
    `## ${h.art}`,
    '',
    dict.pages.home.art.intro,
    '',
    ...dict.pages.home.art.styles.map((style) => `- ${style.title}: ${style.text}`),
    '',
    `## ${h.process}`,
    '',
    ...dict.process.steps.map((step, index) => `${index + 1}. ${step.title}: ${step.text}`),
    '',
    `## ${h.hygiene}`,
    '',
    c.hygiene,
    '',
    `## ${h.care}`,
    '',
    aftercare.phases.intro,
    '',
    ...aftercare.phases.items.flatMap((phase) => [`${phase.title}:`, ...phase.points.map((point) => `- ${point}`), '']),
    `${aftercare.warning.title} ${aftercare.warning.text}`,
    '',
    `## ${h.faq}`,
    '',
    ...faqEntries(faqIds, locale).flatMap((entry) => [`### ${entry.question}`, '', entry.answer, '']),
    `## ${h.contact}`,
    '',
    `- ${dict.studio.phoneLabel}: ${studio.phone.display}`,
    `- ${dict.studio.emailLabel}: ${studio.email.display}`,
    `- TikTok: ${studio.studioTiktok.handle} (${studio.studioTiktok.href}), ${studio.artist} ${studio.tiktok.handle} (${studio.tiktok.href})`,
    `- YouTube: ${studio.youtube.handle} (${studio.youtube.href})`,
    ...(CAL_IS_DEMO ? [] : [`- ${dict.nav.items.booking}: ${absoluteUrl(localizedPath('booking', locale), base)}`]),
    '',
    `## ${h.legal}`,
    '',
    c.legal,
    `${c.expertNote} ${expertSite.href}`,
    '',
  ].join('\n');
}

export const textResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
