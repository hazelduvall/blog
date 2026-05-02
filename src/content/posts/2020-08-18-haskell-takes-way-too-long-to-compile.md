---
title: Haskell Takes Way Too Long To Compile
tags: daily thoughts, Hakyll
---

Wow that was rough.

I left a `stack build` command running overnight on the machine I was planning to host this static
site from, and apparently the Haskell compiler just needs exorbitant amounts of memory to operate
properly. I mean to be fair running two compilers at once with only 2GB memory available is bound
to cause _some_ problems sure but not "your system is literally dying and can no longer handle
network interrupts" levels.

I was able to fix the problem by compiling the `Cabal` and `pandoc` packages individually, because
both on their own were using the full 2GB and really did not like being run at the same time. It
was running overnight (15 hours) and still didn't finish.

In the end I still spent 4 hours compiling stuff. Was that worth it? remains to be seen. but now
there's a blog so i guess so
