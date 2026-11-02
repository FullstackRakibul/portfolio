<template>
  <dialog ref="dialog" class="palette" aria-label="Command palette" @close="open = false" @click="onBackdrop">
    <div class="sheet">
      <label class="sr-only" for="palette-q">Go to a section, page or action</label>
      <input
        id="palette-q"
        ref="input"
        v-model="query"
        type="text"
        autocomplete="off"
        placeholder="Go to…"
        role="combobox"
        aria-controls="palette-list"
        :aria-activedescendant="filtered[cursor] ? 'cmd-' + filtered[cursor].id : undefined"
        aria-expanded="true"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="run(filtered[cursor])"
      >
      <ul id="palette-list" role="listbox" aria-label="Results">
        <li
          v-for="(item, i) in filtered"
          :id="'cmd-' + item.id"
          :key="item.id"
          role="option"
          :aria-selected="i === cursor"
          @mousemove="cursor = i"
          @click="run(item)"
        >
          <span>{{ item.label }}</span>
          <span class="hint">{{ item.hint }}</span>
        </li>
        <li v-if="!filtered.length" class="empty" role="presentation">Nothing by that name.</li>
      </ul>
      <p class="foot">Ctrl K or ⌘ K opens this anywhere. Esc closes it.</p>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { CONTACT, SECTIONS } from '~/data/portfolio'

interface Item { id: string; label: string; hint: string; action: () => void }

const open = useState('lab-palette', () => false)
const dialog = ref<HTMLDialogElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const cursor = ref(0)
const copied = ref(false)
const router = useRouter()
const route = useRoute()
const { theme, toggle } = useTheme()

const goSection = (id: string) => router.push({ path: '/', hash: '#' + id })
const external = (url: string) => window.open(url, '_blank', 'noopener')

const items = computed<Item[]>(() => [
  ...SECTIONS.map(s => ({ id: s.id, label: s.label, hint: 'Section', action: () => goSection(s.id) })),
  { id: 'resume', label: 'Résumé', hint: 'Page', action: () => router.push('/resume') },
  { id: 'notes', label: 'On the way to be creative', hint: 'Notes', action: () => router.push('/onTheWayToBeCreative') },
  { id: 'bookshelf', label: 'Bookshelf', hint: 'Page', action: () => router.push('/bookshelf') },
  ...(route.path === '/' ? [{ id: 'theme', label: theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', hint: 'Action', action: toggle }] : []),
  {
    id: 'copy', label: copied.value ? 'Email address copied' : 'Copy email address', hint: CONTACT.email,
    action: () => { navigator.clipboard?.writeText(CONTACT.email); copied.value = true },
  },
  { id: 'github', label: 'GitHub', hint: 'github.com/fullstackrakibul', action: () => external(CONTACT.github) },
  { id: 'linkedin', label: 'LinkedIn', hint: 'linkedin.com/in/fullstackrakibul', action: () => external(CONTACT.linkedin) },
  { id: 'medium', label: 'Medium', hint: 'medium.com/@rakibul.h.rabbi', action: () => external(CONTACT.medium) },
])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? items.value.filter(i => (i.label + ' ' + i.hint).toLowerCase().includes(q)) : items.value
})
watch(query, () => { cursor.value = 0 })

const move = (d: number) => {
  const n = filtered.value.length
  if (n) cursor.value = (cursor.value + d + n) % n
}

const run = (item?: Item) => {
  if (!item) return
  item.action()
  if (item.id !== 'copy' && item.id !== 'theme') open.value = false
}

const onBackdrop = (e: MouseEvent) => { if (e.target === dialog.value) open.value = false }

watch(open, async (v) => {
  const d = dialog.value
  if (!d) return
  if (v && !d.open) {
    query.value = ''; cursor.value = 0; copied.value = false
    d.showModal()
    await nextTick()
    input.value?.focus()
  } else if (!v && d.open) d.close()
})

const onKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.palette {
  width: min(560px, calc(100vw - 32px));
  max-height: min(620px, calc(100svh - 64px));
  margin: 12vh auto auto;
  padding: 0;
  border: 0;
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-text);
  box-shadow: 0 24px 64px rgb(0 0 0 / 0.4); /* taste-skill-ignore: a dialog truly floats */
}
.palette::backdrop { background: rgb(10 10 9 / 0.55); }
.palette[open] { animation: rise 220ms var(--ease-out); }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } }
@media (prefers-reduced-motion: reduce) { .palette[open] { animation: none; } }

.sheet { display: grid; }

input {
  height: 60px;
  padding: 0 20px;
  border: 0;
  background: var(--surface-2);
  color: var(--ink);
  font: 400 var(--step-lead) var(--font-text);
  outline: none;
}
input:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
input::placeholder { color: var(--muted); }

ul {
  list-style: none;
  margin: 0;
  padding: 8px 0;
  overflow-y: auto;
  max-height: 420px;
}
li[role="option"] {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 20px;
  font-size: 16px;
  cursor: pointer;
}
li[aria-selected="true"] { background: var(--surface-2); }
li[aria-selected="true"] span:first-child { color: var(--accent); }
.hint { color: var(--muted); font-size: var(--step-small); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.empty { padding: 14px 20px; color: var(--muted); }
.foot { padding: 12px 20px 16px; color: var(--muted); font-size: var(--step-small); }
</style>
