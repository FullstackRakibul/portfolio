// Search, filters and sorting for the library pages, with the query, filter and sort kept in the address
// (/#/bookshelf?q=tolstoy&filter=progress&sort=title) so a search can be shared and survives a reload.
import { books, categoryNames, type Book } from '~/data/books'

export type Sort = 'added' | 'title' | 'author' | 'progress'
export type Filter = 'all' | 'progress' | 'finished' | 'want'
export const SORTS: { id: Sort; label: string }[] = [
  { id: 'added', label: 'Recently added' },
  { id: 'title', label: 'Title' },
  { id: 'author', label: 'Author' },
  { id: 'progress', label: 'Progress' },
]
export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'progress', label: 'In progress' },
  { id: 'finished', label: 'Finished' },
  { id: 'want', label: 'Want to Read' },
]

const order = new Map(books.map((b, i) => [b.slug, i]))
// Titles sort without their article; authors by surname ("Unknown" last).
const titleKey = (b: Book) => b.title.replace(/^(the|a|an)\s+/i, '').toLowerCase()
const authorKey = (b: Book) => (b.author === 'Unknown' ? '~' : (b.author.split(' ').pop() ?? '').toLowerCase())
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function useLibrary() {
  const route = useRoute()
  const router = useRouter()
  const { fraction, isDone, isStarted, wants } = useReading()

  const pick = <T extends string>(v: unknown, allowed: readonly { id: T }[], fallback: T) =>
    (allowed.some(a => a.id === v) ? v as T : fallback)
  const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
  const filter = computed<Filter>({
    get: () => pick(route.query.filter, FILTERS, 'all'),
    set: v => update({ filter: v === 'all' ? undefined : v }),
  })
  const sort = computed<Sort>({
    get: () => pick(route.query.sort, SORTS, 'added'),
    set: v => update({ sort: v === 'added' ? undefined : v }),
  })

  function update(patch: Record<string, string | undefined>) {
    const next = { ...route.query, ...patch }
    for (const k of Object.keys(next)) if (!next[k]) delete next[k]
    router.replace({ query: next })
  }
  // Typing updates the address a moment after the last key, so history is not flooded.
  let timer = 0
  watch(query, (q) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => update({ q: q.trim() || undefined }), 250)
  })
  // Back and forward bring their search with them.
  watch(() => route.query.q, (q) => {
    const v = typeof q === 'string' ? q : ''
    if (v !== query.value.trim()) query.value = v
  })

  const matches = (b: Book, q: string) => {
    if (!q) return true
    const hay = fold([b.title, b.author, ...categoryNames(b)].join(' '))
    return fold(q).split(/\s+/).every(w => hay.includes(w))
  }
  const passes = (b: Book, f: Filter) => f === 'all' || (f === 'progress' ? isStarted(b.slug) : f === 'finished' ? isDone(b.slug) : wants(b.slug))

  function sorted(list: Book[], s: Sort = sort.value) {
    const by: Record<Sort, (a: Book, b: Book) => number> = {
      added: (a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '') || order.get(a.slug)! - order.get(b.slug)!,
      title: (a, b) => titleKey(a).localeCompare(titleKey(b)),
      author: (a, b) => authorKey(a).localeCompare(authorKey(b)) || titleKey(a).localeCompare(titleKey(b)),
      progress: (a, b) => fraction(b.slug) - fraction(a.slug) || order.get(a.slug)! - order.get(b.slug)!,
    }
    return [...list].sort(by[s])
  }

  /** True while the reader is searching or filtering: the shelf then shows results instead of rows. */
  const narrowing = computed(() => !!query.value.trim() || filter.value !== 'all')
  const results = computed(() => sorted(books.filter(b => matches(b, query.value.trim()) && passes(b, filter.value))))

  function clear() { query.value = ''; update({ q: undefined, filter: undefined }) }

  return { query, filter, sort, narrowing, results, sorted, clear }
}
