// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';

import starlightBlog from 'starlight-blog';
import starlightGiscus from 'starlight-giscus';
import starlightGitHubAlerts from 'starlight-github-alerts';
import starlightHeadingBadges from 'starlight-heading-badges';
import starlightImageZoom from 'starlight-image-zoom';
import starlightKbd from 'starlight-kbd';
import starlightLinksValidator from 'starlight-links-validator';
import starlightMarkdownBlocks, { Aside } from 'starlight-markdown-blocks';
import starlightScrollToTop from 'starlight-scroll-to-top';

import { rehypeCitationFrontmatter } from './src/plugins/rehype-citation-frontmatter.js';

const site = 'https://klezm.github.io';

// https://astro.build/config
export default defineConfig({
  site,

  integrations: [
    starlight({
      title: "klezm's blog",
      description:
        'A personal blog about computer science, programming, and tech experiences.',
      lastUpdated: true,
      favicon: '/favicon.svg',

      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/klezm' },
      ],

      // Own these rather than let plugins claim them. See the collision notes
      // in .github/copilot-instructions.md — when two plugins want the same
      // component, the loser fails silently.
      components: {
        ThemeSelect: './src/components/override/ThemeSelect.astro',
        MarkdownContent: './src/components/override/MarkdownContent.astro',
        Head: './src/components/override/Head.astro',
        Footer: './src/components/override/Footer.astro',
        Hero: './src/components/override/Hero.astro',
      },

      routeMiddleware: [
        './src/middleware/sidebar.ts',
        './src/middleware/giscus.ts',
      ],

      // h4-h6 make the table of contents unusable on long, maths-heavy posts.
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },

      customCss: [
        './src/styles/global.css',
        './src/styles/katex.css',
        './src/styles/katex-theme.css',
      ],

      plugins: [
        starlightBlog({
          title: 'Blog',
          authors: { klezm: { name: 'klezm', url: 'https://github.com/klezm' } },
          metrics: { readingTime: true, words: 'rounded' },
          // 'header-end' implements the nav link by overriding ThemeSelect,
          // which this site owns — the link would be silently dropped.
          // 'header-start' overrides SiteTitle, which is free.
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
          lazy: true,
        }),

        starlightGitHubAlerts(),
        starlightImageZoom({ showCaptions: true }),
        starlightHeadingBadges(),

        starlightScrollToTop({
          // Doubles as the reading-progress indicator.
          showProgressRing: true,
          progressRingColor: 'var(--sl-color-text-accent)',
          showTooltip: true,
          showOnHomepage: false,
        }),

        // Extends Starlight's `:::` aside syntax rather than competing with it.
        // Deliberately NOT remark-directive-rehype: user plugins run ahead of
        // Starlight's own, so a blanket directive transform would consume
        // `:::note` before Starlight's aside handler ever saw it.
        starlightMarkdownBlocks({
          blocks: {
            idea: Aside({ label: 'Idea', icon: '💡', color: 'purple' }),
            proof: Aside({ label: 'Proof', icon: '📐', color: 'green' }),
          },
        }),

        starlightKbd({
          // Default `true` overrides ThemeSelect and would replace the theme
          // toggle with a keyboard-type picker.
          globalPicker: false,
          types: [
            { id: 'mac', label: 'macOS', detector: 'apple' },
            { id: 'linux', label: 'Linux/Windows', default: true },
          ],
        }),

        // Dead-link and stale-anchor gate. Env-gated so half-written links do
        // not interrupt local authoring; CI and deploys set CHECK_LINKS.
        ...(process.env.CHECK_LINKS
          ? [
              starlightLinksValidator({
                errorOnInvalidHashes: true,
                // starlight-blog generates these itself, so they are not
                // content entries and the validator cannot see them.
                exclude: ['/blog/', '/blog/**'],
              }),
            ]
          : []),
      ],
    }),
  ],

  markdown: {
    // Astro 7 defaults to the Sätteri processor, which has no math support.
    // KaTeX needs remark/rehype, so opt back into the unified pipeline.
    // `remarkDirective` must stay registered: starlight-github-alerts splices
    // itself in ahead of it and silently no-ops when it is absent.
    processor: unified({
      remarkPlugins: [remarkMath, remarkDirective],
      rehypePlugins: [
        rehypeKatex,
        // Opt-in per post via the `bibliography` frontmatter key.
        [rehypeCitationFrontmatter, { csl: 'apa', linkCitations: true }],
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
