<template>
  <svg ref="svg" class="map" viewBox="0 0 600 440" role="img" :aria-label="label">
    <g class="edges">
      <line
        v-for="e in edges" :key="e.key"
        :x1="e.a.x" :y1="e.a.y" :x2="e.b.x" :y2="e.b.y"
        :class="{ on: e.ids.includes(selected), planned: e.planned }"
      />
    </g>

    <g
      v-for="n in nodes" :key="n.id" class="node"
      :class="{ on: n.id === selected, planned: n.status === 'planned', core: n.id === 'core' || n.id === 'client' }"
      :transform="`translate(${n.x} ${n.y})`"
      @click="n.status && $emit('select', n.id)"
    >
      <rect :x="-n.w / 2" :y="n.sub ? -21 : -15" :width="n.w" :height="n.sub ? 42 : 30" />
      <text :y="n.sub ? -3 : 5">{{ n.name }}</text>
      <text v-if="n.sub" class="sub" y="13">{{ n.sub }}</text>
    </g>

    <!-- Ambient signals travel the implemented connections, inward to the model. -->
    <g v-if="!pulse" class="ambient">
      <circle v-for="(e, i) in liveEdges" :key="e.key" r="3.5">
        <animateMotion
          :path="'M' + e.a.x + ' ' + e.a.y + 'L' + e.b.x + ' ' + e.b.y" :dur="2.6 + (i % 3) * 0.7 + 's'"
          :begin="-i * 0.45 + 's'" repeatCount="indefinite"
        />
      </circle>
    </g>
    <circle v-if="pulse" class="pulse" :cx="pulse.x" :cy="pulse.y" r="6" />
  </svg>
</template>

<script setup lang="ts">
import { MOSTISKO_CORE, type LabModule } from '~/data/portfolio'

const props = defineProps<{
  modules: LabModule[]
  selected: string
  showPlanned: boolean
  pulse: { x: number; y: number } | null
}>()
defineEmits<{ select: [id: string] }>()

interface MapNode { id: string; name: string; sub?: string; x: number; y: number; w: number; status?: string }

const width = (s: string) => Math.max(64, s.length * 7.6 + 28)

const nodes = computed<MapNode[]>(() => [
  { id: 'client', name: 'Client', x: 300, y: 26, w: 84 },
  { id: 'core', name: 'Ollama', sub: 'local LLMs', x: MOSTISKO_CORE.x, y: MOSTISKO_CORE.y, w: 108 },
  ...props.modules
    .filter(m => props.showPlanned || m.status !== 'planned')
    .map(m => ({ id: m.id, name: m.name, sub: m.latin, x: m.x, y: m.y, status: m.status, w: width(m.latin ?? m.name) + (m.latin ? 8 : 0) })),
])

const edges = computed(() => {
  const at = Object.fromEntries(nodes.value.map(n => [n.id, n]))
  const out: { key: string; a: MapNode; b: MapNode; ids: string[]; planned: boolean }[] = []
  const add = (from: string, to: string, planned = false) => {
    if (at[from] && at[to]) out.push({ key: from + to, a: at[from], b: at[to], ids: [from, to], planned })
  }
  add('client', 'oddity')
  for (const m of props.modules) for (const l of m.links) add(m.id, l, m.status === 'planned')
  return out
})

const svg = ref<SVGSVGElement | null>(null)
useSvgMotion(svg)
const liveEdges = computed(() => edges.value.filter(e => !e.planned))

const label = computed(() =>
  'System map of Mostisko: ' + props.modules.map(m => `${m.latin ?? m.name} (${m.status})`).join(', ') + ', around a local Ollama model.')
</script>

<style scoped>
.map { display: block; width: 100%; height: auto; overflow: visible; font-family: var(--font-text); }

.edges line {
  stroke: var(--muted);
  stroke-width: 1.25;
  opacity: 0.55;
  transition: stroke var(--dur-hover) ease, opacity var(--dur-hover) ease;
}
.edges line.planned { stroke-dasharray: 4 5; }
.edges line.on { stroke: var(--accent); opacity: 1; stroke-width: 2; }

.node { cursor: pointer; }
.node.core { cursor: default; }
.node rect {
  fill: var(--bg);
  stroke: var(--muted);
  stroke-width: 1.25;
  transition: fill var(--dur-hover) ease, stroke var(--dur-hover) ease;
}
.node.planned rect { stroke-dasharray: 4 4; }
.node.core rect { fill: var(--ink); stroke: var(--ink); }
.node.core text { fill: var(--bg); }
.node.on rect { stroke: var(--accent); stroke-width: 2; }
.node:not(.core):hover rect { fill: var(--surface-2); }
.node text {
  fill: var(--ink);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
}
.node text.sub { font-size: 13px; font-weight: 400; fill: var(--muted); }
.node.core text.sub { fill: var(--bg); opacity: 0.8; }

.pulse { fill: var(--signal); }
.ambient circle { fill: var(--signal); opacity: 0.85; }
@media (prefers-reduced-motion: reduce) { .ambient { display: none; } }
</style>
