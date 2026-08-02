# GitHub Copilot Instructions for klezm.github.io

An **Astro 7** project using the **Starlight 0.41** theme as a personal,
blog-only site. Deployed to GitHub Pages at <https://klezm.github.io>.

## 🏗 Project Architecture

- **Framework**: Astro 7 with `@astrojs/starlight` 0.41.
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`) plus plain CSS.
  **No daisyUI** — its unprefixed component classes (`.toggle`, `.dropdown`,
  `.hero`, `.menu`) collide with Starlight's own and silently break things.
- **Content**: Markdown/MDX in `src/content/docs/`; routing is Starlight's
  file-based routing.
- **Markdown pipeline**: the **unified** processor
  (`markdown.processor: unified(...)`), _not_ Astro 7's default Sätteri.
  KaTeX requires remark/rehype and there is no Sätteri math plugin.

### Key Directories

- `src/content/docs/blog/` — blog posts. This is effectively the whole site.
- `src/components/override/` — Starlight component overrides.
- `src/components/` — reusable components (`PostCard`, `ContentCard`,
  `FootnotePopovers`).
- `src/middleware/` — Starlight route middleware (sidebar off, Giscus scoping).
- `src/plugins/` — local remark/rehype plugins.
- `src/pages/og/` — generated Open Graph card route.
- `astro.config.mjs` — **all** plugin wiring; heavily commented because several
  options are load-bearing.

There is no `src/pages/index.astro`. The homepage is
`src/content/docs/index.mdx` using `template: splash` with an empty `hero: {}`,
which the `Hero` override suppresses.

## 📝 Content & Frontmatter Conventions

- **Schema**: `src/content.config.ts` — Starlight docs schema + `starlight-blog`
  schema, extended with `giscus` and `bibliography`.
- **Blog posts**: `src/content/docs/blog/*.{md,mdx}`; require `title` and
  `date`. Optional: `tags`, `authors`, `excerpt`, `cover`, `featured`, `draft`,
  `bibliography`, `giscus`.
- `date` is what distinguishes a real post from the tag/author/list routes
  `starlight-blog` generates under the same `blog/` prefix. Code that needs
  "is this an actual post" should check it.
- **Math**: standard LaTeX (`$E=mc^2$`) via `remark-math` + `rehype-katex`.
- `src/content/docs/blog/kitchen-sink.mdx` exercises every feature — check
  changes against it.

## 🎨 Styling & Components

- Prefer `.astro` components.
- Component-scoped `<style>` blocks that use `@apply` **must** start with
  `@reference "/src/styles/global.css";` (path adjusted), or the build fails
  with "unknown utility class".
- **Never** hide the sidebar with CSS. Set
  `starlightRoute.hasSidebar = false` in route middleware, or the reserved
  layout column stays behind.
- Before adding a Starlight component override, check whether a plugin already
  claims it — plugins warn and skip, or skip silently, and the feature
  disappears. `MarkdownContent` is shared between `starlight-blog` and
  `starlight-image-zoom` and is composed by hand for that reason.

## 🛠 Development Workflow

- **Package manager**: `pnpm` (`pnpm-lock.yaml` is committed).
- `pnpm dev` / `pnpm build` / `pnpm check` / `pnpm format`.
- `CHECK_LINKS=true pnpm build` runs `starlight-links-validator`; CI and
  deploys set it.

## 🧩 Integrations

`starlight-blog` (posts, tags, authors, RSS, metrics), `starlight-giscus`
(comments), `starlight-github-alerts`, `starlight-image-zoom`,
`starlight-scroll-to-top`, `starlight-heading-badges`,
`starlight-markdown-blocks` (custom `:::` blocks), `starlight-kbd`,
`starlight-links-validator`, `rehype-citation`, `astro-og-canvas`.

Reach for an existing plugin before writing code. The only bespoke feature is
`src/components/FootnotePopovers.astro`, because no plugin covers it.

## NON-NEGOTIABLES

- Use latest best practices for Astro and Starlight. Deprecated patterns are not
  allowed.
