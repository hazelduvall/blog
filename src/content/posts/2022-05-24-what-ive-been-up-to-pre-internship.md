---
title: What I've Been Up To Pre-Internship
description: In which I detail some half-finished projects I'm moderately proud of and just generally give life updates
tags: daily thoughts
---

It's been _very_ nice to relax after that semester, I needed it.

Due to large amounts of relaxing, hanging out with family, petting/walking my
remaining dog (R.I.P. Calvin, you are currently missed a lot and will continue
to be missed because you were the bestest and fluffiest and cutest dog), I
haven't been doing a whole lot of computering. However, I do have a carnal need
for stimulation, and have satisfied my need by casually working on the
following projects:

## UEFI Variable Writer for Windows, Written In Rust

I had worked on this a bit last summer, but it didn't fully work for reasons I
wasn't entirely clear on. Turns out I had everything correct (linking with
`windows-rs` => acquiring SYSTEM token for a thread => calling the
`SetFirmwareEnvironmentVariableA` function) except for not NULL-terminating the
string I wrote (Rust doesn't do that for its strings, C needs it). So after
fixing that, it works!

"But Jack," I hear you ask, "why did you want such an obscure tool in the first
place? Playing around with firmware variables is scary!" Well, my dear reader,
I wanted such a tool for my [Arch Linux
dual-boot](./2019-07-15-operating-system-shopping-1-2.html), because
booting from Windows into Arch required mashing a key on boot which I often
forgot to do and then I would have to reboot all over again and it was slightly
annoying so I did what any good programmer would do and wrote a tool to
automate it.

The bootloader I use,
[systemd-boot](https://wiki.archlinux.org/title/Systemd-boot) (which imo may
just be the best bootloader for UEFI btw), checks for a "LoaderEntryDefault"
UEFI variable and boots that configuration if it exists. This is very handy and
is how the included `bootctl` tool changes the default boot without actually
modifying the config file living in the EFI system partition (very different
from GRUB).

My goal, then, was to be able to write to that same variable, in the same
format, from Windows, so I could easily do something like `windows-bootctl
set-default arch.conf` and on the next reboot my computer would boot into Arch
without me having to spam any keys!

So about the code: i uh put it under my [other
identity](./2020-11-20-online-identity.html) which has also been very active on
Twitter (and I posted lots of prototypes there so). If you're very curious,
I've been informed it's not impossible (quite feasible even) to link the two
with public online info, just please keep it a secret if u do find out.

## OpenAFS For Windows

I've been on this since last year and I think the only reason I didn't make a
post about it at the time is because I didn't finish. I'm still not done, but
have made enough progress that I think I should share.

Some motivation for why I wanted to do this: [CMU uses
AFS](https://www.cmu.edu/computing/services/comm-collab/collaboration/afs/index.html)
as a shared file system, useful for a lot of CS classes because your files will
be available from any machine you SSH into. Currently, I can download those
files with [WinSCP](https://winscp.net/eng/index.php) pretty easily, but it's
slightly annoying to have to open the app and click "login" every time. Builds
of OpenAFS for Windows already exist, both
[official](https://www.openafs.org/frameless/windows.html) and
[unofficial](https://www.auristor.com/openafs/client-installer/) (unofficial
preferred since it backported a few security patches), but I have a compulsion
to stay on the bleeding edge so I thought I'd give it a shot myself.

Oh boy was I in for a surprise. This is hands-down the gnarliest codebase I've
ever encountered. A succinct way to describe it is that the last big upgrade to
the code seems to be to support Windows 2000. There are still files that
manually load function pointers from external DLLs (via certain syscalls)
without relying on the OS. There were many `<stdint.h>` headers missing,
`#define`d names that conflicted with those in internal WDK headers, and an
ungodly number of compiler warnings.

In the end, after 67 files changed, 4159 insertions(+), 2034 deletions(-) (most
of that in Visual Studio `.vcxproj` and related files tbh (which I needed to
add since their driver build system was not longer supported past Windows 7)),
I was able to get all their files to build! However, that's not the end of the
story: all of the executables complain about a "incorrect side-by-side
configuration" and the drivers don't want to install since they're not signed.

I'm focusing on the driver issues first, since being able to develop drivers on
Windows seems more applicable outside of this one project, but uh that's sort
of taking a while since Visual Studio isn't cooperating (and
[the smallest possible WinDbg setup](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/debug-universal-drivers---step-by-step-lab--echo-kernel-mode-)
is very complex).

## Doing Art

I've been voted in as Tech Chair for [AAC](https://www.cmuaac.com) for the
second year in a row! (I was the only one who ran for that position (but also
there were no votes of no confidence so that was nice)). Somewhat related to
that, I've been trying to do a lot more art, studying from Micheal Hampton's
book **Figure Drawing: Design and Invention**. I can see the improvement in my
sketches just after doing a few exercises; being able to "see" what the shapes
are helps a lot with recreating them in an image.

I'll be contributing to the club's upcoming collaborative banner (past banners
[here](https://imgur.com/a/y07CpSn), i was a part of both :)), and probably
participating in our internal ArtFight in August. Drawing is just fun and I'm
glad I can be part of this club even if I'm not at the same level :).

<hr/>

### Looking forward

This next week I'll be doing more of the same, still mostly relaxing, and
ramping up prep for my internship at Meta, working with the Community App
Health Engineering team in New York City. I am not sure what the team does yet
and also not sure where I'll be living but I've heard other people are in the
same spot so here's hoping it'll work out.
