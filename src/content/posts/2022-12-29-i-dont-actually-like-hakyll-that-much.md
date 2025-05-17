---
title: I Don't Actually Like Hakyll That Much
description: In which I detail some problems I've been having with the static site generator Hakyll, written in Haskell, that I've been using to generate this site for quite some time now.
tags: Web, Hakyll
---

Yeah, you heard me right. The static site generator I tried out on a whim so long ago and [struggled against for a while](/tags/Hakyll.html) isn't serving me that well. Let's go over why I'm fed up with it and how we can do better.

### The Good

So despite the complaining I'm going to do later in this blog post, Hakyll is honestly really nice. You probably get the best markdown engine anywhere, Pandoc, and for those that _really_ want to spice their text markup experience they have the flexibility to do so with custom plugins[^1] and whatnot. It's also really good at being flexible in _how_ you structure your site, once you write all the rules necessary for it.

### The Bad: Haskell

I have not invested nearly enough time into having a good Haskell setup. This could be partly due to the fact that "good Haskell setups" are hard to come by and require deep knowledge of build systems, mostly just found at large companies and even then it's likely in constant breakage[^2]. I had this on [Stack](https://docs.haskellstack.org/en/stable/), and have now moved to [Nix](https://github.com/Gabriella439/haskell-nix) in an attempt to get something that would be able to cache build artifacts for CI because _it takes a really long time to build everything from scratch_ even on my not-puny machine.

Neither of these are perfect solutions. I do however now have a language server and code formatter set up so the dev experience isn't as horrible as it was before and overall the language is kinda nice actually, it's just that

### The Ugly: Hakyll

As explained in some of my previous posts, Hakyll incremental rebuilds work via a pretty nifty dependency system. Unfortunately, tapping into that like I tried to do is _stupid hard_ so I wouldn't recommend it.

Full rebuilds are probably recommended anyways, because you'll need to do one every time you rebuild your `site` executable. Why would you need to rebuild your site executable you ask? Well, if any of the following happen:

- Adding a new page not already covered by a glob
- Adding/renaming "derived metadata" fields
  - That is, metadata not directly encoded into the file
- Adding a new template layer to a page/changing the name of a template
  - Template layers are effectively how you do "components", so these may change a lot depending on your style

Also, actually _doing_ components with Hakyll is a PITA. "Make an item with no route and then use a partially applied template to load those items from a `listField`" statements dreamed up by the utterly deranged[^3]. After having used [Astro](https://astro.build/) and [Svelte](https://svelte.dev/) for another project and getting past the initial Javascript apprehension I actually really like their model a lot more. When making a page you can just drill down on the components + loops put in-line with the markup, rather than bouncing between your content folder, template folder, and hakyll rules, having to rebuild every time you edit the latter.

### Will I Rewrite This Blog?

Maybe! I'll definitely be using Astro if I do. Astro still supports markdown and is fairly flexible in how it can be structured so I hope that a conversion wouldn't be too hard. I'd also like to not spend that much time on it and once this project is over I don't foresee Hakyll taking this much maintenance and frustration for a while again, so maybe later.

[^1]: I'm using one for $$\LaTeX$$ embedded as SVGs which in hindsight isn't the best idea of accessibility but carrying on

[^2]: Just like C/C++!

[^3]: This is actually what I'm doing for another page on this website that I'll make a post about soon.
