<template>
  <!-- Two shades above and below a clear band: the line being read stays bright, the rest steps back. -->
  <div class="ruler" aria-hidden="true" :style="{ '--y': `${y}px`, '--band': `${BAND}px` }">
    <span class="shade top" />
    <span class="shade bottom" />
  </div>
</template>

<script setup lang="ts">
// Reading ruler for focus mode. It follows the pointer; the arrow keys move it a band at a time (the
// reader calls `move`); in scroll mode it stays put and the text scrolls through it.
const BAND = 84
const y = ref(0)

function clampY(v: number) { return Math.min(innerHeight - BAND / 2, Math.max(BAND / 2, v)) }
function onPointer(e: PointerEvent) { if (e.pointerType === 'mouse') y.value = clampY(e.clientY) }
function onTouch(e: TouchEvent) { if (e.touches.length === 1) y.value = clampY(e.touches[0].clientY) }
function move(dir: 1 | -1) { y.value = clampY(y.value + dir * BAND * 0.8) }
defineExpose({ move })

onMounted(() => {
  y.value = innerHeight * 0.4
  addEventListener('pointermove', onPointer, { passive: true })
  addEventListener('touchstart', onTouch, { passive: true })
})
onBeforeUnmount(() => {
  removeEventListener('pointermove', onPointer)
  removeEventListener('touchstart', onTouch)
})
</script>

<style scoped>
.ruler { position: fixed; inset: 0; z-index: 4; pointer-events: none; }
.shade {
  position: absolute;
  inset-inline: 0;
  background: var(--r-shade);
  transition: height 90ms linear, top 90ms linear;
}
.top { top: 0; height: calc(var(--y) - var(--band) / 2); }
.bottom { top: calc(var(--y) + var(--band) / 2); bottom: 0; }
@media (prefers-reduced-motion: reduce) {
  .shade { transition: none; }
}
</style>
