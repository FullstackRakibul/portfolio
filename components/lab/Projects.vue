<template>
  <section id="projects" v-reveal class="lab-section lab-wrap" aria-labelledby="work-h">
    <div class="lab-head">
      <h2 id="work-h" data-reveal>Selected projects</h2>
      <p data-reveal>
        Enterprise applications, developer tools and the corporate and commerce sites built for clients. Every
        picture is a screenshot of the live site.
      </p>
    </div>

    <div class="filters" role="group" aria-label="Filter projects" data-reveal>
      <button
        v-for="f in PROJECT_FILTERS" :key="f.id" type="button"
        :aria-pressed="filter === f.id" @click="filter = f.id"
      >
        <LabGlyph v-if="f.id !== 'all'" :kind="f.id" />{{ f.label }} <span class="lab-num">{{ count(f.id) }}</span>
      </button>
    </div>

    <TransitionGroup tag="ul" name="card" class="grid" :class="{ 'has-featured': featured.length }">
      <li v-for="p in pictured" :key="p.title" class="card" :class="{ featured: p.featured }">
        <a :href="p.url" target="_blank" rel="noopener" class="hit">
          <span class="media">
            <img :src="p.image" :alt="`${p.title}: screenshot of the live site`" width="800" height="600" loading="lazy" decoding="async">
          </span>
          <span class="title">{{ p.title }}</span>
          <svg class="trace" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 4 Q 7.5 0 15 4 T 30 4 T 45 4 T 60 4 T 75 4 T 90 4 T 105 4 T 120 4" />
          </svg>
          <span class="desc">{{ p.description }}</span>
          <span class="meta">
            <span class="cat"><LabGlyph :kind="p.category" />{{ label(p.category) }}</span>
            <span class="host">{{ host(p) }}<ArrowUpRight :size="15" aria-hidden="true" /></span>
          </span>
          <span v-if="p.stack" class="tags"><span v-for="t in p.stack" :key="t">{{ t }}</span></span>
        </a>
      </li>
    </TransitionGroup>

    <div v-if="plain.length" class="more">
      <h3>{{ pictured.length ? 'More work' : 'Tools and sites' }}</h3>
      <TransitionGroup tag="ul" name="card" class="rows">
        <li v-for="p in plain" :key="p.title">
          <component
            :is="p.url ? 'a' : 'div'" class="row" :href="p.url"
            :target="p.url ? '_blank' : undefined" :rel="p.url ? 'noopener' : undefined"
          >
            <LabGlyph :kind="p.category" />
            <span class="r-title">{{ p.title }}</span>
            <span class="r-desc">{{ p.description }}<template v-if="p.stack">, {{ p.stack.join(' / ') }}</template></span>
            <span class="r-host">{{ host(p) }}<ArrowUpRight v-if="p.url" :size="15" aria-hidden="true" /></span>
          </component>
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { PROJECTS, PROJECT_FILTERS, type Project, type ProjectCategory } from '~/data/portfolio'

const filter = ref<ProjectCategory | 'all'>('all')

const visible = computed(() => PROJECTS.filter(p => filter.value === 'all' || p.category === filter.value))
const featured = computed(() => visible.value.filter(p => p.featured && p.image))
const pictured = computed(() => [...featured.value, ...visible.value.filter(p => p.image && !p.featured)])
const plain = computed(() => visible.value.filter(p => !p.image))
const count = (id: string) => (id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.category === id).length)
const label = (c: ProjectCategory) => PROJECT_FILTERS.find(f => f.id === c)?.label ?? c
const host = (p: Project) => (p.url ? new URL(p.url).hostname.replace(/^www\./, '') : 'No public link')
</script>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: var(--s-1); margin-bottom: var(--s-6); }
.filters button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  background: var(--surface);
  color: var(--ink);
  font: 16px var(--font-text);
  cursor: pointer;
  transition: background-color var(--dur-hover) ease, color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}
.filters button span { font-size: var(--step-small); color: var(--muted); }
.filters button:hover { background: var(--surface-2); }
.filters button:active { transform: scale(0.97); }
.filters button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
.filters button[aria-pressed="true"] span { color: inherit; opacity: 0.7; }

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--s-8) var(--gap);
}
.card { grid-column: span 2; min-width: 0; }
.card.featured { grid-column: span 3; }

.hit { display: grid; color: var(--ink); text-decoration: none; }
.media { display: block; overflow: hidden; aspect-ratio: 4 / 3; background: var(--surface); }
.media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: saturate(0.35);
  transition: transform 900ms var(--ease-out), filter 500ms ease;
}
.hit:hover .media img,
.hit:focus-visible .media img { transform: scale(1.035); filter: none; }

.meta {
  display: flex;
  justify-content: space-between;
  gap: var(--s-4);
  margin-top: var(--s-3);
  font-size: var(--step-small);
  color: var(--muted);
}
.cat, .host { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.host svg { transition: transform var(--dur-hover) var(--ease-out); }
.hit:hover .host svg { transform: translate(2px, -2px); }
.title {
  margin-top: var(--s-4);
  font: 700 var(--step-lead) / 1.1 var(--font-display);
  letter-spacing: -0.02em;
  transition: color var(--dur-hover) ease;
}
.hit:hover .title { color: var(--accent); }

/* A carrier wave draws under the title on hover. */
.trace { width: 100%; height: 8px; margin-top: var(--s-2); overflow: visible; }
.trace path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 700ms var(--ease-out);
}
.hit:hover .trace path,
.hit:focus-visible .trace path { transform: none; }

.desc { margin-top: var(--s-1); font-size: 16px; color: var(--muted); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: var(--s-3); }
.tags span { padding: 3px 10px; background: var(--surface); font-size: var(--step-small); }

.more { margin-top: var(--s-9); }
.more h3 { font: 600 var(--step-body) / 1.3 var(--font-text); letter-spacing: 0; margin-bottom: var(--s-4); }
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px var(--gap);
}
.row {
  display: grid;
  grid-template-columns: 14px minmax(0, 0.8fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--s-4);
  min-height: 56px;
  padding: 0 var(--s-4);
  background: var(--surface);
  color: var(--ink);
  text-decoration: none;
  transition: background-color var(--dur-hover) ease;
}
a.row:hover { background: var(--surface-2); }
.r-title { font-weight: 600; }
.r-desc, .r-host { font-size: var(--step-small); color: var(--muted); }
.r-host { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
a.row:hover .r-title { color: var(--accent); }

.card-enter-active, .card-leave-active { transition: opacity 280ms ease, transform 420ms var(--ease-out); }
.card-enter-from, .card-leave-to { opacity: 0; transform: translateY(12px); }
.card-leave-active { position: absolute; visibility: hidden; }

@media (prefers-reduced-motion: reduce) {
  .media img, .trace path, .card-enter-active { transition: none; }
}
@media (max-width: 1099px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-7) var(--gap); }
  .card, .card.featured { grid-column: span 1; }
  .rows { grid-template-columns: 1fr; }
}
@media (max-width: 599px) {
  .grid { grid-template-columns: 1fr; }
  .row { grid-template-columns: 14px 1fr auto; padding: 12px var(--s-4); row-gap: 2px; }
  .r-desc { grid-column: 2 / -1; grid-row: 2; }
}
</style>
