<template>
  <header class="hdr" :class="[`hdr--${variant}`, { scrolled, named: showName }]">
    <div class="inner lab-wrap">
      <NuxtLink to="/" class="brand" @click="toTop">
        <span class="tile" aria-hidden="true"><svg class="mark" viewBox="0 0 32 32">
          <path class="loop" d="M8 16C11 5 21 5 24 16" />
          <path class="loop" d="M8 16C11 27 21 27 24 16" />
          <path class="axis" d="M8 16H24" />
          <circle cx="8" cy="16" r="3" />
          <circle cx="24" cy="16" r="3" />
        </svg></span>
        <span class="brand-name lab-mono">Rakibul H. Rabbi</span>
      </NuxtLink>

      <nav ref="nav" class="links" aria-label="Sections" @pointerleave="hoverId = ''">
        <!-- custom: the router would otherwise overwrite aria-current with its own exact-match value. -->
        <NuxtLink v-for="s in linkSections" :key="s.id" v-slot="{ href, navigate }" :to="'/' + s.id" custom>
          <a
            :ref="el => setLink(s.id, el as Element | null)"
            :href="href"
            :aria-current="active === s.id ? (variant === 'home' ? 'location' : 'page') : undefined"
            @pointerenter="hoverId = s.id"
            @focus="hoverId = s.id"
            @blur="hoverId = ''"
            @click="go($event, s.id); navigate($event)"
          >
            {{ s.label }}
          </a>
        </NuxtLink>
        <span class="ind" :style="indicator" aria-hidden="true" />
      </nav>

      <div class="tools">
        <p v-if="time" class="clock lab-num" :title="`Local time in ${LOCATION.city}`">
          <span class="sr-only">Local time in </span>Dhaka <time>{{ time }}</time>
        </p>
        <UiButton
          variant="ghost" size="icon"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggle"
        >
          <Transition name="spin" mode="out-in">
            <Sun v-if="theme === 'dark'" key="sun" :size="18" aria-hidden="true" />
            <Moon v-else key="moon" :size="18" aria-hidden="true" />
          </Transition>
        </UiButton>
        <UiButton variant="ghost" size="icon" class="palette-key" aria-label="Open command palette (Ctrl+K)" aria-keyshortcuts="Control+K Meta+K" @click="palette = true">
          <Command :size="17" aria-hidden="true" />
        </UiButton>
        <UiButton v-magnetic="4" size="sm" class="talk" to="/contact" @click="go($event, 'contact')">
          Let’s talk
        </UiButton>
        <UiButton variant="ghost" size="icon" class="burger" aria-haspopup="dialog" :aria-expanded="menu" aria-controls="site-menu" @click="menu = true">
          <span class="sr-only">Menu</span>
          <span class="bars" aria-hidden="true"><i /><i /></span>
        </UiButton>
      </div>
    </div>
    <span class="progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
  </header>
  <LabMenu v-model:open="menu" :active="active" :sections="SECTIONS" @go="go(null, $event)" />
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { Sun, Moon, Command } from 'lucide-vue-next'
import { LOCATION, SECTIONS } from '~/data/portfolio'

const props = withDefaults(defineProps<{ variant?: 'home' | 'page' }>(), { variant: 'page' })

const route = useRoute()
const router = useRouter()
const { theme, toggle } = useTheme()
const palette = useState('lab-palette', () => false)
const menu = ref(false)

const linkSections = SECTIONS.filter(s => s.bar !== false)
// Sections without their own link in the bar light the nearest one.
const ALIAS: Record<string, string> = { engineering: 'experience', mostisko: 'projects', experiments: 'certifications' }
const active = ref('')
const hoverId = ref('')

// Other pages light the section they belong to: the notes under Writing, the résumé under Experience.
const PAGE_SECTION: [prefix: string, id: string][] = [['/onTheWayToBeCreative', 'writing'], ['/resume', 'experience']]
watch(() => route.path, (path) => {
  if (props.variant === 'page') active.value = PAGE_SECTION.find(([prefix]) => path.startsWith(prefix))?.[1] ?? ''
}, { immediate: true })

const scrolled = ref(false)
const showName = ref(props.variant === 'page')
const progress = ref(0)

/* Sliding indicator under the hovered link, resting under the active one. */
const linkEls = new Map<string, HTMLElement>()
const setLink = (id: string, el: Element | ComponentPublicInstance | null) => {
  const node = el && '$el' in el ? (el.$el as HTMLElement) : (el as HTMLElement | null)
  if (node) linkEls.set(id, node)
  else linkEls.delete(id)
}
const layoutTick = ref(0)
const indicator = computed(() => {
  void layoutTick.value
  const el = linkEls.get(hoverId.value || active.value)
  if (!el) return { opacity: 0 }
  return { opacity: 1, width: el.offsetWidth + 'px', transform: `translateX(${el.offsetLeft}px)` }
})

// Sections have their own address (/#/projects); the router scrolls to them (app/router.options.ts).
// Asking again for the section already in the address scrolls back to it.
const go = (e: MouseEvent | null, id: string) => {
  const path = '/' + id
  if (route.path === path) { e?.preventDefault(); scrollToSection(id); return }
  if (!e) router.push(path)
}

const toTop = (e: MouseEvent) => {
  if (route.path !== '/') return
  e.preventDefault()
  scrollToSection('')
}

/* Scroll state: tighter bar after the first pixels, the name once the hero's own name has gone. */
let raf = 0
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const y = scrollY
    const max = document.documentElement.scrollHeight - innerHeight
    scrolled.value = y > 8
    showName.value = props.variant === 'page' || y > innerHeight * 0.45
    progress.value = max > 0 ? Math.min(1, y / max) : 0
    if (props.variant === 'home' && y < innerHeight * 0.4) active.value = ''
  })
}

const time = ref('')
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: LOCATION.timeZone })
let clock = 0

let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
onMounted(() => {
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
  time.value = fmt.format(new Date())
  clock = window.setInterval(() => { time.value = fmt.format(new Date()) }, 20_000)
  ro = new ResizeObserver(() => layoutTick.value++)
  ro.observe(document.documentElement)
  document.fonts?.ready.then(() => layoutTick.value++)

  if (props.variant !== 'home') return
  io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) active.value = ALIAS[entry.target.id] ?? entry.target.id
  }, { rootMargin: '-45% 0px -50% 0px' })
  for (const id of [...SECTIONS.map(s => s.id), ...Object.keys(ALIAS)]) {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  }
})
onBeforeUnmount(() => {
  removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
  clearInterval(clock)
  io?.disconnect()
  ro?.disconnect()
})
</script>

<style scoped>
.hdr {
  position: fixed;
  inset: 0 0 auto;
  z-index: 40;
  color: var(--foreground);
  font-family: var(--font-text);
  border-bottom: 1px solid transparent; /* taste-skill-ignore: the bar's bottom edge once the page scrolls */
  transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease;
}
.hdr--page,
.hdr.scrolled {
  background: color-mix(in srgb, var(--background) 88%, transparent);
  border-bottom-color: var(--border);
  backdrop-filter: blur(8px); /* taste-skill-ignore: a light blur under the bar once the page scrolls (earlier brief) */
  -webkit-backdrop-filter: blur(8px); /* taste-skill-ignore: same bar, Safari prefix */
}

.inner {
  display: flex;
  align-items: center;
  gap: var(--s-6);
  height: var(--header-h);
  transition: height 320ms var(--ease-out);
}
.scrolled .inner { height: var(--header-h-tight); }

/* Wordmark: the mark is always there; the name joins it once the hero's name has scrolled away. */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  text-decoration: none;
  color: inherit;
}
/* Logo tile: a neutral square with a 1px border, the loop mark inside. */
.tile {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  box-sizing: border-box;
  border: 1px solid var(--border); /* taste-skill-ignore: the mark's tile edge (the brief's design system) */
  border-radius: var(--radius);
  background: var(--card);
  color: var(--foreground);
}
.mark { width: 24px; height: 24px; overflow: visible; }
.mark path { fill: none; stroke: currentColor; stroke-width: 1.8; }
.mark .axis { stroke: var(--muted-foreground); stroke-dasharray: 2 3; }
.mark circle { fill: currentColor; }
.mark .loop { transform-origin: 16px 16px; transition: transform 420ms var(--ease-spring); }
.brand:hover .mark .loop:first-of-type { transform: scaleY(1.25); }
.brand:hover .mark .loop:nth-of-type(2) { transform: scaleY(1.25); }
.brand-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 320ms ease, transform 420ms var(--ease-out);
}
.named .brand-name { opacity: 1; transform: none; }

.links {
  position: relative;
  display: flex;
  gap: var(--s-1);
  margin-left: auto;
  font-size: 16px;
}
.links a {
  padding: 10px 12px;
  color: var(--subtle);
  text-decoration: none;
  transition: color var(--dur-hover) ease;
}
.links a:hover,
.links a:focus-visible,
.links a[aria-current] { color: var(--foreground); }
.ind {
  position: absolute;
  left: 0;
  bottom: 2px;
  height: 2px;
  background: var(--primary);
  pointer-events: none;
  transition: transform var(--dur-move) var(--ease-out), width var(--dur-move) var(--ease-out), opacity var(--dur-hover) ease;
}

.tools { display: flex; align-items: center; gap: var(--s-1); }
.clock {
  margin-right: var(--s-3);
  font-size: var(--step-small);
  color: var(--muted-foreground);
  white-space: nowrap;
}
.clock time { color: var(--foreground); }

.tools .talk { margin-left: var(--s-3); }

.tools .burger { display: none; }
.bars { display: grid; gap: 6px; width: 20px; }
.bars i { display: block; height: 2px; background: currentColor; transition: transform var(--dur-move) var(--ease-out); }
.bars i:last-child { width: 70%; justify-self: end; }
.burger:hover .bars i:first-child { transform: translateX(-3px); }
.burger:hover .bars i:last-child { transform: translateX(3px); }

/* Reading progress: a signal travelling along the bottom edge of the bar. */
.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--primary);
  transform-origin: left;
  opacity: 0;
  transition: opacity 320ms ease;
}
.scrolled .progress { opacity: 0.85; }

.spin-enter-active, .spin-leave-active { transition: transform 260ms var(--ease-out), opacity 200ms ease; }
.spin-enter-from { transform: rotate(-90deg) scale(0.6); opacity: 0; }
.spin-leave-to { transform: rotate(90deg) scale(0.6); opacity: 0; }

@media (max-width: 1319px) {
  .clock { display: none; }
}
@media (max-width: 1079px) {
  .links, .tools .palette-key, .tools .talk { display: none; }
  .tools { margin-left: auto; }
  .tools .burger { display: inline-flex; }
}
@media (max-width: 380px) {
  .brand-name { font-size: 11px; letter-spacing: 0.1em; }
}
@media (prefers-reduced-motion: reduce) {
  .ind, .inner, .brand-name, .mark .loop { transition: none; }
}
</style>
