<template>
  <div class="relative w-full min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
    <!-- Background Particle Canvas -->
    <canvas ref="bgCanvasRef" class="w-full h-full absolute top-0 left-0 opacity-40" />

    <!-- Main Name Particle Canvas -->
    <canvas ref="canvasRef" class="w-full h-full absolute top-0 left-0 touch-none cursor-none"
      aria-label="Interactive particle effect with Senjuti name" />

    <!-- Particle Trail Canvas -->
    <canvas ref="trailCanvasRef" class="w-full h-full absolute top-0 left-0 pointer-events-none opacity-60" />

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 w-full">

      <div class="text-center animate-fade-in-up">
        <!-- Heart Icon - Modernized -->
        <div class="animate-fade-in-up mb-8">
        </div>

        <!-- Particle Name Area -->
        <div class="h-32 sm:h-40 lg:h-48 mb-8 flex items-center justify-center">
          <span class="sr-only">সেঁজুতি</span>
        </div>

        <div
          class="w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out">
          <Heart class="w-12 h-12 text-white" />
        </div>
      </div>
    </div>

    <!-- Floating Hearts -->
    <div class="absolute inset-0 pointer-events-none z-5">
      <div v-for="n in 8" :key="n" class="absolute animate-float" :style="{
        left: Math.random() * 1000 + '%',
        top: Math.random() * 1000 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (4 + Math.random() * 5) + 's'
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

<script setup >

import { ref, onMounted, onUnmounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import { definePageMeta, useHead } from '#imports'

// Exclude default Nuxt layout if this component is used as a page
definePageMeta({
  layout: false
})

const canvasRef = ref(null)
const bgCanvasRef = ref(null)
const trailCanvasRef = ref(null)
const mouseFollower = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const mousePositionRef = ref({ x: 0, y: 0 })
const isMobile = ref(false)
const isMouseMoving = ref(false)

let particles = []
let bgParticles = []
let trailParticles = []
let svgPaths = []
let animationFrameId = null
let bgAnimationFrameId = null
let trailAnimationFrameId = null
let mouseTimeout = null

// Enhanced color palette for a sweeter, modern design
const sweetModernColors = ['#f87171', '#fb7185', '#ec4899', '#f472b6', '#c084fc', '#e879f9']

const createBgParticle = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return null

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.1,
    color: sweetModernColors[Math.floor(Math.random() * sweetModernColors.length)]
  }
}

const createTrailParticle = (x, y, color) => {
  return {
    x: x + (Math.random() - 0.5) * 100,
    y: y + (Math.random() - 0.5) * 100,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 3 + 1,
    opacity: 0.6,
    color: color,
    life: 30 + Math.random() * 20,
    maxLife: 30 + Math.random() * 20
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

      if (distance < 150) {
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(bgParticles[j].x, bgParticles[j].y)
        ctx.strokeStyle = particle.color + '50'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
  })

  bgAnimationFrameId = requestAnimationFrame(animateBackground)
}

const animateTrails = () => {
  const canvas = trailCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Fade the existing trails
  ctx.fillStyle = 'rgba(253, 242, 248, 0.1)' // Very light pink fade
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Update and draw trail particles
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const particle = trailParticles[i]

    particle.x += particle.vx
    particle.y += particle.vy
    particle.vx *= 0.98 // Slow down over time
    particle.vy *= 0.98
    particle.life--

    const alpha = particle.life / particle.maxLife
    particle.opacity = alpha * 0.6

    if (particle.life <= 0) {
      trailParticles.splice(i, 1)
      continue
    }

    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
    ctx.fill()
  }

  trailAnimationFrameId = requestAnimationFrame(animateTrails)
}

const parseSVGPath = (pathData) => {
  const points = []
  const path = new Path2D(pathData)

  // Sample points along the path
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 682
  canvas.height = 219

  ctx.fillStyle = 'black'
  ctx.fill(path)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Sample every few pixels to get path points
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const index = (y * canvas.width + x) * 4
      if (data[index + 3] > 128) { // Alpha channel
        points.push({ x, y })
      }
    }
  }

  return points
}

const loadSVGPaths = async () => {
  try {
    const response = await fetch('/assets/img/sheju-mbg.svg')
    const svgText = await response.text()

    // Parse SVG paths
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
    const paths = svgDoc.querySelectorAll('path')

    svgPaths = []
    paths.forEach(path => {
      const pathData = path.getAttribute('d')
      const points = parseSVGPath(pathData)
      svgPaths.push(...points)
    })

    return true
  } catch (error) {
    console.error('Error loading SVG:', error)
    return false
  }
}

const createParticleFromSVG = () => {
  if (svgPaths.length === 0) return null

  const canvas = canvasRef.value
  if (!canvas) return null

  const randomPoint = svgPaths[Math.floor(Math.random() * svgPaths.length)]

  // Scale and position the SVG to fit the canvas
  const scale = isMobile.value ? 0.6 : 1.0
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2 - (isMobile.value ? 60 : 40)

  const scaledX = centerX + (randomPoint.x - 341) * scale // 341 is half of SVG width
  const scaledY = centerY + (randomPoint.y - 110) * scale // 110 is half of SVG height

  const centerDistance = Math.abs(scaledX - centerX)
  const maxDistance = canvas.width / 2
  const colorIndex = Math.floor((centerDistance / maxDistance) * sweetModernColors.length)

  return {
    x: scaledX,
    y: scaledY,
    baseX: scaledX,
    baseY: scaledY,
    size: Math.random() * 1.5 + 0.8,
    color: '#be185d',
    scatteredColor: sweetModernColors[Math.min(colorIndex, sweetModernColors.length - 1)],
    life: Math.random() * 300 + 200,
    originalLife: Math.random() * 300 + 200,
    trail: []
  }
}

const createInitialParticles = () => {
  const canvas = canvasRef.value
  if (!canvas || svgPaths.length === 0) return

  const baseParticleCount = isMobile.value ? 3000 : 5000
  const particleCount = Math.min(baseParticleCount, svgPaths.length)

  particles = []
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticleFromSVG()
    if (particle) particles.push(particle)
  }
}

const createBgParticles = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const particleCount = isMobile.value ? 80 : 50
  bgParticles = []
  for (let i = 0; i < particleCount; i++) {
    const particle = createBgParticle()
    if (particle) bgParticles.push(particle)
  }
}

const animate = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const { x: mouseX, y: mouseY } = mousePositionRef.value
  const maxDistance = isMobile.value ? 100 : 180
  const repelForce = isMobile.value ? 30 : 60

  particles.forEach((p, i) => {
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    let isScattered = false

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance
      const angle = Math.atan2(dy, dx)
      const moveX = Math.cos(angle) * force * repelForce
      const moveY = Math.sin(angle) * force * repelForce

      p.x = p.baseX - moveX
      p.y = p.baseY - moveY

      ctx.fillStyle = p.scatteredColor
      isScattered = true

      // Create trail particles when scattered
      if (Math.random() < 0.3) {
        trailParticles.push(createTrailParticle(p.x, p.y, p.scatteredColor))
      }

      if (Math.random() < 0.08) {
        ctx.shadowColor = p.scatteredColor
        ctx.shadowBlur = 6
      }
    } else {
      p.x += (p.baseX - p.x) * 0.08
      p.y += (p.baseY - p.y) * 0.08
      ctx.fillStyle = p.color
      ctx.shadowBlur = 0
    }

    const time = Date.now() * 0.001
    const floatX = Math.sin(time + i * 0.01) * 0.3
    const floatY = Math.cos(time + i * 0.01) * 0.2

    ctx.beginPath()
    ctx.arc(p.x + floatX, p.y + floatY, p.size, 0, Math.PI * 2)
    ctx.fill()

    p.life--
    if (p.life <= 0) {
      const newParticle = createParticleFromSVG()
      if (newParticle) {
        particles[i] = newParticle
      }
    }
  })

  animationFrameId = requestAnimationFrame(animate)
}

const updateCanvasSize = () => {
  const canvas = canvasRef.value
  const bgCanvas = bgCanvasRef.value
  const trailCanvas = trailCanvasRef.value
  if (!canvas || !bgCanvas || !trailCanvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  bgCanvas.width = window.innerWidth
  bgCanvas.height = window.innerHeight
  trailCanvas.width = window.innerWidth
  trailCanvas.height = window.innerHeight
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
  if (!isMobile.value) {
    handleMove(e.clientX, e.clientY)
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    e.preventDefault()
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }
}

const handleResize = async () => {
  updateCanvasSize()
  particles = []
  createInitialParticles()
  createBgParticles()
}

onMounted(async () => {
  updateCanvasSize()
  createBgParticles()
  animateBackground()
  animateTrails()

  const svgLoaded = await loadSVGPaths()
  if (svgLoaded) {
    createInitialParticles()
    animate()
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
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
  if (trailAnimationFrameId) {
    cancelAnimationFrame(trailAnimationFrameId)
  }

  clearTimeout(mouseTimeout)
})

useHead({
  title: 'sweetheart | সেঁজুতি',
  meta: [
    { name: 'description', content: 'between you and everything' }
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
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.9s ease-out forwards;
}

.animate-float {
  animation: float 5s ease-in-out infinite;
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