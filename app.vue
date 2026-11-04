<template>
  <NuxtPage v-if="isHome" />
  <!-- Every other page shares the home page's frame: the teal ground, the header, the footer.
       index.html holds the rendered home page, so other pages are drawn fresh in the browser rather than
       hydrated over home markup (which would keep the home page's attributes). -->
  <ClientOnly v-else>
    <div class="lab page">
      <a class="skip" href="#main" @click.prevent="toMain">Skip to content</a>
      <Navigation variant="page" />
      <main id="main" ref="main" tabindex="-1">
        <NuxtPage />
      </main>
      <LabFooter />
      <LabCommandPalette />
    </div>
  </ClientOnly>
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

// With hash routing, #main would read as an address; move focus to the content instead.
const main = ref<HTMLElement | null>(null)
const toMain = () => main.value?.focus()

useHead({
  titleTemplate: t => t ?? 'Rakibul H. Rabbi',
  link: [{ rel: 'icon', href: '/favicon.ico' }],
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
  background: var(--ink);
  color: var(--bg);
  transform: translateY(-200%);
}
.page > .skip:focus { transform: none; }
</style>
