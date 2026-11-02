export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'lab-theme'

/**
 * Light/dark theme. The boot script in nuxt.config sets the first value before paint
 * (saved choice, else the OS preference); this keeps it in sync and persists changes.
 */
export function useTheme() {
  const theme = useState<Theme>('lab-theme', () => 'dark')

  const sync = () => {
    if (import.meta.client) theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  }

  const apply = (next: Theme) => {
    const root = document.documentElement
    root.dataset.theme = next
    theme.value = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* private mode */ }
    window.dispatchEvent(new CustomEvent('lab-theme', { detail: next }))
  }

  const setTheme = (next: Theme) => {
    if (!import.meta.client) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => apply(next))
    else apply(next)
  }

  const toggle = () => setTheme(theme.value === 'dark' ? 'light' : 'dark')

  onMounted(sync)

  return { theme, setTheme, toggle }
}
