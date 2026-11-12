// Markdown version of every content page per llmstxt.org: the same text as the HTML page, without
// layout, images or scripts. With build.format 'directory' it lives at <page url>index.md (wiki
// websites.md); the HTML page points to it with a text/markdown alternate and llms.txt links it.
// Every sentence comes from the dictionaries, src/config and src/data, exactly as the pages use them,
// so the Markdown never says more than the page.
import { CAL_IS_DEMO } from '../config/booking';
import { expertSite, reopening, studio } from '../config/site';
import { faqEntries, faqGroups, featuredFaqIds } from '../data/faq';
import { galleryItems, styleGroups } from '../data/gallery';
import { videos, type VideoId } from '../data/videos';
import { absoluteUrl } from './url';
import { fillStudio } from './placeholders';
import { localizedPath, t, type Locale, type RouteKey } from '../i18n';

/** Pages with a Markdown version. The booking page joins once it books real studio appointments. */
export const markdownPages: RouteKey[] = [
  'home',
  'gallery',
  'artists',
  'hygiene',
  'consultation',
  'aftercare',
  'faq',
  'contact',
  'engraving',
  ...(CAL_IS_DEMO ? [] : (['booking'] as const)),
];

export const hasMarkdown = (key: RouteKey | undefined): key is RouteKey => key !== undefined && markdownPages.includes(key);

/** Site path (without base) of the Markdown version of a page. */
export const markdownPath = (key: RouteKey, locale: Locale): string => `${localizedPath(key, locale)}index.md`;

type Block = string | string[] | false | undefined;

/** Joins blocks with one blank line between them; arrays are lines without blank lines (lists). */
const join = (...blocks: Block[]): string =>
  blocks
    .filter((block): block is string | string[] => Boolean(block) && (!Array.isArray(block) || block.length > 0))
    .map((block) => (Array.isArray(block) ? block.join('\n') : block))
    .join('\n\n');

const section = (title: string, ...blocks: Block[]) => join(`## ${title}`, ...blocks);
const subsection = (title: string, ...blocks: Block[]) => join(`### ${title}`, ...blocks);
const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`);
const numbered = (items: readonly string[]) => items.map((item, index) => `${index + 1}. ${item}`);
const titled = (items: readonly { title: string; text: string }[]) => bullets(items.map((item) => `${item.title}: ${item.text}`));
const videoList = (ids: VideoId[], locale: Locale) =>
  bullets(videos(ids, locale).map((video) => `[${video.title}](${video.href}): ${video.text}`));

/** Phone and email as the page shows them in its location, support and closing sections. */
const contactList = (locale: Locale) =>
  bullets([`${t(locale).studio.phoneLabel}: ${studio.phone.display}`, `${t(locale).studio.emailLabel}: ${studio.email.display}`]);

function pageBody(key: RouteKey, locale: Locale, base: URL | undefined): string {
  const dict = t(locale);
  const pages = dict.pages;
  const link = (target: RouteKey) => absoluteUrl(localizedPath(target, locale), base);
  const { address } = studio;
  const addressLine = `${studio.name}, ${address.street}, ${address.postalCode} ${address.city}, ${dict.studio.country}`;
  const contactLines = contactList(locale);
  const hours = join(`${dict.studio.hoursLabel}: ${dict.studio.hours}, ${dict.studio.hoursNote}.`, dict.studio.hoursUnconfirmed);
  const reopeningNotice = reopening.active && subsection(dict.reopening.title, dict.reopening.text);
  const steps = numbered(dict.process.steps.map((step) => `${step.title}: ${step.text}`));
  const expert = (copy: { title: string; text: string; link: string }) =>
    section(copy.title, copy.text, `[${copy.link}](${expertSite.href})`);

  switch (key) {
    case 'home': {
      const copy = pages.home;
      return join(
        copy.hero.intro,
        section(copy.art.title, copy.art.intro, titled(copy.art.styles), `[${copy.art.galleryLink}](${link('gallery')})`),
        section(copy.hygiene.title, copy.hygiene.intro, copy.hygiene.text, `${copy.hygiene.careTitle}:`, bullets(copy.hygiene.care)),
        section(copy.process.title, copy.process.intro, steps, `[${copy.process.consultationLink}](${link('consultation')})`),
        section(copy.artists.title, copy.artists.lead, copy.artists.text, `[${copy.artists.artistsLink}](${link('artists')})`),
        section(copy.location.title, copy.location.intro, reopeningNotice, addressLine, `[${copy.location.mapLink}](${studio.mapHref})`, hours, contactLines),
        section(copy.faq.title, ...faqEntries(featuredFaqIds, locale).map((entry) => subsection(entry.question, entry.answer))),
        expert(copy.expert),
        section(copy.cta.title, copy.cta.text, contactLines),
      );
    }
    case 'gallery': {
      const copy = pages.gallery;
      return join(
        ...styleGroups.map((group) =>
          section(
            copy.groups[group.id].title,
            copy.groups[group.id].intro,
            bullets(galleryItems(group.works, locale).map((item) => `${item.title} (${item.meta}): ${item.alt}`)),
          ),
        ),
        section(copy.ownDesign.title, copy.ownDesign.text, `[${copy.ownDesign.link}](${link('consultation')})`),
        section(copy.video.title, copy.video.text, videoList(['eagleBack'], locale)),
      );
    }
    case 'artists': {
      const copy = pages.artists;
      return join(
        section(copy.focus.title, copy.focus.intro, titled(copy.focus.items)),
        section(copy.values.title, copy.values.lead, copy.values.text, titled(copy.values.items)),
        section(
          copy.story.title,
          copy.story.text,
          videoList(['howStarted', 'finishing'], locale),
          `${dict.studio.tiktok}: [${studio.tiktok.handle}](${studio.tiktok.href})`,
        ),
        expert(copy.expert),
      );
    }
    case 'hygiene': {
      const copy = pages.hygiene;
      return join(
        section(copy.value.title, copy.value.intro, titled(copy.value.items)),
        section(copy.studio.title, copy.studio.intro, bullets(copy.studio.figures.map((figure) => figure.caption)), copy.studio.questions, contactLines),
        section(
          copy.healing.title,
          copy.healing.intro,
          bullets(copy.healing.items),
          subsection(copy.healing.warningTitle, copy.healing.warning),
          `[${copy.healing.link}](${link('aftercare')})`,
        ),
      );
    }
    case 'consultation': {
      const copy = pages.consultation;
      return join(
        section(copy.process.title, copy.process.intro, steps),
        section(copy.bring.title, copy.bring.intro, titled(copy.bring.items)),
        section(copy.plan.title, copy.plan.lead, copy.plan.text, `[${copy.plan.link}](${link('gallery')})`),
        section(copy.cost.title, copy.cost.text, videoList(['cost'], locale)),
      );
    }
    case 'aftercare': {
      const copy = pages.aftercare;
      return join(
        section(
          copy.phases.title,
          copy.phases.intro,
          ...copy.phases.items.map((phase, index) => subsection(`${copy.phases.prefix} ${index + 1}: ${phase.title}`, bullets(phase.points))),
        ),
        section(copy.warning.title, copy.warning.text),
        section(copy.support.title, copy.support.text, contactLines, videoList(['care'], locale)),
      );
    }
    case 'faq': {
      const copy = pages.faq;
      return join(
        ...faqGroups.map((group) =>
          section(copy.groups[group.id].title, ...faqEntries(group.ids, locale).map((entry) => subsection(entry.question, entry.answer))),
        ),
        section(copy.videos.title, copy.videos.intro, videoList(['cost', 'colour', 'eczema', 'vegan', 'fainting', 'care', 'finishing'], locale)),
      );
    }
    case 'contact': {
      const copy = pages.contact;
      return join(
        section(
          copy.details.title,
          copy.details.intro,
          addressLine,
          `[${pages.home.location.mapLink}](${studio.mapHref})`,
          bullets([
            `${dict.studio.phoneLabel}: ${studio.phone.display} (${copy.details.phoneNote})`,
            `${dict.studio.emailLabel}: ${studio.email.display} (${copy.details.emailNote})`,
          ]),
          hours,
          copy.details.region,
        ),
        reopening.active && section(dict.reopening.title, dict.reopening.text, subsection(copy.oldAddress.title, copy.oldAddress.text)),
        section(
          copy.follow.title,
          bullets([
            `${dict.studio.tiktok}: [${studio.tiktok.handle}](${studio.tiktok.href})`,
            `${copy.follow.studioTiktok}: [${studio.studioTiktok.handle}](${studio.studioTiktok.href})`,
            `${copy.follow.youtube}: [${studio.youtube.handle}](${studio.youtube.href})`,
          ]),
        ),
        expert(copy.expert),
      );
    }
    case 'engraving': {
      const copy = pages.engraving;
      const examples = Object.values(copy.examples.items);
      return join(
        section(copy.materials.title, copy.materials.intro, ...copy.materials.items.map((material) => subsection(material.title, bullets(material.points)))),
        section(copy.examples.title, copy.examples.intro, bullets(examples.map((item) => `${item.title} (${item.meta}): ${item.alt}`))),
      );
    }
    case 'booking': {
      const copy = pages.booking;
      return join(
        section(copy.calendar.title, copy.calendar.intro, `[${dict.booking.label}](${link('booking')})`, contactLines),
        section(copy.prepare.title, copy.prepare.intro, titled(copy.prepare.items), `[${copy.prepare.consultationLink}](${link('consultation')})`),
      );
    }
    default:
      throw new Error(`No Markdown version for the page ${key}`);
  }
}

/** The Markdown version of a page: H1, lead, the page sections and, for subpages, the closing call with contacts. */
export function pageMarkdown(key: RouteKey, locale: Locale, base: URL | undefined): string {
  const dict = t(locale);
  const htmlUrl = absoluteUrl(localizedPath(key, locale), base);
  if (key === 'home') {
    const copy = dict.pages.home;
    return `${join(`# ${copy.hero.heading}`, `> ${fillStudio(copy.description)}`, `Website: ${htmlUrl}`, pageBody(key, locale, base))}\n`;
  }
  const copy = dict.pages[key as Exclude<RouteKey, 'home' | 'imprint' | 'privacy'>];
  return `${join(
    `# ${copy.heading}`,
    `> ${fillStudio(copy.lead)}`,
    `Website: ${htmlUrl}`,
    pageBody(key, locale, base),
    // The closing call (CtaBand) always offers the phone number and the email as well.
    section(copy.cta.title, fillStudio(copy.cta.text), contactList(locale)),
  )}\n`;
}

export const markdownResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
