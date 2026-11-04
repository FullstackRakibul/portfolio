<template>
  <div class="aa" role="dialog" aria-label="Reading settings" @click.stop>
    <p class="h">Theme</p>
    <div class="themes" role="radiogroup" aria-label="Page theme">
      <button v-for="t in THEMES" :key="t.id" type="button" role="radio" class="sw" :class="`sw--${t.id}`"
        :aria-checked="prefs.theme === t.id" @click="setPrefs({ theme: t.id })">
        <span class="sw-face">Aa</span>
        <span class="sw-name">{{ t.label }}</span>
      </button>
    </div>

    <p class="h">Size</p>
    <div class="row">
      <button type="button" class="step" aria-label="Smaller" :disabled="prefs.zoom <= 1" @click="zoom(-0.25)">
        <span class="a-small">A</span>
      </button>
      <span class="val lab-num" aria-live="polite">{{ Math.round(prefs.zoom * 100) }}%</span>
      <button type="button" class="step" aria-label="Larger" :disabled="prefs.zoom >= 2.5" @click="zoom(0.25)">
        <span class="a-large">A</span>
      </button>
    </div>

    <template v-if="canSpread">
      <p class="h">Layout</p>
      <div class="seg" role="radiogroup" aria-label="Page layout">
        <button type="button" role="radio" :aria-checked="prefs.spread === 'auto'"
          @click="setPrefs({ spread: 'auto' })">
          <BookOpen :size="16" aria-hidden="true" /> Two pages
        </button>
        <button type="button" role="radio" :aria-checked="prefs.spread === 'single'"
          @click="setPrefs({ spread: 'single' })">
          <FileText :size="16" aria-hidden="true" /> One page
        </button>
      </div>
    </template>

    <a v-if="pdf" class="dl" :href="pdf" target="_blank" rel="noopener" download>
      <Download :size="16" aria-hidden="true" /> Download PDF
    </a>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, FileText, Download } from 'lucide-vue-next'
import type { ReaderTheme } from '~/composables/useReading'

// The reader's "Aa" sheet: page colour, size and layout, as in a book app.
defineProps<{ canSpread: boolean; pdf?: string }>()
const { prefs, setPrefs } = useReading()

const THEMES: { id: ReaderTheme; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'paper', label: 'Paper' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'night', label: 'Night' },
]
const zoom = (d: number) => setPrefs({ zoom: Math.min(2.5, Math.max(1, prefs.value.zoom + d)) })
</script>

<style scoped>
.aa {
  position: absolute;
  top: calc(env(safe-area-inset-top, 0px) + 64px);
  right: max(12px, env(safe-area-inset-right, 0px));
  z-index: 5;
  width: min(320px, calc(100vw - 24px));
  padding: 18px;
  border-radius: 18px;
  background: var(--r-sheet);
  color: var(--r-ink);
  box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.55);
  /* taste-skill-ignore: a floating sheet */
}

.h {
  margin: 14px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--r-muted);
}

.h:first-child {
  margin-top: 0;
}

.themes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sw {
  display: grid;
  gap: 6px;
  justify-items: center;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.sw-face {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 14px;
  font: 600 18px 'Charter', 'Bitstream Charter', Georgia, serif;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}

.sw:active .sw-face {
  transform: scale(0.95);
}

.sw[aria-checked="true"] .sw-face {
  outline-color: var(--mint);
}

.sw--original .sw-face {
  background: #2c2c2e;
  color: #fff;
}

.sw--paper .sw-face {
  background: #fbfaf7;
  color: #1d1d1f;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08);
}

/* taste-skill-ignore: a white swatch needs its edge */
.sw--sepia .sw-face {
  background: #f3e8d2;
  color: #4a3826;
}

.sw--night .sw-face {
  background: #141414;
  color: #d6d6d6;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12);
}

/* taste-skill-ignore: a black swatch needs its edge */
.sw-name {
  font-size: 12px;
  color: var(--r-muted);
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step,
.seg button,
.dl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  border: 0;
  border-radius: 12px;
  background: var(--r-control);
  color: var(--r-ink);
  font: 500 14px var(--font-text);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}

.step {
  flex: 1;
  font-family: 'Charter', 'Bitstream Charter', Georgia, serif;
}

.step:disabled {
  opacity: 0.4;
  cursor: default;
}

.step:not(:disabled):active,
.seg button:active,
.dl:active {
  transform: scale(0.97);
}

.a-small {
  font-size: 14px;
}

.a-large {
  font-size: 22px;
}

.val {
  min-width: 56px;
  text-align: center;
  font-size: 14px;
  color: var(--r-muted);
}

.seg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.seg button[aria-checked="true"] {
  background: var(--teal);
  color: #fff;
}

.dl {
  width: 100%;
  margin-top: 16px;
}

@media (hover: hover) {

  .step:not(:disabled):hover,
  .seg button[aria-checked="false"]:hover,
  .dl:hover {
    background: var(--r-control-hover);
  }
}
</style>