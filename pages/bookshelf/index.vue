<template>
  <div class="bookshelf">
    <LabPageHeader eyebrow="Library" title="Bookshelf"
      intro="Classics to read right here, in a reader that remembers your page and goes easy on your eyes."
      :pill="`${books.length} books · ${categories.length} shelves`" />

    <div class="lab-wrap">
      <BookToolbar v-model:query="query" v-model:filter="filter" v-model:sort="sort" />

      <!-- Searching or filtering: one set of results. -->
      <section v-if="narrowing" class="results" aria-labelledby="res-h">
        <h2 id="res-h" class="res-h" aria-live="polite">{{ resultsTitle }}</h2>
        <BookGrid v-if="results.length" :books="results" :view="view" />
        <LabEmpty v-else-if="filter === 'want' && !query.trim()" label="Want to Read" title="Nothing saved for later yet"
          text="Tap the bookmark under any book to keep it here.">
          <UiButton variant="outline" @click="clear">Browse the library</UiButton>
        </LabEmpty>
        <LabEmpty v-else label="No match" :title="query.trim() ? `No books match “${query.trim()}”` : 'No books here yet'"
          :text="query.trim() ? 'Try a title, an author or a shelf, like “Tolstoy” or “poetry”.' : 'Open a book and it will show up here.'">
          <UiButton variant="outline" @click="clear">Show all books</UiButton>
        </LabEmpty>
      </section>

      <!-- Browsing: Read Now, Want to Read, a shelf per category, then everything. -->
      <template v-else>
        <section class="block first" aria-labelledby="now-section">
          <h2 id="now-section" class="sr-only">Read now</h2>
          <BookNow v-if="hero" :book="hero" />
          <BookRow v-if="recentBooks.length" class="after-now" title="Recently opened" :books="recentBooks" />
        </section>

        <div class="block">
          <BookRow title="Want to Read" :books="wantBooks" :to="wantBooks.length ? '/bookshelf?filter=want' : undefined">
            <template #empty>
              <p class="slot-empty">Nothing here yet. Tap the bookmark under a book to save it for later.</p>
            </template>
          </BookRow>
        </div>

        <section class="block" aria-labelledby="browse-h">
          <h2 id="browse-h" class="lab-heading section-h">Browse by shelf</h2>
          <BookRow v-for="c in shelves" :key="c.id" :title="c.name" :description="c.description" :books="c.books"
            :to="`/bookshelf/category/${c.id}`" />
        </section>

        <section class="block" aria-labelledby="all-h">
          <h2 id="all-h" class="lab-heading section-h">All books <span class="count lab-num">{{ books.length }}</span></h2>
          <BookGrid :books="sorted(books)" :view="view" />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { books, categories, booksIn, findBook } from '~/data/books'

const { lastOpened, recent, want, view } = useReading()
const { query, filter, sort, narrowing, results, sorted, clear } = useLibrary()
const covers = useCovers()

// The book in hand first; with none, the featured one.
const hero = computed(() => (lastOpened.value && findBook(lastOpened.value)) || books.find(b => b.featured) || books[0])
const recentBooks = computed(() => recent.value.map(s => findBook(s)).filter(b => !!b && b.slug !== hero.value?.slug).slice(0, 6) as typeof books)
const wantBooks = computed(() => want.value.map(s => findBook(s)).filter(Boolean) as typeof books)
const shelves = categories.map(c => ({ ...c, books: booksIn(c.id) })).filter(c => c.books.length)

const resultsTitle = computed(() => {
  const n = results.value.length
  const what = { all: 'books', progress: 'in progress', finished: 'finished', want: 'in Want to Read' }[filter.value]
  const q = query.value.trim()
  return `${n} ${filter.value === 'all' ? (n === 1 ? 'book' : 'books') : what}${q ? ` for “${q}”` : ''}`
})

// Back from the reader: focus returns to the book that was open.
const returnTo = useState<string>('bookshelf-return', () => '')
onMounted(async () => {
  covers.loadAll()
  const slug = returnTo.value
  if (!slug) return
  returnTo.value = ''
  await nextTick()
  document.querySelector<HTMLElement>(`[data-book="${slug}"] a`)?.focus({ preventScroll: true })
})

useHead({
  title: 'Bookshelf',
  meta: [{ name: 'description', content: 'A library of classics, readable in the browser with a reader that remembers your page and goes easy on your eyes.' }],
})
</script>

<style scoped>
.bookshelf { padding-bottom: var(--section-gap); }
.block { margin-top: clamp(56px, 7vw, 104px); }
.block.first { margin-top: var(--s-6); }
.results { margin-top: var(--s-6); }
.res-h {
  margin-bottom: var(--s-6);
  font-size: clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem);
  letter-spacing: -0.02em;
}
.after-now { margin-top: var(--s-8); }
.section-h { margin-bottom: var(--s-7); }
.count { font-size: 0.5em; font-weight: 500; letter-spacing: 0; color: var(--muted-foreground); vertical-align: middle; }

/* An empty shelf keeps its heading and says what would fill it. */
.slot-empty {
  margin-top: var(--s-5);
  padding: var(--s-5);
  border: 1px dashed var(--border-strong); /* taste-skill-ignore: an empty slot (app-screen empty state) */
  border-radius: var(--radius);
  color: var(--muted-foreground);
  font-size: 15px;
}
</style>
