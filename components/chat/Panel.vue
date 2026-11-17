<template>
  <section id="calcifer-panel" class="panel" role="dialog" aria-modal="false" aria-label="Chat with Calcifer">
    <header class="head">
      <ChatFlame />
      <div class="who">
        <p class="name">{{ CALCIFER.name }}</p>
        <p class="status"><span class="dot" aria-hidden="true" />{{ CALCIFER.status }}</p>
      </div>
      <div class="tools">
        <button type="button" class="ghost" aria-label="New conversation" title="New conversation" :disabled="!messages.length" @click="newChat">
          <RotateCcw :size="18" aria-hidden="true" />
        </button>
        <button type="button" class="ghost" aria-label="Close chat" title="Close" @click="emit('close', true)">
          <X :size="18" aria-hidden="true" />
        </button>
      </div>
    </header>

    <div ref="list" class="list" role="log" aria-live="polite" :aria-busy="streaming">
      <p class="author" aria-hidden="true">{{ CALCIFER.name }}</p>
      <div class="msg assistant"><span class="sr-only">{{ CALCIFER.name }}: </span>{{ CALCIFER.greeting }}</div>
      <ul v-if="!messages.length" class="chips" aria-label="Suggested questions">
        <li v-for="s in CALCIFER.suggestions" :key="s"><button type="button" class="chip" @click="ask(s)">{{ s }}</button></li>
      </ul>

      <div v-for="m in messages" :key="m.id" class="msg" :class="m.role">
        <span class="sr-only">{{ m.role === 'user' ? 'You' : CALCIFER.name }}: </span>{{ m.text }}
        <span v-if="m.links?.length" class="links">
          <template v-for="l in m.links" :key="l.label">
            <NuxtLink v-if="l.to" :to="l.to" @click="emit('close', false)">{{ l.label }}</NuxtLink>
            <a v-else :href="l.href" :target="l.href?.startsWith('mailto:') ? undefined : '_blank'" rel="noopener">{{ l.label }}</a>
          </template>
        </span>
      </div>

      <div v-if="typing" class="msg assistant typing">
        <span class="sr-only">{{ CALCIFER.name }} is typing</span><i /><i /><i />
      </div>
    </div>

    <form class="composer" @submit.prevent="ask(draft)">
      <input
        ref="input" v-model="draft" type="text" aria-label="Message Calcifer"
        placeholder="Ask Calcifer about Rakibul’s work…" autocomplete="off" enterkeyhint="send" maxlength="500"
      >
      <button type="submit" class="send" aria-label="Send" :disabled="!draft.trim() || streaming">
        <ArrowUp :size="20" aria-hidden="true" />
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ArrowUp, RotateCcw, X } from 'lucide-vue-next'
import { CALCIFER } from '~/data/calcifer'

const emit = defineEmits<{ close: [returnFocus: boolean] }>()
const { messages, typing, streaming, send, reset } = useCalcifer()
const reduce = useReducedMotion()
const draft = ref('')
const list = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

const ask = (text: string) => {
  if (!text.trim() || streaming.value) return
  send(text)
  draft.value = ''
  input.value?.focus()
}
const newChat = () => { reset(); draft.value = ''; input.value?.focus() }

// Keep the newest message in view, including while a reply is being written out.
watch([() => messages.value.length, () => messages.value.at(-1)?.text, typing], async () => {
  await nextTick()
  list.value?.scrollTo({ top: list.value.scrollHeight, behavior: reduce.value ? 'auto' : 'smooth' })
})

onMounted(() => {
  input.value?.focus()
  list.value?.scrollTo({ top: list.value.scrollHeight })
})
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: min(540px, calc(100dvh - 120px));
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border); /* taste-skill-ignore: a floating panel's edge */
  border-radius: 16px;
  box-shadow: var(--shadow-float); /* taste-skill-ignore: the panel truly floats */
  pointer-events: auto;
  color: var(--foreground);
}

.head {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-3) var(--s-3) var(--s-3) var(--s-4);
  border-bottom: 1px solid var(--border); /* taste-skill-ignore: header and conversation */
}
.who { min-width: 0; }
.name { font-size: 15px; font-weight: 600; line-height: 1.3; }
.status { display: flex; align-items: center; gap: 6px; font-size: 13px; line-height: 1.3; color: var(--muted-foreground); white-space: nowrap; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--primary); }
.tools { display: flex; gap: var(--s-1); margin-left: auto; }
.ghost {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: background-color var(--dur-hover) ease, color var(--dur-hover) ease;
}
.ghost:hover:not(:disabled) { background: var(--muted); color: var(--foreground); }
.ghost:disabled { opacity: 0.4; cursor: default; }

.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--s-4);
}
.author { font-size: 12px; font-weight: 500; color: var(--muted-foreground); margin-bottom: -2px; }
.msg {
  max-width: 85%;
  padding: 10px 14px;
  font-size: 14.5px;
  line-height: 1.5;
  border-radius: 14px;
  overflow-wrap: anywhere;
}
.msg.assistant {
  align-self: flex-start;
  background: color-mix(in srgb, var(--muted) 45%, var(--card));
  border: 1px solid var(--border); /* taste-skill-ignore: assistant bubble */
  border-bottom-left-radius: 4px;
}
.msg.user {
  align-self: flex-end;
  background: var(--primary);
  color: var(--primary-foreground);
  border-bottom-right-radius: 4px;
}
.links { display: flex; flex-wrap: wrap; gap: 4px var(--s-3); margin-top: var(--s-2); }
.links a { color: var(--foreground); text-decoration: underline; text-underline-offset: 3px; padding-block: 2px; }
.links a:hover { color: var(--primary); }

.chips { display: flex; flex-wrap: wrap; gap: var(--s-2); margin: var(--s-1) 0 0; padding: 0; list-style: none; }
.chip {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border); /* taste-skill-ignore: suggestion chips */
  border-radius: 999px;
  background: transparent;
  color: var(--foreground);
  font: 500 14px / 1 var(--font-text);
  cursor: pointer;
  transition: border-color var(--dur-hover) ease, background-color var(--dur-hover) ease;
}
.chip:hover { border-color: var(--ring); background: var(--muted); }

.typing { display: flex; gap: 5px; padding: 14px; }
.typing i { width: 6px; height: 6px; border-radius: 50%; background: var(--muted-foreground); animation: pulse 1.2s ease-in-out infinite; }
.typing i:nth-of-type(2) { animation-delay: 0.15s; }
.typing i:nth-of-type(3) { animation-delay: 0.3s; }
@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); } 40% { opacity: 1; transform: scale(1); } }

.composer {
  display: flex;
  gap: var(--s-2);
  padding: var(--s-3);
  border-top: 1px solid var(--border); /* taste-skill-ignore: conversation and composer */
}
.composer input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 14px;
  font: 16px var(--font-text);
  color: var(--foreground);
  background: var(--background-deep);
  border: 1px solid var(--border); /* taste-skill-ignore: a real form field */
  border-radius: var(--radius);
}
.composer input::placeholder { color: var(--muted-foreground); }
.composer input:focus { outline: none; }
.composer input:focus-visible { outline: 2px solid var(--ring); outline-offset: 1px; }
.send {
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: var(--radius);
  background: var(--primary);
  color: var(--primary-foreground);
  cursor: pointer;
  transition: opacity var(--dur-hover) ease, transform var(--dur-press) ease;
}
.send:active:not(:disabled) { transform: scale(0.96); }
.send:disabled { opacity: 0.4; cursor: not-allowed; }

.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

/* Phones: a full-width sheet from the bottom edge. */
@media (max-width: 599px) {
  .panel {
    position: fixed;
    inset: auto 0 0 0;
    width: auto;
    height: min(85dvh, 640px);
    border-radius: 16px 16px 0 0;
    border-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
  }
}
@media (prefers-reduced-motion: reduce) {
  .typing i { animation: none; opacity: 0.6; }
}
</style>
