<template>
  <dialog
    id="site-menu"
    ref="dialog"
    class="menu"
    :class="{ shown }"
    aria-label="Site menu"
    @cancel.prevent="close()"
  >
    <div class="top lab-wrap">
      <NuxtLink to="/" class="brand" @click="close()">Rakibul H. Rabbi</NuxtLink>
      <button ref="closer" type="button" class="x" aria-label="Close menu" @click="close()">
        <X :size="22" aria-hidden="true" />
      </button>
    </div>

    <nav class="list lab-wrap" aria-label="Sections">
      <a
        v-for="(s, i) in sections"
        :key="s.id"
        :href="'/#/' + s.id"
        :style="{ '--i': i }"
        :aria-current="active === s.id ? 'location' : undefined"
        @click.prevent="pick(s.id)"
      >
        <span class="node" aria-hidden="true" />
        {{ s.label }}
      </a>
    </nav>

    <div class="foot lab-wrap" :style="{ '--i': sections.length }">
      <ul>
        <li><a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a></li>
        <li><a :href="CONTACT.github" target="_blank" rel="noopener" data-cursor-label="Open ↗">GitHub</a></li>
        <li><a :href="CONTACT.linkedin" target="_blank" rel="noopener" data-cursor-label="Open ↗">LinkedIn</a></li>
        <li><NuxtLink to="/resume" @click="close()">Résumé</NuxtLink></li>
      </ul>
      <a class="lab-button" href="/#/contact" @click.prevent="pick('contact')">Let’s talk</a>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { CONTACT } from '~/data/portfolio'

defineProps<{ active: string; sections: { id: string; label: string }[] }>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ go: [id: string] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const closer = ref<HTMLButtonElement | null>(null)
const shown = ref(false)
let timer = 0
let after: (() => void) | null = null

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const lock = (on: boolean) => { document.documentElement.style.overflow = on ? 'hidden' : '' }

const show = () => {
  const d = dialog.value
  if (!d || d.open) return
  clearTimeout(timer)
  d.showModal()
  lock(true)
  closer.value?.focus()
  requestAnimationFrame(() => { shown.value = true })
}

const hide = () => {
  const d = dialog.value
  if (!d?.open) return
  shown.value = false
  timer = window.setTimeout(() => {
    d.close()
    lock(false)
    after?.()
    after = null
  }, reduce() ? 0 : 280)
}

const close = (then?: () => void) => {
  after = then ?? null
  open.value = false
}

// Close first, then move: the page must be scrollable again before it scrolls.
const pick = (id: string) => close(() => emit('go', id))

watch(open, v => (v ? show() : hide()))

let mq: MediaQueryList | null = null
const onWide = (e: MediaQueryListEvent) => { if (e.matches) open.value = false }
onMounted(() => {
  mq = matchMedia('(min-width: 1080px)')
  mq.addEventListener('change', onWide)
})
onBeforeUnmount(() => {
  mq?.removeEventListener('change', onWide)
  clearTimeout(timer)
  lock(false)
})
</script>

<style scoped>
.menu {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0 0 max(24px, env(safe-area-inset-bottom));
  border: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-text);
  overflow-y: auto;
  overscroll-behavior: contain;
  opacity: 0;
  transition: opacity 260ms ease;
}
.menu[open] { display: flex; flex-direction: column; }
.menu.shown { opacity: 1; }
.menu::backdrop { background: transparent; }

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--header-h);
}
.brand {
  font: 700 var(--step-body) / 1 var(--font-display);
  letter-spacing: -0.02em;
  color: inherit;
  text-decoration: none;
  padding: 12px 0 10px;
  min-height: 44px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
}
.x {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-right: -2px;
  border: 0;
  background: var(--surface-2);
  color: var(--ink);
  cursor: pointer;
  transition: transform var(--dur-press) var(--ease-out);
}
.x:active { transform: scale(0.92); }

.list {
  display: grid;
  margin-top: clamp(24px, 6svh, 64px);
}
.list a,
.foot {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 360ms ease calc(var(--i) * 45ms + 60ms), transform 520ms var(--ease-out) calc(var(--i) * 45ms + 60ms);
}
.shown .list a,
.shown .foot { opacity: 1; transform: none; }

.list a {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 60px;
  font: 700 clamp(2rem, 9vw, 3rem) / 1 var(--font-display);
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}
.node {
  width: 10px;
  height: 10px;
  flex: none;
  border: 2px solid var(--muted);
  border-radius: 50%;
  transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease;
}
.list a[aria-current] .node { background: var(--accent); border-color: var(--accent); }
.list a:active .node { background: var(--ink); border-color: var(--ink); }

.foot {
  margin-top: auto;
  padding-top: 40px;
  display: grid;
  gap: 24px;
}
.foot ul {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 16px;
}
.foot ul a {
  display: inline-block;
  padding: 10px 0;
  color: var(--muted);
  text-decoration: none;
}
.foot .lab-button { width: 100%; min-height: 52px; }

@media (prefers-reduced-motion: reduce) {
  .menu, .list a, .foot { transition: none; }
}
</style>
