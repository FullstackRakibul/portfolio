// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Runs before first paint: picks the saved theme (or the OS preference) and marks scripting as available.
const themeBoot = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('lab-theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t})();`

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
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
      script: [{ innerHTML: themeBoot, tagPosition: "head" }],
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
