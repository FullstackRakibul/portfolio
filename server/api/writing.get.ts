import { MEDIUM_FEED, POSTS, type MediumPost } from '~/data/writing'

const clean = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"').trim()

/** First paragraph of the post, cut to about two lines at a word boundary. */
const opening = (html: string) => {
  const first = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => text(m[1])).find(Boolean)
  if (!first) return undefined
  if (first.length <= 170) return first
  return first.slice(0, 170).replace(/\s+\S*$/, '') + '…'
}

/**
 * Medium posts, newest first. At build time (and on any server) the feed is read so new posts appear by
 * themselves; data/writing.ts adds what the feed lacks (topic, read time, related work) and is used
 * whole when the feed cannot be reached. Cached for six hours.
 */
export default defineCachedEventHandler(async (): Promise<{ source: 'live' | 'saved'; posts: MediumPost[] }> => {
  const saved = new Map(POSTS.map(p => [p.url, p]))
  try {
    const xml = await $fetch<string>(MEDIUM_FEED, { responseType: 'text', timeout: 8000, headers: { 'user-agent': 'rabbitic.com portfolio' } })
    const live = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]): MediumPost | null => {
      const get = (t: string) => clean(item.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1] ?? '')
      const url = get('link').split('?')[0]
      const html = get('content:encoded')
      const date = new Date(get('pubDate'))
      if (!url.startsWith('https://medium.com/') || Number.isNaN(date.getTime())) return null
      const known = saved.get(url)
      return {
        title: known?.title ?? text(get('title')).replace(/:$/, ''),
        url,
        date: date.toISOString().slice(0, 10),
        excerpt: known?.excerpt ?? opening(html),
        cover: known?.cover ?? html.match(/<img[^>]+src="([^"]+)"/)?.[1],
        readTime: known?.readTime,
        topic: known?.topic,
        related: known?.related,
      }
    }).filter((p): p is MediumPost => !!p)
    if (live.length) {
      // Keep saved posts the feed no longer lists (it carries only the latest ten).
      const seen = new Set(live.map(p => p.url))
      const posts = [...live, ...POSTS.filter(p => !seen.has(p.url))].sort((a, b) => b.date.localeCompare(a.date))
      return { source: 'live', posts }
    }
  } catch { /* offline or blocked: use the saved list */ }
  return { source: 'saved', posts: POSTS }
}, { maxAge: 60 * 60 * 6, name: 'medium-posts' })
