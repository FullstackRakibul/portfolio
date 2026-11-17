// One call per page sets everything a crawler or a share preview reads: title, description, canonical, Open Graph,
// Twitter card, the generated share image and the JSON-LD graph. The canonical host is runtimeConfig.public.siteUrl.
import { NAME } from '~/data/profile'
import { homeGraph, pageGraph, type Crumb } from './useSiteSchema'

export interface PageSeo {
  /** Without the "· Rakibul H. Rabbi" suffix; it is added here. Keep the whole title under 60 characters. */
  title: string
  /** 140–160 characters, written as a direct answer. */
  description: string
  /** Canonical path, e.g. '/resume'. Section addresses (/projects) pass '/', since they are the home page. */
  path: string
  /** Breadcrumb trail after Home, e.g. [{ name: 'Bookshelf', path: '/bookshelf' }]. Omit on the home page. */
  crumbs?: Crumb[]
  /** Short line under the name on the share image. Defaults to the title. */
  ogLabel?: string
  type?: 'profile' | 'website' | 'article'
  extraSchema?: Record<string, unknown>[]
}

export const SUFFIX = ` · ${NAME}`

/** The first candidate that fits (titles: 60 characters with the suffix; descriptions: 160). */
export const fitTitle = (...c: string[]) => c.find(t => (t + SUFFIX).length <= 60) ?? `${c.at(-1)!.slice(0, 59 - SUFFIX.length).trimEnd()}…`
export const fitDescription = (...c: string[]) =>
  c.find(d => d.length >= 140 && d.length <= 160) ?? c.find(d => d.length <= 160) ?? `${c.at(-1)!.slice(0, 159).trimEnd()}…`

export function usePageSeo(o: PageSeo) {
  const { siteUrl, buildDate } = useRuntimeConfig().public as { siteUrl: string; buildDate: string }
  const home = o.path === '/'
  const url = home ? `${siteUrl}/` : `${siteUrl}${o.path}`
  const title = o.title + SUFFIX
  const type = o.type ?? (home ? 'profile' : 'website')

  useHead({ title, link: [{ rel: 'canonical', href: url }] })
  useSeoMeta({
    description: o.description,
    ogTitle: title,
    ogDescription: o.description,
    ogUrl: url,
    ogType: type,
    ogSiteName: NAME,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: o.description,
  })
  defineOgImage('Page', { title: o.ogLabel ?? o.title, host: new URL(siteUrl).host }, { alt: `${NAME}: ${o.ogLabel ?? o.title}` })

  useSchemaOrg(home
    ? homeGraph(siteUrl, { title, description: o.description, dateModified: buildDate })
    : pageGraph(siteUrl, url, { title, description: o.description, crumbs: [{ name: 'Home', path: '/' }, ...(o.crumbs ?? [])], extra: o.extraSchema }))
}
