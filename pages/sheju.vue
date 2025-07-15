<template>
  <div class="relative w-full min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
    <!-- Background Particle Canvas -->
    <canvas ref="bgCanvasRef" class="w-full h-full absolute top-0 left-0 opacity-40" />

    <!-- Main Name Particle Canvas -->
    <canvas ref="canvasRef" class="w-full h-full absolute top-0 left-0 touch-none cursor-none"
      aria-label="Interactive particle effect with Senjuti name" />

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 w-full">
      <div class="text-center animate-fade-in-up">
        <!-- Heart Icon - Modernized -->
        <div class="animate-fade-in-up mb-8">
          <div
            class="w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out">
            <Heart class="w-12 h-12 text-white" />
          </div>
        </div>

        <!-- Name will be rendered by particles -->
        <div class="h-32 sm:h-40 lg:h-48 mb-8 flex items-center justify-center">
          <!-- Placeholder for particle name - ensures layout stability -->
          <span class="sr-only">সেঁজুতি</span>
        </div>

        <!-- Inspirational Quote -->
        <div class="animate-fade-in-up animation-delay-800 mb-8">
          <blockquote
            class="text-xl sm:text-2xl italic text-gray-700 max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-xl relative overflow-hidden">
            <span
              class="absolute top-0 left-0 text-rose-300 text-6xl opacity-30 font-serif -translate-x-4 -translate-y-4">“</span>
            "Your kindness is a gift to the world, and your gentle strength inspires everyone around you."
            <span
              class="absolute bottom-0 right-0 text-rose-300 text-6xl opacity-30 font-serif translate-x-4 translate-y-4">”</span>
          </blockquote>
        </div>

        <!-- Action Button -->
        <div class="animate-fade-in-up animation-delay-1000">
          <button
            class="inline-flex items-center px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75">
            <Heart class="w-6 h-6 mr-3" />
            Spread More Love
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Hearts -->
    <div class="absolute inset-0 pointer-events-none z-5">
      <div v-for="n in 8" :key="n" class="absolute animate-float" :style="{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        animationDuration: (4 + Math.random() * 3) + 's' // Slightly longer duration for smoother float
      }">
        <Heart class="w-5 h-5 text-rose-300 opacity-70" />
      </div>
    </div>

    <!-- Mouse follower effect - hidden on mobile -->
    <div ref="mouseFollower"
      class="fixed w-6 h-6 border-2 border-rose-400/60 rounded-full pointer-events-none z-20 transition-all duration-300 hidden sm:block"
      :style="{
        left: mousePosition.x - 12 + 'px',
        top: mousePosition.y - 12 + 'px',
        opacity: isMouseMoving ? 0.9 : 0,
        transform: isMouseMoving ? 'scale(1.5)' : 'scale(1)'
      }" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Heart, Shield, Users, Sparkles, Flower } from 'lucide-vue-next'
import { definePageMeta } from '#imports'

// Exclude default Nuxt layout if this component is used as a page
definePageMeta({
  layout: false
})

const canvasRef = ref(null)
const bgCanvasRef = ref(null)
const mouseFollower = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const mousePositionRef = ref({ x: 0, y: 0 })
const isMobile = ref(false)
const isMouseMoving = ref(false)

let particles = []
let bgParticles = []
let textImageData = null
let animationFrameId = null
let bgAnimationFrameId = null
let mouseTimeout = null

// Enhanced color palette for a sweeter, modern design
const sweetModernColors = ['#f87171', '#fb7185', '#ec4899', '#f472b6', '#c084fc', '#e879f9']

const createBgParticle = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return null

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3, // Slower background particles
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 3 + 1, // Slightly larger background particles
    opacity: Math.random() * 0.4 + 0.1, // More visible background particles
    color: sweetModernColors[Math.floor(Math.random() * sweetModernColors.length)]
  }
}

const animateBackground = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  bgParticles.forEach((particle, i) => {
    particle.x += particle.vx
    particle.y += particle.vy

    // Wrap particles around the canvas
    if (particle.x < 0) particle.x = canvas.width
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height
    if (particle.y > canvas.height) particle.y = 0

    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
    ctx.fill()

    // Connect nearby particles with gentle lines
    for (let j = i + 1; j < bgParticles.length; j++) {
      const dx = particle.x - bgParticles[j].x
      const dy = particle.y - bgParticles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) { // Increased connection distance
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(bgParticles[j].x, bgParticles[j].y)
        ctx.strokeStyle = particle.color + '20' // Slightly more opaque lines
        ctx.lineWidth = 1.5 // Thicker lines
        ctx.stroke()
      }
    }
  })

  bgAnimationFrameId = requestAnimationFrame(animateBackground)
}

const createTextImage = () => {
  const canvas = canvasRef.value
  if (!canvas) return 0

  const ctx = canvas.getContext('2d')
  if (!ctx) return 0

  ctx.fillStyle = '#be185d' // Rose-700 for better contrast
  ctx.save()

  // Adjust scale based on mobile status
  const scale = isMobile.value ? 0.9 : 1.6 // Larger scale for mobile, slightly larger for desktop
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2 - (isMobile.value ? 80 : 50) // Adjust vertical position for mobile

  ctx.translate(centerX, centerY)
  ctx.scale(scale, scale)

  // Bengali font support
  const fontSize = isMobile.value ? 64 : 96 // Larger font size for better mobile visibility
  ctx.font = `bold ${fontSize}px "Noto Sans Bengali", "SolaimanLipi", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const name = 'সেঁজুতি'
  ctx.fillText(name, 0, 0)

  ctx.restore()
  textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  return scale
}

const createParticle = (scale) => {
  const canvas = canvasRef.value
  if (!canvas || !textImageData) return null

  const data = textImageData.data

  for (let attempt = 0; attempt < 100; attempt++) {
    const x = Math.floor(Math.random() * canvas.width)
    const y = Math.floor(Math.random() * canvas.height)

    if (data[(y * canvas.width + x) * 4 + 3] > 128) { // Check alpha channel for pixel presence
      const centerX = canvas.width / 2
      const distanceFromCenter = Math.abs(x - centerX)
      const maxDistance = canvas.width / 2
      const colorIndex = Math.floor((distanceFromCenter / maxDistance) * sweetModernColors.length)
      return {
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 1.5 + 0.5, // Smaller particles
        color: '#be185d', // Original color
        scatteredColor: sweetModernColors[Math.min(colorIndex, sweetModernColors.length - 1)], // Use new color palette
        life: Math.random() * 250 + 200, // Longer particle life
        originalLife: Math.random() * 250 + 200
      }
    }
  }
  return null
}

const createInitialParticles = (scale) => {
  const canvas = canvasRef.value
  if (!canvas) return

  // Adjust particle count based on screen size for performance and visual density
  const baseParticleCount = isMobile.value ? 5000 : 7000
  const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))

  particles = []
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle(scale)
    if (particle) particles.push(particle)
  }
}

const createBgParticles = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const particleCount = isMobile.value ? 100 : 60 // Fewer background particles on mobile
  bgParticles = []
  for (let i = 0; i < particleCount; i++) {
    const particle = createBgParticle()
    if (particle) bgParticles.push(particle)
  }
}

const animate = (scale) => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const { x: mouseX, y: mouseY } = mousePositionRef.value
  const maxDistance = isMobile.value ? 80 : 200 // Smaller repel distance on mobile
  const repelForce = isMobile.value ? 25 : 50 // Weaker repel force on mobile

  particles.forEach((p, i) => {
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance
      const angle = Math.atan2(dy, dx)
      const moveX = Math.cos(angle) * force * repelForce
      const moveY = Math.sin(angle) * force * repelForce

      p.x = p.baseX - moveX
      p.y = p.baseY - moveY

      ctx.fillStyle = p.scatteredColor
      if (Math.random() < 0.07) { // Slightly higher chance of shadow
        ctx.shadowColor = p.scatteredColor
        ctx.shadowBlur = 8 // Increased shadow blur
      }
    } else {
      p.x += (p.baseX - p.x) * 0.08 // Faster return to base position
      p.y += (p.baseY - p.y) * 0.08
      ctx.fillStyle = p.color
      ctx.shadowBlur = 0
    }

    const time = Date.now() * 0.001
    const floatX = Math.sin(time + i * 0.01) * 0.2 // Reduced float
    const floatY = Math.cos(time + i * 0.01) * 0.1 // Reduced float

    ctx.beginPath()
    ctx.arc(p.x + floatX, p.y + floatY, p.size, 0, Math.PI * 2)
    ctx.fill()

    p.life--
    if (p.life <= 0) {
      const newParticle = createParticle(scale)
      if (newParticle) {
        particles[i] = newParticle
      }
    }
  })

  animationFrameId = requestAnimationFrame(() => animate(scale))
}

const updateCanvasSize = () => {
  const canvas = canvasRef.value
  const bgCanvas = bgCanvasRef.value
  if (!canvas || !bgCanvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  bgCanvas.width = window.innerWidth
  bgCanvas.height = window.innerHeight
  isMobile.value = window.innerWidth < 768
}

const handleMove = (x, y) => {
  mousePositionRef.value = { x, y }
  mousePosition.value = { x, y }
  isMouseMoving.value = true

  clearTimeout(mouseTimeout)
  mouseTimeout = setTimeout(() => {
    isMouseMoving.value = false
  }, 1500)
}

const handleMouseMove = (e) => {
  if (!isMobile.value) { // Only track mouse on non-mobile devices
    handleMove(e.clientX, e.clientY)
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    e.preventDefault()
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }
}

const handleResize = () => {
  updateCanvasSize()
  const newScale = createTextImage()
  particles = []
  createInitialParticles(newScale)
  createBgParticles()
}

onMounted(() => {
  updateCanvasSize()
  createBgParticles()
  animateBackground()

  const scale = createTextImage()
  createInitialParticles(scale)
  animate(scale)

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: false }) // Add touchmove listener
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (bgAnimationFrameId) {
    cancelAnimationFrame(bgAnimationFrameId)
  }

  clearTimeout(mouseTimeout)
})

useHead({
  title: 'Welcome সেঁজুতি - Sweet Friend',
  meta: [
    { name: 'description', content: 'A warm welcome page for সেঁজুতি with a sweet, modern design.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap' }
  ]
})
</script>

<style scoped>
.cursor-none {
  cursor: none;
}

@media (max-width: 768px) {
  .cursor-none {
    cursor: default;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-25px) rotate(180deg);
    /* Increased float distance */
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.9s ease-out forwards;
  /* Slightly longer animation */
}

.animate-float {
  animation: float 5s ease-in-out infinite;
  /* Slightly longer float duration */
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  opacity: 0;
}

.animation-delay-800 {
  animation-delay: 0.8s;
  opacity: 0;
}

.animation-delay-1000 {
  animation-delay: 1.0s;
  opacity: 0;
}
</style>