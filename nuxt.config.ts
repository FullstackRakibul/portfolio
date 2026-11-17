// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { SECTIONS } from "./data/portfolio";
import { books, categories, booksIn } from "./data/books";
import blog from "./data/blog-posts.json";

// The one canonical address. Every canonical link, og:url, sitemap entry, robots line and JSON-LD @id comes
// from here (runtimeConfig.public.siteUrl and site.url are both set from it). To move to another domain,
// change it here (or set NUXT_PUBLIC_SITE_URL) and redirect the old host in vercel.json.
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || "https://butterbun.vercel.app").replace(/\/$/, "");
// Build date: the home page's dateModified, its "Last updated" line and the sitemap's lastmod.
const buildDate = new Date().toISOString();

// Runs before first paint: picks the saved theme (or the OS preference) and marks scripting as available.
const themeBoot = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('lab-theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t})();`

// Homepage sections also answer at their own path (/projects opens the home page there, see app/router.options.ts).
// They are the home page, so they point their canonical at / and stay out of the sitemap.
const sectionPaths = [...new Set([...SECTIONS.map((s) => s.id), "mostisko"])];

// Pages whose links are drawn in the browser (the bookshelf) are listed here so each still gets its own HTML.
const contentPaths = [
  ...books.map((b) => `/bookshelf/${b.slug}`),
  ...categories.filter((c) => booksIn(c.id).length).map((c) => `/bookshelf/category/${c.id}`),
  ...blog.posts.map((p: { slug: string }) => `/onTheWayToBeCreative/${p.slug}`),
];

// Answer engines and AI search: allowed so the site can be cited. Training crawlers: allowed too (Rakibul's choice).
const SEARCH_BOTS = ["Googlebot", "Bingbot", "Applebot", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"];
const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ["@nuxtjs/robots", "@nuxtjs/sitemap", "nuxt-schema-org", "nuxt-og-image"],

  // Real paths (/resume, /bookshelf). Old /#/resume links are moved by plugins/legacy-hash.client.ts.
  // No build manifest to fetch at runtime, so a missing /_nuxt/builds/meta/<id>.json can never break navigation.
  experimental: { appManifest: false, payloadExtraction: false },

  runtimeConfig: { public: { siteUrl, buildDate } },
  site: { url: siteUrl, name: "Rakibul H. Rabbi", defaultLocale: "en", indexable: true },

  robots: {
    credits: false,
    groups: [
      { userAgent: ["*"], allow: ["/"] },
      { userAgent: SEARCH_BOTS, allow: ["/"] },
      { userAgent: TRAINING_BOTS, allow: ["/"] },
    ],
  },
  sitemap: {
    exclude: [...sectionPaths.map((id) => `/${id}`), "/404.html", "/200.html", /^\/llms/],
    defaults: { lastmod: buildDate },
  },
  // The graph is built by hand (composables/useSiteSchema.ts) so its @ids are /#person, /#website, /#profilepage.
  schemaOrg: { defaults: false },
  // Share images are rendered once at build, one per page (components/OgImage/Page.satori.vue).
  ogImage: { zeroRuntime: true, defaults: { width: 1200, height: 630 } },

  // Deployed as static files from `nuxt generate` (.output/public); every route is prerendered, so a refresh
  // on any path finds its own HTML. For GitHub Pages under a subpath, build with NITRO_PRESET=github_pages and
  // NUXT_APP_BASE_URL=/<repo>/ (Nuxt reads both from the environment).
  nitro: {
    preset: process.env.NITRO_PRESET || 'static',
    prerender: {
      crawlLinks: true,
      routes: ["/", "/resume", "/bookshelf", "/onTheWayToBeCreative", ...sectionPaths.map((id) => `/${id}`), ...contentPaths, "/llms.txt", "/llms-full.txt", "/sitemap.xml", "/robots.txt"],
    },
    hooks: {
      // The fallback shells (the 404 page, the SPA 200 page) must never be indexed, even before their script runs.
      "prerender:generate"(route) {
        if ((route.route === "/404.html" || route.route === "/200.html") && route.contents) {
          route.contents = route.contents
            .replace(/<meta name="robots"[^>]*>/, "")
            .replace("<head>", '<head><meta name="robots" content="noindex">');
        }
      },
    },
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
        { name: "theme-color", content: "#0B0D06", media: "(prefers-color-scheme: dark)" }, // --background (meta tags cannot read CSS variables)
        { name: "theme-color", content: "#FFFFFF", media: "(prefers-color-scheme: light)" },
      ],
      script: [{ innerHTML: themeBoot, tagPosition: "head" }],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          // Inter for UI and text, JetBrains Mono for labels and badges (as in PIPILIKA), Hind Siliguri for Bengali.
          // display=swap: the <h1> paints at once in the fallback face, so the font never holds back LCP.
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Hind+Siliguri:wght@400;600&display=swap",
        },
      ],
    },
  },
})
