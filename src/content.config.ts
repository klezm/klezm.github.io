import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';
// `z` re-exported from `astro:content` is deprecated; import it from astro/zod.
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      // starlight-blog already contributes `date`, `authors`, `tags`,
      // `excerpt`, `cover`, `featured` and `metrics`. Only add what it lacks.
      extend: (context) =>
        // `draft` is NOT declared here: Starlight's own docsSchema already
        // provides it and excludes drafts from production builds.
        blogSchema(context).extend({
          /**
           * Path to a BibTeX file, relative to `src/content/docs/`, enabling
           * `[@citekey]` citations in this post.
           */
          bibliography: z.string().optional(),
          /** Opt out of comments. Comments are on for posts by default. */
          giscus: z.boolean().optional(),
        }),
    }),
  }),
};
