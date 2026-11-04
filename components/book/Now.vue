<template>
  <section class="now" :style="{ '--tint': book.tint }" aria-labelledby="now-h">
    <NuxtLink :to="to" class="cover-link" tabindex="-1" aria-hidden="true">
      <BookCover :book="book" eager :alt="false" />
    </NuxtLink>
    <div class="body">
      <h2 id="now-h">{{ started ? 'Continue reading' : 'Start with this one' }}</h2>
      <p class="title">{{ book.title }}</p>
      <p class="by">{{ book.author }}<template v-if="book.year"> · {{ book.year }}</template></p>
      <p v-if="book.blurb" class="blurb">{{ book.blurb }}</p>

      <div v-if="started" class="prog">
        <span class="bar" aria-hidden="true"><span :style="{ width: `${Math.max(3, f * 100)}%` }" /></span>
        <span class="lab-num">Page {{ p!.page }} of {{ p!.pages }} · {{ Math.round(f * 100) }}%</span>
      </div>

      <div class="acts">
        <NuxtLink :to="to" class="lab-button" data-cursor-label="Read">
          {{ started ? 'Continue' : 'Start reading' }}
          <ArrowRight :size="18" aria-hidden="true" />
        </NuxtLink>
        <a v-if="book.pdf" :href="book.pdf" class="ghost" download>Download PDF</a>
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
/* A whole field in the book's own colour, deepened with the site's teal ground so it sits in either theme. */
.now {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: clamp(28px, 5vw, 80px);
  align-items: center;
  padding: clamp(28px, 5vw, 72px);
  border-radius: calc(var(--radius) + 8px);
  background: color-mix(in srgb, var(--tint) 80%, #0d2b30);
  color: #f6f1e8;
}

.cover-link {
  display: block;
  max-width: 300px;
  width: 100%;
  justify-self: center;
  transform: rotate(-2deg);
  transition: transform var(--dur-move) var(--ease-out);
}

.cover-link :deep(.cover) {
  box-shadow: 0 40px 60px -28px rgb(0 0 0 / 0.75), 0 4px 10px rgb(0 0 0 / 0.3);
}

/* taste-skill-ignore: the book held up off the field */
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
  color: rgb(246 241 232 / 0.78);
}

.title {
  margin-top: var(--s-3);
  font: 700 clamp(2rem, 1.2rem + 2.6vw, 3.5rem) / 1.02 'Charter', 'Bitstream Charter', 'Iowan Old Style', Georgia, serif;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

.by {
  margin-top: var(--s-3);
  font-size: 17px;
  color: rgb(246 241 232 / 0.82);
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
  color: rgb(246 241 232 / 0.85);
}

.bar {
  flex: 0 1 180px;
  height: 5px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.2);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #f6f1e8;
}

.acts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3) var(--s-5);
  margin-top: var(--s-6);
}

.acts .lab-button {
  background: #f6f1e8;
  color: #1b1712;
  box-shadow: none;
}

.acts .lab-button:hover {
  background: #fff;
}

.ghost {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: inherit;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  text-decoration-color: rgb(246 241 232 / 0.45);
}

.ghost:hover {
  text-decoration-color: currentColor;
}

.now :focus-visible {
  outline-color: #f6f1e8;
}

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