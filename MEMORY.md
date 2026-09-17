# 🧠 Project Memory — Rakibul H. Rabbi Portfolio

> This file tracks decisions, patterns, gotchas, and accumulated knowledge about the project.
> Updated as new patterns are established or bugs are resolved.

---

## Architecture Decisions

### ADR-001: Nuxt 3 over plain Vue
- **Decision:** Use Nuxt 3 as the framework
- **Rationale:** File-based routing, auto-imports, SSR/SSG capabilities, built-in `useHead()` for SEO, and the `composables/` pattern
- **Trade-off:** Heavier than a plain Vite + Vue setup, but the developer experience and SEO benefits outweigh the cost for a portfolio site

### ADR-002: Tailwind CSS v4 via Vite plugin (not Nuxt module)
- **Decision:** Use `@tailwindcss/vite` plugin directly instead of `@nuxtjs/tailwindcss` module
- **Rationale:** Tailwind v4 has native Vite support. The Nuxt module (`@nuxtjs/tailwindcss` v6.x) is also installed but the actual CSS processing goes through the Vite plugin
- **Configuration:** `nuxt.config.ts` → `vite.plugins` array, CSS entry point at `assets/css/main.css`
- **Important:** Both `@nuxtjs/tailwindcss` and `@tailwindcss/vite` are in dependencies — this is intentional but potentially redundant. The Vite plugin takes precedence

### ADR-003: Static JSON for blog data (no CMS)
- **Decision:** Store all blog posts as a single JSON file in `data/blog-posts.json`
- **Rationale:** Keeps the site fully static, no server dependency, easy to version control
- **Trade-off:** Blog content is raw HTML strings — no Markdown support, editing is cumbersome for long posts
- **Future consideration:** Could migrate to `@nuxt/content` for Markdown-based blog authoring

### ADR-004: Canvas-based particle animations (not WebGL/Three.js)
- **Decision:** Use raw `<canvas>` 2D API for all particle effects
- **Rationale:** Lightweight, no extra dependencies, sufficient for the text-reveal and ambient particle effects
- **Performance note:** `EnhancedNameParticles.vue` spawns up to 6000 particles on desktop. Background particles limited to 1500. The `sheju.vue` page uses SVG path parsing to position particles — higher computational cost on initial load

### ADR-005: lucide-vue-next for icons
- **Decision:** Import icons per-component from `lucide-vue-next`
- **Rationale:** Tree-shakeable, consistent icon set, Vue-native components
- **Pattern:** Always import at the component level in `<script setup>`, never globally register

---

## Established Patterns

### Card Component Pattern
All "card" components follow this structure:
```vue
<template>
  <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
    <!-- content -->
  </div>
</template>

<script setup>
defineProps({ /* simple type declarations */ })
</script>
```
- Background: `bg-gray-800/50` (semi-transparent)
- Border: `border-gray-700` default, `hover:border-blue-500/50` on hover
- Radius: `rounded-xl`
- Padding: `p-6`
- Transition: `transition-all duration-300`
- Optional scale on hover: `hover:transform hover:scale-105`

### Section Heading Pattern
```html
<h2 class="text-3xl sm:text-4xl font-bold mb-12 text-center">
  <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
    Section Title
  </span>
</h2>
```

### Icon Mapping Pattern (for dynamic icons)
```javascript
import { Icon1, Icon2 } from 'lucide-vue-next'
const iconMap = { Icon1, Icon2 }
const iconComponent = computed(() => iconMap[props.icon] || DefaultIcon)
```
Used in: `TechCard.vue`, `ContactCard.vue`

### SEO Pattern
Every page must include:
```javascript
useHead({
  title: 'Page Title - Rakibul H. Rabbi',
  meta: [
    { name: 'description', content: 'Description...' }
  ]
})
```

### Animation Delay Pattern
CSS classes for staggered animations:
```css
.animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
.animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
.animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
/* etc. */
```
Initial `opacity: 0` ensures elements are hidden until animation plays.

---

## Gotchas & Warnings

### ⚠️ Tailwind Dual Installation
Both `@nuxtjs/tailwindcss` (Nuxt module) and `@tailwindcss/vite` + `tailwindcss` (direct) are installed. The Vite plugin processes CSS. Don't add `@nuxtjs/tailwindcss` to `modules` in `nuxt.config.ts` — it may conflict.

### ⚠️ Canvas Cleanup is Critical
Both `EnhancedNameParticles.vue` and `sheju.vue` use `requestAnimationFrame`. **Always** cancel animation frames and remove event listeners in `onUnmounted()`. Failure to do so causes memory leaks on route navigation.

### ⚠️ Blog Content is Raw HTML
`blog-posts.json` stores content as HTML strings. Be careful with:
- XSS: Content is rendered via `v-html` in `[slug].vue`
- Formatting: No Markdown parser — all formatting must be done as HTML tags

### ⚠️ Commented-Out Prose Styles
In `pages/blog/[slug].vue`, the entire `<style scoped>` section with prose styling classes is **commented out**. Blog post content may render without proper heading, list, and blockquote styling.

### ⚠️ Sheju Page SVG Data
`pages/sheju.vue` contains ~5KB of inline SVG path data for the "Senjuti" name particle effect. This is parsed client-side using `DOMParser` and rendered to a hidden canvas for point sampling.

### ⚠️ JSX Spacing Artifacts
`EnhancedNameParticles.vue` contains `{' '}` expressions in the template (lines 37, 40, 42) — these are JSX-style spacing that Vue templates don't process. They render as literal text.

### ⚠️ Mobile Touch Handling
- `EnhancedNameParticles.vue` uses `isTouchingRef` for touch detection but doesn't register touch event listeners (only checks `'ontouchstart' in window`)
- `sheju.vue` properly registers `touchmove` events with `{ passive: false }`
- The bookshelf page has custom swipe-to-close logic for the reader overlay

### ⚠️ Import Side Effect
`nuxt.config.ts` imports `devtools` from `vue` on line 3 but never uses it — this is dead code.

---

## Color Palette Reference

| Token             | Hex/Class          | Usage                          |
| ----------------- | ------------------ | ------------------------------ |
| Background        | `bg-gray-900`      | Page background                |
| Card Background   | `bg-gray-800/50`   | Card surfaces                  |
| Card Border       | `border-gray-700`  | Default card borders           |
| Card Hover Border | `border-blue-500/50` | Hover state borders          |
| Primary Gradient  | `from-blue-400 to-purple-500` | Headings, branding  |
| Body Text         | `text-gray-300`    | Paragraph text                 |
| Muted Text        | `text-gray-400`    | Secondary/meta text            |
| Accent Blue       | `text-blue-400`    | Links, highlights              |
| Base Body Color   | `#0d1117`          | Global body bg (main.css)      |
| Base Text Color   | `#f0f6fc`          | Global body text (main.css)    |

### Sheju Page Palette (Romantic theme)
| Token           | Usage                             |
| --------------- | --------------------------------- |
| `from-rose-900` | Background gradient start         |
| `via-pink-900`  | Background gradient mid           |
| `to-purple-900` | Background gradient end           |
| `#fda4af`       | Particle default color            |
| `#fca5a5`–`#c084fc` | Background particle colors   |

---

## Performance Notes

- **Particle Count Scaling:** `EnhancedNameParticles.vue` scales particle count based on viewport: `Math.floor(6000 * Math.sqrt(viewport / (1920*1080)))`
- **Background Particles:** Capped at 1500 (`bgParticles` array starts loop at `i = 500` intentionally — this means only ~1500 particles are created, not 2000)
- **No Image Optimization:** Images in the bookshelf and elsewhere are loaded from external URLs with no `srcset` or lazy loading optimization beyond native `loading="lazy"`
- **No Code Splitting:** All blog post content ships in a single JSON file — no dynamic imports or chunking

---

## Dependencies Quick Reference

| Package                 | Version  | Purpose                        |
| ----------------------- | -------- | ------------------------------ |
| `nuxt`                  | ^3.17.7  | Framework                      |
| `vue`                   | ^3.5.17  | Core                           |
| `vue-router`            | ^4.5.1   | Routing (via Nuxt)             |
| `tailwindcss`           | ^4.1.11  | Utility-first CSS              |
| `@tailwindcss/vite`     | ^4.1.11  | Tailwind Vite plugin           |
| `@nuxtjs/tailwindcss`   | ^6.14.0  | Nuxt Tailwind module (unused?) |
| `lucide-vue-next`       | ^0.460.0 | Icons                          |
| `@vueuse/core`          | ^13.5.0  | Composition utilities          |
| `@vueuse/components`    | ^13.5.0  | VueUse component wrappers      |
| `@tailwindcss/postcss`  | ^4.1.11  | PostCSS integration (dev)      |
| `tailwindcss-animate`   | ^1.0.7   | Animation utilities (dev)      |
| `typescript`            | ^5.3.3   | TypeScript compiler (dev)      |
| `@types/node`           | ^18.19.9 | Node type definitions (dev)    |
