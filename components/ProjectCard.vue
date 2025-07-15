<template>
  <a :href="url" target="_blank"
    class="group block bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{{ title }}</h3>
      <ExternalLink class="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
    </div>
    <p class="text-gray-300 text-sm mb-4">{{ description }}</p>
    <div class="flex items-center text-blue-400 text-sm font-medium">
      <span>Visit Site</span>
      <ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </div>
  </a>
</template>

<script setup>
import { ExternalLink, ArrowRight } from 'lucide-vue-next'

defineProps({
  title: String,
  url: String,
  description: String
})
</script>