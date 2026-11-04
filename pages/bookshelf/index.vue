<template>
  <div class="bookshelf">
    <LabPageHeader
      eyebrow="Bookshelf"
      title="Bookshelf"
      intro="A cozy wooden shelf with classic titles. Tap a book to read it in full size."
      :pill="`${books.length} ${books.length === 1 ? 'book' : 'books'}`"
    />

    <div v-reveal class="lab-wrap">
      <div class="search" data-reveal>
        <Search :size="18" aria-hidden="true" />
        <input
          v-model="query" type="search" placeholder="Search by title, author, or tags..."
          aria-label="Search books" autocomplete="off"
        >
      </div>

      <div v-if="shelves.length" class="shelves">
        <section v-for="(shelf, sIdx) in shelves" :key="sIdx" class="shelf" aria-label="Books shelf" data-reveal>
          <div class="row-wrap">
            <div class="edge-fade left" aria-hidden="true" />
            <div class="edge-fade right" aria-hidden="true" />

            <div :ref="(el) => setShelfRef(el as HTMLElement | null, sIdx)" class="shelf-row" @scroll.passive="onShelfScroll(sIdx)">
              <button
                v-for="book in shelf" :key="book.id" type="button" class="item"
                :aria-label="`Open ${book.title} by ${book.author}`" data-cursor-label="Read" @click="openReader(book)"
              >
                <span class="book">
                  <img
                    v-if="!broken.has(book.id)" class="cover" :src="book.cover" :alt="`Cover of ${book.title}`"
                    loading="lazy" decoding="async" referrerpolicy="no-referrer" @error="broken.add(book.id)"
                  >
                  <span v-else class="cover cover--plain" aria-hidden="true">{{ book.title }}</span>
                  <!-- Gloss -->
                  <span class="gloss" aria-hidden="true" />
                  <!-- Hover/tap hint (visible on hover-capable) -->
                  <span class="hover-hint" aria-hidden="true"><Eye :size="14" /> Read</span>
                </span>
                <!-- Title below -->
                <span class="cap">
                  <span class="b-title">{{ book.title }}</span>
                  <span class="b-author">{{ book.author }}</span>
                </span>
              </button>
            </div>
          </div>

          <div class="shelf-plank" aria-hidden="true" />

          <div v-if="pageCounts[sIdx] > 1" class="pager">
            <button type="button" class="nav-btn" aria-label="Previous" @click="prevPage(sIdx)"><ChevronLeft :size="18" /></button>
            <div class="dots">
              <button
                v-for="p in pageCounts[sIdx]" :key="p" type="button" class="dot" :class="{ on: activePages[sIdx] === p - 1 }"
                :aria-label="`Go to page ${p}`" @click="goToPage(sIdx, p - 1)"
              />
            </div>
            <button type="button" class="nav-btn" aria-label="Next" @click="nextPage(sIdx)"><ChevronRight :size="18" /></button>
          </div>
        </section>
      </div>

      <LabEmpty v-else label="No match" :title="`No books match “${query.trim()}”`" text="Try another title or author.">
        <button type="button" class="reset" @click="query = ''">Show all books</button>
      </LabEmpty>
    </div>

    <transition name="fade">
      <div
        v-if="readerOpen && current" ref="overlayEl" class="reader touch-pan-y" role="dialog" aria-modal="true"
        :aria-label="`Reader: ${current.title}`" tabindex="-1"
        @touchstart.passive="onOverlayTouchStart" @touchmove.prevent="onOverlayTouchMove" @touchend.passive="onOverlayTouchEnd"
      >
        <div class="bar" :style="{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }">
          <div class="who">
            <h2>{{ current.title }}</h2>
            <p>{{ current.author }}</p>
          </div>
          <div class="tools">
            <a
              :href="current.src" target="_blank" rel="noopener noreferrer" class="tool open"
              aria-label="Open in new tab" title="Open in new tab" data-cursor-label="Open ↗"
            >Open</a>
            <button type="button" class="tool" aria-label="Close reader" title="Close (Esc)" @click="closeReader">
              <X :size="18" />
            </button>
          </div>
        </div>

        <div class="grip" aria-hidden="true"><span /></div>

        <div class="stage">
          <div v-if="loading" class="busy"><span class="loader" aria-label="Loading book" /></div>
          <iframe
            :src="current.src" title="Book reader"
            allow="fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen="true" frameborder="0" referrerpolicy="no-referrer" loading="eager" @load="onIframeLoad"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Eye, X, ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'

type Book = {
  id: number
  title: string
  author: string
  cover: string
  src: string
}

// Demo famous books (Open Library covers)
const ALL_BOOKS: Book[] = [
  {
    id: 1,
    title: 'to kill a mockingbird',
    author: 'Harper Lee',
    cover: 'https://i0.wp.com/www.mindfulmuslimreader.com/wp-content/uploads/2022/10/mockingbird-e1666245397419.webp?w=800&ssl=1',
    src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  },
  // {
  //   id: 2,
  //   title: '1984',
  //   author: 'George Orwell',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 3,
  //   title: 'To Kill a Mockingbird',
  //   author: 'Harper Lee',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 4,
  //   title: 'Clean Code',
  //   author: 'Robert C. Martin',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 5,
  //   title: 'The Pragmatic Programmer',
  //   author: 'Andrew Hunt, David Thomas',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 6,
  //   title: 'The Design of Everyday Things',
  //   author: 'Don Norman',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 7,
  //   title: 'Sapiens',
  //   author: 'Yuval Noah Harari',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 8,
  //   title: 'Atomic Habits',
  //   author: 'James Clear',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 9,
  //   title: "Harry Potter and the Sorcerer's Stone",
  //   author: 'J.K. Rowling',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // },
  // {
  //   id: 10,
  //   title: 'The Hobbit',
  //   author: 'J.R.R. Tolkien',
  //   cover: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
  //   src: 'https://online.anyflip.com/ijojv/xcod/index.html'
  // }
]

const books = ref<Book[]>(ALL_BOOKS)
const query = ref('')
// Covers that failed to load show the title on a plain cover instead of a broken image.
const broken = reactive(new Set<number>())
// chunk into shelves (7 per shelf)
const shelves = computed(() => {
  const size = 7
  const out: Book[][] = []
  for (let i = 0; i < filteredBooks.value.length; i += size) {
    out.push(filteredBooks.value.slice(i, i + size))
  }
  return out
})

/* Slider state */
const shelfRefs = ref<HTMLElement[]>([])
const activePages = ref<number[]>([])
const pageCounts = ref<number[]>([])

function setShelfRef(el: HTMLElement | null, idx: number) {
  if (!el) return
  shelfRefs.value[idx] = el
  // Initialize after DOM paints
  nextTick(() => updateShelfPages(idx))
}

function updateShelfPages(idx: number) {
  const el = shelfRefs.value[idx]
  if (!el) return
  const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
  pageCounts.value[idx] = pages
  activePages.value[idx] = Math.min(activePages.value[idx] ?? 0, pages - 1)
}

function onShelfScroll(idx: number) {
  const el = shelfRefs.value[idx]
  if (!el) return
  const page = Math.round(el.scrollLeft / el.clientWidth)
  activePages.value[idx] = Math.min(Math.max(page, 0), (pageCounts.value[idx] ?? 1) - 1)
}

function goToPage(idx: number, page: number) {
  const el = shelfRefs.value[idx]
  if (!el) return
  el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' })
}
function nextPage(idx: number) {
  goToPage(idx, Math.min((activePages.value[idx] ?? 0) + 1, (pageCounts.value[idx] ?? 1) - 1))
}
function prevPage(idx: number) {
  goToPage(idx, Math.max((activePages.value[idx] ?? 0) - 1, 0))
}

const filteredBooks = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return books.value
  return books.value.filter(b => {
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
      
    )
  })
})

/* Reader overlay */
const readerOpen = ref(false)
const current = ref<Book | null>(null)
const overlayEl = ref<HTMLElement | null>(null)
const loading = ref(true)

/* Swipe-to-close */
let startY = 0
let deltaY = 0
function onOverlayTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  startY = e.touches[0].clientY
  deltaY = 0
}
function onOverlayTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return
  deltaY = e.touches[0].clientY - startY
  if (deltaY > 0 && overlayEl.value) {
    const t = Math.min(deltaY, 120)
    overlayEl.value.style.transform = `translateY(${t}px)`
    overlayEl.value.style.opacity = String(Math.max(0.6, 1 - t / 200))
  }
}
function onOverlayTouchEnd() {
  if (!overlayEl.value) return
  if (deltaY > 80) {
    closeReader()
  } else {
    overlayEl.value.style.transition = 'transform 160ms ease, opacity 160ms ease'
    overlayEl.value.style.transform = 'translateY(0)'
    overlayEl.value.style.opacity = '1'
    setTimeout(() => {
      if (overlayEl.value) overlayEl.value.style.transition = ''
    }, 180)
  }
  startY = 0
  deltaY = 0
}

function openReader(book: Book) {
  current.value = book
  loading.value = true
  readerOpen.value = true
  nextTick(() => {
    overlayEl.value?.focus()
    // lock background scroll
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  })
}

function closeReader() {
  // restore scroll
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  // exit fullscreen if any
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => { })
  }
  readerOpen.value = false
  current.value = null
}

function onIframeLoad() {
  loading.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (!readerOpen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    closeReader()
  }
}

function onResize() {
  // Recompute pages for each shelf on resize
  shelfRefs.value.forEach((_, i) => updateShelfPages(i))
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
  // First measure after mount
  nextTick(() => shelfRefs.value.forEach((_, i) => updateShelfPages(i)))
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

useHead({
  title: 'Bookshelf - Mobile-friendly Shelf & Reader',
  meta: [
    { name: 'description', content: 'A realistic bookshelf with a swipeable slider and a mobile-friendly reader.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
  ]
})
</script>

<style scoped>
.search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 520px;
  margin-bottom: var(--s-8);
  color: var(--muted);
}
.search svg { position: absolute; left: 16px; pointer-events: none; }
.search input {
  width: 100%;
  min-height: 52px;
  padding: 0 16px 0 46px;
  border: 1px solid var(--line); /* taste-skill-ignore: a real form field keeps its edge */
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--ink);
  font: 16px var(--font-text);
}
.search input::placeholder { color: var(--muted); }
.search input:focus-visible { outline: 2px solid var(--mint); outline-offset: 2px; border-color: transparent; }

.shelves { display: grid; gap: var(--s-9); }
.shelf { position: relative; }
.row-wrap { position: relative; }

/* Horizontal shelf slider */
.shelf-row {
  display: flex;
  gap: clamp(16px, 2.4vw, 32px);
  padding: 1rem 0.5rem 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}
.shelf-row::-webkit-scrollbar { display: none; }
.item {
  flex: none;
  display: grid;
  gap: var(--s-3);
  justify-items: start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  text-align: left;
  cursor: pointer;
  scroll-snap-align: start;
}
.item:focus-visible { outline: 2px solid var(--mint); outline-offset: 6px; border-radius: 12px; }

/* Wood plank: the shelf the books stand on (the page's own wooden shelf). */
.shelf-plank {
  height: 22px;
  margin-top: -6px;
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(76, 46, 20, 0.85), rgba(53, 34, 14, 0.9)), /* taste-skill-ignore: wood of the bookshelf */
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 6px); /* taste-skill-ignore: wood grain of the bookshelf */
  box-shadow: var(--shadow); /* taste-skill-ignore: the shelf carries the site's card shadow */
}

/* Edge fades for slider, in the page's ground colour */
.edge-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 32px;
  pointer-events: none;
  z-index: 1;
}
.edge-fade.left { left: 0; background: linear-gradient(90deg, var(--ground-b), transparent); } /* taste-skill-ignore: scroll edge fade */
.edge-fade.right { right: 0; background: linear-gradient(270deg, var(--ground-b), transparent); } /* taste-skill-ignore: scroll edge fade */

.pager { display: flex; align-items: center; justify-content: center; gap: var(--s-3); margin-top: var(--s-4); }
.nav-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line); /* taste-skill-ignore: PIPILIKA's control edge (brand) */
  border-radius: 50%;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  transition: border-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}
.nav-btn:hover { border-color: var(--mint); }
.nav-btn:active { transform: scale(0.94); }
.dots { display: flex; gap: 6px; }
.dot { width: 10px; height: 6px; padding: 0; border: 0; border-radius: 999px; background: var(--surface-3); cursor: pointer; transition: width var(--dur-hover) ease, background-color var(--dur-hover) ease; }
.dot.on { width: 24px; background: var(--mint); }

/* Book (mobile-first) with reduced tilt for readability on phones */
.book {
  --w: 124px;
  --h: calc(var(--w) * 4 / 3);
  --thickness: 14px;
  position: relative;
  display: block;
  width: var(--w);
  height: var(--h);
  border-radius: 10px;
  overflow: hidden;
  transform: perspective(900px) rotateY(-3deg);
  transform-origin: left center;
  transition: transform 220ms ease, box-shadow 220ms ease;
  box-shadow: var(--shadow), inset 0 0 0 1px rgb(255 255 255 / 0.05); /* taste-skill-ignore: a book's own depth */
}
@media (min-width: 640px) { .book { --w: 148px; } }
@media (min-width: 1024px) { .book { --w: 168px; } }
@media (hover: hover) and (pointer: fine) {
  .item:hover .book { transform: perspective(900px) rotateY(-5deg) translateY(-4px); box-shadow: var(--shadow-lift); } /* taste-skill-ignore: a lifted book */
}
.cover { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 700ms var(--ease-out); }
.item:hover .cover { transform: scale(1.04); }
.cover--plain {
  display: grid;
  place-items: center;
  padding: 14px;
  background: var(--teal);
  color: #fff;
  font: 600 15px / 1.25 var(--font-text);
  text-align: center;
  text-transform: capitalize;
}

/* Left spine */
.book::before {
  content: "";
  position: absolute;
  top: 4%;
  bottom: 4%;
  left: 0;
  z-index: 1;
  width: calc(var(--thickness) * 0.75);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.25) 60%, rgba(255, 255, 255, 0.06) 100%); /* taste-skill-ignore: the book's spine */
  pointer-events: none;
}
.gloss {
  position: absolute;
  inset: 0;
  background: linear-gradient(75deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0.04) 55%, rgba(255, 255, 255, 0) 100%); /* taste-skill-ignore: cover gloss */
  mix-blend-mode: screen;
  pointer-events: none;
}
.hover-hint {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--accent-ink);
  color: var(--mint);
  font: 600 12px / 1.2 var(--font-text);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 180ms ease, transform 180ms ease;
}
[data-theme="light"] .hover-hint { background: #0f2a2e; color: #5eead4; }
@media (hover: hover) and (pointer: fine) {
  .item:hover .hover-hint { opacity: 1; transform: none; }
}

/* Title text under the book */
.cap { display: grid; gap: 2px; width: var(--w, 124px); max-width: 168px; }
.b-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  text-transform: capitalize;
}
.b-author { font-size: 13px; color: var(--muted); }
.item:hover .b-title { color: var(--mint); }

.reset {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--line); /* taste-skill-ignore: PIPILIKA's control edge (brand) */
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--ink);
  font: 500 15px var(--font-text);
  cursor: pointer;
}
.reset:hover { border-color: var(--mint); }

/* Reader overlay */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
.reader {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: 100svh;
  background: rgb(4 18 21 / 0.94);
  will-change: transform, opacity;
  outline: none;
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-4);
  padding: 10px var(--margin);
  background: var(--surface-solid);
  border-bottom: 1px solid var(--line); /* taste-skill-ignore: the reader bar's edge */
  color: var(--ink);
}
.who { min-width: 0; }
.who h2 { font: 600 16px / 1.3 var(--font-text); letter-spacing: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; }
.who p { font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tools { display: flex; gap: var(--s-2); }
.tool {
  display: inline-grid;
  place-items: center;
  min-width: 44px;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--line); /* taste-skill-ignore: PIPILIKA's control edge (brand) */
  border-radius: var(--radius-control);
  background: var(--surface-2);
  color: var(--ink);
  font: 600 14px var(--font-text);
  text-decoration: none;
  cursor: pointer;
}
.tool:hover { border-color: var(--mint); color: var(--mint); }
.tool:focus-visible { outline: 2px solid var(--mint); outline-offset: 2px; }
.grip { display: none; justify-content: center; padding: 6px 0; }
.grip span { width: 48px; height: 5px; border-radius: 999px; background: rgb(255 255 255 / 0.25); }
.stage { position: relative; flex: 1; background: #000; padding-bottom: env(safe-area-inset-bottom, 0px); }
.stage iframe { display: block; width: 100%; height: 100%; }
.busy { position: absolute; inset: 0; display: grid; place-items: center; }
.loader {
  width: 26px;
  height: 26px;
  border: 3px solid rgb(255 255 255 / 0.25);
  border-top-color: var(--mint);
  border-radius: 999px;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.touch-pan-y { touch-action: pan-y; }

@media (max-width: 639px) {
  .open { display: none; }
  .grip { display: flex; }
}
@media (prefers-reduced-motion: reduce) {
  .book, .cover, .hover-hint { transition: none; }
  .item:hover .book { transform: perspective(900px) rotateY(-3deg); }
  .item:hover .cover { transform: none; }
  .loader { animation-duration: 2s; }
}
</style>
