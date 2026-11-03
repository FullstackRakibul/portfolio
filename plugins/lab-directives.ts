import type { Directive } from 'vue'

/**
 * v-reveal: gives the element's [data-reveal] descendants (or itself) an entrance as each
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

  // An element waits hidden only while it is within two screens of the viewport. Further away it
  // rests visible (data-rest), and once entered or scrolled past it stays shown (data-in), so a jump
  // down the page never leaves content waiting for an entrance that will not come.
  const pending = new Set<HTMLElement>()
  let raf = 0
  const check = () => {
    raf = 0
    const vh = innerHeight
    for (const el of pending) {
      const r = el.getBoundingClientRect()
      if (r.top < vh * 0.92) {
        el.setAttribute('data-in', '')
        pending.delete(el)
      } else if (r.top > vh * 2) el.setAttribute('data-rest', '')
      else el.removeAttribute('data-rest')
    }
  }
  const schedule = () => { if (!raf && pending.size) raf = requestAnimationFrame(check) }
  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule, { passive: true })

  const reveal: Directive<HTMLElement> = {
    mounted(el) {
      const targets = el.hasAttribute('data-reveal') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
      targets.forEach((t, i) => {
        if (!t.style.getPropertyValue('--i')) t.style.setProperty('--i', String(i % 8))
        pending.add(t)
      })
      // One frame in the hidden state first, so what is already on screen still makes its entrance.
      requestAnimationFrame(schedule)
    },
    unmounted(el) {
      const targets = el.hasAttribute('data-reveal') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
      targets.forEach(t => pending.delete(t))
    },
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
