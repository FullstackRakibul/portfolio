<template>
  <div ref="root" class="reader" :data-r="book.embed ? 'original' : theme" :class="{ bare: !chrome && !book.embed, focus }"
    role="dialog" aria-modal="true" :aria-label="`Reading ${book.title}`" tabindex="-1"
    :style="{ '--warm': prefs.warmth / 100, '--dim': 1 - prefs.brightness / 100 }" @focusin="onFocusIn" @keydown.tab="trap">
    <header class="top">
      <div class="side">
        <button type="button" class="ic" aria-label="Close book" title="Close (Esc)" @click="emit('close')"><X :size="20" aria-hidden="true" /></button>
        <button v-if="ready" type="button" class="ic" :aria-expanded="sheet === 'panel'" aria-label="Contents and bookmarks"
          title="Contents" @click.stop="togglePanel('contents')"><List :size="19" aria-hidden="true" /></button>
      </div>
      <div class="who">
        <h1>{{ book.title }}</h1>
        <p>{{ book.author }}</p>
      </div>
      <div class="side end">
        <a v-if="book.embed" class="ic" :href="book.embed" target="_blank" rel="noopener noreferrer" aria-label="Open in a new tab"
          title="Open in a new tab"><ExternalLink :size="18" aria-hidden="true" /></a>
        <template v-else-if="ready">
          <button type="button" class="ic hide-xs" aria-label="Search in the book" title="Search (/)" @click.stop="togglePanel('search')">
            <Search :size="18" aria-hidden="true" />
          </button>
          <button type="button" class="ic" :aria-pressed="marked" :aria-label="marked ? `Remove bookmark on page ${page}` : `Bookmark page ${page}`"
            title="Bookmark (B)" @click.stop="toggleBookmark(book.slug, page)">
            <component :is="marked ? BookmarkCheck : Bookmark" :size="18" aria-hidden="true" />
          </button>
          <button type="button" class="ic aa-btn" :aria-expanded="sheet === 'aa'" aria-label="Reading settings" title="Reading settings"
            @click.stop="sheet = sheet === 'aa' ? '' : 'aa'">Aa</button>
        </template>
      </div>
    </header>

    <BookSettings v-if="sheet === 'aa'" :can-spread="wide" :pdf="book.pdf" @focus="enterFocus" />
    <BookPanel v-if="sheet === 'panel'" v-model:tab="panelTab" v-model:highlight="highlight" :pdf="pdf" :slug="book.slug" :page="page" @go="fromPanel" />
    <BookKeys v-if="sheet === 'keys'" />

    <!-- Online flipbook: shown as it is. -->
    <div v-if="book.embed" class="embed">
      <div v-if="!frameReady" class="state"><span class="spin" role="status" aria-label="Loading book" /></div>
      <iframe :src="book.embed" :title="book.title" allow="fullscreen" allowfullscreen referrerpolicy="no-referrer" @load="frameReady = true" />
    </div>
    <template v-else>
      <div ref="probe" class="probe" aria-hidden="true" />
      <div v-if="pdf.loading.value" class="state" role="status">
        <span class="spin" aria-hidden="true" />
        <p class="opening lab-num">Opening…<template v-if="pdf.percent.value !== null"> {{ pdf.percent.value }}%</template></p>
        <p v-if="pdf.ranged.value" class="sub">Only the parts you read are downloaded.</p>
      </div>
      <BookFallback v-else-if="pdf.error.value" :src="book.pdf!" :title="book.title" />
      <BookPaged v-else-if="ready && prefs.mode === 'paged'" :pdf="pdf" :shown="shown" :total="total" :box="box" :gap="GAP"
        :overflowing="overflowing" :query="highlight" @turn="go" @middle="onMiddle" @close="emit('close')" />
      <BookScroll v-else-if="ready" ref="scroller" :pdf="pdf" :total="total" :page="page" :box="box" :gap="16" :query="highlight"
        @update:page="onScrolled" @middle="onMiddle" />
    </template>

    <!-- Eye comfort: a warm night-light and a dimmer, over the page and under the controls. -->
    <div class="comfort warm" aria-hidden="true" />
    <div class="comfort dim" aria-hidden="true" />
    <BookRuler v-if="focus && prefs.ruler && ready" ref="ruler" />

    <button v-if="focus" type="button" class="exit-focus" :class="{ shown: exitShown }" @click="leaveFocus">Exit focus</button>
    <div v-if="session.breakDue.value" class="toast" role="alert">
      <p><strong>Time to rest your eyes.</strong> Look at something about 20 feet (6 m) away for 20 seconds.</p>
      <button type="button" class="ic-text" @click="session.dismissBreak()">Done</button>
    </div>
    <p class="sr-only" aria-live="polite">{{ announce }}</p>

    <BookBar v-if="ready" class="bottom" :page="page" :last="last" :total="total" :elapsed="session.elapsed.value"
      :seconds-left="secondsLeft" @jump="jump" />
  </div>
</template>

<script setup lang="ts">
import { X, List, Search, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-vue-next'
import type { Book } from '~/data/books'
import { nextZoom, type ReaderTheme } from '~/composables/useReading'

const props = defineProps<{ book: Book; start?: number }>()
const emit = defineEmits<{ close: []; page: [n: number] }>()

const GAP = 6
const THEMES: ReaderTheme[] = ['original', 'paper', 'sepia', 'dim', 'night']
const { prefs, theme, progress, setPage, setPrefs, marksOf, toggleBookmark, paceOf } = useReading()
const pdf = usePdf()
const covers = useCovers()
const slug = computed(() => props.book.slug)
const session = useSession(slug, computed(() => prefs.value.breaks))
/** The shelf puts focus back on the book that was open. */
const returnTo = useState<string>('bookshelf-return', () => '')

const root = ref<HTMLElement | null>(null)
const probe = ref<HTMLElement | null>(null)
const scroller = ref<{ scrollBy: (dy: number) => void } | null>(null)
const ruler = ref<{ move: (d: 1 | -1) => void } | null>(null)
const chrome = ref(true)
const focus = ref(false)
const exitShown = ref(false)
const sheet = ref<'' | 'aa' | 'panel' | 'keys'>('')
const panelTab = ref<'contents' | 'bookmarks' | 'search'>('contents')
const highlight = ref('')
const frameReady = ref(false)
const announce = ref('')
/** The area pages may use: the screen less the bars' room. */
const size = reactive({ w: 0, h: 0 })

const total = computed(() => pdf.pages.value)
const ready = computed(() => total.value > 0 && !pdf.error.value)
const wide = computed(() => size.w >= 860 && size.w > size.h * 1.15)
const spread = computed(() => prefs.value.mode === 'paged' && wide.value && prefs.value.spread === 'auto')
// Spreads pair 2–3, 4–5 …; the first page stands alone, like a book's right-hand cover.
const startOf = (n: number) => (!spread.value || n <= 1 ? n : n % 2 === 0 ? n : n - 1)

const page = ref(Math.max(1, props.start ?? progress.value[props.book.slug]?.page ?? 1))
const shown = computed(() => (!spread.value || page.value === 1 || page.value >= total.value ? [page.value] : [page.value, page.value + 1]))
const last = computed(() => (prefs.value.mode === 'scroll' ? page.value : shown.value[shown.value.length - 1]))
const marked = computed(() => marksOf(props.book.slug).includes(page.value))
const secondsLeft = computed(() => { const p = paceOf(props.book.slug); return p ? (total.value - last.value) * p : null })

/* Page boxes: fitted to the area, then zoomed. Every page shares the first page's shape until drawn. */
const box = computed(() => {
  const a = pdf.aspect.value
  const count = spread.value ? 2 : 1
  const col = (size.w - GAP * (count - 1)) / count
  const w = Math.max(120, prefs.value.fit === 'width' ? col : Math.min(col, size.h * a)) * prefs.value.zoom
  return { w, h: w / a }
})
const overflowing = computed(() => box.value.w * (spread.value ? 2 : 1) > size.w + 1 || box.value.h > size.h + 1)

function jump(n: number) {
  if (!total.value) return
  const next = startOf(Math.min(total.value, Math.max(1, Math.round(n))))
  if (next === page.value) return
  session.turned()
  page.value = next
}
function go(d: 1 | -1) {
  if (prefs.value.mode === 'scroll') jump(page.value + d)
  else if (d > 0) jump(last.value + 1)
  else jump(spread.value && page.value > 2 ? page.value - 2 : page.value - 1)
  if (!focus.value) chrome.value = false
  sheet.value = ''
}
function onScrolled(n: number) { session.turned(); page.value = n; if (!focus.value && !sheet.value) chrome.value = false }
function fromPanel(n: number) { jump(n); if (size.w < 720) sheet.value = '' }

watch([page, total], () => {
  if (!total.value) return
  setPage(props.book.slug, last.value, total.value)
  emit('page', page.value)
  pdf.prefetch(last.value + 1)
  announce.value = shown.value.length > 1 ? `Pages ${shown.value[0]} and ${last.value}` : `Page ${page.value}`
})
watch([spread, () => prefs.value.mode], () => { page.value = startOf(page.value) })

function togglePanel(tab: typeof panelTab.value) {
  if (sheet.value === 'panel' && panelTab.value === tab) sheet.value = ''
  else { panelTab.value = tab; sheet.value = 'panel' }
}

/* Focus mode: nothing on screen but the page (and the ruler, if on). A tap in the middle offers the way out. */
let exitTimer = 0
function enterFocus() { focus.value = true; chrome.value = false; sheet.value = ''; root.value?.focus() }
function leaveFocus() { focus.value = false; chrome.value = true; exitShown.value = false }
function onMiddle() {
  if (sheet.value) { sheet.value = ''; return }
  if (!focus.value) { chrome.value = !chrome.value; return }
  exitShown.value = true
  clearTimeout(exitTimer)
  exitTimer = window.setTimeout(() => (exitShown.value = false), 2500)
}

function zoom(d: 1 | -1) { const z = nextZoom(prefs.value.zoom, d); if (z) setPrefs({ zoom: z }) }

function onKey(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement)?.closest?.('input, textarea, select, [contenteditable="true"]')
  if (e.key === 'Escape') {
    e.preventDefault()
    if (sheet.value) sheet.value = ''
    else if (focus.value) leaveFocus()
    else emit('close')
    return
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey || props.book.embed || !ready.value) return
  const scroll = prefs.value.mode === 'scroll'
  const handled = (() => {
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': go(1); return true
      case 'ArrowLeft': case 'PageUp': go(-1); return true
      case ' ': if (scroll) scroller.value?.scrollBy((e.shiftKey ? -1 : 1) * size.h * 0.85); else go(e.shiftKey ? -1 : 1); return true
      case 'ArrowDown': case 'ArrowUp': {
        const d = e.key === 'ArrowDown' ? 1 : -1
        if (focus.value && prefs.value.ruler && !scroll) ruler.value?.move(d)
        else if (scroll) scroller.value?.scrollBy(d * 84)
        else return false
        return true
      }
      case 'Home': jump(1); return true
      case 'End': jump(total.value); return true
      case 'f': case 'F': if (focus.value) leaveFocus(); else enterFocus(); return true
      case 't': case 'T': setPrefs({ theme: THEMES[(THEMES.indexOf(theme.value) + 1) % THEMES.length] }); return true
      case '/': togglePanel('search'); return true
      case 'b': case 'B': toggleBookmark(props.book.slug, page.value); return true
      case '+': case '=': zoom(1); return true
      case '-': case '_': zoom(-1); return true
      case '?': sheet.value = sheet.value === 'keys' ? '' : 'keys'; return true
      default: return false
    }
  })()
  if (handled) e.preventDefault()
}

/* A modal: Tab cycles within the reader, and a control taking focus brings the bars back. */
function trap(e: KeyboardEvent) {
  const els = Array.from(root.value?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, iframe, [tabindex="0"]') ?? [])
    .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
  if (!els.length) return
  const first = els[0]
  const end = els[els.length - 1]
  if (e.shiftKey && (document.activeElement === first || document.activeElement === root.value)) { e.preventDefault(); end.focus() }
  else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus() }
}
function onFocusIn(e: FocusEvent) {
  if (!focus.value && (e.target as HTMLElement)?.closest('.top, .bottom')) chrome.value = true
}

let ro: ResizeObserver | null = null
onMounted(async () => {
  document.documentElement.style.overflow = 'hidden'
  root.value?.focus()
  window.addEventListener('keydown', onKey)
  if (!props.book.pdf) return
  await nextTick()
  ro = new ResizeObserver(([entry]) => { size.w = entry.contentRect.width; size.h = entry.contentRect.height })
  if (probe.value) ro.observe(probe.value)
  await pdf.open(props.book.pdf)
  if (!total.value) return
  page.value = startOf(Math.min(page.value, total.value))
  // Page 1 as this book's cover on the shelf, made once, from the file already open.
  await covers.loadAll()
  if (!covers.has(props.book.slug)) setTimeout(() => pdf.thumbnail().then(b => b && covers.put(props.book.slug, b)), 1200)
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  ro?.disconnect()
  clearTimeout(exitTimer)
  session.turned()
  pdf.close()
  returnTo.value = props.book.slug
})
</script>

<style scoped src="./reader.css"></style>
