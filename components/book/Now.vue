<template>
  <section class="now lab-card" aria-labelledby="now-h">
    <NuxtLink :to="to" class="cover-link" tabindex="-1" aria-hidden="true">
      <BookCover :book="book" eager :alt="false" />
    </NuxtLink>
    <div class="body">
      <h2 id="now-h">{{ started ? 'Continue reading' : 'Start with this one' }}</h2>
      <p class="title">{{ book.title }}</p>
      <p class="by">{{ book.author }}<template v-if="book.year"> · {{ book.year }}</template><template v-if="book.pagesHint"> · {{ book.pagesHint.toLocaleString('en') }} pages</template></p>
      <p v-if="book.description" class="blurb">{{ book.description }}</p>

      <div v-if="started" class="prog">
        <span class="bar" aria-hidden="true"><span :style="{ width: `${Math.max(3, f * 100)}%` }" /></span>
        <span class="lab-num">Page {{ p!.page.toLocaleString('en') }} of {{ p!.pages.toLocaleString('en') }} · {{ Math.round(f * 100) }}%</span>
      </div>

      <div class="acts">
        <UiButton size="lg" :to="to" data-cursor-label="Read">
          {{ started ? 'Continue' : 'Start reading' }}
          <template #icon><ArrowRight aria-hidden="true" /></template>
        </UiButton>
        <BookWant :book="book" label class="want-lg" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { Book } from '~/data/books'

// The first thing on the shelf, as in a book app's "Read Now": the book in hand, or one to begin with.
const props = defineProps<{ book: Book }>()
const { progress, fraction } = useReading()
const to = computed(() => `/bookshelf/${props.book.slug}`)
const p = computed(() => progress.value[props.book.slug])
const started = computed(() => !!p.value && p.value.page > 1)
const f = computed(() => fraction(props.book.slug))
</script>

<style scoped>
/* The book in hand, on a neutral card: the cover carries the colour, the card stays quiet. */
.now {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: clamp(28px, 5vw, 80px);
  align-items: center;
  padding: clamp(28px, 5vw, 72px);
}

.cover-link {
  display: block;
  max-width: 300px;
  width: 100%;
  justify-self: center;
  transform: rotate(-2deg);
  transition: transform var(--dur-move) var(--ease-out);
}

/* taste-skill-ignore: the book held up off the card */
.now:hover .cover-link {
  transform: rotate(0deg) translateY(-6px);
}

.body {
  max-width: 560px;
}

h2 {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.3;
  color: var(--muted-foreground);
}

.title {
  margin-top: var(--s-3);
  color: var(--foreground);
  font: 700 clamp(2rem, 1.2rem + 2.6vw, 3.5rem) / 1.02 'Charter', 'Bitstream Charter', 'Iowan Old Style', Georgia, serif;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

.by {
  margin-top: var(--s-3);
  font-size: 17px;
  color: var(--muted-foreground);
}

.blurb {
  margin-top: var(--s-5);
  font-size: var(--step-body);
  line-height: 1.55;
  max-width: 46ch;
}

.prog {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  margin-top: var(--s-5);
  font-size: 14px;
  color: var(--muted-foreground);
}

.bar {
  flex: 0 1 180px;
  height: 5px;
  border-radius: 999px;
  background: var(--muted);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--foreground);
}

.acts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
  margin-top: var(--s-6);
}

.acts :deep(.want-lg) { height: 44px; padding: 0 14px; }

@media (max-width: 719px) {
  .now {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .cover-link {
    max-width: 190px;
  }

  .body {
    justify-self: center;
  }

  .blurb {
    margin-inline: auto;
  }

  .prog,
  .acts {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cover-link {
    transition: none;
  }

  .now:hover .cover-link {
    transform: rotate(-2deg);
  }
}
</style>
