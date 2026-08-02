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
import starlightMarkdownBlocks, { Aside } from 'starlight-markdown-blocks';
import starlightKbd from 'starlight-kbd';
import starlightLinksValidator from 'starlight-links-validator';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import { rehypeCitationFrontmatter } from './src/plugins/rehype-citation-frontmatter.js';

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
        Head: './src/components/override/Head.astro',
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
          mapping: 'pathname',
          theme: {
            light: 'light',
            dark: 'transparent_dark',
            auto: 'preferred_color_scheme',
          },
          // Keep the comment iframe off the critical path.
          lazy: true,
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
        // Custom `:::` blocks. Deliberately NOT remark-directive-rehype: that
        // is a blanket directive->element transform and, since user plugins run
        // ahead of Starlight's own, it would consume `:::note` and friends
        // before Starlight's aside transformer ever saw them.
        starlightMarkdownBlocks({
          blocks: {
            idea: Aside({ label: 'Idea', icon: '💡', color: 'purple' }),
            proof: Aside({ label: 'Proof', icon: '📐', color: 'green' }),
          },
        }),
        starlightKbd({
          // Leaving this at its `true` default would override ThemeSelect and
          // replace the custom theme toggle with the keyboard-type picker.
          globalPicker: false,
          types: [
            { id: 'mac', label: 'macOS', detector: 'apple' },
            { id: 'linux', label: 'Linux/Windows', default: true },
          ],
        }),
        // Fails the build on dead internal links and stale heading anchors.
        // Gated behind an env var so it does not interrupt local authoring,
        // where half-written links are normal; CI and deploys set CHECK_LINKS.
        ...(process.env.CHECK_LINKS
          ? [
              starlightLinksValidator({
                errorOnInvalidHashes: true,
                // starlight-blog generates these routes itself, so they are not
                // content entries and the validator cannot see them.
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
