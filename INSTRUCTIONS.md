# 📋 Project Instructions — Rakibul H. Rabbi Portfolio

## Overview

This is a **personal portfolio & blog website** for **Rakibul Hasan Rabbi**, a Full-Stack Software Developer. The site showcases professional experience, tech stack, projects, blog articles, a bookshelf reader, and a hidden romantic easter-egg page (`/sheju`).

**Live Domain:** [rabbitic.com](https://rabbitic.com)
**Repository:** [FullstackRakibul/portfolio](https://github.com/FullstackRakibul/portfolio)

---

## Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Framework    | **Nuxt 3** (Vue 3, Composition API, file-based routing) |
| Language     | TypeScript / JavaScript                                |
| Styling      | **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)   |
| Icons        | **lucide-vue-next**                                    |
| Utilities    | **@vueuse/core**, **@vueuse/components**               |
| Font         | Google Fonts — **Inter** (300–700)                     |
| Data         | Static JSON (`data/blog-posts.json`)                   |
| Dev Server   | `nuxt dev --host`                                      |

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** (bundled with Node)

### Installation
```bash
cd d:\Alpha\vue\portfolio
npm install
```

### Development
```bash
npm run dev
```
This starts the Nuxt dev server with `--host` flag (accessible on LAN).

### Production Build
```bash
npm run build
npm run preview     # preview the production build locally
```

### Static Generation
```bash
npm run generate    # generates a fully static site in .output/public
```

---

## Project Structure

```
portfolio/
├── app.vue                     # Root app shell (Navigation + NuxtPage)
├── nuxt.config.ts              # Nuxt configuration
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
│
├── assets/
│   └── css/
│       └── main.css            # Global styles (Tailwind import + base + utilities)
│
├── components/
│   ├── Navigation.vue          # Fixed top navbar (desktop + mobile hamburger)
│   ├── EnhancedNameParticles.vue  # Hero section — interactive particle text animation
│   ├── ParticleAnimation.vue   # Generic particle canvas background (unused in current routes)
│   ├── BlogCard.vue            # Blog post card component
│   ├── ProjectCard.vue         # Project link card with external link
│   ├── TechCard.vue            # Tech stack category card with icon mapping
│   ├── ExperienceCard.vue      # Work experience card
│   └── ContactCard.vue         # Contact info card with icon mapping
│
├── composables/
│   └── useBlog.ts              # Blog data composable (getAllPosts, search, filter, format)
│
├── data/
│   └── blog-posts.json         # Static blog data (posts, categories, tags)
│
├── pages/
│   ├── index.vue               # Homepage (Hero, About, Tech, Experience, Projects, Contact)
│   ├── sheju.vue               # Hidden page — romantic SVG particle animation (easter egg)
│   ├── blog/
│   │   ├── index.vue           # Blog listing page with search & category filter
│   │   └── [slug].vue          # Dynamic blog post detail page
│   └── bookshelf/
│       └── index.vue           # Interactive bookshelf with iframe reader
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
│       └── img/                # Public images directory
│
└── server/
    └── tsconfig.json           # Server-side TypeScript config
```

---

## Routes

| Path             | Page                  | Description                          |
| ---------------- | --------------------- | ------------------------------------ |
| `/`              | `pages/index.vue`     | Main portfolio homepage              |
| `/blog`          | `pages/blog/index.vue`| Blog listing with search & filters   |
| `/blog/:slug`    | `pages/blog/[slug].vue`| Individual blog post                |
| `/bookshelf`     | `pages/bookshelf/index.vue` | Interactive book reader         |
| `/sheju`         | `pages/sheju.vue`     | Hidden romantic easter egg page      |

---

## Key Conventions

### Component Architecture
- All components use **Vue 3 `<script setup>`** syntax
- Props are defined with `defineProps()` (no runtime validation, simple type declarations)
- Icons are imported directly from `lucide-vue-next` per component
- Icon mapping components (`TechCard`, `ContactCard`) use `computed()` + object map pattern

### Styling
- **Tailwind CSS v4** is configured via `@tailwindcss/vite` plugin (not the Nuxt module)
- Global CSS lives in `assets/css/main.css` using `@layer base` and `@layer utilities`
- Component-scoped styles use `<style scoped>` for animations and custom CSS
- Design system: dark mode only (`bg-gray-900` base), blue-purple gradient accents
- Typography: Inter font family with system font fallbacks

### Data Flow
- Blog data is stored in `data/blog-posts.json` and consumed via `composables/useBlog.ts`
- No API calls — all data is static/build-time
- Projects list is hardcoded in `pages/index.vue` script setup

### Animations
- CSS keyframe animations for fade-in-up, gradient, and float effects
- Canvas-based particle animations in `EnhancedNameParticles.vue` and `sheju.vue`
- Animation delays via custom CSS classes (`.animation-delay-200`, etc.)
- Mouse follower effect on hero and sheju pages

---

## Development Guidelines

1. **Always use Composition API** (`<script setup>`) — never Options API
2. **Never use `<style>` without `scoped`** unless it's the root `app.vue`
3. **Import icons per-component** from `lucide-vue-next` — don't create a global icon registry
4. **Keep data static** — blog posts go in `data/blog-posts.json`, not a CMS or API
5. **Use Tailwind utility classes** as the primary styling approach; scoped CSS only for animations or complex selectors
6. **Maintain dark theme consistency** — all new sections should follow the `gray-800/50` card + `gray-700` border pattern
7. **SEO**: Every page must call `useHead()` with title and meta description
8. **Responsive design**: mobile-first, breakpoints at `sm:`, `md:`, `lg:`
9. **Performance**: Particle animations should clean up on `onUnmounted()` — always cancel `requestAnimationFrame` and remove event listeners

---

## Common Tasks

### Add a New Blog Post
1. Edit `data/blog-posts.json`
2. Add a new post object to the `posts` array
3. Add any new categories to `categories` array and tags to `tags` array
4. Content is raw HTML string in the `content` field

### Add a New Component
1. Create `.vue` file in `components/`
2. Nuxt auto-imports — no registration needed
3. Use `<script setup>` + `defineProps()`
4. Import icons directly from `lucide-vue-next`

### Add a New Page
1. Create `.vue` file in `pages/` (file-based routing)
2. Add `useHead()` for SEO metadata
3. Add navigation link in `Navigation.vue` if needed

### Add a New Project
1. Edit the `projects` array in `pages/index.vue` script setup
2. Add `{ title, url, description }` object

---

## Known Issues / TODOs

- `ParticleAnimation.vue` exists but is not used in any current page (legacy component)
- `sheju.vue` has inline SVG data (~5KB) — consider extracting to a separate asset
- Blog post content uses raw HTML — consider switching to Markdown + a parser
- Bookshelf page has most books commented out (only 1 active book entry)
- Blog detail page has prose styling fully commented out in `<style scoped>`
- `{' '}` JSX-style spacing artifacts in `EnhancedNameParticles.vue` template
