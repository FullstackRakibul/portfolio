<script setup lang="ts">
// Share image, 1200×630, rendered at build (nuxt-og-image, Satori). The site's light theme: black on white, Inter.
const { title = 'Full-Stack Engineer in Dhaka', name = 'Rakibul H. Rabbi', host = 'butterbun.vercel.app' } = defineProps<{
  title?: string
  name?: string
  host?: string
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between bg-white" style="padding: 72px 80px; color: #09090B; font-family: Inter;">
    <div class="flex" style="font-size: 28px; font-weight: 400; color: #52525B;">{{ host }}</div>
    <div class="flex flex-col">
      <div class="flex" style="font-size: 104px; font-weight: 700; letter-spacing: -0.045em; line-height: 0.95;">{{ name }}</div>
      <div class="flex" style="margin-top: 32px; font-size: 44px; font-weight: 400; line-height: 1.2; color: #52525B; max-width: 1000px;">{{ title }}</div>
    </div>
    <div class="flex" style="height: 8px; width: 96px; background: #09090B;" />
  </div>
</template>
