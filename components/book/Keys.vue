<template>
  <div class="sheet keys" role="dialog" aria-labelledby="keys-h" @click.stop>
    <p id="keys-h" class="h">Keyboard shortcuts</p>
    <dl>
      <template v-for="k in KEYS" :key="k.does">
        <dt><kbd v-for="key in k.keys" :key="key">{{ key }}</kbd></dt>
        <dd>{{ k.does }}</dd>
      </template>
    </dl>
  </div>
</template>

<script setup lang="ts">
// The list behind "?": every key the reader answers to.
const KEYS = [
  { keys: ['→', 'Space'], does: 'Next page' },
  { keys: ['←'], does: 'Previous page' },
  { keys: ['↑', '↓'], does: 'Scroll, or move the reading ruler' },
  { keys: ['Home', 'End'], does: 'First or last page' },
  { keys: ['F'], does: 'Focus mode' },
  { keys: ['T'], does: 'Next page theme' },
  { keys: ['/'], does: 'Search in the book' },
  { keys: ['B'], does: 'Bookmark this page' },
  { keys: ['+', '−'], does: 'Zoom in or out' },
  { keys: ['?'], does: 'Show these shortcuts' },
  { keys: ['Esc'], does: 'Close a panel, leave focus mode, close the book' },
]
</script>

<style scoped src="./sheet.css"></style>
<style scoped>
.keys {
  top: 50%;
  left: 50%;
  width: min(420px, calc(100vw - 24px));
  transform: translate(-50%, -50%);
  animation: none;
}
dl { display: grid; grid-template-columns: auto 1fr; gap: 10px 16px; align-items: center; margin: 0; }
dt { display: flex; gap: 4px; justify-content: flex-end; }
dd { margin: 0; font-size: 14px; }
kbd {
  min-width: 28px;
  padding: 3px 7px;
  border-radius: 6px;
  background: var(--r-control);
  font: 500 13px var(--font-text);
  text-align: center;
}
</style>
