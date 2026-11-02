<template>
  <div ref="stage" class="stage">
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
    <canvas ref="canvas" class="field" aria-hidden="true" />

    <div v-reveal class="lower">
      <p class="identity" data-reveal>Full-stack engineer, systems architect, software craftsman.</p>
      <p class="statement" data-reveal>
        Building scalable systems, engineering intelligent tools, and exploring the boundaries of technology.
      </p>
      <div class="actions" data-reveal>
        <a class="lab-button" href="#contact">Start a conversation</a>
        <a class="lab-link" href="#projects">See the work</a>
      </div>
    </div>

    <p v-if="characters" class="caption">
      Self-portrait in <span class="lab-num">{{ characters.toLocaleString('en-US') }}</span> characters
    </p>
  </div>
</template>

<script setup lang="ts">
import { createLabField } from '~/utils/labField'

const stage = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const portrait = ref<HTMLImageElement | null>(null)
const drawn = ref(false)
const characters = ref(0)

let field: { destroy(): void } | null = null

onMounted(() => {
  if (!stage.value || !canvas.value || !portrait.value) return
  field = createLabField({
    canvas: canvas.value,
    stage: stage.value,
    portrait: portrait.value,
    onReady: (n) => { characters.value = n; drawn.value = true },
  })
})

onBeforeUnmount(() => field?.destroy())
</script>

<style scoped>
.stage {
  --ph: min(78svh, 900px);
  --pw: calc(var(--ph) * 0.7986);
  --pr: calc(var(--margin) + 4vw);
  position: relative;
  height: 100svh;
  overflow: hidden;
  background: var(--bg);
  touch-action: pan-y;
}

.portrait {
  position: absolute;
  top: calc(50% - var(--ph) * 0.64);
  right: var(--pr);
  width: var(--pw);
  height: var(--ph);
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  mix-blend-mode: luminosity;
  opacity: 0.85;
  transition: opacity 600ms var(--ease-out);
}
.portrait.is-drawn { opacity: 0; }

.field {
  position: absolute;
  inset: 0;
  display: block;
}

.lower {
  position: absolute;
  left: var(--margin);
  top: calc(50% + var(--rail-h) / 2 + 48px);
  width: min(36rem, calc(100vw - var(--pw) - var(--pr) - var(--margin) - 40px));
  display: grid;
  gap: 18px;
}

.identity {
  font-size: var(--step-lead);
  line-height: 1.25;
  max-width: 26ch;
}

.statement {
  font-size: var(--step-body);
  max-width: 44ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 28px;
  margin-top: 14px;
  font-size: 16px;
}

.caption {
  position: absolute;
  right: var(--margin);
  bottom: 24px;
  font-size: var(--step-small);
  color: var(--muted);
}

@media (max-width: 899px), (orientation: portrait) and (max-width: 1100px) {
  .stage { --ph: min(60svh, 112vw); }
  .portrait {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  .lower {
    left: 20px;
    right: 20px;
    width: auto;
    top: auto;
    bottom: 28px;
    gap: 12px;
  }
  .identity { font-size: 22px; }
  .statement { font-size: 17px; }
  .actions .lab-button { flex: 1 1 100%; }
  .caption { display: none; }
}

@media (max-height: 640px) and (max-width: 899px) {
  .statement { display: none; }
}
</style>
