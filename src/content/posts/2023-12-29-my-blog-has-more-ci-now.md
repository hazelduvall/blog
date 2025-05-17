---
title: My Blog Has More CI Now
description: A quick update on what I've done with my blog's Continuous Integration system, and why I think it's pretty cool
tags: Web, Astro
---

At work, I've seen my coworker set up this new cool tool called
[Rennovate](https://www.mend.io/renovate/) which automatically scans your
repository and opens PRs for updating dependencies. You control it through an
[online dashboard](https://developer.mend.io/github/duvallj/blog), or, and this
is the part I found really cool, through the [Github UI
itself](https://github.com/duvallj/blog/issues/4) via (presumably) some fun
webhook hacks.

However, for this system to work properly, there needs to be some way of knowing if an opened PR is good to merge or not. I don't _really_ want to do the manual work of "check out an automatically opened PR" $\rightarrow$ "make sure it works locally" $\rightarrow$ "merge the PR and clean up local git" when I could have computers do that work for me! So I did a bunch of work to make computers do that work for me :]

I borrowed heavily from the canonical Astro usecase, [their own documentation site](https://github.com/withastro/docs/blob/main/.github/workflows/ci.yml), which seems to have been a pretty good template. Lots of "fun" making typescript and eslint and prettier all play nice together, but yep now it works now!! It correctly failed on the [major version update](https://github.com/duvallj/blog/pull/12) of Astro, which I'll need to do manually at some point, but that's for another time yes.
