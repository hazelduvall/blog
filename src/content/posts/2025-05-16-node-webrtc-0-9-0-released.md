---
title: node-webrtc v0.9.0 Released!
description: Extra notes to the changelog I made for a somewhat-popular open-source package I maintain
tags: WebRTC, C++, Nix
---

Wow!! I can't believe it's been over 1.5 years since I [became the maintainer of node-webrtc](https://blog.duvallj.pw/posts/2023-10-11-im-a-maintainer-now.html). Feels a lot longer than that somehow :) Finally at a point where it feels like "my" codebase that I know every square inch of.

[This release](https://www.npmjs.com/package/@roamhq/wrtc/v/0.9.0) has been a long time coming, and contains a few major improvements over the previous v0.8.0 release:

### No More Compiler Warnings

It had always bothered me when Clang spat out a bunch of compiler warnings when building the project. It was a lot of work over many other commits, but I recorded [this commit](https://github.com/WonderInventions/node-webrtc/commit/c58b90e49042cdee9698dee85177f15f7ecf9d62) as the last one in the series. Now, when you build node-webrtc, you don't get any compiler warnings![^gcc] Speaking of building:

### Unified Build Environments With Nix

Previously, I had to do some pretty bespoke stuff on each machine to set up a proper build environment for node-webrtc. Given the number of machines I had, this sucked. This past year, however, I've been slowly becoming more familiar with [Nix](https://nix.dev/), to the point where I could create a mildly complex [build envionment definition](https://github.com/WonderInventions/node-webrtc/blob/a806f4ddff5daafd104c1dda7a74cac50fb1cf06/shell.nix) to share between my Linux and MacOS machines. I'm most proud of the fact that it's completely gotten rid of any dependency on the system XCode on MacOS, managing that with Nix is so much nicer holy wow.

Cross-compilation is still a bit tricky, even with this setup. Here's what I can do so far:

- MacOS arm64 ➡️ MacOS x64
- MacOS x64 ➡️ ️MacOS arm64
- Linux x64 ➡️ Linux arm64

Yeah, not very impressive I know sorry :P My stretch goal is to be able to target anything in {MacOS x64, Linux x64, Linux arm64, Windows x64} all from MacOS arm64, because my M4 Macbook Pro chews through compilation tasks like no one's business. That's where I did my main development for:

### Reducing Memory Errors With Rust-Inspired Lifetime Management

Garbage collection in C++ sucks, man. Or more specifically, interfacing with Node's garbage collection through their API sucks. There's a lot of stuff to uphold, and because the API was originally written for C, not C++, a lot of stuff _really_ just wants to be a pointer. I do not know why I had to write my own [`RefPtr`](https://github.com/WonderInventions/node-webrtc/blob/a806f4ddff5daafd104c1dda7a74cac50fb1cf06/src/node/ref_ptr.hh) class, but I did, and I know too much about C++ constructors because of it.

That's really the thing that was missing from the codebase: a concept of ownership, à la Rust. Not properly tracking that would cause destructors to not fire at all (memory leak/hang), or fire too early (segfault), both of which would be caught by some [test cases](https://github.com/WonderInventions/node-webrtc/blob/develop/test/destructor/index.js) (massive shoutouts to the previous maintainer [Mark](https://mrkrbrts.com/) for writing these tests in the first place!!). My solution for this was to introduce an [`OwnedWrap`](https://github.com/WonderInventions/node-webrtc/blob/a806f4ddff5daafd104c1dda7a74cac50fb1cf06/src/node/wrap.hh) class, clarifying the existing semantics of the `Wrap` class used to create weak references to cached objects.

## Future Plans?

Really, other than a few tricky GC errors & the usual fighting with the build system, I didn't have too much trouble updating node-webrtc to M98 and Node.JS 22. My hope is that, with a lot of annoyances cleaned up and a lot of knowledge gained, I can finally start making progress on catching up to the latest libwebrtc version. I know there will be some link errors along the way, and I still don't have a lot of free time to dedicate to this project, but damnit it feels good to finally get out a release. Here's hoping the next one doesn't also take a whole year!

[^gcc]: GCC still gives compiler warnings, unfortunately. I think they're wrong, though, so shouldn't be too much trouble to turn them off if I need someday.
