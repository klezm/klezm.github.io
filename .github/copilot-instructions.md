# Instructions for klezm.github.io

An **Astro 7** + **Starlight 0.41** personal blog, deployed to GitHub Pages
from `master`.

## Architecture

- **Content**: Markdown/MDX in `src/content/docs/`, routed by Starlight.
  `src/content/docs/blog/` is effectively the whole site.
- **Markdown pipeline**: the **unified** (remark/rehype) processor via
  `markdown.processor: unified(...)`, _not_ Astro 7's default Sätteri. KaTeX
  requires remark/rehype and no Sätteri math plugin exists.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, plus plain CSS.
- **No daisyUI.** Its component classes are unprefixed and collide with names
  Starlight uses internally — `.toggle`, `.dropdown`, `.hero`, `.menu`.
  `.toggle` silently restyles the mobile table-of-contents button. If it is
  ever added, give it a prefix.

There is no `src/pages/index.astro`; the homepage is
`src/content/docs/index.mdx` using `template: splash` with an empty `hero: {}`,
which the `Hero` override suppresses.

## Traps worth knowing

These have each already cost real debugging time.

- **remark/rehype plugins are attachers.** Register them as
  `[plugin, options]`, never `plugin(options)`. Passing the invoked result
  makes unified treat your transformer as the attacher — it runs once with
  `tree === undefined` and then never touches any content, silently.
- **Plugin override collisions fail silently.** Starlight plugins claim
  component overrides; when two want the same one, the loser either warns and
  skips or checks "is it free?" and gives up. Scan the build log for
  `It looks like you already have a X component override`. Currently:
  `MarkdownContent` is contested by starlight-blog **and** starlight-image-zoom
  (composed by hand in the override); `ThemeSelect` would be taken by
  starlight-blog with `navigation: 'header-end'` or starlight-kbd with
  `globalPicker: true` — both are configured to avoid it.
- **`remarkDirective` must stay registered.** starlight-github-alerts splices
  itself in ahead of it and no-ops when it is missing.
- **Do not add `remark-directive-rehype`.** User plugins run ahead of
  Starlight's, so a blanket directive transform eats `:::note` before
  Starlight's aside handler sees it. Use `starlight-markdown-blocks` to add new
  block types.
- **Never hide the sidebar with CSS.** Set
  `starlightRoute.hasSidebar = false` in route middleware, or the reserved
  layout column stays behind. Note this also removes Starlight's mobile menu,
  which is why `Footer.astro` carries a nav row.
- **`date` distinguishes a real post** from the tag/author/list routes
  starlight-blog generates under the same `blog/` prefix.
- **Do not bump `katex` past `^0.16`.** `rehype-katex@7` depends on `katex
^0.16` directly; a newer top-level version means the CSS and the rendering
  engine come from different releases.
- **Scoped `<style>` blocks using `@apply`** must start with
  `@reference "/src/styles/global.css";` or the build fails with "unknown
  utility class".
- **`v-bind()` in CSS is Vue, not Astro.** Use an inline `style` attribute or
  `define:vars`.

## Workflow

- **Package manager**: `pnpm` (`pnpm-lock.yaml` is committed,
  `packageManager` is pinned).
- `pnpm dev` / `pnpm build` / `pnpm check` / `pnpm format`.
- `CHECK_LINKS=true pnpm build` runs the link validator; CI and deploys set it.
- Check changes against `src/content/docs/blog/kitchen-sink.mdx`, which
  exercises every feature.

## Integrations

`starlight-blog`, `starlight-giscus`, `starlight-github-alerts`,
`starlight-image-zoom`, `starlight-scroll-to-top`, `starlight-heading-badges`,
`starlight-markdown-blocks`, `starlight-kbd`, `starlight-links-validator`,
`rehype-citation`, `astro-og-canvas`.

Reach for an existing plugin before writing code. The only bespoke feature is
`src/components/FootnotePopovers.astro`, because no plugin covers it.

## NON-NEGOTIABLES

- Use latest best practices for Astro and Starlight. Deprecated patterns are
  not allowed.
