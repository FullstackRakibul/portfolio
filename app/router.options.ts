import type { RouterConfig } from '@nuxt/schema'
import { START_LOCATION } from 'vue-router'
import { SECTION_IDS, headerOffset, prefersReducedMotion, sectionFromPath } from '~/utils/sections'

// Hash routing (nuxt.config: router.options.hashMode): every address lives after the #, so the host only
// ever serves index.html. Each homepage section gets its own address, /#/projects: a route of its own
// (aliases count as the same location, so the router would refuse to move between them) that shows the
// home page under the same page key, so moving between sections never remounts the page.
export default <RouterConfig>{
  routes: (routes) => {
    const index = routes.find(r => r.name === 'index')
    if (!index) return routes
    const home = { ...index.meta, key: 'home', home: true }
    return [
      ...routes.map(r => (r === index ? { ...r, meta: home } : r)),
      ...SECTION_IDS.map(id => ({ ...index, name: `section-${id}`, path: `/${id}`, meta: { ...home, section: id } })),
    ]
  },

  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()
    const first = from === START_LOCATION
    const samePage = !first && (to.name === from.name || (!!to.meta.home && !!from.meta.home))

    const id = sectionFromPath(to.path)

    // Wait until the page that holds the target is on screen (and fonts have settled its layout):
    // on first load until the app is ready, otherwise until the section is in the document.
    const ready = new Promise<void>((resolve) => {
      if (first) { nuxtApp.runWithContext(() => onNuxtReady(() => resolve())); return }
      if (samePage || !id) { requestAnimationFrame(() => resolve()); return }
      const start = performance.now()
      const look = () => (document.getElementById(id) || performance.now() - start > 2000 ? resolve() : requestAnimationFrame(look))
      look()
    }).then(() => document.fonts?.ready)

    return ready.then(() => {
      // Back, forward and refresh keep the reader's place.
      if (savedPosition) return { ...savedPosition, behavior: 'instant' as ScrollBehavior }
      const behavior: ScrollBehavior = first || prefersReducedMotion() ? 'instant' : 'smooth'
      if (id && document.getElementById(id)) return { el: '#' + id, top: headerOffset(), behavior }
      if (to.meta.home && from.meta.home) return { top: 0, behavior }
      return { top: 0, behavior: 'instant' as ScrollBehavior }
    })
  },
}
