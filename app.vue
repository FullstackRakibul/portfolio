<template>
  <NuxtPage v-if="isHome" />
  <!-- The older pages keep their dark styling; the shared bar takes the laboratory's tokens. -->
  <div v-else data-theme="dark" class="legacy min-h-svh bg-gray-900 text-gray-100">
    <Navigation variant="bar" />
    <NuxtPage />
    <LabCommandPalette />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')

useHead({
  titleTemplate: t => t ?? 'Rakibul H. Rabbi',
  link: [{ rel: 'icon', href: '/favicon.ico' }],
})
</script>

<style>
.legacy { font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
</style>
