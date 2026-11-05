<template>
  <Transition name="btt">
    <UiButton
      v-show="visible" variant="outline" size="icon-lg" shape="circle" class="btt" :class="{ raised: dock.contact }"
      aria-label="Back to top" @click="toTop"
    >
      <svg class="meter" viewBox="0 0 44 44" aria-hidden="true">
        <circle class="track" cx="22" cy="22" :r="R" />
        <circle ref="fill" class="fill" cx="22" cy="22" :r="R" :stroke-dasharray="C" :stroke-dashoffset="C" />
      </svg>
      <ArrowUp class="arrow" :size="18" :stroke-width="2.2" aria-hidden="true" />
    </UiButton>
  </Transition>
</template>

<script setup lang="ts">
// A round back-to-top button with a ring that fills as the page is read. It shows once the hero is
// passed, stacks 12px above the floating contact button, and steps aside while that one is open.
import { ArrowUp } from 'lucide-vue-next'

const R = 20
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
/* An outline icon button on the card surface, floating 12px above the contact pill. The ring is the
   reading progress: --primary (the accent in dark mode, black in light). */
.ui-btn.btt {
  --btt-gap: 24px;
  --btt-dock: 64px; /* contact pill 52px + 12px */
  position: fixed;
  right: var(--btt-gap);
  bottom: var(--btt-gap);
  z-index: 39;
  background: var(--card);
  box-shadow: var(--shadow-float); /* taste-skill-ignore: a floating control truly floats */
  transition: bottom 220ms var(--ease-out), background-color var(--dur-hover) ease, border-color var(--dur-hover) ease, transform var(--dur-press) ease;
}
.ui-btn.btt:hover { background: var(--muted); }
.ui-btn.btt.raised { bottom: calc(var(--btt-gap) + var(--btt-dock)); }

.meter {
  position: absolute;
  inset: -1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  transform: rotate(-90deg);
  pointer-events: none;
}
.meter circle { fill: none; stroke-width: 2; }
.track { stroke: transparent; }
.fill { stroke: var(--primary); stroke-linecap: round; }
.arrow { position: relative; color: var(--foreground); transition: transform 200ms var(--ease-spring); }
.ui-btn.btt:hover .arrow { transform: translateY(-2px); }

.btt-enter-active,
.btt-leave-active { transition: opacity 200ms ease; }
.btt-enter-from,
.btt-leave-to { opacity: 0; }

@media (max-width: 639px) {
  .ui-btn.btt { --btt-gap: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-btn.btt { transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease; }
  .arrow { transition: none; }
  .ui-btn.btt:hover .arrow { transform: none; }
}
</style>
