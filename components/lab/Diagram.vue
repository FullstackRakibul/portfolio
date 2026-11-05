<template>
  <svg ref="svg" class="dia" viewBox="0 0 480 360" role="img" :aria-label="caption">
    <!-- Running language models locally: everything stays inside the company boundary. -->
    <g v-if="kind === 'local'">
      <rect class="zone" x="24" y="40" width="332" height="280" />
      <text class="small" x="40" y="66">Company network</text>
      <g v-for="k in 3" :key="k"><rect class="box" :x="52 + k * 6" :y="128 + k * 6" width="72" height="92" /></g>
      <text x="100" y="260" class="mid">Documents</text>
      <rect class="box strong" x="196" y="148" width="120" height="64" />
      <text x="256" y="186" class="mid on">Ollama</text>
      <path :id="id('a')" class="wire" d="M136 182H196" />
      <path :id="id('b')" class="wire" d="M256 212V280H136" />
      <text x="196" y="304" class="mid small">Answer, on site</text>
      <path class="wire dashed" d="M316 180H404" />
      <path class="stop" d="M356 164V196" />
      <rect class="box faint" x="404" y="150" width="56" height="60" />
      <text x="432" y="236" class="mid small">Cloud</text>
      <circle v-for="k in 2" :key="'p' + k" class="pulse" r="4"><animateMotion dur="1.6s" :begin="-(k - 1) * 0.8 + 's'" repeatCount="indefinite"><mpath :href="'#' + id('a')" /></animateMotion></circle>
      <circle class="pulse" r="4"><animateMotion dur="2.2s" begin="-0.6s" repeatCount="indefinite"><mpath :href="'#' + id('b')" /></animateMotion></circle>
    </g>

    <!-- Context engineering: twenty-four pages, three chosen by similarity. -->
    <g v-else-if="kind === 'context'">
      <text class="small" x="32" y="52">Twenty-four pages</text>
      <rect
        v-for="(c, i) in pages" :key="i" class="page" :class="{ pick: picks.includes(i) }"
        :x="32 + (i % 6) * 34" :y="72 + Math.floor(i / 6) * 44" width="26" height="34"
      />
      <path v-for="(i, k) in picks" :id="id('c' + k)" :key="'w' + i" class="wire" :d="pickPath(i)" />
      <rect class="box strong" x="344" y="140" width="112" height="64" />
      <text x="400" y="178" class="mid on">Small model</text>
      <text x="400" y="236" class="mid small">three pages, not all</text>
      <circle v-for="k in 3" :key="'p' + k" class="pulse" r="4"><animateMotion dur="2s" :begin="-(k - 1) * 0.5 + 's'" repeatCount="indefinite"><mpath :href="'#' + id('c' + (k - 1))" /></animateMotion></circle>
      <text class="small" x="32" y="320">Similarity search chooses</text>
    </g>

    <!-- The gateway: Ollama-shaped requests in, tracking and settings on the side. -->
    <g v-else-if="kind === 'gateway'">
      <g v-for="k in 3" :key="k">
        <rect class="box" x="24" :y="56 + (k - 1) * 88" width="96" height="52" />
        <text x="72" :y="88 + (k - 1) * 88" class="mid small">Client</text>
        <path :id="id('g' + k)" class="wire" :d="`M120 ${82 + (k - 1) * 88}C170 ${82 + (k - 1) * 88} 170 170 208 170`" />
      </g>
      <rect class="box strong" x="208" y="138" width="104" height="64" />
      <text x="260" y="176" class="mid on">Oddity</text>
      <path :id="id('o')" class="wire" d="M312 170H368" />
      <rect class="box" x="368" y="138" width="92" height="64" />
      <text x="414" y="176" class="mid">Ollama</text>
      <path class="wire dashed" d="M236 202V266M260 202V296M284 202V266" />
      <text x="200" y="288" class="mid small">Tracking</text>
      <text x="260" y="320" class="mid small">Per-user settings</text>
      <text x="328" y="288" class="mid small">Analytics</text>
      <circle v-for="k in 3" :key="'p' + k" class="pulse" r="4"><animateMotion dur="1.8s" :begin="-(k - 1) * 0.6 + 's'" repeatCount="indefinite"><mpath :href="'#' + id('g' + k)" /></animateMotion></circle>
      <circle class="pulse" r="4"><animateMotion dur="0.9s" repeatCount="indefinite"><mpath :href="'#' + id('o')" /></animateMotion></circle>
    </g>

    <!-- Read-only queries: the same query, with and without the change tracker. -->
    <g v-else-if="kind === 'tracking'">
      <text class="small" x="32" y="64">Tracked</text>
      <rect class="box" x="32" y="84" width="88" height="52" /><text x="76" y="116" class="mid small">Query</text>
      <rect class="box faint" x="196" y="84" width="112" height="52" /><text x="252" y="116" class="mid small">Change tracker</text>
      <rect class="box" x="384" y="84" width="72" height="52" /><text x="420" y="116" class="mid small">Rows</text>
      <path :id="id('t')" class="wire" d="M120 110H196M308 110H384" />
      <text class="small" x="32" y="208">AsNoTracking</text>
      <rect class="box" x="32" y="228" width="88" height="52" /><text x="76" y="260" class="mid small">Query</text>
      <rect class="box strong" x="384" y="228" width="72" height="52" /><text x="420" y="260" class="mid small on">Rows</text>
      <path :id="id('n')" class="wire" d="M120 254H384" />
      <circle class="pulse" r="4"><animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;0.42;0.42;1" keyTimes="0;0.3;0.7;1" calcMode="linear"><mpath :href="'#' + id('t')" /></animateMotion></circle>
      <circle class="pulse" r="4"><animateMotion dur="1.4s" repeatCount="indefinite"><mpath :href="'#' + id('n')" /></animateMotion></circle>
    </g>

    <!-- Scaffolding: one template stamped into each new service. -->
    <g v-else>
      <rect class="box strong" x="28" y="128" width="120" height="104" />
      <text x="88" y="166" class="mid on">Template</text>
      <text x="88" y="190" class="mid small on">auth · RBAC</text>
      <text x="88" y="210" class="mid small on">core</text>
      <g v-for="k in 3" :key="k">
        <path :id="id('s' + k)" class="wire" :d="`M148 180C220 180 220 ${76 + (k - 1) * 104} 292 ${76 + (k - 1) * 104}`" />
        <rect class="box" x="292" :y="44 + (k - 1) * 104" width="164" height="64" />
        <text x="374" :y="72 + (k - 1) * 104" class="mid">Service</text>
        <text x="374" :y="94 + (k - 1) * 104" class="mid small">auth · RBAC · core</text>
      </g>
      <circle v-for="k in 3" :key="'p' + k" class="pulse" r="4"><animateMotion dur="2.4s" :begin="-(k - 1) * 0.8 + 's'" repeatCount="indefinite"><mpath :href="'#' + id('s' + k)" /></animateMotion></circle>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { DiagramKind } from '~/data/portfolio'

const props = defineProps<{ kind: DiagramKind; caption: string; running?: boolean }>()

const uid = useId()
const id = (part: string) => `d-${uid}-${part}`
const svg = ref<SVGSVGElement | null>(null)
useSvgMotion(svg, computed(() => props.running !== false))

const pages = Array.from({ length: 24 })
const picks = [3, 14, 19]
const pickPath = (i: number) => {
  const x = 32 + (i % 6) * 34 + 26, y = 72 + Math.floor(i / 6) * 44 + 17
  return `M${x} ${y}C${x + 80} ${y} 280 172 344 172`
}
</script>

<style scoped>
.dia { display: block; width: 100%; height: auto; font-family: var(--font-text); overflow: visible; }
text { fill: var(--foreground); font-size: 15px; }
.mid { text-anchor: middle; }
.small { font-size: 13px; fill: var(--muted-foreground); }
.on { fill: var(--background); }
.small.on { fill: var(--background); opacity: 0.85; }

.zone { fill: none; stroke: var(--muted-foreground); stroke-width: 1.25; stroke-dasharray: 5 6; }
.box { fill: var(--background); stroke: var(--muted-foreground); stroke-width: 1.5; }
.box.strong { fill: var(--foreground); stroke: var(--foreground); }
.box.faint { stroke-dasharray: 4 4; opacity: 0.6; }
.page { fill: var(--muted); stroke: none; }
.page.pick { fill: var(--foreground); }
.wire { fill: none; stroke: var(--muted-foreground); stroke-width: 1.5; }
.wire.dashed { stroke-dasharray: 4 5; }
.stop { stroke: var(--foreground); stroke-width: 3; }
.pulse { fill: var(--foreground); }

@media (prefers-reduced-motion: reduce) {
  .pulse { display: none; }
}
</style>
