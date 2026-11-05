<template>
  <div
    v-if="enabled" ref="layer" class="cc" aria-hidden="true" popover="manual"
    :class="{ shown, link: overLink, press: pressed, text: overText, off: overDisabled, still: reduce }"
  >
    <!-- The follower ring eases behind the pointer; it grows over clickables and shrinks when pressed. -->
    <div ref="ringEl" class="follower">
      <svg class="ring-shape" viewBox="0 0 28 28" width="28" height="28">
        <circle cx="14" cy="14" r="13.5" />
      </svg>
    </div>
    <!-- The arrow follows the pointer exactly, so a click lands where it looks like it will. -->
    <div ref="pointerEl" class="pointer">
      <svg class="arrow" viewBox="0 0 22 27" width="13" height="16">
        <path :d="ARROW" />
      </svg>
      <svg class="beam" viewBox="0 0 6 20" width="6" height="20">
        <rect x="2" y="1" width="2" height="18" rx="1" />
      </svg>
    </div>
    <div ref="tagEl" class="tag" :class="{ on: !!label && shown && !overText }">
      <span>{{ lastLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// The site's cursor on devices with a fine pointer and hover, everywhere, all the time: a small precise
// arrow that follows the pointer exactly and a soft follower ring that eases behind it. Over clickables
// the ring grows and fills faintly; pressed, it shrinks; over text fields the arrow becomes a slim text
// bar; over disabled controls the ring turns dashed. It lives in the browser's top layer (a manual
// popover) so it stays above dialogs; browsers without popovers fall back to the native cursor while a
// dialog is open. Touch devices get nothing. The native cursor is hidden only once this script runs.

// Arrowhead pointing up-left with a short notched tail; the tip is at (2, 2) in a 22×27 box.
const ARROW = 'M2 2.6C2 1.9 2.8 1.5 3.4 1.9L19.4 14.1C20 14.6 19.7 15.6 18.9 15.6L12.6 15.9L15.8 22.6C16.1 23.3 15.8 24.1 15.1 24.4L13.5 25.1C12.8 25.4 12 25.1 11.7 24.4L8.6 17.7L4 22.1C3.4 22.7 2 22.3 2 21.4Z'

const CLICKABLE = 'a[href], button, [role="button"], [role="link"], summary, label[for], select, input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="button"], input[type="reset"], input[type="range"], [data-cursor-clickable]'
const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]'
const RING_EASE = 0.18
const LABEL_OFFSET = { x: 18, y: 22 }
const ROOT_ON = 'cc-on'
const ROOT_NATIVE = 'cc-native'

const enabled = ref(false)
const shown = ref(false)
const overLink = ref(false)
const overText = ref(false)
const overDisabled = ref(false)
const pressed = ref(false)
const label = ref('')
const lastLabel = ref('')
const reduce = useReducedMotion()

const layer = ref<HTMLElement | null>(null)
const pointerEl = ref<HTMLElement | null>(null)
const ringEl = ref<HTMLElement | null>(null)
const tagEl = ref<HTMLElement | null>(null)
const topLayer = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype

// Pointer and ring positions, in viewport pixels. The frame loop only reads these numbers.
let x = 0, y = 0, rx = 0, ry = 0
let target: Element | null = null
let raf = 0
let fine: MediaQueryList | null = null

const root = () => document.documentElement

const inspect = (el: Element | null) => {
  const field = el?.closest(TEXT_FIELD) as HTMLInputElement | null
  overText.value = !!field && !field.disabled
  const hit = overText.value ? null : el?.closest(CLICKABLE)
  const disabled = !!hit && (hit.matches(':disabled') || hit.getAttribute('aria-disabled') === 'true')
  overDisabled.value = disabled
  overLink.value = !!hit && !disabled
  label.value = disabled ? '' : el?.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') ?? ''
  if (label.value) lastLabel.value = label.value
}

// Keep the cursor above everything in the top layer, including a dialog that has just opened.
const raise = () => {
  const el = layer.value
  if (!el) return
  if (!topLayer) { root().classList.toggle(ROOT_NATIVE, !!document.querySelector('dialog[open]')); return }
  try {
    if (el.matches(':popover-open')) el.hidePopover()
    el.showPopover()
  } catch { /* not connected yet */ }
}
let dialogs: MutationObserver | null = null

// One loop, transforms only: the arrow sits on the pointer, the ring and the label ease after it.
const frame = () => {
  raf = 0
  if (!shown.value) return
  const k = reduce.value ? 1 : RING_EASE
  rx += (x - rx) * k
  ry += (y - ry) * k
  if (pointerEl.value) pointerEl.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  if (ringEl.value) ringEl.value.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
  if (tagEl.value) tagEl.value.style.transform = `translate3d(${rx + LABEL_OFFSET.x}px, ${ry + LABEL_OFFSET.y}px, 0)`
  // Keep running until the ring has caught up; the next move starts it again.
  if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) raf = requestAnimationFrame(frame)
}
const run = () => { if (!raf) raf = requestAnimationFrame(frame) }

const onMove = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  x = e.clientX
  y = e.clientY
  if (!shown.value) {
    // First move: start the ring on the pointer (never at 0,0), then fade in.
    rx = x; ry = y
    root().classList.add(ROOT_ON)
    shown.value = true
  }
  if (e.target !== target) { target = e.target as Element; inspect(target) }
  run()
}
const onDown = (e: PointerEvent) => { if (e.pointerType === 'mouse') pressed.value = true }
const onUp = () => { pressed.value = false }
const onLeave = (e: MouseEvent) => { if (!e.relatedTarget) { shown.value = false; pressed.value = false } }
const onBlur = () => { shown.value = false }
// The page can move under a still pointer; check what is under it now.
const onScroll = () => {
  if (!shown.value) return
  target = document.elementFromPoint(x, y)
  inspect(target)
}

const enable = () => {
  enabled.value = true
  nextTick(raise)
  dialogs = new MutationObserver(raise)
  dialogs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] })
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('pointerdown', onDown, { passive: true })
  addEventListener('pointerup', onUp, { passive: true })
  addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('mouseout', onLeave)
  addEventListener('blur', onBlur)
}
const disable = () => {
  dialogs?.disconnect()
  dialogs = null
  enabled.value = false
  shown.value = false
  removeEventListener('pointermove', onMove)
  removeEventListener('pointerdown', onDown)
  removeEventListener('pointerup', onUp)
  removeEventListener('scroll', onScroll)
  document.removeEventListener('mouseout', onLeave)
  removeEventListener('blur', onBlur)
  cancelAnimationFrame(raf); raf = 0
  root().classList.remove(ROOT_ON, ROOT_NATIVE)
}
const onCapability = () => (fine?.matches ? enable() : disable())

// Hidden with the pointer: hand the page back to the native cursor too.
watch(shown, (on) => { if (!on) root().classList.remove(ROOT_ON, ROOT_NATIVE) })

onMounted(() => {
  fine = matchMedia('(hover: hover) and (pointer: fine)')
  fine.addEventListener('change', onCapability)
  onCapability()
})
onBeforeUnmount(() => {
  fine?.removeEventListener('change', onCapability)
  disable()
})
</script>

<style scoped>
.cc {
  /* Dark: a --foreground arrow with a --background outline; the ring --muted-foreground at 50%. */
  --cc-ring: color-mix(in srgb, var(--muted-foreground) 50%, transparent);
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  pointer-events: none;
  opacity: 0;
  transition: opacity 180ms ease;
}
/* Light: a black arrow with a white outline (the same tokens); the ring black at 25%. */
[data-theme="light"] .cc { --cc-ring: color-mix(in srgb, var(--foreground) 25%, transparent); }
.cc.shown { opacity: 1; }

/* (Not ".ring": Tailwind generates a .ring utility, a 1px box-shadow that would draw a dot here.) */
.pointer,
.follower,
.tag {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}

/* The arrow's tip (2, 2 in its 22×27 box, drawn at 13×16) sits on the hotspot. */
.arrow { position: absolute; left: -1.2px; top: -1.2px; display: block; overflow: visible; }
.arrow path {
  fill: var(--foreground);
  stroke: var(--background);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  stroke-linejoin: round;
}
/* Over a text field the arrow turns into a slim text bar, centred on the hotspot. */
.beam { position: absolute; left: -3px; top: -10px; display: block; overflow: visible; opacity: 0; transform: scaleY(0.6); }
.beam rect { fill: var(--foreground); stroke: var(--background); stroke-width: 1; vector-effect: non-scaling-stroke; }
.arrow, .beam { transition: opacity 120ms ease, transform 160ms var(--ease-out); }
.text .arrow { opacity: 0; transform: scale(0.6); }
.text .beam { opacity: 1; transform: none; }

/* The follower ring: 28px, 1px. Over a clickable it grows to 40px with a faint fill; pressed, 22px. */
.ring-shape {
  position: absolute;
  left: -14px;
  top: -14px;
  display: block;
  overflow: visible;
  transition: transform 220ms var(--ease-out), opacity 150ms ease;
}
.ring-shape circle {
  fill: var(--primary);
  fill-opacity: 0;
  stroke: var(--cc-ring);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  transition: fill-opacity 150ms ease, stroke-dasharray 150ms ease;
}
.link .ring-shape { transform: scale(1.4286); }
.link .ring-shape circle { fill-opacity: 0.1; }
.press .ring-shape { transform: scale(0.7857); }
.off .ring-shape circle { stroke-dasharray: 3 3; }
.text .ring-shape { opacity: 0; }

/* data-cursor-label: a small card pill below-right of the pointer. */
.tag span {
  display: block;
  padding: 4px 9px;
  border: 1px solid var(--border); /* taste-skill-ignore: the label pill's edge (the brief's design system) */
  border-radius: 999px;
  background: var(--card);
  color: var(--foreground);
  font: 500 12px / 1.3 var(--font-text, system-ui, sans-serif);
  white-space: nowrap;
  box-shadow: var(--shadow-float); /* taste-skill-ignore: the label floats over the page with the pointer */
  opacity: 0;
  transform: translate(-4px, -3px);
  transition: opacity 150ms ease, transform 200ms var(--ease-out);
}
.tag.on span { opacity: 1; transform: none; }

/* Reduced motion: the ring snaps to the pointer (see frame()) and never scales. */
.still .ring-shape,
.still.link .ring-shape,
.still.press .ring-shape { transform: none; transition: opacity 150ms ease; }
.still .arrow, .still .beam { transition: opacity 120ms ease; transform: none; }
.still .tag span { transform: none; transition: opacity 120ms linear; }
</style>

<style>
/* The custom cursor is the cursor everywhere while it runs (the class is set by the script, so a
   failed script leaves the native cursor alone): pointer, text and default cursors are all overridden. */
html.cc-on:not(.cc-native),
html.cc-on:not(.cc-native) *,
html.cc-on:not(.cc-native) ::backdrop { cursor: none !important; }
</style>
