<template>
  <section id="experience" v-reveal class="exp lab-section lab-wrap" aria-labelledby="xp-h">
    <div class="lab-head">
      <h2 id="xp-h" data-reveal>Experience</h2>
      <p data-reveal>
        Four roles since 2022, from agency web work and project management to enterprise systems at Ha-Meem Group.
      </p>
    </div>

    <div class="lab-grid">
      <ol ref="list" class="timeline" aria-label="Experience, most recent first" :style="{ '--fill': fill }">
        <li
          v-for="(r, i) in EXPERIENCE" :key="r.company" :ref="el => (items[i] = el as HTMLElement)"
          :class="{ reached: reached[i], now: i === 0 }" data-reveal
        >
          <span class="node" aria-hidden="true" />
          <p class="when lab-num">{{ r.period }}</p>
          <h3>{{ r.company }}</h3>
          <p class="what">{{ r.position }}</p>
        </li>
      </ol>

      <aside class="side" aria-label="Education and interests">
        <div data-reveal>
          <h3>Education</h3>
          <p>City University</p>
          <p class="lab-meta">BSc in Computer Science and Engineering, <span class="lab-num">2022</span></p>
        </div>
        <div data-reveal>
          <h3>Outside work</h3>
          <ul>
            <li v-for="b in BEYOND_WORK" :key="b">{{ b }}</li>
          </ul>
        </div>
        <p data-reveal><NuxtLink class="lab-link" to="/resume">Read the full résumé</NuxtLink></p>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BEYOND_WORK, EXPERIENCE } from '~/data/portfolio'

// The track fills as the list passes the middle of the screen; each role lights when reached.
const list = ref<HTMLElement | null>(null)
const items: HTMLElement[] = []
const fill = ref(0)
const reached = ref<boolean[]>(EXPERIENCE.map(() => false))
const inView = useInView(list, '0px')
const reduce = useReducedMotion()

let raf = 0
const update = () => {
  raf = 0
  const el = list.value
  if (!el) return
  if (reduce.value) { fill.value = 1; reached.value = reached.value.map(() => true); return }
  const r = el.getBoundingClientRect()
  const line = innerHeight * 0.62
  fill.value = Math.min(1, Math.max(0, (line - r.top) / r.height))
  reached.value = items.map(it => it.getBoundingClientRect().top + 14 < line)
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

watch([inView, reduce], ([on]) => {
  if (on) { addEventListener('scroll', onScroll, { passive: true }); update() }
  else removeEventListener('scroll', onScroll)
})
onBeforeUnmount(() => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
</script>

<style scoped>
.timeline {
  grid-column: 1 / span 6;
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0 0 0 40px;
  display: grid;
  gap: var(--s-7);
}
/* Track and fill: filled shapes, not rules. */
.timeline::before,
.timeline::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--surface-2);
}
.timeline::after {
  background: var(--accent);
  transform-origin: top;
  transform: scaleY(var(--fill));
  transition: transform 120ms linear;
}

li { position: relative; }
.node {
  position: absolute;
  left: -40px;
  top: 4px;
  width: 17px;
  height: 17px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 3px solid var(--surface-2);
  background: var(--bg);
  z-index: 1;
  transition: border-color 300ms ease, background-color 300ms ease, transform 420ms var(--ease-spring);
}
.reached .node { border-color: var(--accent); background: var(--accent); transform: scale(1.08); }
.now .node::after {
  content: '';
  position: absolute;
  inset: -9px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  opacity: 0;
}
.now.reached .node::after { animation: ring 2.4s var(--ease-out) infinite; }
@keyframes ring {
  from { transform: scale(0.5); opacity: 0.8; }
  to { transform: scale(1.4); opacity: 0; }
}

.when { font-size: var(--step-small); color: var(--muted); }
li h3 {
  margin-top: var(--s-2);
  font-size: var(--step-lead);
  letter-spacing: -0.02em;
  line-height: 1.1;
  transition: color 300ms ease;
}
.what { margin-top: var(--s-1); color: var(--muted); }

.side {
  grid-column: 8 / -1;
  display: grid;
  align-content: start;
  gap: var(--s-7);
}
.side h3 {
  font: 600 var(--step-body) / 1.3 var(--font-text);
  letter-spacing: 0;
  margin-bottom: var(--s-3);
}
.side ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-2); }

@media (prefers-reduced-motion: reduce) {
  .timeline::after, .node { transition: none; }
  .now.reached .node::after { animation: none; }
}
/* Wide screens: the dates take their own column, so each role reads as one row. */
@media (min-width: 900px) {
  li { display: grid; grid-template-columns: 10.5rem minmax(0, 1fr); column-gap: var(--s-5); align-items: baseline; }
  .when { grid-row: span 2; }
  li h3 { margin-top: 0; }
}
@media (max-width: 899px) {
  .timeline { grid-column: 1 / -1; }
  .side { grid-column: 1 / -1; margin-top: var(--s-8); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
}
</style>
