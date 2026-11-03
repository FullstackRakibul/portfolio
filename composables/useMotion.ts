import type { Ref } from 'vue'

/** True while the visitor asks for reduced motion; follows changes to the setting. */
export function useReducedMotion() {
  const reduce = ref(false)
  let mq: MediaQueryList | null = null
  const set = () => { reduce.value = !!mq?.matches }
  onMounted(() => {
    mq = matchMedia('(prefers-reduced-motion: reduce)')
    set()
    mq.addEventListener('change', set)
  })
  onBeforeUnmount(() => mq?.removeEventListener('change', set))
  return reduce
}

/** True while the element is on screen (with a margin), so loops can stop when it is not. */
export function useInView(target: Ref<Element | null>, rootMargin = '80px') {
  const inView = ref(false)
  let io: IntersectionObserver | null = null
  onMounted(() => {
    if (!target.value) return
    io = new IntersectionObserver(([e]) => { inView.value = e.isIntersecting }, { rootMargin })
    io.observe(target.value)
  })
  onBeforeUnmount(() => io?.disconnect())
  return inView
}

/**
 * Runs an SVG's own animations (SMIL) only while it is on screen, motion is allowed and,
 * when given, `running` is true. Paused animations cost nothing.
 */
export function useSvgMotion(svg: Ref<SVGSVGElement | null>, running?: Ref<boolean>) {
  const reduce = useReducedMotion()
  const inView = useInView(svg as Ref<Element | null>)
  watchEffect(() => {
    const el = svg.value
    if (!el || typeof el.pauseAnimations !== 'function') return
    if (inView.value && !reduce.value && (running?.value ?? true)) el.unpauseAnimations()
    else el.pauseAnimations()
  })
  return { reduce, inView }
}

/** Calls `frame(t)` on animation frames, at most `fps` times a second, while `active` is true. */
export function useFrameLoop(active: Ref<boolean>, frame: (t: number) => void, fps = 30) {
  let raf = 0
  let last = 0
  const step = 1000 / fps
  const tick = (now: number) => {
    raf = 0
    if (!active.value) return
    if (now - last >= step) { last = now; frame(now / 1000) }
    raf = requestAnimationFrame(tick)
  }
  watch(active, (on) => {
    if (on && !raf) raf = requestAnimationFrame(tick)
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0 }
  }, { immediate: true, flush: 'post' })
  onBeforeUnmount(() => cancelAnimationFrame(raf))
}
