---
title: Welcome
date: 2026-08-03
authors: [klezm]
tags: [meta]
excerpt: A new blog, built on Astro and Starlight with daisyUI for the component set.
---

This is the first post on a blog rebuilt from scratch on [Astro](https://astro.build)
and [Starlight](https://starlight.astro.build), with [daisyUI](https://daisyui.com)
providing the component vocabulary.

## Why Starlight for a blog

Starlight is a documentation theme, not a blog theme, which sounds like the wrong
starting point. In practice it arrives with most of what a technical blog needs
already solved and tested: full-text search via Pagefind, a table of contents
with scroll spy, a light/dark theme control that persists, sensible typography,
and a responsive layout that does not fall apart on a phone.

The blog-specific parts — post lists, tags, authors, RSS, reading time — come
from the `starlight-blog` plugin.

## Why daisyUI, carefully

daisyUI supplies components on top of Tailwind. The catch is that its class
names are unprefixed by default, and four of them (`toggle`, `dropdown`, `hero`,
`menu`) are also used internally by Starlight. Installed naively, daisyUI's
`.toggle` restyles Starlight's mobile table-of-contents button into a switch.

The fix is a one-line configuration: every daisyUI class here is prefixed with
`d-`, so `btn` is `d-btn` and nothing can collide.

## What's here

See the [kitchen sink](/blog/kitchen-sink/) post for a demonstration of every
component and content feature this site supports.
