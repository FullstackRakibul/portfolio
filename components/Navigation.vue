<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
    isScrolled
      ? 'bg-gray-900/95 backdrop-blur-md border-gray-800 shadow-lg shadow-blue-900/10 py-1'
      : 'bg-gray-900/50 backdrop-blur-sm border-transparent py-2'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 transition-all duration-300">

        <NuxtLink to="/" class="group text-xl font-bold tracking-tight relative overflow-hidden">
          <span
            class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-80">
            Rakibul H. Rabbi
          </span>
          <span
            class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </NuxtLink>

        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="desktop-link">Home</NuxtLink>
          <NuxtLink to="/onTheWayToBeCreative" class="desktop-link" title="On The Way To Be Creative">OTWTBC</NuxtLink>
          <a href="#contact" class="desktop-link">Contact</a>

          <div class="flex items-center space-x-3 border-l border-gray-700 pl-6 ml-2">
            <a href="https://github.com/FullstackRakibul" target="_blank"
              class="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-blue-400 hover:-translate-y-1 transition-all duration-300 group">
              <Github class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a href="https://www.linkedin.com/in/fullstackrakibul" target="_blank"
              class="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-blue-400 hover:-translate-y-1 transition-all duration-300 group">
              <Linkedin class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <NuxtLink to="/resume" title="Resume"
              class="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-blue-400 hover:-translate-y-1 transition-all duration-300 group">
              <Newspaper class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </NuxtLink>
          </div>
        </div>

        <button @click="toggleMobile"
          class="md:hidden p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition-colors focus:outline-none">
          <Menu v-if="!mobileOpen" class="w-5 h-5 animate-in fade-in zoom-in duration-200" />
          <X v-else class="w-5 h-5 animate-in fade-in zoom-in duration-200" />
        </button>
      </div>

      <transition name="mobile-menu">
        <div v-if="mobileOpen" class="md:hidden overflow-hidden border-t border-gray-800 mt-2">
          <div class="flex flex-col space-y-1 py-4">
            <NuxtLink to="/" class="mobile-link" @click="mobileOpen = false">Home</NuxtLink>
            <NuxtLink to="/onTheWayToBeCreative" class="mobile-link" @click="mobileOpen = false">Creative</NuxtLink>
            <a href="#contact" class="mobile-link" @click="mobileOpen = false">Contact</a>

            <div class="h-px bg-gray-800 my-2"></div>

            <a href="https://github.com/FullstackRakibul" target="_blank" class="mobile-link flex items-center gap-3">
              <Github class="w-5 h-5 text-gray-400" />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/fullstackrakibul" target="_blank"
              class="mobile-link flex items-center gap-3">
              <Linkedin class="w-5 h-5 text-gray-400" />
              <span>LinkedIn</span>
            </a>
            <NuxtLink to="/resume" class="mobile-link flex items-center gap-3" @click="mobileOpen = false">
              <Newspaper class="w-5 h-5 text-gray-400" />
              <span>Resume</span>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, Github, Linkedin, Newspaper } from 'lucide-vue-next'

const mobileOpen = ref(false)
const isScrolled = ref(false)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

// Handle scroll effect
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Vue Transition for Mobile Menu */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 400px;
  opacity: 1;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>