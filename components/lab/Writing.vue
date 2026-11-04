<template>
  <section id="writing" v-reveal class="lab-section lab-wrap" aria-labelledby="writing-h">
    <div class="lab-head">
      <h2 id="writing-h" data-reveal>Writing & engineering notes</h2>
      <p data-reveal>
        Notes from the work: .NET performance, databases, local models and the habits that keep systems readable.
        Published on Medium, with older notes kept on this site.
      </p>
    </div>

    <ul class="cards">
      <li v-for="post in latest" :key="post.url" data-reveal>
        <LabMediumCard :post="post" />
      </li>
    </ul>

    <div class="links" data-reveal>
      <NuxtLink class="all" to="/onTheWayToBeCreative" data-cursor-label="View">
        See all writing <span aria-hidden="true">→</span>
      </NuxtLink>
      <a class="lab-link" :href="MEDIUM_PROFILE" target="_blank" rel="noopener" data-cursor-label="Open ↗">
        Everything on Medium <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MEDIUM_PROFILE } from '~/data/writing'

// The latest three Medium posts; the writing page holds the rest and the notes kept on this site.
const { data } = await useWriting()
const latest = computed(() => (data.value?.posts ?? []).slice(0, 3))
</script>

<style scoped>
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap);
}
.cards > li { min-width: 0; }
.links { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-4) var(--s-6); margin-top: var(--s-7); font-size: 16px; }
.all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--mint);
  font: 500 13px / 1 var(--font-mono); /* taste-skill-ignore: PIPILIKA sets labels in mono (brand) */
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
}
.all:hover { text-decoration: underline; text-underline-offset: 0.35em; }

@media (max-width: 1099px) {
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 639px) {
  .cards { grid-template-columns: 1fr; }
}
</style>
