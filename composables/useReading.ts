// Each reader's place in every book, and how they like to read, kept in their own browser.

export interface Progress { page: number; pages: number; at: number }
export type ReaderTheme = 'original' | 'paper' | 'sepia' | 'night'
export interface ReaderPrefs { theme: ReaderTheme; spread: 'auto' | 'single'; zoom: number }

const PROGRESS_KEY = 'bookshelf-progress'
const PREFS_KEY = 'bookshelf-prefs'
const DEFAULT_PREFS: ReaderPrefs = { theme: 'paper', spread: 'auto', zoom: 1 }

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch { return fallback }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode: nothing kept */ }
}

export function useReading() {
  const progress = useState<Record<string, Progress>>('bookshelf-progress', () => ({}))
  const prefs = useState<ReaderPrefs>('bookshelf-prefs', () => ({ ...DEFAULT_PREFS }))
  const loaded = useState('bookshelf-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    progress.value = load(PROGRESS_KEY, {})
    prefs.value = load(PREFS_KEY, { ...DEFAULT_PREFS })
    loaded.value = true
  }

  function setPage(slug: string, page: number, pages: number) {
    progress.value = { ...progress.value, [slug]: { page, pages, at: Date.now() } }
    save(PROGRESS_KEY, progress.value)
  }

  function setPrefs(patch: Partial<ReaderPrefs>) {
    prefs.value = { ...prefs.value, ...patch }
    save(PREFS_KEY, prefs.value)
  }

  /** 0–1; a book read to its last page counts as finished. */
  const fraction = (slug: string) => {
    const p = progress.value[slug]
    return p && p.pages > 1 ? Math.min(1, (p.page - 1) / (p.pages - 1)) : 0
  }

  /** The book most recently opened and not yet finished. */
  const lastOpened = computed(() => Object.entries(progress.value)
    .filter(([, p]) => p.page < p.pages)
    .sort((a, b) => b[1].at - a[1].at)[0]?.[0])

  return { progress, prefs, setPage, setPrefs, fraction, lastOpened }
}
