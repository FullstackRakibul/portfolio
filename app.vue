<template>
  <NuxtPage v-if="isHome" />
  <!-- The older pages keep their dark styling; the shared header takes the homepage tokens. -->
  <div v-else data-theme="dark" class="legacy min-h-svh bg-gray-900 text-gray-100">
    <Navigation variant="page" />
    <NuxtPage />
    <LabCommandPalette />
  </div>
  <!-- Site-wide layers: they follow the theme toggle and add nothing to the layout. -->
  <CustomCursor />
  <ScrollRail />
  <BackToTop />
  <FloatingContact />
</template>

<script setup lang="ts">
const route = useRoute()
// The home page answers at / and at each section's address (/#/projects).
const isHome = computed(() => !!route.meta.home)

useHead({
  titleTemplate: t => t ?? 'Rakibul H. Rabbi',
  link: [{ rel: 'icon', href: '/favicon.ico' }],
})
</script>

<style>
.legacy { font-family: 'Inter', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
</style>
