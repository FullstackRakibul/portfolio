// The site used hash routing until 2026-11 (/#/resume, /#/projects). Those links are still out there; a server
// never sees what follows the #, so they are moved here, in the browser: /#/resume → /resume.
// It waits until the app is ready: a replace during hydration is dropped by Nuxt's own first navigation.
export default defineNuxtPlugin((nuxtApp) => {
  const { hash } = window.location
  if (!hash.startsWith('#/')) return
  const target = hash.slice(1)
  nuxtApp.runWithContext(() => onNuxtReady(() => useRouter().replace(target)))
})
