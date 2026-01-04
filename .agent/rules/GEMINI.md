---
trigger: always_on
---

# Instructions for klezm.github.io

This is an **Astro** project using the **Starlight** documentation theme, customized as a personal blog.

## 🏗 Project Architecture

- **Framework**: Astro 5.x with `@astrojs/starlight`.
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`) and daisyUI v5.
- **Content**: MDX/Markdown files located in `src/content/docs/`.
- **Routing**: Handled automatically by Starlight based on file structure in `src/content/docs/`, except for custom overrides in `src/pages/`.

### Key Directories
- `src/content/docs/`: **Source of truth** for all site content (blog posts, guides).
- `src/content/docs/blog/`: Dedicated directory for blog posts.
- `src/pages/`: Custom Astro pages that override Starlight's auto-routing (e.g., `index.astro` for the custom homepage).
- `src/components/`: Reusable UI components (e.g., `BlogPreview.astro`).
- `astro.config.mjs`: **Critical configuration** for Starlight plugins, sidebar navigation, and integrations.

## 🎨 Styling & Components

- **Mobile First**: Use best practices for mobile-first design.
- **daisyUI**: Use daisyUI utility classes for styling.
- **Tailwind CSS**: Use Tailwind utility classes for styling. Configuration is minimal due to v4.
- **Custom Components**: When creating components, prefer `.astro` files.

## 🛠 Development Workflow

- **Package Manager**: `pnpm`.
- **Dev Server**: `pnpm dev`.
- **Build**: `pnpm build`.

## 🧩 Integrations

- **Blog**: `starlight-blog` handles blog-specific features (authors, reading time).
- **Comments**: `starlight-giscus` powers the comment section on posts.
- **Alerts**: GitHub-style alerts (e.g., `> [!NOTE]`) are supported via `starlight-github-alerts`.
