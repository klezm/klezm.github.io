# klezm's blog

Personal blog at **<https://klezm.github.io>**, built with
[Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

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

## Writing a post

Posts are Markdown or MDX files in `src/content/docs/blog/`. The filename
becomes the URL: `blog/my-post.md` → `/blog/my-post/`.

```yaml
---
title: My Post
date: 2026-01-15
authors: [klezm]
tags: [haskell, types]
excerpt: One or two sentences shown on the homepage and in the feed.
cover:
  alt: Description of the image
  image: ../../../assets/my-cover.jpg
featured: true # pin to the "Featured" section on the homepage
draft: true # dev-only; excluded from production builds
bibliography: bib/my-post.bib # enables [@citekey] citations
giscus: false # opt out of comments (on by default for posts)
---
```

`src/content/docs/blog/kitchen-sink.mdx` demonstrates every supported feature
and is the fastest way to see what is available. In short: KaTeX math, code
blocks, Starlight asides and GitHub-style alerts, custom `:::idea` / `:::proof`
blocks, footnotes with hover popovers, BibTeX citations, keyboard keys and
zoomable images.

## How it fits together

The site is blog-only: there is no sidebar anywhere, which is enforced in
`src/middleware/starlight-sidebar.ts` rather than with CSS.

- **`astro.config.mjs`** — all plugin wiring. Several options there are
  load-bearing and annotated with why; read the comments before changing them.
- **`src/components/override/`** — Starlight component overrides.
  `MarkdownContent` deliberately renders both starlight-blog's content and
  image zoom, because both plugins otherwise compete for that slot and one
  silently loses.
- **`src/components/FootnotePopovers.astro`** — the only bespoke feature;
  everything else is an off-the-shelf plugin.
- **`src/plugins/rehype-citation-frontmatter.js`** — makes `rehype-citation`
  read its bibliography path from post frontmatter instead of a single global
  option.

Markdown runs through the **unified (remark/rehype)** processor, not Astro 7's
default Sätteri pipeline — KaTeX requires it and no Sätteri math plugin exists.

## Deployment

Pushes to `master` build and publish to GitHub Pages via
`.github/workflows/deploy.yml`. The checkout uses `fetch-depth: 0` because
`lastUpdated` reads commit timestamps from git history.

> [!NOTE]
> Repository **Settings → Pages → Source** must be set to **GitHub Actions**.
