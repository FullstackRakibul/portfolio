<template>
  <div class="empty lab-card" role="status">
    <p class="lab-mono k">{{ label }}</p>
    <p class="t">{{ title }}</p>
    <p v-if="text" class="x">{{ text }}</p>
    <div v-if="$slots.default" class="act"><slot /></div>
  </div>
</template>

<script setup lang="ts">
// A calm stand-in where a list or a page has nothing to show: never a blank area or a broken image.
withDefaults(defineProps<{ title: string; text?: string; label?: string }>(), { label: 'Nothing here yet' })
</script>

<style scoped>
.empty { padding: clamp(28px, 4vw, 48px); text-align: center; }
.k { color: var(--muted-foreground); }
.t { margin-top: var(--s-3); font-size: var(--step-lead); font-weight: 600; }
.x { margin-top: var(--s-2); color: var(--muted-foreground); }
.act { margin-top: var(--s-5); display: flex; justify-content: center; }
</style>
