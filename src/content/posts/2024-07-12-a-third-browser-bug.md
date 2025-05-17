---
title: "A Third Browser Bug..."
description: "I found yet another weird edgecase in some JavaScript + CSS APIs when doing something for a work project. Great. At least this time it's not just Chrome, but all browsers that are buggy though??"
tags: programming, Web
---

TL;DR: [hey check out this weird CodePen I made](https://codepen.io/jack_at_roam/pen/eYwNEEJ)

<hr>

So at work, I had the opportunity to write a small tool that dumps the current state of the `document` into a single static HTML file, making no network requests. For the most part, it turned out to be a lot simpler than I expected! DOM APIs are really good nowadays (all hail `querySelectorAll`). It should have taken me like 3 hours tops, from starting up the editor to pushing the PR, but instead it took all day, because of one very weird bug.

## Virtual StyleSheets

One thing I learned poking around in our app for a bit is that, not all `<style>` elements have to be present in the document! That's right, you can define CSS rules _entirely in JavaScript_, never having their state show up in the DOM at all. You do this thru the [`CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet) and [`document.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets) APIs, supported on all major browsers:

```js
const styleSheet = new CSSStyleSheet();
styleSheet.insertRule("* { color: red !important; }");
document.adoptedStyleSheets.push(styleSheet);
```

This example code will turn all text on the page red. Try it out in your browser console now!!

In any case, I knew about this restriction beforehand, and was prepared. The [`document.styleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/Document/styleSheets) objects can also be modified in-place, so really the only way to properly dump everything was to run something like this:

```js
// Create a new empty document:
// <html><head><style></style></head></html>
const outputDocument = new Document();
const html = outputDocument.createElement("html");
outputDocument.appendChild(html);
const head = outputDocument.createElement("head");
html.appendChild(head);
const style = outputDocument.createElement("style");
head.appendChild(style);
// Add all rules to the style element
const rules = [...document.styleSheets, ...document.adoptedStyleSheets].flatMap(
  (styleSheet) => [...styleSheet.cssRules].map((cssRule) => cssRule.cssText),
);
style.sheet.replaceSync(rules.join("\n"));
```

## Virtual Documents

As it turns out, this doesn't work! Why?? As it turns out, browsers are very finicky about element state; many properties are defined only when they are actively being rendered, which this virtually-created `Document` is not. This extends for everything created in the "context"[^1] of that virtual `Document` too, so `style.sheet` will be undefined in the above example.

No problem, though! Instead of modifying thru `style.sheet.replaceSync`, we can do what MDN recommends on another page somewhere else, and use `innerHTML`:

```js
style.innerHTML = rules.join("\n");
```

and boom, everything is working! Except wait a minute, certain styles got applied right, but other styles are wonky. Diffing between the two, we see that no direct child selectors (that is, ones like `.a > .b`) are working. And looking in the rendered source, we find the culprit: they're being written as `.a &gt; .b`. Huh??

## `innerHTML`

Some background on `innerHTML`: it has some simple character escapes built-in, from some sort of "fragment parsing algorithm" that detects if something should be text or should be an HTML element. This makes code like this "just work":

```js
const test = (doc, elemType, text) => {
  const elem = doc.createElement(elemType);
  elem.innerHTML = text;
  console.log(elem.innerHTML);
};

test(document, "p", "2 + 2 < 5");
// prints "2 + 2 &lt; 5"
```

Now, because CSS wants _unescaped_ symbols, the usual escaping rules seemingly do not apply to it:

```js
test(document, "style", "p > h2 { color: blue; }");
// prints "p > h2 { color: blue; }"
```

...except, of course, when you have a **virtual `Document`**

```js
test(new Document(), "style", "p > h2 { color: blue; }");
// prints "p &gt; h2 { color: blue; }"
```

Because of course! Why _would_ that work? Clearly I am extremely silly for expecting otherwise.

<hr>

I spent a lot of time spinning my wheels on this one, probably because I had skipped lunch 2 hours ago by the time I got to this point. Having a lunch and coming back, the solution was easy: just do

```js
const output = `<html><head><style>${rules.join("\n")}</style></head>${document.body.outerHTML}</html>`;
```

I didn't need to keep everything as elements in the first place! All I cared about was the output text. A bit more magic to remove all scripts and make all images load from data URLs[^2], and bam it was working flawlessly. In the end I still had a lot of fun with this, hope you learned something too!

[^1]: I'm probably misusing this term here. Oh well you get the point!

[^2]: Secret ;)
