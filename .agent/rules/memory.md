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

- **Page Metadata**:
  - **Last Updated**: To remove the "Last updated" footer timestamp from specific pages (e.g., homepage), set `lastUpdated: false` in the page frontmatter.

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

## Tailwind CSS v4 & daisyUI v5

- **Scoped Styles in Frameworks (Astro/Vue/Svelte)**:
  - When using component-scoped `<style>` blocks with Tailwind v4, you **MUST** include `@reference "/src/styles/global.css";` (adjusted for relative path) at the top of the style block.
  - This is required for `@apply` to access global theme variables, custom utilities, and plugins (like daisyUI). Without it, the build will fail with "unknown utility class" errors.
- **daisyUI Integration**:
  - Register in the global CSS file using `@plugin "daisyui";`.
- **Styling Strategy**:
  - **Mix Semantic & Utility**: Use semantic class names (e.g., `.card`) in HTML for readability. apply Tailwind utilities in the CSS block using `@apply`.
  - **CSS Variables**: Use standard CSS syntax for setting/using CSS variables (e.g., `color: var(--sl-color-gray-2);`) rather than trying to force everything into `@apply`, especially for Starlight theme variables.

## Design System & UI Improvements

- **Design System Implementation**:
  - **Theme**: Implemented custom daisyUI themes (light/dark) using `oklch` colors in `global.css`.
  - **Typography**: Enhanced typography with `text-wrap: balance` for headings and `pretty` for paragraphs.
  - **Link Styling**: Use `var(--sl-color-text-accent)` for links in dark mode to ensure readability. Explicitly remove underlines from tags (`.tag`) to keep the UI clean.
- **Component Refinements**:
  - **ContentCard**:
    - **Horizontal Stack**: Use `flex-direction: row` with `flex: 1` on children for robust horizontal layouts on desktop, defaulting to column on mobile.
    - **Dark Mode Background**: Use a distinct background color (e.g., `oklch(34% ...)` in dark mode) to differentiate cards from code blocks.
    - **Math Interactions**: Disable hover transitions (`pointer-events` or `transition: none`) on cards containing interactive or complex elements like KaTeX/MathJax to prevent jitter.
  - **BlogPostCard**:
    - **Icons**: Prefer unicode characters (e.g., `→`) over SVGs for simple indicators to simplify maintenance and color inheritance.
    - **Readability**: Ensure "Read more" links have sufficient contrast in all themes.
- **Hero Section**:
  - **Overlap Prevention**: Be mindful of absolute positioning or z-index stacking in hero elements that might overlap with standard flow content like titles.

## Component Patterns & Interaction

- **Stretched Link Pattern**:
  - To make an entire card clickable while allowing nested interactive elements (like tags):
    - **Container**: Set `position: relative` on the card container.
    - **Main Link**: Use a pseudo-element (`::after`) on the primary link (e.g., title) with `absolute`, `inset-0`, and `z-10` to cover the card.
    - **Nested Links**: Position nested links (tags, buttons) with `relative` and a higher z-index (`z-20`) to sit above the stretched overlay.
  - This avoids illegal nested `<a>` tags in HTML while providing a unified click area.

## Tailwind CSS v4 Syntax

- **Arbitrary Values with CSS Variables**:
  - **Syntax Change**: Prefer the shorthand syntax for using CSS variables in arbitrary values.
  - **Deprecated**: `border-[var(--my-var)]`
  - **Recommended**: `border-(--my-var)`
  - This applies to all utilities (`text-`, `bg-`, etc.) and aligns with Tailwind v4's evolved syntax.

## Mobile & Responsive Overrides

- **Component Overrides vs. CSS**:
  - **Theme Toggle on Mobile**: Instead of shadowing the entire `Header` component (which is fragile), use CSS overrides in `global.css` to force visibility of hidden elements.
    - Example: `@media (max-width: 50rem) { .header .right-group { display: flex !important; } }`
- **Tables of Contents (Mobile)**:
  - **Design Issues**: Be aware that global CSS resets (e.g., from Tailwind/daisyUI) can break Starlight's mobile TOC bar layout (e.g., squashed buttons, transparent backgrounds).
  - **Fix**: Explicitly restore flex behaviors (`display: flex !important`, `align-items: center`) and constrain icon sizes (`width: 1rem`) in `global.css` targeting `mobile-starlight-toc` elements.
