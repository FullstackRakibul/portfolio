<template>
  <div class="sheet panel" role="dialog" aria-label="Contents, bookmarks and search" @click.stop>
    <div class="seg tabs" role="tablist" aria-label="Panel">
      <button v-for="t in TABS" :id="`tab-${t.id}`" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id"
        :aria-controls="`pane-${t.id}`" @click="tab = t.id">{{ t.label }}</button>
    </div>

    <!-- Contents: the PDF's own table of contents. -->
    <div v-if="tab === 'contents'" id="pane-contents" role="tabpanel" aria-labelledby="tab-contents" class="pane">
      <p v-if="toc === null" class="note">Reading the contents…</p>
      <p v-else-if="!toc.length" class="note">This book has no table of contents. Use search or the page slider to find your way.</p>
      <ol v-else class="list">
        <li v-for="(item, i) in toc" :key="i">
          <button type="button" class="item" :class="{ here: i === here }" :style="{ paddingLeft: `${12 + item.depth * 16}px` }"
            :aria-current="i === here ? 'true' : undefined" @click="emit('go', item.page)">
            <span class="t">{{ item.title }}</span><span class="n">{{ item.page }}</span>
          </button>
        </li>
      </ol>
    </div>

    <!-- Bookmarks: pages this reader marked. -->
    <div v-else-if="tab === 'bookmarks'" id="pane-bookmarks" role="tabpanel" aria-labelledby="tab-bookmarks" class="pane">
      <p v-if="!marks.length" class="note">No bookmarks yet. Press B, or the bookmark at the top, to mark the page you are on.</p>
      <ul v-else class="list">
        <li v-for="p in marks" :key="p" class="mark">
          <button type="button" class="item" @click="emit('go', p)">
            <span class="t">Page {{ p }}<small v-if="snippets[p]">{{ snippets[p] }}</small></span>
          </button>
          <button type="button" class="x" :aria-label="`Remove bookmark on page ${p}`" @click="toggleBookmark(slug, p)">
            <X :size="16" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <!-- Search: every match in the book, page by page. -->
    <div v-else id="pane-search" role="tabpanel" aria-labelledby="tab-search" class="pane">
      <div class="find">
        <Search :size="16" aria-hidden="true" />
        <input ref="field" v-model="q" type="search" placeholder="Find in this book" aria-label="Find in this book"
          autocomplete="off" @keydown.enter="run(true)">
      </div>
      <p class="note" aria-live="polite">{{ status }}</p>
      <ol class="list">
        <li v-for="(h, i) in hits" :key="i">
          <button type="button" class="item hit" @click="open(h.page)">
            <span class="t">…{{ h.before }}<mark>{{ h.match }}</mark>{{ h.after }}…</span><span class="n">{{ h.page }}</span>
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import type { OutlineItem, SearchHit } from '~/composables/usePdf'

// The reader's side panel: the book's contents, this reader's bookmarks, and search inside the book.
const props = defineProps<{ pdf: ReturnType<typeof usePdf>; slug: string; page: number }>()
const emit = defineEmits<{ go: [page: number] }>()
const tab = defineModel<'contents' | 'bookmarks' | 'search'>('tab', { required: true })
/** The search, shown marked on the page. */
const highlight = defineModel<string>('highlight', { default: '' })
const { marksOf, toggleBookmark } = useReading()

const TABS = [{ id: 'contents', label: 'Contents' }, { id: 'bookmarks', label: 'Bookmarks' }, { id: 'search', label: 'Search' }] as const

/* Contents, and the entry the reader is in. */
const toc = ref<OutlineItem[] | null>(null)
const here = computed(() => {
  if (!toc.value) return -1
  let at = -1
  toc.value.forEach((it, i) => { if (it.page <= props.page) at = i })
  return at
})

/* Bookmarks, each with the opening words of its page. */
const marks = computed(() => marksOf(props.slug))
const snippets = reactive<Record<number, string>>({})
watch(marks, (list) => {
  for (const p of list) if (!snippets[p]) props.pdf.textOf(p).then(s => (snippets[p] = s.trim().slice(0, 72))).catch(() => {})
}, { immediate: true })

/* Search. */
const MAX = 400
const field = ref<HTMLInputElement | null>(null)
const q = ref(highlight.value)
const hits = ref<SearchHit[]>([])
const searched = ref(0)
const busy = ref(false)
let ctl: AbortController | null = null
let timer = 0

async function run(now = false) {
  clearTimeout(timer)
  if (!now) { timer = window.setTimeout(() => run(true), 320); return }
  ctl?.abort()
  hits.value = []
  searched.value = 0
  const query = q.value.trim()
  if (query.length < 2) { busy.value = false; return }
  const c = ctl = new AbortController()
  busy.value = true
  await props.pdf.search(query, (h) => { if (hits.value.length < MAX) hits.value.push(h); else c.abort() }, n => (searched.value = n), c.signal)
  if (ctl === c) busy.value = false
}
watch(q, () => run())

const total = computed(() => props.pdf.pages.value)
const status = computed(() => {
  const query = q.value.trim()
  if (query.length < 2) return 'Type at least two letters.'
  const found = hits.value.length >= MAX ? `${MAX}+ matches` : `${hits.value.length} ${hits.value.length === 1 ? 'match' : 'matches'}`
  return busy.value ? `${found} · searched ${searched.value} of ${total.value} pages` : found
})

function open(page: number) {
  highlight.value = q.value.trim()
  emit('go', page)
}

watch(tab, async (t) => {
  if (t === 'search') { await nextTick(); field.value?.focus() }
}, { immediate: true })
onMounted(async () => { toc.value = await props.pdf.outline().catch(() => []) })
onBeforeUnmount(() => { ctl?.abort(); clearTimeout(timer) })
</script>

<style scoped src="./sheet.css"></style>
<style scoped>
.panel {
  top: calc(env(safe-area-inset-top, 0px) + 64px);
  left: max(12px, env(safe-area-inset-left, 0px));
  bottom: max(12px, env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  width: min(380px, calc(100vw - 24px));
  max-height: none;
  padding: 12px;
  overflow: hidden;
}

.tabs button { min-height: 40px; padding: 0 8px; font-size: 13px; }
.pane { flex: 1; min-height: 0; overflow: auto; margin: 12px -4px 0; padding: 0 4px; overscroll-behavior: contain; }
.note { margin: 12px 8px; font-size: 14px; line-height: 1.5; color: var(--r-muted); }
.list { margin: 0; padding: 0; list-style: none; }

.item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--r-ink);
  font: 400 14px / 1.4 var(--font-text);
  text-align: left;
  cursor: pointer;
}
.item .t { flex: 1; min-width: 0; }
.item .t small { display: block; margin-top: 2px; font-size: 12px; color: var(--r-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item .n { flex: none; font-size: 13px; color: var(--r-muted); font-variant-numeric: tabular-nums; }
.item.here { background: var(--r-control); font-weight: 600; }
.hit .t { color: var(--r-muted); }
mark { padding: 0 1px; border-radius: 3px; background: var(--r-hit); color: var(--r-ink); }

.mark { display: flex; align-items: center; }
.x {
  display: grid;
  place-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--r-muted);
  cursor: pointer;
}

.find { position: relative; display: flex; align-items: center; margin-top: 12px; color: var(--r-muted); }
.find svg { position: absolute; left: 12px; pointer-events: none; }
.find input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px 0 36px;
  border: 0;
  border-radius: 12px;
  background: var(--r-control);
  color: var(--r-ink);
  font: 15px var(--font-text);
}
.find input::placeholder { color: var(--r-muted); }

@media (hover: hover) {
  .item:hover, .x:hover { background: var(--r-control); }
  .x:hover { color: var(--r-ink); }
}
</style>
