<template>
  <section id="writing" v-reveal class="lab-section lab-wrap" aria-labelledby="writing-h">
    <div class="lab-head">
      <h2 id="writing-h" data-reveal>Writing & engineering notes</h2>
      <p data-reveal>
        Notes from the work: .NET performance, databases, local models and the habits that keep systems readable.
        Published on Medium, with older notes kept on this site.
      </p>
    </div>

    <div class="cols">
      <div class="col main" data-reveal>
        <h3>On Medium</h3>
        <ul>
          <li v-for="a in articles" :key="a.url">
            <a :href="a.url" target="_blank" rel="noopener" data-cursor-label="Open ↗">
              <time class="lab-num" :datetime="a.date">{{ short(a.date) }}</time>
              <span class="t">{{ a.title }}</span>
              <ArrowUpRight class="go" :size="18" aria-hidden="true" />
            </a>
          </li>
        </ul>
        <p class="more"><a class="lab-link" :href="CONTACT.medium" target="_blank" rel="noopener" data-cursor-label="Open ↗">Everything on Medium</a></p>
      </div>
      <div class="col side" data-reveal>
        <h3>On this site</h3>
        <ul>
          <li v-for="p in posts" :key="p.slug">
            <NuxtLink :to="`/onTheWayToBeCreative/${p.slug}`">
              <time class="lab-num" :datetime="p.date">{{ short(p.date) }}</time>
              <span class="t">{{ p.title }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p class="more"><NuxtLink class="lab-link" to="/onTheWayToBeCreative">All notes</NuxtLink></p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { ARTICLES, CONTACT } from '~/data/portfolio'

// The list is rendered into index.html at build time; reuse it when coming back to the home page
// (a static host has no /api/writing to ask again).
const { data } = await useFetch('/api/writing', {
  default: () => ({ source: 'saved' as const, articles: ARTICLES }),
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
})
const articles = computed(() => data.value.articles.slice(0, 10))
const posts = useBlog().getAllPosts().slice(0, 6)

const short = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
</script>

<style scoped>
.cols {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap);
  row-gap: var(--s-8);
}
.main { grid-column: 1 / span 6; }
.side { grid-column: 8 / -1; }
h3 { font: 600 var(--step-body) / 1.3 var(--font-text); letter-spacing: 0; margin-bottom: var(--s-3); }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
li a {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr) 20px;
  align-items: baseline;
  gap: var(--s-4);
  padding: 14px var(--s-4);
  margin: 0 calc(var(--s-4) * -1);
  color: var(--ink);
  text-decoration: none;
  transition: background-color var(--dur-hover) ease;
}
.side li a { grid-template-columns: 1fr; gap: 2px; }
time { font-size: var(--step-small); color: var(--muted); white-space: nowrap; }
.t { line-height: 1.4; transition: color var(--dur-hover) ease, transform var(--dur-move) var(--ease-out); }
.main .t { font-size: var(--step-body); }
.side .t { font-size: 16px; }
.go { align-self: center; color: var(--muted); opacity: 0; transform: translate(-6px, 6px); transition: opacity var(--dur-hover) ease, transform var(--dur-move) var(--ease-out); }
li a { border-radius: var(--radius-control); }
li a:hover { background: var(--surface-2); }
li a:hover .t { color: var(--accent); transform: translateX(4px); }
li a:hover .go { opacity: 1; transform: none; color: var(--accent); }
.more { margin-top: var(--s-5); font-size: 16px; }

@media (prefers-reduced-motion: reduce) {
  .t, .go { transition: color var(--dur-hover) ease; }
  li a:hover .t { transform: none; }
}
@media (max-width: 899px) {
  .main, .side { grid-column: 1 / -1; }
}
@media (max-width: 599px) {
  li a { grid-template-columns: 1fr; gap: 4px; }
  .go { display: none; }
}
</style>
