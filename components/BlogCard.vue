<template>
  <article class="bc lab-card lab-card-link" :class="{ featured }">
    <div class="meta">
      <span v-if="category" class="lab-pill">{{ category }}</span>
      <span class="when"><time :datetime="date">{{ formatDate(date) }}</time><template v-if="readTime"> · {{ readTime }}</template></span>
    </div>

    <h2 class="t">
      <NuxtLink :to="`/onTheWayToBeCreative/${slug}`" class="lab-stretch" data-cursor-label="Read">{{ title }}</NuxtLink>
    </h2>

    <p class="ex">{{ excerpt }}</p>

    <span class="spacer" aria-hidden="true" />
    <div class="foot lab-card-foot">
      <ul class="lab-tags" :aria-label="`Tags, ${title}`">
        <li v-for="tag in tags.slice(0, 3)" :key="tag">{{ tag }}</li>
        <li v-if="tags.length > 3">+{{ tags.length - 3 }} more</li>
      </ul>
      <span class="more" aria-hidden="true">Read More <ArrowRight :size="16" /></span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

// A note from this site (data/blog-posts.json). The whole card opens the post.
withDefaults(defineProps<{
  title: string
  excerpt: string
  date: string
  readTime?: string
  tags?: string[]
  slug: string
  category?: string
  featured?: boolean
}>(), { tags: () => [], featured: false })

const { formatDate } = useBlog()
</script>

<style scoped>
.bc { display: flex; flex-direction: column; min-width: 0; height: 100%; padding: var(--s-5); }
.featured { padding: var(--s-6); }
.meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--s-2) var(--s-4); }
.when { font-size: 14px; color: var(--muted); }
.t {
  margin-top: var(--s-4);
  font: 600 20px / 1.3 var(--font-text);
  letter-spacing: -0.01em;
  text-wrap: pretty;
}
.featured .t { font-size: 24px; letter-spacing: -0.02em; }
.t a { transition: color var(--dur-hover) ease; }
.bc:hover .t a { color: var(--mint); }
.ex { margin-top: var(--s-3); font-size: 16px; color: var(--muted); }
.spacer { flex: 1; min-height: var(--s-5); }
.foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--s-3); padding-top: var(--s-4); }
.more { display: inline-flex; align-items: center; gap: 6px; color: var(--mint); font-size: 15px; font-weight: 600; }
.more svg { transition: transform var(--dur-hover) var(--ease-out); }
.bc:hover .more svg { transform: translateX(3px); }
@media (prefers-reduced-motion: reduce) {
  .bc:hover .more svg { transform: none; }
}
</style>
