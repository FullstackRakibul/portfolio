<template>
  <div ref="stage" class="stage">
    <canvas ref="canvas" class="field" aria-hidden="true" />

    <div class="copy lab-wrap">
      <h1 ref="title" class="name">
        <span>Rakibul H.</span> <span>Rabbi</span>
      </h1>

      <img
        ref="portrait"
        class="portrait"
        :class="{ 'is-drawn': drawn }"
        src="/assets/img/rakibul-hasan-passport-image.jpg"
        width="472"
        height="591"
        alt="Portrait of Rakibul H. Rabbi"
        fetchpriority="high"
        decoding="async"
      >

      <div ref="lower" v-reveal class="lower">
        <p class="role" data-reveal>Full-Stack Engineer · Systems Architect · Software Craftsman</p>
        <p class="statement" data-reveal>
          Building scalable systems, engineering intelligent tools, and exploring the boundaries of technology.
        </p>
        <div class="actions" data-reveal>
          <a v-magnetic="5" class="lab-button" href="#contact">Start a conversation <ArrowRight :size="18" aria-hidden="true" /></a>
          <a class="lab-link" href="#projects">See the work</a>
        </div>
      </div>

      <p v-if="characters" class="caption">
        Self-portrait in <span class="lab-num">{{ characters.toLocaleString('en-US') }}</span> characters
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { createLabField } from '~/utils/labField'

const stage = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const portrait = ref<HTMLImageElement | null>(null)
const title = ref<HTMLElement | null>(null)
const lower = ref<HTMLElement | null>(null)
const drawn = ref(false)
const characters = ref(0)

let field: { destroy(): void } | null = null

onMounted(() => {
  if (!stage.value || !canvas.value || !portrait.value) return
  field = createLabField({
    canvas: canvas.value,
    stage: stage.value,
    portrait: portrait.value,
    quiet: [title.value, lower.value].filter(Boolean) as HTMLElement[],
    onReady: (n) => { characters.value = n; drawn.value = true },
  })
})

onBeforeUnmount(() => field?.destroy())
</script>

<style scoped>
.stage {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  touch-action: pan-y;
  /* The portrait keeps the colours it was drawn in, whatever the page theme. */
  --field: 220 222 223;
  --signal: #9dbad6;
}
:global([data-theme="light"]) .stage {
  --field: 42 43 45;
  --signal: #3a6286;
}

.field {
  position: absolute;
  inset: 0;
  display: block;
}

/* Desktop: the copy holds the container's left edge, the portrait its right edge. */
.copy {
  --ph: min(80svh, 860px);
  --pw: calc(var(--ph) * 0.7986);
  position: relative;
  min-height: 100svh;
  box-sizing: border-box;
  padding: calc(var(--header-h) + 24px) 0 clamp(56px, 9svh, 96px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.name {
  font-size: var(--step-display);
  letter-spacing: -0.045em;
  line-height: 0.9;
  max-width: calc(100% - var(--pw) - 32px);
}
.name span { display: block; white-space: nowrap; }

.portrait {
  position: absolute;
  right: 0;
  top: calc(50% - var(--ph) * 0.46);
  width: var(--pw);
  height: var(--ph);
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  mix-blend-mode: luminosity;
  opacity: 0.85;
  transition: opacity 600ms var(--ease-out);
}
.portrait.is-drawn { opacity: 0; }

.lower {
  display: grid;
  gap: var(--s-4);
  margin-top: var(--s-6);
  max-width: min(36rem, calc(100% - var(--pw) - 32px));
}
.role {
  font-size: var(--step-lead);
  line-height: 1.3;
  max-width: 30ch;
}
.statement { max-width: 44ch; }
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-4) var(--s-6);
  margin-top: var(--s-4);
  font-size: 16px;
}

.caption {
  position: absolute;
  right: 0;
  bottom: 28px;
  font-size: var(--step-small);
  color: var(--muted);
}

/* Phones and portrait tablets: name, portrait, then the words, as one column. */
@media (max-width: 899px), (orientation: portrait) and (max-width: 1100px) {
  .copy {
    --pw: min(100%, 46svh * 0.7986, 520px);
    min-height: 0;
    justify-content: flex-start;
    padding: calc(var(--header-h) + 16px) 0 56px;
  }
  .name { max-width: none; font-size: clamp(3.25rem, 1rem + 11vw, 6rem); }
  .portrait {
    position: relative;
    top: auto;
    right: auto;
    align-self: center;
    width: var(--pw);
    height: auto;
    aspect-ratio: 472 / 591;
    margin-top: var(--s-5);
  }
  .lower { max-width: 40rem; margin-top: var(--s-5); }
  .role { font-size: 22px; }
  .actions .lab-button { flex: 1 1 100%; }
  .caption { display: none; }
}
</style>
