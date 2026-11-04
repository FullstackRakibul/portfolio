import { POSTS, type MediumPost } from '~/data/writing'

/**
 * Medium posts, newest first. Read once at build time (server/api/writing.get.ts) and carried in the page,
 * so the home teaser and the writing page share it without asking a static host for /api/writing again.
 */
export function useWriting() {
  return useFetch('/api/writing', {
    key: 'medium-posts',
    default: () => ({ source: 'saved' as const, posts: POSTS as MediumPost[] }),
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** '2026-11-02' → '2 Nov 2026' (no time zone shifts). */
export const shortDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso
}
