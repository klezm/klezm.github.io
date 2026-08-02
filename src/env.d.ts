interface Window {
  /**
   * Injected as a global by Starlight's `ThemeProvider.astro` before hydration
   * so theme pickers can be synced without a flash of the wrong theme.
   */
  StarlightThemeProvider?: {
    updatePickers(theme?: string): void;
  };
}
