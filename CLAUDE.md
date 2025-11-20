# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Astro 5, Tailwind CSS 4, and TypeScript. The site is deployed on Vercel and includes analytics tracking. The project is configured in Spanish (lang="es") and showcases professional experience, projects, and personal information.

## Development Commands

```bash
# Start development server
npm run dev
# or
npm start

# Build for production (runs type checking first)
npm run build

# Preview production build
npm run preview

# Run Astro CLI commands directly
npm run astro
```

## Architecture

### Project Structure

- `/src/pages/` - Astro pages (routing is file-based)
  - `index.astro` - Main portfolio page
  - `components.astro` - Component showcase page
- `/src/layouts/` - Layout components
  - `Layout.astro` - Base layout with Header, Footer, global styles, and Vercel Analytics
- `/src/components/` - Reusable components
  - Main components (Hero, Experience, Projects, AboutMe, etc.)
  - `/icons/` - SVG icon components
- `/src/styles/` - Global CSS files
- `/public/` - Static assets (images, favicon, etc.)

### Key Technologies

- **Astro 5.15.9**: Static site generator with island architecture
- **Tailwind CSS 4.1.17**: Utility-first CSS framework with dark mode support (`darkMode: 'class'`)
- **TypeScript 5.8.2**: Type-safe development with strict mode
- **Vercel Analytics**: Integrated for tracking site usage

### Astro Integrations

The project uses several Astro integrations (configured in `astro.config.mjs`):
- `astro-robots-txt` - Robots.txt generation
- `@astrojs/sitemap` - Sitemap generation (site URL: https://porfolio.dev/)
- `@astrojs/partytown` - Third-party script optimization
- `@astrojs/mdx` - MDX support
- `@astrojs/markdoc` - Markdoc support

### Import Aliases

TypeScript is configured with path aliases:
```typescript
"@/*" → "src/*"
```

Example: `import Layout from '@/layouts/Layout.astro'`

### Styling Approach

- Tailwind CSS v4 is the primary styling method via `@tailwindcss/vite` plugin
- **CRITICAL**: Do NOT use `@astrojs/tailwind` integration - it conflicts with the Vite plugin approach
- **Tailwind v4 Constraints**:
  - `@apply` directive is NOT supported inside `@keyframes`
  - When using `@apply` in Astro scoped styles with dark mode variants, you may encounter errors - use regular CSS instead
  - Use standard CSS properties in keyframes instead of Tailwind utilities
  - Example: Use `background-color: rgb(255 255 255 / 0.5);` instead of `@apply bg-white/50;` in keyframes
- Dark mode is class-based (toggle between light/dark themes)
- Global styles in `Layout.astro` include:
  - Custom scroll-triggered header animation (`#header-nav` with scroll-timeline)
  - Onest Variable font from Fontsource
  - Custom gradient backgrounds for light/dark modes
  - Smooth scroll behavior (with reduced-motion support)

### Content Management

Experience and Projects data are defined as constants within their respective components:
- `Experience.astro` contains `EXPERIENCE` array with job history
- `Projects.astro` contains `PROJECTS` array and `TAGS` object for project showcases

When adding new experiences or projects, update these arrays directly in the component files.

## CI/CD

GitHub Actions workflows are configured for:
- Claude PR Assistant (`claude.yml`)
- Claude Code Review (`claude-code-review.yml`)

## Important Notes

- The site language is Spanish (`lang="es"`)
- Personal information (name, experience, etc.) is specific to Óscar Gallego
- Projects section is currently commented out in `index.astro` (lines 33-39)
- Type checking runs automatically before builds via `astro check`
