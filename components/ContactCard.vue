<template>
  <a :href="href"
    class="group block bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 text-center">
    <component :is="iconComponent"
      class="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
    <h3 class="text-white font-semibold mb-2">{{ label }}</h3>
    <p class="text-gray-300 text-sm">{{ value }}</p>
  </a>
</template>

<script setup>
import { Phone, Mail, Github, Globe } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  icon: String,
  label: String,
  value: String,
  href: String
})

const iconMap = {
  Phone,
  Mail,
  Github,
  Globe
}

const iconComponent = computed(() => iconMap[props.icon] || Globe)
</script>