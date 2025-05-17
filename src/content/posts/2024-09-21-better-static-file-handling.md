---
title: Better Static File Handling
description: In which I recount how I made my website redeploys Slightly Faster by serving images from a dedicated static domain, instead of including them inside my git repository.
tags: Web, Astro
---

For a while now, I've had a [photography](/photography.html) page on my blog. When I made it, I wasn't thinking too hard and just followed along with the Astro Image guide which said "put ur images somewhere in `src/` and `import` them". One thing led to another, and I ended up with ~800MiB of data in my git repository. :P

To be clear, git can handle this much data w/o much stress. GitHub gets a little bit sad on the upload, but hey, at least that only happens once, right? But consider: the GitHub Action to deploy my site needs to download the repo in order to run. So _every run_, it was downloading ~800MiB, only to restore what it needed from a cache anyways. It got so bad, this repo download step was _half the build time_ when caches were warm.

Needless to say, I can do better. So I did! All large static assets are now served from `static.duvallj.pw`, and I've rebased by git history to remove all the large objects. Astro is quite smart; it supports loading images from remote URLs while still putting optimized versions in its cache, w/ TTLs reflecting that returned by the `Cache-Control` header.

I _think_ this, plus caching `node_modules`, will be enough to put me under 30s for full site rebuilds. Which is pretty solid! That's as far as I can realistically push it w/ Astro, because it does need to rebuild the entire site every time. Thinking about building my own CMS, but that's a project for another day...
