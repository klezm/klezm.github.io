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
          /** Suppress the rendered page title (and the panel holding it). */
          hide_title: z.boolean().optional(),
          /** Opt a page in or out of Giscus comments. Defaults to on for blog posts. */
          giscus: z.boolean().optional(),
        }),
    }),
  }),
};
