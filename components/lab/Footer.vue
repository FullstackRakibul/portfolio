<template>
  <footer class="foot">
    <p class="name">Exploring the unseen. Engineering the possible.</p>
    <div class="line">
      <p>Rakibul H. Rabbi, Dhaka</p>
      <nav aria-label="Elsewhere" class="links">
        <a :href="CONTACT.github" target="_blank" rel="noopener">GitHub</a>
        <a :href="CONTACT.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        <a :href="CONTACT.medium" target="_blank" rel="noopener">Medium</a>
        <NuxtLink to="/resume">Résumé</NuxtLink>
      </nav>
      <p class="end lab-num">© {{ year }}</p>
    </div>
    <p class="credits">
      Pictures, public domain via Wikimedia Commons: Tesla’s Colorado Springs laboratory, photographed by Dickenson V.
      Alley, 1899 (restored); the laboratory’s exterior, photographed by Charles Alley, 1899; Wardenclyffe Tower, around
      1902; Tesla’s US patent 1,119,732; “Electrical Oscillators”, Electrical Experimenter, July 1919.
      Film: “225W Tesla coil firing” by Airarcs, CC BY-SA 3.0, via Wikimedia Commons, shown unaltered.
      Project pictures are screenshots of the live sites.
    </p>
  </footer>
</template>

<script setup lang="ts">
import { CONTACT } from '~/data/portfolio'

const year = new Date().getFullYear()
</script>

<style scoped>
.foot { padding: clamp(120px, 14vw, 200px) var(--margin) 30px; }
.name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 6.4vw, 7.5rem);
  letter-spacing: -0.045em;
  line-height: 0.9;
  max-width: 24ch;
}
.line {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 16px;
  margin-top: 64px;
  font-size: 16px;
  color: var(--muted);
}
.links { display: flex; gap: 24px; }
.links a { color: var(--ink); text-decoration: none; transition: color var(--dur-hover) ease; }
.links a:hover { color: var(--accent); }
.end { text-align: right; }
.credits { margin-top: 28px; max-width: 60ch; font-size: var(--step-small); color: var(--muted); }

@media (max-width: 760px) {
  .foot { padding-top: 20svh; padding-bottom: 24px; }
  .line { grid-template-columns: 1fr; gap: 8px; }
  .links { flex-wrap: wrap; gap: 8px 20px; }
  .end { text-align: left; }
}
</style>
