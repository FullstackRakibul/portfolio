<template>
  <div>
    <LabPageHeader
      eyebrow="On the way to be creative"
      title="onTheWayToBeCreative"
      intro="Thoughts on development, technology, and building great software"
      :pill="`${mediumPosts.length + allPosts.length} pieces`"
    />

    <!-- Medium -->
    <section v-reveal class="blk lab-wrap" aria-labelledby="medium-h">
      <div class="lab-head">
        <h2 id="medium-h" data-reveal>On Medium</h2>
        <p data-reveal>Notes from the work: .NET performance, databases, local models and the habits that keep systems readable. Newest first.</p>
      </div>
      <ul v-if="mediumPosts.length" class="cards">
        <li v-for="post in mediumPosts" :key="post.url" data-reveal>
          <LabMediumCard :post="post" />
        </li>
      </ul>
      <LabEmpty v-else title="No Medium posts to show" text="The feed could not be read; the posts are still on Medium." />
      <p class="more" data-reveal>
        <a class="lab-link" :href="MEDIUM_PROFILE" target="_blank" rel="noopener" data-cursor-label="Open ↗">
          Everything on Medium <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>

    <!-- Notes on this site -->
    <section v-reveal class="blk lab-wrap" aria-labelledby="site-h">
      <div class="lab-head">
        <h2 id="site-h" data-reveal>On this site</h2>
        <div class="search" data-reveal>
          <Search :size="18" aria-hidden="true" />
          <label for="note-q" class="sr-only">Search articles</label>
          <input id="note-q" v-model="searchQuery" type="search" placeholder="Search articles..." autocomplete="off">
        </div>
      </div>

      <div class="tabs" role="group" aria-label="Filter by category" data-reveal>
        <button type="button" :aria-pressed="selectedCategory === 'all'" @click="selectedCategory = 'all'">All Posts</button>
        <button
          v-for="category in categories" :key="category" type="button"
          :aria-pressed="selectedCategory === category" @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div v-if="!searchQuery && selectedCategory === 'all'" class="group">
        <h3 class="group-h">Featured Articles</h3>
        <ul class="cards cards--two">
          <li v-for="post in featuredPosts" :key="post.slug">
            <BlogCard
              :title="post.title" :excerpt="post.excerpt" :date="post.date" :read-time="post.readTime"
              :tags="post.tags" :slug="post.slug" :category="post.category" featured
            />
          </li>
        </ul>
      </div>

      <div class="group">
        <h3 class="group-h" aria-live="polite">{{ searchQuery ? `Search Results (${filteredPosts.length})` : 'All Articles' }}</h3>
        <ul v-if="filteredPosts.length > 0" class="cards">
          <li v-for="post in filteredPosts" :key="post.slug">
            <BlogCard
              :title="post.title" :excerpt="post.excerpt" :date="post.date" :read-time="post.readTime"
              :tags="post.tags" :slug="post.slug" :category="post.category"
            />
          </li>
        </ul>
        <LabEmpty v-else label="No match" title="No articles found" text="Try adjusting your search or filter criteria">
          <button type="button" class="reset" @click="searchQuery = ''; selectedCategory = 'all'">Show all articles</button>
        </LabEmpty>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { MEDIUM_PROFILE } from '~/data/writing'

const searchQuery = ref('')
const selectedCategory = ref('all')

const { getAllPosts, getFeaturedPosts, getPostsByCategory, searchPosts, getAllCategories } = useBlog()

const allPosts = getAllPosts()
const featuredPosts = getFeaturedPosts()
const categories = getAllCategories()

const { data: writing } = await useWriting()
const mediumPosts = computed(() => writing.value?.posts ?? [])

const filteredPosts = computed(() => {
  let posts = allPosts
  const q = searchQuery.value.trim()
  if (q) posts = searchPosts(q)
  if (selectedCategory.value !== 'all') {
    posts = getPostsByCategory(selectedCategory.value)
    if (q) {
      const found = searchPosts(q)
      posts = posts.filter(post => found.some(f => f.slug === post.slug))
    }
  }
  return posts
})

useHead({
  title: 'onTheWayToBeCreative - Rakibul H. Rabbi',
  meta: [
    { name: 'description', content: 'Read about software development, technology insights, and programming tutorials by Rakibul H. Rabbi.' },
  ],
})
</script>

<style scoped>
.blk + .blk { padding-top: var(--section-gap); }

/* Cards: three across on desktop, two on tablets, one on phones. */
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap);
}
.cards > li { min-width: 0; }
.cards--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.more { margin-top: var(--s-6); font-size: 16px; }

.search {
  grid-column: 8 / -1;
  position: relative;
  display: flex;
  align-items: center;
  color: var(--muted);
}
.search svg { position: absolute; left: 16px; pointer-events: none; }
.search input {
  width: 100%;
  min-height: 52px;
  padding: 0 16px 0 46px;
  border: 1px solid var(--line); /* taste-skill-ignore: a real form field keeps its edge */
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--ink);
  font: 16px var(--font-text);
  transition: border-color var(--dur-hover) ease;
}
.search input::placeholder { color: var(--muted); }
.search input:focus-visible { outline: 2px solid var(--mint); outline-offset: 2px; border-color: transparent; }

.tabs { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-bottom: var(--s-7); }
.tabs button,
.reset {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--line); /* taste-skill-ignore: PIPILIKA's control edge (brand) */
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--ink);
  font: 500 15px var(--font-text);
  cursor: pointer;
  transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease, color var(--dur-hover) ease;
}
.tabs button:hover,
.reset:hover { border-color: var(--mint); }
.tabs button[aria-pressed="true"] { background: var(--teal); border-color: var(--teal); color: #fff; }

.group + .group { margin-top: var(--s-8); }
.group .group-h { margin-bottom: var(--s-5); font: 600 var(--step-lead) / 1.2 var(--font-text); letter-spacing: -0.01em; }

@media (max-width: 1099px) {
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 899px) {
  .search { grid-column: 1; }
}
@media (max-width: 639px) {
  .cards, .cards--two { grid-template-columns: 1fr; }
}
</style>
