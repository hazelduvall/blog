---
title: I'm A Maintainer Now??
description: Recollections on how I got myself into the position of maintaining a fairly large (if not that popular nor crucial) open-source library, node-webrtc, while getting paid for it.
tags: WebRTC
---

Recently, some code I hacked on for work made its way onto [Hacker
News](https://news.ycombinator.com/item?id=37774807), where it got a decent
amount of attention. Nothing crazy, but enough that I was pleasantly surprised.

The code in question is
[node-webrtc](https://github.com/node-webrtc/node-webrtc), specifically, my
[fork](https://github.com/WonderInventions/node-webrtc) of it. This is an NPM
package for letting NodeJS access WebRTC APIs normally only accessible in
browsers. It does this by taking the
[original](https://webrtc.googlesource.com/src/) libwebrtc source code and
plugging it into [Node Native Addon](https://nodejs.org/api/addons.html)
bindings that closely mirror the ones in the WebRTC specification.

I needed to fork this package because the original became unmaintained in 2021,
and had suffered enough bitrot when it came to the Node Native Addon side of
things that it no longer worked with the latest Node LTS (18). In order to use
it in our codebase (for various reasons), it needed to be upgraded.

In addition to the upgrade of the APIs, I also started to upgrade the version
of libwebrtc it was building against, also because our code needed features
from slightly newer versions. I upgraded it from M87 to M94, going through M90
and M92 first, and am in the middle of upgrading to M98. These incremental
steps proved to be the best option for getting things working (hard to fix
things when everything is broken, better to only break a few things at a time),
but means it's slow progress towards an eventual goal of M118 and our patched
version of libwebrtc.

This is all well and good, and once I was moved to another project I thought
this would effectively be the end of the saga. I did want to keep working on
it, but other tasks needed doing! It wasn't until the Hacker News post came
around that I caught the attention of node-webrtc's previous maintainer, who
offered to hand over ownership of the Github organization and NPM package.

So, yeah, that happened! I haven't merged my fork back into upstream yet, nor
added a new NPM package version. This is because I am still working on other
tasks for Roam and haven't put a lot of time into this library recently. I'll
keep plugging away at it when I can, and will be responsive to Github issues on
the fork during normal business hours. Not sure what the appropriate channels
are to make an announcement when I do make the changeover, perhaps just a note
in the `README.md` is appropriate.

This feels surreal! Very interesting to have a codebase dumped on me like that,
just because I put in the work for it. No pressure or anything since it doesn't
seem widely used, but still thinking about how to uphold a legacy and start
building a reputation more. I would like to be able to devote more energy
towards improving open source and building cool stuff people can see that has
my name on it. Frontend work is cool and all, but this is more the stuff I
signed up for really when I wanted to become a Software Engineer.
