# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing vanilla HTML/CSS/jQuery portfolio with an Astro + Tailwind static site — dark minimal aesthetic, single page, deployed to GitHub Pages via GitHub Actions.

**Architecture:** Single `index.astro` page imports all section components. Content lives in typed `src/data/` files so updates never touch markup. Scroll reveal and active-nav tracking are vanilla JS `<script>` blocks co-located in their components.

**Tech Stack:** Astro 4, Tailwind CSS 3, Space Mono (Google Fonts), vanilla JS, GitHub Actions

---

## File Map

| File | Responsibility |
|---|---|
| `astro.config.mjs` | Astro config — site URL, Tailwind integration |
| `tailwind.config.mjs` | Custom colors, font family |
| `src/styles/global.css` | Tailwind directives, font import, body reset |
| `src/pages/index.astro` | Single page — imports all components |
| `src/components/Navbar.astro` | Sticky nav with anchor links + active tracking |
| `src/components/Hero.astro` | Centered hero — name, subtitle, social links |
| `src/components/ExperienceSection.astro` | Experience timeline section |
| `src/components/ExperienceEntry.astro` | Single timeline entry — reused in Leadership |
| `src/components/ProjectsSection.astro` | Projects card grid section |
| `src/components/ProjectCard.astro` | Single project card |
| `src/components/SkillsSection.astro` | Grouped skill tags |
| `src/components/AboutSection.astro` | Two-column bio + photo |
| `src/components/LeadershipSection.astro` | Leadership timeline (reuses ExperienceEntry) |
| `src/components/Footer.astro` | Social links + back to top |
| `src/data/experience.ts` | Experience entries array |
| `src/data/projects.ts` | Projects array |
| `src/data/skills.ts` | Skills grouped by category |
| `src/data/leadership.ts` | Leadership entries array |
| `public/img/` | Headshot + project screenshots (copied from existing `img/`) |
| `.github/workflows/deploy.yml` | Build on push to main, deploy to gh-pages |

---

## Task 1: Scaffold Astro Project + Configure Tailwind

**Files:**
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `package.json`
- Delete: `index.html`, `style.css`, `scripts.js`

- [ ] **Step 1: Initialize Astro in the existing repo directory**

```bash
cd "C:/Users/Vincent/documents/github/vinnyh125.github.io"
npm create astro@latest . -- --template minimal --no-install --no-git
```

When prompted, choose: minimal template, TypeScript: strict, no install (we do it next).

- [ ] **Step 2: Add Tailwind integration**

```bash
npm install
npx astro add tailwind --yes
```

This creates `tailwind.config.mjs` and updates `astro.config.mjs` automatically.

- [ ] **Step 3: Remove legacy files**

```bash
rm index.html style.css scripts.js
```

- [ ] **Step 4: Verify the scaffold builds**

```bash
npm run build
```

Expected: `dist/` created, no errors. `dist/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with Tailwind"
```

---

## Task 2: Configure Design Tokens

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css` (or create if missing)
- Modify: `astro.config.mjs`

- [ ] **Step 1: Write `astro.config.mjs`**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://vinnyh125.github.io',
  integrations: [tailwind()],
});
```

- [ ] **Step 2: Write `tailwind.config.mjs`**

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0a0a',
        surface: '#111111',
        border:  '#1f1f1f',
        text:    '#f0f0f0',
        muted:   '#666666',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Write `src/styles/global.css`**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  background-color: #0a0a0a;
  color: #f0f0f0;
  font-family: "Space Mono", monospace;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Scroll reveal — elements start hidden */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 4: Verify build with design tokens**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs tailwind.config.mjs src/styles/global.css
git commit -m "feat: configure design tokens and global styles"
```

---

## Task 3: Create Content Data Files

**Files:**
- Create: `src/data/experience.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/leadership.ts`

- [ ] **Step 1: Write `src/data/experience.ts`**

```typescript
// src/data/experience.ts
export interface Entry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  link?: string;
}

export const experience: Entry[] = [
  {
    company: 'Amazon',
    role: 'Software Development Intern',
    period: 'May 2025 – Aug. 2025',
    location: 'Austin, Texas',
    link: 'https://amazon.com',
    bullets: [
      'Built full-stack self-service tool (React, TypeScript, Lambda, S3, API Gateway) enabling product and legal teams to customize consent prompt ordering directly on Amazon.com without engineering intervention',
      'Refactored Tier-1 service delivering cookie consent banners to 300M+ users, streamlined compliance across regions',
      'Improved operational efficiency by 95%, cutting configuration turnaround from 3 weeks to 1 day and eliminating recurring engineering overhead',
    ],
  },
  {
    company: 'Cornell University',
    role: 'CS 4414 Teaching Assistant',
    period: 'May 2025 – Present',
    location: 'Ithaca, New York',
    bullets: [
      'Holding weekly office hours to help 400+ students with systems programming and cloud computing using C++',
      'Providing technical support and guidance on C++, Linux tools, memory management, multi-threading, and CUDA',
      'Built 100+ Dockerized C++ tests for course autograder, ensuring accurate evaluation and reducing grading overhead',
    ],
  },
  {
    company: 'Hyphenova',
    role: 'Software Engineering Intern',
    period: 'May 2024 – Aug. 2024',
    location: 'Los Angeles, California',
    link: 'https://hyphenova.com',
    bullets: [
      "Migrated 70-person startup's codebase to React/Next.js, cutting load times 30% and reducing onboarding by 40%",
      'Developed and launched 3 marketing landing pages in React for VidCon 2024, driving 5,000+ new user sign-ups',
      'Implemented secure React Native login/signup with PostgreSQL backend, launching to 800+ users across the world',
    ],
  },
  {
    company: 'The Cai Lab: Neural Development, Injury and Diseases',
    role: 'Visiting Scholar',
    period: 'June 2024 – Sep. 2024',
    location: 'Piscataway, New Jersey',
    link: 'https://sites.rutgers.edu/cailab/about/',
    bullets: [
      'Developed Python algorithm to filter out unwanted waves from 100gb+ of scotopic data with 92% accuracy',
      'Implemented data visualizations comparing wave smoothing parameters using Pandas and Matplotlib',
      'Assessed gene therapy impact by using R to visualize and classify 300gb+ of animal recovery cell samples',
    ],
  },
  {
    company: 'Fu-Wah Garden Inc.',
    role: 'Front-End Developer Intern',
    period: 'May 2023 – Aug. 2023',
    location: 'Ewing, New Jersey',
    link: 'https://www.fuwahgarden.com/',
    bullets: [
      'Developed and designed official website for Fu-Wah Chinese Restaurant using HTML, CSS, and JavaScript',
      'Optimized search engine visibility, obtaining 20,000+ monthly page views resulting in 7.8% conversion rate',
      'Improved online presence, driving 12% more traffic to Doordash page yielding additional $1,800+ monthly revenue',
    ],
  },
];
```

- [ ] **Step 2: Write `src/data/projects.ts`**

```typescript
// src/data/projects.ts
export interface Project {
  name: string;
  stack: string[];
  bullets: string[];
  github: string;
  live?: string;
}

export const projects: Project[] = [
  {
    name: 'CURoomie',
    stack: ['Next.js', 'React', 'TailwindCSS', 'Firebase', 'Google Cloud', 'Vercel'],
    bullets: [
      'Created centralized web app for 15,000+ Cornell students to find compatible roommates on and off campus',
      'Integrated Firebase for Google authentication and explored PostgreSQL for data handling and analytics',
      'Engineered machine learning-based matching algorithm involving ranked heuristics and Gale-Shapley',
    ],
    github: 'https://github.com/vinnyh125',
  },
  {
    name: 'Strophe',
    stack: ['Dart', 'Flutter', 'SQL', 'SQLite'],
    bullets: [
      'Developed mobile app that fetches and displays 150,000+ random poems from PoetryDB API using Flutter',
      'Constructed CRUD functionality using SQL in SQLite database for storing user-favorited poems and authors',
      'Integrated local storage for offline access to saved poems and optimized async API calls, reducing latency',
    ],
    github: 'https://github.com/vinnyh125/strophe-mobile',
  },
  {
    name: 'Fu-Wah Garden',
    stack: ['HTML', 'CSS', 'JavaScript'],
    bullets: [
      'Developed and designed official website for Fu-Wah Chinese Restaurant',
      'Optimized SEO, obtaining 20,000+ monthly page views and 7.8% conversion rate',
      'Drove 12% more traffic to Doordash page, yielding $1,800+ additional monthly revenue',
    ],
    github: 'https://github.com/vinnyh125/fuwah',
    live: 'https://www.fuwahgarden.com/',
  },
];
```

- [ ] **Step 3: Write `src/data/skills.ts`**

```typescript
// src/data/skills.ts
export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'JavaScript', 'Java', 'SQL', 'C', 'C++', 'OCaml', 'HTML & CSS'],
  },
  {
    label: 'Libraries & Frameworks',
    items: ['React', 'TypeScript', 'Next.js', 'Flutter', 'React Native', 'Flask', 'OpenCV', 'PyTorch'],
  },
  {
    label: 'Databases & Tools',
    items: ['AWS CDK', 'IAM', 'PostgreSQL', 'Docker', 'Firebase', 'Git', 'DynamoDB', 'Lambda', 'S3', 'API Gateway'],
  },
];
```

- [ ] **Step 4: Write `src/data/leadership.ts`**

```typescript
// src/data/leadership.ts
import type { Entry } from './experience';

export const leadership: Entry[] = [
  {
    company: 'Cornell Nexus Project Team',
    role: 'Software Team Lead',
    period: 'Dec. 2023 – Present',
    location: 'Ithaca, New York',
    link: 'https://www.cornellnexus.com/',
    bullets: [
      'Led 40-person team responsible for obstacle detection & avoidance algorithms in autonomous robotic beach cleanup',
      'Spearheaded website redesign, increasing traffic from 1,000 to 4,000+ monthly visits and improving recruitment effort',
      'Developed GPS-RTK script in ROS2 to transmit obstacle avoidance and locational data with <4 centimeter precision',
    ],
  },
];
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: add typed content data files"
```

---

## Task 4: Main Page Layout + Navbar Component

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/Navbar.astro`

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
// src/pages/index.astro
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import ExperienceSection from '../components/ExperienceSection.astro';
import ProjectsSection from '../components/ProjectsSection.astro';
import SkillsSection from '../components/SkillsSection.astro';
import AboutSection from '../components/AboutSection.astro';
import LeadershipSection from '../components/LeadershipSection.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Vincent Huang — Software Engineer" />
    <link rel="icon" type="image/png" href="/img/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
      rel="stylesheet"
    />
    <title>Vincent Huang</title>
  </head>
  <body class="bg-bg text-text font-mono antialiased">
    <Navbar />
    <main>
      <Hero />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <AboutSection />
      <LeadershipSection />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Write `src/components/Navbar.astro`**

```astro
---
// src/components/Navbar.astro
const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#skills',     label: 'Skills' },
  { href: '#about',      label: 'About' },
  { href: '#leadership', label: 'Leadership' },
  { href: '#contact',    label: 'Contact' },
];
---

<nav
  id="navbar"
  class="fixed top-0 left-0 right-0 z-50 flex justify-center gap-8 px-6 py-4 border-b border-border bg-bg/80 backdrop-blur-sm"
>
  {links.map(({ href, label }) => (
    <a
      href={href}
      data-nav-link={href.slice(1)}
      class="text-xs tracking-widest uppercase text-muted hover:text-text transition-colors duration-200"
    >
      {label}
    </a>
  ))}
</nav>

<script>
  // Active nav link tracking — handled in Task 12
</script>
```

- [ ] **Step 3: Create placeholder components so the page builds**

Create each of these as a minimal stub (just a `<section>` with an id):

```astro
<!-- src/components/Hero.astro -->
---
---
<section id="hero" class="min-h-screen flex items-center justify-center">
  <p class="text-muted">Hero — coming soon</p>
</section>
```

Repeat for `ExperienceSection.astro`, `ProjectsSection.astro`, `SkillsSection.astro`, `AboutSection.astro`, `LeadershipSection.astro`, `Footer.astro` — each with their respective `id` attribute (`experience`, `projects`, `skills`, `about`, `leadership`, `contact`).

- [ ] **Step 4: Copy image assets**

```bash
cp -r img/ public/img/
```

- [ ] **Step 5: Run dev server and verify navbar renders**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: sticky navbar with 6 links visible at top, dark background.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ src/components/ public/img/
git commit -m "feat: main layout, navbar, and component stubs"
```

---

## Task 5: Hero Component

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
// src/components/Hero.astro
---

<section
  id="hero"
  class="min-h-screen flex flex-col items-center justify-center gap-4 px-6 pt-16 text-center"
>
  <p class="text-xs tracking-widest uppercase text-muted" data-reveal>
    Hello, I'm
  </p>
  <h1
    class="text-5xl sm:text-7xl font-bold tracking-tight text-text"
    data-reveal
  >
    Vincent Huang
  </h1>
  <p class="text-sm tracking-widest uppercase text-muted mt-1" data-reveal>
    Software Engineer &middot; Cornell CS '26 &middot; Amazon '26
  </p>

  <div class="flex items-center gap-6 mt-6" data-reveal>
    <a
      href="https://github.com/vinnyh125"
      target="_blank"
      rel="noopener noreferrer"
      class="text-muted hover:text-text transition-colors duration-200"
      aria-label="GitHub"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    </a>
    <a
      href="https://www.linkedin.com/in/vinny-huang/"
      target="_blank"
      rel="noopener noreferrer"
      class="text-muted hover:text-text transition-colors duration-200"
      aria-label="LinkedIn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>
    <a
      href="https://drive.google.com/file/d/18gIneW-Hn-GyQI5EaESbNuw77jwel6DV/view?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
      class="text-xs tracking-widest uppercase border border-border px-4 py-2 text-muted hover:text-text hover:border-muted transition-colors duration-200"
    >
      Resume
    </a>
  </div>

  <a
    href="#experience"
    class="absolute bottom-8 text-muted hover:text-text transition-colors duration-200 animate-bounce"
    aria-label="Scroll down"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
    </svg>
  </a>
</section>
```

- [ ] **Step 2: Verify hero renders in dev server**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: centered name, subtitle, GitHub/LinkedIn/Resume links, scroll-down arrow.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: hero section"
```

---

## Task 6: Experience Section

**Files:**
- Create: `src/components/ExperienceEntry.astro`
- Modify: `src/components/ExperienceSection.astro`

- [ ] **Step 1: Write `src/components/ExperienceEntry.astro`**

```astro
---
// src/components/ExperienceEntry.astro
export interface Props {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  link?: string;
}
const { company, role, period, location, bullets, link } = Astro.props;
---

<div class="grid grid-cols-[1px_1fr] gap-x-8" data-reveal>
  <!-- Timeline line + dot -->
  <div class="flex flex-col items-center">
    <div class="w-px h-3 bg-border"></div>
    <div class="w-2 h-2 rounded-full bg-muted flex-shrink-0"></div>
    <div class="w-px flex-1 bg-border"></div>
  </div>

  <!-- Content -->
  <div class="pb-10">
    <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-text hover:text-muted transition-colors duration-200"
        >
          {company}
        </a>
      ) : (
        <span class="font-bold text-text">{company}</span>
      )}
      <span class="text-xs text-muted tracking-wider">{period}</span>
    </div>
    <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
      <span class="text-sm text-muted italic">{role}</span>
      <span class="text-xs text-muted">{location}</span>
    </div>
    <ul class="space-y-1.5">
      {bullets.map((bullet) => (
        <li class="text-sm text-muted leading-relaxed flex gap-2">
          <span class="text-border mt-1 flex-shrink-0">—</span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  </div>
</div>
```

- [ ] **Step 2: Write `src/components/ExperienceSection.astro`**

```astro
---
// src/components/ExperienceSection.astro
import ExperienceEntry from './ExperienceEntry.astro';
import { experience } from '../data/experience';
---

<section id="experience" class="max-w-3xl mx-auto px-6 py-24">
  <h2
    class="text-xs tracking-widest uppercase text-muted mb-12"
    data-reveal
  >
    Experience
  </h2>

  {experience.map((entry) => (
    <ExperienceEntry
      company={entry.company}
      role={entry.role}
      period={entry.period}
      location={entry.location}
      bullets={entry.bullets}
      link={entry.link}
    />
  ))}
</section>
```

- [ ] **Step 3: Verify experience section renders**

```bash
npm run dev
```

Expected: timeline with 5 entries, company names, roles, bullet points.

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperienceEntry.astro src/components/ExperienceSection.astro
git commit -m "feat: experience section with timeline layout"
```

---

## Task 7: Projects Section

**Files:**
- Create: `src/components/ProjectCard.astro`
- Modify: `src/components/ProjectsSection.astro`

- [ ] **Step 1: Write `src/components/ProjectCard.astro`**

```astro
---
// src/components/ProjectCard.astro
export interface Props {
  name: string;
  stack: string[];
  bullets: string[];
  github: string;
  live?: string;
}
const { name, stack, bullets, github, live } = Astro.props;
---

<div
  class="border border-border bg-surface p-6 flex flex-col gap-4 hover:border-muted transition-colors duration-300"
  data-reveal
>
  <div class="flex items-start justify-between gap-4">
    <h3 class="font-bold text-text">{name}</h3>
    <div class="flex gap-3 flex-shrink-0">
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-wider uppercase"
      >
        GitHub
      </a>
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-wider uppercase"
        >
          Live ↗
        </a>
      )}
    </div>
  </div>

  <div class="flex flex-wrap gap-2">
    {stack.map((tech) => (
      <span class="text-xs text-muted border border-border px-2 py-0.5 tracking-wide">
        {tech}
      </span>
    ))}
  </div>

  <ul class="space-y-1.5 flex-1">
    {bullets.map((bullet) => (
      <li class="text-sm text-muted leading-relaxed flex gap-2">
        <span class="text-border mt-1 flex-shrink-0">—</span>
        <span>{bullet}</span>
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 2: Write `src/components/ProjectsSection.astro`**

```astro
---
// src/components/ProjectsSection.astro
import ProjectCard from './ProjectCard.astro';
import { projects } from '../data/projects';
---

<section id="projects" class="max-w-3xl mx-auto px-6 py-24">
  <h2
    class="text-xs tracking-widest uppercase text-muted mb-12"
    data-reveal
  >
    Projects
  </h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {projects.map((project) => (
      <ProjectCard
        name={project.name}
        stack={project.stack}
        bullets={project.bullets}
        github={project.github}
        live={project.live}
      />
    ))}
  </div>
</section>
```

- [ ] **Step 3: Verify projects section renders**

```bash
npm run dev
```

Expected: 2-column card grid on desktop (1-column on mobile), each card with name, stack tags, bullets, GitHub link.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/components/ProjectsSection.astro
git commit -m "feat: projects section with card grid"
```

---

## Task 8: Skills Section

**Files:**
- Modify: `src/components/SkillsSection.astro`

- [ ] **Step 1: Write `src/components/SkillsSection.astro`**

```astro
---
// src/components/SkillsSection.astro
import { skills } from '../data/skills';
---

<section id="skills" class="max-w-3xl mx-auto px-6 py-24">
  <h2
    class="text-xs tracking-widest uppercase text-muted mb-12"
    data-reveal
  >
    Skills
  </h2>

  <div class="space-y-6">
    {skills.map((group) => (
      <div class="grid grid-cols-[140px_1fr] gap-4 items-start" data-reveal>
        <span class="text-xs tracking-widest uppercase text-muted pt-1">
          {group.label}
        </span>
        <div class="flex flex-wrap gap-2">
          {group.items.map((item) => (
            <span class="text-sm text-muted border border-border px-2 py-0.5 tracking-wide">
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Verify skills section renders**

```bash
npm run dev
```

Expected: 3 groups (Languages, Libraries & Frameworks, Databases & Tools), each with inline tags.

- [ ] **Step 3: Commit**

```bash
git add src/components/SkillsSection.astro
git commit -m "feat: skills section"
```

---

## Task 9: About Section

**Files:**
- Modify: `src/components/AboutSection.astro`

- [ ] **Step 1: Write `src/components/AboutSection.astro`**

```astro
---
// src/components/AboutSection.astro
---

<section id="about" class="max-w-3xl mx-auto px-6 py-24">
  <h2
    class="text-xs tracking-widest uppercase text-muted mb-12"
    data-reveal
  >
    About
  </h2>

  <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-10 items-start">
    <div class="flex justify-center sm:justify-start" data-reveal>
      <img
        src="/img/vh-headshot.JPG"
        alt="Vincent Huang"
        width="200"
        height="200"
        class="w-48 h-48 object-cover object-top grayscale"
      />
    </div>

    <div class="space-y-4 text-sm text-muted leading-relaxed" data-reveal>
      <p>
        Hi! I'm Vinny — a student at
        <span class="text-text">Cornell University</span> pursuing a B.A. M.Eng
        in Computer Science and a minor in Asian American Studies, graduating
        May 2026.
      </p>
      <p>
        This coming August, I'll be joining
        <span class="text-text">Amazon</span> full-time as a Software Engineer
        on the Privacy team — returning from a summer 2025 internship where I
        built tools that reached 300M+ users.
      </p>
      <p>
        At Cornell, I lead the software team at
        <a
          href="https://www.cornellnexus.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-text hover:text-muted transition-colors duration-200"
        >Cornell Nexus</a>,
        a project team building a robot that filters microplastics from beaches.
        Outside of code, I'm into reading, working out, badminton, and music.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify about section renders**

```bash
npm run dev
```

Expected: headshot left, bio text right on desktop; stacked on mobile. Image appears grayscale.

- [ ] **Step 3: Commit**

```bash
git add src/components/AboutSection.astro
git commit -m "feat: about section with photo and bio"
```

---

## Task 10: Leadership Section

**Files:**
- Modify: `src/components/LeadershipSection.astro`

- [ ] **Step 1: Write `src/components/LeadershipSection.astro`**

```astro
---
// src/components/LeadershipSection.astro
import ExperienceEntry from './ExperienceEntry.astro';
import { leadership } from '../data/leadership';
---

<section id="leadership" class="max-w-3xl mx-auto px-6 py-24">
  <h2
    class="text-xs tracking-widest uppercase text-muted mb-12"
    data-reveal
  >
    Leadership
  </h2>

  {leadership.map((entry) => (
    <ExperienceEntry
      company={entry.company}
      role={entry.role}
      period={entry.period}
      location={entry.location}
      bullets={entry.bullets}
      link={entry.link}
    />
  ))}
</section>
```

- [ ] **Step 2: Verify leadership section renders**

```bash
npm run dev
```

Expected: Cornell Nexus entry with same timeline style as experience.

- [ ] **Step 3: Commit**

```bash
git add src/components/LeadershipSection.astro
git commit -m "feat: leadership section reusing ExperienceEntry"
```

---

## Task 11: Footer Component

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
---

<footer
  id="contact"
  class="border-t border-border mt-12 py-12 px-6"
>
  <div class="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
    <p class="text-xs text-muted tracking-widest uppercase">Vincent Huang</p>

    <div class="flex items-center gap-6">
      <a
        href="https://github.com/vinnyh125"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-widest uppercase"
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/vinny-huang/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-widest uppercase"
      >
        LinkedIn
      </a>
      <a
        href="mailto:vh222@cornell.edu"
        class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-widest uppercase"
      >
        Email
      </a>
      <a
        href="https://drive.google.com/file/d/18gIneW-Hn-GyQI5EaESbNuw77jwel6DV/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-widest uppercase"
      >
        Resume
      </a>
    </div>

    <a
      href="#hero"
      class="text-xs text-muted hover:text-text transition-colors duration-200 tracking-widest uppercase"
    >
      ↑ Top
    </a>
  </div>
</footer>
```

- [ ] **Step 2: Verify footer renders**

```bash
npm run dev
```

Expected: bottom bar with name left, links center, "↑ Top" right.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: footer with contact links"
```

---

## Task 12: Scroll Reveal + Active Nav Tracking

**Files:**
- Modify: `src/components/Navbar.astro` (add active tracking script)
- Modify: `src/pages/index.astro` (add scroll reveal script)

- [ ] **Step 1: Add scroll reveal script to `src/pages/index.astro`**

Add before the closing `</body>` tag:

```astro
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    observer.observe(el);
  });
</script>
```

- [ ] **Step 2: Replace the Navbar `<script>` stub with active tracking**

Replace the `<script>` block in `src/components/Navbar.astro` with:

```html
<script>
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('data-nav-link') === id;
            link.classList.toggle('text-text', isActive);
            link.classList.toggle('text-muted', !isActive);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
</script>
```

- [ ] **Step 3: Verify scroll reveal and active nav in browser**

```bash
npm run dev
```

Open `http://localhost:4321`. Scroll down — expected:
- Section headings and cards fade in as they enter viewport
- Active navbar link turns white as its section is in view

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/Navbar.astro
git commit -m "feat: scroll reveal and active nav tracking"
```

---

## Task 13: Production Build Verification

**Files:** None modified — verification only.

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: no errors, `dist/` populated.

- [ ] **Step 2: Preview production build locally**

```bash
npm run preview
```

Open `http://localhost:4321`. Verify:
- All sections render correctly
- Scroll reveal works
- Active nav tracks correctly
- All external links open in new tab
- No console errors

- [ ] **Step 3: Check mobile layout**

In browser devtools, set viewport to 375px wide. Verify:
- Nav links don't overflow (reduce gap if needed — change `gap-8` to `gap-4` in Navbar if crowded on mobile)
- Skills grid label + tags stack correctly on narrow screens (change `grid-cols-[140px_1fr]` to `grid-cols-1` below `sm:`)
- Projects grid is 1-column
- About section is stacked (photo above text)

Fix any layout issues, then re-run build.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive layout polish"
```

---

## Task 14: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Configure GitHub Pages to use GitHub Actions**

In the GitHub repo settings → Pages → Source: select **GitHub Actions** (not a branch). This step must be done in the browser — it cannot be scripted.

- [ ] **Step 3: Commit and push to trigger first deploy**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: GitHub Actions deploy workflow"
git push origin main
```

- [ ] **Step 4: Verify deploy succeeds**

Go to `https://github.com/vinnyh125/vinnyh125.github.io/actions`. Expected: workflow runs green. Then visit `https://vinnyh125.github.io` — site should be live.

---

## Self-Review Checklist

- [x] **Spec coverage:** Hero ✓, Experience ✓, Projects ✓, Skills ✓, About ✓, Leadership ✓, Contact/Footer ✓, Scroll reveal ✓, Active nav ✓, Deploy ✓
- [x] **No placeholders:** All code blocks contain actual implementation
- [x] **Type consistency:** `Entry` interface defined in `experience.ts`, imported by `leadership.ts`. `ExperienceEntry.astro` Props match `Entry` fields. `Project` interface defined and used consistently. `SkillGroup` defined and used consistently.
- [x] **`data-reveal` attribute** used in global.css, all components, and scroll reveal script — consistent throughout
- [x] **`data-nav-link`** attribute matches section `id` values across Navbar and index.astro sections
