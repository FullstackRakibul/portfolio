<template>
  <ul v-if="view === 'grid'" class="grid" role="list">
    <li v-for="b in books" :key="b.slug"><BookTile :book="b" /></li>
  </ul>
  <ul v-else class="list" role="list">
    <BookListRow v-for="b in books" :key="b.slug" :book="b" />
  </ul>
</template>

<script setup lang="ts">
import type { Book } from '~/data/books'

// A whole set of books: a grid of covers, or a list with the details.
defineProps<{ books: Book[]; view: 'grid' | 'list' }>()
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(132px, 13vw, 176px), 1fr));
  gap: var(--s-7) clamp(20px, 2.6vw, 40px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.list { margin: 0; padding: 0; list-style: none; }

@media (max-width: 639px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-6) var(--s-4); }
}
</style>
