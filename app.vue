<template>
  <NuxtPage v-if="isHome" />
  <!-- Every other page shares the home page's frame: the page ground, the header, the footer.
       Each page is prerendered to its own HTML, so crawlers read it without running script. -->
  <div v-else class="lab page">
      <a class="skip" href="#main" @click.prevent="toMain">Skip to content</a>
      <Navigation variant="page" />
      <main id="main" ref="main" tabindex="-1">
        <NuxtPage />
      </main>
      <LabFooter />
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
// The home page answers at / and at each section's address (/projects).
const isHome = computed(() => !!route.meta.home)

// Move focus to the content (the link's #main alone would only scroll).
const main = ref<HTMLElement | null>(null)
const toMain = () => main.value?.focus()

useHead({
  titleTemplate: t => t ?? 'Rakibul H. Rabbi',
  // Made from public/assets/img/rakibul-h-rabbi.png (cropped, the mask filled white so it reads on dark tabs too).
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'icon', type: 'image/png', href: '/icon-192.png', sizes: '192x192' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
})
</script>

<style>
.page { min-height: 100svh; overflow-x: clip; }
.page > main { display: block; outline: none; }
.page > .skip {
  position: absolute;
  left: var(--margin);
  top: 12px;
  z-index: 60;
  padding: 10px 16px;
  background: var(--foreground);
  color: var(--background);
  transform: translateY(-200%);
}
.page > .skip:focus { transform: none; }
</style>
