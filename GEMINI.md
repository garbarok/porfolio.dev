# Project Overview

This is a personal portfolio website built with [Astro](https://astro.build/) and styled with [Tailwind CSS](https://tailwindcss.com/). The project is structured to showcase professional experience, projects, and a blog. It includes internationalization (i18n) for English and Spanish.

## Building and Running

### Prerequisites

*   Node.js and npm (or a compatible package manager like pnpm or yarn)

### Key Commands

*   **Install dependencies:**
    ```bash
    pnpm install
    ```
*   **Run the development server:**
    ```bash
    pnpm run dev
    ```
*   **Build the project for production:**
    ```bash
    pnpm run build
    ```
*   **Preview the production build:**
    ```bash
    pnpm run preview
    ```
*   **Check for broken image links:**
    ```bash
    pnpm run check:images
    ```

## Development Conventions

*   **Framework:** The project uses the Astro framework. Components are written as `.astro` files.
*   **Styling:** Tailwind CSS is used for styling. Utility classes are preferred.
*   **Content:** The blog content is written in Markdown (`.md`) and is located in the `src/content/blog` directory.
*   **Internationalization:** The `src/i18n` directory contains the logic for translating the site. JSON files for each language are in `src/i18n/locales`.
*   **Linting and Formatting:** The project uses Prettier for code formatting.
