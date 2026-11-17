<template>
  <!-- On <body>, above the site's floating widgets (they sit outside the page's stacking context). -->
  <Teleport v-if="book" to="body">
    <BookReader :book="book" :start="start" @close="close" @page="onPage" />
  </Teleport>
  <div v-else class="lab-wrap missing">
    <LabEmpty label="Not on the shelf" title="This book isn’t on the shelf"
      text="It may have been moved or the link is mistyped.">
      <UiButton to="/bookshelf">Back to the bookshelf</UiButton>
    </LabEmpty>
  </div>
</template>

<script setup lang="ts">
import { findBook } from '~/data/books'

// The reader for one book: /#/bookshelf/<slug>, or /#/bookshelf/<slug>?page=N to open at a page (so a page
// can be shared). The address follows the reader's page. Closing returns to the shelf where they left it.
const route = useRoute()
const router = useRouter()
const book = computed(() => findBook(String(route.params.slug)))
const start = (() => {
  const n = Number(route.query.page)
  return Number.isInteger(n) && n > 0 ? n : undefined
})()

let timer = 0
function onPage(n: number) {
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    if (Number(route.query.page) !== n) router.replace({ query: { ...route.query, page: String(n) } })
  }, 400)
}

function close() {
  clearTimeout(timer)
  if (window.history.state?.back) router.back()
  else router.push('/bookshelf')
}

// A book that isn't on the shelf is a real 404, not an empty page with a 200.
if (!book.value) throw createError({ statusCode: 404, statusMessage: 'Book not found' })
const b = book.value
const read = `Read ${b.title} by ${b.author}${b.year ? ` (${b.year})` : ''} free in your browser on Rakibul H. Rabbi’s bookshelf`
usePageSeo({
  title: fitTitle(`${b.title} by ${b.author}`, b.title),
  description: fitDescription(
    `${read}, with a reader that remembers your page, keeps your bookmarks and goes easy on your eyes.`,
    `${read}, with a reader that remembers your page and goes easy on your eyes.`,
    `${read}, with a reader that remembers your page and bookmarks.`,
    `${read}, with a reader that remembers your page.`,
    `${read}.`,
  ),
  path: `/bookshelf/${b.slug}`,
  ogLabel: `${b.title}, ${b.author}`,
  crumbs: [{ name: 'Bookshelf', path: '/bookshelf' }, { name: b.title, path: `/bookshelf/${b.slug}` }],
})
</script>

<style scoped>
.missing {
  padding: calc(var(--header-h) + 96px) 0 96px;
}
</style>
