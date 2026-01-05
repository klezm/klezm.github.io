---
trigger: model_decision
description: Key memories
---

# 🧠 Memories & Best Practices

## Sidebar

- **Starlight Sidebar Customization**:
  - **Avoid** overriding the `Sidebar` component or using CSS hacks (`display: none`) to hide the sidebar, as this leaves reserved layout space.
  - **Prefer** using Starlight Middleware (`routeMiddleware`) to modify `context.locals.starlightRoute.hasSidebar` to `false`. This cleanly adjusts the layout prop `hasSidebar` used by `StarlightPage`, ensuring the main content expands correctly.
  - **Registration**: Ensure middleware is registered in `astro.config.mjs` under `starlight({ routeMiddleware: [...] })`.
- **Content Configuration**:
  - Use `src/content.config.ts` (Astro 5 standard) instead of `src/content/config.ts`.
  - Extend Starlight schemas via the `extend` callback in `docsSchema`.

## Blog Post Layouts

- **Blog Post Layouts (Full-Bleed)**:
  - Override `ContentPanel.astro` to wrap content in a custom class (e.g., `.blog-content-wrapper`).
  - Use CSS Grid on `.sl-markdown-content` to constrain text (e.g., `min(65ch, 100%)`) while allowing specific children (tables, code, media) to span `1 / -1`.
- **Table Styling**:
  - For balanced tables in full-width layouts, use `width: fit-content`, `max-width: 100%`, and `margin-inline: auto` instead of forcing 100% width.
  - Constrain prose columns with `td { max-width: 50ch; white-space: normal; }` to ensure comfortable wrapping and prevent excessive stretching.
- **Component Styling**:
  - Prefer reusable Astro components (e.g., `<ContentCard>`) over ad-hoc `div` wrappers for complex layout features like full-bleed, stacking, or captions.

## ContentCard

- **Dependencies**: Avoid adding new dependencies (like parsers) for simple tasks. Prefer robust string manipulation or standard API features.
- **ContentCard & Component Patterns**:
  - **Terminology**: Prefer specific names like "Card" over generic ones like "Box".
  - **Slot Parsing**: `Astro.slots.render('default')` combined with string checking (e.g., `endsWith('</sub>')`) is a valid strategy for "extracting" trailing metadata/captions without heavy AST parsing.
  - **Styling Preference**:
    - **Bleed**: Full-width "bleed" layouts are often preferred default (`bleed=true`).
    - **Captions**: Differentiate captions with distinct background colors rather than borders/hr lines. Ensure tight spacing between content and caption.
    - **Layout**: Support configurable stacking directions (horizontal/vertical) for internal content.
- **Responsiveness**:
  - **Mobile First**: Default to vertical stacks on mobile; switch to horizontal on larger screens (e.g., via `@media (min-width: 40rem)`).
  - **Prose Width**: Constrain text width in horizontal layouts (e.g., `50ch`) to match common table/prose constraints, but allow full width on mobile/vertical stacks.

## Maintenance & Deprecations

- **Astro/Starlight Deprecations**:
  - **Props**: `import type { Props } from '@astrojs/starlight/props'` is deprecated. Use `import type { StarlightRouteData as Props } from '@astrojs/starlight/route-data'` instead.
  - **Slug**: `starlightRoute.slug` is deprecated. Use `starlightRoute.id` instead.

## Giscus

- **Giscus Integration**:
  - **Restrict to Blog Posts**: Use Starlight Middleware (`routeMiddleware`) to conditionally enable Giscus.
  - **Implementation**:
    - Check if `context.locals.starlightRoute.id` starts with `blog/`.
    - Modify `context.locals.starlightRoute.entry.data.giscus` directly.
  - **Configuration**: Ensure the middleware is registered in `astro.config.mjs` *after* any other middleware that might depend on it, or simply in the execution order.
