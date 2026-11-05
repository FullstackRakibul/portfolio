<template>
  <section id="engineering" v-reveal class="lab-section lab-wrap" aria-labelledby="eng-h">
    <div class="lab-head">
      <h2 id="eng-h" data-reveal>Engineering capabilities</h2>
      <p data-reveal>
        The tools I reach for, grouped the way the work uses them. No percentages: either I ship with it or it isn’t
        listed. Pick a stack to see the tools one piece of work connects.
      </p>
    </div>

    <div ref="board" class="board" data-reveal>
      <div class="bar">
        <div class="search">
          <Search :size="17" aria-hidden="true" />
          <label for="tool-q" class="sr-only">Find a tool</label>
          <input id="tool-q" v-model="q" type="search" placeholder="Find a tool, e.g. Docker" autocomplete="off">
        </div>
        <div class="paths" role="group" aria-label="Show the stack behind a piece of work">
          <UiButton
            v-for="p in CAPABILITY_PATHS" :key="p.id" size="sm" :variant="path === p.id ? 'default' : 'outline'"
            :aria-pressed="path === p.id" @click="path = path === p.id ? '' : p.id"
          >
            {{ p.label }}
          </UiButton>
        </div>
        <p class="count lab-num" role="status">{{ q ? `${shown} of ${total}` : `${total} tools` }}</p>
      </div>
      <p class="path-note" aria-live="polite">{{ current ? current.note : 'No stack selected.' }}</p>

      <svg ref="svg" class="wires" :viewBox="`0 0 ${size.w} ${size.h}`" :width="size.w" :height="size.h" aria-hidden="true">
        <path v-if="wire" :id="wireId" :key="path" class="wire" :d="wire" />
        <template v-if="wire">
          <circle v-for="k in 2" :key="k" class="pulse" r="4">
            <animateMotion :dur="dur + 's'" :begin="-(k - 1) * dur / 2 + 's'" repeatCount="indefinite" rotate="auto">
              <mpath :href="'#' + wireId" />
            </animateMotion>
          </circle>
        </template>
      </svg>

      <div class="clusters">
        <section v-for="g in CAPABILITIES" :key="g.id" class="cluster" :class="{ lit: litGroup === g.id }">
          <h3><span class="hub" aria-hidden="true" />{{ g.name }}</h3>
          <p class="note">{{ g.note }}</p>
          <ul>
            <li
              v-for="item in g.items" :key="item" :data-item="item"
              :class="{ hit: q && hit(item), miss: q && !hit(item), on: onPath(item), hover: hoverItem === item }"
              @pointerenter="hoverItem = item" @pointerleave="hoverItem = ''"
            >
              <span class="dot" aria-hidden="true" /><span class="lbl">{{ item }}</span><span v-if="onPath(item)" class="sr-only">, in this stack</span>
            </li>
          </ul>
        </section>
      </div>
      <p v-if="q && !shown" class="none">Not in the toolkit yet.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { CAPABILITIES, CAPABILITY_PATHS } from '~/data/portfolio'

const q = ref('')
const path = ref('mostisko')
const hoverItem = ref('')
const board = ref<HTMLElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const size = reactive({ w: 1000, h: 600 })
const wire = ref('')
const dur = ref(6)
const wireId = `wire-${useId()}`

useSvgMotion(svg)

const hit = (item: string) => item.toLowerCase().includes(q.value.trim().toLowerCase())
const total = CAPABILITIES.reduce((n, g) => n + g.items.length, 0)
const shown = computed(() => CAPABILITIES.reduce((n, g) => n + g.items.filter(hit).length, 0))
const current = computed(() => CAPABILITY_PATHS.find(p => p.id === path.value))
const onPath = (item: string) => !!current.value?.items.includes(item)
const litGroup = computed(() => CAPABILITIES.find(g => g.items.includes(hoverItem.value))?.id ?? '')

// Wire: one continuous curve through the stack's tools, read across the clusters left to right.
const draw = () => {
  const b = board.value
  if (!b) return
  const r = b.getBoundingClientRect()
  size.w = Math.round(r.width)
  size.h = Math.round(r.height)
  const items = current.value?.items ?? []
  const pts = items.map((item) => {
    const dot = b.querySelector(`[data-item="${CSS.escape(item)}"] .dot`)
    const d = dot?.getBoundingClientRect()
    return d ? { x: d.left + d.width / 2 - r.left, y: d.top + d.height / 2 - r.top } : null
  }).filter(Boolean) as { x: number; y: number }[]
  pts.sort((a, c) => (Math.abs(a.x - c.x) > 20 ? a.x - c.x : a.y - c.y))
  if (pts.length < 2) { wire.value = ''; return }
  let d = `M${pts[0].x} ${pts[0].y}`
  let len = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], c = pts[i], dx = c.x - a.x
    len += Math.hypot(dx, c.y - a.y)
    if (Math.abs(dx) > 30) d += `C${a.x + dx / 2} ${a.y} ${c.x - dx / 2} ${c.y} ${c.x} ${c.y}`
    else {
      const out = Math.min(a.x, c.x) - 26
      d += `C${out} ${a.y} ${out} ${c.y} ${c.x} ${c.y}`
    }
  }
  wire.value = d
  dur.value = Math.max(4, Math.round(len / 160))
}

watch(path, () => nextTick(draw))
let ro: ResizeObserver | null = null
onMounted(() => {
  draw()
  ro = new ResizeObserver(draw)
  if (board.value) ro.observe(board.value)
  document.fonts?.ready.then(draw)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
.board {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border); /* taste-skill-ignore: card edge (the brief's design system) */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card); /* taste-skill-ignore: hairline, light mode only */
  padding: var(--s-5);
}

.bar {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3) var(--s-5);
}
.search {
  position: relative;
  flex: 0 1 300px;
  display: flex;
  align-items: center;
  color: var(--muted-foreground);
}
.search svg { position: absolute; left: 12px; pointer-events: none; }
.search input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 38px;
  border: 1px solid var(--input); /* taste-skill-ignore: a real form field keeps its edge */
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font: 15px var(--font-text);
  transition: border-color var(--dur-hover) ease;
}
.search input::placeholder { color: var(--muted-foreground); }
.search input:hover { border-color: var(--border-strong); }
.search input:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
.paths { display: flex; flex-wrap: wrap; gap: var(--s-2); }
.count { margin-left: auto; font-size: var(--step-small); color: var(--muted-foreground); }
.path-note {
  position: relative;
  z-index: 2;
  margin-top: var(--s-4);
  min-height: 3em;
  max-width: 72ch;
  font-size: 16px;
  color: var(--muted-foreground);
}

.wires {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.wire {
  fill: none;
  stroke: var(--primary);
  stroke-width: 1.75;
  opacity: 0.6;
  stroke-dasharray: 3000;
  animation: draw 1.1s var(--ease-out) both;
}
@keyframes draw { from { stroke-dashoffset: 3000; } }
.pulse { fill: var(--primary); }

.clusters {
  position: relative;
  z-index: 1;
  margin-top: var(--s-5);
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--s-7) var(--gap);
}
.cluster h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font: 600 var(--step-body) / 1.25 var(--font-text);
  letter-spacing: 0;
}
.hub {
  width: 12px;
  height: 12px;
  flex: none;
  background: var(--foreground);
  transition: background-color var(--dur-hover) ease, transform 420ms var(--ease-spring);
}
.cluster.lit .hub { background: var(--primary); transform: rotate(45deg); }
.note { margin: var(--s-2) 0 var(--s-4); font-size: var(--step-small); color: var(--muted-foreground); min-height: 4.2em; }

ul { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
/* The cluster's spine: a filled bar through the dots. */
ul::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: var(--border);
}
li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 34px;
  padding: 4px 8px 4px 0;
  font-size: var(--step-small);
  transition: color var(--dur-hover) ease;
}
/* Labels knock the wire out behind them, so it never strikes through a word. */
.lbl { position: relative; padding: 2px 6px; margin-left: -6px; border-radius: 4px; background: var(--card); }
.dot {
  position: relative;
  width: 12px;
  height: 12px;
  flex: none;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid var(--muted-foreground);
  background: var(--card);
  transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease, transform 360ms var(--ease-spring);
}
li.hover .dot { transform: scale(1.35); border-color: var(--foreground); }
li.on .dot { background: var(--primary); border-color: var(--primary); }
li.on { color: var(--foreground); font-weight: 600; }
li.hit .dot { background: var(--foreground); border-color: var(--foreground); transform: scale(1.2); }
li.hit { font-weight: 600; }
li.miss { color: color-mix(in srgb, var(--muted-foreground) 70%, transparent); }
li.miss .dot { border-color: var(--border); }
.none { position: relative; z-index: 2; margin-top: var(--s-5); color: var(--muted-foreground); }

@media (prefers-reduced-motion: reduce) {
  .wire { animation: none; }
  .pulse { display: none; }
}
@media (max-width: 1199px) {
  .clusters { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 759px) {
  .board { padding: var(--s-4); }
  .clusters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .search { flex-basis: 100%; }
  .count { margin-left: 0; }
  .note { min-height: 0; }
}
@media (max-width: 479px) {
  .clusters { grid-template-columns: 1fr; padding-left: 20px; }
}
</style>
