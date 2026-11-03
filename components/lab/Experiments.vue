<template>
  <section id="experiments" v-reveal class="lab-section lab-wrap" aria-labelledby="exp-h">
    <div class="lab-head">
      <h2 id="exp-h" data-reveal>Experiments & research</h2>
      <p data-reveal>
        A working notebook of what I test beyond the day job: what each experiment set out to do, where it stands,
        and what it has shown so far.
      </p>
    </div>

    <div class="split">
      <div class="plate-col">
        <figure class="plate" data-ui>
          <div class="stack">
            <LabDiagram
              v-for="(e, i) in EXPERIMENTS" :key="e.id" class="d" :class="{ on: i === active }"
              :kind="e.diagram" :caption="e.caption" :running="i === active"
            />
          </div>
          <figcaption>
            <span>{{ e(active).title }}</span>
            <span>{{ e(active).caption }}</span>
          </figcaption>
        </figure>
      </div>

      <div class="entries">
        <article
          v-for="(x, i) in EXPERIMENTS" :key="x.id" :ref="el => (rows[i] = el as HTMLElement)"
          class="entry" :class="{ on: i === active }" data-reveal
        >
          <LabDiagram class="m-dia" :kind="x.diagram" :caption="x.caption" />
          <p class="status" :class="x.status === 'Running in production' ? 'live' : 'open'">
            <span class="led" aria-hidden="true" />{{ x.status }}
          </p>
          <h3>{{ x.title }}</h3>
          <p class="objective">{{ x.objective }}</p>
          <dl>
            <div><dt>Technology</dt><dd>{{ x.technology.join(', ') }}</dd></div>
            <div><dt>Findings so far</dt><dd>{{ x.findings }}</dd></div>
            <div><dt>Related</dt><dd>{{ x.related.join(', ') }}</dd></div>
          </dl>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { EXPERIMENTS } from '~/data/portfolio'

const active = ref(0)
const e = (i: number) => EXPERIMENTS[i]!
const rows: HTMLElement[] = []
let io: IntersectionObserver | null = null
let raf = 0

// The active entry is the last one whose top has passed 60% of the screen height.
const update = () => {
  raf = 0
  const line = innerHeight * 0.6
  let next = 0
  rows.forEach((r, i) => { if (r && r.getBoundingClientRect().top < line) next = i })
  active.value = next
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

onMounted(() => {
  const root = rows[0]?.closest('section')
  if (!root) return
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); update() }
    else removeEventListener('scroll', onScroll)
  })
  io.observe(root)
})
onBeforeUnmount(() => {
  io?.disconnect()
  removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.split {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap);
}

.plate-col { grid-column: 1 / span 6; position: relative; }
.plate {
  position: sticky;
  top: calc(var(--header-h-tight) + 40px);
  margin: 0;
  padding: var(--s-6);
  background: var(--surface);
}
.stack { display: grid; }
.stack .d {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 420ms var(--ease-out), transform 620ms var(--ease-out);
}
.stack .d.on { opacity: 1; transform: none; }
.plate figcaption {
  display: grid;
  gap: 2px;
  margin-top: var(--s-5);
  font-size: var(--step-small);
  color: var(--muted);
}
.plate figcaption span:first-child { color: var(--ink); font-weight: 600; }

.entries { grid-column: 8 / -1; }
.entry { padding-bottom: var(--s-9); }
.entry:last-child { padding-bottom: 0; }
.status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: var(--step-small);
  font-weight: 600;
  color: var(--muted);
}
.led { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
.live .led { background: var(--accent); }
.open .led { background: transparent; box-shadow: inset 0 0 0 2px var(--accent); } /* taste-skill-ignore: a ring drawn inside the status light */
.entry.on.open .led { animation: blink 1.8s ease-in-out infinite; }
@keyframes blink { 50% { opacity: 0.35; } }
.entry h3 {
  margin-top: var(--s-3);
  font-size: var(--step-lead);
  letter-spacing: -0.02em;
  line-height: 1.12;
  transition: color var(--dur-hover) ease;
}
.entry.on h3 { color: var(--accent); }
.objective { margin-top: var(--s-3); max-width: 56ch; }
dl { margin: var(--s-5) 0 0; display: grid; gap: 2px; font-size: 16px; }
dl div { display: grid; grid-template-columns: 9.5rem 1fr; gap: var(--s-4); padding: 12px 16px; background: var(--surface); }
dt { color: var(--muted); }
dd { margin: 0; }
.m-dia { display: none; }

@media (prefers-reduced-motion: reduce) {
  .stack .d { transition: opacity 200ms linear; transform: none; }
  .entry.on.open .led { animation: none; }
}

@media (max-width: 899px) {
  .split { grid-template-columns: 1fr; }
  .plate-col { display: none; }
  .entries { grid-column: 1; }
  .m-dia { display: block; padding: var(--s-4); margin-bottom: var(--s-5); background: var(--surface); box-sizing: border-box; }
  dl div { grid-template-columns: 1fr; gap: 4px; }
  .entry { padding-bottom: var(--s-8); }
}
</style>
