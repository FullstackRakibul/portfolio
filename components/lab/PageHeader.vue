<template>
  <header v-reveal class="ph" :class="[`ph--${size}`, { 'ph--narrow': narrow }]">
    <div class="lab-wrap inner">
      <NuxtLink v-if="back" :to="back.to" class="lab-back" data-reveal>
        <span aria-hidden="true">←</span> {{ back.label }}
      </NuxtLink>
      <p v-if="eyebrow" class="eyebrow lab-mono" data-reveal>{{ eyebrow }}</p><!-- taste-skill-ignore: the brief's PIPILIKA eyebrow -->
      <h1 class="title" :class="{ joined: parts.length > 1 }" data-reveal>
        <template v-for="(part, i) in parts" :key="i"><wbr v-if="i">{{ part }}</template>
      </h1>
      <p v-if="intro" class="intro" data-reveal>{{ intro }}</p>
      <div v-if="pill || $slots.default" class="meta" data-reveal>
        <span v-if="pill" class="lab-pill">{{ pill }}</span>
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// The opening of every page other than home: a mono eyebrow, the title one step below the home hero's
// name, one muted line from the page's own copy, and an optional outlined pill (a count or a range).
const props = withDefaults(defineProps<{
  title: string
  eyebrow?: string
  intro?: string
  pill?: string
  back?: { to: string; label: string }
  size?: 'page' | 'detail'
  /** One centred reading column, for articles. */
  narrow?: boolean
}>(), { size: 'page', narrow: false })

// A one-word camelCase title (onTheWayToBeCreative) may only break where its words join.
const parts = computed(() => (/\s/.test(props.title) ? [props.title] : props.title.split(/(?=[A-Z])/)))
</script>

<style scoped>
.ph {
  position: relative;
  padding: calc(var(--header-h) + clamp(48px, 7vw, 104px)) 0 clamp(72px, 8vw, 120px);
  overflow: hidden;
}
.inner { position: relative; z-index: 1; }

.lab-back { margin: 0 0 var(--s-5) -2px; }
.eyebrow { letter-spacing: 0.22em; } /* taste-skill-ignore: the eyebrow is a mono label (the brief keeps them) */
.title {
  margin-top: var(--s-4);
  font-size: var(--step-page);
  letter-spacing: -0.045em;
  line-height: 0.95;
  max-width: 14ch;
  overflow-wrap: anywhere;
  text-wrap: balance;
}
.title.joined { max-width: none; overflow-wrap: normal; }
.ph--narrow .inner { max-width: 860px; }
.ph--detail .title {
  font-size: clamp(2.1rem, 1.2rem + 2.8vw, 3.75rem);
  letter-spacing: -0.035em;
  line-height: 1.05;
  max-width: 24ch;
}
.intro {
  margin-top: var(--s-5);
  max-width: 56ch;
  font-size: var(--step-lead);
  line-height: 1.4;
  color: var(--muted-foreground);
}
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3) var(--s-4); margin-top: var(--s-6); }

</style>
