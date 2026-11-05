<template>
  <div class="tb" :class="{ compact }">
    <div v-if="!compact" class="search">
      <Search :size="18" aria-hidden="true" />
      <input v-model="query" type="search" placeholder="Title, author or category" aria-label="Search the library"
        autocomplete="off" enterkeyhint="search">
    </div>
    <div class="row">
      <div v-if="!compact" class="chips" role="group" aria-label="Show">
        <UiButton v-for="f in FILTERS" :key="f.id" size="sm" shape="pill" :variant="filter === f.id ? 'default' : 'outline'"
          :aria-pressed="filter === f.id" @click="filter = f.id">{{ f.label }}</UiButton>
      </div>
      <div class="end">
        <label class="sort">
          <span class="sr-only">Sort by</span>
          <ArrowDownUp :size="16" aria-hidden="true" />
          <select v-model="sort" aria-label="Sort by">
            <option v-for="s in SORTS" :key="s.id" :value="s.id">{{ s.label }}</option>
          </select>
          <ChevronDown class="chev" :size="14" aria-hidden="true" />
        </label>
        <div class="views" role="group" aria-label="View">
          <UiButton variant="ghost" size="icon" :aria-pressed="view === 'grid'" aria-label="Grid view" @click="setView('grid')">
            <LayoutGrid :size="18" aria-hidden="true" />
          </UiButton>
          <UiButton variant="ghost" size="icon" :aria-pressed="view === 'list'" aria-label="List view" @click="setView('list')">
            <ListIcon :size="18" aria-hidden="true" />
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, ArrowDownUp, ChevronDown, LayoutGrid, List as ListIcon } from 'lucide-vue-next'
import { FILTERS, SORTS, type Filter, type Sort } from '~/composables/useLibrary'

// The library's tools: search, what to show, sort and grid or list. The bar stays under the site header
// while the shelf scrolls; on a phone the filters scroll sideways in their own strip.
defineProps<{ compact?: boolean }>()
const query = defineModel<string>('query', { default: '' })
const filter = defineModel<Filter>('filter', { default: 'all' })
const sort = defineModel<Sort>('sort', { required: true })
const { view, setView } = useReading()
</script>

<style scoped>
.tb {
  position: sticky;
  top: var(--header-h-tight);
  z-index: 20;
  display: grid;
  gap: var(--s-3);
  margin-inline: calc(-1 * var(--margin));
  padding: var(--s-3) var(--margin);
  background: var(--background);
}

.search { position: relative; display: flex; align-items: center; color: var(--muted-foreground); }
.search svg { position: absolute; left: 14px; pointer-events: none; }
.search input {
  width: 100%;
  min-height: 44px;
  padding: 0 14px 0 44px;
  border: 1px solid var(--input); /* taste-skill-ignore: a real form field keeps its edge */
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font: 16px var(--font-text);
  transition: border-color var(--dur-hover) ease;
}
.search input::placeholder { color: var(--muted-foreground); }
.search input:hover { border-color: var(--border-strong); }
.search input:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

.row { display: flex; align-items: center; gap: var(--s-4); min-width: 0; }
.chips {
  display: flex;
  gap: var(--s-2);
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  margin: -4px;
  padding: 4px;
}
.chips::-webkit-scrollbar { display: none; }
/* All chips one height, selected or not (the default variant would otherwise take the default size's 40px). */
.chips :deep(.ui-btn) { height: 34px; }
.end { display: flex; align-items: center; gap: var(--s-2); margin-left: auto; flex: none; }

.sort { position: relative; display: flex; align-items: center; color: var(--muted-foreground); }
.sort svg { position: absolute; left: 12px; pointer-events: none; }
.sort .chev { left: auto; right: 12px; }
.sort select {
  min-height: 36px;
  padding: 0 32px 0 36px;
  border: 1px solid var(--input); /* taste-skill-ignore: a real form field keeps its edge */
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font: 500 14px var(--font-text);
  appearance: none;
  cursor: pointer;
}
.sort select:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
.views { display: flex; }
.views :deep(.ui-btn[aria-pressed="true"]) { background: var(--muted); color: var(--foreground); }

.compact { position: static; margin-inline: 0; padding-inline: 0; }

@media (max-width: 639px) {
  .row { gap: var(--s-2); }
  .chips { margin-right: 0; }
  .end { gap: 0; }
  .sort select { width: 44px; padding: 0; color: transparent; }
  .sort svg { left: 14px; color: var(--foreground); }
  .sort .chev { display: none; }
}
</style>
