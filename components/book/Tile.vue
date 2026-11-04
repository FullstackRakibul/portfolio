<template>
  <NuxtLink :to="`/bookshelf/${book.slug}`" class="tile" :aria-label="`${verb} ${book.title} by ${book.author}`"
    data-cursor-label="Read">
    <span class="lift">
      <BookCover :book="book" :alt="false" />
    </span>
    <span class="t">{{ book.title }}</span>
    <span class="a">{{ book.author }}</span>
    <span v-if="done" class="state">Finished</span>
    <span v-else-if="f > 0" class="state">
      <span class="bar" aria-hidden="true"><span :style="{ width: `${Math.max(4, f * 100)}%` }" /></span>
      <span class="lab-num">{{ Math.round(f * 100) }}%</span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Book } from '~/data/books'

// One book on the shelf: its cover, its title and author, and how far this reader has got.
const props = defineProps<{ book: Book }>()
const { progress, fraction } = useReading()
const f = computed(() => fraction(props.book.slug))
const done = computed(() => {
  const p = progress.value[props.book.slug]
  return !!p && p.page >= p.pages
})
const verb = computed(() => (done.value ? 'Read again' : f.value > 0 ? 'Continue' : 'Read'))
</script>

<style scoped>
.tile {
  display: grid;
  align-content: start;
  gap: 2px;
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
  .tile:hover .lift {
    transform: translateY(-6px) rotate(-0.6deg);
  }

  .tile:hover .t {
    color: var(--mint);
  }
}

.tile:active .lift {
  transform: scale(0.97);
  transition-duration: var(--dur-press);
}

.tile:focus-visible {
  outline: none;
}

.tile:focus-visible .lift {
  outline: 2px solid var(--mint);
  outline-offset: 4px;
  border-radius: 6px;
}

.t {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  transition: color var(--dur-hover) ease;
}

.a {
  font-size: 14px;
  color: var(--muted);
}

.state {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
  color: var(--mint);
}

.bar {
  flex: 1;
  max-width: 96px;
  height: 4px;
  border-radius: 999px;
  background: var(--surface-3);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--mint);
}

@media (prefers-reduced-motion: reduce) {
  .lift {
    transition: none;
  }

  .tile:hover .lift {
    transform: none;
  }
}
</style>