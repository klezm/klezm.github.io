## Features

There are integrations that might suit my needs:

- [mdx components & plugins](https://mdxjs.com/docs/extending-mdx/)
- [remark plugins](https://github.com/remarkjs/remark/blob/ed7b185d304adaf5aa80fc78a912603a5cd6e85a/doc/plugins.md)
- [rehype plugins](https://github.com/rehypejs/rehype/blob/f946e55cd03a10d3bf27afb49a38557caf920f59/doc/plugins.md)
- [astro integrations](https://astro.build/integrations/)

My feature wish list (also see: [tailwind-nextjs-starter-blog features](https://github.com/timlrx/tailwind-nextjs-starter-blog?tab=readme-ov-file#features)):

- [x] Search ([kbar](https://github.com/timc1/kbar), [Pagefind](https://github.com/Pagefind/pagefind), [pliny](https://github.com/timlrx/pliny))
- [x] Tags
  - [ ] Page listing all tags with their posts
- [ ] Author(s)
  - [ ] Page listing all authors
- [x] Dark mode (+ switcher)
- [x] Math (MathJax / KaTeX)
- [x] Comments ([giscus](https://github.com/giscus/giscus), Disqus, [pliny](https://github.com/timlrx/pliny))
- [ ] Analytics (Google/Plausible/Simple/Umami Analytics ([for astro](https://www.npmjs.com/package/@yeskunall/astro-umami)), Posthog, Microsoft Clarity; see: [pliny](https://github.com/timlrx/pliny))
- [x] TOC (with spying / highlighting active section) ([TocBot](https://github.com/tscanlin/tocbot))
- [ ] Read time estimation
- [ ] Citation / Bibliography / Referencing ([rehype-citation (has tooltip)](https://github.com/timlrx/rehype-citation))
  - [ ] With card on mouseover / tooltip / popover
  - [ ] Alternative: Markdown Footnotes (see: [1](https://astro-micro.vercel.app/blog/04-markdown-syntax#footnotes))
- [ ] Syntax highlighting ([highlight.js](https://github.com/highlightjs/highlight.js), [PrismJS](https://github.com/PrismJS/prism/), [bright](https://github.com/code-hike/bright), [shiki](https://github.com/shikijs/shiki), [shiki-magic-move](https://github.com/shikijs/shiki-magic-move))
- [ ] RSS
- [ ] Multiple post templates (1/2 column(s), w(/o) banner/katex/citation, coding/science)
- [ ] (Headless) CMS ([tinaCMS](https://github.com/tinacms/tinacms), [directus](https://github.com/directus/directus))
- [ ] Components
  - [x] Article Banner
  - [ ] Colored box
  - [ ] Block with Caption (e.g. figure with caption, or card with card footer [1](https://flyonui.com/docs/components/card/))
    - html supports [`<figure><figcaption>`](https://www.w3schools.com/tags/tag_figcaption.asp)
      and [`<table><caption>`](https://www.w3schools.com/tags/tag_caption.asp)
      (see: [1](https://github.com/SimeonAT/simeonat.github.io/blob/0ea6897439bf0acd03d09bfe368e6911f1e62eec/src/content/blog/esp32-energy/index.mdx?plain=1#L36-L41))
  - [ ] Show/Edit on GitHub
  - [x] Callout components
  - [ ] Bleed (use 95-100% screen width) (see: [pliny](https://github.com/timlrx/pliny))
  - [ ] Pagination
- [ ] Lighthouse score
- [x] Responsive design (mobile)
- [ ] Image optimization
- [ ] minify HTML/CSS/JS
- [ ] CSS
  - [ ] Inline code & equations with grey background color

### TODO

- [ ] Code blocks with language indicator
- [ ] frame the blog content text width with a border and use some visual indicator to show when an element extends beyond the border
- [ ] unify & standardize mobile and desktop layout
- [ ] popover on footnote numbers
  - [ ] style footnote section
- [ ] `ContentCard`
  - [ ] if stack=vertical, then the prose width equals text width
  - [ ] prose width must not be greater than text width (also applies to table columns)
  - [ ] parse quoteblock (with custom alert, or inside ContentCard). Caption comes after `---`
  - [ ] Add title
