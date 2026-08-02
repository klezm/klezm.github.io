// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import starlightBlog from 'starlight-blog';
import starlightGiscus from 'starlight-giscus';
import starlightGitHubAlerts from 'starlight-github-alerts';
import starlightImageZoom from 'starlight-image-zoom';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightHeadingBadges from 'starlight-heading-badges';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';

// https://astro.build/config
export default defineConfig({
  site: 'https://klezm.github.io',
  integrations: [
    starlight({
      title: "klezm's blog",
      description:
        'A personal blog about computer science, programming, and tech experiences.',
      components: {
        ThemeSelect: './src/components/override/ThemeSelect.astro',
        MarkdownContent: './src/components/override/MarkdownContent.astro',
        Footer: './src/components/override/Footer.astro',
        Hero: './src/components/override/Hero.astro',
      },
      plugins: [
        starlightBlog({
          title: 'Blog',
          authors: {
            klezm: {
              name: 'klezm',
            },
          },
          metrics: {
            readingTime: true,
            words: 'rounded',
          },
          // 'header-end' would make starlight-blog override ThemeSelect, which
          // this site already overrides with its own toggle — the nav link is
          // silently dropped in that case. 'header-start' overrides SiteTitle
          // instead, which is untouched here.
          navigation: 'header-start',
        }),
        starlightGiscus({
          repo: 'klezm/klezm.github.io',
          repoId: 'MDEwOlJlcG9zaXRvcnkyOTQwMjgyNDI=',
          category: 'Blog Comment',
          categoryId: 'DIC_kwDOEYaD0s4Ck5JR',
        }),
        starlightGitHubAlerts(),
        starlightImageZoom({ showCaptions: true }),
        starlightScrollToTop({
          // The progress ring doubles as the reading-progress indicator.
          showProgressRing: true,
          progressRingColor: 'var(--sl-color-text-accent)',
          showTooltip: true,
          showOnHomepage: false,
        }),
        starlightHeadingBadges(),
      ],
      routeMiddleware: [
        './src/middleware/starlight-sidebar.ts',
        './src/middleware/giscus.ts',
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/klezm' },
      ],
      customCss: ['./src/styles/global.css', './src/styles/katex.css'],
      lastUpdated: true,
      // h4-h6 made the table of contents unusable on long posts; the
      // type-unification post alone contributed dozens of entries.
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
    }),
  ],
  markdown: {
    // Astro 7 defaults to the Sätteri processor, which has no math support.
    // KaTeX requires the remark/rehype pipeline, so opt back into it explicitly.
    // `remarkDirective` must stay registered: starlight-github-alerts splices
    // itself in ahead of it and silently no-ops if it is missing.
    processor: unified({
      remarkPlugins: [remarkMath, remarkDirective],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
