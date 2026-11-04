<template>
  <section id="experience" v-reveal class="exp lab-section lab-wrap" aria-labelledby="xp-h">
    <div class="lab-head">
      <h2 id="xp-h" data-reveal>Experience</h2>
      <p data-reveal>{{ intro }}</p>
    </div>

    <div class="lab-grid">
      <ol ref="list" class="timeline" aria-label="Experience, most recent first" :style="{ '--fill': fill }">
        <li
          v-for="(e, i) in EMPLOYERS" :key="e.company" :ref="el => (items[i] = el as HTMLElement)"
          class="stop" :class="{ reached: reached[i], now: i === 0 }" data-reveal
        >
          <span class="node" aria-hidden="true" />
          <p class="years lab-mono" aria-hidden="true">{{ employerYears(e) }}</p>

          <article class="co lab-card">
            <header>
              <h3>{{ e.company }}</h3>
              <p class="meta">{{ [e.type, e.location, e.tenure].filter(Boolean).join(' · ') }}</p>
              <p v-if="e.motto" class="motto">“{{ e.motto }}”</p>
            </header>

            <ol class="roles" :class="{ many: e.positions.length > 1 }">
              <li v-for="p in e.positions" :key="p.title + p.start">
                <div class="role-head">
                  <h4>{{ p.title }}</h4>
                  <span class="lab-pill">
                    <time :datetime="p.start">{{ monthLabel(p.start) }}</time>
                    <span aria-hidden="true">→</span><span class="sr-only">to</span>
                    <time v-if="p.end" :datetime="p.end">{{ monthLabel(p.end) }}</time>
                    <span v-else>now</span>
                  </span>
                </div>
                <p v-if="p.location" class="where">{{ p.location }}</p>
                <p v-if="p.focus" class="focus">{{ p.focus }}</p>
                <ul v-if="p.skills?.length" class="lab-tags" :aria-label="`Skills, ${p.title}`">
                  <li v-for="s in p.skills" :key="s">{{ s }}</li>
                </ul>
              </li>
            </ol>

            <p v-if="e.note" class="note">{{ e.note }}</p>
          </article>
        </li>
      </ol>

      <aside class="side" aria-label="Education and interests">
        <div class="lab-card box" data-reveal>
          <h3>Education</h3>
          <p>City University</p>
          <p class="lab-meta">BSc in Computer Science and Engineering</p>
          <p class="box-foot lab-card-foot"><span class="lab-pill">2022</span></p>
        </div>
        <div class="lab-card box" data-reveal>
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
import { BEYOND_WORK } from '~/data/portfolio'
import { EMPLOYERS, employerYears, monthLabel } from '~/data/experience'

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
const word = (n: number) => WORDS[n] ?? String(n)
const roles = EMPLOYERS.reduce((n, e) => n + e.positions.length, 0)
const since = EMPLOYERS.flatMap(e => e.positions.map(p => p.start)).sort()[0]!.slice(0, 4)
const intro = `${word(EMPLOYERS.length)} companies and ${word(roles).toLowerCase()} roles since ${since}, from WordPress and Laravel sites to the enterprise ERP behind Ha-Meem Group’s HRM, Payroll and Production.`

// The track fills as the list passes the middle of the screen; each company lights when reached.
const list = ref<HTMLElement | null>(null)
const items: HTMLElement[] = []
const fill = ref(0)
const reached = ref<boolean[]>(EMPLOYERS.map(() => false))
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
  reached.value = items.map(it => it.getBoundingClientRect().top + 30 < line)
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

watch([inView, reduce], ([on]) => {
  if (on) { addEventListener('scroll', onScroll, { passive: true }); update() }
  else removeEventListener('scroll', onScroll)
})
onBeforeUnmount(() => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
</script>

<style scoped>
/* yc: the years column; rc: the rail's centre from the end of that column; rg: rail gutter before the cards. */
.timeline {
  --yc: 7.5rem;
  --rc: 18px;
  --rg: 40px;
  grid-column: 1 / span 8;
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0 0 0 calc(var(--yc) + var(--rg));
  display: grid;
  gap: var(--s-5);
}
.timeline::before,
.timeline::after {
  content: '';
  position: absolute;
  left: calc(var(--yc) + var(--rc) - 1.5px);
  top: 26px;
  bottom: 26px;
  width: 3px;
  border-radius: 2px;
  background: var(--surface-3);
}
.timeline::after {
  background: var(--mint);
  transform-origin: top;
  transform: scaleY(var(--fill));
  transition: transform 120ms linear;
}

.stop { position: relative; min-width: 0; }
.node {
  position: absolute;
  left: calc(var(--rc) - 8px - var(--rg));
  top: 26px;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 3px solid var(--surface-3);
  background: var(--ground-b);
  z-index: 1;
  transition: border-color 300ms ease, background-color 300ms ease, transform 420ms var(--ease-spring);
}
.reached .node { border-color: var(--mint); background: var(--mint); }
.now .node::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid var(--mint);
  opacity: 0;
}
.now.reached .node::after { animation: ring 2.4s var(--ease-out) infinite; }
@keyframes ring {
  from { transform: scale(0.5); opacity: 0.8; }
  to { transform: scale(1.4); opacity: 0; }
}

.years {
  position: absolute;
  left: calc(-1 * (var(--yc) + var(--rg)));
  width: calc(var(--yc) - 8px);
  top: 26px;
  text-align: right;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.08em;
  line-height: 1.3;
}
.now .years { color: var(--mint); }

.co { padding: var(--s-5) var(--s-5) var(--s-5); min-width: 0; }
.co h3 { font-size: var(--step-lead); letter-spacing: -0.02em; line-height: 1.15; }
.meta { margin-top: 6px; font-size: 15px; color: var(--muted); }
.motto { margin-top: var(--s-2); font-size: 15px; font-style: italic; color: var(--ink); }

.roles { list-style: none; margin: var(--s-4) 0 0; padding: 0; display: grid; gap: var(--s-4); }
/* Several roles at one company: a short connecting rail inside the card. */
.roles.many { padding-left: var(--s-4); border-left: 2px solid var(--line); } /* taste-skill-ignore: groups roles held at one company */
.role-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--s-2) var(--s-4); }
h4 { margin: 0; font: 600 var(--step-body) / 1.3 var(--font-text); }
.where { margin-top: 4px; font-size: 15px; color: var(--muted); }
.focus { margin-top: var(--s-2); font-size: 16px; }
.roles .lab-tags { margin-top: var(--s-3); }
.note { margin-top: var(--s-4); font-size: 16px; }

.side {
  grid-column: 10 / -1;
  align-self: start;
  position: sticky;
  top: calc(var(--header-h-tight) + 32px);
  display: grid;
  gap: var(--s-5);
}
.box { padding: var(--s-5); }
.box h3 { font: 600 var(--step-body) / 1.3 var(--font-text); letter-spacing: 0; margin-bottom: var(--s-3); }
.box ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-2); }
.box-foot { margin-top: var(--s-4); padding-top: var(--s-3); }

@media (prefers-reduced-motion: reduce) {
  .timeline::after, .node { transition: none; }
  .now.reached .node::after { animation: none; }
}
@media (max-width: 1099px) {
  .timeline { grid-column: 1 / -1; }
  .side { grid-column: 1 / -1; position: static; margin-top: var(--s-7); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); align-items: start; }
}
/* One column: the years leave, the rail moves to the edge, the cards take the width. */
@media (max-width: 719px) {
  .timeline { --yc: 0px; --rc: 8px; --rg: 28px; }
  .years { display: none; }
  .co { padding: var(--s-4); }
  .role-head { flex-direction: column; align-items: flex-start; }
  .roles.many { padding-left: var(--s-3); }
}
</style>
