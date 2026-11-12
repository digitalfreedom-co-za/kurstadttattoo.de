// JSON-LD graph. Every page carries the site wide entities (WebSite, the studio as TattooParlor, the
// operating company, Patrick Wolf, the OG image of its locale) plus its own WebPage, BreadcrumbList and
// page nodes, all linked by @id. Entities keep one @id across both locales; their texts follow the page
// locale. Only stated facts: no ratings, no awards, no price range (wiki websites.md, ticket #9).
import { site, studio, operator, expertSite, ogImage, reopening } from '../config/site';
import { absoluteUrl } from './url';
import { t, locales, localeMeta, localizedPath, type Dictionary, type Locale, type RouteKey } from '../i18n';

export type JsonLdNode = Record<string, unknown>;

const ref = (id: string) => ({ '@id': id });
const rootId = (base: URL | undefined, name: string) => `${absoluteUrl('/', base)}#${name}`;

export const websiteId = (base: URL | undefined) => rootId(base, 'website');
export const studioId = (base: URL | undefined) => rootId(base, 'studio');
export const companyId = (base: URL | undefined) => rootId(base, 'company');
export const personId = (base: URL | undefined) => rootId(base, 'patrick-wolf');
export const ogImageId = (base: URL | undefined, locale: Locale) => rootId(base, `og-image-${locale}`);
export const webPageId = (path: string, base: URL | undefined) => `${absoluteUrl(path, base)}#webpage`;
export const breadcrumbId = (path: string, base: URL | undefined) => `${absoluteUrl(path, base)}#breadcrumb`;

/** Services of the studio; each lives on the page that describes it. */
const services = [
  { key: 'tattoo', route: 'gallery' },
  { key: 'consultation', route: 'consultation' },
  { key: 'engraving', route: 'engraving' },
] as const satisfies { key: keyof Dictionary['seo']['services']; route: RouteKey }[];

const telephone = studio.phone.href.replace('tel:', '');
const email = studio.email.display;

/** schema.org subtype of the WebPage node per route; pages not listed are plain WebPage. */
const pageTypes: Partial<Record<RouteKey, string>> = {
  gallery: 'CollectionPage',
  artists: 'AboutPage',
  contact: 'ContactPage',
};

/** The main entity a page is about: the company for the legal pages, Patrick on his page, else the studio. */
function pageSubject(routeKey: RouteKey | undefined, base: URL | undefined) {
  if (routeKey === 'imprint' || routeKey === 'privacy') return ref(companyId(base));
  if (routeKey === 'artists') return ref(personId(base));
  return ref(studioId(base));
}

/**
 * The entities every page carries, in the texts of the page locale. portraitUrl: absolute URL of the
 * optimised portrait of Patrick Wolf.
 */
export function siteGraph(base: URL | undefined, locale: Locale, portraitUrl: string): JsonLdNode[] {
  const dict = t(locale);
  const copy = dict.seo;
  const home = absoluteUrl(localizedPath('home', locale), base);
  const imageUrl = absoluteUrl(ogImage.path[locale], base);

  return [
    {
      '@type': 'WebSite',
      '@id': websiteId(base),
      name: site.name,
      alternateName: [studio.name, site.domain],
      url: absoluteUrl('/', base),
      description: copy.websiteDescription,
      inLanguage: locales.map((code) => localeMeta[code].lang),
      publisher: ref(companyId(base)),
      about: ref(studioId(base)),
    },
    {
      '@type': 'TattooParlor',
      '@id': studioId(base),
      name: studio.name,
      alternateName: site.name,
      description: copy.studioDescription,
      url: home,
      telephone,
      email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: studio.address.street,
        postalCode: studio.address.postalCode,
        addressLocality: studio.address.city,
        addressRegion: studio.region,
        addressCountry: studio.address.countryCode,
      },
      geo: { '@type': 'GeoCoordinates', latitude: studio.geo.latitude, longitude: studio.geo.longitude },
      hasMap: studio.mapHref,
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: studio.openingHours.days,
        opens: studio.openingHours.opens,
        closes: studio.openingHours.closes,
        // The studio is closed until the reopening at the new location.
        validFrom: reopening.date,
      },
      areaServed: [
        ...studio.areaServed.map((name) => ({ '@type': 'City', name })),
        { '@type': 'AdministrativeArea', name: studio.areaServedRegion, alternateName: copy.region },
      ],
      image: ref(ogImageId(base, locale)),
      sameAs: [studio.studioTiktok.href, studio.youtube.href],
      employee: ref(personId(base)),
      parentOrganization: ref(companyId(base)),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: copy.catalogName,
        itemListElement: services.map(({ key, route }) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': `${absoluteUrl(localizedPath(route, locale), base)}#service`,
            name: copy.services[key].name,
            serviceType: copy.services[key].name,
            description: copy.services[key].description,
            url: absoluteUrl(localizedPath(route, locale), base),
            provider: ref(studioId(base)),
          },
        })),
      },
    },
    {
      '@type': 'Organization',
      '@id': companyId(base),
      name: operator.name,
      legalName: operator.name,
      url: absoluteUrl('/', base),
      address: {
        '@type': 'PostalAddress',
        streetAddress: operator.street,
        postalCode: operator.postalCode,
        addressLocality: operator.city,
        addressCountry: studio.address.countryCode,
      },
      vatID: operator.vatId,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: copy.register,
        value: `${operator.registerCourt}, ${operator.registerNumber}`,
      },
      subOrganization: ref(studioId(base)),
    },
    {
      '@type': 'Person',
      '@id': personId(base),
      name: studio.artist,
      jobTitle: dict.pages.artists.person.jobTitle,
      description: dict.pages.artists.person.description,
      knowsAbout: dict.pages.artists.person.knowsAbout,
      url: absoluteUrl(localizedPath('artists', locale), base),
      image: { '@type': 'ImageObject', url: portraitUrl, caption: `${studio.artist}, ${dict.pages.artists.person.jobTitle}` },
      worksFor: ref(studioId(base)),
      sameAs: [studio.tiktok.href, expertSite.href],
    },
    {
      '@type': 'ImageObject',
      '@id': ogImageId(base, locale),
      url: imageUrl,
      contentUrl: imageUrl,
      width: ogImage.width,
      height: ogImage.height,
      caption: copy.ogImageAlt,
      inLanguage: localeMeta[locale].lang,
      creator: ref(companyId(base)),
      copyrightHolder: ref(companyId(base)),
      copyrightNotice: `© ${operator.name}`,
      creditText: site.name,
    },
  ];
}

export function webPageNode(
  page: { path: string; name: string; description: string; locale: Locale; routeKey?: RouteKey },
  base: URL | undefined,
): JsonLdNode {
  return {
    '@type': (page.routeKey && pageTypes[page.routeKey]) ?? 'WebPage',
    '@id': webPageId(page.path, base),
    url: absoluteUrl(page.path, base),
    name: page.name,
    description: page.description,
    inLanguage: localeMeta[page.locale].lang,
    isPartOf: ref(websiteId(base)),
    about: pageSubject(page.routeKey, base),
    publisher: ref(companyId(base)),
    primaryImageOfPage: ref(ogImageId(base, page.locale)),
  };
}

/** FAQPage for a page that shows questions and answers; the answers are plain text. */
export function faqPageNode(
  page: { path: string; locale: Locale },
  items: { question: string; answer: string }[],
  base: URL | undefined,
): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(page.path, base)}#faq`,
    inLanguage: localeMeta[page.locale].lang,
    isPartOf: ref(webPageId(page.path, base)),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  /** Site path without base. */
  path: string;
}

/** BreadcrumbList for the trail shown by Breadcrumbs.astro (home first, the current page last). */
export function breadcrumbNode(path: string, crumbs: Crumb[], base: URL | undefined): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(path, base),
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, base),
    })),
  };
}
