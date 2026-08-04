import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

// One card per real blog post. Drafts, and the tag/author/list routes
// starlight-blog generates under the same prefix (which carry no date), are
// excluded. `src/components/override/Head.astro` applies the same condition —
// the two must agree or pages advertise images that were never built.
const posts = await getCollection(
  'docs',
  ({ id, data }) => id.startsWith('blog/') && !!data.date && !data.draft,
);

const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.title,
    description: page.excerpt ?? page.description ?? '',
    // Vendored locally — see src/fonts/README.md. Note this belongs in the
    // per-image options, not the route config.
    fonts: [
      './src/fonts/LiberationSans-Regular.ttf',
      './src/fonts/LiberationSans-Bold.ttf',
    ],
    bgGradient: [
      [24, 24, 27],
      [39, 39, 42],
    ],
    border: { color: [124, 58, 237], width: 20, side: 'inline-start' },
    padding: 60,
    font: {
      title: { size: 62, weight: 'Bold', color: [255, 255, 255] },
      description: { size: 30, lineHeight: 1.4, color: [180, 180, 190] },
    },
  }),
});
