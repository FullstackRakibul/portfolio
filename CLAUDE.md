# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio website built with Nuxt 3, showcasing a full-stack developer's projects, experience, and technical expertise. The site features a modern dark-themed UI with Tailwind CSS, particle animations, and multiple sections including a blog system, resume page, and project gallery.

**Tech Stack:**
- **Framework:** Nuxt 3 (latest) with Vue 3 & TypeScript
- **Styling:** Tailwind CSS v4 with custom animations & Tailwind Animate
- **Icons:** Lucide Vue Next
- **Build Tool:** Vite (via Nuxt)
- **Package Manager:** npm

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Generate static site (if needed)
npm run generate

# Prepare Nuxt (runs automatically on postinstall)
npm run postinstall
```

## Project Structure

```
src/
├── components/          # Vue components (auto-imported by Nuxt)
│   ├── Navigation.vue   # Fixed navbar with mobile menu
│   ├── ParticleAnimation.vue
│   ├── EnhancedNameParticles.vue
│   ├── ProjectCard.vue  # Reusable project card
│   ├── ExperienceCard.vue
│   ├── TechCard.vue
│   ├── BlogCard.vue
│   └── ContactCard.vue
├── pages/              # Route pages (file-based routing)
│   ├── index.vue       # Homepage with all major sections
│   ├── resume.vue      # Resume/CV page
│   ├── sheju.vue
│   ├── bookshelf/
│   │   └── index.vue
│   └── onTheWayToBeCreative/
│       ├── index.vue   # Blog listing page
│       └── [slug].vue  # Dynamic blog post page
├── composables/        # Reusable composition functions (auto-imported)
│   └── useBlog.ts      # Blog data queries and utilities
├── data/               # Static data files
│   ├── blog-posts.json # Blog post content & metadata
│   └── resume.ts       # Resume data (typed exports)
├── assets/
│   └── css/
│       └── main.css    # Tailwind directives
├── public/             # Static assets
├── app.vue             # Root layout component
├── nuxt.config.ts      # Nuxt configuration
└── tsconfig.json       # TypeScript config

server/               # Optional API routes & server middleware
```

## Key Architectural Patterns

**Component Organization:**
- All Vue components auto-import without explicit imports (Nuxt convention)
- Components are presentational and receive data via props
- Use scoped styles (`<style scoped>`) to avoid global CSS conflicts

**Data Management:**
- Static data stored in TypeScript files (`resume.ts`) and JSON (`blog-posts.json`)
- Blog composable (`useBlog.ts`) provides query functions with filtering, sorting, and search
- Data is loaded once at build/render time; no API calls needed

**Routing:**
- File-based routing: `pages/` directory structure maps to routes
- Dynamic routes use `[param]` naming convention (e.g., `[slug].vue` for blog posts)
- `useRouter()` and `useRoute()` composables for programmatic navigation

**Styling Approach:**
- Tailwind CSS v4 (latest) with utility classes
- Custom animations in component `<style>` blocks
- Responsive design using Tailwind breakpoints (`md:`, `lg:`, etc.)
- Dark theme colors (grays: `gray-900` to `gray-100`, accent: `blue-400`, `purple-500`)

**Blog System:**
- Blog posts stored as JSON with metadata (slug, title, date, tags, category)
- `useBlog()` composable provides:
  - `getAllPosts()`, `getFeaturedPosts()`
  - `getPostBySlug(slug)`, `getPostsByCategory()`, `getPostsByTag()`
  - `searchPosts(query)`, `getRecentPosts(limit)`
  - `formatDate()` utility
- Dynamic page `pages/onTheWayToBeCreative/[slug].vue` uses `useRoute().params.slug` to fetch post data

## Common Development Tasks

**Adding a New Component:**
1. Create `.vue` file in `components/` directory
2. It auto-imports—no explicit import needed
3. Use props for data, emit for events
4. Add TypeScript interfaces if needed (`<script lang="ts">`)

**Adding a Blog Post:**
1. Add entry to `data/blog-posts.json` with required fields (slug, title, excerpt, content, date, tags, category)
2. Use `useBlog().getPostBySlug(slug)` to fetch in dynamic route
3. Format date with `useBlog().formatDate(dateString)`

**Adding a New Page:**
1. Create `.vue` file in `pages/` directory
2. File path determines route (e.g., `pages/about.vue` → `/about`)
3. Use `<NuxtLink>` component for navigation
4. Access route params/query with `useRoute()`

**Styling Updates:**
- Tailwind classes apply on save; rebuild is automatic in dev mode
- For custom animations, add keyframes in component `<style>` blocks
- Refer to `nuxt.config.ts` for Tailwind plugin setup (`@tailwindcss/vite`)

**Resume/Project Data:**
- Update `data/resume.ts` to modify resume content (experience, skills, education)
- Update project list in `pages/index.vue` (hardcoded array) for featured projects
- Contact info is in multiple places: `resume.ts`, components (ContactCard values), Navigation external links

## Configuration Notes

- **Compatibility Date:** 2025-05-15 (Nuxt version lockstep)
- **Devtools:** Disabled (`devtools: { enabled: false }`)
- **CSS:** Main Tailwind directives in `assets/css/main.css`
- **Fonts:** Google Fonts (Inter) loaded via head link in `nuxt.config.ts`
- **Vite Plugins:** Tailwind Vite plugin configured for CSS processing

## Deployment

- `npm run build` generates `.output/` directory for production
- Output is ready for Node.js hosting or static pre-rendering (via `generate`)
- Environment: Node-based server (not fully static unless using `generate`)

## Tips & Conventions

- Use `<NuxtLink>` (not `<a>`) for internal navigation to preserve SPA behavior
- Keep component files under 300 lines; extract complex logic into composables
- Use `<script setup>` syntax (modern Composition API)
- Props should be typed; avoid `any` types
- Blog content in JSON keeps data separate from presentation
- Particle animations are heavy; consider lazy-loading on slower devices if performance becomes an issue
