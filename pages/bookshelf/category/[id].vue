<template>
  <div class="cat">
    <template v-if="category">
      <LabPageHeader :title="category.name" :intro="category.description" size="detail"
        :back="{ to: '/bookshelf', label: 'Bookshelf' }" :pill="`${list.length} ${list.length === 1 ? 'book' : 'books'}`" />
      <div class="lab-wrap">
        <BookToolbar v-model:sort="sort" compact />
        <section class="all" :aria-label="`All books in ${category.name}`">
          <BookGrid :books="sorted(list)" :view="view" />
        </section>
        <nav class="others" aria-labelledby="others-h">
          <h2 id="others-h" class="others-h">Other shelves</h2>
          <ul class="lab-tags">
            <li v-for="c in others" :key="c.id"><NuxtLink :to="`/bookshelf/category/${c.id}`">{{ c.name }}</NuxtLink></li>
          </ul>
        </nav>
      </div>
    </template>
    <div v-else class="lab-wrap missing">
      <LabEmpty label="No such shelf" title="This shelf isn’t in the library" text="It may have been renamed, or the link is mistyped.">
        <UiButton to="/bookshelf">Back to the bookshelf</UiButton>
      </LabEmpty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categories, booksIn, findCategory } from '~/data/books'

// One shelf in full: /#/bookshelf/category/<id>, with its name, its line and every book on it.
const route = useRoute()
const { view } = useReading()
const { sort, sorted } = useLibrary()
const covers = useCovers()
const category = computed(() => findCategory(String(route.params.id)))
const list = computed(() => (category.value ? booksIn(category.value.id) : []))
const others = computed(() => categories.filter(c => c.id !== category.value?.id && booksIn(c.id).length))
onMounted(() => covers.loadAll())

// A shelf that doesn't exist is a real 404.
if (!category.value) throw createError({ statusCode: 404, statusMessage: 'Shelf not found' })
const c = category.value
const n = list.value.length
const shelf = `${c.description} ${n} ${n === 1 ? 'book' : 'books'} on this shelf of Rakibul H. Rabbi’s bookshelf`
usePageSeo({
  title: fitTitle(`${c.name} · Bookshelf`, c.name),
  description: fitDescription(
    `${shelf}, each free to read in your browser with a reader that remembers your page and keeps your bookmarks.`,
    `${shelf}, each free to read in your browser with a reader that remembers your page and bookmarks.`,
    `${shelf}, each free to read in your browser with a reader that remembers your page.`,
    `${shelf}, each free to read online with a reader that remembers your page.`,
    `${shelf}, each free to read in your browser.`,
    `${shelf}, each free to read online.`,
    `${shelf}.`,
  ),
  path: `/bookshelf/category/${c.id}`,
  ogLabel: `Bookshelf: ${c.name}`,
  crumbs: [{ name: 'Bookshelf', path: '/bookshelf' }, { name: c.name, path: `/bookshelf/category/${c.id}` }],
})
</script>

<style scoped>
.cat { padding-bottom: var(--section-gap); }
.all { margin-top: var(--s-6); }
.others { margin-top: var(--s-9); }
.others-h { margin-bottom: var(--s-4); font-size: 18px; letter-spacing: -0.01em; }
.others a { color: inherit; text-decoration: none; }
.others li { padding: 0; }
.others a { display: inline-block; padding: 8px 12px; border-radius: inherit; }
.others li:hover { color: var(--foreground); }
.missing { padding: calc(var(--header-h) + 96px) 0 96px; }
</style>
