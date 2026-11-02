<template>
  <section id="writing" v-reveal class="writing" aria-labelledby="writing-h">
    <h2 id="writing-h" class="lab-heading" data-reveal>Writing & engineering notes</h2>
    <div class="cols">
      <div class="col" data-reveal>
        <h3 class="g-name">On Medium</h3>
        <ul>
          <li v-for="a in articles" :key="a.url">
            <a :href="a.url" target="_blank" rel="noopener">
              <span class="dot" aria-hidden="true" />
              <span class="t">{{ a.title }}</span>
              <time class="v lab-num" :datetime="a.date">{{ short(a.date) }}</time>
            </a>
          </li>
        </ul>
        <p class="more"><a class="lab-link" :href="CONTACT.medium" target="_blank" rel="noopener">Everything on Medium</a></p>
      </div>
      <div class="col" data-reveal>
        <h3 class="g-name">On this site</h3>
        <ul>
          <li v-for="p in posts" :key="p.slug">
            <NuxtLink :to="`/onTheWayToBeCreative/${p.slug}`">
              <span class="dot local" aria-hidden="true" />
              <span class="t">{{ p.title }}</span>
              <time class="v lab-num" :datetime="p.date">{{ short(p.date) }}</time>
            </NuxtLink>
          </li>
        </ul>
        <p class="more"><NuxtLink class="lab-link" to="/onTheWayToBeCreative">All notes</NuxtLink></p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ARTICLES, CONTACT } from '~/data/portfolio'

const { data } = await useFetch('/api/writing', { default: () => ({ source: 'saved' as const, articles: ARTICLES }) })
const articles = computed(() => data.value.articles.slice(0, 10))
const posts = useBlog().getAllPosts().slice(0, 6)

const short = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
</script>

<style scoped>
.writing { padding: var(--section-gap) var(--margin) 0 var(--line); }
.cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 560px));
  gap: 40px clamp(48px, 6vw, 96px);
  margin-top: 40px;
}
.g-name {
  font: 600 16px var(--font-text);
  letter-spacing: 0;
  color: var(--muted);
  margin-bottom: 10px;
}
ul { list-style: none; margin: 0; padding: 0; }
li a {
  display: grid;
  grid-template-columns: 16px 1fr auto;
  align-items: baseline;
  gap: 10px 12px;
  min-height: 36px;
  padding: 7px 0;
  box-sizing: border-box;
  text-decoration: none;
  color: var(--ink);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--muted);
  align-self: center;
  justify-self: center;
  transition: background-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}
.dot.local { background: var(--ink); }
.t { font-size: 16px; line-height: 1.4; }
.v { font-size: var(--step-small); color: var(--muted); white-space: nowrap; }
li a:hover .t { color: var(--accent); }
li a:hover .dot { background: var(--accent); transform: scale(1.3); }
.more { margin-top: 20px; font-size: 16px; }

@media (max-width: 1099px) {
  .writing { padding-left: var(--margin); }
  .cols { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  li a { grid-template-columns: 16px 1fr; min-height: 44px; }
  .v { grid-column: 2; }
}
</style>
