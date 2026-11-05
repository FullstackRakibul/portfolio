// One sitting with a book: how long it has lasted, how fast this reader turns pages (for "time left"),
// and the 20-20-20 reminder (every 20 minutes, look 20 feet away for 20 seconds). Time only counts
// while the page is visible.
import type { Ref } from 'vue'

const BREAK_EVERY = 20 * 60

export function formatDuration(sec: number) {
  const min = Math.max(1, Math.round(sec / 60))
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

export function useSession(slug: Ref<string>, breaks: Ref<boolean>) {
  const { recordPace } = useReading()
  /** Seconds read in this sitting. */
  const elapsed = ref(0)
  const breakDue = ref(false)
  let onPage = 0
  let sinceBreak = 0
  let timer = 0

  function tick() {
    if (document.visibilityState !== 'visible') return
    elapsed.value++
    onPage++
    sinceBreak++
    if (breaks.value && sinceBreak >= BREAK_EVERY && !breakDue.value) breakDue.value = true
  }

  /** The reader moved on from a page: the time spent on it feeds their pace. */
  function turned() {
    recordPace(slug.value, onPage)
    onPage = 0
  }

  function dismissBreak() {
    breakDue.value = false
    sinceBreak = 0
  }

  watch(breaks, (on) => { if (!on) dismissBreak() })
  onMounted(() => { timer = window.setInterval(tick, 1000) })
  onBeforeUnmount(() => clearInterval(timer))

  return { elapsed, breakDue, turned, dismissBreak }
}
