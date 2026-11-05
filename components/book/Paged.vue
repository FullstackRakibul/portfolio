<template>
  <div ref="stage" class="stage" :class="{ over: overflowing }" @click="onTap" @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd">
    <div ref="spread" class="spread" :style="{ gap: `${gap}px` }">
      <!-- Keyed by position, so a turn redraws in place and the old page stays until the new one is ready. -->
      <BookPage v-for="(n, i) in shown" :key="i" :pdf="pdf" :n="n" :width="box.w" :height="box.h" active
        :query="query" @drawn="onDrawn" />
    </div>
    <button type="button" class="turn prev" aria-label="Previous page" :disabled="shown[0] <= 1" @click.stop="emit('turn', -1)">
      <ChevronLeft :size="22" aria-hidden="true" />
    </button>
    <button type="button" class="turn next" aria-label="Next page" :disabled="last >= total" @click.stop="emit('turn', 1)">
      <ChevronRight :size="22" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// Paged reading: one page, or two side by side on a wide screen. Tap the sides or swipe to turn; tap the
// middle to show or hide the controls; swipe down to close. Zoomed past the screen, the page pans instead.
const props = defineProps<{
  pdf: ReturnType<typeof usePdf>
  shown: number[]
  total: number
  box: { w: number; h: number }
  gap: number
  overflowing: boolean
  query?: string
}>()
const emit = defineEmits<{ turn: [dir: 1 | -1]; middle: []; close: [] }>()

const stage = ref<HTMLElement | null>(null)
const spread = ref<HTMLElement | null>(null)
const last = computed(() => props.shown[props.shown.length - 1] ?? 1)
defineExpose({ stage, spread })

/* A short slide in the direction of travel once the new page is drawn. */
let dir = 0
watch(() => props.shown[0], (now, before) => { dir = before ? Math.sign(now - before) : 0 })
function onDrawn() {
  if (!dir || !spread.value || matchMedia('(prefers-reduced-motion: reduce)').matches) { dir = 0; return }
  spread.value.animate(
    [{ opacity: 0.35, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  )
  dir = 0
}

function onTap(e: MouseEvent) {
  if (swiped) { swiped = false; return }
  // Selecting words is not a tap.
  if (window.getSelection()?.toString()) return
  if (props.overflowing || !stage.value) { emit('middle'); return }
  const r = stage.value.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  if (x < 0.28) emit('turn', -1)
  else if (x > 0.72) emit('turn', 1)
  else emit('middle')
}

let touch: { x: number; y: number } | null = null
let swiped = false
function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  touch = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null
}
function onTouchEnd(e: TouchEvent) {
  if (!touch || props.overflowing) return
  const t = e.changedTouches[0]
  const dx = t.clientX - touch.x
  const dy = t.clientY - touch.y
  touch = null
  // A swipe can still end in a click; that click must not turn the page a second time.
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; emit('turn', dx < 0 ? 1 : -1) }
  else if (dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.6) { swiped = true; emit('close') }
  if (swiped) setTimeout(() => (swiped = false), 450)
}
</script>

<style scoped>
.stage {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--r-pad-top) 12px var(--r-pad-bottom);
  overflow: hidden;
  touch-action: pan-y;
}

.stage.over {
  place-items: start center;
  overflow: auto;
  touch-action: pan-x pan-y;
}

.spread {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Side arrows: visible on a mouse; invisible tap zones do the same job on touch. */
.turn {
  position: absolute;
  top: 50%;
  display: none;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-top: -24px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--r-control);
  color: var(--r-ink);
  cursor: pointer;
  opacity: 0;
  z-index: 2;
  transition: opacity 200ms ease, background-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}

.turn.prev { left: max(16px, env(safe-area-inset-left, 0px)); }
.turn.next { right: max(16px, env(safe-area-inset-right, 0px)); }
.turn:disabled { visibility: hidden; }
.turn:focus-visible { opacity: 1; }
.turn:active { transform: scale(0.92); }

@media (hover: hover) and (pointer: fine) {
  .turn { display: grid; }
  .stage:hover .turn { opacity: 0.85; }
  .turn:hover { background: var(--r-control-hover); }
}

.reader.focus .turn { display: none; }

@media (prefers-reduced-motion: reduce) {
  .turn { transition: opacity 120ms ease; }
}
</style>
