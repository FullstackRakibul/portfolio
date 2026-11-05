<template>
  <!-- The whole card opens the project (the title's link stretches over it); the other controls sit above. -->
  <article class="wc lab-card lab-card-link" :class="{ wide: wide || project.featured, featured: project.featured }">
    <div class="media">
      <img
        v-if="project.image" :src="project.image" :alt="''" width="1120" height="700"
        :loading="project.featured ? 'eager' : 'lazy'" decoding="async"
      >
    </div>

    <div class="body">
      <div class="title-row">
        <h3 :class="{ mono: project.featured }">
          <a class="lab-stretch" :href="project.url" target="_blank" rel="noopener" data-cursor-label="View project">
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
      <a v-if="project.related" class="rel lab-above" :href="project.related.url" target="_blank" rel="noopener" data-cursor-label="Read">
        {{ project.related.label }} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
      </a>

      <template v-if="project.featured">
        <UiButton v-magnetic="3" block class="open lab-above" :href="project.url" target="_blank" rel="noopener" data-cursor-label="View project">
          Open {{ project.title }}<span class="sr-only"> (opens in a new tab)</span>
          <template #icon><ArrowUpRight aria-hidden="true" /></template>
        </UiButton>
        <p class="tagline">This page takes its colours, type and cards from it.</p>
      </template>

      <slot />

      <span class="spacer" aria-hidden="true" />
      <div class="foot lab-card-foot">
        <span class="host lab-mono">{{ host }}</span>
        <span class="lab-badge" :data-status="project.status"><span class="sr-only">Status: </span>{{ STATUS_LABEL[project.status] }}</span>
      </div>
    </div>

    <div v-if="$slots.after" class="after lab-above"><slot name="after" /></div>
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
}

/* The picture keeps a 1px edge against the card. */
.media { display: block; aspect-ratio: 16 / 10; overflow: hidden; border-bottom: 1px solid var(--border); background: var(--muted); } /* taste-skill-ignore: image edge */
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
h3 a { color: var(--foreground); transition: color var(--dur-hover) ease; }
.wc:hover h3 a { color: var(--primary); }
.body h3.mono {
  font: 600 22px / 1.2 var(--font-mono); /* taste-skill-ignore: mono wordmark (the brief keeps mono labels) */
  letter-spacing: 0.18em;
}
.kind { margin-top: 4px; font-size: 15px; color: var(--muted-foreground); }
.pitch { margin-top: var(--s-3); font-size: 16px; line-height: 1.5; }
.pitch.bn { font-family: "Hind Siliguri", var(--font-text); font-size: 17px; line-height: 1.6; }
.trans { margin-top: 4px; font-size: 15px; color: var(--muted-foreground); }
.rel { align-self: flex-start; margin-top: var(--s-3); color: var(--foreground); font-size: 15px; font-weight: 500; text-decoration: underline; text-underline-offset: 0.25em; text-decoration-color: var(--border-strong); transition: text-decoration-color var(--dur-hover) ease; }
.rel:hover { text-decoration-color: var(--primary); }

.open { margin-top: var(--s-6); }
.tagline { margin-top: var(--s-3); text-align: center; font-size: 15px; color: var(--muted-foreground); }

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  padding-top: var(--s-4);
}
.spacer { flex: 1; min-height: var(--s-5); }
.host { transition: color var(--dur-hover) ease; color: var(--muted-foreground); font-size: 12px; letter-spacing: 0.08em; text-transform: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.foot .lab-badge { flex: none; }
.wc:hover .host { color: var(--foreground); }

/* Wide: picture on the left, the card's words on the right. */
@media (min-width: 900px) {
  .wide { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .featured { grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); }
  .wide .media { aspect-ratio: auto; height: 100%; min-height: 100%; border-bottom: 0; border-right: 1px solid var(--border); } /* taste-skill-ignore: image edge */
  .wide .body { padding: var(--s-6); }
  .featured .body { padding: var(--s-7) var(--s-6) var(--s-6); }
  .featured .body h3.mono { font-size: 28px; }
  .wide .after { grid-column: 1 / -1; }
  .featured .pitch { font-size: var(--step-lead); line-height: 1.35; }
}

@media (prefers-reduced-motion: reduce) {
  .media img { transition: none; }
  .wc:hover .media img { transform: none; }
}
</style>
