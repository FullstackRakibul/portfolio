<template>
  <button type="button" class="want" :aria-pressed="on"
    :aria-label="on ? `Remove ${book.title} from Want to Read` : `Add ${book.title} to Want to Read`"
    :title="on ? 'In Want to Read' : 'Want to Read'" @click.stop.prevent="toggleWant(book.slug)">
    <component :is="on ? BookmarkCheck : BookmarkPlus" :size="18" aria-hidden="true" />
    <span v-if="label" class="lbl">{{ on ? 'In Want to Read' : 'Want to Read' }}</span>
  </button>
</template>

<script setup lang="ts">
import { BookmarkPlus, BookmarkCheck } from 'lucide-vue-next'
import type { Book } from '~/data/books'

// "Want to Read": a bookmark on the book, kept in this reader's browser.
const props = defineProps<{ book: Book; label?: boolean }>()
const { wants, toggleWant } = useReading()
const on = computed(() => wants(props.book.slug))
</script>

<style scoped>
.want {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: none;
  min-width: 36px;
  height: 36px;
  padding: 0 9px;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--muted-foreground);
  font: 500 14px var(--font-text);
  cursor: pointer;
  transition: color var(--dur-hover) ease, background-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}

/* A 44px target around a 36px mark. */
.want::before { content: ''; position: absolute; inset: -4px; }
.want:active { transform: scale(0.92); }
.want[aria-pressed="true"] { color: var(--foreground); }
.want:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

@media (hover: hover) {
  .want:hover { background: var(--muted); color: var(--foreground); }
}
</style>
