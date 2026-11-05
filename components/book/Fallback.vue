<template>
  <div class="fb" :class="{ framed }">
    <div class="msg" role="status">
      <p class="t">{{ framed ? 'Showing this book in your browser’s own viewer' : 'This book opens in a new tab' }}</p>
      <p class="x">The library that hosts it doesn’t let this page read it directly, so the reader’s own tools aren’t available for it yet.</p>
      <div class="acts">
        <UiButton :href="src" target="_blank" rel="noopener">
          <template #leading><ExternalLink aria-hidden="true" /></template>
          Open in new tab
        </UiButton>
        <UiButton variant="outline" :href="src" download>
          <template #leading><Download aria-hidden="true" /></template>
          Download PDF
        </UiButton>
      </div>
    </div>
    <iframe v-if="framed" :src="src" :title="`${title} (PDF)`" referrerpolicy="no-referrer" />
  </div>
</template>

<script setup lang="ts">
import { Download, ExternalLink } from 'lucide-vue-next'

// When a PDF can't be read here (the host refuses other sites, or the network fails): the browser's own
// PDF viewer in a frame where it has one, and always a plain way to open or save the file. Never a dead end.
defineProps<{ src: string; title: string }>()
// Phones tend to download a framed PDF rather than show it, so they get the buttons alone.
const framed = ref(false)
onMounted(() => {
  const nav = navigator as Navigator & { pdfViewerEnabled?: boolean }
  framed.value = nav.pdfViewerEnabled !== false && !matchMedia('(pointer: coarse)').matches
})
</script>

<style scoped>
.fb {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--r-pad-top) 20px calc(env(safe-area-inset-bottom, 0px) + 24px);
}
.fb.framed {
  grid-template-rows: auto 1fr;
  place-items: stretch;
  gap: 16px;
  padding: var(--r-pad-top) max(16px, env(safe-area-inset-right, 0px)) 16px;
}
.msg { max-width: 460px; text-align: center; }
.framed .msg {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 4px 24px;
  max-width: none;
  text-align: left;
}
.t { margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3; }
.framed .t { font-size: 16px; }
.x { margin: 8px 0 20px; color: var(--r-muted); line-height: 1.5; }
.framed .x { margin: 0; grid-column: 1; font-size: 14px; }
.acts { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.framed .acts { grid-column: 2; grid-row: 1 / span 2; }
iframe { width: 100%; height: 100%; border: 0; border-radius: 8px; background: var(--r-sheet); }

@media (max-width: 719px) {
  .framed .msg { grid-template-columns: 1fr; }
  .framed .acts { grid-column: 1; grid-row: auto; justify-content: start; margin-top: 8px; }
}
</style>
