---
title: Tracking Down a "Heisenbug" in Chrome
description: I recount a long and arduous struggle to figure out a Chrome bug that I finally have a reproduction for
tags: programming, Web, Chrome
---

You know the drill. Go on hiatus because life is busy, catch COVID again even tho I wear a mask, and uncover yet another browser bug while still somewhat sick (getting better tho!).

The bug I have for you today is very special to me. We've been encountering it on-and-off at [Roam](https://ro.am) for a while now, since January I think? Customers would report "hey something happened and now my entire screen is shifted up", and we would say "can we see?", and they would send screenshots showing sure enough, their entire screen was shifted up. It even happened to me once, though it was less dramatic a shift than some:

<figure>

![the Roam map has shifted up slightly](https://static.duvallj.pw/2024-11-19/screenshot-0.png)

<figcaption>Names/pfps redacted for privacy. Note the top of the window being cut off, and the bottom of the map having a misaligned border</figcaption>
</figure>

Invariably, the reproduction ("someone sends me a chat message while I have Roam open on my external monitor", "it happens when my computer wakes up from sleep") wouldn't work every time for them, and would never work on our computers, so we'd be stumped, and that would be the end of it. It drove me _crazy_. Not having access to a consistent reproduction meant I was up a creek with no way to solve it.

Once, months later mind you, we got lucky that one customer was willing to screenshare during their bug encounter, and I got to poke around second-hand in devtools. What I found was, uh,

## The Entire `<body>` Element Was Shifted Up

Well that's just impossible! Ok well clearly it _is_ possible, given we're seeing it live, but our mess of like 10 container divs shouldn't leave any room for the body to scroll at all. And it's not the `<body>` that's scrolling, it's something else entirely!

Looking at the situation more, I wasn't entirely convinced that our mess of 10 container divs always behaved correctly. So I rolled up my sleeves and worked to reduce that number to 3 container divs. Everything worked fine, and to top it off, we got no more reports from them or any other customer about their screen shifting! The end :) What a happy tale about reducing technical debt paying off :)

<br>
<br>
<br>
<br>
<br>

---

Except, that's not the end. That _can't_ be the end. No way did I witness something impossible, that only happens in **extremely specific circumstances**, only on customer machines, for it to be _our_ fault. My nose is attuned to the smell of browser bugs, and oh brother does it **stink**.

## Shifting 2 - Electric Boogaloo

There's a longstanding issue with the drag-n-drop library we use, [`@hello-pangea/dnd`](https://www.npmjs.com/package/@hello-pangea/dnd), not working in any Electron window besides the main window. So, my coworker Klas Leino recently put in a herculean amout of effort to switch us over to [`dnd-kit`](https://www.npmjs.com/package/@dnd-kit/core). Natually, changing drag-n-drop libraries involves lots of reshuffling of divs, with no guarantee that behavior is unaffected. So we did what we normally do: feature-flag it for internal use only, and test it by dog-fooding our own software daily.

And it's a good thing we do this too, because sure enough our bug-testing processes caught a bug: another coworker, Theo Ouzhinski, noticed that whenever he clicked an unread message on his external monitor, his screen would shift up.

**_HM THAT SOUNDS FAMILIAR_**

It was a bit different than before, though. Instead of the entire `<body>` being shifted, it was just the part inside the floating inbox. And instead of being finicky to trigger, it was very reliable: get a new unread message, click on it, boom. And, the most crucial part of all, _it reproduced on my machine_:

![the inbox window is shifted up very strangely](https://static.duvallj.pw/2024-11-19/screenshot-1.png)

### Debugging Time \^w\^

The next few hours were a flurry of hypotheses and seeing where it reproduced and where it didn't. In the end, I was left with some required conditions for the bug to reproduce in our app:

1. Reproduces across platforms (Mac, Windows), on many different types of displays
2. Depends on the display; e.x. on my Mac's built-in display, it won't trigger, but on an external display plugged into the same Mac, it will.
3. Reproduces only in Chrome/Electron, not Safari or Firefox
4. Must click an _unread_ channel; normal navigation is unaffected.

## A CSS Footgun?

After more digging & some wild hunches, I found out what was actually going on: there was an outer container with `overflow: hidden` and a `scrollHeight` greater than its own height. When an unread channel is clicked, we load in the messages, then call `element.scrollIntoView()` on the earliest unread (incidentally, this is why it only happened for unread messages; normal navigation didn't make this call). When that earliest unread is "the latest message", this can cause all containers with room to scroll to scroll to their bottoms, including the `overflow: hidden` one. I did not expect this since the `overflow: hidden` container _should not have scroll on it_.

Initially, I thought it was impossible for `overflow: hidden` elements to scroll at all. However, both [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight) and [this codepen I wrote](https://codepen.io/jack_at_roam/pen/LYwvLxd?editors=1111) falsify that hypothesis; elements with `overflow: hidden` _can_ have a larger `scrollHeight` and _are_ expected to be able to scroll.

```html
<div class="outer" style="height: 400px; overflow: hidden;">
  <div class="inner" style="height: 400px; overflow: hidden;">
    <div class="content" style="height: 600px; position: relative;">
      <span id="top">Top</span>
      <span id="bottom" style="position: absolute; bottom: 0;">Bottom</span>
    </div>
  </div>
</div>
```

With this structure, `.inner` will be the one to scroll when we call `bottom.scrollIntoView()`. And `.outer` will have a `scrollHeight` of `400`, because `.inner` doesn't overflow it at all.

## A CSS Bug

But apparently, under some Sufficiently Complex CSS Conditions, `.outer` _does_ have a `scrollHeight` much greater than `.inner`, even when both have `overflow: hidden`. Based on reading [the spec](https://drafts.csswg.org/cssom-view/#scrolling-area), _that's a bug_: `outer.scrollHeight` should not be larger than the box of its only descendant. With that in mind, I'd like to present my hand-minimized reproduction of these Sufficiently Complext CSS Conditions[^3], whose `<div>` ids I'll be referencing in the coming explanation:

<p>
<a href="https://static.duvallj.pw/2024-11-19/scrollHeightBug/index.html">https://static.duvallj.pw/2024-11-19/scrollHeightBug/index.html</a>
<details>
<summary>Source code:</summary>

```html
<!doctype html>
<html>
  <head>
    <title>scrollHeight bug</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        min-height: 100vh;
        text-rendering: optimizespeed;
        margin: 0px;
      }
      #root {
        background-color: white;
        color: black;
      }
      #outer {
        will-change: transform;
        overflow: hidden;
      }
      #inner {
        overflow: hidden;
      }
      #padding {
        margin: 1px;
      }
      #scroll {
        height: 600px;
        position: relative;
        overflow: auto;
      }
      #spacer {
        position: relative;
        height: 1500px;
        background-color: lightblue;
      }
      #pixel {
        position: fixed;
        width: 1px;
        height: 1px;
        margin: -1px;
        border: 0px;
        padding: 0px;
        overflow: hidden;
      }
      #output {
        position: fixed;
        bottom: 0;
        right: 0;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div id="outer">
        <div id="inner">
          <div id="padding">
            <div id="scroll">
              <div id="spacer">
                <span style="position: absolute; top: 0">Top</span>
                <span style="position: absolute; bottom: 0">Bottom</span>
              </div>
              <div id="pixel"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="output"></div>
    </div>
    <script>
      const recalc = () => {
        const outer = document.getElementById("outer");
        const inner = document.getElementById("inner");
        const output = document.getElementById("output");
        output.innerHTML = `
outer.scrollHeight=${outer.scrollHeight} outer.clientHeight=${outer.clientHeight}<br>
inner.scrollHeight=${inner.scrollHeight} inner.clientHeight=${inner.clientHeight}
`;
        setTimeout(recalc, 1000);
      };
      setTimeout(recalc, 0);
    </script>
  </body>
</html>
```

</details>
</p>

If the bug occurs, `outer.scrollHeight` will be `1502`, not matching any of the other values displayed, which are all `602`. Because I read the spec, I am confident in calling this a bug, even though both Chrome and Firefox seem to have the same behavior[^1]:

| Chrome                                                                     | Firefox                                                                      | Safari                                                                            |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ![repros in Chrome](https://static.duvallj.pw/2024-11-19/repro-chrome.png) | ![repros in Firefox](https://static.duvallj.pw/2024-11-19/repro-firefox.png) | ![doesn't repro in Safari](https://static.duvallj.pw/2024-11-19/repro-safari.png) |

I am also very confident in calling it a bug because removing the `will-change: transform;` property from `#outer` causes the bug to go away on both Chrome and Firefox[^2]. Additionally, on Chrome only, doing any of the following will also cause the bug to go away:

- Setting `left: 1px;` on `#pixel` (it already had this as a computed value from the default `left: auto;`)
- Removing `margin: 1px;` from `#padding` (??? in Firefox it doesn't seem to matter if this div is present)

I highly encourage you to play around with this example in DevTools to get a feel for just how _weird_ it is. That's the thing with browser bugs: you thought you were standing atop a rock-solid platform, only to find out it's made of crumbling sand.

## Resolution

The best fix I've found for this bug is to just add `top: 0;` to `#pixel`. This works on both Chrome and Firefox, I think because setting an explicit `top` property moves the `#pixel` element firmly inside the container it's supposed to be in, causing no more weird `scrollHeight` calculations to happen. I'll patch `dnd-kit` locally, open a PR upstream, and send some P4 bug reports to Chrome and Firefox that will never get fixed. But hey, maybe I'll be proven wrong! After all, [this other bug I independently found](https://blog.duvallj.pw/posts/2024-03-23-wow-another-chrome-bug.html) eventually [got fixed](https://issuetracker.google.com/issues/325133349)! In any case, just knowing enough about the bug to fix it w/o waiting for Chrome is a huge weight off my shoulders. Thanks for reading, until next time!

[^1]: All of these screenshots are from my work MacBook, running MacOS 15.1 & the latest versions of every browser. The Chrome and FireFox examples repro on my Windows 11 laptop too.

[^2]: And I know it's not an interaction with stacking contexts, because replacing that with `position: relative; z-index: 0;` or `will-change: opacity;` (which will also create stacking contexts) makes the bug go away. Something about the `transform` optimization path is making things go awry.

[^3]: One unexpected benefit of making a minimal repro is that the bug no longer depends on what monitor you use, only what browser. Lucky, I guess!
