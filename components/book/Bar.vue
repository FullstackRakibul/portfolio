<template>
  <footer class="bar">
    <input v-model.number="scrub" class="range scrub" type="range" min="1" :max="total" step="1" aria-label="Page"
      :aria-valuetext="`Page ${scrub} of ${total}`" :style="{ '--p': `${((scrub - 1) / Math.max(1, total - 1)) * 100}%` }"
      @change="emit('jump', scrub)">
    <div class="where">
      <label class="goto lab-num">
        <span>{{ spread ? 'Pages' : 'Page' }}</span>
        <input type="number" inputmode="numeric" min="1" :max="total" :value="page" aria-label="Go to page"
          @change="go" @keydown.enter="go">
        <span v-if="spread">–{{ last }}</span>
        <span>of {{ total.toLocaleString('en') }}</span>
      </label>
      <p class="time lab-num">
        <span :title="'Reading for ' + formatDuration(elapsed)">
          <Clock3 :size="14" aria-hidden="true" /><span class="sr-only">Reading for </span>{{ clock }}
        </span>
        <span>{{ leftLabel }}</span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import { formatDuration } from '~/composables/useSession'

// The reader's foot: where you are, a slider to anywhere, a field to type a page, how long this sitting
// has lasted and how long the rest of the book should take at this reader's pace.
const props = defineProps<{ page: number; last: number; total: number; elapsed: number; secondsLeft: number | null }>()
const emit = defineEmits<{ jump: [n: number] }>()

const scrub = ref(props.page)
watch(() => props.page, (p) => { scrub.value = p })
const spread = computed(() => props.last > props.page)

const clock = computed(() => {
  const s = props.elapsed
  const m = Math.floor(s / 60)
  return m >= 60 ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` : `${m}:${String(s % 60).padStart(2, '0')}`
})
const leftLabel = computed(() => {
  const left = props.total - props.last
  if (left === 0) return 'Last page'
  if (props.secondsLeft === null) return `${left.toLocaleString('en')} ${left === 1 ? 'page' : 'pages'} left`
  return `About ${formatDuration(props.secondsLeft)} left in the book`
})

function go(e: Event) {
  const el = e.target as HTMLInputElement
  const n = Math.round(Number(el.value))
  if (n >= 1 && n <= props.total) emit('jump', n)
  else el.value = String(props.page)
}
</script>

<style scoped src="./sheet.css"></style>
<style scoped>
.bar {
  padding: 8px max(20px, env(safe-area-inset-right, 0px)) calc(env(safe-area-inset-bottom, 0px) + 10px) max(20px, env(safe-area-inset-left, 0px));
  width: min(760px, 100%);
  margin-inline: auto;
}
.scrub::-webkit-slider-thumb { width: 18px; height: 18px; margin-top: -7px; box-shadow: 0 0 0 2px var(--r-ground); } /* taste-skill-ignore: the thumb's halo against its track */
.where {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 16px;
  margin-top: 4px;
  font-size: 13px;
  color: var(--r-muted);
}
.goto { display: inline-flex; align-items: center; gap: 6px; }
.goto input {
  width: 4.5ch;
  min-height: 32px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: var(--r-control);
  color: var(--r-ink);
  font: 500 13px var(--font-text);
  font-variant-numeric: tabular-nums;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}
.goto input::-webkit-outer-spin-button,
.goto input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.time { display: inline-flex; flex-wrap: wrap; gap: 4px 16px; margin: 0; }
.time > span { display: inline-flex; align-items: center; gap: 6px; }
</style>
