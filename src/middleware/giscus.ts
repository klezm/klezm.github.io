import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * Comments belong on blog posts, and only on blog posts.
 *
 * `starlight-giscus` renders comments wherever `entry.data.giscus` is not
 * explicitly `false`, so the default has to be narrowed. Matching the `blog/`
 * prefix alone is not enough: it also catches the post-list, tag and author
 * routes starlight-blog generates under that same prefix. Those virtual
 * entries have no `date`, which makes it a reliable discriminator for "this is
 * an actual post".
 */
export const onRequest = defineRouteMiddleware((context) => {
  const { id, entry } = context.locals.starlightRoute;

  if (entry.data.giscus === undefined) {
    entry.data.giscus = id.startsWith('blog/') && entry.data.date !== undefined;
  }
});
