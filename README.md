# 

## Blogging Platforms

### Gatsby

- https://www.gatsbyjs.com
- https://github.com/gatsbyjs/gatsby
- [Gatsby vs jekyll vs Hugo](https://www.gatsbyjs.com/features/jamstack/gatsby-vs-jekyll-vs-hugo)
- https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog
- https://www.gatsbyjs.com/docs/themes/
- https://themejam.gatsbyjs.org/showcase

Plugins

- https://www.gatsbyjs.com/plugins/gatsby-plugin-disqus/
- https://www.gatsbyjs.com/plugins/gatsby-plugin-algolia/

### Next.js

- https://nextjs.org/

### nextra

- https://nextra.site/

### TailwindBlog

- https://github.com/timlrx/tailwind-nextjs-starter-blog

### Astro

- https://astro.build/showcase/

### Quartz

- https://github.com/jackyzha0/quartz

## Features

There are integrations that might suit my needs:

- [mdx components & plugins](https://mdxjs.com/docs/extending-mdx/)
- [remark plugins](https://github.com/remarkjs/remark/blob/ed7b185d304adaf5aa80fc78a912603a5cd6e85a/doc/plugins.md)
- [rehype plugins](https://github.com/rehypejs/rehype/blob/f946e55cd03a10d3bf27afb49a38557caf920f59/doc/plugins.md)
- [astro integrations](https://astro.build/integrations/)

My feature wish list (also see: [tailwind-nextjs-starter-blog features](https://github.com/timlrx/tailwind-nextjs-starter-blog?tab=readme-ov-file#features)):

- Search ([kbar](https://github.com/timc1/kbar), [Pagefind](https://github.com/Pagefind/pagefind), [pliny](https://github.com/timlrx/pliny))
- Tags
- Dark mode (+ switcher)
- Math (MathJax / KaTeX)
- Comments ([giscus](https://github.com/giscus/giscus), Disqus, [pliny](https://github.com/timlrx/pliny))
- Analytics (Google/Plausible/Simple/Umami Analytics, Posthog, Microsoft Clarity; see: [pliny](https://github.com/timlrx/pliny))
- TOC (with spying / highlighting active section) ([TocBot](https://github.com/tscanlin/tocbot))
- Read time estimation
- Citation / Bibliography / Referencing ([rehype-citation (has tooltip)](https://github.com/timlrx/rehype-citation))
  - With card on mouseover / tooltip / popover
  - Alternative: Markdown Footnotes (see: [1](https://astro-micro.vercel.app/blog/04-markdown-syntax#footnotes))
- Syntax highlighting ([highlight.js](https://github.com/highlightjs/highlight.js), [PrismJS](https://github.com/PrismJS/prism/), [bright](https://github.com/code-hike/bright), [shiki](https://github.com/shikijs/shiki), [shiki-magic-move](https://github.com/shikijs/shiki-magic-move))
- Multiple post templates (1/2 column(s), w(/o) banner/katex/citation, coding/science)
- (Headless) CMS ([tinaCMS](https://github.com/tinacms/tinacms), [directus](https://github.com/directus/directus))
- Components
  - Article Banner
  - Colored box
  - Block with Caption (e.g. figure with caption, or card with card footer [1](https://flyonui.com/docs/components/card/))
    - html supports [`<figure><figcaption>`](https://www.w3schools.com/tags/tag_figcaption.asp)
      and [`<table><caption>`](https://www.w3schools.com/tags/tag_caption.asp)
      (see: [1](https://github.com/SimeonAT/simeonat.github.io/blob/0ea6897439bf0acd03d09bfe368e6911f1e62eec/src/content/blog/esp32-energy/index.mdx?plain=1#L36-L41))
  - Show/Edit on GitHub
  - Callout components
  - Bleed (use 95-100% screen width) (see: [pliny](https://github.com/timlrx/pliny))
- Lighthouse score
- Responsive design (mobile)
- Image optimization
- minify HTML/CSS/JS
- CSS
  - Inline code & equations with grey background color

### Components / UI Frameworks

see: [awesome-tailwindcss](https://github.com/aniftyco/awesome-tailwindcss)

Legend: 📚 UI library 🧩 Copy-pastable component

- [Headless UI](https://github.com/tailwindlabs/headlessui)
  📚
  <a href="https://github.com/tailwindlabs/headlessui"><img src="https://badgen.net/github/stars/tailwindlabs/headlessui" alt="GitHub Stars"/></a>
  <a href="https://github.com/tailwindlabs/headlessui"><img src="https://badgen.net/github/last-commit/tailwindlabs/headlessui" alt="Last Commit"/></a>
  from tailwind
  100% free 💸
  Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
- [shadcn UI](https://github.com/shadcn-ui/ui)
  🧩
  <a href="https://github.com/shadcn-ui/ui"><img src="https://badgen.net/github/stars/shadcn-ui/ui" alt="GitHub Stars"/></a>
  <a href="https://github.com/shadcn-ui/ui"><img src="https://badgen.net/github/last-commit/shadcn-ui/ui" alt="Last Commit"/></a>
  100% free 💸
  AI ready
  [Awesome list](https://github.com/birobirobiro/awesome-shadcn-ui)
- [theme-ui](https://github.com/system-ui/theme-ui)
  (📚)
  <a href="https://github.com/system-ui/theme-ui"><img src="https://badgen.net/github/stars/system-ui/theme-ui" alt="GitHub Stars"/></a>
  <a href="https://github.com/system-ui/theme-ui"><img src="https://badgen.net/github/last-commit/system-ui/theme-ui" alt="Last Commit"/></a>
  Build consistent, themeable React apps based on constraint-based design principles
  (integrates with tailwind, typography.js, prism & mdx)
- [flowbite](https://github.com/themesberg/flowbite)
  📚
  <a href="https://github.com/themesberg/flowbite"><img src="https://badgen.net/github/stars/themesberg/flowbite" alt="GitHub Stars"/></a>
  <a href="https://github.com/themesberg/flowbite"><img src="https://badgen.net/github/last-commit/themesberg/flowbite" alt="Last Commit"/></a>
  some of the Blocks are free
- [TW Elements](https://github.com/mdbootstrap/TW-Elements/)
  (🧩)
  <a href="https://github.com/mdbootstrap/TW-Elements/"><img src="https://badgen.net/github/stars/mdbootstrap/TW-Elements" alt="GitHub Stars"/></a>
  <a href="https://github.com/mdbootstrap/TW-Elements/"><img src="https://badgen.net/github/last-commit/mdbootstrap/TW-Elements" alt="Last Commit"/></a>
  some of the components are free (e.g. [chips 🔒](https://tw-elements.com/docs/standard/components/chips/) is not free)
- [daisyUI](https://github.com/saadeghi/daisyui)
  📚
  <a href="https://github.com/saadeghi/daisyui"><img src="https://badgen.net/github/stars/saadeghi/daisyui" alt="GitHub Stars"/></a>
  <a href="https://github.com/saadeghi/daisyui"><img src="https://badgen.net/github/last-commit/saadeghi/daisyui" alt="Last Commit"/></a>
  100% free 💸
  [61 Components](https://daisyui.com/components/)
  [Theme Generator](https://daisyui.com/theme-generator/)
- [FlyonUI](https://github.com/themeselection/flyonui)
  (🧩)
  <a href="https://github.com/themeselection/flyonui"><img src="https://badgen.net/github/stars/themeselection/flyonui" alt="GitHub Stars"/></a>
  <a href="https://github.com/themeselection/flyonui"><img src="https://badgen.net/github/last-commit/themeselection/flyonui" alt="Last Commit"/></a>
- [Preline UI](https://github.com/htmlstreamofficial/preline)
  📚
  <a href="https://github.com/htmlstreamofficial/preline"><img src="https://badgen.net/github/stars/htmlstreamofficial/preline" alt="GitHub Stars"/></a>
  <a href="https://github.com/htmlstreamofficial/preline"><img src="https://badgen.net/github/last-commit/htmlstreamofficial/preline" alt="Last Commit"/></a>
- [Meraki UI](https://github.com/merakiuilabs/merakiui)
  🧩
  <a href="https://github.com/merakiuilabs/merakiui"><img src="https://badgen.net/github/stars/merakiuilabs/merakiui" alt="GitHub Stars"/></a>
  <a href="https://github.com/merakiuilabs/merakiui"><img src="https://badgen.net/github/last-commit/merakiuilabs/merakiui" alt="Last Commit"/></a>
  100% free 💸
  [Components Gallery](https://merakiui.com/components)
- [HyperUI](https://github.com/markmead/hyperui)
  🧩
  <a href="https://github.com/markmead/hyperui"><img src="https://badgen.net/github/stars/markmead/hyperui" alt="GitHub Stars"/></a>
  <a href="https://github.com/markmead/hyperui"><img src="https://badgen.net/github/last-commit/markmead/hyperui" alt="Last Commit"/></a>
  100% free 💸
- [Radix UI](https://github.com/radix-ui/themes)
  (🧩)
  <a href="https://github.com/radix-ui/themes"><img src="https://badgen.net/github/stars/radix-ui/themes" alt="GitHub Stars"/></a>
  <a href="https://github.com/radix-ui/themes"><img src="https://badgen.net/github/last-commit/radix-ui/themes" alt="Last Commit"/></a>
  100% free 💸
- [Pines UI](https://github.com/thedevdojo/pines)
  🧩
  <a href="https://github.com/thedevdojo/pines"><img src="https://badgen.net/github/stars/thedevdojo/pines" alt="GitHub Stars"/></a>
  <a href="https://github.com/thedevdojo/pines"><img src="https://badgen.net/github/last-commit/thedevdojo/pines" alt="Last Commit"/></a>
  100% free 💸

## Blog inspirations

### With TOC

- https://cybersprout.net/toc-table-of-contents-blog-posts/
- https://ahrefs.com/blog/de/suchmaschinenmarketing/
- https://mangools.com/blog/google-rich-snippets-guide/
- https://www.investopedia.com/articles/mortgages-real-estate/08/flipping-flip-properties.asp
- https://showcased.webflow.io/projects/CMS-Table-of-Contents
- https://showcased.webflow.io/projects/blog-outline-cloneable, 100 Lighthouse), search
- https://github.com/cotes2020/jekyll-theme-chirpy (TOC, Disqus, search, analytics, SEO, math, )

### Astro

- Lists
  - [Astro Templates (Official)](https://astro.build/themes/1/?search=&technology%5B%5D=mdx&price%5B%5D=free)
  - [Built at Lightspeed (Astro + shadcn UI + free)](https://www.builtatlightspeed.com/?themes%5BrefinementList%5D%5Bcategories.ssg%5D%5B0%5D=astro&themes%5BrefinementList%5D%5Bcategories.ui%5D%5B0%5D=shadcn-ui&themes%5BrefinementList%5D%5Bdistribution%5D%5B0%5D=free&themes%5BrefinementList%5D%5Bdistribution%5D%5B1%5D=open-source)
- https://astro.build/themes/details/openblog/ [:octocat:](https://github.com/danielcgilibert/blog-template)
  - https://github.com/danielcgilibert/blog-template (TinaCMS, TOC, 100 Lighthouse, Disqus)
  - https://github.com/gaomingzhao666/nano-blog Fork with Giscus
- https://astro.build/themes/details/astro-micro/ [:octocat:](https://github.com/trevortylerlee/astro-micro)
- https://github.com/jktrn/astro-erudite (TOC)
- https://github.com/devaradise/devolio (TOC, Giscus, 100 Lighthouse)
- https://github.com/zhangyu1818/blog (TOC, Giscus, write posts in GitHub Discussions)
- https://github.com/mearashadowfax/ScrewFast (TOC, Preline UI)
- https://github.com/saicaca/fuwari (TOC, pretty!, not portrait mode friendly)
  - clone?! https://github.com/WhitePaper233/yukina
- https://github.com/EFEELE/NeonMint (TOC)
- https://github.com/louisescher/spectre (TOC, Giscus, 100 Lighthouse, search)
- https://github.com/cworld1/astro-theme-pure (TOC (mobile collapsed), 100 Lighthouse, search)
  - https://github.com/CatCodeMe/catcodeme.github.io Fork with giscus, vercount, innerLinkPreview, wikilink [1](https://github.com/cworld1/astro-theme-pure/issues/10#issuecomment-3067575345)
- https://github.com/cirry/astro-yi (TOC, Giscus, math)
- https://github.com/FjellOverflow/nordlys (TOC, 100 Lighthouse)
- https://github.com/EveSunMaple/Frosti (TOC, daisyUI)
