<template>
  <div class="pg" :style="{ width: `${width}px`, height: `${height}px` }" :data-page="n">
    <canvas ref="canvas" class="pg-c" width="0" height="0" aria-hidden="true" />
    <!-- The page's words, invisible over the picture: selectable, copyable, and read by screen readers. -->
    <div ref="text" class="textLayer" :aria-label="`Page ${n}`" role="region" />
    <span v-if="!drawn" class="pg-wait" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
// One page of the book in a box of the given size: drawn while `active`, its pixels let go when not.
const props = defineProps<{
  pdf: ReturnType<typeof usePdf>
  n: number
  width: number
  height: number
  active: boolean
  /** Words to mark on the page (the search in the contents panel). */
  query?: string
}>()
const emit = defineEmits<{ drawn: [n: number] }>()

const canvas = ref<HTMLCanvasElement | null>(null)
const text = ref<HTMLElement | null>(null)
const drawn = ref(false)
let wanted = ''

async function draw() {
  const c = canvas.value
  if (!c || !props.active || !props.width) return
  const key = `${props.n}:${Math.round(props.width)}:${Math.round(props.height)}`
  if (key === wanted) return
  wanted = key
  const size = await props.pdf.render(c, props.n, props.width, text.value, props.height)
  if (!size || key !== wanted) return
  // Scrolled away while drawing: let the pixels go at once.
  if (!props.active) { props.pdf.release(c); text.value?.replaceChildren(); wanted = ''; return }
  drawn.value = true
  mark()
  emit('drawn', props.n)
}

/** Marks every text run that holds part of a match (runs can split a word, so they are joined first). */
function mark() {
  const el = text.value
  if (!el) return
  const spans = Array.from(el.querySelectorAll<HTMLElement>('span:not(.markedContent)'))
  spans.forEach(s => s.classList.remove('hit'))
  const q = props.query?.trim().toLowerCase()
  if (!q) return
  let all = ''
  const starts: number[] = []
  for (const s of spans) { starts.push(all.length); all += (s.textContent ?? '').toLowerCase() }
  let at = all.indexOf(q)
  const marked: HTMLElement[] = []
  while (at !== -1) {
    const end = at + q.length
    spans.forEach((s, i) => {
      const a = starts[i]
      const b = a + (s.textContent?.length ?? 0)
      if (a < end && b > at) { s.classList.add('hit'); marked.push(s) }
    })
    at = all.indexOf(q, end)
  }
  marked[0]?.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })
}

watch(() => [props.active, props.width, props.height, props.n], () => {
  if (props.active) draw()
  else if (canvas.value && drawn.value) {
    props.pdf.release(canvas.value)
    text.value?.replaceChildren()
    drawn.value = false
    wanted = ''
  }
})
watch(() => props.query, mark)
onMounted(draw)
onBeforeUnmount(() => { if (canvas.value) props.pdf.release(canvas.value) })
</script>

<style scoped>
.pg {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  --scale-round-x: 1px;
  --scale-round-y: 1px;
}

.pg-c {
  display: block;
  filter: var(--r-filter);
  mix-blend-mode: var(--r-blend);
  transition: filter 320ms ease;
}

.reader[data-r="original"] .pg-c {
  box-shadow: 0 20px 50px -20px rgb(0 0 0 / 0.8); /* taste-skill-ignore: the original page is a sheet lying on the desk */
  border-radius: 2px;
}

.pg-wait {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: var(--r-control);
}

/* pdf.js text layer, trimmed from pdf_viewer.css: transparent runs laid exactly over the drawn words. */
.textLayer {
  position: absolute;
  inset: 0;
  margin: auto;
  overflow: clip;
  line-height: 1;
  text-align: initial;
  text-size-adjust: none;
  forced-color-adjust: none;
  transform-origin: 0 0;
  z-index: 1;
  --min-font-size: 1;
  --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));
  --min-font-size-inv: calc(1 / var(--min-font-size));
}

.textLayer :deep(:is(span, br)) {
  position: absolute;
  color: transparent;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
  user-select: text;
  -webkit-user-select: text;
}

.textLayer :deep(> :not(.markedContent)),
.textLayer :deep(.markedContent span:not(.markedContent)) {
  z-index: 1;
  --font-height: 0;
  font-size: calc(var(--text-scale-factor) * var(--font-height));
  --scale-x: 1;
  --rotate: 0deg;
  transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));
}

.textLayer :deep(.markedContent) { display: contents; }
.textLayer :deep(.endOfContent) { display: block; position: absolute; inset: 100% 0 0; z-index: 0; cursor: default; user-select: none; }
.textLayer :deep(::selection) { background: var(--r-select); color: transparent; }

/* A search match: the page's own ink, faint, so it reads on every theme. */
.textLayer :deep(span.hit) {
  margin: -1px;
  padding: 1px;
  border-radius: 3px;
  background: var(--r-hit);
}
</style>
