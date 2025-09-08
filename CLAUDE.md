# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Astro 5.x, React, and TailwindCSS 4.x. The site features a blog with content collections, static generation, and deployment to Cloudflare Pages via Wrangler.

## Development Commands

- `bun run dev` - Start local development server at localhost:4321
- `bun run build` - Build production site to ./dist/
- `bun run preview` - Preview production build locally
- `bun run deploy` - Build and deploy to Cloudflare Pages
- `bun run astro` - Run Astro CLI commands
- `bun run wrangler` - Run Wrangler CLI commands

## Project Architecture

### Core Technologies
- **Astro 5.x**: Static site generator with server-side rendering
- **React 19**: UI components (TSX files)
- **TailwindCSS 4.x**: Styling with inline theme configuration in global.css
- **TypeScript**: Strict configuration extends astro/tsconfigs/strict
- **Zod**: Schema validation for content collections

### Directory Structure
```
src/
├── components/          # Reusable Astro components
│   ├── Header.astro
│   └── Footer.astro
├── layouts/            # Page layouts
│   ├── Base.astro      # Root HTML structure with dark theme support
│   └── Layout.astro    # Main layout wrapper (500px max-width)
├── pages/              # File-based routing
│   ├── index.astro     # Homepage
│   ├── about.astro
│   ├── projects.astro
│   └── blog/
│       ├── index.astro
│       └── [slug].astro # Dynamic blog post pages
├── content/            # Content collections
│   ├── config.ts       # Collection schemas
│   └── blog/          # Blog posts (markdown)
└── styles/
    └── global.css      # TailwindCSS with custom theme variables
```

### Content Collections
- Blog posts use Zod schema with title, description, date, published, and tags fields
- Schema defined in `src/content/config.ts`
- Content stored in `src/content/blog/` as markdown files

### Styling System
- TailwindCSS 4.x with inline theme configuration
- Dark theme support via CSS custom properties
- Geist Mono font family for monospace text
- Root layout applies monospace font and responsive padding

### Deployment
- Cloudflare Pages deployment via Wrangler
- Static output with custom assets directory (`_assets`)
- Domain: irsyad.dev with www redirect
- Configuration in `wrangler.toml` and `astro.config.mjs`

## Key Patterns

### Layout Hierarchy
1. `Base.astro` - Root HTML with head metadata and body structure
2. `Layout.astro` - Content wrapper with header/footer and max-width constraint
3. Page components use Layout.astro as wrapper

### Dark Theme Implementation
- CSS custom properties in global.css with light/dark variants
- Body class includes `dark:bg-black dark:text-white` for theme switching
- All theme colors defined as OKLCH values for consistent color space

### Content Management
- Blog posts require frontmatter matching Zod schema
- Posts must have `published: true` to appear in production
- Dynamic routing handles `/blog/[slug]` pattern for individual posts