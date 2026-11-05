<template>
  <div ref="root" class="reader" :data-r="book.embed ? 'original' : prefs.theme"
    :class="{ bare: !chrome && !book.embed }" role="dialog" aria-modal="true" :aria-label="`Reading ${book.title}`"
    tabindex="-1" @focusin="onFocusIn">
    <header class="top">
      <button type="button" class="ic" aria-label="Close book" title="Close (Esc)" @click="$emit('close')">
        <X :size="20" />
      </button>
      <div class="who">
        <h1>{{ book.title }}</h1>
        <p>{{ book.author }}</p>
      </div>
      <a v-if="book.embed" class="ic" :href="book.embed" target="_blank" rel="noopener noreferrer"
        aria-label="Open in a new tab" title="Open in a new tab">
        <ExternalLink :size="18" />
      </a>
      <button v-else type="button" class="ic aa-btn" :aria-expanded="panel" aria-label="Reading settings"
        title="Reading settings" @click.stop="panel = !panel">Aa</button>
    </header>

    <BookSettings v-if="panel" :can-spread="wide" :pdf="book.pdf" />

    <!-- Online flipbook: shown as it is. -->
    <div v-if="book.embed" class="stage stage--embed">
      <div v-if="!frameReady" class="state"><span class="spin" aria-label="Loading book" /></div>
      <iframe :src="book.embed" :title="book.title" allow="fullscreen" allowfullscreen referrerpolicy="no-referrer"
        @load="frameReady = true" />
    </div>

    <!-- PDF: our own pages. Tap the sides to turn, the middle to show or hide the controls. -->
    <div v-else ref="stage" class="stage" :class="{ zoomed: prefs.zoom > 1 }" @click="onTap"
      @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <div v-if="pdf.loading.value" class="state"><span class="spin" aria-label="Opening book" /></div>
      <div v-else-if="pdf.error.value" class="state">
        <div class="err">
          <p class="err-t">This PDF can’t be opened here.</p>
          <p class="err-x">The site that hosts it may not allow reading it from another page.</p>
          <UiButton :href="book.pdf" target="_blank" rel="noopener">Open the PDF</UiButton>
        </div>
      </div>
      <div v-show="pdf.pages.value" ref="spreadEl" class="spread" :style="{ gap: `${GAP}px` }">
        <canvas v-for="(n, i) in shown" :key="i" :ref="(el) => (canvases[i] = el as HTMLCanvasElement)" class="pg"
          role="img" :aria-label="`Page ${n} of ${pdf.pages.value}`" />
      </div>
      <button v-if="pdf.pages.value" type="button" class="turn prev" aria-label="Previous page" :disabled="page <= 1"
        @click.stop="go(-1)">
        <ChevronLeft :size="22" />
      </button>
      <button v-if="pdf.pages.value" type="button" class="turn next" aria-label="Next page"
        :disabled="last >= pdf.pages.value" @click.stop="go(1)">
        <ChevronRight :size="22" />
      </button>
    </div>

    <footer v-if="!book.embed && pdf.pages.value" class="bottom">
      <input v-model.number="scrub" class="scrub" type="range" min="1" :max="pdf.pages.value" step="1"
        aria-label="Go to page" :style="{ '--p': `${((scrub - 1) / Math.max(1, pdf.pages.value - 1)) * 100}%` }"
        @change="jump(scrub)">
      <p class="where lab-num" aria-live="polite">
        <span>{{ label }}</span>
        <span class="left">{{ leftLabel }}</span>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Book } from '~/data/books'

const props = defineProps<{ book: Book }>()
const emit = defineEmits<{ close: [] }>()

const GAP = 6
const { prefs, progress, setPage } = useReading()
const pdf = usePdf()

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const spreadEl = ref<HTMLElement | null>(null)
const canvases: HTMLCanvasElement[] = []
const chrome = ref(true)
const panel = ref(false)
const frameReady = ref(false)
const size = reactive({ w: 0, h: 0 })

/* Layout: two pages side by side on a wide screen (the cover stands alone), one page otherwise. */
const wide = computed(() => size.w >= 900 && size.w > size.h * 1.15)
const spread = computed(() => wide.value && prefs.value.spread === 'auto')
const startOf = (n: number) => (!spread.value || n <= 1 ? n : n % 2 === 0 ? n : n - 1)

const page = ref(Math.max(1, progress.value[props.book.slug]?.page ?? 1))
const shown = computed(() => {
  const total = pdf.pages.value
  if (!total) return []
  if (!spread.value || page.value === 1 || page.value >= total) return [page.value]
  return [page.value, page.value + 1]
})
const last = computed(() => shown.value[shown.value.length - 1] ?? page.value)
const scrub = ref(page.value)

const label = computed(() => shown.value.length > 1
  ? `Pages ${shown.value[0]}–${last.value} of ${pdf.pages.value}`
  : `Page ${page.value} of ${pdf.pages.value}`)
const leftLabel = computed(() => {
  const left = pdf.pages.value - last.value
  return left === 0 ? 'Last page' : left === 1 ? '1 page left' : `${left} pages left`
})

function jump(n: number, dir = 0) {
  const total = pdf.pages.value
  if (!total) return
  const next = startOf(Math.min(total, Math.max(1, n)))
  if (next === page.value) return
  turnDir = dir || Math.sign(next - page.value)
  page.value = next
}
function go(d: 1 | -1) {
  if (d > 0) jump(last.value + 1, 1)
  else jump(spread.value && page.value > 2 ? page.value - 2 : page.value - 1, -1)
  chrome.value = false
  panel.value = false
}

/* Drawing: each shown page fitted into the stage, then a short slide in the direction of travel. */
let turnDir = 0
let drawing = 0
async function draw() {
  const total = pdf.pages.value
  if (!total || !size.w) return
  const id = ++drawing
  await nextTick()
  const count = shown.value.length
  const pad = size.w < 640 ? 12 : 32
  const availW = (size.w - pad * 2 - GAP * (count - 1)) / count
  const availH = size.h - (size.w < 640 ? 120 : 136)
  const width = Math.max(120, Math.min(availW, availH * pdf.aspect.value)) * prefs.value.zoom
  const done = await Promise.all(shown.value.map((n, i) => (canvases[i] ? pdf.render(canvases[i], n, width) : false)))
  if (id !== drawing || !done.some(Boolean)) return
  if (turnDir && spreadEl.value && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    spreadEl.value.animate(
      [{ opacity: 0.35, transform: `translateX(${turnDir * 28}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }
  turnDir = 0
}

watch([page, () => pdf.pages.value], () => {
  scrub.value = page.value
  if (pdf.pages.value) setPage(props.book.slug, last.value, pdf.pages.value)
  draw()
})
watch([spread, () => prefs.value.zoom], () => {
  page.value = startOf(page.value)
  draw()
})

/* Input: taps, swipes, keys. */
function onTap(e: MouseEvent) {
  if (swiped) { swiped = false; return }
  if (panel.value) { panel.value = false; return }
  if (prefs.value.zoom > 1 || !stage.value) { chrome.value = !chrome.value; return }
  const x = (e.clientX - stage.value.getBoundingClientRect().left) / size.w
  if (x < 0.28) go(-1)
  else if (x > 0.72) go(1)
  else chrome.value = !chrome.value
}
let touch: { x: number; y: number; t: number } | null = null
let swiped = false
function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  touch = e.touches.length === 1 ? { x: t.clientX, y: t.clientY, t: Date.now() } : null
}
function onTouchEnd(e: TouchEvent) {
  if (!touch || prefs.value.zoom > 1) return
  const t = e.changedTouches[0]
  const dx = t.clientX - touch.x
  const dy = t.clientY - touch.y
  touch = null
  // A swipe can still end in a click; that click must not turn the page a second time.
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; go(dx < 0 ? 1 : -1) }
  else if (dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.6) { swiped = true; emit('close') }
  if (swiped) setTimeout(() => (swiped = false), 450)
}
function onKey(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.closest('input, textarea')) return
  if (e.key === 'Escape') { e.preventDefault(); if (panel.value) panel.value = false; else emit('close') }
  if (props.book.embed) return
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1) }
  else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1) }
  else if (e.key === 'Home') jump(1, -1)
  else if (e.key === 'End') jump(pdf.pages.value, 1)
}
function onFocusIn(e: FocusEvent) {
  if ((e.target as HTMLElement)?.closest('.top, .bottom')) chrome.value = true
}

let ro: ResizeObserver | null = null
onMounted(async () => {
  document.documentElement.style.overflow = 'hidden'
  root.value?.focus()
  window.addEventListener('keydown', onKey)
  if (props.book.pdf) {
    ro = new ResizeObserver(([entry]) => {
      size.w = entry.contentRect.width
      size.h = entry.contentRect.height
      draw()
    })
    if (root.value) ro.observe(root.value)
    await pdf.open(props.book.pdf)
    page.value = Math.min(page.value, pdf.pages.value || 1)
    draw()
  }
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  ro?.disconnect()
  pdf.close()
})
</script>

<style scoped src="./reader.css"></style>