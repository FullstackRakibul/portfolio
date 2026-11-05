<template>
  <section id="mostisko" v-reveal class="most lab-section lab-wrap" aria-labelledby="most-h">
    <div class="lab-head">
      <h2 id="most-h" data-reveal>Currently building: Mostisko</h2>
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
          <UiButton block :loading="tracing" @click="trace">
            <template #leading><Activity aria-hidden="true" /></template>
            {{ tracing ? 'Tracing…' : 'Trace a request' }}
          </UiButton>
        </div>
      </div>
    </div>

    <div class="after">
      <figure class="shot" data-reveal>
        <div class="crop">
          <img
            src="/assets/work/mostisko.jpg" width="800" height="600" loading="lazy" decoding="async"
            alt="Mostisko’s sign-in screen: a username and a secret, with a note that the secret is hashed on the server"
          >
        </div>
        <figcaption>The sign-in, live at mostisko.vercel.app.</figcaption>
      </figure>
      <div class="facts" data-reveal>
        <h3>Built with</h3>
        <ul>
          <li v-for="t in MOSTISKO_STACK" :key="t">{{ t }}</li>
        </ul>
        <p class="out">
          <UiButton v-magnetic="4" :href="MOSTISKO_URL" target="_blank" rel="noopener" data-cursor-label="Open ↗">
            Open Mostisko
            <template #icon><ArrowUpRight aria-hidden="true" /></template>
          </UiButton>
          <a class="lab-link" :href="MOSTISKO_REPO" target="_blank" rel="noopener" data-cursor-label="Open ↗">Source on GitHub</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Activity, ArrowUpRight } from 'lucide-vue-next'
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
.panel {
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border); /* taste-skill-ignore: card edge (the brief's design system) */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card); /* taste-skill-ignore: hairline, light mode only */
}
.demo { padding: var(--s-6) var(--s-6) var(--s-5); display: grid; gap: var(--s-5); align-content: start; }
.readout { min-height: 112px; font-size: 16px; max-width: 64ch; }
.readout p + p { margin-top: 6px; }
.r-name { font-weight: 600; display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: baseline; }
.r-name span:not(.status) { color: var(--muted-foreground); font-weight: 400; }
.status { font-size: var(--step-small); font-weight: 600; color: var(--foreground); }
.status.planned { color: var(--muted-foreground); }

.controls { background: var(--muted); padding: var(--s-3) 0; display: grid; align-content: start; }
fieldset { border: 0; margin: 0; padding: 0; }
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 46px;
  padding: 0 22px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: background-color var(--dur-hover) ease;
}
.row:hover { background: var(--border); }
.row input[type="radio"] { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.row:has(input:focus-visible) { outline: 2px solid var(--ring); outline-offset: -2px; }
.row::before { content: ''; position: absolute; inset: 8px auto 8px 0; width: 3px; background: var(--primary); transform: scaleY(0); transition: transform var(--dur-hover) var(--ease-out); }
.row.on::before { transform: none; }
.row.on .r-label { font-weight: 600; }
.r-value { color: var(--muted-foreground); font-size: var(--step-small); }

.switch input { position: absolute; opacity: 0; width: 40px; height: 22px; right: 22px; margin: 0; cursor: pointer; }
.track { width: 40px; height: 22px; box-sizing: border-box; border: 1px solid var(--border-strong); border-radius: 11px; background: var(--background); position: relative; transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease; } /* taste-skill-ignore: the switch's track edge */
.track::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--muted-foreground); transition: transform var(--dur-hover) var(--ease-spring), background-color var(--dur-hover) ease; }
.switch input:checked + .track { background: var(--primary); border-color: var(--primary); }
.switch input:checked + .track::after { transform: translateX(18px); background: var(--primary-foreground); }
.switch input:focus-visible + .track { outline: 2px solid var(--ring); outline-offset: 2px; }

.action { margin-top: 12px; cursor: default; }
.action:hover { background: none; }
.action::before { display: none; }

.after {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap);
  margin-top: var(--s-7);
  align-items: end;
}
.shot { grid-column: 1 / span 6; margin: 0; }
.crop { overflow: hidden; aspect-ratio: 4 / 3; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--muted); } /* taste-skill-ignore: keeps the picture's edge visible */
.crop img { display: block; width: 100%; height: 100%; object-fit: cover; transform: scale(1.7); transition: transform 900ms var(--ease-out); }
.shot:hover .crop img { transform: scale(1.6); }
.shot figcaption { margin-top: var(--s-3); font-size: var(--step-small); color: var(--muted-foreground); }
.facts { grid-column: 8 / -1; }
.facts h3 { font: 600 var(--step-body) / 1.3 var(--font-text); letter-spacing: 0; }
.facts ul { display: flex; flex-wrap: wrap; gap: var(--s-2); list-style: none; margin: var(--s-4) 0 0; padding: 0; }
.facts li { padding: 4px 10px; border-radius: var(--radius-sm); background: var(--muted); color: var(--muted-foreground); font-size: var(--step-small); }
.out { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3) var(--s-6); margin-top: var(--s-6); font-size: 16px; }

@media (max-width: 899px) {
  .panel { grid-template-columns: 1fr; }
  .demo { padding: var(--s-5) var(--s-4); }
  .row { min-height: 52px; padding: 0 16px; }
  .switch input { right: 16px; }
  .action { padding-bottom: 8px; }
  .after { grid-template-columns: 1fr; row-gap: var(--s-7); }
  .shot, .facts { grid-column: 1; }
}
</style>
