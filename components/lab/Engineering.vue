<template>
  <section id="engineering" v-reveal class="eng" aria-labelledby="eng-h">
    <div ref="grid" class="grid" :class="{ placed }">
      <div class="col left">
        <h2 id="eng-h" class="lab-heading head" data-reveal>Engineering capabilities</h2>
        <p class="sub" data-reveal>
          The tools I reach for, grouped the way the work uses them. No percentages: either I ship with it or it isn't listed.
        </p>
        <button
          v-for="n in leftNotes" :key="n.id" type="button" class="note" :class="{ on: focus === n.id }"
          :style="tops[n.id] != null ? { top: tops[n.id] + 'px' } : undefined"
          @mouseenter="focus = n.id" @mouseleave="focus = ''" @focus="focus = n.id" @blur="focus = ''"
          @click="pick(n.id)"
        >
          <strong>{{ n.name }}</strong>
          <span>{{ n.note }}</span>
        </button>
      </div>

      <div ref="panel" class="instrument" data-ui data-reveal>
        <div class="bar">
          <span>Capabilities</span>
          <span class="lab-num">{{ totalShown }} of {{ total }}</span>
        </div>
        <div ref="searchRow" class="search" data-group="search" :class="{ dim: focus && focus !== 'search' }">
          <label for="tool-q">Find a tool</label>
          <input id="tool-q" v-model="q" type="search" placeholder="e.g. Docker" autocomplete="off">
        </div>
        <section
          v-for="g in CAPABILITIES" :key="g.id" :data-group="g.id" class="group"
          :class="{ dim: focus && focus !== g.id && focus !== 'search', lit: focus === g.id }"
        >
          <h3>
            <span>{{ g.name }}</span>
            <span class="lab-num">{{ matches(g).length }}</span>
          </h3>
          <ul>
            <li v-for="item in g.items" :key="item" :class="{ hit: q && hit(item), miss: q && !hit(item) }">{{ item }}</li>
          </ul>
          <p class="inline-note">{{ g.note }}</p>
        </section>
        <p v-if="q && !totalShown" class="none" role="status">Not in the toolkit yet.</p>
      </div>

      <div class="col right">
        <button
          v-for="n in rightNotes" :key="n.id" type="button" class="note" :class="{ on: focus === n.id }"
          :style="tops[n.id] != null ? { top: tops[n.id] + 'px' } : undefined"
          @mouseenter="focus = n.id" @mouseleave="focus = ''" @focus="focus = n.id" @blur="focus = ''"
          @click="pick(n.id)"
        >
          <strong>{{ n.name }}</strong>
          <span>{{ n.note }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CAPABILITIES, type CapabilityGroup } from '~/data/portfolio'

const notes = [
  { id: 'search', name: 'Search', note: 'Type any tool; the panel shows where it sits, or says plainly that it doesn’t.' },
  ...CAPABILITIES.map(g => ({ id: g.id, name: g.name, note: g.note })),
]
const leftNotes = notes.slice(3)
const rightNotes = notes.slice(0, 3)

const q = ref('')
const focus = ref('')
const grid = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const tops = reactive<Record<string, number>>({})
const placed = ref(false)

const hit = (item: string) => item.toLowerCase().includes(q.value.trim().toLowerCase())
const matches = (g: CapabilityGroup) => (q.value ? g.items.filter(hit) : g.items)
const total = CAPABILITIES.reduce((n, g) => n + g.items.length, 0)
const totalShown = computed(() => CAPABILITIES.reduce((n, g) => n + matches(g).length, 0))

const pick = (id: string) => {
  const el = panel.value?.querySelector<HTMLElement>(`[data-group="${id}"]`)
  if (id === 'search') el?.querySelector('input')?.focus()
  else el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

// Each margin note sits level with the part of the panel it explains.
const place = () => {
  if (!grid.value || !panel.value) return
  if (innerWidth < 1100) { placed.value = false; return }
  const g = grid.value.getBoundingClientRect().top
  for (const n of notes) {
    const el = panel.value.querySelector<HTMLElement>(`[data-group="${n.id}"]`)
    if (el) tops[n.id] = el.getBoundingClientRect().top - g
  }
  placed.value = true
}

let ro: ResizeObserver | null = null
onMounted(() => {
  place()
  ro = new ResizeObserver(place)
  if (panel.value) ro.observe(panel.value)
  document.fonts?.ready.then(place)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
.eng { padding: var(--section-gap) var(--margin) 0; }

.grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 392px minmax(0, 1fr);
  gap: 56px;
  max-width: 1376px;
  margin: 0 auto;
}

.col { position: relative; min-height: 100%; }
.left { text-align: right; }
.head { margin-left: auto; max-width: 12ch; }
.sub { margin: 20px 0 0 auto; max-width: 34ch; color: var(--muted); font-size: 16px; }

.note {
  display: grid;
  gap: 6px;
  width: 100%;
  max-width: 30ch;
  margin-top: 36px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink);
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}
.left .note { margin-left: auto; }
.placed .note { position: absolute; margin-top: 0; }
.placed .left .note { right: 0; }
.note strong { font-size: var(--step-body); font-weight: 600; transition: color var(--dur-hover) ease; }
.note span { font-size: 16px; color: var(--muted); line-height: 1.45; }
.note.on strong, .note:hover strong { color: var(--accent); }

/* The instrument itself: an interface fragment, so it keeps its own borders. */
.instrument {
  align-self: start;
  display: grid;
  gap: 2px;
  align-content: start;
  background: var(--surface-2);
  font-size: 16px;
  min-height: 680px;
}
.bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--surface-2);
  font-weight: 600;
}
.bar span:last-child { color: var(--muted); font-weight: 400; }

.search { display: grid; gap: 6px; padding: 16px; background: var(--surface); }
.search label { color: var(--muted); }
.search input {
  height: 40px;
  padding: 0 12px;
  border: 0;
  background: var(--bg);
  color: var(--ink);
  font: 16px var(--font-text);
}
.search input:focus { outline: 2px solid var(--accent); outline-offset: -2px; }

.group {
  position: relative;
  padding: 14px 16px 16px;
  background: var(--surface);
}
.group::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--accent);
  transform: scaleY(0);
  transition: transform var(--dur-hover) var(--ease-out);
}
.group.lit::before { transform: none; }
.group h3 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font: 600 16px var(--font-text);
  letter-spacing: 0;
}
.group h3 .lab-num { color: var(--muted); font-weight: 400; }
.group ul { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; margin: 0; padding: 0; }
.group li {
  padding: 4px 9px;
  background: var(--surface-2);
  font-size: var(--step-small);
  transition: color var(--dur-hover) ease, background-color var(--dur-hover) ease;
}
.group li.hit { background: var(--accent); color: var(--accent-ink); }
.group li.miss { color: var(--muted); }
.dim h3 span:first-child, .dim li, .search.dim label { color: var(--muted); }
.inline-note { display: none; }
.none { padding: 12px 16px 18px; color: var(--muted); background: var(--surface); }

@media (max-width: 1099px) {
  .grid { grid-template-columns: 1fr; gap: 0; max-width: 560px; }
  .left { text-align: left; }
  .head, .sub { margin-left: 0; }
  .sub { margin-bottom: 32px; }
  .left .note, .right { display: none; }
  .instrument { min-height: 0; }
  .inline-note { display: block; margin: 12px 0 0; color: var(--muted); font-size: 16px; }
}
</style>
