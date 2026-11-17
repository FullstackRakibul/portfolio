<template>
  <div class="lab">
    <a class="skip" href="#about">Skip to content</a>
    <Navigation variant="home" />
    <LabHero />
    <main>
      <LabAbout />
      <LabExperience />
      <LabWave />
      <LabEngineering />
      <LabMostisko />
      <LabProjects />
      <LabCertifications />
      <LabExperiments />
      <LabWave />
      <LabWriting />
      <LabContact />
      <LabFaq />
    </main>
    <LabFooter />
    <LabCommandPalette />
  </div>
</template>

<script setup lang="ts">
import { BIO } from '~/data/profile'

// Also rendered at each section's address (/projects); those are the home page, so the canonical stays '/'.
usePageSeo({ title: 'Full-Stack Engineer in Dhaka', description: BIO, path: '/' })
</script>

<style scoped>
.lab { min-height: 100svh; overflow-x: clip; }
.skip {
  position: absolute;
  left: var(--margin);
  top: 12px;
  z-index: 60;
  padding: 10px 16px;
  background: var(--foreground);
  color: var(--background);
  transform: translateY(-200%);
}
.skip:focus { transform: none; }
</style>
