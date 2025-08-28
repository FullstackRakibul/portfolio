<template>
  <NuxtLink :to="`/onTheWayToBeCreative/${slug}`" :class="[
    'group block bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]',
    featured ? 'lg:p-8' : ''
  ]">

    <!-- Category Badge -->
    <div class="flex items-center justify-between mb-4">
      <span v-if="category" class="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
        {{ category }}
      </span>
      <div class="flex items-center text-sm text-gray-400 space-x-4">
        <span>{{ formatDate(date) }}</span>
        <span>{{ readTime }}</span>
      </div>
    </div>

    <h2 :class="[
      'font-semibold text-white group-hover:text-blue-400 transition-colors mb-4',
      featured ? 'text-2xl' : 'text-xl'
    ]">
      {{ title }}
    </h2>

    <p :class="[
      'text-gray-300 mb-6 leading-relaxed',
      featured ? 'text-base' : 'text-sm'
    ]">
      {{ excerpt }}
    </p>

    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in tags.slice(0, 3)" :key="tag"
          class="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full hover:bg-gray-600/50 transition-colors">
          {{ tag }}
        </span>
        <span v-if="tags.length > 3" class="px-3 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
          +{{ tags.length - 3 }} more
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
import { useBlog } from '~/composables/useBlog'

const { formatDate } = useBlog()

const props = defineProps({
  title: String,
  excerpt: String,
  date: String,
  readTime: String,
  tags: Array,
  slug: String,
  category: String,
  featured: {
    type: Boolean,
    default: false
  }
})
</script>