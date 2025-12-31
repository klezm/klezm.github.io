# GitHub Copilot Instructions for klezm.github.io

This is an **Astro** project using the **Starlight** documentation theme, customized as a personal blog.

## 🏗 Project Architecture

- **Framework**: Astro 5.x with `@astrojs/starlight`.
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`).
- **Content**: MDX/Markdown files located in `src/content/docs/`.
- **Routing**: Handled automatically by Starlight based on file structure in `src/content/docs/`, except for custom overrides in `src/pages/`.

### Key Directories
- `src/content/docs/`: **Source of truth** for all site content (blog posts, guides).
- `src/content/docs/blog/`: Dedicated directory for blog posts.
- `src/pages/`: Custom Astro pages that override Starlight's auto-routing (e.g., `index.astro` for the custom homepage).
- `src/components/`: Reusable UI components (e.g., `BlogPreview.astro`).
- `astro.config.mjs`: **Critical configuration** for Starlight plugins, sidebar navigation, and integrations.

## 📝 Content & Frontmatter Conventions

- **Schema**: Content must adhere to the schema defined in `src/content.config.ts` (Starlight docs schema + `starlight-blog` schema).
- **Blog Posts**:
  - Location: `src/content/docs/blog/*.{md,mdx}`
  - Required Frontmatter: `title`, `date`.
  - Optional Frontmatter: `tags`, `authors`, `excerpt`.
- **Math Support**: Use standard LaTeX syntax (`$E=mc^2$`) supported by `remark-math` and `rehype-katex`.

## 🎨 Styling & Components

- **Tailwind CSS**: Use Tailwind utility classes for styling. Configuration is minimal due to v4.
- **Starlight Overrides**: Custom pages (like `src/pages/index.astro`) use `<StarlightPage>` to wrap content while maintaining the site shell (header/footer) but disabling the sidebar (`hasSidebar={false}`).
- **Custom Components**: When creating components, prefer `.astro` files.

## 🛠 Development Workflow

- **Package Manager**: `npm` (detected `package-lock.json`).
- **Dev Server**: `npm run dev` (runs `astro dev`).
- **Build**: `npm run build` (outputs to `dist/`).
- **New Content**: To add a page, create a file in `src/content/docs/`. No manual routing config needed unless adding to the sidebar in `astro.config.mjs`.

## 🧩 Integrations

- **Blog**: `starlight-blog` handles blog-specific features (authors, reading time).
- **Comments**: `starlight-giscus` powers the comment section on posts.
- **Alerts**: GitHub-style alerts (e.g., `> [!NOTE]`) are supported via `starlight-github-alerts`.

## NON-NEGOTIABLES

- Use latest best practices for Astro and Starlight. Deprecated patterns are not allowed.
