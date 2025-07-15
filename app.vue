<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <Navigation />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useHead } from '#app'

useHead({
  title: 'Rakibul H. Rabbi - Full-Stack Developer',
  meta: [
    { name: 'description', content: 'Full-Stack Software Developer specializing in .NET, React, Vue, and enterprise applications.' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>