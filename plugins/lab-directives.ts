import type { Directive } from 'vue'

/**
 * v-reveal: marks the element's [data-reveal] descendants (or itself) as entered once it
 * scrolls into view. Children stagger by their --i index.
 *
 * v-magnetic: the element leans a few pixels toward the pointer (fine pointers only).
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    const noop: Directive = { getSSRProps: () => ({}) }
    nuxtApp.vueApp.directive('reveal', noop)
    nuxtApp.vueApp.directive('magnetic', noop)
    return
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        const targets = el.hasAttribute('data-reveal') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
        targets.forEach(t => t.classList.add('is-in'))
        io?.unobserve(el)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })
    : null

  const reveal: Directive<HTMLElement> = {
    mounted(el) {
      const targets = el.hasAttribute('data-reveal') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
      targets.forEach((t, i) => { if (!t.style.getPropertyValue('--i')) t.style.setProperty('--i', String(i % 8)) })
      if (!io) { targets.forEach(t => t.classList.add('is-in')); return }
      io.observe(el)
    },
    unmounted(el) { io?.unobserve(el) },
  }

  type MagEl = HTMLElement & { _mag?: { move: (e: PointerEvent) => void; leave: () => void } }
  const magnetic: Directive<MagEl, number | undefined> = {
    mounted(el, binding) {
      if (reduce.matches || !matchMedia('(pointer: fine)').matches) return
      const strength = binding.value ?? 6
      el.style.transition = 'transform 300ms cubic-bezier(0.22,1,0.36,1)'
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
        const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
        el.style.transform = `translate(${(x * strength).toFixed(2)}px, ${(y * strength).toFixed(2)}px)`
      }
      const leave = () => { el.style.transform = '' }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      el._mag = { move, leave }
    },
    unmounted(el) {
      if (!el._mag) return
      el.removeEventListener('pointermove', el._mag.move)
      el.removeEventListener('pointerleave', el._mag.leave)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
  nuxtApp.vueApp.directive('magnetic', magnetic)
})
