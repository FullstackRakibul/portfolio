<template>
  <!--
    The real <h1> stays in the page so layout, wrapping, SEO and screen readers
    are unchanged. Once the particles are ready its text turns transparent and
    the canvas draws the same glyphs, in the same place, as particles.
  -->
  <h1 ref="headingRef" :class="['name-particles', { 'is-live': isLive }]">
    <template v-for="(line, i) in lines" :key="line">
      <span class="name-particles__line">{{ line }}</span>{{ i < lines.length - 1 ? ' ' : '' }}
    </template>
    <canvas ref="canvasRef" class="name-particles__canvas" aria-hidden="true" />
  </h1>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // One entry per visual line, so the particles break exactly where the text does.
  lines: { type: Array, default: () => ['Rakibul H.', 'Rabbi'] },
  // Distance between sampled points, in CSS pixels. Lower = denser and heavier.
  density: { type: Number, default: 3 },
  // How far around the pointer the particles scatter, in CSS pixels.
  radius: { type: Number, default: 110 },
  // Colour particles take while scattered. Falls back to the theme's --primary.
  scatterColor: { type: String, default: '' },
})

const headingRef = ref(null)
const canvasRef = ref(null)
const isLive = ref(false)

let ctx = null
let particles = []
let frame = 0
let pointer = { x: -9999, y: -9999, active: false }
// Read from the theme before the first frame (rebuild() calls readColors() first).
let colors = { base: '', scatter: '', scatterOpacity: 1 }
let visible = true
let dpr = 1
let cleanups = []

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function readColors() {
  const h1 = headingRef.value
  // Read the heading's real colour from the theme (the text itself is transparent while live).
  const probe = document.createElement('span')
  probe.style.color = 'inherit'
  h1.appendChild(probe)
  const base = getComputedStyle(probe).color
  probe.remove()
  // Dark: the accent. Light: no accent at all, so --primary is the foreground and the scattered
  // particles are drawn at --name-scatter-opacity instead.
  const root = getComputedStyle(document.documentElement)
  const accent = root.getPropertyValue('--primary').trim()
  const opacity = Number.parseFloat(root.getPropertyValue('--name-scatter-opacity'))
  colors = { base, scatter: props.scatterColor || accent || base, scatterOpacity: Number.isFinite(opacity) ? opacity : 1 }
}

// Draw the lines offscreen with the heading's own font and collect the filled pixels.
function sample() {
  const h1 = headingRef.value
  const canvas = canvasRef.value
  const box = h1.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(box.width * dpr)
  canvas.height = Math.round(box.height * dpr)
  canvas.style.width = `${box.width}px`
  canvas.style.height = `${box.height}px`

  const off = document.createElement('canvas')
  off.width = canvas.width
  off.height = canvas.height
  const o = off.getContext('2d', { willReadFrequently: true })
  o.scale(dpr, dpr)
  o.fillStyle = '#000'

  for (const span of h1.querySelectorAll('.name-particles__line')) {
    const s = getComputedStyle(span)
    const r = span.getBoundingClientRect()
    o.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
    if ('letterSpacing' in o) o.letterSpacing = s.letterSpacing === 'normal' ? '0px' : s.letterSpacing
    o.textBaseline = 'alphabetic'
    // CSS centres the font's ascent+descent inside the line box; mirror that to find the baseline.
    const m = o.measureText(span.textContent)
    const ascent = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent
    const descent = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent
    const lineHeight = parseFloat(s.lineHeight) || r.height
    const baseline = r.top - box.top + (lineHeight - (ascent + descent)) / 2 + ascent
    o.fillText(span.textContent, r.left - box.left, baseline)
  }

  const data = o.getImageData(0, 0, off.width, off.height).data
  const step = Math.max(1, Math.round(props.density * dpr))
  const size = Math.max(1, step * 0.8)
  const next = []
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      if (data[(y * off.width + x) * 4 + 3] > 128) {
        next.push({
          bx: x, by: y,
          x: x + (Math.random() - 0.5) * off.width * 0.6,
          y: y + (Math.random() - 0.5) * off.height * 1.4,
          size: size * (0.75 + Math.random() * 0.5),
          seed: Math.random() * Math.PI * 2,
          heat: 1,
        })
      }
    }
  }
  particles = next
}

function tick(time) {
  frame = 0
  if (!visible) return
  const canvas = canvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const r = props.radius * dpr
  const px = pointer.x * dpr
  const py = pointer.y * dpr
  const t = time * 0.001

  const cool = []
  const hot = []
  for (const p of particles) {
    let tx = p.bx
    let ty = p.by
    if (pointer.active) {
      const dx = p.bx - px
      const dy = p.by - py
      const d = Math.hypot(dx, dy)
      if (d < r) {
        const f = (1 - d / r) ** 2
        tx += (dx / (d || 1)) * f * r * 0.55
        ty += (dy / (d || 1)) * f * r * 0.55
        p.heat = Math.min(1, p.heat + 0.25)
      }
    }
    p.x += (tx - p.x) * 0.12
    p.y += (ty - p.y) * 0.12
    p.heat *= 0.94
      ; (p.heat > 0.35 ? hot : cool).push(p)
  }

  // A barely-there shimmer keeps the name alive without blurring it.
  const drawSet = (set, color, alpha = 1) => {
    ctx.fillStyle = color
    ctx.globalAlpha = alpha
    for (const p of set) {
      const fx = Math.sin(t + p.seed) * 0.35 * dpr
      const fy = Math.cos(t * 0.8 + p.seed) * 0.25 * dpr
      ctx.fillRect(p.x + fx, p.y + fy, p.size, p.size)
    }
  }
  drawSet(cool, colors.base)
  drawSet(hot, colors.scatter, colors.scatterOpacity)
  ctx.globalAlpha = 1

  frame = requestAnimationFrame(tick)
}

function start() {
  if (!frame && visible) frame = requestAnimationFrame(tick)
}

function rebuild() {
  readColors()
  sample()
  start()
}

function on(target, type, fn, opts) {
  target.addEventListener(type, fn, opts)
  cleanups.push(() => target.removeEventListener(type, fn, opts))
}

onMounted(async () => {
  if (reducedMotion()) return // plain text, exactly as before
  const h1 = headingRef.value
  ctx = canvasRef.value.getContext('2d')

  // Sample only once the web font is in, or the particles take the fallback font's shape.
  if (document.fonts?.ready) await document.fonts.ready
  rebuild()
  isLive.value = true

  const move = (x, y) => {
    const b = h1.getBoundingClientRect()
    const m = props.radius
    const inside = x > b.left - m && x < b.right + m && y > b.top - m && y < b.bottom + m
    pointer = { x: x - b.left, y: y - b.top, active: inside }
  }
  on(window, 'pointermove', (e) => move(e.clientX, e.clientY), { passive: true })
  on(window, 'touchmove', (e) => e.touches[0] && move(e.touches[0].clientX, e.touches[0].clientY), { passive: true })
  const leave = () => { pointer.active = false }
  on(window, 'touchend', leave, { passive: true })
  on(document, 'pointerleave', leave)

  // Re-sample when the heading's size changes (resize, breakpoints, font swap).
  let resizeTimer = 0
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(rebuild, 120)
  })
  ro.observe(h1)
  cleanups.push(() => { ro.disconnect(); clearTimeout(resizeTimer) })

  // Follow the theme toggle and the OS colour scheme.
  const mo = new MutationObserver(readColors)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] })
  cleanups.push(() => mo.disconnect())
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  on(mq, 'change', readColors)

  // Stop drawing while the hero is scrolled out of view.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
  })
  io.observe(h1)
  cleanups.push(() => io.disconnect())
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<style scoped>
.name-particles {
  position: relative;
}

.name-particles__line {
  display: block;
}

.name-particles.is-live .name-particles__line {
  /* Keep the glyphs for layout, selection and assistive tech; the canvas paints them. */
  color: transparent;
}

.name-particles__canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>