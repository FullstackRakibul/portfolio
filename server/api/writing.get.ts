import { ARTICLES, type Article } from '~/data/portfolio'

const FEED = 'https://medium.com/feed/@rakibul.h.rabbi'

const text = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, '').trim()

/** Latest Medium stories, cached for six hours; falls back to the copy kept in data/portfolio.ts. */
export default defineCachedEventHandler(async (): Promise<{ source: 'live' | 'saved'; articles: Article[] }> => {
  try {
    const xml = await $fetch<string>(FEED, { responseType: 'text', timeout: 8000, headers: { 'user-agent': 'rabbitic.com portfolio' } })
    const articles = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
      title: text(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''),
      url: text(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '').split('?')[0],
      date: new Date(text(item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? '')).toISOString().slice(0, 10),
    })).filter(a => a.title && a.url.startsWith('https://medium.com/'))
    if (articles.length) return { source: 'live', articles }
  } catch { /* offline or blocked: use the saved list */ }
  return { source: 'saved', articles: ARTICLES }
}, { maxAge: 60 * 60 * 6, name: 'medium-feed' })
