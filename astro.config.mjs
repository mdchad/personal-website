// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';


import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  site: "https://irsyad.dev",
  build: {
    assets: '_assets'
  },

  vite: {
    plugins: [tailwindcss()]
  }
});