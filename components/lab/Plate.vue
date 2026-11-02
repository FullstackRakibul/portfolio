<template>
  <figure ref="root" class="plate">
    <div class="frame">
      <img
        ref="img"
        src="/assets/lab/tesla-laboratory.webp"
        width="1800"
        height="1359"
        alt="Nikola Tesla reading in his Colorado Springs laboratory while discharges from the magnifying transmitter arc across the room"
        loading="lazy"
        decoding="async"
      >
    </div>
    <figcaption>
      Tesla's laboratory in Colorado Springs, 1899, a multiple exposure. Engineering the invisible; architecting the future.
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// The one moving picture: the plate settles from a slight zoom as it scrolls through the screen.
const root = ref<HTMLElement | null>(null)
const img = ref<HTMLImageElement | null>(null)
let raf = 0
let io: IntersectionObserver | null = null

const update = () => {
  raf = 0
  if (!root.value || !img.value) return
  const r = root.value.getBoundingClientRect()
  const p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (innerHeight + r.height)))
  img.value.style.transform = `scale(${(1.12 - p * 0.12).toFixed(4)}) translateY(${((p - 0.5) * -3).toFixed(2)}%)`
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); update() }
    else removeEventListener('scroll', onScroll)
  })
  io.observe(root.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.plate {
  margin: calc(50svh - var(--rail-h) / 2) 0 0;
}
.frame {
  height: min(92svh, 75vw);
  overflow: hidden;
  background: var(--surface);
}
img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 30% 50%;
  will-change: transform;
}
figcaption {
  padding: 14px var(--margin) 0;
  max-width: 60ch;
  font-size: var(--step-small);
  color: var(--muted);
}
@media (max-width: 640px) {
  .frame { height: 64svh; }
  img { object-position: 22% 50%; }
}
</style>
