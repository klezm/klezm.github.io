import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

// One card per real blog post. Drafts and the generated tag/author/list routes
// (which have no `date`) are excluded.
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
    // Vendored locally: the default is fetched from api.fontsource.org at
    // build time, which breaks offline/sandboxed builds and puts someone
    // else's CDN in the deploy path. See src/fonts/README.md.
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
