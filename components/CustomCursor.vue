<template>
  <div
    v-if="enabled" ref="layer" class="cc" aria-hidden="true" popover="manual"
    :class="{ shown, link: overLink, press: pressed, text: overText, still: reduce }"
  >
    <div ref="arrow" class="arrow">
      <svg class="shape" viewBox="0 0 22 27" width="22" height="27">
        <path class="halo" :d="ARROW" />
        <path class="body" :d="ARROW" />
      </svg>
    </div>
    <div ref="tag" class="tag" :class="{ on: !!label && shown && !overText }">
      <span>{{ lastLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// The site's cursor for mouse and trackpad users, everywhere on the page. It lives in the browser's
// top layer (a manual popover), so it stays above the menu and command palette dialogs too; browsers
// without popovers fall back to the native cursor while a dialog is open. Touch devices get nothing;
// text fields keep the native I-beam. The native cursor is only hidden once this script is running.

// Arrowhead pointing up-left with a short notched tail and softened corners; the tip is at (2, 2).
const ARROW = 'M2 2.6C2 1.9 2.8 1.5 3.4 1.9L19.4 14.1C20 14.6 19.7 15.6 18.9 15.6L12.6 15.9L15.8 22.6C16.1 23.3 15.8 24.1 15.1 24.4L13.5 25.1C12.8 25.4 12 25.1 11.7 24.4L8.6 17.7L4 22.1C3.4 22.7 2 22.3 2 21.4Z'

const CLICKABLE = 'a[href], button, [role="button"], summary, label[for], select, input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="button"], input[type="reset"], [data-cursor-clickable]'
const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]'
const LABEL_OFFSET = { x: 16, y: 24 }
const ROOT_ON = 'cc-on'
const ROOT_NATIVE = 'cc-native'

const enabled = ref(false)
const shown = ref(false)
const overLink = ref(false)
const overText = ref(false)
const pressed = ref(false)
const label = ref('')
const lastLabel = ref('')
const reduce = useReducedMotion()

const layer = ref<HTMLElement | null>(null)
const arrow = ref<HTMLElement | null>(null)
const tag = ref<HTMLElement | null>(null)
const topLayer = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype

let x = -100, y = -100, lx = -100, ly = -100
let target: Element | null = null
let raf = 0
let fine: MediaQueryList | null = null

const root = () => document.documentElement

const inspect = (el: Element | null) => {
  const field = el?.closest(TEXT_FIELD)
  overText.value = !!field && !(field as HTMLInputElement).disabled
  const hit = el?.closest(CLICKABLE)
  overLink.value = !!hit && !hit.matches(':disabled')
  label.value = el?.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') ?? ''
  if (label.value) lastLabel.value = label.value
}

const modalOpen = () => {
  try { return !!document.querySelector('dialog:modal') }
  catch { return !!document.querySelector('dialog[open]') }
}

// Keep the cursor above everything in the top layer, including a dialog that has just opened.
const raise = () => {
  const el = layer.value
  if (!topLayer || !el) return
  try {
    if (el.matches(':popover-open')) el.hidePopover()
    el.showPopover()
  } catch { /* not connected yet */ }
}
let dialogs: MutationObserver | null = null

const frame = () => {
  raf = 0
  if (!shown.value) return
  if (!topLayer) root().classList.toggle(ROOT_NATIVE, modalOpen())
  const k = reduce.value ? 1 : 0.2
  lx += (x - lx) * k
  ly += (y - ly) * k
  if (arrow.value) arrow.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  if (tag.value) tag.value.style.transform = `translate3d(${lx + LABEL_OFFSET.x}px, ${ly + LABEL_OFFSET.y}px, 0)`
  raf = requestAnimationFrame(frame)
}
const run = () => { if (!raf) raf = requestAnimationFrame(frame) }

const onMove = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  x = e.clientX
  y = e.clientY
  if (!shown.value) {
    lx = x; ly = y
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
  --cc-fill: #ffffff;
  --cc-stroke: #0b1416;
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
  transition: opacity 160ms ease;
}
[data-theme="light"] .cc {
  --cc-fill: #111111;
  --cc-stroke: #ffffff;
}
.cc.shown { opacity: 1; }

.arrow,
.tag {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}
/* The tip sits on the hotspot: the path's tip is at (2, 2). */
.arrow { margin: -2px 0 0 -2px; transition: opacity 120ms ease; }
.text .arrow { opacity: 0; }

.shape {
  display: block;
  overflow: visible;
  filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.35)); /* taste-skill-ignore: the pointer floats over everything */
  transform-origin: 2px 2px;
  transition: transform 160ms var(--ease-spring, ease-out);
}
.link .shape { transform: scale(1.1); }
.press .shape { transform: scale(0.9); }
.still .shape { transform: none; transition: none; }

/* Colours switch the moment the theme does: no colour transition on the arrow. */
path { stroke-linejoin: round; stroke-linecap: round; transition: opacity 160ms ease; }
.body { fill: var(--cc-fill); stroke: var(--cc-stroke); stroke-width: 1.5; }
.halo { fill: none; stroke: var(--cc-stroke); stroke-width: 4.2; opacity: 0; }
/* Over something clickable: the hollow arrow, in the site's accent, on a contrasting halo. */
.link .body { fill: transparent; stroke: var(--mint, #5eead4); stroke-width: 1.8; }
.link .halo { opacity: 1; }

.tag span {
  display: block;
  padding: 6px 11px;
  border: 1px solid rgb(255 255 255 / 0.14); /* taste-skill-ignore: keeps the dark label visible on the dark teal */
  border-radius: 999px;
  background: #0f1719;
  color: #ffffff;
  font: 600 13px / 1.2 var(--font-text, system-ui, sans-serif);
  white-space: nowrap;
  box-shadow: 0 8px 24px -10px rgb(0 0 0 / 0.55); /* taste-skill-ignore: the label floats over the page with the pointer */
  opacity: 0;
  transform: translate(-6px, -4px);
  transition: opacity 180ms ease, transform 220ms var(--ease-out, ease-out);
}
.tag.on span { opacity: 1; transform: none; }
.still .tag span { transform: none; transition: opacity 120ms linear; }
</style>

<style>
/* Hide the native pointer only while the custom one is running (the class is set by the script). */
html.cc-on:not(.cc-native),
html.cc-on:not(.cc-native) *,
html.cc-on:not(.cc-native) ::backdrop { cursor: none !important; }
html.cc-on:not(.cc-native) :is(input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]) { cursor: text !important; }
</style>
