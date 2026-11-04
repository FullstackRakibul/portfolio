// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Runs before first paint: picks the saved theme (or the OS preference) and marks scripting as available.
const themeBoot = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('lab-theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t})();`

// Hash routing keeps every address after the #. A path-style link (an old /resume bookmark) is moved there
// before the router starts, so it opens /#/resume; anything unknown then falls back to the home page.
const base = process.env.NUXT_APP_BASE_URL || '/'
const routeBoot = `(function(){var b=${JSON.stringify(base)},p=location.pathname;if(p===b||p===b+'index.html'||p===b+'200.html'||p===b+'404.html')return;var r=p.indexOf(b)===0?'/'+p.slice(b.length):p;history.replaceState(null,'',b+location.search+(location.hash||'#'+r))})();`

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  // Hash routing: every address lives after the # (/#/projects, /#/resume), so the host only ever serves
  // index.html and a refresh or a deep link can never miss. Section scrolling: app/router.options.ts.
  router: { options: { hashMode: true } },
  // No build manifest to fetch at runtime, so a missing /_nuxt/builds/meta/<id>.json can never break navigation.
  // Page data stays inline in index.html: with hash routing there are no per-route _payload.json files.
  experimental: { appManifest: false, payloadExtraction: false },
  // Deployed as static files from `nuxt generate` (.output/public). For GitHub Pages under a subpath, build with
  // NITRO_PRESET=github_pages and NUXT_APP_BASE_URL=/<repo>/ (Nuxt reads both from the environment).
  // Nuxt skips prerendering in hash mode, so `/` is listed here: index.html then carries the fully rendered
  // home page, and every other address (/#/resume, /#/projects) is resolved in the browser from it.
  nitro: {
    preset: process.env.NITRO_PRESET || 'static',
    prerender: { routes: ['/'] },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "en" },
      meta: [
        { name: "theme-color", content: "#0d2b30", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#eef4f3", media: "(prefers-color-scheme: light)" },
      ],
      script: [{ innerHTML: routeBoot, tagPosition: "head" }, { innerHTML: themeBoot, tagPosition: "head" }],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          // Inter for UI and text, JetBrains Mono for labels and badges (as in PIPILIKA), Hind Siliguri for Bengali.
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Hind+Siliguri:wght@400;600&display=swap",
        },
      ],
    },
  },
})
