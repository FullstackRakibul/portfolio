<template>
  <section class="shelf" :aria-labelledby="hid">
    <div class="head">
      <div class="words">
        <h2 :id="hid" class="h">{{ title }}</h2>
        <p v-if="description" class="d">{{ description }}</p>
      </div>
      <div class="tools">
        <template v-if="scrollable">
          <UiButton variant="ghost" size="icon" class="arrow" :aria-label="`Scroll ${title} back`" :disabled="atStart" @click="nudge(-1)">
            <ChevronLeft :size="18" aria-hidden="true" />
          </UiButton>
          <UiButton variant="ghost" size="icon" class="arrow" :aria-label="`Scroll ${title} on`" :disabled="atEnd" @click="nudge(1)">
            <ChevronRight :size="18" aria-hidden="true" />
          </UiButton>
        </template>
        <UiButton v-if="to" variant="link" size="sm" :to="to" :aria-label="`See all ${title}`">See all</UiButton>
      </div>
    </div>
    <slot v-if="!books.length" name="empty" />
    <ul v-else ref="strip" class="strip" role="list" @scroll.passive="measure">
      <li v-for="b in books" :key="b.slug"><BookTile :book="b" /></li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Book } from '~/data/books'

// One shelf, as in a book app: a heading, an optional line and "See all", and the books in a row
// that swipes on a phone and scrolls with the arrows on a desktop.
const props = defineProps<{ title: string; books: Book[]; description?: string; to?: string }>()
const hid = `row-${useId()}`
const strip = ref<HTMLElement | null>(null)
const scrollable = ref(false)
const atStart = ref(true)
const atEnd = ref(false)

function measure() {
  const el = strip.value
  if (!el) return
  scrollable.value = el.scrollWidth > el.clientWidth + 4
  atStart.value = el.scrollLeft < 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}
function nudge(d: 1 | -1) {
  const el = strip.value
  if (!el) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: d * el.clientWidth * 0.85, behavior: reduce ? 'instant' : 'smooth' })
}

let ro: ResizeObserver | null = null
onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (strip.value) ro.observe(strip.value)
})
watch(() => props.books.length, () => nextTick(measure))
onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
.shelf + .shelf { margin-top: var(--s-8); }

.head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--s-4);
}

.words { min-width: 0; }
.h {
  font-size: clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem);
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.d { margin-top: 6px; font-size: 16px; color: var(--muted-foreground); }
.tools { display: flex; align-items: center; gap: 2px; flex: none; }

/* The row: covers side by side, snapping, the scrollbar hidden (the arrows and a swipe move it). */
.strip {
  --w: clamp(132px, 12vw, 172px);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(--w);
  gap: clamp(20px, 2.2vw, 32px);
  margin: var(--s-5) 0 0;
  padding: 8px 0 var(--s-4);
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 0;
  scrollbar-width: none;
}
.strip::-webkit-scrollbar { display: none; }
.strip > li { scroll-snap-align: start; min-width: 0; }

/* A phone swipes: the row runs to the screen's edge, so the next cover peeks in. */
@media (max-width: 639px) {
  .strip { --w: 40vw; gap: var(--s-4); margin-inline: calc(-1 * var(--margin)); padding-inline: var(--margin); scroll-padding-inline: var(--margin); }
  .arrow { display: none; }
}
@media (pointer: coarse) {
  .arrow { display: none; }
}
</style>
