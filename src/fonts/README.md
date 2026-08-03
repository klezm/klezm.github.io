# Fonts

Liberation Sans, vendored so that Open Graph card generation
(`src/pages/og/[...route].ts`) has no build-time network dependency.

`astro-og-canvas` otherwise downloads its default font from
`api.fontsource.org` on every cold build, which fails in sandboxed or offline
environments and puts someone else's CDN in the deploy path.

These files are used only at build time to rasterise the card images. They are
never served to browsers, so they do not affect page weight.

**License:** SIL Open Font License 1.1 — see
<https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE>.
