<template>
  <a :href="url" target="_blank"
    class="group flex flex-col h-full bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 relative overflow-hidden">

    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    </div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="flex items-start justify-between mb-4 gap-4">
        <div>
          <span v-if="category"
            class="inline-block px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full mb-3 border border-blue-500/20">
            {{ category }}
          </span>
          <h3 class="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors leading-tight">{{ title
          }}</h3>
        </div>
        <div class="bg-gray-700/50 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors shrink-0">
          <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      <p class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{{ description }}</p>

      <div class="flex items-center text-blue-400 text-sm font-semibold mt-auto pt-4 border-t border-gray-700/50">
        <span>View Project</span>
        <ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
      </div>
    </div>
  </a>
</template>

<script setup>
import { ExternalLink, ArrowRight } from 'lucide-vue-next'

defineProps({
  title: String,
  url: String,
  description: String,
  category: String // Added category prop for the new badge
})
</script>