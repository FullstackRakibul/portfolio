<template>
  <div class="sheet aa" role="dialog" aria-label="Reading settings" @click.stop>
    <p class="h" id="aa-theme">Theme</p>
    <div class="themes" role="radiogroup" aria-labelledby="aa-theme">
      <button v-for="t in THEMES" :key="t.id" type="button" role="radio" class="sw" :class="`sw--${t.id}`"
        :aria-checked="theme === t.id" @click="setPrefs({ theme: t.id })">
        <span class="sw-face" aria-hidden="true">Aa</span>
        <span class="sw-name">{{ t.label }}</span>
      </button>
    </div>

    <label class="h slider-h" for="aa-warmth">Warmth <span class="val">{{ prefs.warmth }}%</span></label>
    <input id="aa-warmth" class="range" type="range" min="0" max="100" step="5" :value="prefs.warmth"
      :aria-valuetext="`Warmth ${prefs.warmth} percent`" :style="{ '--p': `${prefs.warmth}%` }"
      @input="setPrefs({ warmth: num($event) })">

    <label class="h slider-h" for="aa-bright">Brightness <span class="val">{{ prefs.brightness }}%</span></label>
    <input id="aa-bright" class="range" type="range" min="60" max="100" step="5" :value="prefs.brightness"
      :aria-valuetext="`Brightness ${prefs.brightness} percent`" :style="{ '--p': `${(prefs.brightness - 60) / 0.4}%` }"
      @input="setPrefs({ brightness: num($event) })">

    <p class="h" id="aa-mode">Reading</p>
    <div class="seg" role="radiogroup" aria-labelledby="aa-mode">
      <button type="button" role="radio" :aria-checked="prefs.mode === 'paged'" @click="setPrefs({ mode: 'paged' })">
        <BookOpen :size="16" aria-hidden="true" /> Pages
      </button>
      <button type="button" role="radio" :aria-checked="prefs.mode === 'scroll'" @click="setPrefs({ mode: 'scroll' })">
        <ScrollText :size="16" aria-hidden="true" /> Scroll
      </button>
    </div>

    <p class="h" id="aa-fit">Fit</p>
    <div class="seg" role="radiogroup" aria-labelledby="aa-fit">
      <button type="button" role="radio" :aria-checked="prefs.fit === 'page'" @click="setPrefs({ fit: 'page', zoom: 1 })">
        <Maximize :size="16" aria-hidden="true" /> Whole page
      </button>
      <button type="button" role="radio" :aria-checked="prefs.fit === 'width'" @click="setPrefs({ fit: 'width', zoom: 1 })">
        <MoveHorizontal :size="16" aria-hidden="true" /> Width
      </button>
    </div>
    <div class="row zoom">
      <button type="button" class="tile-btn" aria-label="Zoom out" :disabled="prefs.zoom <= ZOOM.min" @click="zoomBy(-1)">
        <Minus :size="18" aria-hidden="true" />
      </button>
      <span class="val zoom-val" aria-live="polite">{{ Math.round(prefs.zoom * 100) }}%</span>
      <button type="button" class="tile-btn" aria-label="Zoom in" :disabled="prefs.zoom >= ZOOM.max" @click="zoomBy(1)">
        <Plus :size="18" aria-hidden="true" />
      </button>
    </div>

    <template v-if="canSpread && prefs.mode === 'paged'">
      <p class="h" id="aa-layout">Layout</p>
      <div class="seg" role="radiogroup" aria-labelledby="aa-layout">
        <button type="button" role="radio" :aria-checked="prefs.spread === 'auto'" @click="setPrefs({ spread: 'auto' })">
          <Columns2 :size="16" aria-hidden="true" /> Two pages
        </button>
        <button type="button" role="radio" :aria-checked="prefs.spread === 'single'" @click="setPrefs({ spread: 'single' })">
          <FileText :size="16" aria-hidden="true" /> One page
        </button>
      </div>
    </template>

    <p class="h">Focus</p>
    <button type="button" class="switch" role="switch" :aria-checked="prefs.ruler" @click="setPrefs({ ruler: !prefs.ruler })">
      <span>Reading ruler<small>A band that follows your line in focus mode</small></span><span class="track" aria-hidden="true" />
    </button>
    <button type="button" class="switch" role="switch" :aria-checked="prefs.breaks" @click="setPrefs({ breaks: !prefs.breaks })">
      <span>Break reminder<small>Every 20 minutes, rest your eyes</small></span><span class="track" aria-hidden="true" />
    </button>
    <button type="button" class="tile-btn wide" @click="emit('focus')">
      <Focus :size="16" aria-hidden="true" /> Enter focus mode <kbd>F</kbd>
    </button>

    <div v-if="pdf" class="files">
      <a class="tile-btn" :href="pdf" target="_blank" rel="noopener" download>
        <Download :size="16" aria-hidden="true" /> Download
      </a>
      <a class="tile-btn" :href="pdf" target="_blank" rel="noopener">
        <ExternalLink :size="16" aria-hidden="true" /> New tab
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, ScrollText, Maximize, MoveHorizontal, Minus, Plus, Columns2, FileText, Focus, Download, ExternalLink } from 'lucide-vue-next'
import { ZOOM, nextZoom, type ReaderTheme } from '~/composables/useReading'

// The reader's "Aa" sheet: page theme and eye comfort, how pages are laid out, focus aids, the file.
defineProps<{ canSpread: boolean; pdf?: string }>()
const emit = defineEmits<{ focus: [] }>()
const { prefs, theme, setPrefs } = useReading()

const THEMES: { id: ReaderTheme; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'paper', label: 'Paper' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'dim', label: 'Dim' },
  { id: 'night', label: 'Night' },
]
const num = (e: Event) => Number((e.target as HTMLInputElement).value)
function zoomBy(d: 1 | -1) {
  const next = nextZoom(prefs.value.zoom, d)
  if (next) setPrefs({ zoom: next })
}
</script>

<style scoped src="./sheet.css"></style>
<style scoped>
.aa {
  top: calc(env(safe-area-inset-top, 0px) + 64px);
  right: max(12px, env(safe-area-inset-right, 0px));
  width: min(340px, calc(100vw - 24px));
}

.themes { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.sw { display: grid; gap: 6px; justify-items: center; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; }
.sw-face {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  font: 600 17px 'Charter', 'Bitstream Charter', Georgia, serif;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}
.sw:active .sw-face { transform: scale(0.95); }
.sw[aria-checked="true"] .sw-face { outline-color: var(--r-ink); }
/* The swatches show each page theme's own paper and ink (reader theme colours, not site colours). */
.sw--original .sw-face { background: #2c2c2e; color: #fff; }
.sw--paper .sw-face { background: #fbfaf7; color: #1d1d1f; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08); } /* taste-skill-ignore: a white swatch needs its edge */
.sw--sepia .sw-face { background: #f3e8d2; color: #4a3826; }
.sw--dim .sw-face { background: #3a3a3c; color: #b9b6ae; }
.sw--night .sw-face { background: #141414; color: #d6d6d6; box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12); } /* taste-skill-ignore: a black swatch needs its edge */
.sw-name { font-size: 12px; color: var(--r-muted); }

.slider-h { display: flex; justify-content: space-between; align-items: baseline; }
.slider-h .val { font-weight: 400; }
.zoom { margin-top: 8px; }
.zoom .tile-btn { flex: 1; }
.zoom-val { min-width: 64px; text-align: center; font-size: 14px; }
.wide { width: 100%; margin-top: 8px; }
kbd { margin-left: auto; padding: 1px 6px; border-radius: 5px; background: var(--r-control); font: 500 12px var(--font-text); color: var(--r-muted); }
.files { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 18px; }
</style>
