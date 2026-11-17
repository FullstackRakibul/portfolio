<template>
  <section class="agora" aria-label="A thought from the agora">
    <picture class="art">
      <source media="(max-width: 699px)" :srcset="ART.phone" type="assets/img/geekself.jpg" />
      <img :src="ART.full" alt="A philosopher in a chiton works on a laptop beneath a tree, among ancient ruins"
        loading="lazy" decoding="async" />
    </picture>

    <div class="lab-wrap body">
      <div class="said" aria-live="polite">
        <Transition name="q" mode="out-in">
          <figure :key="i" class="quote">
            <p class="greek" lang="grc">{{ q.greek }}</p>
            <blockquote class="english" lang="en">
              <p>{{ q.english }}</p>
            </blockquote>
            <figcaption class="who"><strong>{{ q.who }}</strong>, {{ q.source }}</figcaption>
          </figure>
        </Transition>
      </div>
      <button type="button" class="next" data-cursor-label="Next" @click="next">
        <RotateCw :size="16" aria-hidden="true" />
        <span>Another thought</span>
        <span class="lab-mono count" aria-hidden="true">{{ i + 1 }}/{{ QUOTES.length }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RotateCw } from 'lucide-vue-next'
import { QUOTES } from '~/data/portfolio'

// One quote at a time; the visitor turns the page, nothing turns by itself.
// Served as-is from public/ (bound, so Vite doesn't try to bundle them).
const ART = { full: 'assets/img/geekself.jpg', phone: 'assets/img/geekself.jpg' }
const i = ref(0)
const q = computed(() => QUOTES[i.value]!)
const next = () => { i.value = (i.value + 1) % QUOTES.length }
</script>

<style scoped>
.agora {
  position: relative;
  display: flex;
  align-items: center;
  min-height: clamp(380px, 36vw, 500px);
  margin-top: clamp(48px, 6vw, 88px);
  isolation: isolate;
}

/* The painting. Its filter comes from Footer.vue (--agora-filter), one value per theme, livelier on hover/focus. */
.art {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.art img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 78% 30%;
  filter: var(--agora-filter);
  transition: filter 1.2s ease;
}

/* Washes: the quote side always reads, and the band melts into the footer top and bottom. */
.agora::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(180deg, var(--background-deep) 0%, transparent 18%, transparent 80%, var(--background-deep) 100%), /* taste-skill-ignore: scrim over the painting */
    linear-gradient(90deg, var(--background-deep) 0%, color-mix(in srgb, var(--background-deep) 88%, transparent) 30%, transparent 62%); /* taste-skill-ignore: scrim over the painting */
}

.body {
  padding-block: var(--s-8);
}

.said {
  max-width: min(560px, 52%);
}

.quote {
  margin: 0;
}

.greek {
  font: 400 clamp(18px, 1.7vw, 22px) / 1.35 var(--font-greek);
  color: var(--muted-foreground);
}

.english {
  margin: var(--s-3) 0 0;
}

.english p {
  /* two lines reserved, so short quotes don't make the button jump */
  display: flex;
  align-items: flex-end;
  min-height: calc(2 * 1.12em);
  font: 400 clamp(28px, 3.1vw, 44px) / 1.12 var(--font-greek);
  color: var(--foreground);
  text-wrap: balance;
}

.who {
  margin-top: var(--s-4);
  font-size: 15px;
  color: var(--muted-foreground);
}

.who strong {
  color: var(--foreground);
  font-weight: 600;
}

.next {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  min-height: 44px;
  margin-top: var(--s-6);
  padding: 0 var(--s-4);
  border: 1px solid var(--border); /* taste-skill-ignore: outline button */
  border-radius: var(--radius);
  background: transparent;
  color: var(--foreground);
  font: 500 var(--step-small) / 1 var(--font-text);
  cursor: pointer;
  transition: border-color var(--dur-hover) ease;
}

.next:hover {
  border-color: var(--ring);
}

.next svg {
  transition: transform var(--dur-move) ease;
}

.next:hover svg {
  transform: rotate(90deg);
}

.count {
  font-variant-numeric: tabular-nums;
  margin-left: var(--s-1);
}

.q-enter-active,
.q-leave-active {
  transition: opacity 350ms ease, transform 350ms ease;
}

.q-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.q-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {

  .art img,
  .next svg,
  .q-enter-active,
  .q-leave-active {
    transition: none;
  }
}

/* Phones: the painting becomes its own band, the quote sits below it, full width. */
@media (max-width: 699px) {
  .agora {
    display: block;
    min-height: 0;
  }

  .agora::before {
    display: none;
  }

  .art {
    position: relative;
    height: 280px;
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 74%, transparent 100%); /* taste-skill-ignore: fade mask on the painting */
    mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 74%, transparent 100%); /* taste-skill-ignore: fade mask on the painting */
  }

  .art img {
    object-position: 82% 28%;
  }

  .body {
    padding-block: var(--s-5) 0;
  }

  .said {
    max-width: none;
  }
}
</style>