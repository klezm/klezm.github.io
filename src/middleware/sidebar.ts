import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * This is a blog, not a documentation site: there is no page hierarchy for a
 * sidebar to navigate, so every route renders full width.
 *
 * Done by flipping `hasSidebar` rather than hiding the sidebar with CSS —
 * `display: none` would leave the reserved layout column behind and the
 * content would not expand into it.
 *
 * Knock-on effect: Starlight only renders its mobile menu button when
 * `hasSidebar` is true, and that menu is where starlight-blog puts its mobile
 * nav link. `src/components/override/Footer.astro` carries a nav row instead.
 */
export const onRequest = defineRouteMiddleware((context) => {
  context.locals.starlightRoute.hasSidebar = false;
});
