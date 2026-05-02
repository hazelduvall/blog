---
title: Operating System Shopping (2/2)
tags: daily thoughts
---

_Previously: [Operating System Shopping
(1/2)](./2019-07-15-operating-system-shopping-1-2.html)_

So, where I left of was, there are a lot of **bad** things about all of today's popular operating system kernels. Let's just roll through the list:

- Windows: pile of legacy garbage.
- XNU: unusable except in MacOS, which is a walled garden nearly impossible to install on non-Apple hardware.
- Linux: wacky monolithic kernel, very little inter-distro compatibility, little focus on usability for users.
- BSD: like Linux but with even less hardware support.

Really, what I would like to see is a viable [Microkernel](https://en.wikipedia.org/wiki/Microkernel) that can be used to run a functional desktop, but that's currently beyond today's development. Turns out all the inter-process communication they require is a big hit to performance, even if it's also a win for security, so people just haven't developed them as much. A look at the current contenders:

- GNU Hurd: promising, development stalled but might get back up soon, but it's GNU.
- MINIX: probably has no hardware support for anything made this decade.
- Plan 9: I'm not trying to run a distributed OS
- Haiku: might actually be the most functional of this bunch, but still missing a lot of tools[citation needed]
- Redox: super promising (I adore it's "everything is a URL" scheme), but isn't even self-hosting yet.

Ok so it's easy to point out the bad. Now what about the good?

- Windows: **can** actually run legacy applications with ABI compatibility, unlike most -NIXes.
- MacOS: UNIX + commercial success and support = greatness
- Linux: very performant, perfect for servers, you are very hard pressed to *not* use it as your development OS if you're doing research.
- BSD: very stable, OpenBSD is probably the most secure OS around.

In the end, I'm probably going to stick with my Windows setup and get all my Linux development fix through MSYS2 until I realllly need a Linux dual-boot. I've allocated 150GB on my 1TB HD for another OS install and am leaving it blank for now. I'm also seeing if I can get Redox to build on my older Linux machine in the meantime. I'd like to try kernel development, but at the same time the deeper I look into it the more I realize just how out of my depth I am. Nothing to do but keep pressing forward and learning more, though.
