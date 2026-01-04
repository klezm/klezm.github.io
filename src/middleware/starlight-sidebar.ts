import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
  const { slug, entry } = context.locals.starlightRoute;
  const isBlog = slug === 'blog' || slug.startsWith('blog/');
  const showSidebar =
    entry.data.show_sidebar === true && entry.data.template !== 'splash';
  // Change the sidebar visibility for blog posts or if show_sidebar is set in the frontmatter
  const setSidebarVisibility = isBlog || entry.data.show_sidebar !== undefined;

  if (setSidebarVisibility) {
    context.locals.starlightRoute.hasSidebar =
      (isBlog && showSidebar) || showSidebar;
  }
});
