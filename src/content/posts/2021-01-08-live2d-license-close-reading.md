---
title: Live2D License Close Reading
tags: daily thoughts, Computer Vision
---

One project that's been on slow burn throughout this winter break has been an
attempt to get a [Live2D Cubism](https://www.live2d.com/en/) avatar animated
using [OpenCV](https://opencv.org/) facial detection routines.

Becuase Live2D provides pretty much zero useful documentation in English, I have
resorted to "copying" their [Windows OpenGL Demo](https://github.com/Live2D/CubismNativeSamples/tree/develop/Samples/OpenGL/Demo/proj.win.cmake)
to try to make something useful. By "copying," I mean that I had their code up
on one screen, while I took note of the structure and names and typed similarly
structured and named code on another screen. Like the good citizen I am, I had
the thought, "wait, could it be possible that this isn't legal?"

## Turns out it's legal

...although not for the reasons you may think. Follow along with the [Live2D Open Software License Agreement](https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html)
if you woul like. Keep in mind that I Am Not A Lawyer so anything I say should
be taken with a grain of salt.

### Restrictive things

Most of the license seems to be dedicated to preserving the license itself. Many
clauses are about how, under no circumstance, can anyone come into possession of
licensed code or use it without first agreeing to the license (also no
re-licensing under a different license because duh). Once that's done, the
restrictions are fairly minimal: just don't commit crimes, and also if you
publish your source code that uses this open source code, Live2D can use your
code too. Live2D also retains half the copyright to any modifications you make
to their source code. Also you need to keep all copyright notices intact.

### Things you can do

You can redistribute the code (if people agree to the license), you can publish
code that is based off the license, you can make modifications (to the code, not
the licensing). You also retain full ownership over the parts of Derivative
Works that aren't Live2D code. All in all, it seems to be a fairly permissive
license.

### Where does my copying fall under this?

I was worried that my copying might be not allowed at first glance according to
section 5.1, titled **No Modifications**. It basically says the same thing as
the title. Under certain interpretations, my "copying" might be construed as a
modification (because the same result could've been achieved by first copying,
then modifying, or really the modifications were happening on a copy in my
brain, idk). The Software protected by this license includes all copies and
modified copies, so the code would still be protected by the license. If it had
included language like "Only Live2D is allowed to distributed the Software" then
I would've been out of luck. Fortunately, that is not the case and I am still
allowed to distribute this regardless of whether or not courts would think what
I have done counts as a copy.

## Code

Still very unfinished at the moment, but [here it is](https://github.com/hazelduvall/facestuff). Pay no mind to [a previous version written in Rust](https://github.com/hazelduvall/facestuff-rust);
it current has no Live2D components, just an OpenCV demo with a broken Windows
API hook (that I plan on fixing later, then porting the Live2D logic to, can't
be a copy/modification if it's in an entirely different language).

<hr/>

Also sorry for not posting recently; Winter Break has been very fun and relaxing
but putting stuff on my blog has not been part of my routine. I think leaving
it like this, with monthly-ish posts might be good enough. No pressure on
myself, though. Maybe I'll post about an AI thing again one day (after my PR
gets accepted probably, be excited ;)).
