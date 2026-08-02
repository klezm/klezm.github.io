import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * The site is blog-only, so there is no page hierarchy for a sidebar to
 * navigate and every route renders full width.
 *
 * This is done by flipping `hasSidebar` rather than hiding the sidebar with
 * CSS: `display: none` would leave the reserved layout column behind and the
 * content would not expand to fill it.
 */
export const onRequest = defineRouteMiddleware((context) => {
  context.locals.starlightRoute.hasSidebar = false;
});
