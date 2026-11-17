<template>
  <footer ref="foot" class="foot" @pointermove="onMove" @pointerleave="onLeave">
    <div class="lab-wrap">
      <svg ref="svg" class="field" :viewBox="`0 0 ${w} ${H}`" :width="w" :height="H" aria-hidden="true">
        <path v-for="(d, i) in lines" :key="i" :d="d" :style="{ opacity: 0.18 + 0.5 * (1 - Math.abs(i - 4) / 5) }" />
        <circle class="pole" cx="0" :cy="H / 2" r="4" />
        <circle class="pole" :cx="w" :cy="H / 2" r="4" />
      </svg>
      <p class="river">
        <span><span lang="grc">πάντα ῥεῖ</span>, everything flows</span>
        <span class="river-who">Heraclitus</span>
      </p>
      <p class="name">Rakibul H. Rabbi</p>
      <p class="tag">Building scalable systems, engineering intelligent tools.</p>
    </div>

    <LabAgora />

    <div class="lab-wrap">
      <svg class="meander" width="100%" height="14" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="foot-meander" width="18" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 13.5H18M14 13.5V.5H2V10H10V4.5H6" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#foot-meander)" />
      </svg>
      <div class="line">
        <p>Dhaka, Bangladesh<template v-if="dhaka"> · <time class="clock">{{ dhaka }}</time></template></p>
        <nav aria-label="Elsewhere" class="links">
          <a :href="CONTACT.github" target="_blank" rel="noopener" data-cursor-label="Open ↗">GitHub</a>
          <a :href="CONTACT.linkedin" target="_blank" rel="noopener" data-cursor-label="Open ↗">LinkedIn</a>
          <a :href="CONTACT.medium" target="_blank" rel="noopener" data-cursor-label="Open ↗">Medium</a>
          <NuxtLink to="/resume">Résumé</NuxtLink>
        </nav>
        <p class="end"><span class="lab-mono">© {{ year }} rabbitic</span></p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { CONTACT, LOCATION } from '~/data/portfolio'

// GFS Didot only for the footer's Greek and quote text; the browser fetches it only where it is used.
useHead({ link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=GFS+Didot&display=swap' }] })

// Live Dhaka time, client-only (empty during SSR so there is no hydration mismatch).
const dhaka = ref('')
const clock = new Intl.DateTimeFormat('en-GB', { timeZone: LOCATION.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
let tick: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  const set = () => { dhaka.value = clock.format(new Date()) }
  set()
  tick = setInterval(set, 30_000)
})
onBeforeUnmount(() => clearInterval(tick))

// Nine field lines between two poles at the edges; the pointer pulls them like a third pole, and they spring back.
const H = 180
const N = 9
const year = new Date().getFullYear()
const foot = ref<HTMLElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const w = ref(1200)
const lines = ref<string[]>([])
const reduce = useReducedMotion()

let target = { x: 0, y: 0, k: 0 }
let pole = { x: 0, y: 0, k: 0 }
const settling = ref(false)

const draw = () => {
  const out: string[] = []
  for (let i = 0; i < N; i++) {
    const lane = 18 + i * ((H - 36) / (N - 1)) - H / 2
    let d = ''
    for (let x = 0; x <= w.value; x += 10) {
      const y0 = H / 2 + lane * Math.sin(Math.PI * (x / w.value)) ** 0.55
      const dx = x - pole.x, dy = pole.y - y0
      const f = pole.k * Math.exp(-(dx * dx) / 26000 - (dy * dy) / 9000)
      const y = y0 + dy * f * 0.7
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1)
    }
    out.push(d)
  }
  lines.value = out
}

useFrameLoop(settling, () => {
  pole.x += (target.x - pole.x) * 0.18
  pole.y += (target.y - pole.y) * 0.18
  pole.k += (target.k - pole.k) * 0.12
  draw()
  if (Math.abs(target.k - pole.k) < 0.005 && Math.abs(target.x - pole.x) < 0.5) settling.value = false
}, 60)

const onMove = (e: PointerEvent) => {
  if (reduce.value || e.pointerType === 'touch' || !svg.value) return
  const r = svg.value.getBoundingClientRect()
  target = { x: e.clientX - r.left, y: Math.min(H + 60, Math.max(-60, e.clientY - r.top)), k: 1 }
  if (pole.k < 0.01) { pole.x = target.x; pole.y = target.y }
  settling.value = true
}
const onLeave = () => { target = { ...target, k: 0 }; settling.value = true }

let ro: ResizeObserver | null = null
onMounted(() => {
  const measure = () => { w.value = Math.max(320, Math.round(svg.value?.parentElement?.clientWidth ?? 1200)); draw() }
  measure()
  ro = new ResizeObserver(measure)
  if (foot.value) ro.observe(foot.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
/* Bottom room for the fixed corner controls (contact pill 52px + 12px + back-to-top 48px, from 24px / 16px),
   so they never sit on the footer's last line. */
.foot {
  padding: clamp(96px, 10vw, 160px) 0 152px;
  overflow: hidden;
  border-top: 1px solid var(--border); /* taste-skill-ignore: where the page ends and the footer well begins */
  background: var(--background-deep);
  --font-greek: "GFS Didot", Georgia, serif;
  /* The painting in LabAgora: quiet by default, the scene wakes when the footer is hovered or focused. */
  --agora-filter: grayscale(1) sepia(.45) brightness(.4) contrast(1.18);
}
.foot:hover, .foot:focus-within { --agora-filter: grayscale(.55) sepia(.35) brightness(.5) contrast(1.12); }
[data-theme="light"] .foot { --agora-filter: grayscale(1) contrast(1.04) brightness(1.04); }
[data-theme="light"] .foot:hover, [data-theme="light"] .foot:focus-within { --agora-filter: grayscale(.15); }
@media (max-width: 639px) { .foot { padding-bottom: 140px; } }
.river {
  display: flex;
  justify-content: space-between;
  gap: var(--s-4);
  margin-top: var(--s-3);
  font: 400 15px / 1.4 var(--font-greek);
  color: var(--muted-foreground);
}
@media (max-width: 699px) { .river-who { display: none; } }
.meander { display: block; margin-top: var(--s-7); }
.meander path { fill: none; stroke: color-mix(in srgb, var(--muted-foreground) 45%, transparent); stroke-width: 1; }
.clock { font-variant-numeric: tabular-nums; }
.field { display: block; width: 100%; height: auto; overflow: visible; }
.field path { fill: none; stroke: var(--muted-foreground); stroke-width: 1.25; }
.field path:nth-child(5) { stroke: var(--foreground); }
.pole { fill: var(--foreground); }
.name {
  margin-top: var(--s-6);
  color: var(--foreground);
  font: 700 var(--step-display) / 0.86 var(--font-display);
  letter-spacing: -0.05em;
  white-space: nowrap;
}
.tag { margin-top: var(--s-5); font-size: var(--step-lead); color: var(--muted-foreground); max-width: 40ch; }
.line {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: var(--s-4);
  margin-top: var(--s-4);
  font-size: var(--step-small);
  color: var(--muted-foreground);
}
.links { display: flex; gap: var(--s-5); font-size: 16px; }
.links a { color: var(--foreground); text-decoration: none; padding: 8px 0; transition: color var(--dur-hover) ease; }
.links a:hover { color: var(--primary); }
.end { display: flex; justify-content: flex-end; align-items: center; gap: var(--s-3); }
.end .lab-mono { font-size: 12px; color: var(--muted-foreground); text-transform: lowercase; }

@media (max-width: 899px) {
  .name { white-space: normal; font-size: clamp(3.25rem, 1rem + 11vw, 6rem); }
  .line { grid-template-columns: 1fr; gap: var(--s-2); }
  .links { flex-wrap: wrap; gap: 0 var(--s-5); }
  .end { justify-content: flex-start; }
}
</style>
