---
title: Free time => More Hakyll Upgrades
tags: Hakyll, daily thoughts
---

Thanksgiving break, woo! I finally had enough time on my hands to get around to
something that had been bothering me with this blog for a while: Hakyll doesn't
do dependency tracking right.

### Wait, What?

Yes you heard me right. Haskell is a very complicated language, and Hakyll takes
full advantage of all those complications to make a surprisingly robust system.
But the robustness makes it a bit inflexible, which is why I ended up having to
write a lot of extra code to get these numeric page ids.

But that's not what was broken.

## The thing wrong with Hakyll

Hakyll's main branch treats the metadata of a page changing and the actual page content changing as
the same event. This is troublesome because my pages all depend on the ones
directly before and after it for metadata like title and date. This is separate
from the actual content of the page before or after, so if the metadata stays
the same, I do not expect the pages to rebuild.

"Not so fast," says Hakyll. "This page you just edited is out of date, so I must
propogate that out-of-dateness to its neighbors because I cannot tell if just
the body changed or the metadata did as well." Ok, that's all fair and good, but
this new out-of-dateness ends up propogating to those page's neighbors, then
their neighbors, so if any page gets updated, all pages get rebuilt.

### I would rather this didn't happen

So after understanding all that, I forked the Hakyll engine and added that
distinction with an extra `MetadataDependency` type in addition to the existing
`IdentifierDependency` and `PatternDependency` ones that already existed. I then
tweaked the dependency resolver to skip over metadata dependencies when doing
the dependency update chain things, and only look 1 neighbor level deep when
doing the out-of-date marking for metadata dependencies.

## Did that work?

After many long hours, yes! It did! But there's a new slight problem: adding a
page (like this blog post) to the end of the list does not update the old most
recent page to have a "next page" link that points to it. This is because the
old page did not have a metadata dependency on the non-existent page.

It's possible to fix this by checking if there are any new metadata
dependencies in the check for out-of-date items, but I am exhausted from
writing so much Haskell already so I think I'll leave that for another day.

<hr/>

Anyways, Happy Turkey Day tomorrow!
