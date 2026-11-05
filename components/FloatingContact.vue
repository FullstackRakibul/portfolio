<template>
  <Transition name="fc-away">
    <div
      v-if="actions.length" v-show="!away" ref="root" class="fc" :class="{ open }"
      @keydown.esc.stop="close(true)" @focusout="onFocusOut"
    >
      <UiButton
        ref="trigger" variant="outline" shape="pill" class="pill" :aria-expanded="open" aria-controls="fc-actions"
        @click="open ? close(true) : show()"
      >
        <img class="avatar" :src="FLOATING_CONTACT.avatar" alt="" width="40" height="40" decoding="async" loading="lazy">
        <span class="pill-t">{{ FLOATING_CONTACT.label }}</span>
        <ChevronUp class="chev" :size="16" aria-hidden="true" />
      </UiButton>

      <ul id="fc-actions" class="actions" :inert="!open || undefined" aria-label="Ways to get in touch">
        <li v-for="(a, i) in actions" :key="a.id" :style="{ '--i': actions.length - 1 - i }">
          <UiButton
            :ref="el => { if (i === 0) first = el as ComponentPublicInstance | null }" class="act" size="lg" shape="pill"
            :variant="a.kind === 'primary' ? 'default' : 'secondary'"
            :href="a.href" :target="a.external ? '_blank' : undefined" :rel="a.external ? 'noopener' : undefined"
            @click="close(false)"
          >
            <template #leading><component :is="a.icon" aria-hidden="true" /></template>
            {{ a.text }}<span v-if="a.external" class="sr-only"> (opens in a new tab)</span>
          </UiButton>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
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
const trigger = ref<ComponentPublicInstance | null>(null)
let first: ComponentPublicInstance | null = null
const focusEl = (c: ComponentPublicInstance | null) => (c?.$el as HTMLElement | undefined)?.focus()
const open = ref(false)
const away = ref(true)

// Shared with the back-to-top button, which stacks above this one and steps aside while it is open.
const dock = useState('floating-dock', () => ({ contact: false, open: false }))
watchEffect(() => { dock.value = { contact: actions.length > 0 && !away.value, open: open.value } })

const show = async () => {
  open.value = true
  await nextTick()
  focusEl(first)
}
const close = (returnFocus: boolean) => {
  if (!open.value) return
  open.value = false
  if (returnFocus) focusEl(trigger.value)
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
.fc .pill,
.fc.open .act { pointer-events: auto; }
/* Away (the hero's own contact button is on screen): out of the page entirely, after a short fade. */
.fc-away-enter-active,
.fc-away-leave-active { transition: opacity 200ms ease; }
.fc-away-enter-from,
.fc-away-leave-to { opacity: 0; }

/* The pill keeps its shape and avatar: the card surface, a 1px border, one soft shadow. */
.fc .pill {
  height: 52px;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  background: var(--card);
  font-size: 15px;
  box-shadow: var(--shadow-float); /* taste-skill-ignore: a floating control truly floats */
}
.fc .pill:hover { background: var(--muted); }
.fc-away-enter-from .pill,
.fc-away-leave-to .pill { transform: translateY(10px) scale(0.96); }
.avatar {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid var(--border); /* taste-skill-ignore: the avatar's edge */
  object-fit: cover;
  object-position: 50% 22%;
  background: var(--muted);
}
.chev { color: var(--muted-foreground); transition: transform 200ms var(--ease-spring); }
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
  transition: opacity 160ms ease, transform 200ms var(--ease-spring);
  transition-delay: calc(var(--i) * 30ms);
}
.open .actions li { opacity: 1; transform: none; }
.fc:not(.open) .actions { visibility: hidden; transition: visibility 0s linear 220ms; }
.fc .act { box-shadow: var(--shadow-float); } /* taste-skill-ignore: floating actions */

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
  .chev { transition: none; }
  .open .chev, .fc-away-enter-from .pill, .fc-away-leave-to .pill { transform: none; }
  .actions li { transform: none; transition: opacity 160ms linear; transition-delay: 0ms; }
}
</style>
