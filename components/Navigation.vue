<template>
  <nav
    aria-label="Primary"
    class="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
  >
    <div class="pointer-events-auto w-full lg:w-auto">
      <!-- ═══ Glass Island ═══ -->
      <div
        class="nav-island relative rounded-2xl"
        :class="{ 'is-scrolled': isScrolled }"
      >
        <div
          class="relative flex items-center justify-between lg:justify-start gap-1"
          :class="[
            'transition-[padding] duration-300',
            isScrolled ? 'px-3 py-1.5 lg:px-4' : 'px-4 py-2 lg:px-5 lg:py-2.5'
          ]"
        >
          <!-- Wordmark -->
          <NuxtLink
            to="/"
            class="text-[15px] lg:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-md"
            aria-label="Rakibul H. Rabbi — Home"
            @click="handleRouteLinkClick({ to: '/' })"
          >
            Rakibul H. Rabbi
          </NuxtLink>

          <!-- Desktop Links -->
          <div class="hidden lg:flex items-center gap-0.5 ml-6">
            <template v-for="link in navLinks" :key="link.label">
              <a
                v-if="link.type === 'section'"
                :href="link.to"
                @click.prevent="scrollToSection(link)"
                :aria-current="isLinkActive(link) ? 'page' : undefined"
                :class="desktopLinkClasses(link)"
              >
                {{ link.label }}
              </a>
              <NuxtLink
                v-else
                :to="link.to"
                :aria-current="isLinkActive(link) ? 'page' : undefined"
                :class="desktopLinkClasses(link)"
                @click="handleRouteLinkClick(link)"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
          </div>

          <!-- Right Cluster -->
          <div class="flex items-center gap-1 lg:ml-3 shrink-0">
            <a
              href="https://github.com/FullstackRakibul"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label="GitHub profile (opens in new tab)"
            >
              <Github class="w-[18px] h-[18px]" />
            </a>

            <!-- Mobile Toggle -->
            <button
              ref="menuBtnRef"
              class="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              :aria-expanded="mobileOpen"
              aria-controls="mobile-nav-drawer"
              aria-label="Toggle navigation menu"
              @click="toggleMobile"
            >
              <X v-if="mobileOpen" class="w-5 h-5" />
              <Menu v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ Mobile Drawer ═══ -->
      <Transition name="nav-drawer">
        <div
          v-if="mobileOpen"
          id="mobile-nav-drawer"
          class="mobile-drawer relative mt-3 rounded-2xl p-2 lg:hidden"
          role="menu"
        >
          <template v-for="link in navLinks" :key="'m-' + link.label">
            <a
              v-if="link.type === 'section'"
              :href="link.to"
              role="menuitem"
              @click.prevent="scrollToSection(link)"
              :aria-current="isLinkActive(link) ? 'page' : undefined"
              :class="mobileLinkClasses(link)"
            >
              {{ link.label }}
            </a>
            <NuxtLink
              v-else
              :to="link.to"
              role="menuitem"
              :aria-current="isLinkActive(link) ? 'page' : undefined"
              :class="mobileLinkClasses(link)"
              @click="handleRouteLinkClick(link)"
            >
              {{ link.label }}
            </NuxtLink>
          </template>

          <!-- GitHub in drawer -->
          <div class="mt-1 pt-2 border-t border-white/[0.06]">
            <a
              href="https://github.com/FullstackRakibul"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
            >
              <Github class="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { Menu, X, Github } from 'lucide-vue-next'

const route = useRoute()
const { y: scrollY } = useWindowScroll()

// ── Scroll-condense state ──
const isScrolled = computed(() => scrollY.value > 32)

// ── Navigation data ──
const navLinks = [
  { label: 'Home', to: '/', type: 'route' },
  { label: 'About', to: '/#about', hash: 'about', type: 'section' },
  { label: 'Projects', to: '/#projects', hash: 'projects', type: 'section' },
  { label: 'Blog', to: '/blog', type: 'route' },
  { label: 'Bookshelf', to: '/bookshelf', type: 'route' },
  { label: 'Contact', to: '/#contact', hash: 'contact', type: 'section' },
]

// ── Active section tracking via IntersectionObserver ──
const activeSection = ref('')
const sectionIds = ['about', 'projects', 'contact']
let sectionObserver = null

const setupSectionObserver = () => {
  if (typeof IntersectionObserver === 'undefined') return

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-20% 0px -55% 0px' }
  )

  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el) sectionObserver.observe(el)
  }
}

const teardownSectionObserver = () => {
  if (sectionObserver) {
    sectionObserver.disconnect()
    sectionObserver = null
  }
}

// Clear active section when hero is visible (scrolled near top)
watch(scrollY, (y) => {
  if (route.path === '/' && typeof window !== 'undefined' && y < window.innerHeight * 0.25) {
    activeSection.value = ''
  }
})

// Re-observe when navigating back to homepage (sections mount/unmount with page)
watch(() => route.path, async (path) => {
  teardownSectionObserver()
  activeSection.value = ''
  if (path === '/') {
    await nextTick()
    setTimeout(setupSectionObserver, 200)
  }
})

// ── Active link detection ──
const isLinkActive = (link) => {
  if (link.type === 'route') {
    return link.to === '/'
      ? route.path === '/' && !activeSection.value
      : route.path === link.to
  }
  return route.path === '/' && activeSection.value === link.hash
}

// ── Link class helpers ──
const desktopLinkClasses = (link) => [
  'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200',
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60',
  isLinkActive(link)
    ? 'bg-white/[0.12] text-white'
    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]',
]

const mobileLinkClasses = (link) => [
  'flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60',
  isLinkActive(link)
    ? 'bg-white/[0.12] text-white'
    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]',
]

// ── Navigation handlers ──
const handleRouteLinkClick = (link) => {
  closeMobile()
  if (link.to === '/' && route.path === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToSection = (link) => {
  closeMobile()
  if (route.path === '/') {
    document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    navigateTo(link.to)
  }
}

// ── Mobile menu ──
const mobileOpen = ref(false)
const menuBtnRef = ref(null)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMobile = () => {
  mobileOpen.value = false
}

// Close drawer on route change
watch(() => route.fullPath, closeMobile)

// Keyboard: Escape to close drawer, return focus to toggle
const handleKeydown = (e) => {
  if (e.key === 'Escape' && mobileOpen.value) {
    closeMobile()
    menuBtnRef.value?.focus()
  }
}

// ── Lifecycle ──
onMounted(() => {
  if (route.path === '/') setupSectionObserver()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  teardownSectionObserver()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ── Glass Island ── */
.nav-island {
  background: rgba(13, 17, 23, 0.6);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.nav-island.is-scrolled {
  background: rgba(13, 17, 23, 0.82);
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* Gradient border — the signature touch.
   Uses mask-composite to show a gradient only
   in the 1px border ring around the island. */
.nav-island::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.35),
    rgba(168, 85, 247, 0.2),
    rgba(96, 165, 250, 0.08)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* ── Mobile Drawer ── */
.mobile-drawer {
  background: rgba(13, 17, 23, 0.88);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* ── Drawer transition ── */
.nav-drawer-enter-active,
.nav-drawer-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top center;
}

.nav-drawer-enter-from,
.nav-drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .nav-island,
  .nav-island > div {
    transition-duration: 0.01ms !important;
  }

  .nav-drawer-enter-active,
  .nav-drawer-leave-active {
    transition: none !important;
  }
}
</style>