// The JSON-LD graph, built by hand (nuxt.config: schemaOrg.defaults = false) so the @ids are stable and readable:
// <site>/#person, /#website, /#profilepage. Every value comes from data/profile.ts and the other data files.
import { CERTIFICATIONS } from '~/data/certifications'
import { EARLIER_PROJECTS, PROJECTS } from '~/data/projects'
import { MOSTISKO_URL } from '~/data/portfolio'
import { POSTS } from '~/data/writing'
import {
  ALTERNATE_NAME, BIO, CITY, COUNTRY, EMPLOYER, FAQ, JOB_TITLE, KNOWS_ABOUT, NAME, PHOTO, ROLE_TITLE, SAME_AS, LINKS,
} from '~/data/profile'

type Node = Record<string, unknown>
export interface Crumb { name: string; path: string }

export const siteIds = (site: string) => ({
  person: `${site}/#person`,
  website: `${site}/#website`,
  profile: `${site}/#profilepage`,
})

export function personNode(site: string): Node {
  return {
    '@type': 'Person',
    '@id': siteIds(site).person,
    name: NAME,
    alternateName: ALTERNATE_NAME,
    description: BIO,
    jobTitle: JOB_TITLE,
    hasOccupation: [
      { '@type': 'Occupation', name: JOB_TITLE },
      { '@type': 'Occupation', name: ROLE_TITLE },
    ],
    worksFor: { '@type': 'Organization', name: EMPLOYER },
    address: { '@type': 'PostalAddress', addressLocality: CITY, addressCountry: COUNTRY },
    image: `${site}${PHOTO}`,
    url: `${site}/`,
    email: LINKS.email,
    sameAs: SAME_AS,
    knowsAbout: KNOWS_ABOUT,
    hasCredential: CERTIFICATIONS.map(c => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.title,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      dateCreated: c.issued,
      identifier: c.credentialId,
    })),
  }
}

export function websiteNode(site: string): Node {
  const id = siteIds(site)
  return { '@type': 'WebSite', '@id': id.website, name: NAME, url: `${site}/`, description: BIO, publisher: { '@id': id.person }, inLanguage: 'en' }
}

export function breadcrumbNode(site: string, url: string, crumbs: Crumb[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${site}${c.path === '/' ? '/' : c.path}` })),
  }
}

/** Projects as CreativeWork: SoftwareApplication would make Google require prices or ratings the site doesn't have. */
function projectsNode(site: string): Node {
  const person = { '@id': siteIds(site).person }
  const items = [
    ...PROJECTS.map(p => ({ name: p.title, url: p.url, description: [p.kind, p.translation ?? p.pitch].filter(Boolean).join(': ') })),
    { name: 'Mostisko', url: MOSTISKO_URL, description: 'Locally hosted AI workspace, in active development.' },
    ...EARLIER_PROJECTS.map(p => ({ name: p.title, url: p.url, description: p.description })),
  ]
  return {
    '@type': 'ItemList',
    '@id': `${site}/#projects`,
    name: `Projects by ${NAME}`,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'CreativeWork', name: p.name, ...(p.url ? { url: p.url } : {}), description: p.description, creator: person },
    })),
  }
}

/** Medium posts: they live on medium.com, so each points there and nothing claims they are hosted here. */
function writingNode(site: string): Node {
  const person = { '@id': siteIds(site).person }
  return {
    '@type': 'ItemList',
    '@id': `${site}/#writing`,
    name: `Writing by ${NAME} on Medium`,
    numberOfItems: POSTS.length,
    itemListElement: POSTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'BlogPosting', headline: p.title, url: p.url, datePublished: p.date, author: person, ...(p.cover ? { image: p.cover } : {}) },
    })),
  }
}

function faqNode(site: string): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${site}/#faq`,
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

/** The home page's whole graph: Person, WebSite, ProfilePage, projects, writing and the FAQ. */
export function homeGraph(site: string, o: { title: string; description: string; dateModified: string }): Node[] {
  const id = siteIds(site)
  return [
    personNode(site),
    websiteNode(site),
    {
      '@type': 'ProfilePage',
      '@id': id.profile,
      url: `${site}/`,
      name: o.title,
      description: o.description,
      isPartOf: { '@id': id.website },
      mainEntity: { '@id': id.person },
      about: { '@id': id.person },
      dateModified: o.dateModified,
      inLanguage: 'en',
    },
    projectsNode(site),
    writingNode(site),
    faqNode(site),
  ]
}

/** Any other page: WebPage + breadcrumb, linked to the same Person and WebSite. */
export function pageGraph(site: string, url: string, o: { title: string; description: string; crumbs: Crumb[]; extra?: Node[] }): Node[] {
  const id = siteIds(site)
  return [
    personNode(site),
    websiteNode(site),
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: o.title,
      description: o.description,
      isPartOf: { '@id': id.website },
      about: { '@id': id.person },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      inLanguage: 'en',
    },
    breadcrumbNode(site, url, o.crumbs),
    ...(o.extra ?? []),
  ]
}
