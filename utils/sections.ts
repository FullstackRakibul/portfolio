import { SECTIONS } from '~/data/portfolio'

/**
 * Homepage sections that have their own address. With hash routing, /#/projects opens the home page
 * scrolled to #projects; the router keeps it as the same page (see app/router.options.ts).
 */
export const SECTION_IDS: string[] = [...new Set([...SECTIONS.map(s => s.id), 'mostisko'])]

/** '/projects' → 'projects'; anything that is not a section → ''. */
export const sectionFromPath = (path: string) => {
  const id = path.replace(/^\/+|\/+$/g, '')
  return SECTION_IDS.includes(id) ? id : ''
}

/** The space the fixed header takes, as set by scroll-padding-top on the root. */
export const headerOffset = () => Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scroll to a section (or the top for ''), smoothly unless reduced motion is asked for. */
export const scrollToSection = (id: string) => {
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'instant' : 'smooth'
  if (!id) { window.scrollTo({ top: 0, behavior }); return }
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior })
}
