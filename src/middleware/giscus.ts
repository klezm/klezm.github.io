import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
  const { id, entry } = context.locals.starlightRoute;
  const isBlog = id.startsWith('blog/');

  if (entry.data.giscus === undefined) {
    entry.data.giscus = isBlog;
  }
});
