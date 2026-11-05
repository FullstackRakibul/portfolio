// Two-finger pinch on a touch screen: the content scales live under the fingers (a CSS transform, cheap),
// and the new zoom is committed when the fingers lift, so the pages redraw sharp once.
import type { Ref } from 'vue'

export function usePinch(stage: Ref<HTMLElement | null>, content: Ref<HTMLElement | null>, zoom: () => number, commit: (z: number) => void) {
  let start = 0
  let ratio = 1
  const pinching = ref(false)
  const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)

  function onStart(e: TouchEvent) {
    if (e.touches.length !== 2 || !content.value || !stage.value) return
    start = dist(e.touches)
    ratio = 1
    pinching.value = true
    const r = content.value.getBoundingClientRect()
    const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left
    const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top
    content.value.style.transformOrigin = `${mx}px ${my}px`
  }
  function onMove(e: TouchEvent) {
    if (!pinching.value || e.touches.length !== 2 || !content.value) return
    e.preventDefault()
    const z = zoom()
    ratio = Math.min(3 / z, Math.max(0.5 / z, dist(e.touches) / start))
    content.value.style.transform = `scale(${ratio})`
  }
  function onEnd(e: TouchEvent) {
    if (!pinching.value || e.touches.length > 1) return
    pinching.value = false
    if (content.value) content.value.style.transform = ''
    if (Math.abs(ratio - 1) > 0.04) commit(Math.round(zoom() * ratio * 20) / 20)
  }

  onMounted(() => {
    const el = stage.value
    if (!el) return
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    el.addEventListener('touchcancel', onEnd, { passive: true })
  })
  onBeforeUnmount(() => {
    const el = stage.value
    if (!el) return
    el.removeEventListener('touchstart', onStart)
    el.removeEventListener('touchmove', onMove)
    el.removeEventListener('touchend', onEnd)
    el.removeEventListener('touchcancel', onEnd)
  })
  return { pinching }
}
