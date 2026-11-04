<template>
  <Transition name="btt">
    <button
      v-show="visible" type="button" class="btt" :class="{ raised: dock.contact }"
      aria-label="Back to top" @click="toTop"
    >
      <svg class="meter" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="track" cx="24" cy="24" :r="R" />
        <circle ref="fill" class="fill" cx="24" cy="24" :r="R" :stroke-dasharray="C" :stroke-dashoffset="C" />
      </svg>
      <ArrowUp class="arrow" :size="18" :stroke-width="2.4" aria-hidden="true" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
// A round back-to-top button with a ring that fills as the page is read. It shows once the hero is
// passed, stacks 12px above the floating contact button, and steps aside while that one is open.
import { ArrowUp } from 'lucide-vue-next'

const R = 21
const C = 2 * Math.PI * R

const dock = useState('floating-dock', () => ({ contact: false, open: false }))
const route = useRoute()
const router = useRouter()
const fill = ref<SVGCircleElement | null>(null)
const past = ref(false)
const visible = computed(() => past.value && !dock.value.open)

let raf = 0
const update = () => {
  raf = 0
  const max = document.documentElement.scrollHeight - innerHeight
  const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
  past.value = scrollY > innerHeight * 0.9
  fill.value?.setAttribute('stroke-dashoffset', (C * (1 - p)).toFixed(2))
}
const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }

const toTop = (e: MouseEvent) => {
  // On a section's address (/#/projects), going home is going to the top; the router scrolls there.
  if (route.meta.home && route.path !== '/') router.push('/')
  else scrollToSection('')
  // Keyboard users: put focus at the top too, so the next Tab starts from there.
  if (e.detail === 0) {
    const h = document.querySelector<HTMLElement>('h1')
    if (h) {
      h.setAttribute('tabindex', '-1')
      h.focus({ preventScroll: true })
      h.addEventListener('blur', () => h.removeAttribute('tabindex'), { once: true })
    }
  }
}

onMounted(() => {
  update()
  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  removeEventListener('scroll', schedule)
  removeEventListener('resize', schedule)
})
</script>

<style scoped>
.btt {
  /* Same family as the floating contact pill. */
  --btt-bg: #121a1c;
  --btt-border: rgb(255 255 255 / 0.08);
  --btt-track: rgb(255 255 255 / 0.14);
  --btt-ink: #5eead4;
  --btt-focus: #5eead4;
  --btt-gap: 24px;
  --btt-dock: 64px; /* contact pill 52px + 12px */

  position: fixed;
  right: var(--btt-gap);
  bottom: var(--btt-gap);
  z-index: 39;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--btt-border); /* taste-skill-ignore: the hairline edge of the floating controls */
  border-radius: 50%;
  background: var(--btt-bg);
  color: var(--btt-ink);
  cursor: pointer;
  box-shadow: 0 14px 34px -16px rgb(0 0 0 / 0.6); /* taste-skill-ignore: a floating control truly floats */
  transition:
    transform 220ms cubic-bezier(0.34, 1.4, 0.64, 1),
    background-color 200ms ease, border-color 200ms ease, color 200ms ease;
}
[data-theme="light"] .btt {
  --btt-bg: #111111;
  --btt-border: rgb(255 255 255 / 0.1);
  --btt-track: rgb(255 255 255 / 0.2);
  --btt-focus: #0a6a62;
}
.btt.raised { transform: translateY(calc(var(--btt-dock) * -1)); }
.btt:hover { transform: translateY(-2px); }
.btt.raised:hover { transform: translateY(calc(var(--btt-dock) * -1 - 2px)); }
.btt:active { transform: scale(0.95); }
.btt.raised:active { transform: translateY(calc(var(--btt-dock) * -1)) scale(0.95); }
.btt:focus-visible { outline: 2px solid var(--btt-focus); outline-offset: 3px; }

.meter {
  position: absolute;
  inset: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  transform: rotate(-90deg);
}
.meter circle { fill: none; stroke-width: 2.5; }
.track { stroke: var(--btt-track); }
.fill { stroke: var(--btt-ink); stroke-linecap: round; }
.arrow { position: relative; transition: transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.btt:hover .arrow { transform: translateY(-2px); }

.btt-enter-active,
.btt-leave-active { transition: opacity 200ms ease; }
.btt-enter-from,
.btt-leave-to { opacity: 0; }

@media (max-width: 639px) {
  .btt { --btt-gap: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .btt, .arrow { transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease; }
  .btt:hover, .btt:active, .btt:hover .arrow { transform: none; }
  .btt.raised, .btt.raised:hover, .btt.raised:active { transform: translateY(calc(var(--btt-dock) * -1)); }
}
</style>
