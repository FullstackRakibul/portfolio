<template>
  <section id="about" v-reveal class="about lab-section lab-wrap" aria-labelledby="about-h">
    <div class="spread">
      <figure ref="figure" class="figure" data-reveal>
        <div class="frame" data-ui>
          <img
            src="/assets/img/rakibul-h-hasan-office.jpg" width="472" height="591"
            alt="Rakibul H. Rabbi, photographed against a plain background" loading="lazy" decoding="async"
          >
          <span class="scan" :class="{ run: inView }" aria-hidden="true" />
          <p class="coord lab-num" aria-hidden="true">{{ LOCATION.lat }}<br>{{ LOCATION.lon }}</p>
        </div>
        <figcaption>
          <dl class="facts">
            <div v-for="f in FACTS" :key="f.label">
              <dt>{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          </dl>
        </figcaption>
      </figure>

      <div class="text">
        <h2 id="about-h" class="lab-heading" data-reveal>The engineer behind the systems</h2>
        <p class="lead" data-reveal>
          I'm Rakibul H. Rabbi — a software engineer passionate about enterprise application development, system
          architecture, developer tooling, automation, and intelligent software systems.
        </p>
        <div class="body" data-reveal>
          <p>
            Currently working at Ha-Meem Group, where I contribute to enterprise ERP systems, production workflows,
            HRM integrations, Windows-based services, and business-critical applications.
          </p>
          <p>
            My engineering experience spans .NET, C#, SQL Server, Vue.js, React, Angular, Laravel, and modern
            JavaScript ecosystems.
          </p>
          <p>
            I enjoy solving problems that emerge when systems become complex. Rather than repeatedly solving the same
            engineering challenges, I prefer building reusable tools, abstractions, and scalable foundations that make
            development easier for everyone.
          </p>
          <p>
            Beyond professional development, I experiment with local AI infrastructure, LLM-powered applications,
            developer productivity tools, and automation.
          </p>
        </div>
        <blockquote class="quote" data-reveal>
          <svg class="osc" viewBox="0 0 48 16" aria-hidden="true">
            <path d="M-48 8q6-7 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0" />
          </svg>
          <p>“Good engineering is not about writing more code. It is about making complexity understandable.”</p>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FACTS, LOCATION } from '~/data/portfolio'

const figure = ref<HTMLElement | null>(null)
const inView = useInView(figure, '0px')
</script>

<style scoped>
.spread {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap);
  align-items: start;
}

.figure {
  grid-column: 1 / span 4;
  margin: 0;
  position: sticky;
  top: calc(var(--header-h-tight) + 32px);
}
.frame { position: relative; overflow: hidden; background: var(--surface); }
.frame img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 472 / 591;
  object-fit: cover;
  filter: grayscale(1) contrast(1.04);
}
[data-theme="dark"] .frame img { filter: grayscale(1) contrast(1.04) brightness(0.86); }
.scan {
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: var(--accent);
  opacity: 0;
}
.scan.run { animation: scan 6s var(--ease-out) infinite; }
@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.7; }
  80% { opacity: 0.7; }
  100% { transform: translateY(calc(100cqh - 2px)); opacity: 0; }
}
.frame { container-type: size; aspect-ratio: 472 / 591; }
.coord {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px 12px;
  background: var(--ink);
  color: var(--bg);
  font-size: var(--step-small);
  line-height: 1.35;
}

.facts { margin: var(--s-5) 0 0; display: grid; gap: var(--s-3); font-size: var(--step-small); }
.facts div { display: grid; grid-template-columns: 6.5rem 1fr; gap: var(--s-3); }
.facts dt { color: var(--muted); }
.facts dd { margin: 0; color: var(--ink); }

.text { grid-column: 6 / -1; }
.text h2 { max-width: 16ch; }
.lead {
  margin-top: var(--s-6);
  font-size: var(--step-lead);
  line-height: 1.38;
  max-width: 38ch;
}
.body {
  margin-top: var(--s-7);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-5) var(--s-7);
  max-width: 920px;
}

.quote {
  margin: var(--s-8) 0 0;
  padding: var(--s-6) var(--s-6) var(--s-6);
  background: var(--surface);
  max-width: 820px;
}
.quote p {
  font: 700 var(--step-lead) / 1.25 var(--font-display);
  letter-spacing: -0.02em;
  max-width: 34ch;
}
.osc { display: block; width: 48px; height: 16px; margin-bottom: var(--s-4); overflow: hidden; }
.osc path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.75;
  stroke-linecap: round;
  animation: carrier 1.6s linear infinite;
}
@keyframes carrier { to { transform: translateX(24px); } }

@media (prefers-reduced-motion: reduce) {
  .scan.run, .osc path { animation: none; }
}

@media (max-width: 1099px) {
  .figure { grid-column: 1 / span 5; }
  .text { grid-column: 7 / -1; }
  .body { grid-template-columns: 1fr; }
}
@media (max-width: 759px) {
  .spread { grid-template-columns: 1fr; row-gap: var(--s-7); }
  .figure { grid-column: 1; position: static; display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr); gap: var(--s-4); align-items: end; }
  .facts { margin: 0; }
  .facts div { grid-template-columns: 1fr; gap: 0; }
  .text { grid-column: 1; order: -1; }
  .quote { padding: var(--s-5); }
}
</style>
