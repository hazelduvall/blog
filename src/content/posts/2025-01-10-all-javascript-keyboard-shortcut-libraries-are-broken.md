---
title: All Javascript Keyboard Shortcut Libraries Are Broken
description: Either subtly, or not-so-subtly. There is no way to fix the more subtle variant, and the only solution is to Give Up (on supporting a large subset of keyboard shortcuts).
tags: programming, Web
---

Either subtly (by using `key`), or not-so-subtly (by using `code`). There is no way to fix the more subtle variant, and the only solution is to Give Up (on supporting a large subset of keyboard shortcuts).

---

So for work, I was tasked with making it so users could rebind the keyboard shortcuts used in our app. Not too complicated, I just needed to consolidate all the shortcuts into one place so I can split apart the `keyboard shortcut -> action` and `action -> code that gets run` maps, create a definition for a keyboard shortcut, let users to override the first map in settings, and bam. Don't even need to use any external libraries, the existing code shows the browser-provided information is more than sufficient! Except wait a minute, I feel like I'm forgetting something...

## What Is A Keyboard Shortcut?

Ah. Those pesky definitional questions. Others may have different, more complex definitions to account for different, more complex scenarios, but for our purposes in our app, a keyboard shortcut is simple:

> A keyboard shortcut is one or more modifier keys being pressed when exactly one non-modifier key gets pressed.

And while I'm at it, I should probably also define what a modifier key is:

> A modifier key is any one of the following keys:
>
> - Shift, aka ⇧
> - Control, aka ⌃
> - Alt, aka Option, aka ⌥
> - Meta, aka Super, aka Windows Key, aka Command, aka ⌘

I'm sure we'll have to revisit this for Vim mode, whenever a critical number of nerds starts using our platform, but good enough for now.

We choose this definition because it exactly lines up with the fields in [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent): `altKey`, `ctrlKey`, `metaKey`, and `shiftKey`. And then one other field for the non-modifier key. One other field... Wait, there's more than one??

## More Than One Way To Describe A Key

Ignoring all the deprecated ways, there are exactly two fields that describing which non-modifier key was pressed: [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) (deprecated: `keyCode`, `which`) and [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) (deprecated: `keyIdentifier`). The linked MDN documentation does a pretty good job at explaining the differences, but i also like to think i am also good at explaining things, so here I go:

- `code` is for when you want to write a game, where the position of the keys relative to each other matters.
- `key` is for literally everything else. Why? Because otherwise, users on alternative or international layouts would read the incorrect thing when using `code`.

Great, easy! I'm sure that all the popular libraries will be aware of this and all use `key`, then :)

## Oh No All The Libraries Use `code`

Let's stroll down the [top "shortcut" packages on NPM, sorted by monthly downloads](https://www.npmjs.com/search?page=0&q=keywords%3Ashortcuts&sortBy=downloads_monthly), shall we?

- [react-hotkeys-hook](https://www.npmjs.com/package/react-hotkeys-hook): [uses both `code` **and** `key`](https://github.com/JohannesKlauss/react-hotkeys-hook/blob/bc55a281f1d212d09de786aeb5cd236c58d9531d/src/isHotkeyPressed.ts#L10) in a way that will lead to shortcuts triggering more often than they should.
- [mousetrap](https://www.npmjs.com/package/mousetrap): [uses `which`](https://github.com/ccampbell/mousetrap/blob/2f9a476ba6158ba69763e4fcf914966cc72ef433/mousetrap.js#L195) which is basically just `code` but more deprecated.
- [hotkeys-js](https://www.npmjs.com/package/hotkeys-js): [uses `keyCode`](https://github.com/jaywcjlove/hotkeys-js/blob/6c0b6a60bdf72e6bb7b38345618c561db25c9382/src/index.js#L231) which is also basically `code` but more deprecated, but at least it's less deprecated than `which`.
- [tinykeys](https://www.npmjs.com/package/tinykeys): [supports both `code` and `key`](https://github.com/jamiebuilds/tinykeys/blob/fcf253635231925d660fd6699c9a783ecd038faf/src/tinykeys.ts#L131-L132) but defaults to `key`; the user has to explicitly specify a string like `KeyA` if they want to match on `code`.
  - Wow, it's our first good one! I honestly really like this choice.
- [combokeys](https://www.npmjs.com/package/combokeys): [uses `which`](https://github.com/avocode/combokeys/blob/bdacdfd37972ca9aef1d2bc52a2dc58dc8c469c4/helpers/characterFromEvent.js#L50), with [a fallback to `keyCode`](https://github.com/avocode/combokeys/blob/bdacdfd37972ca9aef1d2bc52a2dc58dc8c469c4/Combokeys/prototype/handleKeyEvent.js#L18).
- [react-hot-keys](https://www.npmjs.com/package/react-hot-keys): [just uses hotkeys-js internally](https://github.com/jaywcjlove/react-hotkeys/blob/09f8ea5e328bb9218f039b3649fd28d2561f0c60/src/index.tsx#L3), which used `keyCode`.
- [react-shortcuts](https://www.npmjs.com/package/react-shortcuts): [just uses combokeys internally](https://github.com/avocode/react-shortcuts/blob/c02d2bff6a7323a37fe08162b4317c3c732bbaac/src/component/shortcuts.js#L3), which used `which`.
- [@discourse/itsatrap](https://www.npmjs.com/package/@discourse/itsatrap): is a fork of mousetrap and [still uses `which`](https://github.com/discourse/itsatrap/blob/1967b6dd17bbc2f93af336cadfc8ad34fba32c89/itsatrap.js#L215).
- [v-hotkey](https://www.npmjs.com/package/v-hotkey): [uses `keyCode`](https://github.com/Dafrok/v-hotkey/blob/a7bb78dc8887557b7867d627c497933fe5b00859/src/helpers.js#L44)
- [ng-keyboard-shortcuts](https://www.npmjs.com/package/ng-keyboard-shortcuts): [uses `which` with a fallback to `keyCode`](https://github.com/omridevk/ng-keyboard-shortcuts/blob/de0a5df1310302a8d919677ca300b7e2a578a23c/libs/ng-keyboard-shortcuts/src/lib/ng-keyboard-shortcuts.service.ts#L358) and is also the one of the most horrifying Javascript codebases I've seen.
- [@ngneat/hotkeys](https://www.npmjs.com/package/@ngneat/hotkeys): [uses `key`](https://github.com/ngneat/hotkeys/blob/a9c011a484bbdcfa4b13db990a8bb935c65d230b/projects/ngneat/hotkeys/src/lib/hotkeys.service.ts#L101). Not quite as horrifying as the previous, but comes close. Angular projects man...
- [shortcuts](https://www.npmjs.com/package/shortcuts): Somehow has more downloads than its underlying library, [shosho](https://www.npmjs.com/package/shosho), which [uses `code` with a fallback to `key`](https://github.com/fabiospampinato/shosho/blob/28c00ed1f1a29b791ff3860fe87919ebc08d576c/src/index.ts#L49-L51).
- [@sofie-automation/sorensen](https://www.npmjs.com/package/@sofie-automation/sorensen): [uses `code`](https://github.com/nrkno/sorensen/blob/dc1e16a0f6a8e94fde1f1039c69a2cbedaf70c43/src/index.ts#L522), but with an interesting twist we'll get to later.
- [use-keyboard-shortcuts](https://www.npmjs.com/package/use-keyboard-shortcuts): [uses both `code` and `key`](https://github.com/SAITS/use-keyboard-shortcuts/blob/433f338b8b3e29edf33c10846097e6836a6b6f10/src/index.tsx#L116-L118) in a way that makes me think it will break under specific circumstances on alternative layouts.

A list is a bit hard to parse, let's look at it in a table too:

<table>
  <thead>
    <tr>
      <th>Package</th>
      <th align="center">Uses <code>which</code></th>
      <th align="center">Uses <code>keyCode</code></th>
      <th align="center">Uses <code>code</code></th>
      <th align="center">Uses <code>key</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>react-hotkeys-hook</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center" colspan="2">✅ (bad)</td>
    </tr>
    <tr>
      <td>mousetrap</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>hotkeys-js</td>
      <td align="center">❌</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>tinykeys</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center" colspan="2">✅ (good)</td>
    </tr>
    <tr>
      <td>combokeys</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>react-hot-keys</td>
      <td align="center">❌</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>react-shortcuts</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>@discourse/itsatrap</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>v-hotkey</td>
      <td align="center">❌</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>ng-keyboard-shortcuts</td>
      <td align="center">✅</td>
      <td align="center">✅</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>@ngneat/hotkeys</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td>shortcuts</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center" colspan="2">✅ (bad)</td>
    </tr>
    <tr>
      <td>@sofie-automation/sorensen</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center">✅ (good?)</td>
      <td align="center">❌</td>
    </tr>
    <tr>
      <td>use-keyboard-shortcuts</td>
      <td align="center">❌</td>
      <td align="center">❌</td>
      <td align="center" colspan="2">✅ (bad)</td>
    </tr>
  </tbody>
</table>

Holy cow. I knew it was bad but I had no idea it was _this_ dire. Now obviously, "most downloaded packages under a keyword" is not necessarily representative of the ecosystem as a whole. [lexical](https://www.npmjs.com/package/lexical) for example, which is not primarily a keyboard shortcut library but includes some anyways, [uses `key`](https://github.com/facebook/lexical/blob/33e36779a335d1f4fcdb9969f59275b7a5629337/packages/lexical/src/LexicalEvents.ts#L1011). Still, it boggles the mind how bad the popular purpose-built ones tend to be.

## But Wait There's More

Unfortunately, "just use `key`" isn't all sunshine & roses like I may have led you to believe. There's a reason library authors might shy away from it, even though it's been supported in all major browsers for [almost 8 years](https://caniuse.com/keyboardevent-key) (or 5, if you include Edge), and choose to use `code` or its variants instead: the Shift modifier modifies the value produced by `key` 🙀

Wait, that's it? Like sure, maybe [upper/lowercase doesn't always round-trip](https://archives.miloush.net/michkap/archive/2005/04/04/405174.html), and doing `Shift+2` will be different from `Shift+Meta+2`, and all this might change based on the user locale, and oh no yeah that's a big problem isn't it. By using `key`, you might be able to support [DVORAK](https://en.wikipedia.org/wiki/Dvorak_keyboard_layout) a bit better, but [German](https://en.wikipedia.org/wiki/German_keyboard_layout) keyboards will have `Shift+2` give you `"` instead of `@` like you'd get on a US layout. As far as I can tell, only the roman alphabet (A-Z) is safe.

### Even More Actually

The event that sparked this post was honestly something a bit more silly: It's the fact that, on MacOS, the Option (⌥) key _also_ modifies keys, even on US QWERTY! `Alt+c`? Surely you mean `Alt+ç` 🙂. _That_ is what made me switch my initial prototype to use `code` instead of `key`, which led me to discover this incosistency, which led me down the rabbithole & out the other side with this big corkboard full of red string.

## What The Good Libraries Have To Do

When searching NPM for "shortcut" libraries sorted by most recently updated, I came across [keyboard-i18n](https://www.npmjs.com/package/keyboard-i18n), which has an interesting solution to this problem: it uses the experimental Keyboard API (only supported on Chrome) to read the [KeyboardLayoutMap](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardLayoutMap), which maps `code -> key` with no modifiers. From this, you can build a reverse mapping `key -> code`, which lets you specify your keyboard shortcuts using `key`, but read them using `code`, getting you the best of both worlds! `@sofie-automation/sorensen` also uses this approach afaict.

This is not quite the end of it, however; there are certain keys we might want to bind, like `Ctrl+[`, that won't be present on all layouts. `keyboard-i18n` has some useful maps for certain keys like this that will work on international layouts without them, by mapping to non-roman characters in a similar location.

Unfortunately, this comes with a downside: the Keyboard API is only supported on Chrome. Which maybe isn't a problem if the rest of your app only supports Chrome! But is still a problem if you want to support Safari[^1], or that other browser everyone forgets about (Firefox).

## What We Cross-Browser Plebians Have To Do

So, if we want to support all major browsers, and all major keyboard layouts, our keyboard shortcut definitions must:

- Use `key`
- Only use roman alphabet characters (A-Z) and arabic numbers (0-9)
- Use `.toLowerCase()` or `.toUpperCase()` to normalize case when checking what character was pressed
- Only allow `Shift` as a modifier with alphabet characters
- Never allow `Alt` as a modifier

As far as I can tell, there is no general-purpose shortcut library that gets this right. And maybe it's the state of web search, but I can't find anyone talking about this either. [This `lexical` PR](https://github.com/facebook/lexical/pull/6110) is about the closest I could get. I'll probably just copy them, enforcing these rules within my own proprietary framework.

Everything is broken, and everything is fine 🔥

[^1]: Safari is especially problematic, because it has a very poor track record of adopting new web features in a timely manner. anyways
