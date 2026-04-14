# Portfolio Redesign Design Spec
**Date:** 2026-04-14  
**Status:** Approved

## Overview

Full rebuild of vinnyh125.github.io — replacing the current vanilla HTML/CSS/jQuery site with an Astro-based static site. Dark minimal/editorial aesthetic. Deployed to GitHub Pages.

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro | Best-in-class for static portfolio sites; zero JS by default |
| Styling | Tailwind CSS | Fast iteration; familiar from prior projects |
| Interactivity | Vanilla JS | No framework overhead needed for scramble + scroll reveal |
| Deployment | GitHub Pages | Already in use; `astro build` outputs to `dist/` |

## File Structure

```
src/
  pages/
    index.astro          # Single page
  components/
    Navbar.astro
    Hero.astro
    Experience.astro
    Projects.astro
    Skills.astro
    About.astro
    Leadership.astro
    Footer.astro
  data/
    experience.ts        # Experience entries
    projects.ts          # Project entries
    skills.ts            # Skills grouped by category
    leadership.ts        # Leadership entries
  scripts/
    scramble.js          # Name scramble animation
    scrollReveal.js      # IntersectionObserver scroll reveal
  styles/
    global.css           # Tailwind base + any custom CSS vars
public/
  img/                   # Headshot, project screenshots, favicons
astro.config.mjs
tailwind.config.mjs
package.json
```

## Sections & Order

Single-page layout with anchor-linked sections in this order:

1. Hero
2. Experience
3. Projects
4. Skills
5. About
6. Leadership
7. Contact (footer)

Sticky top navbar with links to each section. Active section is highlighted as the user scrolls (tracked via IntersectionObserver).

## Section Specs

### Hero

- Layout: centered, full-viewport-height
- Large name heading: `VINCENT HUANG`
- Subtitle: `Software Engineer · Cornell CS '26 · Amazon '26`
- Social links: GitHub, LinkedIn, Resume (icon links, open in new tab)
- Animation: letter scramble on hover/click (see Animations section)

### Experience

- Layout: vertical timeline, left-aligned
- Component: `ExperienceEntry` — company, role, date range, location, bullet points
- Entries (newest first):
  1. Amazon — Software Development Intern (May–Aug 2025, Austin TX)
  2. Cornell University — CS 4414 Teaching Assistant (May 2025–Present)
  3. Hyphenova — Software Engineering Intern (May–Aug 2024, LA)
  4. The Cai Lab — Visiting Scholar (Jun–Sep 2024, Piscataway NJ)
  5. Fu-Wah Garden Inc. — Front-End Developer Intern (May–Aug 2023, Ewing NJ)

### Projects

- Layout: 2-column card grid on desktop, 1-column on mobile
- Component: `ProjectCard` — name, tech stack tags, 2–3 bullet points, GitHub link, live link (if available)
- Projects:
  1. CURoomie (Next.js, React, TailwindCSS, Firebase, Google Cloud, Vercel)
  2. Strophe (Dart, Flutter, SQL, SQLite)
  3. Fu-Wah Garden website (HTML, CSS, JS)
- Cards reveal on scroll

### Skills

- Layout: grouped inline tag lists, no icon grid
- Groups:
  - **Languages:** Python, JavaScript, Java, SQL, C, C++, OCaml, HTML & CSS
  - **Libraries & Frameworks:** React, TypeScript, Next.js, Flutter, React Native, Flask, OpenCV, PyTorch
  - **Databases & Tools:** AWS CDK, IAM, PostgreSQL, Docker, Firebase, Git, DynamoDB, Lambda, S3, API Gateway

### About

- Layout: two-column on desktop (photo left, text right), stacked on mobile
- Content: short bio (Cornell CS + Asian American Studies, Nexus lead, Amazon full-time Aug 2026, personal interests)
- Photo: headshot (`public/img/vh-headshot.jpg`)

### Leadership

- Layout: same timeline component as Experience
- Entries:
  1. Cornell Nexus Project Team — Software Team Lead (Dec 2023–Present)

### Contact / Footer

- No dedicated full section — handled in footer
- Links: LinkedIn, GitHub, email (mailto), Resume (Google Drive PDF)
- "Back to top" arrow link
- Footer background matches navbar

## Animations

### Name Scramble (Hero)

Reuse the current scramble mechanic, rewritten as a clean ES module (`scramble.js`):
- On hover or click, randomize letters and resolve to target string over ~600ms
- Cycles through 4 states: `VINCENT HUANG` → `CS @ CORNELL` → `MUSIC LOVER` → `BADMINTON PLAYER`
- First-time interaction plays intro sequence (auto-cycles through all states)
- No jQuery dependency — use plain DOM APIs

### Scroll Reveal

`scrollReveal.js` — single `IntersectionObserver` at 20% threshold:
- All section headings and content blocks start with `opacity: 0; transform: translateY(16px)`
- On intersection: transition to `opacity: 1; transform: translateY(0)` over 0.5s
- Respects `prefers-reduced-motion`

### Navbar

- Active section link gets a visual indicator (e.g., lighter color or underline) as the user scrolls
- Hover: subtle underline or color transition

## Design Tokens

```css
/* Dark minimal palette */
--bg:          #0a0a0a;   /* page background */
--surface:     #111111;   /* card/section backgrounds */
--border:      #1f1f1f;   /* dividers, card borders */
--text:        #f0f0f0;   /* primary text */
--text-muted:  #666666;   /* subtitles, metadata */
--accent:      #f0f0f0;   /* links/active states (white on dark) */
```

Font: Space Mono (keep from current site — monospace suits the aesthetic and the scramble).

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Single column everywhere; nav collapses or simplifies |
| `768px–1024px` | Two-column projects grid; side-by-side about |
| `> 1024px` | Full layout |

## Deployment

```bash
npm run build        # outputs to dist/
```

Configure Astro for GitHub Pages static output. Set `site: 'https://vinnyh125.github.io'` in `astro.config.mjs`. Use a GitHub Actions workflow (`.github/workflows/deploy.yml`) that runs `astro build` on every push to `main` and deploys `dist/` to the `gh-pages` branch. GitHub Pages is configured to serve from `gh-pages`.

## Out of Scope

- Blog / writing section
- Dark/light mode toggle
- Contact form (email link only)
- CMS integration
