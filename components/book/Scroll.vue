<template>
  <div ref="stage" class="scroller" tabindex="-1" @scroll.passive="onScroll" @click="onTap">
    <div ref="col" class="col" :style="{ gap: `${gap}px` }">
      <BookPage v-for="n in total" :key="n" :pdf="pdf" :n="n" :width="box.w" :height="box.h" :active="n >= range[0] && n <= range[1]"
        :query="n >= range[0] && n <= range[1] ? query : ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Continuous reading: every page in one column, each box sized before it is drawn, so the scrollbar is
// true from the start. Only the pages on screen and the next one are drawn; the rest stay empty boxes.
const props = defineProps<{
  pdf: ReturnType<typeof usePdf>
  total: number
  page: number
  box: { w: number; h: number }
  gap: number
  query?: string
}>()
const emit = defineEmits<{ 'update:page': [n: number]; middle: [] }>()

const stage = ref<HTMLElement | null>(null)
const col = ref<HTMLElement | null>(null)
const top = ref(0)
const view = ref(0)
const pitch = computed(() => props.box.h + props.gap)
const padTop = () => parseFloat(getComputedStyle(col.value!).paddingTop) || 0

/** Pages to draw: those on screen, plus one ahead. */
const range = computed<[number, number]>(() => {
  if (!pitch.value || !view.value) return [props.page, props.page + 1]
  const first = Math.floor(top.value / pitch.value) + 1
  const last = Math.floor((top.value + view.value) / pitch.value) + 1
  return [Math.max(1, first - 1), Math.min(props.total, last + 1)]
})

let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const el = stage.value
    if (!el) return
    top.value = Math.max(0, el.scrollTop - padTop())
    view.value = el.clientHeight
    // The page under the reading line, two fifths down the screen.
    const n = Math.min(props.total, Math.max(1, Math.floor((top.value + view.value * 0.4) / pitch.value) + 1))
    if (n !== props.page) { settling = n; emit('update:page', n) }
  })
}

/** Scrolls so page `n` starts at the top. */
function scrollToPage(n: number, offset = 0) {
  const el = stage.value
  if (!el || !col.value) return
  el.scrollTo({ top: padTop() + (n - 1 + offset) * pitch.value - 8, behavior: 'instant' as ScrollBehavior })
  onScroll()
}
function scrollBy(dy: number) {
  stage.value?.scrollBy({ top: dy, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
defineExpose({ stage, col, scrollToPage, scrollBy })

// A jump from outside (contents, slider, keys) moves the column; a page reached by scrolling does not.
let settling = 0
watch(() => props.page, (n) => { if (n !== settling) scrollToPage(n) })
// A new size keeps the reader on the same spot of the same page.
watch(() => props.box.h, async (_, before) => {
  if (!stage.value || !before) return
  const at = (stage.value.scrollTop - padTop()) / (before + props.gap)
  await nextTick()
  scrollToPage(1, at)
})

function onTap() {
  if (!window.getSelection()?.toString()) emit('middle')
}

onMounted(async () => {
  await nextTick()
  view.value = stage.value?.clientHeight ?? 0
  scrollToPage(props.page)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.scroller {
  position: absolute;
  inset: 0;
  overflow: auto;
  overscroll-behavior: contain;
  outline: none;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  min-width: 100%;
  margin-inline: auto;
  padding: var(--r-pad-top) 12px var(--r-pad-bottom);
  box-sizing: border-box;
}
</style>
