// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import starlightBlog from 'starlight-blog';
import starlightGiscus from 'starlight-giscus';
import starlightLinksValidator from 'starlight-links-validator';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import { rehypeCitationFrontmatter } from './src/plugins/rehype-citation-frontmatter.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://klezm.github.io',
  integrations: [
    starlight({
      title: "klezm's blog",
      description:
        'A personal blog about computer science, programming and things worth writing down.',
      /*
       * Override budget. Starlight plugins claim component overrides too, and
       * when two want the same one the loser is SILENT — it warns and skips.
       * Watch the build log for "It looks like you already have a X component
       * override".
       *
       * Claimed elsewhere and deliberately left alone here:
       *   SiteTitle  -> starlight-blog (navigation: 'header-start')
       *   Pagination -> starlight-giscus
       *   ThemeSelect-> nobody; see the note on `navigation` below.
       */
      components: {
        MarkdownContent: './src/components/override/MarkdownContent.astro',
        Footer: './src/components/override/Footer.astro',
        Head: './src/components/override/Head.astro',
      },
      plugins: [
        starlightBlog({
          title: 'Blog',
          authors: {
            klezm: {
              name: 'klezm',
              url: 'https://github.com/klezm',
            },
          },
          metrics: {
            readingTime: true,
            words: 'rounded',
          },
          /*
           * The default is 'header-end', which makes starlight-blog claim the
           * ThemeSelect slot — and when that happens the blog nav link is
           * silently dropped. 'header-start' overrides SiteTitle instead, which
           * nothing else here touches.
           *
           * Leaving ThemeSelect stock matters for a second reason:
           * starlight-giscus re-themes its comment iframe by listening for a
           * `change` event on <starlight-theme-select>. Starlight's stock
           * control is a <select>, which bubbles that event for free. A custom
           * <button> toggle would have to dispatch it by hand or comments
           * silently ignore the theme.
           */
          navigation: 'header-start',
        }),
        starlightGiscus({
          repo: 'klezm/klezm.github.io',
          repoId: 'MDEwOlJlcG9zaXRvcnkyOTQwMjgyNDI=',
          category: 'Blog Comment',
          categoryId: 'DIC_kwDOEYaD0s4Ck5JR',
          mapping: 'pathname',
          theme: {
            light: 'light',
            dark: 'transparent_dark',
            auto: 'preferred_color_scheme',
          },
          // Keep the comment iframe off the critical path.
          lazy: true,
        }),
        /*
         * Fails the build on dead internal links and stale heading anchors.
         * Gated behind an env var so it does not interrupt local authoring,
         * where half-written links are normal. CI and deploys set CHECK_LINKS.
         */
        ...(process.env.CHECK_LINKS
          ? [
              starlightLinksValidator({
                errorOnInvalidHashes: true,
                // starlight-blog generates these routes itself, so they are not
                // content entries and the validator cannot resolve them.
                exclude: ['/blog/', '/blog/**', '/blog/rss.xml'],
              }),
            ]
          : []),
      ],
      routeMiddleware: [
        './src/middleware/starlight-sidebar.ts',
        './src/middleware/giscus.ts',
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/klezm' },
      ],
      // global.css must be first: it declares the cascade layer order that
      // every later stylesheet depends on.
      customCss: ['./src/styles/global.css', './src/styles/katex.css'],
      lastUpdated: true,
      // h4-h6 makes the table of contents unusable on long posts.
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
    }),
  ],
  markdown: {
    /*
     * Astro 7 defaults to the Sätteri processor, which has NO math support and
     * no equivalent plugin. KaTeX requires the remark/rehype pipeline, so opt
     * back into unified explicitly.
     *
     * Every plugin below is registered as `[plugin, options]` or as a bare
     * reference — never `plugin(options)`. Passing the invoked result makes
     * unified treat the transformer as an attacher: it runs once with
     * `tree === undefined` and then never touches any content, silently.
     *
     * `remarkDirective` stays registered so `:::` syntax is available to
     * directive-consuming plugins.
     */
    processor: unified({
      remarkPlugins: [remarkMath, remarkDirective],
      rehypePlugins: [
        rehypeKatex,
        // Opt in per post via the `bibliography` frontmatter key.
        [rehypeCitationFrontmatter, { csl: 'apa', linkCitations: true }],
      ],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
