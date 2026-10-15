import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://vinnyh125.github.io',
  integrations: [tailwind()],
  // three.js is ~560 kB minified (~140 kB gzipped); it's lazy-loaded by the hero, so this is expected
  vite: { build: { chunkSizeWarningLimit: 600 } },
});
