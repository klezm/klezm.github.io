---
title: A Draft Post
date: 2026-02-01
authors:
  - klezm
tags:
  - meta
excerpt: An unpublished post, kept in the repo to exercise the draft code path.
draft: true
---

This post has `draft: true` in its frontmatter.

Starlight still builds a page for it during `astro dev` and shows a draft
notice, but it is excluded from production builds, from the homepage post
grid, and from the blog index — which is exactly what the draft flag is for.

If this text ever shows up on the live site, the draft filter has regressed.
