// Each reader's place in every book, their bookmarks, their "Want to Read" list, their reading pace and
// how they like to read, all kept in their own browser (localStorage). Nothing leaves the device.

export interface Progress { page: number; pages: number; at: number }
export type ReaderTheme = 'original' | 'paper' | 'sepia' | 'night' | 'dim'
export type ReaderMode = 'paged' | 'scroll'
export type ReaderFit = 'page' | 'width'
export interface ReaderPrefs {
  theme: ReaderTheme
  /** False until the reader picks a theme; until then the reader follows the system's light or dark. */
  themeChosen: boolean
  mode: ReaderMode
  fit: ReaderFit
  /** 0.5–3, on top of the fit. */
  zoom: number
  spread: 'auto' | 'single'
  /** Warm night-light over the page, 0–100. */
  warmth: number
  /** Page brightness, 60–100. */
  brightness: number
  /** Reading ruler in focus mode. */
  ruler: boolean
  /** The 20-20-20 break reminder. */
  breaks: boolean
}
/** Average seconds per page, per book. */
interface Pace { sec: number; n: number }

const KEYS = {
  progress: 'bookshelf-progress',
  prefs: 'bookshelf-prefs',
  bookmarks: 'bookshelf-bookmarks',
  want: 'bookshelf-want',
  pace: 'bookshelf-pace',
  view: 'bookshelf-view',
} as const
export const ZOOM = { min: 0.5, max: 3 }
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3]
/** The next zoom step in or out from `z` (null at either end). */
export function nextZoom(z: number, d: 1 | -1) {
  return (d > 0 ? ZOOM_STEPS.find(s => s > z + 0.01) : [...ZOOM_STEPS].reverse().find(s => s < z - 0.01)) ?? null
}
const DEFAULT_PREFS: ReaderPrefs = {
  theme: 'paper', themeChosen: false, mode: 'paged', fit: 'page', zoom: 1, spread: 'auto',
  warmth: 0, brightness: 100, ruler: false, breaks: false,
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const value = JSON.parse(raw)
    return Array.isArray(fallback) ? (Array.isArray(value) ? value as T : fallback) : { ...fallback, ...value }
  } catch { return fallback }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode: nothing kept */ }
}
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function useReading() {
  const progress = useState<Record<string, Progress>>('bookshelf-progress', () => ({}))
  const prefs = useState<ReaderPrefs>('bookshelf-prefs', () => ({ ...DEFAULT_PREFS }))
  const bookmarks = useState<Record<string, number[]>>('bookshelf-bookmarks', () => ({}))
  const want = useState<string[]>('bookshelf-want', () => [])
  const pace = useState<Record<string, Pace>>('bookshelf-pace', () => ({}))
  const view = useState<'grid' | 'list'>('bookshelf-view', () => 'grid')
  const loaded = useState('bookshelf-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    progress.value = load(KEYS.progress, {})
    const p = load(KEYS.prefs, { ...DEFAULT_PREFS })
    // Settings saved by the first version of the reader: zoom then ran 1–2.5 and a theme was always chosen.
    prefs.value = { ...p, zoom: clamp(p.zoom, ZOOM.min, ZOOM.max), themeChosen: p.themeChosen ?? localStorage.getItem(KEYS.prefs) !== null }
    bookmarks.value = load(KEYS.bookmarks, {})
    want.value = load<string[]>(KEYS.want, [])
    pace.value = load(KEYS.pace, {})
    view.value = localStorage.getItem(KEYS.view) === 'list' ? 'list' : 'grid'
    loaded.value = true
  }

  /** The page theme in use: the reader's choice, or the system's light or dark until they make one. */
  const theme = computed<ReaderTheme>(() => {
    if (prefs.value.themeChosen || !import.meta.client) return prefs.value.theme
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'paper'
  })

  function setPage(slug: string, page: number, pages: number) {
    progress.value = { ...progress.value, [slug]: { page, pages, at: Date.now() } }
    save(KEYS.progress, progress.value)
  }

  function setPrefs(patch: Partial<ReaderPrefs>) {
    const next = { ...prefs.value, ...patch }
    if (patch.theme) next.themeChosen = true
    next.zoom = clamp(next.zoom, ZOOM.min, ZOOM.max)
    next.warmth = clamp(next.warmth, 0, 100)
    next.brightness = clamp(next.brightness, 60, 100)
    prefs.value = next
    save(KEYS.prefs, next)
  }

  function setView(v: 'grid' | 'list') {
    view.value = v
    try { localStorage.setItem(KEYS.view, v) } catch { /* nothing kept */ }
  }

  const marksOf = (slug: string) => bookmarks.value[slug] ?? []
  function toggleBookmark(slug: string, page: number) {
    const now = marksOf(slug)
    const next = now.includes(page) ? now.filter(p => p !== page) : [...now, page].sort((a, b) => a - b)
    bookmarks.value = { ...bookmarks.value, [slug]: next }
    save(KEYS.bookmarks, bookmarks.value)
  }

  const wants = (slug: string) => want.value.includes(slug)
  function toggleWant(slug: string) {
    want.value = wants(slug) ? want.value.filter(s => s !== slug) : [slug, ...want.value]
    save(KEYS.want, want.value)
  }

  /** One page read in `seconds`. Glances (under 3s) and pauses (over 10 min) say nothing about pace. */
  function recordPace(slug: string, seconds: number) {
    if (seconds < 3 || seconds > 600) return
    const p = pace.value[slug] ?? { sec: 0, n: 0 }
    const n = Math.min(p.n + 1, 40) // a moving average: the last forty pages or so
    pace.value = { ...pace.value, [slug]: { sec: p.sec + (seconds - p.sec) / n, n: p.n + 1 } }
    save(KEYS.pace, pace.value)
  }

  /** Seconds per page in this book, or across every book while this one has too few pages read. */
  function paceOf(slug: string): number | null {
    const own = pace.value[slug]
    if (own && own.n >= 3) return own.sec
    const all = Object.values(pace.value).filter(p => p.n >= 3)
    return all.length ? all.reduce((s, p) => s + p.sec, 0) / all.length : null
  }

  /** 0–1; a book read to its last page counts as finished. */
  const fraction = (slug: string) => {
    const p = progress.value[slug]
    return p && p.pages > 1 ? Math.min(1, (p.page - 1) / (p.pages - 1)) : 0
  }
  const isDone = (slug: string) => { const p = progress.value[slug]; return !!p && p.page >= p.pages }
  const isStarted = (slug: string) => { const p = progress.value[slug]; return !!p && p.page > 1 && p.page < p.pages }

  /** Books by the time they were last opened, newest first. */
  const recent = computed(() => Object.entries(progress.value).sort((a, b) => b[1].at - a[1].at).map(([slug]) => slug))
  /** The book most recently opened and not yet finished. */
  const lastOpened = computed(() => recent.value.find(slug => !isDone(slug)))

  return {
    progress, prefs, theme, bookmarks, want, view,
    setPage, setPrefs, setView, marksOf, toggleBookmark, wants, toggleWant, recordPace, paceOf,
    fraction, isDone, isStarted, recent, lastOpened,
  }
}
