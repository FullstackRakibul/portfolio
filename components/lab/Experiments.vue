<template>
  <section id="experiments" v-reveal class="exp" aria-labelledby="exp-h">
    <div class="split">
      <div class="plate-col">
        <figure class="plate" aria-hidden="true">
          <template v-for="(e, i) in EXPERIMENTS" :key="e.id">
            <video
              v-if="e.image.video" ref="film" class="media film" :class="{ on: i === active }" :poster="e.image.src"
              :width="e.image.width" :height="e.image.height" muted loop playsinline preload="metadata"
            >
              <source :src="e.image.video" type="video/webm">
            </video>
            <img
              v-else class="media" :src="e.image.src" alt="" :width="e.image.width" :height="e.image.height"
              loading="lazy" decoding="async" :class="{ on: i === active }"
            >
          </template>
          <figcaption>{{ EXPERIMENTS[active].image.caption }}</figcaption>
        </figure>
      </div>

      <div class="entries">
        <h2 id="exp-h" class="lab-heading" data-reveal>Experiments & research</h2>
        <p class="sub" data-reveal>
          A working notebook of what I test beyond the day job: what each experiment set out to do, where it stands,
          and what it has shown so far.
        </p>

        <article
          v-for="(e, i) in EXPERIMENTS" :key="e.id" :ref="el => (rows[i] = el as HTMLElement)" :data-i="i"
          class="entry" :class="{ on: i === active }" data-reveal
        >
          <img class="m-img" :class="{ film: e.image.video }" :src="e.image.src" :alt="e.image.alt" :width="e.image.width" :height="e.image.height" loading="lazy" decoding="async">
          <h3>{{ e.title }}</h3>
          <p class="status">{{ e.status }}</p>
          <p class="objective">{{ e.objective }}</p>
          <dl>
            <div><dt>Technology</dt><dd>{{ e.technology.join(', ') }}</dd></div>
            <div><dt>Findings so far</dt><dd>{{ e.findings }}</dd></div>
            <div><dt>Related</dt><dd>{{ e.related.join(', ') }}</dd></div>
          </dl>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { EXPERIMENTS } from '~/data/portfolio'

const active = ref(0)
const film = ref<HTMLVideoElement[]>([])
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
// The clip plays only while its entry is the active one, and never under reduced motion.
watch(active, (i) => {
  const v = film.value[0]
  if (!v) return
  if (EXPERIMENTS[i]?.image.video && !reduce()) v.play().catch(() => {})
  else v.pause()
})
const rows: HTMLElement[] = []
let io: IntersectionObserver | null = null
let raf = 0

// The active entry is the last one whose heading has passed 60% of the screen height.
const update = () => {
  raf = 0
  const line = innerHeight * 0.6
  let next = 0
  rows.forEach((r, i) => { if (r && r.getBoundingClientRect().top < line) next = i })
  active.value = next
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

onMounted(() => {
  const root = rows[0]?.closest('section')
  if (!root) return
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      addEventListener('scroll', onScroll, { passive: true })
      update()
      if (EXPERIMENTS[active.value]?.image.video && !reduce()) film.value[0]?.play().catch(() => {})
    } else {
      removeEventListener('scroll', onScroll)
      film.value[0]?.pause()
    }
  })
  io.observe(root)
})
onBeforeUnmount(() => {
  io?.disconnect()
  removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.exp { padding: var(--section-gap) var(--margin) 0; }
.split {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(40px, 6vw, 112px);
}

.plate-col { position: relative; }
.plate {
  position: sticky;
  top: calc(var(--rail-h) + 8vh);
  margin: 0;
}
.plate .media {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  height: auto;
  object-fit: cover;
  object-position: top;
  background: var(--surface);
  filter: grayscale(1);
  opacity: 0;
  transform: scale(1.03);
  transition: opacity 420ms var(--ease-out), transform 900ms var(--ease-out);
}
.plate .media + .media { position: absolute; inset: 0 0 auto; }
.plate .media.on { opacity: 1; transform: none; }
.plate .film { filter: none; }
.plate figcaption { margin-top: 12px; font-size: var(--step-small); color: var(--muted); }

.entries { max-width: 640px; }
.sub { margin: 24px 0 72px; max-width: 52ch; }

.entry { padding: 0 0 80px; }
.entry h3 {
  font-size: var(--step-lead);
  letter-spacing: -0.02em;
  line-height: 1.1;
  transition: color var(--dur-hover) ease;
}
.entry.on h3 { color: var(--accent); }
.status { margin-top: 10px !important; font-size: var(--step-small); font-weight: 600; color: var(--muted); }
.objective { margin-top: 14px !important; }
dl { margin: 22px 0 0; display: grid; gap: 14px; font-size: 16px; }
dl div { display: grid; grid-template-columns: 9.5rem 1fr; gap: 16px; padding: 12px 16px; background: var(--surface); }
dt { color: var(--muted); }
dd { margin: 0; }
.m-img { display: none; }

@media (prefers-reduced-motion: reduce) {
  .plate .media { transition: opacity 200ms linear; transform: none; }
}

@media (max-width: 899px) {
  .split { grid-template-columns: 1fr; }
  .plate-col { display: none; }
  .sub { margin-bottom: 48px; }
  .m-img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; filter: grayscale(1); margin-bottom: 20px; }
  .m-img.film { filter: none; object-position: center; }
  dl div { grid-template-columns: 1fr; gap: 4px; }
  .entry { padding-bottom: 56px; }
}
</style>
