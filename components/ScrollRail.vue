<template>
  <div
    v-if="enabled && scrollable" ref="rail" class="rail" :class="{ awake: awake || hover || dragging, dragging }"
    aria-hidden="true" data-cursor-clickable
    @pointerdown="onRailDown" @pointerenter="hover = true" @pointerleave="hover = false"
  >
    <span ref="read" class="seg read" />
    <span ref="rest" class="seg rest" />
    <span
      ref="grip" class="grip"
      @pointerdown.stop="onGripDown" @pointermove="onGripMove" @pointerup="onGripUp" @pointercancel="onGripUp"
    >
      <svg viewBox="0 0 14 40" width="14" height="40">
        <path d="M3.5 12.5 7 9l3.5 3.5" />
        <circle cx="7" cy="20" r="1.8" />
        <path d="M3.5 27.5 7 31l3.5-3.5" />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
// A slim scroll rail along the right edge for mouse and trackpad users. The grip (⌃ • ⌄) splits it into
// what has been read and what remains; it follows the scroll, can be dragged, and a click on the rail
// jumps there. Touch devices and reduced-motion users keep the native scrollbar.

const GRIP = 40
const GAP = 4

const enabled = ref(false)
const scrollable = ref(true)
const awake = ref(false)
const hover = ref(false)
const dragging = ref(false)
const rail = ref<HTMLElement | null>(null)
const read = ref<HTMLElement | null>(null)
const rest = ref<HTMLElement | null>(null)
const grip = ref<HTMLElement | null>(null)

let raf = 0
let idle = 0
let grab = 0
let mqFine: MediaQueryList | null = null
let mqReduce: MediaQueryList | null = null

const maxScroll = () => document.documentElement.scrollHeight - innerHeight

const paint = () => {
  raf = 0
  const max = maxScroll()
  scrollable.value = max > 4
  const r = rail.value
  if (!r) return
  const h = r.clientHeight
  const travel = h - GRIP
  const t = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) * travel : 0
  if (grip.value) grip.value.style.transform = `translate3d(-50%, ${t}px, 0)`
  if (read.value) read.value.style.transform = `scaleY(${Math.max(0, t - GAP) / h})`
  if (rest.value) rest.value.style.transform = `scaleY(${Math.max(0, h - t - GRIP - GAP) / h})`
}
const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }

const wake = () => {
  awake.value = true
  clearTimeout(idle)
  idle = window.setTimeout(() => { awake.value = false }, 1200)
}
const onScroll = () => { schedule(); wake() }

// Rail position (px from its top, for the grip's top edge) → page scroll.
const scrollToGrip = (top: number, behavior: ScrollBehavior) => {
  const travel = (rail.value?.clientHeight ?? 0) - GRIP
  if (travel <= 0) return
  const p = Math.min(1, Math.max(0, top / travel))
  window.scrollTo({ top: p * maxScroll(), behavior })
}

const onRailDown = (e: PointerEvent) => {
  if (e.button !== 0 || !rail.value) return
  const y = e.clientY - rail.value.getBoundingClientRect().top
  scrollToGrip(y - GRIP / 2, 'smooth')
}
const onGripDown = (e: PointerEvent) => {
  if (e.button !== 0 || !grip.value) return
  e.preventDefault()
  grip.value.setPointerCapture(e.pointerId)
  grab = e.clientY - grip.value.getBoundingClientRect().top
  dragging.value = true
}
const onGripMove = (e: PointerEvent) => {
  if (!dragging.value || !rail.value) return
  scrollToGrip(e.clientY - rail.value.getBoundingClientRect().top - grab, 'instant')
}
const onGripUp = (e: PointerEvent) => {
  if (!dragging.value) return
  dragging.value = false
  grip.value?.releasePointerCapture?.(e.pointerId)
}

let ro: ResizeObserver | null = null
const setup = () => {
  const on = !!mqFine?.matches && !mqReduce?.matches
  if (on === enabled.value) return
  enabled.value = on
  document.documentElement.classList.toggle('rail-on', on)
  if (on) {
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', schedule, { passive: true })
    ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    nextTick(schedule)
  } else {
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', schedule)
    ro?.disconnect()
  }
}

onMounted(() => {
  mqFine = matchMedia('(hover: hover) and (pointer: fine)')
  mqReduce = matchMedia('(prefers-reduced-motion: reduce)')
  mqFine.addEventListener('change', setup)
  mqReduce.addEventListener('change', setup)
  setup()
})
onBeforeUnmount(() => {
  mqFine?.removeEventListener('change', setup)
  mqReduce?.removeEventListener('change', setup)
  document.documentElement.classList.remove('rail-on')
  removeEventListener('scroll', onScroll)
  removeEventListener('resize', schedule)
  ro?.disconnect()
  cancelAnimationFrame(raf)
  clearTimeout(idle)
})
watch(rail, schedule)
</script>

<style scoped>
.rail {
  /* Read part: --muted-foreground; what remains: the rail track, --border-strong. */
  --rail-read: var(--muted-foreground);
  --rail-rest: var(--border-strong);
  position: fixed;
  top: 84px;
  bottom: 12px;
  right: 5px;
  z-index: 38;
  width: 16px;
  opacity: 0.32;
  transition: opacity 320ms ease;
  touch-action: none;
}
.rail.awake { opacity: 1; }

.seg {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 100%;
  margin-left: -1px;
  border-radius: 2px;
}
.read { top: 0; background: var(--rail-read); transform-origin: top; transform: scaleY(0); }
.rest { bottom: 0; background: var(--rail-rest); transform-origin: bottom; }

.grip {
  position: absolute;
  top: 0;
  left: 50%;
  display: grid;
  place-items: center;
  width: 16px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid var(--border); /* taste-skill-ignore: the grip's edge (the brief's design system) */
  border-radius: 999px;
  background: var(--card);
  transform: translate3d(-50%, 0, 0);
  will-change: transform;
  transition: background-color 200ms ease, border-color 200ms ease;
}
.grip svg { display: block; overflow: visible; }
.grip path { fill: none; stroke: var(--foreground); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: stroke var(--dur-hover) ease; }
.grip circle { fill: var(--foreground); transition: fill var(--dur-hover) ease; }
.dragging .grip,
.grip:hover { border-color: var(--primary); }
.dragging .grip path,
.grip:hover path { stroke: var(--primary); }
.dragging .grip circle,
.grip:hover circle { fill: var(--primary); }
</style>
