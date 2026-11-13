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
  trailingSlash: 'never',
  build: {
    assets: '_assets'
  },

  vite: {
    plugins: [tailwindcss()],
    // /api lives in the Worker; run `bunx wrangler dev` alongside `bun run dev`
    server: {
      proxy: { '/api': 'http://localhost:8787' }
    }
  }
});