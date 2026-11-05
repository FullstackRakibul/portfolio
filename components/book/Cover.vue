<template>
  <span class="cover" :style="{ '--tint': book.tint }" :data-len="len">
    <img v-if="src && !broken" :src="src" :alt="alt ? `Cover of ${book.title}` : ''" :loading="eager ? 'eager' : 'lazy'"
      decoding="async" referrerpolicy="no-referrer" @error="broken = true">
    <!-- No picture (or it failed): a cover set in type from the book itself. -->
    <span v-else class="drawn" :aria-label="alt ? `Cover of ${book.title}` : undefined" :role="alt ? 'img' : undefined">
      <span class="d-title">{{ book.title }}</span>
      <span class="d-foot">
        <span class="d-author">{{ book.author }}</span>
        <span v-if="book.year" class="d-year">{{ book.year }}</span>
      </span>
    </span>
    <span class="spine" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import type { Book } from '~/data/books'

// A book's cover as an object: 2:3, slightly rounded, with the fold of the spine on its left edge.
// Its own picture if it has one; else page 1, once this reader has opened the book; else set in type.
const props = withDefaults(defineProps<{ book: Book; eager?: boolean; alt?: boolean }>(), { eager: false, alt: true })
const { urls } = useCovers()
const broken = ref(false)
const src = computed(() => props.book.cover ?? urls.value[props.book.slug])
watch(src, () => { broken.value = false })
// Long titles step down in size so every title fits the cover.
const len = computed(() => { const n = props.book.title.length; return n <= 10 ? 's' : n <= 22 ? 'm' : 'l' })
</script>

<style scoped>
.cover {
  position: relative;
  display: block;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  container-type: inline-size;
  border-radius: 4px 6px 6px 4px;
  background: var(--tint);
  box-shadow: 0 18px 30px -18px rgb(0 0 0 / 0.7), 0 2px 6px rgb(0 0 0 / 0.25); /* taste-skill-ignore: a book is an object that stands off the shelf */
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  background: #fbfaf7;
}

/* The set cover: the title large on the cover's colour, the author on a darker band at the foot. */
.drawn {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  color: #f6efe3;
  font-family: 'Charter', 'Bitstream Charter', 'Iowan Old Style', Georgia, serif;
}

.d-title {
  align-self: start;
  padding: 16cqi 12cqi 0 14cqi;
  font-size: 15cqi;
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.01em;
  text-wrap: balance;
  overflow-wrap: break-word;
  hyphens: auto;
}

[data-len="m"] .d-title { font-size: 12.5cqi; }
[data-len="l"] .d-title { font-size: 10.5cqi; }

.d-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6cqi;
  padding: 7cqi 10cqi 8cqi 14cqi;
  background: color-mix(in srgb, var(--tint) 62%, #000);
  font-size: max(11px, 7.2cqi);
  line-height: 1.2;
}

.d-author { min-width: 0; opacity: 0.92; }
.d-year { flex: none; opacity: 0.6; font-variant-numeric: tabular-nums; }

/* The fold where the cover meets the spine. */
.spine {
  position: absolute;
  inset: 0 auto 0 0;
  width: 7%;
  background: linear-gradient(90deg, rgb(0 0 0 / 0.28), rgb(255 255 255 / 0.14) 55%, rgb(0 0 0 / 0.06)); /* taste-skill-ignore: the light on a book's spine */
  pointer-events: none;
}
</style>
