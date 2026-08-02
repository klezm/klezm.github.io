---
trigger: always_on
---

# Instructions for klezm.github.io

An **Astro 7** project using the **Starlight 0.41** theme as a personal,
blog-only site.

## 🏗 Project Architecture

- **Framework**: Astro 7 with `@astrojs/starlight` 0.41.
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`) and plain CSS.
  **daisyUI has been removed** — its unprefixed component classes (`.toggle`,
  `.dropdown`, `.hero`, `.menu`) collide with class names Starlight uses
  internally. Do not reintroduce it without prefixing.
- **Content**: Markdown/MDX in `src/content/docs/`, routed by Starlight.
- **Markdown pipeline**: the **unified** processor, not Astro 7's default
  Sätteri — KaTeX requires remark/rehype.

### Key Directories

- `src/content/docs/blog/`: blog posts — effectively the whole site.
- `src/components/override/`: Starlight component overrides.
- `src/components/`: reusable components.
- `src/middleware/`: Starlight route middleware.
- `src/plugins/`: local remark/rehype plugins.
- `astro.config.mjs`: all plugin wiring, with comments explaining the
  non-obvious options.

There is no `src/pages/index.astro`; the homepage is
`src/content/docs/index.mdx`.

## 🎨 Styling & Components

- **Mobile first**: default to the small-screen layout and enhance upward.
- Prefer `.astro` files for components.
- Scoped `<style>` blocks using `@apply` need
  `@reference "/src/styles/global.css";` at the top.
- Control the sidebar via `starlightRoute.hasSidebar` in middleware, never with
  CSS.

## 🛠 Development Workflow

- **Package manager**: `pnpm`.
- `pnpm dev`, `pnpm build`, `pnpm check`, `pnpm format`.
- `CHECK_LINKS=true pnpm build` to validate internal links.

## 🧩 Integrations

`starlight-blog`, `starlight-giscus`, `starlight-github-alerts`,
`starlight-image-zoom`, `starlight-scroll-to-top`, `starlight-heading-badges`,
`starlight-markdown-blocks`, `starlight-kbd`, `starlight-links-validator`,
`rehype-citation`, `astro-og-canvas`.

Prefer an existing plugin over new code.
