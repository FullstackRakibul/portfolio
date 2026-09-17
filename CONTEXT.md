# 🌐 Project Context — Rakibul H. Rabbi Portfolio

> Who is this for? What is the product? Why does it exist?
> This file provides the human context behind the codebase.

---

## The Person

**Rakibul Hasan Rabbi** is a Full-Stack Software Developer based in **Dhaka, Bangladesh**. He currently works as a **Software Support Engineer at Hameem Group**, one of the largest garment manufacturing conglomerates in Bangladesh.

### Professional Identity
- **Core Expertise:** .NET / ASP.NET Core / C#, SQL Server, enterprise ERP systems
- **Frontend Skills:** React, Vue.js, Angular, Next.js
- **Secondary Skills:** Python (Django), PHP (Laravel, WordPress), CMS platforms
- **Cloud Learning:** Actively deepening expertise in Azure and AWS
- **Contact:** rakibul.cse.47@gmail.com | +880 1581 500678
- **GitHub:** [FullstackRakibul](https://github.com/FullstackRakibul)
- **Portfolio Domain:** [rabbitic.com](https://rabbitic.com)

### Career Timeline
| Period              | Company               | Role                   |
| ------------------- | --------------------- | ---------------------- |
| Nov 2023 – Present  | Hameem Group          | Software Support Engineer |
| Aug 2023 – Nov 2023 | bdCalling IT Ltd      | Web Developer          |
| Jun 2023 – Aug 2023 | Global IT Solutions   | Project Manager        |
| Jul 2022 – Jul 2023 | Creative Tech Park    | Web Developer & PM     |

### Personal Touch
The portfolio includes a hidden page at `/sheju` — a romantic particle animation dedicated to someone named **Senjuti** (সেঁজুতি). The name is rendered using SVG path data converted into interactive particles with a rose/pink color theme, floating hearts, and stats cards reading "∞ Love for You" and "24/7 Thinking of You".

---

## The Product

### What Is This?
A **personal developer portfolio website** that serves as:
1. **Professional showcase** — tech stack, work experience, completed projects
2. **Blog platform** — technical articles titled "Explain it to me like I'm an idiot"
3. **Bookshelf** — an interactive reading experience with an embedded iframe reader
4. **Creative expression** — particle animations and interactive visual effects

### Design Philosophy
- **Dark-first aesthetic** — the entire site uses a dark gray (`#0d1117`) base inspired by GitHub's dark theme
- **Gradient accents** — blue-to-purple gradients (`from-blue-400 to-purple-500`) are the signature visual motif used across all headings and branding elements
- **Interactive hero** — the homepage hero features the developer's name rendered as 6000+ white particles that repel from the mouse cursor and scatter with colored glow effects
- **Minimalist cards** — all content is presented in semi-transparent glassmorphic cards with subtle hover effects
- **Developer personality** — the site quotes "The quiet architect of systems and spirit, a soul who sees code and cosmos as kin" and "Where systems meet soul, and logic meets artistry"

### Visual Identity
- **Font:** Inter (Google Fonts) — clean, modern sans-serif
- **Primary Colors:** Blue-400 (#60A5FA) → Purple-500 (#A855F7) gradient
- **Background:** Gray-900 (#111827) with Gray-800/50 card surfaces
- **Accent:** Cyan-400, Green-400 for tech stack highlighting
- **Stats:** GitHub-style stats cards at bottom of hero (5+ Years, 50+ Projects, 10+ Technologies, 24/7 Code Passion)

---

## The Blog — "Explain it to me like I'm an idiot"

The blog section uses a playful title suggesting approachable technical writing. Current topics include:
- **System Design** — CAP Theorem in distributed systems
- **Backend Development** — Scalable .NET Core enterprise apps
- **Frontend Development** — Vue.js/Nuxt modern development, React state management
- **Database** — SQL Server optimization strategies
- **Cloud Computing** — Azure vs AWS migration guide

Blog posts are stored as static JSON with HTML content, categorized and tagged for filtering.

---

## The Bookshelf

An interactive bookshelf page that renders books with 3D perspective effects, wooden shelf planks, and page-edge textures. Clicking a book opens an iframe-based reader. Currently has most books commented out — only "To Kill a Mockingbird" is active.

The implementation features:
- Horizontal scroll with snap points
- Pagination dots and navigation arrows
- Swipe-to-close on mobile (touch gesture handling)
- Book covers from external image URLs
- Embedded reader using anyflip.com iframes

---

## Featured Projects

The portfolio showcases 9 completed projects across diverse domains:

| Project                 | Domain            | URL                        |
| ----------------------- | ----------------- | -------------------------- |
| Global IT Solutions     | Corporate         | globalitsolutions.com.bd   |
| Taash Clothing          | E-commerce/Fashion| taashclothing.com          |
| Paakhi Home             | Home Decor        | paakhihome.com             |
| Ocean Gauge             | Marine Equipment  | oceangauge.com             |
| My Prime Box            | Subscription Box  | myprimebox.com             |
| RDT SQA                 | QA Services       | rdtsqa.com                 |
| Discover Thailand Co    | Travel/Tourism    | discoverthailandco.com     |
| Top Notch Assignments   | Academic          | topnotchassignments.net    |
| Nagar Kantha            | News/Media        | nagarkantha.com            |

---

## Target Audience

1. **Potential employers/clients** — seeking to evaluate Rabbi's technical skills and project portfolio
2. **Fellow developers** — reading the technical blog articles
3. **Personal connections** — the `/sheju` easter egg page

---

## Content Tone

- Professional but warm
- Slightly philosophical ("where systems meet soul")
- Technical articles aim to be accessible ("explain it to me like I'm an idiot")
- Personal quotes and emotional depth ("the quiet architect of systems and spirit")

---

## Deployment Context

- **Domain:** rabbitic.com
- **Build target:** Nuxt 3 supports SSR, SSG, and hybrid modes
- **Static generation:** `npm run generate` produces a fully static site
- **No backend/API:** All data is baked into the build — no runtime server needed for content
- **Assets:** External image URLs for bookshelf covers, Google Fonts CDN for Inter

---

## Future Direction (Inferred from codebase)

- **Cloud certifications:** Currently learning Azure & AWS (mentioned in About section)
- **Bookshelf expansion:** Multiple books are defined but commented out — likely being curated
- **Blog growth:** Infrastructure supports categories, tags, featured posts, search — ready for more content
- **Content management:** May benefit from migrating to `@nuxt/content` or a headless CMS for easier blog authoring
- **Design page:** `pages/sheju.vue` and `pages/svg-code.txt` suggest ongoing experimentation with SVG-based creative coding
