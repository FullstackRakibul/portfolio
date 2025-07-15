<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/"
          class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Rakibul H. Rabbi
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
          
          <a href="#contact" class="nav-link">Contact</a>
          <a href="https://github.com/FullstackRakibul" target="_blank"
            class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <Github class="w-5 h-5" />
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobile" class="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
          <Menu v-if="!mobileOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileOpen" class="md:hidden py-4 border-t border-gray-800">
        <div class="flex flex-col space-y-4">
          <NuxtLink to="/" class="nav-link" @click="mobileOpen = false">Home</NuxtLink>
          <NuxtLink to="/blog" class="nav-link" @click="mobileOpen = false">Blog</NuxtLink>
          <a href="#contact" class="nav-link" @click="mobileOpen = false">Contact</a>
          <a href="https://github.com/FullstackRakibul" target="_blank" class="flex items-center space-x-2 nav-link">
            <Github class="w-5 h-5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X, Github } from 'lucide-vue-next'

const mobileOpen = ref(false)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}
</script>

<style scoped>

</style>