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
    </main>
    <LabFooter />
    <LabCommandPalette />
  </div>
</template>

<script setup lang="ts">
const description = 'Rakibul H. Rabbi is a full-stack engineer in Dhaka building enterprise systems in .NET, SQL Server and Vue, and Mostisko, a locally hosted AI workspace.'

useSeoMeta({
  title: 'Rakibul H. Rabbi, full-stack engineer and systems architect',
  description,
  ogTitle: 'Rakibul H. Rabbi, full-stack engineer and systems architect',
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://rabbitic.com',
})
</script>

<style scoped>
.lab { min-height: 100svh; overflow-x: clip; }
.skip {
  position: absolute;
  left: var(--margin);
  top: 12px;
  z-index: 60;
  padding: 10px 16px;
  background: var(--ink);
  color: var(--bg);
  transform: translateY(-200%);
}
.skip:focus { transform: none; }
</style>
