<template>
  <div ref="root" class="wave lab-wrap" aria-hidden="true">
    <svg :viewBox="`0 0 ${width} ${H}`" :width="width" :height="H">
      <path class="carrier" :d="paths[0]" />
      <path class="signal" :d="paths[1]" />
    </svg>
  </div>
</template>

<script setup lang="ts">
// A signal between sections: a wave packet that drifts slowly and swells under the pointer.
const H = 56
const root = ref<HTMLElement | null>(null)
const width = ref(1200)
const paths = ref(['', ''])
const reduce = useReducedMotion()
const inView = useInView(root)
const running = computed(() => inView.value && !reduce.value)

let px = -1e4, near = 0, nearTarget = 0

const draw = (t: number) => {
  const w = width.value, mid = H / 2
  near += (nearTarget - near) * 0.08
  let a = '', b = ''
  for (let x = 0; x <= w; x += 6) {
    const u = x / w
    const env = Math.sin(Math.PI * u) ** 1.6
    const swell = near * Math.exp(-(((x - px) / 140) ** 2))
    const amp = env * (5 + 14 * swell)
    const y1 = mid + amp * Math.sin(x * 0.045 - t * 1.1)
    const y2 = mid + amp * 0.6 * Math.sin(x * 0.09 - t * 2.2 + 1.2)
    a += (x ? 'L' : 'M') + x + ' ' + y1.toFixed(1)
    b += (x ? 'L' : 'M') + x + ' ' + y2.toFixed(1)
  }
  paths.value = [a, b]
}

useFrameLoop(running, draw, 30)

const onMove = (e: PointerEvent) => {
  const r = root.value?.getBoundingClientRect()
  if (!r) return
  px = e.clientX - r.left
  const dy = Math.abs(e.clientY - (r.top + r.height / 2))
  nearTarget = dy < 160 ? 1 - dy / 160 : 0
}

let ro: ResizeObserver | null = null
onMounted(() => {
  const measure = () => { width.value = Math.max(320, Math.round(root.value?.clientWidth ?? 1200)); draw(0) }
  measure()
  ro = new ResizeObserver(measure)
  if (root.value) ro.observe(root.value)
})
watch(running, (on) => {
  if (on) addEventListener('pointermove', onMove, { passive: true })
  else removeEventListener('pointermove', onMove)
})
onBeforeUnmount(() => { ro?.disconnect(); removeEventListener('pointermove', onMove) })
</script>

<style scoped>
.wave { padding-top: calc(var(--section-gap) * 0.55); margin-bottom: calc(var(--section-gap) * -0.45); }
svg { display: block; width: 100%; height: auto; overflow: visible; }
path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.carrier { stroke: rgb(var(--field) / 0.42); stroke-width: 1.5; }
.signal { stroke: var(--signal); stroke-width: 1.25; opacity: 0.75; }
</style>
