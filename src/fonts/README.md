# Fonts

Liberation Sans, vendored here so that Open Graph card generation
(`src/pages/og/[...route].ts`) has no build-time network dependency.

`astro-og-canvas` otherwise downloads its default font from
`api.fontsource.org` on every cold build, which makes builds fail in any
sandboxed or offline environment and adds an outage in someone else's CDN to
the list of things that can break a deploy.

These files are used only at build time to rasterise the card images. They are
never served to browsers, so they do not affect page weight.

**License:** SIL Open Font License 1.1 — see
<https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE>.
