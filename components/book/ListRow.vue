<template>
  <li class="lr" :data-book="book.slug">
    <NuxtLink :to="to" class="cv" tabindex="-1" aria-hidden="true"><BookCover :book="book" :alt="false" /></NuxtLink>
    <div class="main">
      <p class="t"><NuxtLink :to="to" class="open">{{ book.title }}</NuxtLink></p>
      <p class="a">{{ book.author }}<template v-if="book.year"> · {{ book.year }}</template><template v-if="book.pagesHint"> · {{ book.pagesHint.toLocaleString('en') }} pages</template></p>
      <ul class="lab-tags cats" aria-label="Categories">
        <li v-for="c in categoryNames(book)" :key="c">{{ c }}</li>
      </ul>
    </div>
    <div class="prog lab-num" :aria-label="progressLabel">
      <template v-if="done">Finished</template>
      <template v-else-if="f > 0">
        <span class="bar" aria-hidden="true"><span :style="{ width: `${Math.max(4, f * 100)}%` }" /></span>
        {{ Math.round(f * 100) }}%
      </template>
      <span v-else class="none">Not started</span>
    </div>
    <div class="acts">
      <BookWant :book="book" />
      <UiButton size="sm" :variant="f > 0 && !done ? 'default' : 'outline'" :to="to" :aria-label="`${verb} ${book.title}`">{{ verb }}</UiButton>
    </div>
  </li>
</template>

<script setup lang="ts">
import { categoryNames, type Book } from '~/data/books'

// A book in list view: cover, title, author, categories, progress, Want to Read and a Read button.
const props = defineProps<{ book: Book }>()
const { fraction, isDone } = useReading()
const to = computed(() => `/bookshelf/${props.book.slug}`)
const f = computed(() => fraction(props.book.slug))
const done = computed(() => isDone(props.book.slug))
const verb = computed(() => (done.value ? 'Read again' : f.value > 0 ? 'Continue' : 'Read'))
const progressLabel = computed(() => (done.value ? 'Finished' : f.value > 0 ? `${Math.round(f.value * 100)}% read` : 'Not started'))
</script>

<style scoped>
.lr {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 140px auto;
  align-items: center;
  gap: var(--s-5);
  padding: var(--s-4) 0;
  border-top: 1px solid var(--border); /* taste-skill-ignore: list row rule (app-screen rows) */
}
.lr:last-child { border-bottom: 1px solid var(--border); } /* taste-skill-ignore: list row rule (app-screen rows) */

.cv { display: block; }
.main { min-width: 0; }
.t { font: 600 16px / 1.3 var(--font-text); color: var(--foreground); }
.open { color: inherit; text-decoration: none; }
.open::after { content: ''; position: absolute; inset: 0; }
.lr { position: relative; }
.open:focus-visible { outline: none; }
.lr:has(.open:focus-visible) { outline: 2px solid var(--ring); outline-offset: 2px; border-radius: var(--radius); }
.a { margin-top: 2px; font-size: 14px; color: var(--muted-foreground); }
.cats { margin-top: 8px; }

.prog { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted-foreground); }
.none { color: var(--muted-foreground); }
.bar { flex: 0 0 64px; height: 4px; border-radius: 999px; background: var(--border-strong); overflow: hidden; }
.bar span { display: block; height: 100%; border-radius: inherit; background: var(--foreground); }

.acts { position: relative; z-index: 1; display: flex; align-items: center; gap: var(--s-2); }

@media (hover: hover) and (pointer: fine) {
  .lr:has(.open:hover) .t { color: var(--primary); }
}

/* Phone: two lines beside the cover; progress joins the second line, the actions stay at the right. */
@media (max-width: 719px) {
  .lr { grid-template-columns: 48px minmax(0, 1fr) auto; gap: var(--s-3) var(--s-4); }
  .prog { grid-column: 2; grid-row: 2; }
  .cats { display: none; }
  .acts { grid-column: 3; grid-row: 1 / span 2; flex-direction: column-reverse; align-items: end; }
  .cv { grid-row: 1 / span 2; align-self: start; }
}
</style>
