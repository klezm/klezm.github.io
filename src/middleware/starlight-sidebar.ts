import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * This site is blog-only — there is no documentation tree to navigate, so the
 * sidebar is turned off everywhere.
 *
 * This must be done through route data, NOT with CSS. Hiding the sidebar with
 * `display: none` leaves its reserved grid column behind and the content never
 * expands to fill the space.
 *
 * Consequence: Starlight's `PageFrame` only renders `MobileMenuToggle` when
 * `hasSidebar` is true, and that toggle is where starlight-blog puts its mobile
 * navigation link. The Footer override carries a nav row to compensate.
 */
export const onRequest = defineRouteMiddleware((context) => {
  context.locals.starlightRoute.hasSidebar = false;
});
