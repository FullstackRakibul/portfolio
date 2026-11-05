<template>
  <article class="mc lab-card lab-card-link">
    <div class="cover">
      <img
        v-if="post.cover && !broken" :src="post.cover" :alt="`Cover image of “${post.title}”`"
        width="1024" height="576" loading="lazy" decoding="async" referrerpolicy="no-referrer" @error="broken = true"
      >
      <div v-else class="placeholder" aria-hidden="true"><span class="lab-mono">{{ post.topic || 'Medium' }}</span></div>
    </div>

    <div class="body">
      <div class="meta">
        <span class="lab-pill"><time :datetime="post.date">{{ shortDate(post.date) }}</time></span>
        <span v-if="post.topic" class="topic">{{ post.topic }}</span>
        <span v-if="post.readTime" class="read">{{ post.readTime }}</span>
      </div>
      <component :is="heading" class="t">{{ post.title }}</component>
      <p v-if="post.excerpt" class="ex">{{ post.excerpt }}</p>
      <span class="spacer" aria-hidden="true" />
      <div class="foot lab-card-foot">
        <a class="go lab-stretch" :href="post.url" target="_blank" rel="noopener" data-cursor-label="Read">
          Read on Medium <span aria-hidden="true">↗</span><span class="sr-only">: {{ post.title }} (opens in a new tab)</span>
        </a>
        <a
          v-if="post.related" class="rel lab-above" :href="post.related.url" target="_blank" rel="noopener"
          data-cursor-label="Open ↗"
        >
          {{ post.related.label }} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { MediumPost } from '~/data/writing'

withDefaults(defineProps<{ post: MediumPost; heading?: 'h2' | 'h3' }>(), { heading: 'h3' })
const broken = ref(false)
</script>

<style scoped>
.mc { display: flex; flex-direction: column; min-width: 0; height: 100%; overflow: hidden; }
.cover { aspect-ratio: 16 / 9; overflow: hidden; border-bottom: 1px solid var(--border); background: var(--muted); } /* taste-skill-ignore: keeps the picture's edge visible */
.cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 900ms var(--ease-out);
}
.mc:hover .cover img { transform: scale(1.03); }
/* No cover: a quiet dot pattern in the card's own neutrals. */
.placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  background-color: var(--muted);
  background-image: radial-gradient(var(--border-strong) 1px, transparent 1.4px); /* taste-skill-ignore: a dot pattern standing in for a missing cover */
  background-size: 14px 14px;
}

.body { display: flex; flex-direction: column; flex: 1; padding: var(--s-5); }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2) var(--s-3); }
.topic {
  padding: 3px 9px;
  border-radius: 6px;
  background: var(--muted);
  color: var(--muted-foreground);
  font-size: 13px;
}
.read { font-size: 13px; color: var(--muted-foreground); }
.t {
  margin-top: var(--s-4);
  font: 600 20px / 1.3 var(--font-text);
  letter-spacing: -0.01em;
  text-wrap: pretty;
}
.ex { margin-top: var(--s-3); font-size: 16px; color: var(--muted-foreground); }
.spacer { flex: 1; min-height: var(--s-5); }
.foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--s-2) var(--s-4); padding-top: var(--s-4); }
.go, .rel { font-size: 15px; font-weight: 500; }
.go { color: var(--foreground); text-decoration: underline; text-underline-offset: 0.3em; text-decoration-color: transparent; transition: text-decoration-color var(--dur-hover) ease; }
.rel { color: var(--muted-foreground); text-decoration: underline; text-underline-offset: 0.25em; text-decoration-color: var(--border-strong); }
.rel:hover { color: var(--primary); }
.mc:hover .go { text-decoration-color: var(--primary); }

@media (prefers-reduced-motion: reduce) {
  .cover img { transition: none; }
  .mc:hover .cover img { transform: none; }
}
</style>
