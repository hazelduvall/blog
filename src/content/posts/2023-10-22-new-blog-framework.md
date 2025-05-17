---
title: "New Blog Framework: Astro"
description: "I explain the new static site generator I'm using for my blog, Astro, and why I'm using it over my old one, Hakyll."
tags: Web, Astro
---

[I was fed up with Hakyll](/posts/2022-12-29-i-dont-actually-like-hakyll-that-much.html), so I've switched my site to use a new blogging framework, [Astro](https://astro.build/).

The reasons for this are twofold:

## Hakyll Stank

I covered this in more detail in my last post, but the overall gist is that Hakyll deploys were way too slow for me. I spent a long time setting up Github Actions correctly, only for them to get no speedup in the average case because the cache entries expire in between the (very long) periods between my posts. I _could_ just

```bash
aws s3 sync --delete _site/ s3://blog.duvallj.pw/
```

every time I updated my site and just have everything locally since I'm running the preview server that automatically populates the build directory anyways, but gosh darn it I'm just unreasonably attached to CI. Main benefit: it lets me have "draft" posts by just not publishing them to git. (that's kind of it)

## Astro Is Nice

I tried it out for another website (that I made after this one) and really enjoyed it. Much easier to get set up than something like Hakyll for sure. Also more flexible than something like [Zola](https://www.getzola.org/), which I used for my [Rust Stuco Website](https://old-rust-stuco.duvallj.pw). My blog has gotten a bit complicated in places, what with the post links and the [Photography page](/photography.html), so having full componentized control over things is nice. Plus, I'm now even more used to thinking in the component model thanks to what I do for work (tho, I'm still not that good at it).

I did need quite a few hacks to get it to work tho. Biggest thing was doing the equivalent of [`Astro.glob`](https://docs.astro.build/en/guides/imports/#astroglob). The docs mention that you can use Vite's `import.meta.glob` instead, but don't really provide any examples. Lacking any examples on the internet, I stumbled my way around typescript to find the following solution:

```ts
// file:src/env.d.ts
// the order here is important! Astro's `import.meta.glob` typing is broken for me :(
/// <reference types="vite/client" />
/// <reference types="astro/client" />

// file:src/data/posts.ts
// A `MarkdownInstance` is the output from Astro's integration of Vite when it imports markdown files from a glob
import type { MarkdownInstance } from "astro";
// A `AstroComponentFactory` represents a component object that can be used like `<Component />` instead of `{Component}` in the body of the Astro component it's included into. Import looks a little strange but it's fine :P
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

// Interface for the frontmatter in the posts
interface RawPost {}
// Interface for the components passed to the eventual post component
interface PostProps {}

export interface PostPropsWithComponent extends PostProps {
  Content: AstroComponentFactory;
}
export const getPosts = async (): Promise<PostPropsWithComponent[]> => {
  const rawPosts = import.meta.glob<boolean, string, MarkdownInstance<RawPost>>(
    "../posts/*.markdown",
  );

  const posts = await Promise.all(
    Object.values(rawPosts).map(async (producer) => {
      const post = await producer();

      const props: PostPropsWithComponent = {
        Content: post.Content,
      };

      return props;
    }),
  );

  return posts;
};
```

I hereby release the above code snippet under an MIT license, or something. Basically, feel free to adapt and extend as you see fit, just link to this blog post or something :P

Other nice things I got out of Astro:

- Built-in code highlighting for language-tagged code blocks. (It would've been theoretically possible but kind of hard with Hakyll, so very nice to get that for free!)
- Built-in image optimization (I haven't used it yet since it would require further restructuring)
- $\LaTeX$, via `remark-math` and `rehype-katex` plugins (_very_ easy to install!)

## What's Next?

Not sure! One thing I'd like to do is update this blog's theming. Not too big a fan of the font anymore, nor some of the color/layout choices of the Wordpress Twenty Fifteen theme (yes, really) (still the best of the default Wordpress themes, imo). That smells suspiciously like doing even more rewrites of my blog, though, so perhaps I'll leave that alone for now :)
