<template>
  <span class="cover" :style="{ '--tint': book.tint }">
    <img v-if="book.cover && !broken" :src="book.cover" :alt="alt ? `Cover of ${book.title}` : ''"
      :loading="eager ? 'eager' : 'lazy'" decoding="async" referrerpolicy="no-referrer" @error="broken = true">
    <!-- No picture (or it failed): the cover is set from the book itself. -->
    <span v-else class="drawn" :aria-label="alt ? `Cover of ${book.title}` : undefined" :role="alt ? 'img' : undefined">
      <span class="d-title">{{ book.title }}</span>
      <span class="d-author">{{ book.author }}</span>
    </span>
    <span class="spine" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import type { Book } from '~/data/books'

// A book's cover as an object: 2:3, slightly rounded, with the fold of the spine on its left edge.
withDefaults(defineProps<{ book: Book; eager?: boolean; alt?: boolean }>(), { eager: false, alt: true })
const broken = ref(false)
</script>

<style scoped>
.cover {
  position: relative;
  display: block;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 4px 6px 6px 4px;
  background: var(--tint);
  box-shadow: 0 18px 30px -18px rgb(0 0 0 / 0.7), 0 2px 6px rgb(0 0 0 / 0.25);
  /* taste-skill-ignore: a book is an object that stands off the shelf */
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 14% 12% 12%;
  color: #f6efe3;
  font-family: 'Charter', 'Bitstream Charter', 'Iowan Old Style', Georgia, serif;
}

.d-title {
  font-size: clamp(15px, 1.2vw + 8px, 22px);
  font-weight: 700;
  line-height: 1.08;
  text-wrap: balance;
}

.d-author {
  font-size: 12px;
  letter-spacing: 0.04em;
  opacity: 0.85;
}

/* The fold where the cover meets the spine. */
.spine {
  position: absolute;
  inset: 0 auto 0 0;
  width: 7%;
  background: linear-gradient(90deg, rgb(0 0 0 / 0.28), rgb(255 255 255 / 0.14) 55%, rgb(0 0 0 / 0.06));
  /* taste-skill-ignore: the light on a book's spine */
  pointer-events: none;
}
</style>