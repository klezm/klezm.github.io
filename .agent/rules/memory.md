---
trigger: model_decision
description: Key memories
---

# 🧠 Memories & Best Practices

## Astro 7 / Starlight 0.41

- **Markdown processor**: Astro 7 defaults to **Sätteri** and no longer installs
  `@astrojs/markdown-remark`. This project needs remark-math + rehype-katex and
  **no Sätteri math plugin exists**, so the unified pipeline is mandatory:

  ```js
  import { unified } from '@astrojs/markdown-remark';
  markdown: { processor: unified({ remarkPlugins: [...], rehypePlugins: [...] }) }
  ```

  The top-level `markdown.remarkPlugins` / `rehypePlugins` keys still work but
  are deprecated.

- **Plugins are attachers, not transformers.** Pass `[myPlugin, options]`, never
  `myPlugin(options)`. Passing the invoked result makes unified call your
  transformer as an attacher: it runs once with `tree === undefined` and then
  never touches any content — silently, with no error.
- **Component overrides** no longer receive route data through `Astro.props` —
  Starlight 0.41's own components take **zero props**. Read
  `Astro.locals.starlightRoute` and drop any `{...Astro.props}` spread.
- **Sidebar `autogenerate`** groups must be wrapped in `items: [...]` since 0.39.
- `z` from `astro:content` is deprecated; import from `astro/zod`.
- Astro 6+ requires **Node 22.12+**.

## Plugin component-override collisions

Starlight plugins claim component overrides, and when two want the same one the
loser is **silent** — it warns and skips, or checks "is it free?" and gives up.
Always scan the build log for `It looks like you already have a X component
override`.

Known claims in this project:

| Component         | Claimed by                                                                            |
| ----------------- | ------------------------------------------------------------------------------------- |
| `MarkdownContent` | `starlight-blog` **and** `starlight-image-zoom` — must compose by hand                |
| `ThemeSelect`     | `starlight-blog` (`navigation: 'header-end'`), `starlight-kbd` (`globalPicker: true`) |
| `SiteTitle`       | `starlight-blog` (`navigation: 'header-start'`)                                       |
| `Pagination`      | `starlight-giscus`                                                                    |
| `TableOfContents` | `starlight-heading-badges`                                                            |

Consequences already hit: `navigation: 'header-end'` silently dropped the blog
nav link, and `starlight-kbd`'s default `globalPicker: true` would replace the
custom theme toggle. `Head`, `Footer` and `Hero` are free.

## Sidebar

- **Avoid** overriding `Sidebar` or hiding it with CSS (`display: none`) — that
  leaves the reserved layout column behind and content will not expand.
- **Prefer** route middleware setting
  `context.locals.starlightRoute.hasSidebar = false`.
- **Consequence**: `PageFrame` renders `MobileMenuToggle` only when
  `hasSidebar`. Turning it off site-wide removes the mobile menu — and that is
  where `starlight-blog` puts its mobile nav link. `src/components/override/Footer.astro`
  carries a nav row to compensate.
- Use `src/content.config.ts` (not `src/content/config.ts`); extend schemas via
  the `extend` callback in `docsSchema`.

## Blog routes

`starlight-blog` generates tag, author and post-list routes under the same
`blog/` prefix as real posts, so `id.startsWith('blog/')` matches all of them —
this had comments rendering on tag pages. Those virtual entries have no `date`,
which is the reliable discriminator for "this is an actual post".

## Blog Post Layouts

- **Full-bleed**: wrap content in `.blog-content-wrapper` (done in the
  `MarkdownContent` override), then use CSS Grid on `.sl-markdown-content` to
  constrain text to `min(65ch, 100%)` while letting tables, code and media span
  `1 / -1`.
- **Tables**: use `width: fit-content`, `max-width: 100%`, `margin-inline: auto`
  rather than forcing 100%. Constrain prose columns with
  `td { max-width: 50ch; }`.
- Prefer reusable components (`<ContentCard>`) over ad-hoc `div` wrappers.
- **`overflow-x: clip`, not `auto`**, on `.main-pane`: `auto` forces the computed
  `overflow-y` to `auto` as well, creating a scroll container that breaks
  `scroll-padding-top`, so anchor jumps land under the sticky header.

## ContentCard

- Avoid new dependencies for simple tasks; prefer string manipulation or
  standard APIs.
- `Astro.slots.render('default')` plus a string check (`endsWith('</sub>')`) is a
  valid way to extract a trailing caption without an AST parser.
- **`v-bind()` is Vue, not Astro.** It emitted literal invalid CSS here and the
  `proseWidth` prop did nothing for months. Use an inline `style` attribute or
  `define:vars` to get a value into scoped CSS.
- Bleed defaults to `true`; captions get a distinct background rather than a
  border; support horizontal/vertical stacking.
- **Mobile first**: vertical stacks by default, horizontal at `min-width: 40rem`.

## Giscus

- Restrict to posts via route middleware, setting `entry.data.giscus` (see
  "Blog routes" for why the prefix check alone is not enough).
- **Theme sync contract**: `starlight-giscus` re-themes its iframe by listening
  for a **`change` event on `<starlight-theme-select>`**. Stock Starlight
  renders a `<select>` there, which bubbles one for free. This site's override is
  a `<button>`, so it must `dispatchEvent(new Event('change', { bubbles: true }))`
  itself — otherwise comments ignore the theme toggle entirely.

## Tailwind CSS v4

- Component-scoped `<style>` blocks using `@apply` **must** start with
  `@reference "/src/styles/global.css";` (relative path adjusted) or the build
  fails with "unknown utility class".
- **daisyUI was removed.** Its component classes are unprefixed and collide with
  four class names Starlight uses internally: `.toggle`, `.dropdown`, `.hero`,
  `.menu`. `.toggle` was restyling the mobile table-of-contents button into a
  40x24 switch, which a block of `!important` overrides had been papering over.
  If it is ever reintroduced, configure a prefix.
- Mix semantic class names in markup with utilities applied in CSS; use plain
  CSS variable syntax for Starlight theme variables.

## Mobile & Responsive

- **Theme toggle on mobile**: rather than shadowing `Header`, force visibility in
  `global.css`:
  `@media (max-width: 50rem) { .header .right-group { display: flex !important; } }`
- **Mobile TOC**: Starlight 0.41 lays it out correctly unaided. Before adding
  `!important` patches, check whether a third-party CSS reset is the real cause.

## Dependencies

- **Do not bump `katex` past `^0.16`.** `rehype-katex@7` depends on `katex ^0.16`
  directly, so a newer top-level version means the CSS and the rendering engine
  come from different releases.
- **`astro-og-canvas`** downloads its default font from `api.fontsource.org` at
  build time. Fonts are vendored in `src/fonts/` and passed via the `fonts`
  option **inside `getImageOptions`** (not at the route level) to keep builds
  hermetic.
- **`rehype-citation`** cannot parse `%` comments or `\url{}` macros in `.bib`
  files; either aborts the whole build.
