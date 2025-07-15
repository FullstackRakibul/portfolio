<template>
  <div
    class="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
    <!-- Background Particle Canvas -->
    <canvas ref="bgCanvasRef" class="w-full h-full absolute top-0 left-0 opacity-30" />

    <!-- Main Name Particle Canvas -->
    <canvas ref="canvasRef" class="w-full h-full absolute top-0 left-0 touch-none cursor-none"
      aria-label="Interactive particle effect with Rakibul H. Rabbi name" />

    <!-- Main Content -->
    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8">
      <div class="animate-fade-in-up">
        <!-- Name will be rendered by particles -->
        <div class="h-24 sm:h-32 lg:h-40 mb-8"></div>

        <!-- Tech Stack and Welcome Message -->
        <div class="text-lg sm:text-xl text-gray-300 mb-8 space-y-4">
          <p class="animate-fade-in-up animation-delay-200 font-mono text-sm sm:text-base">
            <span class="text-blue-400">C#</span> |
            <span class="text-purple-400">.NET</span> |
            <span class="text-cyan-400">React</span> |
            <span class="text-green-400">SQL</span> |
            <span class="text-emerald-400">Vue</span> |
            <span class="text-yellow-400">Django</span> |
            <span class="text-red-400">Angular</span> |
            <span class="text-pink-400">CMS</span>
          </p>
          <p class="animate-fade-in-up animation-delay-400 max-w-4xl mx-auto text-gray-300 italic">
            Welcome to my code sanctuary – where systems meet soul, and logic meets artistry.
          </p>
        </div>

        <!-- Additional Info -->
        <div class="animate-fade-in-up animation-delay-600 mb-8">
          <p class="font-mono text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Full-Stack Software Developer specializing in{' '}
            <span class="text-purple-400 hover:text-cyan-400 transition-colors duration-300">
              Enterprise Applications
            </span>{' '}
            and{' '}
            <span class="text-cyan-400 hover:text-purple-400 transition-colors duration-300">
              Modern Web Technologies
            </span>
          </p>
        </div>

        <!-- CTA Button -->
        <div class="animate-fade-in-up animation-delay-800">
          <a href="#about"
            class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Explore My Work
            <ChevronDown class="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    <!-- GitHub-style Stats Cards -->
    <div class="absolute bottom-8 left-8 right-8 z-10 animate-fade-in-up animation-delay-1000">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-center">
          <div class="text-cyan-400 font-bold text-lg">5+</div>
          <div class="text-gray-400 text-xs">Years Experience</div>
        </div>
        <div class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-center">
          <div class="text-purple-400 font-bold text-lg">50+</div>
          <div class="text-gray-400 text-xs">Projects Completed</div>
        </div>
        <div class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-center">
          <div class="text-green-400 font-bold text-lg">10+</div>
          <div class="text-gray-400 text-xs">Technologies</div>
        </div>
        <div class="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-center">
          <div class="text-yellow-400 font-bold text-lg">24/7</div>
          <div class="text-gray-400 text-xs">Code Passion</div>
        </div>
      </div>
    </div>

    <!-- Mouse follower effect -->
    <div ref="mouseFollower"
      class="fixed w-8 h-8 border-2 border-purple-400/50 rounded-full pointer-events-none z-20 transition-all duration-300"
      :style="{
        left: mousePosition.x - 16 + 'px',
        top: mousePosition.y - 16 + 'px',
        opacity: isMouseMoving ? 0.8 : 0,
        transform: isMouseMoving ? 'scale(1.2)' : 'scale(1)'
      }" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const canvasRef = ref(null)
const bgCanvasRef = ref(null)
const mouseFollower = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const mousePositionRef = ref({ x: 0, y: 0 })
const isTouchingRef = ref(false)
const isMobile = ref(false)
const isMouseMoving = ref(false)

let particles = []
let bgParticles = []
let textImageData = null
let animationFrameId = null
let bgAnimationFrameId = null
let mouseTimeout = null

// Background particles for ambient effect
const createBgParticle = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return null

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)]
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

    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.width
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height
    if (particle.y > canvas.height) particle.y = 0

    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 0.5)
    ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
    ctx.fill()

    // Connect nearby particles
    for (let j = i + 1; j < bgParticles.length; j++) {
      const dx = particle.x - bgParticles[j].x
      const dy = particle.y - bgParticles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(bgParticles[j].x, bgParticles[j].y)
        ctx.strokeStyle = particle.color + '20'
        ctx.lineWidth = 0.5
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

  ctx.fillStyle = 'white'
  ctx.save()

  const scale = isMobile.value ? 0.6 : 1.2
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2 - 100 // Move up to make room for content

  ctx.translate(centerX, centerY)
  ctx.scale(scale, scale)

  // Set font for the name
  const fontSize = isMobile.value ? 36 : 64
  ctx.font = `bold ${fontSize}px Inter, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Draw the name with letter spacing
  const name = 'Rakibul H. Rabbi'
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

    if (data[(y * canvas.width + x) * 4 + 3] > 128) {
      // Determine color based on position (gradient effect)
      const centerX = canvas.width / 2
      const distanceFromCenter = Math.abs(x - centerX)
      const maxDistance = canvas.width / 2
      const colorRatio = distanceFromCenter / maxDistance

      return {
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 1.5 + 0.8,
        color: 'white',
        scatteredColor: colorRatio > 0.5 ? '#8b5cf6' : '#06b6d4',
        life: Math.random() * 150 + 100,
        velocity: { x: 0, y: 0 },
        originalLife: Math.random() * 150 + 100
      }
    }
  }

  return null
}

const createInitialParticles = (scale) => {
  const canvas = canvasRef.value
  if (!canvas) return

  const baseParticleCount = 4000
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

  const particleCount = 50
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
  const maxDistance = isMobile.value ? 120 : 180
  const repelForce = 60

  particles.forEach((p, i) => {
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < maxDistance && (isTouchingRef.value || !('ontouchstart' in window))) {
      // Mouse repel effect
      const force = (maxDistance - distance) / maxDistance
      const angle = Math.atan2(dy, dx)
      const moveX = Math.cos(angle) * force * repelForce
      const moveY = Math.sin(angle) * force * repelForce

      p.x = p.baseX - moveX
      p.y = p.baseY - moveY

      // Color change on interaction
      ctx.fillStyle = p.scatteredColor

      // Add some glow effect
      if (Math.random() < 0.1) {
        ctx.shadowColor = p.scatteredColor
        ctx.shadowBlur = 8
      }
    } else {
      // Return to original position
      p.x += (p.baseX - p.x) * 0.08
      p.y += (p.baseY - p.y) * 0.08
      ctx.fillStyle = 'white'
      ctx.shadowBlur = 0
    }

    // Add subtle floating animation
    const time = Date.now() * 0.001
    const floatX = Math.sin(time + i * 0.01) * 0.5
    const floatY = Math.cos(time + i * 0.01) * 0.3

    ctx.beginPath()
    ctx.arc(p.x + floatX, p.y + floatY, p.size, 0, Math.PI * 2)
    ctx.fill()

    // Particle lifecycle
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
  }, 2000)
}

const handleMouseMove = (e) => {
  handleMove(e.clientX, e.clientY)
}

const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    e.preventDefault()
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }
}

const handleTouchStart = () => {
  isTouchingRef.value = true
}

const handleTouchEnd = () => {
  isTouchingRef.value = false
  mousePositionRef.value = { x: 0, y: 0 }
}

const handleMouseLeave = () => {
  if (!('ontouchstart' in window)) {
    mousePositionRef.value = { x: 0, y: 0 }
    isMouseMoving.value = false
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
  const canvas = canvasRef.value
  const bgCanvas = bgCanvasRef.value
  if (!canvas || !bgCanvas) return

  updateCanvasSize()
  createBgParticles()
  animateBackground()

  const scale = createTextImage()
  createInitialParticles(scale)
  animate(scale)

  // Event listeners
  window.addEventListener('resize', handleResize)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
  canvas.addEventListener('mouseleave', handleMouseLeave)
  canvas.addEventListener('touchstart', handleTouchStart)
  canvas.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    window.removeEventListener('resize', handleResize)
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('touchmove', handleTouchMove)
    canvas.removeEventListener('mouseleave', handleMouseLeave)
    canvas.removeEventListener('touchstart', handleTouchStart)
    canvas.removeEventListener('touchend', handleTouchEnd)
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (bgAnimationFrameId) {
    cancelAnimationFrame(bgAnimationFrameId)
  }

  clearTimeout(mouseTimeout)
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

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
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