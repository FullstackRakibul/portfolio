<template>
  <article class="tile" :data-book="book.slug">
    <NuxtLink :to="`/bookshelf/${book.slug}`" class="open" :aria-label="`${verb} ${book.title} by ${book.author}`" data-cursor-label="Read">
      <span class="lift">
        <BookCover :book="book" :alt="false" />
      </span>
    </NuxtLink>
    <div class="meta">
      <div class="words">
        <p class="t">{{ book.title }}</p>
        <p class="a">{{ book.author }}</p>
      </div>
      <BookWant :book="book" />
    </div>
    <p v-if="done" class="state">Finished</p>
    <p v-else-if="f > 0" class="state">
      <span class="bar" aria-hidden="true"><span :style="{ width: `${Math.max(4, f * 100)}%` }" /></span>
      <span class="lab-num">{{ Math.round(f * 100) }}%</span>
    </p>
  </article>
</template>

<script setup lang="ts">
import type { Book } from '~/data/books'

// One book on the shelf: its cover (the link into the reader), title and author, a Want to Read
// bookmark, and how far this reader has got.
const props = defineProps<{ book: Book }>()
const { fraction, isDone } = useReading()
const f = computed(() => fraction(props.book.slug))
const done = computed(() => isDone(props.book.slug))
const verb = computed(() => (done.value ? 'Read again' : f.value > 0 ? 'Continue' : 'Read'))
</script>

<style scoped>
.tile {
  display: grid;
  align-content: start;
  min-width: 0;
}

.open {
  display: block;
  color: inherit;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.lift {
  display: block;
  margin-bottom: 12px;
  transition: transform var(--dur-move) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .open:hover .lift { transform: translateY(-6px) rotate(-0.6deg); }
  .tile:has(.open:hover) .t { color: var(--primary); }
}

.open:active .lift { transform: scale(0.97); transition-duration: var(--dur-press); }
.open:focus-visible { outline: none; }
.open:focus-visible .lift { outline: 2px solid var(--ring); outline-offset: 4px; border-radius: 6px; }

.meta { display: flex; align-items: flex-start; gap: 4px; }
.words { flex: 1; min-width: 0; }

.t {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  font: 600 16px / 1.3 var(--font-text);
  letter-spacing: 0;
  color: var(--foreground);
  transition: color var(--dur-hover) ease;
}

.a { margin-top: 2px; font-size: 14px; color: var(--muted-foreground); }
.meta :deep(.want) { margin: -6px -8px 0 0; }

.state {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.bar {
  flex: 1;
  max-width: 96px;
  height: 4px;
  border-radius: 999px;
  background: var(--border-strong);
  overflow: hidden;
}

.bar span { display: block; height: 100%; border-radius: inherit; background: var(--foreground); }

@media (prefers-reduced-motion: reduce) {
  .lift { transition: none; }
  .open:hover .lift { transform: none; }
}
</style>
