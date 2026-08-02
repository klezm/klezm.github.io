declare namespace App {
  interface Locals {
    /**
     * Counter used by `src/components/override/ContentPanel.astro` to identify
     * the first content panel on a page, which is the one holding the page
     * title. Starlight renders several `<ContentPanel>` instances per route and
     * exposes no index, so the override tracks its own.
     */
    _cpCount?: number;
  }
}

interface Window {
  /**
   * Injected as a global by Starlight's `ThemeProvider.astro` before hydration
   * so theme pickers can be synced without a flash of the wrong theme.
   */
  StarlightThemeProvider?: {
    updatePickers(theme?: string): void;
  };
}
