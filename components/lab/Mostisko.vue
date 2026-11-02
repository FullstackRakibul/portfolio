<template>
  <section id="mostisko" v-reveal class="most" aria-labelledby="most-h">
    <div class="intro">
      <h2 id="most-h" class="lab-heading" data-reveal>Currently building: Mostisko</h2>
      <p data-reveal>
        RabbitIC (মস্তিষ্ক, “the brain”) is an extensible, locally hosted AI workspace that brings together
        conversation, context engineering, document intelligence, automation and enterprise workflows. The goal is a
        local AI ecosystem that helps developers, reads enterprise documents, works with structured data and supports
        business operations. It is in active development; planned modules are drawn with broken lines.
      </p>
    </div>

    <div class="panel" data-ui data-reveal>
      <div class="demo">
        <LabMostiskoMap :modules="MOSTISKO_MODULES" :selected="selected" :show-planned="showPlanned" :pulse="pulse" @select="selected = $event" />
        <div class="readout" aria-live="polite">
          <template v-if="step">
            <p class="r-name">Tracing a request</p>
            <p>{{ step }}</p>
          </template>
          <template v-else-if="current">
            <p class="r-name">
              {{ current.name }}<span v-if="current.latin"> · {{ current.latin }}</span>
              <span class="status" :class="current.status">{{ current.status === 'building' ? 'In development' : 'Planned' }}</span>
            </p>
            <p>{{ current.summary }}</p>
          </template>
        </div>
        <p class="out">
          <a class="lab-link" :href="MOSTISKO_URL" target="_blank" rel="noopener">Open Mostisko</a>
          <a class="lab-link" :href="MOSTISKO_REPO" target="_blank" rel="noopener">Source on GitHub</a>
        </p>
      </div>

      <div class="controls">
        <fieldset>
          <legend class="sr-only">Module shown on the map</legend>
          <label v-for="m in visibleModules" :key="m.id" class="row" :class="{ on: selected === m.id }">
            <input v-model="selected" type="radio" name="module" :value="m.id">
            <span class="r-label">{{ m.latin ?? m.name }}</span>
            <span class="r-value">{{ m.status === 'building' ? 'Building' : 'Planned' }}</span>
          </label>
        </fieldset>
        <label class="row switch">
          <span class="r-label">Show planned modules</span>
          <input v-model="showPlanned" type="checkbox" role="switch">
          <span class="track" aria-hidden="true" />
        </label>
        <div class="row action">
          <button type="button" class="lab-button" :disabled="tracing" @click="trace">
            {{ tracing ? 'Tracing…' : 'Trace a request' }}
          </button>
        </div>
      </div>
    </div>

    <p class="stack" data-reveal>Built with {{ MOSTISKO_STACK.join(', ') }}.</p>
  </section>
</template>

<script setup lang="ts">
import { MOSTISKO_CORE, MOSTISKO_MODULES, MOSTISKO_REPO, MOSTISKO_STACK, MOSTISKO_URL } from '~/data/portfolio'

const selected = ref('oddity')
const showPlanned = ref(true)
const tracing = ref(false)
const step = ref('')
const pulse = ref<{ x: number; y: number } | null>(null)

const visibleModules = computed(() => MOSTISKO_MODULES.filter(m => showPlanned.value || m.status !== 'planned'))
const current = computed(() => MOSTISKO_MODULES.find(m => m.id === selected.value))
watch(showPlanned, (v) => { if (!v && current.value?.status === 'planned') selected.value = 'oddity' })

const pos = (id: string) => id === 'core' ? MOSTISKO_CORE : id === 'client' ? { x: 300, y: 26 } : MOSTISKO_MODULES.find(m => m.id === id)!

const route = [
  { id: 'client', text: 'A client sends an ordinary Ollama request.' },
  { id: 'oddity', text: 'Oddity receives it in Ollama’s format and checks who is asking.' },
  { id: 'contextsource', text: 'ContextSource selects the few documents that matter to the question.' },
  { id: 'core', text: 'A local model answers with that context, on company hardware.' },
  { id: 'oddity', text: 'Oddity records the request for analytics and passes the answer back.' },
  { id: 'client', text: 'The client receives an Ollama-shaped response. Nothing left the building.' },
]

let raf = 0
let timer = 0
const trace = () => {
  if (tracing.value) return
  tracing.value = true
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const legMs = reduce ? 1400 : 1100
  let leg = 0
  const t0 = performance.now()
  const finish = () => {
    timer = window.setTimeout(() => { tracing.value = false; step.value = ''; pulse.value = null }, 2200)
  }
  const frame = (now: number) => {
    const elapsed = now - t0
    leg = Math.min(route.length - 1, Math.floor(elapsed / legMs))
    const f = reduce ? 0 : Math.min(1, (elapsed % legMs) / (legMs * 0.6))
    const a = pos(route[leg].id), b = pos(route[Math.min(route.length - 1, leg + 1)].id)
    const e = 1 - (1 - f) ** 3
    pulse.value = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e }
    step.value = route[leg].text
    if (elapsed < legMs * route.length) raf = requestAnimationFrame(frame)
    else { pulse.value = pos('client'); finish() }
  }
  raf = requestAnimationFrame(frame)
}

onBeforeUnmount(() => { cancelAnimationFrame(raf); clearTimeout(timer) })
</script>

<style scoped>
.most { padding: var(--section-gap) var(--margin) 0 var(--line); }
.intro, .panel, .stack { max-width: 1040px; }
.intro { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: start; margin-bottom: 48px; }
.intro p { max-width: 60ch; }

.panel {
  display: grid;
  grid-template-columns: minmax(0, 62fr) minmax(0, 38fr);
  background: var(--surface);
}
.demo { padding: 28px 28px 24px; display: grid; gap: 20px; align-content: start; }
.readout { min-height: 112px; font-size: 16px; max-width: 58ch; }
.readout p + p { margin-top: 6px; }
.r-name { font-weight: 600; display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: baseline; }
.r-name span:not(.status) { color: var(--muted); font-weight: 400; }
.status { font-size: var(--step-small); font-weight: 600; color: var(--accent); }
.status.planned { color: var(--muted); }
.out { display: flex; gap: 24px; font-size: 16px; }

.controls { background: var(--surface-2); padding: 12px 0; display: grid; align-content: start; }
fieldset { border: 0; margin: 0; padding: 0; }
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 0 22px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: background-color var(--dur-hover) ease;
}
.row:hover { background: color-mix(in srgb, var(--surface-2) 70%, var(--ink) 6%); }
.row input[type="radio"] { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.row:has(input:focus-visible) { outline: 2px solid var(--accent); outline-offset: -2px; }
.row.on::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 3px; background: var(--accent); }
.row.on .r-label { font-weight: 600; }
.r-value { color: var(--muted); font-size: var(--step-small); }

.switch input { position: absolute; opacity: 0; width: 40px; height: 22px; right: 22px; margin: 0; cursor: pointer; }
.track { width: 40px; height: 22px; border-radius: 11px; background: var(--bg); position: relative; transition: background-color var(--dur-hover) ease; }
.track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--muted); transition: transform var(--dur-hover) var(--ease-out), background-color var(--dur-hover) ease; }
.switch input:checked + .track { background: var(--accent); }
.switch input:checked + .track::after { transform: translateX(18px); background: var(--accent-ink); }
.switch input:focus-visible + .track { outline: 2px solid var(--accent); outline-offset: 2px; }

.action { margin-top: 12px; cursor: default; }
.action:hover { background: none; }
.action .lab-button { width: 100%; }
.action .lab-button:disabled { cursor: progress; opacity: 0.8; }

.stack { margin-top: 20px; font-size: 16px; color: var(--muted); }

@media (max-width: 860px) {
  .intro { grid-template-columns: 1fr; gap: 20px; }
  .panel { grid-template-columns: 1fr; }
  .demo { padding: 20px 16px; }
  .row { min-height: 52px; padding: 0 16px; }
  .switch input { right: 16px; }
  .action { padding-bottom: 8px; }
}
</style>
