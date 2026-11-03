<template>
  <svg class="glyph" viewBox="0 0 14 14" aria-hidden="true">
    <circle v-if="kind === 'applications'" cx="7" cy="7" r="5" />
    <rect v-else-if="kind === 'tools'" x="2.5" y="2.5" width="9" height="9" />
    <path v-else d="M7 1.5 12.5 7 7 12.5 1.5 7Z" />
  </svg>
</template>

<script setup lang="ts">
// One mark per project category: circle for applications, square for tools, diamond for sites.
defineProps<{ kind: string }>()
</script>

<style scoped>
.glyph { width: 12px; height: 12px; flex: none; }
.glyph * { fill: none; stroke: currentColor; stroke-width: 1.75; }
</style>
