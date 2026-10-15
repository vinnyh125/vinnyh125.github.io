# Three.js PC Build Hero — Design Spec
**Date:** 2026-10-14
**Status:** Approved
**Supersedes:** `docs/superpowers/plans/2026-04-14-pc-hero-animation.md` (isometric SVG + anime.js, never built)

## Overview

Replace the text-only hero with a split layout: hero text on the left, a real-time Three.js scene on the right in which a mid-tower PC assembles itself part by part, then "boots" (orange glows fade up, fans spin up) at the moment the hero text reveals. Introduce an orange accent color, used sparingly across the site.

## Decisions

| Topic | Decision |
|---|---|
| Concept | Self-assembling PC build, ending in a boot moment |
| Visual style | Stylized low-poly parts built from Three.js primitives, dark grays, orange only where real RGB would be |
| Layout | Desktop: text left, PC right. Mobile: PC on top (~45vh), text below |
| Interaction | Slow idle sway + drag to rotate (pitch clamped), drifts back after release; slight mouse tilt |
| Accent | `#ff6a00` (Tailwind token `accent`) |
| Theme scope | PC glows + light site-wide accents (hovers, active nav, timeline dots, Resume button, text selection) |
| Tech | Vanilla `three` loaded via dynamic `import()`, custom pure-TS timeline (no GSAP, no React) |

## Scene

Mid-tower, glass side panel, camera at a three-quarter front/glass-side angle. Axes: `x` = side to side (glass at +x), `y` = up, `z` = front (+z) to back.

Parts: case frame (with front LED strip), motherboard, CPU, tower cooler (fin stack + fan), 2× RAM (light bars), GPU (edge strip, 2 fans), PSU, 3 front fans + 1 rear fan (orange rings), glass side panel.

Build order (≈3.5s): case → motherboard → CPU → cooler → RAM (staggered) → GPU → PSU → fans (staggered) → glass panel swings shut. Each part starts offset/rotated and transparent, fades in over the first part of its move, and settles with a slight overshoot.

Boot (starts ≈3.5s): accent glows ramp from front to back over ~1s, an internal orange point light brightens, fan speed ramps 0 → idle. `onBoot` fires once at boot start; the hero text reveals then.

Lighting: dim ambient, cool-white key light from the camera's upper left, faint rim light from behind. Subtle bloom so only the emissive accents glow.

## Architecture

```
src/scripts/pc/
  timeline.ts       # pure: easing, poseAt(track, t), bootLevel(t, delay)
  buildSequence.ts  # pure data: per-part tracks + BOOT_START / END constants
  rotation.ts       # pure: drag/idle-sway/tilt state machine stepped per frame
  parts.ts          # three: createX() per part → { group, glows, rotors, materials }
  scene.ts          # three: renderer, camera, lights, bloom, loop; exports mountPcScene()
src/components/Hero.astro  # layout, mounts the scene, reveals text
```

`mountPcScene(container, { onBoot, reducedMotion }) => dispose`

Frame loop: accumulate `elapsed` (dt clamped to 50ms so a backgrounded tab doesn't skip the build) → `poseAt` for every part → apply offset/rotation/opacity on top of each part's resting transform → boot levels → rotation step → render. Rendering pauses while the hero is off-screen or the tab is hidden.

## Fallbacks & accessibility

- **No JS:** hero text is only hidden under an `html.js` class set by an inline head script, so it's visible without JS. The canvas host is empty and hidden.
- **No WebGL2 / import or runtime error:** section gets `data-pc="off"`, the canvas host hides, the text centers and reveals immediately.
- **Safety timeout:** text reveals after 6s regardless (e.g. the user loaded scrolled past the hero, so the loop is paused).
- **`prefers-reduced-motion`:** the scene renders already assembled and booted, without idle sway; text shows immediately. Dragging still works.
- Canvas host is `aria-hidden`; `touch-action: pan-y` so vertical page scrolling still works on touch while horizontal drags rotate.

## Testing

- Vitest unit tests for the pure modules: easing endpoints, `poseAt` before/during/after a track, `bootLevel` ramp, build-sequence invariants (every part present, order matches the real build order, all parts settle before boot), rotation clamping and drift-back.
- `npm test` added to the deploy workflow before the build.
- Manual/visual: `npm run build`, headless-browser screenshots mid-build and post-boot at desktop and mobile widths.
