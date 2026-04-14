# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site for Vincent Huang, built with **Astro 4 + Tailwind CSS 3**, deployed to GitHub Pages via GitHub Actions.

## Commands

```bash
npm run dev      # dev server at http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

No test suite — verify visually using dev server and production build.

## Architecture

Single-page site rendered by Astro (`src/pages/index.astro`). All sections are Astro components in `src/components/`. Content (experience, projects, skills, leadership) lives in `src/data/*.ts` as typed TypeScript arrays.

### File Structure

```
src/
  pages/index.astro          — HTML shell, imports all components
  components/
    Navbar.astro             — Fixed nav with active-section tracking
    Hero.astro               — Hero section with IsometricPC animation
    IsometricPC.astro        — Isometric SVG PC illustration (7 named <g> groups)
    ExperienceEntry.astro    — Reusable timeline entry (used by Experience + Leadership)
    ExperienceSection.astro  — Experience section
    LeadershipSection.astro  — Leadership section
    ProjectCard.astro        — Project card
    ProjectsSection.astro    — Projects section
    SkillsSection.astro      — Skills section
    AboutSection.astro       — About section
    Footer.astro             — Footer / contact section
  data/
    experience.ts            — Experience entries (Entry type)
    projects.ts              — Project cards (Project type)
    skills.ts                — Skill groups (SkillGroup type)
    leadership.ts            — Leadership entries (imports Entry type from experience.ts)
  styles/global.css          — Tailwind directives, scroll-reveal classes
```

### Design Tokens (tailwind.config.mjs)

| Token | Value | Usage |
|---|---|---|
| `bg` | `#0a0a0a` | Page background |
| `surface` | `#111111` | Card/section backgrounds |
| `border` | `#1f1f1f` | Borders, dividers |
| `text` | `#f0f0f0` | Primary text |
| `muted` | `#666666` | Secondary text, labels |

Font: Space Mono (Google Fonts, loaded in index.astro).

### Scroll Reveal

`[data-reveal]` elements start at `opacity:0; transform:translateY(16px)`. An `IntersectionObserver` in `index.astro` adds `.revealed` when they enter the viewport (threshold 0.15), transitioning to `opacity:1; transform:none` over 500ms.

### Hero Animation

`Hero.astro` uses **anime.js v4** (installed via npm) for an assembly animation on page load:
- `IsometricPC.astro` holds an isometric SVG with 7 named `<g>` groups: `#pc-case`, `#pc-motherboard`, `#pc-cpu`, `#pc-ram-a`, `#pc-ram-b`, `#pc-gpu`, `#pc-ssd` — all start `style="opacity:0"`
- `anime.timeline()` animates them in sequence (case → motherboard → cpu → ram → gpu → ssd → hero text)
- Mouse parallax starts after text reveals (`requestAnimationFrame` loop, LERP=0.08, MAX_X=20px, MAX_Y=10px)

### Deployment

`.github/workflows/deploy.yml` — triggers on push to `main`, runs `astro build`, uploads `dist/` to GitHub Pages via `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`. Requires GitHub Pages source set to "GitHub Actions" in repo Settings.

### Responsive Breakpoints

Tailwind `sm:` prefix = 640px. Most layouts are `grid-cols-1` mobile → `sm:grid-cols-X` desktop. Navbar uses `gap-3 px-3` mobile → `sm:gap-8 sm:px-6` desktop.
