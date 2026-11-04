<template>
  <Transition name="fc-away">
    <div
      v-if="actions.length" v-show="!away" ref="root" class="fc" :class="{ open }"
      @keydown.esc.stop="close(true)" @focusout="onFocusOut"
    >
      <button
        ref="trigger" type="button" class="pill" :aria-expanded="open" aria-controls="fc-actions"
        @click="open ? close(true) : show()"
      >
        <img class="avatar" :src="FLOATING_CONTACT.avatar" alt="" width="40" height="40" decoding="async" loading="lazy">
        <span class="pill-t">{{ FLOATING_CONTACT.label }}</span>
        <ChevronUp class="chev" :size="16" aria-hidden="true" />
      </button>

      <ul id="fc-actions" class="actions" :inert="!open || undefined" aria-label="Ways to get in touch">
        <li v-for="(a, i) in actions" :key="a.id" :style="{ '--i': actions.length - 1 - i }">
          <a
            :ref="el => { if (i === 0) first = el as HTMLAnchorElement }" class="act" :class="a.kind"
            :href="a.href" :target="a.external ? '_blank' : undefined" :rel="a.external ? 'noopener' : undefined"
            @click="close(false)"
          >
            <component :is="a.icon" :size="17" aria-hidden="true" />
            <span>{{ a.text }}</span>
            <span v-if="a.external" class="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { CalendarDays, ChevronUp, Mail, Send } from 'lucide-vue-next'
import { FLOATING_CONTACT as C } from '~/data/contact'

const FLOATING_CONTACT = C

// Only actions with a real destination are shown.
const actions = [
  { id: 'email', text: 'Send email', href: C.email ? `mailto:${C.email}` : '', icon: Mail, kind: 'primary', external: false },
  { id: 'booking', text: 'Book a call', href: C.booking, icon: CalendarDays, kind: 'soft', external: true },
  { id: 'chat', text: 'Chat', href: C.chat, icon: Send, kind: 'soft', external: true },
].filter(a => a.href)

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
let first: HTMLAnchorElement | null = null
const open = ref(false)
const away = ref(true)

// Shared with the back-to-top button, which stacks above this one and steps aside while it is open.
const dock = useState('floating-dock', () => ({ contact: false, open: false }))
watchEffect(() => { dock.value = { contact: actions.length > 0 && !away.value, open: open.value } })

const show = async () => {
  open.value = true
  await nextTick()
  first?.focus()
}
const close = (returnFocus: boolean) => {
  if (!open.value) return
  open.value = false
  if (returnFocus) trigger.value?.focus()
}
const onFocusOut = (e: FocusEvent) => {
  if (open.value && !root.value?.contains(e.relatedTarget as Node | null)) close(false)
}
const onPointerDown = (e: PointerEvent) => {
  if (open.value && !root.value?.contains(e.target as Node)) close(false)
}

/* Stay away while an on-page contact action (the hero's button) is visible. */
let io: IntersectionObserver | null = null
const watchAnchors = () => {
  io?.disconnect()
  const anchors = [...document.querySelectorAll('[data-floating-contact-hide]')]
  if (!anchors.length) { away.value = false; return }
  const seen = new Set<Element>()
  io = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)
    away.value = seen.size > 0
  })
  anchors.forEach(a => io!.observe(a))
}
watch(away, (v) => { if (v) close(false) })

// The button stays in the corner on every section; the footer keeps room for it (Footer.vue).
const nuxtApp = useNuxtApp()
const offFinish = nuxtApp.hook('page:finish', () => nextTick(watchAnchors))

onMounted(() => {
  watchAnchors()
  document.addEventListener('pointerdown', onPointerDown)
})
onBeforeUnmount(() => {
  offFinish()
  io?.disconnect()
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<style scoped>
.fc {
  /* Dark theme (the site default). */
  --fc-pill: #121a1c;
  --fc-pill-ink: #ffffff;
  --fc-border: rgb(255 255 255 / 0.08);
  --fc-primary: #ffffff;
  --fc-primary-ink: #000000;
  /* rgba(255,255,255,0.08) over the pill, made solid so it reads over any part of the page. */
  --fc-soft: #272e30;
  --fc-soft-ink: #ffffff;
  --fc-ring: #5eead4;
  --fc-focus: #5eead4;
  --fc-ease: cubic-bezier(0.34, 1.4, 0.64, 1);

  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 39;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 10px;
  font-family: var(--font-text, system-ui, sans-serif);
  /* The box also spans the folded actions above the pill; only the visible controls take the pointer,
     so the back-to-top button stacked above stays clickable. */
  pointer-events: none;
}
.pill,
.fc.open .act { pointer-events: auto; }
[data-theme="light"] .fc {
  --fc-pill: #111111;
  --fc-pill-ink: #ffffff;
  --fc-border: rgb(255 255 255 / 0.1);
  --fc-primary: #000000;
  --fc-primary-ink: #ffffff;
  --fc-soft: #ebebeb;
  --fc-soft-ink: #000000;
  --fc-focus: #0a6a62;
}
/* Away (the hero's own contact button is on screen): out of the page entirely, after a short fade. */
.fc-away-enter-active,
.fc-away-leave-active { transition: opacity 200ms ease; }
.fc-away-enter-from,
.fc-away-leave-to { opacity: 0; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 5px 16px 5px 5px;
  border: 1px solid var(--fc-border); /* taste-skill-ignore: the hairline edge the brief specifies */
  border-radius: 999px;
  background: var(--fc-pill);
  color: var(--fc-pill-ink);
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 14px 34px -16px rgb(0 0 0 / 0.6); /* taste-skill-ignore: a floating control truly floats */
  transition:
    transform 200ms var(--fc-ease),
    background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
.fc-away-enter-from .pill,
.fc-away-leave-to .pill { transform: translateY(10px) scale(0.96); }
.pill:hover { transform: translateY(-2px); }
.pill:active { transform: translateY(0) scale(0.97); }
.avatar {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid var(--fc-ring);
  object-fit: cover;
  object-position: 50% 22%;
  background: var(--fc-soft);
}
.chev { opacity: 0.7; transition: transform 200ms var(--fc-ease); }
.open .chev { transform: rotate(180deg); }

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.actions li {
  opacity: 0;
  transform: translateY(10px) scale(0.94);
  transform-origin: right bottom;
  transition: opacity 160ms ease, transform 200ms var(--fc-ease);
  transition-delay: calc(var(--i) * 30ms);
}
.open .actions li { opacity: 1; transform: none; }
.fc:not(.open) .actions { visibility: hidden; transition: visibility 0s linear 220ms; }

.act {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 20px 0 16px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 10px 26px -14px rgb(0 0 0 / 0.55); /* taste-skill-ignore: floating actions */
  transition: transform 160ms var(--fc-ease), background-color 200ms ease, color 200ms ease;
}
.act:hover { transform: translateY(-2px); }
.act.primary { background: var(--fc-primary); color: var(--fc-primary-ink); }
.act.soft { background: var(--fc-soft); color: var(--fc-soft-ink); }

.pill:focus-visible,
.act:focus-visible { outline: 2px solid var(--fc-focus); outline-offset: 3px; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 639px) {
  .fc { right: 16px; bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .pill, .act, .chev { transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease; }
  .pill:hover, .pill:active, .act:hover, .open .chev,
  .fc-away-enter-from .pill, .fc-away-leave-to .pill { transform: none; }
  .actions li { transform: none; transition: opacity 160ms linear; transition-delay: 0ms; }
}
</style>
