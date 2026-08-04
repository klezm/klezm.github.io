import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: (context) =>
        blogSchema(context).extend({
          /** Opt a page in or out of comments. Defaults to on for blog posts. */
          giscus: z.boolean().optional(),
          /**
           * Path to a BibTeX / CSL-JSON file, relative to the post. Presence of
           * this key is what enables `[@citekey]` citations for the page.
           */
          bibliography: z.string().optional(),
        }),
    }),
  }),
};
