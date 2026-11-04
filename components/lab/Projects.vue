<template>
  <section id="projects" v-reveal class="lab-section lab-wrap" aria-labelledby="work-h">
    <div class="lab-head">
      <h2 id="work-h" data-reveal>Selected projects</h2>
      <p data-reveal>
        PIPILIKA first, since this page borrows its look. Then work and client sites, one experiment written up as a
        case study, and one made for the fun of it. Every picture is a screenshot of the live site.
      </p>
    </div>

    <div v-if="featured" class="featured" data-reveal>
      <LabWorkCard :project="featured" />
    </div>

    <div v-for="g in groups" :key="g.status" class="group" :class="g.status">
      <h3 class="group-h" data-reveal>{{ g.title }}</h3>
      <ul class="cards" :class="`n${g.items.length}`">
        <li v-for="p in g.items" :key="p.id" data-reveal>
          <LabWorkCard :project="p" :wide="g.items.length === 1">
            <template v-if="p.caseStudy" #after>
              <LabCaseStudy :study="p.caseStudy" />
            </template>
          </LabWorkCard>
        </li>
      </ul>
    </div>

    <div v-if="EARLIER_PROJECTS.length" class="group earlier">
      <h3 class="group-h" data-reveal>Earlier work</h3>
      <ul class="rows">
        <li v-for="p in EARLIER_PROJECTS" :key="p.title">
          <component
            :is="p.url ? 'a' : 'div'" class="row" :href="p.url"
            :target="p.url ? '_blank' : undefined" :rel="p.url ? 'noopener' : undefined"
          >
            <span class="r-title">{{ p.title }}<span v-if="p.url" class="sr-only"> (opens in a new tab)</span></span>
            <span class="r-desc">{{ p.description }}<template v-if="p.stack">, {{ p.stack.join(' / ') }}</template></span>
            <span class="r-host lab-mono">{{ host(p.url) }}<ArrowUpRight v-if="p.url" :size="14" aria-hidden="true" /></span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { EARLIER_PROJECTS, PROJECTS, PROJECT_GROUPS } from '~/data/projects'

const featured = PROJECTS.find(p => p.featured)
const groups = PROJECT_GROUPS
  .map(g => ({ ...g, items: PROJECTS.filter(p => !p.featured && p.status === g.status) }))
  .filter(g => g.items.length)
const host = (url?: string) => (url ? new URL(url).hostname.replace(/^www\./, '') : 'No public link')
</script>

<style scoped>
.featured { margin-bottom: var(--s-9); }

.group + .group { margin-top: var(--s-9); }
.group .group-h {
  margin-bottom: var(--s-5);
  font: 600 var(--step-lead) / 1.2 var(--font-text);
  letter-spacing: -0.01em;
}

/* Cards share a six-column track: two wide cards per row, then three. Seven cards read 2 · 2 · 3. */
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--gap);
}
.cards > li { grid-column: span 2; display: flex; min-width: 0; }
.cards > li > * { flex: 1; }
.cards.n1 > li { grid-column: 1 / -1; }
.cards.n2 > li,
.cards.n4 > li { grid-column: span 3; }
.cards.n7 > li:nth-child(-n + 4) { grid-column: span 3; }
.cards.n5 > li:nth-child(-n + 2) { grid-column: span 3; }

.rows > li { min-width: 0; }
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px var(--gap);
}
.row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr) auto;
  min-width: 0;
  align-items: center;
  gap: var(--s-4);
  min-height: 52px;
  padding: 8px var(--s-4);
  border-radius: var(--radius-control);
  background: var(--surface-2);
  color: var(--ink);
  text-decoration: none;
  transition: background-color var(--dur-hover) ease, transform var(--dur-hover) var(--ease-out);
}
a.row:hover { background: var(--surface-3); transform: translateY(-1px); }
a.row:hover .r-title { color: var(--mint); }
.r-title { font-weight: 600; font-size: 16px; transition: color var(--dur-hover) ease; }
.r-desc { font-size: 15px; color: var(--muted); }
.r-host { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; letter-spacing: 0.06em; text-transform: none; color: var(--muted); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .row { transition: background-color var(--dur-hover) ease; }
  a.row:hover { transform: none; }
}
@media (max-width: 1099px) {
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cards > li,
  .cards.n7 > li:nth-child(-n + 4),
  .cards.n5 > li:nth-child(-n + 2) { grid-column: span 1; }
  .cards.n1 > li { grid-column: 1 / -1; }
  .rows { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 639px) {
  .cards { grid-template-columns: 1fr; }
  .row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 2px; padding: 12px var(--s-4); }
  .r-desc { grid-column: 1 / -1; grid-row: 2; }
}
</style>
