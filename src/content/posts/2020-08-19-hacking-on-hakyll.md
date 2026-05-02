---
title: Hacking on Hakyll for better Pages
tags: daily thoughts, Hakyll
---

In case you are one of the few people who know about this blog, you might have
noticed that I changed from titles of posts as the HTML filenames to just the
"post ID" as the filename. This may not seem like a big change, but oh boy did
Hakyll require some funky upgrades to get it to work.

Basically, I re-implemented [Hakyll.Web.Paginate](https://jaspervdj.be/hakyll/reference/Hakyll-Web-Paginate.html),
but with logic customized for single pages instead of pages that are actually
groups of other pages. I also added title metadata extraction instead of just
page number + url extraction to the context creator for extra fanciness.

The backend is messy, but in the end it turns out very nice and "declarative"
whatever that means:

```haskell
    pages <- buildPagesWith "posts/*" sortChronological

    pageRules pages $ \index _ -> do
      route $ pageIndexRoute index
      compile $ do
        let fullPostCtx = pageContext pages index `mappend` postCtxWithTags

        pandocCompiler
          >>= loadAndApplyTemplate "templates/post.html"    fullPostCtx
          >>= loadAndApplyTemplate "templates/default.html" defaultContext
          >>= relativizeUrls
```

Not to be content with that small victory, I also added pages to [the archive](/blog/archive.html)
with Hakyll's original `Paginate` thingy, also adding title support on top of
that. Again it was really messy but also really worth it.

Anyways I am really getting my value out of Hakyll for both reasons: I'm having
a very snappy blog (static sites >>> Wordpress any day) and I'm also learning
Haskell fairly quickly which is neat. Tomorrow I will probably reorganize my
code into better-named modules, but for now I'm happy.
