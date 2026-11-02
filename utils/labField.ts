/**
 * The hero instrument: the portrait drawn in characters inside a dipole field.
 * Pole A is fixed in the upper left and radiates rings; pole B follows the pointer
 * (or rests above the portrait). Characters near the pointer bend away, and a lens
 * around it re-renders the face at twice the resolution.
 */

const RAMP = ' .,:;i1tfLCG08@'
const FINE_RAMP = ' .:+x*X#@'
const BUCKETS = 6

interface Box { x: number; y: number; w: number; h: number }
interface Pt { x: number; y: number }

export interface LabFieldOptions {
  canvas: HTMLCanvasElement
  stage: HTMLElement
  portrait: HTMLImageElement
  onReady?: (characters: number) => void
}

export function createLabField({ canvas, stage, portrait, onReady }: LabFieldOptions) {
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return { destroy() {} }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  const coarse = matchMedia('(pointer: coarse)').matches

  let w = 0, h = 0, dpr = 1, compact = false
  let fontPx = 11, cw = 6.6, ch = 12
  let box: Box = { x: 0, y: 0, w: 0, h: 0 }
  let cols = 0, rows = 0
  let norm = new Float32Array(0)      // 0..1 lightness of the subject per cell
  let mask = new Uint8Array(0)        // 1 where the subject is
  let fine = new Float32Array(0)      // twice the resolution, for the lens
  let fineMask = new Uint8Array(0)
  let phase = new Float32Array(0)
  let bucket = new Uint8Array(0)
  let offX = new Float32Array(0), offY = new Float32Array(0)
  let glyph = new Uint8Array(0)
  let vig = new Float32Array(0)       // bust vignette, so the shoulders dissolve into the field

  let poleA: Pt = { x: 0, y: 0 }
  let rest: Pt = { x: 0, y: 0 }
  let poleB: Pt = { x: 0, y: 0 }
  let target: Pt = { x: 0, y: 0 }
  let pointer: Pt | null = null
  let lastLinesAt: Pt = { x: -999, y: -999 }
  let lines: { pts: Float32Array; n: number }[] = []
  const pulses = Array.from({ length: 3 }, (_, i) => ({ line: i * 7, t: Math.random(), speed: 0.12 + Math.random() * 0.1 }))

  let ink = '236 230 218', signal = '#86b9ea', dark = true
  let raf = 0, visible = true, lastFrame = 0, touchTimer = 0
  const frameMs = coarse ? 1000 / 20 : 1000 / 30
  const start = performance.now()

  function readColours() {
    const cs = getComputedStyle(stage)
    ink = cs.getPropertyValue('--field').trim() || ink
    signal = cs.getPropertyValue('--signal').trim() || signal
    dark = document.documentElement.dataset.theme !== 'light'
  }

  function measure() {
    const s = stage.getBoundingClientRect()
    const r = portrait.getBoundingClientRect()
    w = s.width; h = s.height
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    box = { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }
    compact = w < 900 || (h > w && w <= 1100)
    fontPx = compact ? 7 : 9
    ctx!.font = `${fontPx}px ui-monospace, Menlo, Consolas, monospace`
    cw = ctx!.measureText('M').width
    ch = Math.round(fontPx * 1.12)
    cols = Math.max(8, Math.floor(box.w / cw))
    rows = Math.max(8, Math.floor(box.h / ch))
    poleA = compact ? { x: w * 0.14, y: h * 0.12 } : { x: Math.max(box.x * 0.34, w * 0.12), y: h * 0.26 }
    rest = { x: box.x + box.w * 0.5, y: Math.max(12, box.y + box.h * 0.02) }
    if (!pointer) { poleB = { ...rest }; target = { ...rest } }
    sample()
    lastLinesAt = { x: -999, y: -999 }
  }

  function lightness(data: Uint8ClampedArray, n: number, width: number, out: Float32Array, m: Uint8Array) {
    const raw = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3]
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      const sat = (Math.max(r, g, b) - Math.min(r, g, b)) / 255
      raw[i] = a > 40 && (l < 0.8 || (sat > 0.16 && l < 0.92)) ? 1 : 0
      out[i] = l
    }
    // Erode by one cell: the anti-aliased rim against the white backdrop would draw a bright halo.
    const vals: number[] = []
    for (let i = 0; i < n; i++) {
      const x = i % width
      m[i] = raw[i] && (x === 0 || raw[i - 1]) && (x === width - 1 || raw[i + 1]) && (i < width || raw[i - width]) && (i + width >= n || raw[i + width]) ? 1 : 0
      if (m[i]) vals.push(out[i])
    }
    // Histogram equalisation over the subject: every tone step gets the same share of cells,
    // so eyes, brows and beard separate from the skin instead of sharing one grey.
    vals.sort((p, q) => p - q)
    const len = vals.length || 1
    for (let i = 0; i < n; i++) {
      if (!m[i]) { out[i] = 0; continue }
      let lo = 0, hi = vals.length
      while (lo < hi) { const mid = (lo + hi) >> 1; if (vals[mid] < out[i]) lo = mid + 1; else hi = mid }
      out[i] = lo / len
    }
  }

  function sample() {
    const off = document.createElement('canvas')
    const octx = off.getContext('2d', { willReadFrequently: true })!
    const n = cols * rows
    off.width = cols; off.height = rows
    octx.drawImage(portrait, 0, 0, cols, rows)
    norm = new Float32Array(n); mask = new Uint8Array(n)
    lightness(octx.getImageData(0, 0, cols, rows).data, n, cols, norm, mask)

    // Local contrast (measured over the subject only) keeps eyes, brows and beard readable,
    // then an S-curve separates the lit skin from the shadows.
    const sharp = new Float32Array(n)
    vig = new Float32Array(n)
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const ex = (x - cols * 0.5) / (cols * 0.5), ey = (y - rows * 0.4) / (rows * 0.6)
      vig[i] = Math.min(1, Math.max(0, (1.12 - Math.hypot(ex, ey)) / 0.4))
      if (!mask[i]) continue
      let sum = 0, k = 0
      for (let j = -1; j <= 1; j++) for (let q = -1; q <= 1; q++) {
        const xx = x + q, yy = y + j
        if (xx >= 0 && yy >= 0 && xx < cols && yy < rows && mask[yy * cols + xx]) { sum += norm[yy * cols + xx]; k++ }
      }
      const v = norm[i]
      sharp[i] = Math.min(1, Math.max(0, v + 0.5 * (v - sum / k)))
    }
    norm = sharp

    off.width = cols * 2; off.height = rows * 2
    octx.drawImage(portrait, 0, 0, cols * 2, rows * 2)
    fine = new Float32Array(n * 4); fineMask = new Uint8Array(n * 4)
    lightness(octx.getImageData(0, 0, cols * 2, rows * 2).data, n * 4, cols * 2, fine, fineMask)

    phase = new Float32Array(n).map(() => Math.random() * Math.PI * 2)
    bucket = new Uint8Array(n); glyph = new Uint8Array(n)
    offX = new Float32Array(n); offY = new Float32Array(n)
    let count = 0
    for (let i = 0; i < n; i++) if (mask[i]) count++
    onReady?.(count)
  }

  function computeLines() {
    lines = []
    const seeds = compact ? 18 : 28
    const margin = 60, step = 7, maxSteps = 360
    for (let s = 0; s < seeds; s++) {
      const a = (s / seeds) * Math.PI * 2
      let x = poleA.x + Math.cos(a) * 9, y = poleA.y + Math.sin(a) * 9
      const pts = new Float32Array(maxSteps * 2)
      let n = 0
      for (let i = 0; i < maxSteps; i++) {
        pts[n * 2] = x; pts[n * 2 + 1] = y; n++
        const ax = x - poleA.x, ay = y - poleA.y, bx = x - poleB.x, by = y - poleB.y
        const da = Math.pow(ax * ax + ay * ay, 1.5) || 1, db = Math.pow(bx * bx + by * by, 1.5) || 1
        const ex = 1.35 * ax / da - bx / db, ey = 1.35 * ay / da - by / db
        const len = Math.hypot(ex, ey) || 1
        x += (ex / len) * step; y += (ey / len) * step
        if (bx * bx + by * by < 100 || x < -margin || y < -margin || x > w + margin || y > h + margin) break
      }
      lines.push({ pts, n })
    }
    lastLinesAt = { ...poleB }
  }

  function drawField(t: number, still: boolean) {
    const c = ctx!
    // Rings radiating from pole A, like a transmitter.
    const maxR = Math.hypot(w, h) * 0.55
    c.lineWidth = 1
    for (let k = 0; k < 5; k++) {
      const r = still ? (k + 1) * maxR / 6 : ((t * 22 + k * maxR / 5) % maxR)
      const a = 0.14 * (1 - r / maxR)
      c.strokeStyle = `rgb(${ink} / ${a.toFixed(3)})`
      c.beginPath(); c.arc(poleA.x, poleA.y, r, 0, Math.PI * 2); c.stroke()
    }
    c.strokeStyle = `rgb(${ink} / 0.13)`
    c.beginPath()
    for (const l of lines) {
      if (l.n < 2) continue
      c.moveTo(l.pts[0], l.pts[1])
      for (let i = 1; i < l.n; i++) c.lineTo(l.pts[i * 2], l.pts[i * 2 + 1])
    }
    c.stroke()
    // The poles.
    c.fillStyle = `rgb(${ink} / 0.9)`
    c.beginPath(); c.arc(poleA.x, poleA.y, 3.5, 0, Math.PI * 2); c.fill()
    c.strokeStyle = `rgb(${ink} / 0.35)`
    c.beginPath(); c.arc(poleA.x, poleA.y, 9, 0, Math.PI * 2); c.stroke()
    if (pointer) { c.beginPath(); c.arc(poleB.x, poleB.y, 3, 0, Math.PI * 2); c.fill() }
    if (still || !lines.length) return
    // Energy pulses travelling along the lines.
    c.fillStyle = signal
    for (const p of pulses) {
      const l = lines[p.line % lines.length]
      if (l.n < 4) { p.line++; continue }
      p.t += p.speed / 30
      if (p.t > 1) { p.t = 0; p.line = Math.floor(Math.random() * lines.length) }
      const i = Math.floor(p.t * (l.n - 1))
      for (let k = 0; k < 6; k++) {
        const j = Math.max(0, i - k * 2)
        c.globalAlpha = 0.9 * (1 - k / 6)
        c.beginPath(); c.arc(l.pts[j * 2], l.pts[j * 2 + 1], 1.8 - k * 0.2, 0, Math.PI * 2); c.fill()
      }
      c.globalAlpha = 1
    }
  }

  function drawPortrait(t: number, still: boolean) {
    const c = ctx!
    const n = cols * rows
    const lensR = coarse || still ? 0 : 92, bendR = 150
    const px = pointer?.x ?? -9999, py = pointer?.y ?? -9999
    const scanRow = still ? -99 : ((t % 7) / 5) * rows
    const fadeFrom = rows * (compact ? 0.62 : 0.74)
    const lens: number[] = []

    for (let i = 0; i < n; i++) {
      bucket[i] = 255
      if (!mask[i]) continue
      const x = i % cols, y = (i / cols) | 0
      let v = dark ? norm[i] ** 1.25 : 1 - norm[i]
      v = Math.max(0.1, v)
      if (!still) v *= 0.9 + 0.1 * Math.sin(t * 1.4 + phase[i])
      const scan = Math.exp(-((y - scanRow) ** 2) / 5)
      v = Math.min(1, v + scan * 0.2)
      v *= vig[i]
      if (y > fadeFrom) v *= 1 - (y - fadeFrom) / (rows - fadeFrom)
      if (v < 0.05) continue
      const cx = box.x + x * cw, cy = box.y + y * ch
      let ox = 0, oy = 0
      const dx = cx - px, dy = cy - py, d = Math.hypot(dx, dy)
      if (d < lensR) { lens.push(i); continue }
      if (d < bendR && d > 0) {
        const f = (1 - d / bendR) ** 2
        ox = (dx / d) * f * 14 - (dy / d) * f * Math.sin(t * 7 + d * 0.06) * 2.5
        oy = (dy / d) * f * 14 + (dx / d) * f * Math.sin(t * 7 + d * 0.06) * 2.5
      }
      offX[i] = cx + ox; offY[i] = cy + oy
      glyph[i] = Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)))
      bucket[i] = Math.min(BUCKETS - 1, Math.floor(v * BUCKETS))
    }

    c.font = `${fontPx}px ui-monospace, Menlo, Consolas, monospace`
    c.textBaseline = 'top'
    c.fillStyle = `rgb(${ink})`
    for (let b = 0; b < BUCKETS; b++) {
      c.globalAlpha = 0.28 + 0.72 * ((b + 1) / BUCKETS)
      for (let i = 0; i < n; i++) if (bucket[i] === b && glyph[i]) c.fillText(RAMP[glyph[i]], offX[i], offY[i])
    }

    // Scan line glyphs pick up the signal colour.
    if (!still && scanRow >= 0 && scanRow < rows) {
      const y = Math.round(scanRow)
      c.fillStyle = signal; c.globalAlpha = 0.35
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x
        if (bucket[i] !== 255 && glyph[i]) c.fillText(RAMP[glyph[i]], offX[i], offY[i])
      }
    }

    // The lens: the same face at twice the resolution.
    if (lens.length) {
      c.font = `${Math.max(6, fontPx / 2 + 1)}px ui-monospace, Menlo, Consolas, monospace`
      c.fillStyle = `rgb(${ink})`
      const fc = cols * 2
      for (const i of lens) {
        const x = i % cols, y = (i / cols) | 0
        for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
          const fi = (y * 2 + j) * fc + x * 2 + k
          if (!fineMask[fi]) continue
          const v = Math.max(0.15, dark ? fine[fi] : 1 - fine[fi])
          c.globalAlpha = 0.35 + 0.65 * v
          c.fillText(FINE_RAMP[Math.round(v * (FINE_RAMP.length - 1))], box.x + x * cw + k * cw / 2, box.y + y * ch + j * ch / 2)
        }
      }
      c.globalAlpha = 0.5
      c.strokeStyle = signal
      c.beginPath(); c.arc(px, py, lensR, 0, Math.PI * 2); c.stroke()
    }
    c.globalAlpha = 1
  }

  function render(now: number) {
    const still = reduce.matches
    const t = Math.max(0, now - start) / 1000
    poleB.x += (target.x - poleB.x) * 0.12
    poleB.y += (target.y - poleB.y) * 0.12
    if (Math.hypot(poleB.x - lastLinesAt.x, poleB.y - lastLinesAt.y) > 1.5) computeLines()
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx!.clearRect(0, 0, w, h)
    drawField(t, still)
    drawPortrait(t, still)
  }

  function loop(now: number) {
    raf = 0
    if (!visible || reduce.matches) return
    if (now - lastFrame >= frameMs) { lastFrame = now; render(now) }
    raf = requestAnimationFrame(loop)
  }

  function kick() {
    if (reduce.matches) { poleB = { ...target }; render(performance.now()); return }
    if (!raf && visible) raf = requestAnimationFrame(loop)
  }

  function local(e: PointerEvent): Pt {
    const s = stage.getBoundingClientRect()
    return { x: e.clientX - s.left, y: e.clientY - s.top }
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || reduce.matches) return
    pointer = local(e); target = { ...pointer }
  }
  const onLeave = () => { pointer = null; target = { ...rest } }
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || reduce.matches) return
    pointer = local(e); target = { ...pointer }
    clearTimeout(touchTimer)
    touchTimer = window.setTimeout(onLeave, 2400)
  }
  const onResize = () => { measure(); kick() }
  const onTheme = () => { readColours(); kick() }
  const onVisibility = () => { visible = !document.hidden; kick() }

  const ro = new ResizeObserver(onResize)
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && !document.hidden; kick() })

  function init() {
    readColours()
    measure()
    ro.observe(stage)
    io.observe(stage)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('lab-theme', onTheme)
    document.addEventListener('visibilitychange', onVisibility)
    reduce.addEventListener('change', kick)
    kick()
  }

  if (portrait.complete && portrait.naturalWidth) init()
  else portrait.addEventListener('load', init, { once: true })

  return {
    destroy() {
      cancelAnimationFrame(raf)
      clearTimeout(touchTimer)
      ro.disconnect(); io.disconnect()
      portrait.removeEventListener('load', init)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointerdown', onDown)
      window.removeEventListener('lab-theme', onTheme)
      document.removeEventListener('visibilitychange', onVisibility)
      reduce.removeEventListener('change', kick)
    },
  }
}
