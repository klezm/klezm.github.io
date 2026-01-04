---
trigger: model_decision
description: Key memories
---

## 🧠 Memories & Best Practices

- **Starlight Sidebar Customization**:
  - **Avoid** overriding the `Sidebar` component or using CSS hacks (`display: none`) to hide the sidebar, as this leaves reserved layout space.
  - **Prefer** using Starlight Middleware (`routeMiddleware`) to modify `context.locals.starlightRoute.hasSidebar` to `false`. This cleanly adjusts the layout prop `hasSidebar` used by `StarlightPage`, ensuring the main content expands correctly.
  - **Registration**: Ensure middleware is registered in `astro.config.mjs` under `starlight({ routeMiddleware: [...] })`.
- **Content Configuration**:
  - Use `src/content.config.ts` (Astro 5 standard) instead of `src/content/config.ts`.
  - Extend Starlight schemas via the `extend` callback in `docsSchema`.
g
