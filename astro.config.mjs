import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://vinnyh125.github.io',
  integrations: [tailwind()],
});
