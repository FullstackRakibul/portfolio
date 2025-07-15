<template>
  <div ref="container" class="absolute inset-0 overflow-hidden">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref(null)
const canvas = ref(null)
let ctx = null
let animationId = null
let particles = []
let mouse = { x: 0, y: 0 }

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.radius = Math.random() * 2 + 1
    this.opacity = Math.random() * 0.5 + 0.2
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.value.width) this.vx *= -1
    if (this.y < 0 || this.y > canvas.value.height) this.vy *= -1

    // Mouse interaction
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 100) {
      const force = (100 - distance) / 100
      this.vx += dx * force * 0.001
      this.vy += dy * force * 0.001
    }
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`
    ctx.fill()
  }
}

const initCanvas = () => {
  if (!canvas.value || !container.value) return

  canvas.value.width = container.value.offsetWidth
  canvas.value.height = container.value.offsetHeight
  ctx = canvas.value.getContext('2d')

  // Create particles
  particles = []
  const particleCount = Math.floor((canvas.value.width * canvas.value.height) / 8000)

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(
      Math.random() * canvas.value.width,
      Math.random() * canvas.value.height
    ))
  }
}

const drawConnections = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const opacity = (100 - distance) / 100 * 0.1
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

const animate = () => {
  if (!ctx || !canvas.value) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles.forEach(particle => {
    particle.update()
    particle.draw()
  })

  drawConnections()
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  initCanvas()
}

const handleMouseMove = (e) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

onMounted(() => {
  initCanvas()
  animate()

  window.addEventListener('resize', handleResize)
  canvas.value?.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  canvas.value?.removeEventListener('mousemove', handleMouseMove)
})
</script>