<template>
  <!-- On <body>, above the site's floating widgets (they sit outside the page's stacking context). -->
  <Teleport v-if="book" to="body">
    <BookReader :book="book" @close="close" />
  </Teleport>
  <div v-else class="lab-wrap missing">
    <LabEmpty label="Not on the shelf" title="This book isn’t on the shelf"
      text="It may have been moved or the link is mistyped.">
      <NuxtLink class="lab-button" to="/bookshelf">Back to the bookshelf</NuxtLink>
    </LabEmpty>
  </div>
</template>

<script setup lang="ts">
import { findBook } from '~/data/books'

// The reader for one book: /#/bookshelf/<slug>. Closing returns to the shelf where the reader left it.
const route = useRoute()
const router = useRouter()
const book = computed(() => findBook(String(route.params.slug)))

function close() {
  if (window.history.state?.back) router.back()
  else router.push('/bookshelf')
}

useHead(() => ({
  title: book.value ? `${book.value.title} · Bookshelf` : 'Bookshelf',
  meta: [{ name: 'description', content: book.value ? `Read ${book.value.title} by ${book.value.author}.` : 'A book from the bookshelf.' }],
}))
</script>

<style scoped>
.missing {
  padding: calc(var(--header-h) + 96px) 0 96px;
}
</style>