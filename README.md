# klezm's blog

Personal blog at **<https://klezm.github.io>**, built with
[Astro](https://astro.build) and [Starlight](https://starlight.astro.build),
styled with [daisyUI](https://daisyui.com).

## Running it

Requires Node 22.12+ and pnpm.

```sh
pnpm install
pnpm dev          # http://localhost:4321
```

| Command                       | What it does                                         |
| ----------------------------- | ---------------------------------------------------- |
| `pnpm dev`                    | Dev server with hot reload                           |
| `pnpm build`                  | Production build to `dist/`                          |
| `pnpm preview`                | Serve the built site locally                         |
| `pnpm check`                  | `astro check` — type checking                        |
| `pnpm format`                 | Format with Prettier (`format:check` to verify only) |
| `CHECK_LINKS=true pnpm build` | Build and fail on dead internal links                |

Search is indexed at build time, so test it against `pnpm preview`, not
`pnpm dev`.

## Writing a post

Posts are Markdown or MDX in `src/content/docs/blog/`. The filename becomes the
URL: `blog/my-post.md` → `/blog/my-post/`.

```yaml
---
title: My Post
date: 2026-01-15
authors: [klezm]
tags: [haskell, types]
excerpt: One or two sentences shown in the post list and tag pages.
cover:
  alt: Description of the image
  image: ../../../assets/my-cover.jpg
featured: true # pin to the featured group
draft: true # dev-only; excluded from production builds
bibliography: blog/bib/my-post.bib # enables [@citekey] citations
giscus: false # opt out of comments (on by default for posts)
postLayout: two-column # default | wide | two-column
frame: false # hide the rule marking the prose column
---
```

### Post layouts

`postLayout` picks the template:

| Value        | Measure | Best for                    |
| ------------ | ------- | --------------------------- |
| `default`    | 65ch    | Essays, most posts          |
| `wide`       | 90ch    | Code- and table-heavy posts |
| `two-column` | 100ch   | Short reference material    |

`two-column` swaps the bleed grid for a real multi-column container, so text
flows down column one and continues at the top of column two. Headings, banners,
bleeding elements and the tags/prev-next block span both columns.

Every post also draws a dashed rule marking where the text measure ends, with
accent marks on elements that deliberately break past it. Turn it off per post
with `frame: false`; it hides itself on narrow screens and in print.

`src/content/docs/blog/kitchen-sink.mdx` exercises every feature and component,
and is the fastest way to see what is available.

## Components

Available under `src/components/`, all built on daisyUI primitives:

| Component      | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `ContentCard`  | Card with optional title, caption, and stacking     |
| `Callout`      | Admonition (`note`/`tip`/`info`/`warning`/`danger`) |
| `Figure`       | Any block plus a caption                            |
| `ColoredBox`   | Tinted box or leading accent bar                    |
| `Bleed`        | Break out of the prose column                       |
| `Banner`       | Article banner, optionally over an image            |
| `EditOnGitHub` | View/edit links derived from the current route      |

`ContentCard` takes its caption either from a `caption` slot or, when no slot is
given, from whatever follows a trailing `---` in its body — so a card can be
written as plain Markdown.

## How it fits together

The site is blog-only: there is no sidebar anywhere, enforced in
`src/middleware/starlight-sidebar.ts` rather than with CSS.

Markdown runs through the **unified (remark/rehype)** processor rather than
Astro 7's default Sätteri pipeline — KaTeX requires it and no Sätteri math
plugin exists.

`astro.config.mjs` and `src/styles/global.css` carry inline comments on every
decision that is load-bearing. Read them before changing either file. The short
version:

### daisyUI is prefixed, and must stay that way

Every daisyUI class is prefixed with `d-` (`btn` → `d-btn`), configured in
`src/styles/global.css`. daisyUI's unprefixed class names collide with four that
Starlight uses internally — `.toggle`, `.dropdown`, `.hero` and `.menu`. An
earlier iteration of this site shipped daisyUI unprefixed; its `.toggle`
silently restyled Starlight's mobile table-of-contents button into a switch,
which was then papered over with `!important` until daisyUI was removed
entirely. The prefix is the actual fix.

Dark mode needs no glue code: Starlight writes the resolved theme into
`document.documentElement.dataset.theme`, and daisyUI selects themes off that
same attribute, so the themes are named `light` and `dark` to match. The
`:root` block in `global.css` maps daisyUI's semantic colors onto Starlight's
`--sl-*` variables so components inherit the site palette.

### Plugin component overrides collide silently

Starlight plugins claim component overrides, and when two want the same one the
loser only logs a warning. Current ownership:

| Component         | Owner                                         |
| ----------------- | --------------------------------------------- |
| `SiteTitle`       | `starlight-blog` (`navigation: header-start`) |
| `Pagination`      | `starlight-giscus`                            |
| `MarkdownContent` | ours — delegates back to `starlight-blog`     |
| `Footer`          | ours                                          |
| `ThemeSelect`     | nobody; deliberately left stock               |

`starlight-blog` logs `It looks like you already have a MarkdownContent
component override` on every build. **That one is expected and benign** — our
override delegates straight back to it. The same warning naming any _other_
component is a real bug.

`ThemeSelect` is left stock on purpose. `starlight-blog` would claim it under
`navigation: 'header-end'` and silently drop the blog nav link; and
`starlight-giscus` re-themes its comment iframe by listening for a `change`
event on `<starlight-theme-select>`, which Starlight's stock `<select>` bubbles
for free.

### Other traps

- Native bindings for `satteri` are hoisted via `.npmrc`; without that the build
  fails resolving `@bruits/satteri-linux-x64-gnu` from Astro's bundled output.
- `katex` is pinned to `^0.16` because `rehype-katex@7` depends on it directly.
- `.bib` files must not contain `%` comments or `\url{}` macros —
  `rehype-citation` aborts the build on either.
- `.main-pane` uses `overflow-x: clip`, never `auto`: `auto` forces
  `overflow-y: auto` too, breaking `scroll-padding-top` so anchor links land
  under the sticky header.

## Analytics

[Umami](https://umami.is) — cookieless, storing no personal data, so the site
carries no consent banner. Swapping in a provider that sets cookies would change
that.

It is configured entirely through environment variables, so no site identifier
is committed and forks stay un-instrumented. See `.env.example`:

| Variable                  | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `PUBLIC_UMAMI_WEBSITE_ID` | Umami site id. Unset means no tag is emitted. |
| `PUBLIC_UMAMI_SRC`        | Script URL. Only needed when self-hosting.    |

The `PUBLIC_` prefix is required — Astro only exposes variables to the client
bundle under it. No tag is emitted during `pnpm dev` regardless, so local
browsing never reaches the real numbers.

To enable on the deployed site, set both as **repository variables** (Settings →
Secrets and variables → Actions → Variables). They are not secrets: both values
ship to the browser in the tag itself.

## Deployment

Pushes to `master` build and publish to GitHub Pages via
`.github/workflows/deploy.yml`. The checkout uses `fetch-depth: 0` because
`lastUpdated` reads commit timestamps from git history.

> [!NOTE]
> Repository **Settings → Pages → Source** must be set to **GitHub Actions**.
> This cannot be configured from the repository contents.
