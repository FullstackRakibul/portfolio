<template>
  <div
    class="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
    <div class="flex items-center mb-4">
      <component :is="iconComponent" class="w-6 h-6 text-blue-400 mr-3" />
      <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
    </div>
    <ul class="space-y-2">
      <li v-for="item in items" :key="item" class="text-gray-300 text-sm flex items-start">
        <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Code, Database, Layout, Settings, Cloud } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  title: String,
  items: Array,
  icon: String
})

const iconMap = {
  Code,
  Database,
  Layout,
  Settings,
  Cloud
}

const iconComponent = computed(() => iconMap[props.icon] || Code)
</script>