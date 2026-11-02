<template>
  <section id="about" v-reveal class="about" aria-labelledby="about-h">
    <div class="row">
      <h2 id="about-h" class="lab-heading head" data-reveal>The engineer behind the systems</h2>
    </div>

    <div class="row">
      <dl class="facts" data-reveal>
        <div v-for="f in FACTS" :key="f.label">
          <dt>{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </div>
      </dl>
      <div class="text">
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
          “Good engineering is not about writing more code. It is about making complexity understandable.”
        </blockquote>
      </div>
    </div>

    <div class="row record">
      <h3 class="word" data-reveal>Experience</h3>
      <div class="lists">
        <ol class="list" data-reveal aria-label="Experience, most recent first">
          <li v-for="r in EXPERIENCE" :key="r.company">
            <span class="who"><strong>{{ r.company }}</strong><span>{{ r.position }}</span></span>
            <span class="when lab-num">{{ r.period }}</span>
          </li>
        </ol>
        <div class="list side" data-reveal>
          <h4>Education</h4>
          <p class="pair"><span>City University, BSc in Computer Science and Engineering</span><span class="when lab-num">2022</span></p>
          <h4>Outside work</h4>
          <p v-for="b in BEYOND_WORK" :key="b" class="pair"><span>{{ b }}</span></p>
          <p class="more"><NuxtLink class="lab-link" to="/resume">Full résumé</NuxtLink></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FACTS, EXPERIENCE, BEYOND_WORK } from '~/data/portfolio'
</script>

<style scoped>
.about {
  --axis: var(--line);
  padding: var(--section-gap) var(--margin) 0;
}
.row {
  display: grid;
  grid-template-columns: calc(var(--axis) - var(--margin)) minmax(0, 1fr);
}
.head { grid-column: 2; max-width: 18ch; margin-bottom: 56px; }

.facts {
  display: grid;
  align-content: start;
  gap: 20px;
  margin: 0;
  max-width: 200px;
  font-size: var(--step-small);
}
.facts dt { color: var(--muted); }
.facts dd { margin: 2px 0 0; }

.text { max-width: min(58vw, 880px); }
.lead {
  font-size: var(--step-lead);
  line-height: 1.35;
}
.body {
  margin-top: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 48px;
}
.quote {
  margin: 48px 0 0;
  padding: 28px 32px;
  background: var(--surface);
  font-size: var(--step-lead);
  line-height: 1.3;
  max-width: 34ch;
  box-sizing: content-box;
}

.record { margin-top: 120px; }
.word {
  font-family: var(--font-text);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.5;
}
.lists {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 64px;
  max-width: min(58vw, 880px);
}
.list { list-style: none; margin: 0; padding: 0; font-size: 16px; }
.list li,
.pair {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin: 0 0 14px;
}
.who { display: grid; }
.who strong { font-weight: 600; }
.who span { color: var(--muted); }
.when { color: var(--muted); white-space: nowrap; font-size: var(--step-small); }
.side h4 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 600;
}
.side h4:not(:first-child) { margin-top: 28px; }
.side .pair { margin-bottom: 6px; }
.more { margin-top: 24px; }

@media (max-width: 960px) {
  .row { grid-template-columns: 1fr; }
  .head { grid-column: 1; }
  .text, .lists { max-width: none; }
  .text { order: -1; }
  .facts { grid-template-columns: 1fr 1fr; max-width: none; margin-top: 40px; }
  .body { grid-template-columns: 1fr; }
  .record { margin-top: 80px; }
  .word { margin-bottom: 16px; }
  .lists { grid-template-columns: 1fr; gap: 40px; }
}
</style>
