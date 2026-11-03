<template>
  <section id="contact" v-reveal class="contact" aria-labelledby="contact-h">
    <div ref="board" class="inner lab-wrap" @transitionend="layout">
      <svg class="wires" :viewBox="`0 0 ${size.w} ${size.h}`" :width="size.w" :height="size.h" aria-hidden="true">
        <path
          v-for="(d, i) in wires" :key="i" :ref="el => (paths[i] = el as SVGPathElement)"
          :d="d" :class="{ lit: lit === i || (i === 0 && message.trim()) }"
        />
        <circle v-for="(p, i) in pulses" :key="'p' + i" class="pulse" r="4.5" :cx="p.x" :cy="p.y" :style="{ opacity: p.on ? 1 : 0 }" />
      </svg>

      <div class="ask">
        <h2 id="contact-h" class="prompt" data-reveal>Have an interesting problem?</h2>
        <p class="answer" data-reveal>Let’s engineer a solution.</p>
        <form class="field" data-reveal @submit.prevent="send">
          <label for="contact-msg" class="sr-only">Describe the problem</label>
          <input
            id="contact-msg" v-model="message" type="text" placeholder="Describe the problem in a sentence"
            aria-describedby="contact-next" autocomplete="off" @input="typed"
          >
          <button ref="sender" v-magnetic="3" type="submit" aria-label="Write the email">
            <ArrowRight :size="20" aria-hidden="true" />
          </button>
        </form>
        <p id="contact-next" class="next" data-reveal>Opens your email app with this as the first line, addressed to me.</p>
      </div>

      <ul class="channels" data-reveal aria-label="Other ways to reach me">
        <li v-for="(c, i) in channels" :key="c.label" @pointerenter="touch(i)" @pointerleave="lit = -1" @focusin="touch(i)" @focusout="lit = -1">
          <span :ref="el => (nodes[i] = el as HTMLElement)" class="node" :class="{ lit: lit === i }" aria-hidden="true" />
          <span class="label">{{ c.label }}</span>
          <a class="lab-link" :href="c.href" :target="c.external ? '_blank' : undefined" :rel="c.external ? 'noopener' : undefined">{{ c.text }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { CONTACT } from '~/data/portfolio'

const channels = [
  { label: 'Email', text: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false },
  { label: 'GitHub', text: 'github.com/fullstackrakibul', href: CONTACT.github, external: true },
  { label: 'LinkedIn', text: 'linkedin.com/in/fullstackrakibul', href: CONTACT.linkedin, external: true },
  { label: 'Portfolio', text: 'rabbitic.com', href: CONTACT.website, external: true },
]

const message = ref('')
const lit = ref(-1)
const board = ref<HTMLElement | null>(null)
const sender = ref<HTMLElement | null>(null)
const nodes: HTMLElement[] = []
const paths: SVGPathElement[] = []
const size = reactive({ w: 1000, h: 400 })
const wires = ref<string[]>([])
const pulses = reactive(channels.map(() => ({ x: 0, y: 0, on: false })))
const reduce = useReducedMotion()

// Wires run from the send button to each channel: the message goes out along the first.
const layout = () => {
  const b = board.value, s = sender.value
  if (!b || !s) return
  const r = b.getBoundingClientRect()
  size.w = Math.round(r.width); size.h = Math.round(r.height)
  const sr = s.getBoundingClientRect()
  const a = { x: sr.right - r.left, y: sr.top + sr.height / 2 - r.top }
  wires.value = nodes.map((n) => {
    const nr = n.getBoundingClientRect()
    const c = { x: nr.left + nr.width / 2 - r.left, y: nr.top + nr.height / 2 - r.top }
    const mx = (a.x + c.x) / 2
    return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${c.y} ${c.x} ${c.y}`
  })
}

const fire = (i: number) => {
  const path = paths[i]
  if (!path || reduce.value) return
  const len = path.getTotalLength()
  const t0 = performance.now(), ms = 650
  const p = pulses[i]!
  const step = (now: number) => {
    const f = Math.min(1, (now - t0) / ms)
    const pt = path.getPointAtLength(len * (1 - (1 - f) ** 2))
    p.x = pt.x; p.y = pt.y; p.on = f < 1
    if (f < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const touch = (i: number) => { lit.value = i; fire(i) }
let lastType = 0
const typed = () => {
  const now = performance.now()
  if (now - lastType > 420) { lastType = now; fire(0) }
}

const send = () => {
  fire(0)
  const first = message.value.trim()
  const subject = first ? `A problem worth engineering: ${first.slice(0, 60)}` : 'A problem worth engineering'
  const body = `${first || 'Hello Rakibul,'}\n\n`
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

let ro: ResizeObserver | null = null
onMounted(() => {
  layout()
  ro = new ResizeObserver(layout)
  if (board.value) ro.observe(board.value)
  document.fonts?.ready.then(layout)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
.contact {
  margin-top: var(--section-gap);
  padding: clamp(96px, 12vw, 176px) 0;
  background: var(--surface);
}
.inner {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap);
  align-items: center;
}

.wires {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.wires path {
  fill: none;
  stroke: rgb(var(--field) / 0.22);
  stroke-width: 1.5;
  transition: stroke 300ms ease, stroke-width 300ms ease;
}
.wires path.lit { stroke: var(--accent); stroke-width: 2; }
.pulse { fill: var(--accent); transition: opacity 160ms ease; }

.ask { grid-column: 1 / span 6; position: relative; }
.prompt {
  font-size: var(--step-head);
  letter-spacing: -0.03em;
  line-height: 1;
  max-width: 14ch;
  text-wrap: balance;
}
.answer { margin-top: var(--s-4); font-size: var(--step-lead); line-height: 1.3; }
.field { position: relative; margin-top: var(--s-7); max-width: 560px; }
input {
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  padding: 0 72px 0 20px;
  border: 0;
  background: var(--bg);
  color: var(--ink);
  font: 17px var(--font-text);
  outline: none;
  transition: background-color var(--dur-hover) ease;
}
input::placeholder { color: var(--muted); }
input:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 0;
  background: var(--ink);
  color: var(--bg);
  cursor: pointer;
  transition: background-color var(--dur-hover) ease;
}
button:hover { background: var(--accent); color: var(--accent-ink); }
.next { margin-top: var(--s-4); font-size: var(--step-small); color: var(--muted); }

.channels {
  grid-column: 8 / -1;
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--s-5);
}
.channels li { display: grid; grid-template-columns: 14px 1fr; column-gap: var(--s-4); align-items: baseline; }
.node {
  grid-row: span 2;
  align-self: center;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid var(--muted);
  background: var(--surface);
  transition: background-color var(--dur-hover) ease, border-color var(--dur-hover) ease, transform 420ms var(--ease-spring);
}
.node.lit { background: var(--accent); border-color: var(--accent); transform: scale(1.25); }
.label { font-size: var(--step-small); color: var(--muted); }
.channels a { font-size: var(--step-body); overflow-wrap: anywhere; }

@media (prefers-reduced-motion: reduce) {
  .node { transition: none; }
}
@media (max-width: 899px) {
  .inner { grid-template-columns: 1fr; row-gap: var(--s-8); }
  .ask, .channels { grid-column: 1; }
  .wires { display: none; }
  input { height: 60px; }
  button { top: 8px; }
}
</style>
