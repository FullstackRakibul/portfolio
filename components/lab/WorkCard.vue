<template>
  <article class="wc lab-card" :class="{ wide: wide || project.featured, featured: project.featured }">
    <a
      class="media" :href="project.url" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"
      data-cursor-label="View project"
    >
      <img
        v-if="project.image" :src="project.image" :alt="''" width="1120" height="700"
        :loading="project.featured ? 'eager' : 'lazy'" decoding="async"
      >
    </a>

    <div class="body">
      <div class="title-row">
        <h3 :class="{ mono: project.featured }">
          <a :href="project.url" target="_blank" rel="noopener" data-cursor-label="View project">
            {{ project.title }}<span class="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>
        <span v-if="project.version" class="lab-pill" :aria-label="`Version ${project.version.replace(/^v/, '')}`">{{ project.version }}</span>
      </div>
      <p v-if="project.kind" class="kind">{{ project.kind }}</p>

      <p class="pitch" :lang="project.lang" :class="{ bn: project.lang === 'bn' }">
        <template v-if="project.quote">“{{ project.pitch }}”</template>
        <template v-else>{{ project.pitch }}</template>
      </p>
      <p v-if="project.translation" class="trans">{{ project.translation }}</p>

      <template v-if="project.featured">
        <a v-magnetic="3" class="lab-button lab-button--block open" :href="project.url" target="_blank" rel="noopener" data-cursor-label="View project">
          Open {{ project.title }} <ArrowUpRight :size="18" aria-hidden="true" />
          <span class="sr-only"> (opens in a new tab)</span>
        </a>
        <p class="tagline">This page takes its colours, type and cards from it.</p>
      </template>

      <slot />

      <span class="spacer" aria-hidden="true" />
      <div class="foot lab-card-foot">
        <span class="host lab-mono">{{ host }}</span>
        <span class="lab-badge" :data-status="project.status"><span class="sr-only">Status: </span>{{ STATUS_LABEL[project.status] }}</span>
      </div>
    </div>

    <div v-if="$slots.after" class="after"><slot name="after" /></div>
  </article>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { STATUS_LABEL, type Project } from '~/data/projects'

const props = defineProps<{ project: Project; wide?: boolean }>()
const host = computed(() => {
  const u = new URL(props.project.url)
  return (u.hostname + u.pathname).replace(/^www\./, '').replace(/\/$/, '')
})
</script>

<style scoped>
.wc {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  transition: transform var(--dur-move) var(--ease-out), box-shadow var(--dur-move) var(--ease-out), border-color var(--dur-hover) ease;
}
.wc:hover,
.wc:focus-within { transform: translateY(-3px); box-shadow: var(--shadow-lift); border-color: var(--line-strong); } /* taste-skill-ignore: PIPILIKA card lifts on hover (brand) */

.media { display: block; aspect-ratio: 16 / 10; overflow: hidden; background: var(--surface-solid); }
.media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 900ms var(--ease-out);
}
.wc:hover .media img { transform: scale(1.03); }

.body { display: flex; flex-direction: column; flex: 1; padding: var(--s-5); min-width: 0; }
.title-row { display: flex; align-items: center; justify-content: space-between; gap: var(--s-3); }
.body h3 {
  font-size: 22px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
h3 a { color: var(--ink); text-decoration: none; transition: color var(--dur-hover) ease; }
h3 a:hover { color: var(--mint); }
.body h3.mono {
  font: 600 22px / 1.2 var(--font-mono); /* taste-skill-ignore: PIPILIKA sets labels, versions and badges in mono (brand) */
  letter-spacing: 0.18em;
}
.kind { margin-top: 4px; font-size: 15px; color: var(--muted); }
.pitch { margin-top: var(--s-3); font-size: 16px; line-height: 1.5; }
.pitch.bn { font-family: "Hind Siliguri", var(--font-text); font-size: 17px; line-height: 1.6; }
.trans { margin-top: 4px; font-size: 15px; color: var(--muted); }

.open { margin-top: var(--s-6); }
.tagline { margin-top: var(--s-3); text-align: center; font-size: 15px; color: var(--muted); }

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  padding-top: var(--s-4);
}
.spacer { flex: 1; min-height: var(--s-5); }
.host { transition: color var(--dur-hover) ease; color: var(--muted); font-size: 12px; letter-spacing: 0.08em; text-transform: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.foot .lab-badge { flex: none; }
.wc:hover .host { color: var(--mint); }

/* Wide: picture on the left, the card's words on the right. */
@media (min-width: 900px) {
  .wide { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .featured { grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); }
  .wide .media { aspect-ratio: auto; height: 100%; min-height: 100%; }
  .wide .body { padding: var(--s-6); }
  .featured .body { padding: var(--s-7) var(--s-6) var(--s-6); }
  .featured .body h3.mono { font-size: 28px; }
  .wide .after { grid-column: 1 / -1; }
  .featured .pitch { font-size: var(--step-lead); line-height: 1.35; }
}

@media (prefers-reduced-motion: reduce) {
  .wc, .media img { transition: none; }
  .wc:hover, .wc:focus-within { transform: none; }
  .wc:hover .media img { transform: none; }
}
</style>
