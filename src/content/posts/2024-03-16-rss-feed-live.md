---
title: "RSS Feed Is Live"
description: "I announce that my blog now has an RSS Feed! Again. After the one that came with Hakyll was removed and I had to add back in one for Astro."
tags: Web, RSS, Astro
---

My blog now has an [RSS Feed](https://blog.duvallj.pw/rss.xml)!. Again. After the one that came with Hakyll got removed in [the upgrade to Astro](/posts/2023-10-22-new-blog-framework.html), and I had to update to [@astrojs/rss](https://docs.astro.build/en/guides/rss/). I also:

- ditched my old janky globbing setup and switched to using [Astro content collections](https://docs.astro.build/en/tutorials/add-content-collections/)
- minimized my CSS massively (by hand! wordpress theme was bloated for what I'm doing with it)
- removed all custom fonts (it's using your system `serif` and `monospace` fonts now)
- fixed the caching in Github Actions so now it won't have to regenerate all my images every time I push.

All in all, very productive blog work! but boy is it late at night now whoops.
