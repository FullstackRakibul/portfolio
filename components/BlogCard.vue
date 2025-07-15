<template>
  <NuxtLink :to="`/blog/${slug}`"
    class="group block bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <h2 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 sm:mb-0">
        {{ title }}
      </h2>
      <div class="flex items-center text-sm text-gray-400 space-x-4">
        <span>{{ formatDate(date) }}</span>
        <span>{{ readTime }}</span>
      </div>
    </div>

    <p class="text-gray-300 mb-4 leading-relaxed">{{ excerpt }}</p>

    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in tags" :key="tag" class="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
          {{ tag }}
        </span>
      </div>
      <div class="flex items-center text-blue-400 text-sm font-medium">
        <span>Read More</span>
        <ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next'

defineProps({
  title: String,
  excerpt: String,
  date: String,
  readTime: String,
  tags: Array,
  slug: String
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>