---
title: "You Won't Believe That I Found Another Chrome Rendering Bug"
description: "Another foray into debugging a Chrome rendering bug, this time with extra platform-specific goodness!"
tags: programming, Web, Chrome
---

EDIT: As of 2024-10-15, when Chrome 130 was released, this bug is now [fixed](https://issuetracker.google.com/issues/325133349)! Yahoo!!

<hr>

So in one of my [previous
posts](/posts/2023-12-28-i-think-i-found-a-webkit-bug.html), I outlined how
Chrome had a rendering bug where it did not properly mask anti-aliasing pixels
under certain complex CSS `mask` conditions. And wouldn't you know it, right as
I publish an [update](/posts/2024-03-15-working-around-a-webkit-bug.html) to
that post, I find yet _another_ Chrome rendering bug at work.

This story starts a couple months ago, when I'm working on a refresh of some of
the colors and layout of our app's main page to match a new design. The designer
comes up to me and says "ayo check out this weird bug I'm having", and shows me.

On their screen, many of the colors look darker than normal. And suddenly, when they
hovers over a specific UI element, all the colors snap back to normal. As soon
as they stops hovering, the colors go back to being weird again. I have never seen
this happen before.

I take a look at their browser state in devtools, and discover something
distrubing: all the CSS is correct. Everything is _exactly_ the same as on my
machine, and yet the results are different. I've done nothing wrong except fail
to understand what the heck is going on here.

## Narrowing Down A Culprit

As for "why do the colors snap back to normal when a div is hovered?", that part
had a simple yet outlandish explanation: hovering a certain div creates a
`blur` effect, the addition of which must've done something to the way the rest
of the page was rendered. As for "why are the colors wrong in the first place?",
that part was harder to figure out.

I had put it on the deep backlog at the time, because "shipping the thing" was
more important than "solving a bug that seems to hardly ever occur in practice".
But just recently, enough people independently had the bug that we finally had
some leads.

One of my coworkers noticed this bug only occured for them when another specific
coworker was signed in with their test account. Wait, What? They also noticed
that, when the test account's profile picture showed up on screen, their display
backlight lit up more, which usually occurs when trying to display an HDR image.

Excited for a reproduction, I lauched the app on my own machine. The bug didn't
reproduce. Then, I recalled that the monitor I usually test on might not be
HDR-compatible, so I dragged it to another monitor that was: my Macbook's
built-in screen. And lo and behold, I had a reproduction. I opened up devtools,
unloaded the image thought to be the culprit, and sure enough, the bug went
away.

So! Something about HDR images, and whatever `div` setup we have going on is
causing trouble.

## Why Is That??

To answer this question completely, I would have to dive into Chromium
internals. Unfortunately, I am not that good at diving into Chromium internals,
so instead I just found a couple bug reports that might give some insight:

### HDR Was A Known Problem

[This bug](https://issues.chromium.org/issues/40114989) was the first relevant
result when I searched for something along the lines of "blur interacts weirdly
with HDR MacOS Chrome??". Back in Chrome M80, they had to disable HDR support
for MacOS because they "fall out of HDR mode if there are extra render passes",
like blur, "which looks bad."

Despite the age of this bug, this is almost the exact result I was seeing!
Adding a `blur` anywhere did cause other stuff to fall out of a (presumably bad)
HDR mode. And because the fix for this bug was to just disable HDR, it could be
likely the underlying issue was never addressed fully. Feeling confident I was
on the right track, I kept looking...

### HDR Still Is A Problem

[This next bug](https://issuetracker.google.com/issues/325133349) is much closer
to what I was seeing: an HDR image causing a background with opacity to render
incorrectly! The reproduction isn't exactly the same as what we have going on in
our app, but hey, close enough.

Below, I've demonstrated the reproduction from the bug report: an HDR image with
`position: absolute` outside a parent div with an opacity less than 1:

<style>
  .outer {
    border: 1px solid black;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    position: relative;
  }
  .outer .inner {
    width: 80px;
    height: 80px;
  }
  .inner.container {
    border: 3px solid blue;
    opacity: 0.5;
    background-color: white;
  }
  .inner.trigger:checked {
    backdrop-filter: blur(24px);
  }
  .inner.trigger:checked ~ .inner.container {
    border-color: red;
  }
  img.round {
    width: 80px;
    aspect-ratio: 1 / 1;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    object-fit: contain;
    border-radius: 50%;
  }
</style>
<p>
<div class="outer">
  <input type="checkbox" class="inner trigger">
  <div class="inner container">
    <img class="round" src="https://static.duvallj.pw/2024-03-20/dog.jpg">
  </div>
</div>
</p>

If you're in most browsers, you should only see the border color of the square
change when the checkbox is checked. If, however, your are:

- using Chrome
- on MacOS
- on an XDR-enabled display

Then the above demonstration should make it so that checking the checkbox also
changes the background color of the lower square. This should never happen,
because the square is simply `background-color: white; opacity: 0.5;` over an
already-white background, so it should be white always (like in most browsers).
The reason the background color changes is because the checkbox has a
`backdrop-filter: blur` property only when it is checked, and as mentioned
previously, enabling this blur disables the buggy HDR.

If you don't believe me, observe this screen recording I took of the bug. Yes,
it does show up in screen capture (thank goodness), so it's definitely not a
display bug of any sort:

<figure>
<video controls src="https://static.duvallj.pw/2024-03-20/bug.mov" style="width: 100%">
<figcaption>Video showing a recreation of the bug</figcaption>
</figure>

Note that this bug is _extremely_ sensitive to the types of stacking contexts
that can be used to trigger it. You can have roughly the same layout with any of:

- changing which `div` has the `position: relative` on it
- positioning image based on `left` instead of `right`
- image overlapping div

and the bug _will not trigger_. This is why I wasn't able to make a minimal
reproduction of what's actually happening in our app. In our app, the
image can (1) be at `opacity: 1`, (2) overlapping the `div`, and (3) all
transparent colors everywhere are affected, which is even wilder. Shame I wasn't
able to show it off...

Anyways, now I am fairly certain it is a Chrome bug. However, because I do not
have the chops to write a patch that fixes it at the source, I have to work
around it just using CSS.

## Take 1

My thinking:

> If adding some `blur` anywhere stops whatever's going on with the
> transparency, then just having a random 1x1 div in the corner of the screen
> should do the trick!

Sure enough, that did it! No more weird transparency rendering issues,
everything looks normal again, we're all happy yaaaaaaay :)

yeah. um. Remember the first bug? Turns out this trick _disables HDR entirely_,
which is not a good thing if your CEO likes to view HDR videos in his app and
can tell the difference.

## Take 2

> The problem is a combination of HDR, Weird Stacking Contexts, and Transparent
> Colors. The easiest one of these to fix is Transparent Colors, so if I make the
> offending background colors Not Transparent, everything will be fine!

Yep! Turns out it's not too hard to hack together something with
[Color.js](https://colorjs.io) that roughly emulates what the transparent
blending would otherwise do. I got it so that even in a side-by-side comparison,
I could hardly tell the difference.

And that's that!! I've worked around yet another Chrome bug purely by contoring
the CSS into the correct shape, which is why I'm a Software Engineer :)

## Conclusion

This bug was really hard to find because it only happened under very specific
conditions, and the outcome seemed simply impossible. Blur on one element
affecting all elements on the page? Chrome drawing transparent colors
incorrectly?? Surely you must be joking, Mr. Feynman. Nope, turns out Chrome has
rendering bugs, and stumbling across them is more likely than I thought.

Anyways, hope this was somewhat educational, see y'all next time!
