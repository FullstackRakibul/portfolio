<template>
  <div
    class="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <h3 class="text-xl font-semibold text-white mb-1">{{ position }}</h3>
        <p class="text-blue-400 font-medium">{{ company }}</p>
      </div>
      <div class="text-sm text-gray-400 mt-2 sm:mt-0 sm:text-right">
        <p>{{ period }}</p>
        <p v-if="location">{{ location }}</p>
      </div>
    </div>
    <ul class="space-y-2">
      <li v-for="responsibility in responsibilities" :key="responsibility"
        class="text-gray-300 text-sm flex items-start">
        <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
        {{ responsibility }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  company: String,
  position: String,
  period: String,
  location: String,
  responsibilities: Array
})
</script>