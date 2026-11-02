<template>
  <section id="projects" v-reveal class="work" aria-labelledby="work-h">
    <div class="column">
      <h2 id="work-h" class="lab-heading" data-reveal>Selected projects</h2>
      <div class="filters" role="group" aria-label="Filter projects" data-reveal>
        <button
          v-for="f in PROJECT_FILTERS" :key="f.id" type="button"
          :aria-pressed="filter === f.id" @click="filter = f.id"
        >
          {{ f.label }} <span class="lab-num">{{ count(f.id) }}</span>
        </button>
      </div>

      <div ref="ledger" class="ledger" @mouseleave="hover = -1">
        <div v-for="g in groups" :key="g.id" class="group">
          <h3 v-if="filter === 'all'" class="g-name">{{ g.label }}</h3>
          <ul>
            <li v-for="p in g.items" :key="p.title" :class="{ dim: hover !== -1 && hover !== index(p) }">
              <img
                v-if="p.image && mobileImage(p)" class="m-img" :src="p.image" :alt="`${p.title} website`"
                width="800" height="600" loading="lazy" decoding="async"
              >
              <component
                :is="p.url ? 'a' : 'div'"
                class="entry"
                :href="p.url"
                :target="p.url ? '_blank' : undefined"
                :rel="p.url ? 'noopener' : undefined"
                :tabindex="p.url ? undefined : 0"
                @mouseenter="show(p, $event)"
                @focus="show(p, $event)"
              >
                <span class="t">{{ p.title }}</span>
                <span class="d">{{ p.description }}<template v-if="p.stack">, {{ p.stack.join(' / ') }}</template></span>
                <span class="u">{{ host(p) }}<ArrowUpRight v-if="p.url" :size="14" aria-hidden="true" /></span>
              </component>
            </li>
          </ul>
        </div>
        <figure class="preview" :style="{ transform: `translateY(${previewY}px)` }" aria-hidden="true">
          <Transition name="swap" mode="out-in">
            <img
              v-if="preview?.image" :key="preview.image" :src="preview.image" alt=""
              width="800" height="600" decoding="async" loading="lazy"
            >
            <div v-else :key="'none-' + preview?.title" class="blank">
              <span>{{ preview?.title }}</span>
              <span>{{ preview?.description }}</span>
            </div>
          </Transition>
        </figure>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { PROJECTS, PROJECT_FILTERS, type Project, type ProjectCategory } from '~/data/portfolio'

const filter = ref<ProjectCategory | 'all'>('all')
const hover = ref(-1)
const ledger = ref<HTMLElement | null>(null)
const preview = ref<Project | undefined>(PROJECTS[0])
const previewY = ref(0)

const visible = computed(() => PROJECTS.filter(p => filter.value === 'all' || p.category === filter.value))
const groups = computed(() =>
  PROJECT_FILTERS.filter(f => f.id !== 'all')
    .map(f => ({ id: f.id, label: f.label, items: visible.value.filter(p => p.category === f.id) }))
    .filter(g => g.items.length))
const count = (id: string) => (id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.category === id).length)
const index = (p: Project) => PROJECTS.indexOf(p)
const host = (p: Project) => (p.url ? new URL(p.url).hostname.replace(/^www\./, '') : 'No public link')
const mobileImage = (p: Project) => visible.value.filter(x => x.image).slice(0, 3).includes(p)

const show = (p: Project, e: Event) => {
  hover.value = index(p)
  preview.value = p
  const row = e.currentTarget as HTMLElement
  if (ledger.value) previewY.value = row.getBoundingClientRect().top - ledger.value.getBoundingClientRect().top
}

watch(filter, () => {
  preview.value = visible.value[0]
  previewY.value = 0
  hover.value = -1
})
</script>

<style scoped>
.work {
  --col: min(760px, 54vw);
  position: relative;
  padding: var(--section-gap) var(--margin) 0 var(--line);
}
.column { width: var(--col); }

.filters { display: flex; flex-wrap: wrap; gap: 4px 22px; margin: 28px 0 40px; }
.filters button {
  padding: 8px 0;
  border: 0;
  background: none;
  color: var(--muted);
  font: 16px var(--font-text);
  cursor: pointer;
  transition: color var(--dur-hover) ease;
}
.filters button span { font-size: var(--step-small); }
.filters button:hover, .filters button[aria-pressed="true"] { color: var(--ink); }
.filters button[aria-pressed="true"] {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 8px;
  text-decoration-color: var(--accent);
}

.ledger { position: relative; }
.group + .group { margin-top: 28px; }
.g-name {
  font: 600 16px var(--font-text);
  letter-spacing: 0;
  color: var(--muted);
  margin-bottom: 6px;
}
ul { list-style: none; margin: 0; padding: 0; }
.entry {
  display: grid;
  grid-template-columns: 38% 1fr auto;
  align-items: baseline;
  gap: 16px;
  min-height: 44px;
  padding: 11px 0;
  box-sizing: border-box;
  color: var(--ink);
  text-decoration: none;
  transition: color var(--dur-hover) ease;
}
.t { font-size: 16px; font-weight: 600; }
.d { font-size: var(--step-small); color: var(--muted); }
.u { display: inline-flex; gap: 4px; align-items: center; font-size: var(--step-small); color: var(--muted); white-space: nowrap; }
.dim .entry, .dim .entry .d, .dim .entry .u { color: var(--muted); }
a.entry:hover .t { color: var(--accent); }
.m-img { display: none; }

.preview {
  position: absolute;
  top: 0;
  left: calc(100% + 64px);
  width: min(320px, calc(100vw - var(--line) - var(--col) - 64px - var(--margin)));
  margin: 0;
  aspect-ratio: 4 / 3;
  background: var(--surface);
  transition: transform 240ms var(--ease-out);
  pointer-events: none;
}
.preview img, .blank { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
.blank { display: grid; align-content: end; gap: 4px; padding: 20px; box-sizing: border-box; font-size: 16px; }
.blank span:first-child { font: 700 var(--step-lead)/1 var(--font-display); letter-spacing: -0.03em; }
.blank span:last-child { color: var(--muted); }
.swap-enter-active, .swap-leave-active { transition: opacity 150ms ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; }

@media (max-width: 1099px) {
  .work { padding-left: var(--margin); }
  .column { width: auto; }
  .preview { display: none; }
  .entry { grid-template-columns: 1fr auto; gap: 2px 16px; min-height: 52px; }
  .d { grid-column: 1 / -1; grid-row: 2; }
  .m-img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; margin-top: 16px; }
}
</style>
