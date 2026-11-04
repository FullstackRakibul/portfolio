<template>
  <NuxtPage v-if="isHome" />
  <!-- The older pages keep their dark styling; the shared header takes the homepage tokens. -->
  <div v-else data-theme="dark" class="legacy min-h-svh bg-gray-900 text-gray-100">
    <Navigation variant="page" />
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
.legacy { font-family: 'Inter', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
</style>
