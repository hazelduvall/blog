---
title: Windows Development Adventures
tags: daily thoughts, Windows
---

So one reason I've not updated this blog in a while has been school. Yeah I've been pretty
busy with homework already & classes & everything, but not really busy enough to not just
take 10 minutes out of my day to update.

What really triggered me not posting was a project I've been working on. I was trying to
keep it a secret until "the big reveal" or whatever, but it's just been taking _sooo longgg_
that I had to make a post about it before I reveal a "final" (i.e. working, haven't even
gotten there yet) product.

In case you haven't guessed from the title of the post, I am doing some pretty heavy
development for an application targeting the Windows operating system. I'm still keeping it
a secret (for absolutely no reason other than I enjoy keeping secrets), but the gist is that
it's a large open source application whose Windows branch has been unmaintained since 2015.

Things have changed quite a bit since 2015. It's no longer reasonable to use Visual Studio
2013 to build your application. Windows DDK has turned into WDK and merged with the Windows
SDK. The whole concept of drivers has changed (slightly), and the whole build process has
changed dramatically. I am somewhat shocked that the extremely messy recursive NTMakefile
setup still works, was more shocked when most of the non-OS-specific parts of the
application built correctly with minimal additions (mostly to resolve merge conflicts that
I created when I merged the latest branch in with the most recent Windows branch). Like, if
you haven't seen the code, you don't know how amazing that is: it's a lot of hot garbage
anachronisms and crazy design patterns and hacks upon hacks that it's a miracle it compiles,
and I dearly hope it runs too (although that may be hoping beyond hope).

I was brought back to earth when I realized the Windows-specific parts of the application
required some serious mantinence. There were uses of outdated APIs galore, a really funky
custom DLL loading system (that they really just should've used `.lib` files for, like c'mon
that's literally what those are made for), badly written NTMakefiles, and to top it all off,
at least 3 drivers written for a build system last supported in 2013. It's _so old_ that
**_the tools to update from it literally do not exist anymore_**. Unfortunately I only
found that out after reading [this page](https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/projectupgradetool)
which promises they do exist (no they don't stop lying microsoft).

Anyways, as a status update, I've converted one driver by hand to build with Visual Studio
2019 `.vcxproj` files and I hope to get both [setting up a computer to debug the driver](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/debug-universal-drivers---step-by-step-lab--echo-kernel-mode-)
and [compiling the driver using MSBuild](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild?view=vs-2019)
to work. Wish me luck so I may be free of this project I've already spent more than a week
on and is showing me very dark depths of Windows.
