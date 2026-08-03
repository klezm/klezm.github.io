import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * Restrict comments to actual blog posts.
 *
 * starlight-giscus defaults to `entry.data.giscus ?? true`, i.e. comments on
 * every page — homepage, tag listings and author pages included. This narrows
 * that to real posts unless a post opts out with `giscus: false`.
 *
 * Checking the `blog/` prefix alone is not enough: starlight-blog generates its
 * tag, author and post-list routes under that same prefix, so `id` matches them
 * too. Those virtual entries have no `date`, which is the reliable
 * discriminator for "this is an actual post".
 */
export const onRequest = defineRouteMiddleware((context) => {
  const { entry } = context.locals.starlightRoute;

  const isPost =
    entry.id.startsWith('blog/') &&
    Boolean((entry.data as { date?: Date }).date);

  if (!isPost) {
    (entry.data as { giscus?: boolean }).giscus = false;
  }
});
