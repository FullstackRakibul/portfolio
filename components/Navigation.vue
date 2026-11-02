<template>
  <header class="rail" :class="`rail--${variant}`">
    <component :is="variant === 'rail' ? 'h1' : 'p'" class="name">
      <NuxtLink to="/" @click="toTop">Rakibul H. Rabbi</NuxtLink>
    </component>

    <nav class="links" aria-label="Sections">
      <NuxtLink
        v-for="s in linkSections"
        :key="s.id"
        :to="{ path: '/', hash: '#' + s.id }"
        :aria-current="active === s.id ? 'true' : undefined"
        @click="go($event, s.id)"
      >
        {{ s.label }}
      </NuxtLink>
    </nav>

    <div class="tools">
      <button
        v-if="variant === 'rail'"
        type="button"
        class="icon"
        :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggle"
      >
        <Sun v-if="theme === 'dark'" :size="18" aria-hidden="true" />
        <Moon v-else :size="18" aria-hidden="true" />
      </button>
      <button type="button" class="icon palette-key" aria-label="Open command palette (Ctrl+K)" aria-keyshortcuts="Control+K Meta+K" @click="openPalette">
        <Command :size="17" aria-hidden="true" />
      </button>
      <button type="button" class="menu" aria-haspopup="dialog" @click="openPalette">Menu</button>
      <NuxtLink class="lab-button contact" :to="{ path: '/', hash: '#contact' }" @click="go($event, 'contact')">Contact</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Sun, Moon, Command } from 'lucide-vue-next'
import { SECTIONS } from '~/data/portfolio'

const props = withDefaults(defineProps<{ variant?: 'rail' | 'bar' }>(), { variant: 'bar' })

const route = useRoute()
const { theme, toggle } = useTheme()
const palette = useState('lab-palette', () => false)
const openPalette = () => { palette.value = true }

const linkSections = SECTIONS.filter(s => s.id !== 'contact')
const active = ref('')

const go = (e: MouseEvent, id: string) => {
  if (route.path !== '/') return
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  history.replaceState(history.state, '', '#' + id)
}

const toTop = (e: MouseEvent) => {
  if (route.path !== '/') return
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let io: IntersectionObserver | null = null
onMounted(() => {
  if (props.variant !== 'rail') return
  io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) active.value = entry.target.id
  }, { rootMargin: '-45% 0px -50% 0px' })
  for (const s of SECTIONS) {
    const el = document.getElementById(s.id)
    if (el) io.observe(el)
  }
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.rail {
  z-index: 40;
  height: var(--rail-h);
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 var(--margin);
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-text);
  transition: background-color 400ms ease, color 400ms ease;
}

/* On the homepage the rail crosses the middle of the first screen and docks at the top. */
.rail--rail {
  position: sticky;
  top: 0;
  margin-top: calc(-50svh - var(--rail-h) / 2);
}
.rail--bar {
  position: fixed;
  inset: 0 0 auto;
}

.name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--step-head);
  letter-spacing: -0.035em;
  line-height: 1;
  white-space: nowrap;
  padding-top: 0.12em;
}
.name a { text-decoration: none; color: inherit; }

.links {
  display: flex;
  gap: 26px;
  margin-left: auto;
  font-size: 16px;
}
.links a {
  color: var(--muted);
  text-decoration: none;
  padding: 8px 0;
  transition: color var(--dur-hover) ease;
}
.links a:hover,
.links a[aria-current] { color: var(--ink); }
.links a[aria-current] {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 8px;
  text-decoration-color: var(--accent);
}

.tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon,
.menu {
  display: inline-grid;
  place-items: center;
  min-width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  transition: background-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}
.icon:hover,
.menu:hover { background: var(--surface-2); }
.icon:active,
.menu:active { transform: scale(0.94); }

.menu {
  display: none;
  padding: 0 12px;
  font: 600 16px var(--font-text);
}

.contact { margin-left: 10px; min-height: 40px; }

@media (max-width: 1180px) {
  .links, .palette-key { display: none; }
  .menu { display: inline-grid; }
  .tools { margin-left: auto; }
}

@media (max-width: 640px) {
  .rail { gap: 12px; }
  .contact { display: none; }
  .name { font-size: 28px; }
}
</style>
