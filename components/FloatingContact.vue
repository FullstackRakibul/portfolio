<template>
  <Transition name="fc-away">
    <div v-show="!away || open" class="fc" :class="{ open }" @keydown.esc.stop="close(true)">
      <UiButton
        ref="trigger" variant="outline" shape="pill" class="pill" :aria-expanded="open" aria-controls="calcifer-panel"
        aria-haspopup="dialog" @click="open ? close(true) : (open = true)"
      >
        <ChatFlame />
        <span class="pill-t">{{ FLOATING_CONTACT.label }}</span>
        <ChevronUp class="chev" :size="16" aria-hidden="true" />
      </UiButton>

      <Transition name="fc-panel">
        <ChatPanel v-if="open" @close="close" />
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ChevronUp } from 'lucide-vue-next'
import { FLOATING_CONTACT } from '~/data/contact'

// "Ask Calcifer": opens the chat panel (components/chat/Panel.vue). The conversation survives closing.
const trigger = ref<ComponentPublicInstance | null>(null)
const open = ref(false)
const away = ref(true)

// Shared with the back-to-top button, which stacks above this one and steps aside while it is open.
const dock = useState('floating-dock', () => ({ contact: false, open: false }))
watchEffect(() => { dock.value = { contact: !away.value || open.value, open: open.value } })

const close = (returnFocus: boolean) => {
  if (!open.value) return
  open.value = false
  if (returnFocus) (trigger.value?.$el as HTMLElement | undefined)?.focus()
}

/* Stay away while an on-page contact action (the hero's button) is visible, unless the chat is open. */
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

// The button stays in the corner on every section; the footer keeps room for it (Footer.vue).
const nuxtApp = useNuxtApp()
const offFinish = nuxtApp.hook('page:finish', () => nextTick(watchAnchors))

onMounted(watchAnchors)
onBeforeUnmount(() => {
  offFinish()
  io?.disconnect()
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
  /* Only the visible controls take the pointer, so the back-to-top button stacked above stays clickable. */
  pointer-events: none;
}
.fc .pill { pointer-events: auto; }
/* Away (the hero's own contact button is on screen): out of the page entirely, after a short fade. */
.fc-away-enter-active,
.fc-away-leave-active { transition: opacity 200ms ease; }
.fc-away-enter-from,
.fc-away-leave-to { opacity: 0; }

/* The pill keeps its shape: the card surface, a 1px border, one soft shadow; the flame takes the photo's place. */
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
.chev { color: var(--muted-foreground); transition: transform 200ms var(--ease-spring); }
.open .chev { transform: rotate(180deg); }

/* The panel grows out of the pill's corner. */
.fc-panel-enter-active { transition: opacity 160ms ease, transform 220ms var(--ease-spring); }
.fc-panel-leave-active { transition: opacity 120ms ease, transform 120ms ease; }
.fc-panel-enter-from,
.fc-panel-leave-to { opacity: 0; transform: translateY(10px) scale(0.97); }
.fc :deep(.panel) { transform-origin: right bottom; }

@media (max-width: 639px) {
  .fc { right: 16px; bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .chev { transition: none; }
  .open .chev, .fc-away-enter-from .pill, .fc-away-leave-to .pill, .fc-panel-enter-from, .fc-panel-leave-to { transform: none; }
}
</style>
