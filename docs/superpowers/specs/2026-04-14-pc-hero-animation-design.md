# PC Hero Animation Design Spec
**Date:** 2026-04-14
**Status:** Approved

## Overview

Replace the current centered Hero section with an isometric SVG illustration of a small form factor PC that assembles itself on page load using anime.js. The assembled PC sits as a large, low-opacity background layer; hero text (name, subtitle, links) overlays it and fades in after assembly completes. After assembly, the PC responds to mouse movement with a subtle parallax tilt.

## Stack

| Addition | Purpose |
|---|---|
| `animejs` (npm) | Assembly animation + text fade-in sequencing |
| Vanilla JS (`mousemove` + `requestAnimationFrame`) | Parallax lerp |
| Hand-crafted isometric SVG | PC illustration — no 3D engine |

## Files Changed

| File | Change |
|---|---|
| `package.json` | Add `animejs` dependency |
| `src/components/IsometricPC.astro` | New — SVG illustration with named `<g>` groups per component |
| `src/components/Hero.astro` | Restructure layout; import IsometricPC; add animation + parallax script |

No other files change.

## IsometricPC SVG

A hand-crafted isometric SFF PC. All drawn in a single `<svg>` with viewBox sized for a large background render (e.g. `viewBox="0 0 600 500"`). Each hardware component is a `<g>` with a unique `id` so anime.js can target it individually.

### Components & IDs

| ID | Component | Notes |
|---|---|---|
| `#pc-case` | Outer case body (3 isometric faces) | First to appear |
| `#pc-motherboard` | Motherboard PCB inside the case | Base layer inside case |
| `#pc-cpu` | CPU die + heatsink fins | Center of motherboard |
| `#pc-ram-a` | First RAM stick | Right side of board |
| `#pc-ram-b` | Second RAM stick | Next to first |
| `#pc-gpu` | GPU card (long, horizontal) | Lower portion of case |
| `#pc-ssd` | NVMe M.2 SSD (small rectangle) | Lower right of board |

All groups start with `opacity: 0` set via inline style (not CSS class, so anime.js can tween them).

### Visual Style

- Monochrome: faces use `#0a0a0a`, `#111`, `#161616` (matching site palette)
- Stroke: `#2a2a2a` to `#333` — subtle edge definition
- No color accents — blends into dark hero background at low opacity
- Internal component detail lines (PCB traces, heatsink fins, GPU shroud ribs) drawn with 0.75px strokes

## Hero Layout

```
<section id="hero">  relative, min-h-screen, overflow:hidden

  <div id="pc-wrapper">   absolute inset-0, flex items-center justify-center, z-0
    <IsometricPC />        SVG fills ~70vmin, overall opacity ~0.15 on the wrapper

  <div>                   relative z-10, flex col, items-center, justify-center, min-h-screen, gap-4, text-center, pt-16
    <p>Hello, I'm</p>     opacity:0 initially — revealed by anime.js after assembly
    <h1>Vincent Huang</h1>
    <p>subtitle</p>
    <div>social links</div>
    <a>scroll arrow</a>
```

All text elements get `id` attributes for anime.js targeting: `#hero-greeting`, `#hero-name`, `#hero-subtitle`, `#hero-links`, `#hero-arrow`.

## Animation Sequence (anime.js)

Triggered on `DOMContentLoaded`. Total runtime ~1.8s.

```
Step 1 — Case body (t=0)
  targets: #pc-case
  opacity: 0 → 1, scale: 0.85 → 1
  duration: 700ms, easing: easeOutExpo

Step 2 — Motherboard (t=150ms)
  targets: #pc-motherboard
  opacity: 0 → 1, translateY: 30 → 0
  duration: 500ms, easing: easeOutExpo

Step 3 — CPU (t=350ms)
  targets: #pc-cpu
  opacity: 0 → 1, translateY: -25 → 0
  duration: 400ms, easing: easeOutExpo

Step 4 — RAM sticks (t=500ms)
  targets: [#pc-ram-a, #pc-ram-b]
  opacity: 0 → 1, translateX: 25 → 0
  duration: 400ms, easing: easeOutElastic(1, 0.6)
  delay: anime.stagger(80ms)

Step 5 — GPU (t=650ms)
  targets: #pc-gpu
  opacity: 0 → 1, translateX: -35 → 0
  duration: 450ms, easing: easeOutExpo

Step 6 — SSD (t=800ms)
  targets: #pc-ssd
  opacity: 0 → 1, translateY: 20 → 0
  duration: 350ms, easing: easeOutExpo

Step 7 — Text reveal (complete callback after Step 6)
  targets: [#hero-greeting, #hero-name, #hero-subtitle, #hero-links, #hero-arrow]
  opacity: 0 → 1, translateY: 8 → 0
  duration: 600ms, easing: easeOutQuad
  delay: anime.stagger(80ms)
```

Implementation: use `anime.timeline()` with `offset` values for each step. Text reveal fires in the `complete` callback of the final component step.

## Parallax

Fires on `mousemove` within `#hero`. Uses `requestAnimationFrame` loop for smooth lerp.

```javascript
// Constants
const MAX_X = 20;   // px
const MAX_Y = 10;   // px
const LERP  = 0.08; // per frame

// State
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

// mousemove handler — update targets
hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * MAX_X * 2;
  targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * MAX_Y * 2;
});

// RAF loop — lerp and apply
function tick() {
  currentX += (targetX - currentX) * LERP;
  currentY += (targetY - currentY) * LERP;
  pcWrapper.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Reset on mouse leave
hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
```

Parallax does not start until assembly is complete (RAF loop starts in the `complete` callback of Step 7).

## Mobile Behaviour

On viewports `< 768px`:
- PC SVG scales to `50vmin` (smaller, still visible)
- Parallax disabled (no mouse on touch devices — mousemove never fires)
- Assembly animation still plays
- Text layout unchanged (already responsive)

## Out of Scope

- Hover-to-label individual PC components (could be a follow-up)
- Any color/RGB lighting on the PC
- Touch-based parallax (gyroscope)
