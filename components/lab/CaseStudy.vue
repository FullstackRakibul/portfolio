<template>
  <details class="cs lab-card-foot" :open="open" @toggle="open = ($event.target as HTMLDetailsElement).open">
    <summary>
      <span class="lab-mono">{{ open ? 'Hide the case study' : 'Read the case study' }}</span>
      <ChevronDown class="chev" :size="18" aria-hidden="true" />
    </summary>

    <div class="grid">
      <section class="what">
        <h4 class="lab-mono">What it is</h4>
        <p>{{ study.what }}</p>
      </section>

      <section class="does">
        <h4 class="lab-mono">What it does</h4>
        <ul class="list">
          <li v-for="d in study.does" :key="d">{{ d }}</li>
        </ul>
      </section>

      <section class="solved">
        <h4 class="lab-mono">Problems solved</h4>
        <dl>
          <div v-for="s in study.solved" :key="s.problem">
            <dt>{{ s.problem }}</dt>
            <dd>{{ s.fix }}</dd>
          </div>
        </dl>
      </section>

      <div class="side">
        <section class="stack">
          <h4 class="lab-mono">Stack</h4>
          <ul class="lab-tags">
            <li v-for="t in study.stack" :key="t">{{ t }}</li>
          </ul>
        </section>

        <section class="next">
          <h4 class="lab-mono">Next</h4>
          <ul class="list">
            <li v-for="n in study.next" :key="n">{{ n }}</li>
          </ul>
        </section>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import type { CaseStudy } from '~/data/projects'

defineProps<{ study: CaseStudy }>()
const open = ref(false)
</script>

<style scoped>
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  min-height: 56px;
  padding: 0 var(--s-6);
  color: var(--mint);
  cursor: pointer;
  list-style: none;
  transition: background-color var(--dur-hover) ease;
}
summary::-webkit-details-marker { display: none; }
summary:hover { background: var(--surface-2); }
summary:focus-visible { outline: 2px solid var(--mint); outline-offset: -2px; }
.chev { transition: transform var(--dur-move) var(--ease-out); }
details[open] .chev { transform: rotate(180deg); }

.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--s-6) var(--gap);
  padding: var(--s-4) var(--s-6) var(--s-7);
}
details[open] .grid { animation: rise 420ms var(--ease-out); }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } }

.what { grid-column: 1 / span 6; }
.does { grid-column: 7 / -1; }
.solved { grid-column: 1 / span 7; }
.side { grid-column: 9 / -1; display: grid; align-content: start; gap: var(--s-6); }

h4 { margin: 0 0 var(--s-3); color: var(--muted); font-size: 12px; }
p, .list { font-size: 16px; }
.list { margin: 0; padding-left: 1.1em; display: grid; gap: var(--s-2); }
.list li::marker { color: var(--mint); }

dl { margin: 0; display: grid; gap: var(--s-2); }
dl div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
  gap: var(--s-4);
  padding: 12px var(--s-4);
  border-radius: var(--radius-control);
  background: var(--surface-2);
  font-size: 16px;
}
dt { color: var(--muted); }
dd { margin: 0; }

@media (prefers-reduced-motion: reduce) {
  details[open] .grid { animation: none; }
  .chev { transition: none; }
}
@media (max-width: 899px) {
  summary { padding: 0 var(--s-5); }
  .grid { grid-template-columns: 1fr; padding: var(--s-3) var(--s-5) var(--s-6); }
  .what, .does, .solved, .side { grid-column: 1; }
  dl div { grid-template-columns: 1fr; gap: 4px; }
}
</style>
