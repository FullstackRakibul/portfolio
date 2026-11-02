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
        { name: "theme-color", content: "#151412", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#ebeae5", media: "(prefers-color-scheme: light)" },
      ],
      script: [{ innerHTML: themeBoot, tagPosition: "head" }],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&family=Figtree:wght@400;600&display=swap",
        },
      ],
    },
  },
})
