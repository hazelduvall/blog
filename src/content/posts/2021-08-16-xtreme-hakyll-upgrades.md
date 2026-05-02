---
title: Xtreme Hakyll Upgrades
tags: daily thoughts, Hakyll
---

This is sort of a tradition how: I get more free time, decide to work on my
blog, and instead of actually writing posts I work on the backend and don't
actually post about it until I'm done, at which point I've started to run out
of free time.

Fortunately, this time I have a lot more free time, and the upgrades are
actually complete! Really! For real this time! ~~(ok not really I still want
to implement syntax highlighting eventually but that's for later ig)~~

The thing I've done: taken Hakyll's incremental compilation abilities and
extendend them to work better with my "numbered post list with links between
them" format.

## Why Hakyll's Dependency Tracking is Currently Not Good Enough

With standard Hakyll, if all posts link to each other (see each
other's titles), then updating one post will update all the other posts via
a link like:

```
post 1 --(depends on)-> post 2 --(depends on)-> ... --(depends on)-> post n
```

However, I'm only viewing a post's _title_, not anything about its body, so
a post should only be re-compiled when:

- It's source file changes
- It depends on a post whose source file has changed

because source file changes are the only way for metadata to potentially
change. Side note: depending on the metadata directly is a bit harder, with
what I know now it may be possible but what I have works currently and is a
bit better for numbered post lists in general.

## How I Changed It

I added a new `PostMetadataDependency` type to the `Dependency` enum, as well as a `numberedPostListMap` to the `DependencyFacts` struct. Every time you make a numbered post list and use fields in its context to view titles/urls of other
pages, it makes a `PostMetadataDependency` for that page through the magic of
the `Compiler` monad.

If this sounds similar to how Hakyll already works, that's because it is.
Here's the key difference: **You can have a `PostMetadataDependency` on
`Nothing`**. Why would you want this? Say you are adding a new post to the end
of the current list of posts. This will be the new last post. The previous last post, which didn't have a link to any later post, now needs a link to the new
last post as a later post. How else can you model "please re-compile if
something that doesn't exist yet happens to exist in the future"?

The implementation is not elegant. I don't know Haskell very well, and Hakyll
is quite a complicated library with many layers to dig through. In addition to
`Dependencies.hs`, I also had to modify `Rules.hs` (for a marker of whether
something was a numbered post list), `Rules/Internal.hs` (for combining all
those markers into a map of all numbered post lists), and `Runtime.hs` (for
getting that map from the result of the `Rules` monad and passing that to
`Dependencies.hs`). Oh and also `Binary` serialization/deserialization for all
the new datastructures I created. All in all it took a lot more effort than I
expected.

## Was It Worth It?

Sort of. It wasn't a huge deal in the first place anyways, as a rebuild of all
posts is very fast. But gosh darn it, if Hakyll advertises incremental
compilation, then ima use it, even if I have to implement it myself.

I may also write a more thought-out blog post going into exactly how Hakyll's
`Compiler` and other systems work, now that I've read and re-read so much of
that code. Will have to be soon because I'm liable to forget it :P

<hr/>

**TL;DR** my blog compiles v fast because i made it do that with much
haskell effort
