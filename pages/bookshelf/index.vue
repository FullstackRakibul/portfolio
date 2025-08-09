<template>
  <div class="pt-20 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <header class="mb-8 sm:mb-10 text-center">
        <h1 class="text-3xl sm:text-5xl font-bold mb-2 sm:mb-3">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Bookshelf
          </span>
        </h1>
        <p class="text-gray-300 text-sm sm:text-base">
          A cozy wooden shelf with classic titles. Tap a book to read it in full size.
        </p>
      </header>
      <div class="max-w-md mx-auto mb-8">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input v-model="query" type="text" placeholder="Search by title, author, or tags..."
            class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            aria-label="Search books" />
        </div>
      </div>
      <div class="space-y-14">
        <section v-for="(shelf, sIdx) in shelves" :key="sIdx" class="relative" aria-label="Books shelf">

          <div class="shelf-plank" aria-hidden="true" />

          <div class="relative">

            <div class="edge-fade left" aria-hidden="true" />
            <div class="edge-fade right" aria-hidden="true" />

            <div class="shelf-row" :ref="(el) => setShelfRef(el, sIdx)" @scroll.passive="onShelfScroll(sIdx)">
              <button v-for="book in shelf" :key="book.id" class="book group focus:outline-none"
                :aria-label="`Open ${book.title} by ${book.author}`" @click="openReader(book)">

                <img class="cover" :src="book.cover" :alt="`Cover of ${book.title}`" loading="lazy" decoding="async"
                  referrerpolicy="no-referrer" />

                Gloss
                <div class="gloss" aria-hidden="true"></div>

                Hover/tap hint (visible on hover-capable)
                <div class="hover-hint">
                  <Eye class="w-4 h-4 mr-1" />
                  <span>Read</span>
                </div>

                Title below
                <div class="title">
                  <p class="text-[11px] sm:text-sm font-semibold text-white line-clamp-2">
                    {{ book.title }}
                  </p>
                  <p class="text-[10px] sm:text-[11px] text-gray-400">
                    {{ book.author }}
                  </p>
                </div>
              </button>
            </div>

            <div v-if="pageCounts[sIdx] > 1"
              class="hidden sm:flex items-center justify-between absolute inset-y-0 -left-2 -right-2 pointer-events-none">
              <button class="pointer-events-auto nav-btn left" aria-label="Previous" @click="prevPage(sIdx)">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button class="pointer-events-auto nav-btn right" aria-label="Next" @click="nextPage(sIdx)">
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>

            <div v-if="pageCounts[sIdx] > 1" class="mt-2 flex items-center justify-center gap-1.5">
              <button v-for="p in pageCounts[sIdx]" :key="p" :aria-label="`Go to page ${p}`"
                @click="goToPage(sIdx, p - 1)" class="h-1.5 rounded-full transition-all" :class="[
                  'bg-gray-500/50',
                  activePages[sIdx] === (p - 1) ? 'w-6 bg-blue-400' : 'w-2.5'
                ]" />
            </div>
          </div>
        </section>
      </div>
    </div>

    <transition name="fade">
      <div v-if="readerOpen && current" class="fixed inset-0 z-50 bg-black/90 reader touch-pan-y" role="dialog"
        aria-modal="true" :aria-label="`Reader: ${current.title}`" ref="overlayEl"
        @touchstart.passive="onOverlayTouchStart" @touchmove.prevent="onOverlayTouchMove"
        @touchend.passive="onOverlayTouchEnd">

        <div class="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-white/10 bg-gray-900/70"
          :style="{ paddingTop: 'calc(env(safe-area-inset-top, 0px))' }">
          <div class="min-w-0 pr-2">
            <h2 class="text-white font-semibold truncate text-sm sm:text-base">
              {{ current.title }}
            </h2>
            <p class="text-[10px] sm:text-xs text-gray-400 truncate">
              {{ current.author }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <a :href="current.src" target="_blank" rel="noopener noreferrer"
              class="hidden sm:inline-flex items-center justify-center px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors text-sm"
              aria-label="Open in new tab" title="Open in new tab">
              Open
            </a>

            <button @click="closeReader"
              class="inline-flex items-center justify-center p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
              aria-label="Close reader" title="Close (Esc)">
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="sm:hidden flex justify-center py-1 bg-black/90">
          <div class="h-1.5 w-12 rounded-full bg-white/25" />
        </div>

        <div class="absolute inset-x-0 bg-black" :style="{
          top: 'calc(48px + env(safe-area-inset-top, 0px) + 8px)',
          bottom: 'env(safe-area-inset-bottom, 0px)'
        }">
          <div class="w-full h-full relative">

            <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
              <span class="loader" aria-label="Loading book"></span>
            </div>

            <iframe :src="current.src" class="w-full h-full" title="Book reader"
              allow="fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen="true" frameborder="0" referrerpolicy="no-referrer" loading="eager"
              @load="onIframeLoad"></iframe>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useHead } from '#app'
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

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
// chunk into shelves (7 per shelf)
const shelves = computed(() => {
  const size = 7
  const out: Book[][] = []
  for (let i = 0; i < books.value.length; i += size) {
    out.push(books.value.slice(i, i + size))
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
/* Overlay fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Full-height overlay with modern viewport unit */
.reader {
  height: 100svh;
  will-change: transform, opacity;
}

/* Horizontal shelf slider */
.shelf-row {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0.5rem 2.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}

.shelf-row>.book {
  scroll-snap-align: start;
}

.shelf-row::-webkit-scrollbar {
  height: 8px;
}

.shelf-row::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.25);
  border-radius: 9999px;
}

/* Wood plank */
.shelf-plank {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 24px;
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(76, 46, 20, 0.85), rgba(53, 34, 14, 0.9)),
    repeating-linear-gradient(90deg,
      rgba(255, 255, 255, 0.05) 0px,
      rgba(255, 255, 255, 0.05) 2px,
      rgba(0, 0, 0, 0.05) 2px,
      rgba(0, 0, 0, 0.05) 6px);
  box-shadow:
    0 6px 14px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);
}

/* Edge fades for slider */
.edge-fade {
  position: absolute;
  top: 0;
  bottom: 32px;
  /* leave room for plank */
  width: 32px;
  pointer-events: none;
  z-index: 1;
}

.edge-fade.left {
  left: 0;
  background: linear-gradient(90deg, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0));
}

.edge-fade.right {
  right: 0;
  background: linear-gradient(270deg, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0));
}

/* Nav buttons */
.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  background: rgba(17, 24, 39, 0.85);
  border: 1px solid rgba(55, 65, 81, 0.7);
  color: #e5e7eb;
  transition: background 0.15s ease, transform 0.15s ease;
}

.nav-btn:hover {
  background: rgba(31, 41, 55, 0.9);
  transform: translateY(-1px);
}

/* Book (mobile-first) with reduced tilt for readability on phones */
.book {
  --w: 116px;
  /* mobile base width */
  --h: calc(var(--w) * 4 / 3);
  --thickness: 14px;

  position: relative;
  width: var(--w);
  height: var(--h);

  border-radius: 10px;
  overflow: hidden;

  /* Minimized tilt on mobile so covers are readable; hover enhances on desktop */
  transform: perspective(900px) rotateY(-3deg);
  transform-origin: left center;
  transition: transform 220ms ease, box-shadow 220ms ease;
  box-shadow:
    0 10px 18px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

@media (min-width: 375px) {
  .book {
    --w: 124px;
  }
}

@media (min-width: 640px) {
  .book {
    --w: 140px;
  }
}

@media (min-width: 1024px) {
  .book {
    --w: 160px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .book:hover {
    transform: perspective(900px) rotateY(-5deg) translateY(-3px);
    box-shadow:
      0 16px 28px rgba(0, 0, 0, 0.55),
      inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
}

/* Cover image */
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Left spine */
.book::before {
  content: "";
  position: absolute;
  top: 4%;
  bottom: 4%;
  left: 0;
  width: calc(var(--thickness) * 0.75);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background:
    linear-gradient(90deg,
      rgba(0, 0, 0, 0.45) 0%,
      rgba(0, 0, 0, 0.25) 60%,
      rgba(255, 255, 255, 0.06) 100%);
  pointer-events: none;
}

/* Page edges on right */
.book::after {
  content: "";
  position: absolute;
  top: 6%;
  bottom: 6%;
  right: -6px;
  width: 10px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  background:
    repeating-linear-gradient(180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0.85) 2px,
      rgba(0, 0, 0, 0.06) 2px,
      rgba(0, 0, 0, 0.06) 4px);
  filter: saturate(0.5);
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

/* Gloss */
.gloss {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(75deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0.0) 25%,
      rgba(255, 255, 255, 0.04) 55%,
      rgba(255, 255, 255, 0.0) 100%);
  mix-blend-mode: screen;
  pointer-events: none;
}

/* Hover hint (hidden on touch) */
.hover-hint {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: #e5e7eb;
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(55, 65, 81, 0.7);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 180ms ease, transform 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .book:hover .hover-hint {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Title text under the book */
.title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2.25rem;
  text-align: center;
}

/* Clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* Loader */
.loader {
  width: 26px;
  height: 26px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: white;
  border-radius: 9999px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Allow vertical touch scrolling context on overlay for swipe-to-close hint region */
.touch-pan-y {
  touch-action: pan-y;
}
</style>