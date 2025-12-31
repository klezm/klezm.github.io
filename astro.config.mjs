// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import starlightBlog from 'starlight-blog';
import starlightGiscus from 'starlight-giscus';
import starlightGitHubAlerts from 'starlight-github-alerts';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';

// https://astro.build/config
export default defineConfig({
	site: 'https://klezm.github.io',
	integrations: [
		starlight({
			title: "klezm's blog",
			description: "Welcome to my personal blog! I'm a computer science student writing about my experience.",
			components: {
				ThemeSelect: './src/components/override/ThemeSelect.astro',
			},
			plugins: [
				starlightBlog({
					title: "klezm's blog",
					authors: {
						klezm: {
							name: 'klezm',
						},
					},
					metrics: {
						readingTime: true,
					}
				}),
				starlightGiscus({
					repo: 'klezm/klezm.github.io',
					repoId: 'MDEwOlJlcG9zaXRvcnkyOTQwMjgyNDI=',
					category: 'Blog Comment',
					categoryId: 'DIC_kwDOEYaD0s4Ck5JR',
				}),
				starlightGitHubAlerts(),
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/klezm' },
			],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
			customCss: [
				'./src/styles/global.css',
				'./src/styles/katex.css',
			],
		}),
	],
	markdown: {
		remarkPlugins: [remarkMath, remarkDirective],
		rehypePlugins: [rehypeKatex],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
