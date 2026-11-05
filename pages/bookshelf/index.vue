<template>
  <div class="bookshelf">
    <LabPageHeader eyebrow="Library" title="Bookshelf"
      intro="Stories I keep coming back to. Open one and read it right here, in a reader that remembers your page."
      :pill="`${books.length} ${books.length === 1 ? 'book' : 'books'}`" />

    <div class="lab-wrap">
      <div v-if="hero" v-reveal>
        <BookNow :book="hero" data-reveal />
      </div>

      <section v-reveal class="library" aria-labelledby="lib-h">
        <div class="lib-head" data-reveal>
          <h2 id="lib-h" class="lab-heading">The shelf</h2>
          <div class="search">
            <Search :size="18" aria-hidden="true" />
            <input v-model="query" type="search" placeholder="Title or author" aria-label="Search books"
              autocomplete="off">
          </div>
        </div>

        <div class="chips" role="group" aria-label="Filter by shelf" data-reveal>
          <UiButton v-for="g in ['All', ...genres]" :key="g" size="sm" :variant="genre === g ? 'default' : 'outline'"
            :aria-pressed="genre === g" @click="genre = g">{{ g }}</UiButton>
        </div>

        <template v-if="groups.length">
          <div v-for="g in groups" :key="g.name" class="shelf" data-reveal>
            <h3 class="shelf-h">{{ g.name }} <span class="lab-num">{{ g.books.length }}</span></h3>
            <ul class="row" role="list">
              <li v-for="b in g.books" :key="b.slug">
                <BookTile :book="b" />
              </li>
            </ul>
          </div>
        </template>

        <LabEmpty v-else label="No match" :title="`No books match “${query.trim()}”`"
          text="Try another title or author.">
          <UiButton variant="outline" @click="query = ''; genre = 'All'">Show all books</UiButton>
        </LabEmpty>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useReading } from '~/composables/useReading'
import { books, findBook } from '~/data/books'

const { lastOpened } = useReading()
const query = ref('')
const genre = ref('All')

// The book in hand first; with none, the featured one.
const hero = computed(() => (lastOpened.value && findBook(lastOpened.value)) || books.find(b => b.featured) || books[0])

const genres = [...new Set(books.map(b => b.genre))]

const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  const hits = books.filter(b =>
    (genre.value === 'All' || b.genre === genre.value)
    && (!q || `${b.title} ${b.author}`.toLowerCase().includes(q)))
  return genres
    .map(name => ({ name, books: hits.filter(b => b.genre === name) }))
    .filter(g => g.books.length)
})

useHead({
  title: 'Bookshelf',
  meta: [{ name: 'description', content: 'A small library of stories, readable right in the browser with a reader that remembers your page.' }],
})
</script>

<style scoped>
.bookshelf {
  padding-bottom: var(--section-gap);
}

.library {
  margin-top: clamp(72px, 9vw, 128px);
}

.lib-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--s-5) var(--s-6);
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 380px;
  color: var(--muted-foreground);
}

.search svg {
  position: absolute;
  left: 14px;
  pointer-events: none;
}

.search input {
  width: 100%;
  min-height: 40px;
  padding: 0 14px 0 42px;
  border: 1px solid var(--input); /* taste-skill-ignore: a real form field keeps its edge */
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font: 15px var(--font-text);
  transition: border-color var(--dur-hover) ease;
}

.search input::placeholder {
  color: var(--muted-foreground);
}

.search input:hover {
  border-color: var(--border-strong);
}

.search input:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  margin-top: var(--s-6);
}

.shelf {
  margin-top: var(--s-8);
}

.shelf-h {
  display: flex;
  align-items: baseline;
  gap: var(--s-3);
  font-size: clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem);
  letter-spacing: -0.02em;
}

.shelf-h span {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--muted-foreground);
}

/* A grid of covers on wide screens, a row to swipe through on a phone. */
.row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 13vw, 180px), 1fr));
  gap: var(--s-7) clamp(20px, 2.6vw, 40px);
  margin: var(--s-5) 0 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 639px) {
  .row {
    display: flex;
    gap: var(--s-5);
    margin-inline: calc(-1 * var(--margin));
    padding: var(--s-2) var(--margin) var(--s-4);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--margin);
    scrollbar-width: none;
  }

  .row::-webkit-scrollbar {
    display: none;
  }

  .row>li {
    flex: 0 0 42%;
    scroll-snap-align: start;
  }
}
</style>