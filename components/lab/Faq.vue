<template>
  <section id="faq" v-reveal class="lab-section lab-wrap" aria-labelledby="faq-h">
    <div class="lab-head">
      <h2 id="faq-h" data-reveal>Questions people ask</h2>
      <p data-reveal>
        Short answers, taken from this page.
        Last updated <time :datetime="buildDate">{{ updated }}</time>.
      </p>
    </div>

    <div class="list" data-reveal>
      <details v-for="(f, i) in FAQ" :key="f.q" class="item" :open="i === 0">
        <summary><h3>{{ f.q }}</h3><Plus class="icon" :size="20" aria-hidden="true" /></summary>
        <p>{{ f.a }}</p>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { FAQ } from '~/data/profile'

// The same questions and answers are in the FAQPage markup (composables/useSiteSchema.ts) and /llms-full.txt.
const { buildDate } = useRuntimeConfig().public as { buildDate: string }
const updated = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(buildDate))
</script>

<style scoped>
/* One column: an open answer never leaves a hole beside it. */
.list { display: grid; }
.item { border-top: 1px solid var(--border); } /* taste-skill-ignore: question rows, as in the site's lists */
summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-4);
  padding: var(--s-5) 0;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }
summary h3 { font-size: var(--step-lead); line-height: 1.25; letter-spacing: -0.01em; text-wrap: balance; }
.icon { flex: none; margin-top: 4px; color: var(--muted-foreground); transition: transform var(--dur-hover) ease; }
.item[open] .icon { transform: rotate(45deg); }
summary:hover .icon { color: var(--foreground); }
.item p { padding-bottom: var(--s-6); max-width: 60ch; color: var(--foreground); }

@media (prefers-reduced-motion: reduce) {
  .icon { transition: none; }
}
</style>
