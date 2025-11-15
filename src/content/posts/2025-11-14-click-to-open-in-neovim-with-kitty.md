---
title: Click-To-Open In Neovim With Kitty
description: An overly detailed explanation of how I copied a very basic feature from VSCode into my bespoke terminal setup
tags: programming
---
Recently, I saw my coworker using VSCode, and they had this amazing feature where they could:

+ Run ripgrep in the command pane
+ Click on a filename it outputted
+ To immediately open it in a new tab in the editor pane

This, to me, was magical. However, I thought it out-of-reach for a lowly terminal user like myself, until I saw what [jyn was able to do with their terminal](https://jyn.dev/how-i-use-my-terminal/). This inspired me to create my own customized setup, which I shall now explain in excruciating detail.

## The Basics

### The Shell

In order to actually have anything clickable, we'll first need to set up our command line tools to output [Terminal Hyperlinks](https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda) that point to the full path of the filename displayed. The tools I uses for this are [`rg`](https://github.com/BurntSushi/ripgrep) (searching by file contents), [`fd`](https://github.com/sharkdp/fd) (searching by filename), & [`eza`](https://eza.rocks/) (listing directories).

```sh
# ~/.zshrc
alias rg="command rg --hyperlink-format=default"
alias fd="command fd --hyperlink=auto"
# TODO: use --hyperlink=auto once eza supports it
function ls {
  if [ -t 1 ]; then
    command eza --hyperlink "$@"
  else
    command eza "$@"
  fi
}
```

Because Terminal Hyperlinks are just extra text that's interpreted + hidden by the terminal (similar to how terminal colors work), we need to be careful that this extra text is only written to the terminal, not to any pipes (`|`) or file redirection (`>`). Fortunately, most programs supporting colors/hyperlinks already have ways to detect if they're writing to the terminal or not. Unfortunately, "most" is not "all", and for some reason `eza` still only has an unconditional `--hyperlink` flag despite [a PR about it being open for some time](https://github.com/eza-community/eza/pull/1059)[^eza], so we need to detect this manually. Overall not too hard to do tho. Next!!

### The Terminal

I've been using [Kitty](https://sw.kovidgoyal.net/kitty/) as my terminal for some time now, and have become quite comfortable with it. Fortunately, it supports scripting what happens when you click a Terminal Hyperlink, so we'll do just that! The [manual page](https://sw.kovidgoyal.net/kitty/open_actions/) lists a lot more things we can do with these clicks, but for now we just care about text editing.

```ini
# ~/.config/kitty/open-actions.conf
# Note this is _not_ included from the main kitty.conf, and is its own file
protocol file
action launch --type=window --cwd=current -- zsh -c "source ~/.zshrc; nvim -- $FILE_PATH"
```

Then, any time you use `rg` or any of the other hyperlinked commands, all relevant filenames can be Ctrl+Shift+Left-Click-ed to open them in a new window inside the current Kitty tab. `protocol file` tells Kitty "any link starting with `file://`, use the following action", and `action launch` tells Kitty exactly how to launch our editor.

You may be wondering, "why not just use `$EDITOR -- $FILE_PATH`, why is `$SHELL` involved at all?" And that's a great question. See, there's a lot of stuff going on in my `.zshrc`, from  [homebrew](https://brew.sh/)/[nix-darwin](https://github.com/nix-darwin/nix-darwin) globally installed packages, to per-directory workspaces made with  [direnv](https://direnv.net/)/[mise-en-place](https://mise.jdx.dev/).

Needless to say, my system is pretty bare without its `$PATH` filled to the brim with all these goodies. In fact, many of my Neovim plugins require it: I need `rg` & `fd` for [snacks.nvim](https://github.com/folke/snacks.nvim), language servers for [blink.cmp](https://github.com/Saghen/blink.cmp), `git` for [fugitive.vim](https://github.com/tpope/vim-fugitive), y'know, the works. However (for myriad reasons beyond the scope of this post), when launching a new window, Kitty isn't _quite_ smart enough to copy environment variables like `$PATH` from the currently active window[^env]. So, we just have to re-compute our `$PATH` before launching our editor. The reason I do `-c "source ~/.zshrc"` instead of `-i` is for speed; launching zsh first means there will be a brief flash of shell before the editor launches, and the former approach seems to minimize that flash.

## The Complications

"Well golly gee willikers," I hear you say, "Being able to open inside a new _Kitty_ window sure is dandy and all, but what I really want to do is open files I click on inside a new _Neovim_ tab, in an existing Kitty window <img src="https://static.duvallj.pw/emoji/um-ackshully.png" style="height:1lh" alt="nerd 'um ackshully' emoji"/>" Well fear not, dear reader, because I thought those same thoughts & have just the solution for you! This requires a just a bit more setup, which I have put together in the form of a "simple" shell script:

```sh
#!/usr/bin/env bash

# Ignore the ~/.local/bin directory when searching for nvim
# (assumes this script has been placed at ~/.local/bin/nvim)
export PATH=$(echo $PATH | sed -E -e "s|${HOME}/.local/bin(:\|$)||")

if [ ! -z "${KITTY_TAB_ID}" ]; then
  # If running in Kitty, use the tab ID to get the pipe for the Neovim instance for that tab.
  pipe="${XDG_CACHE_HOME:-${HOME}/.cache}/nvim/server-${KITTY_TAB_ID}.pipe"
  if [ ! -S "${pipe}" ]; then
    # Launch instance if there isn't one already
    if [ "$1" = "-k" ] || [ "$1" = "--kitty-remote" ]; then
      shift
    fi
    nvim --listen "${pipe}" "$@"
  else
    # Pipe already exists
    if [ "$1" = "-k" ] || [ "$1" = "--kitty-remote" ]; then
      # Open files in existing instance
      shift
      nvim --server "${pipe}" --remote-tab "$@"
    else
      # Launch new, non-remote instance
      nvim "$@"
    fi
  fi
else
  # If not running in kitty, pass through arguments unchanged
  nvim "$@"
fi
```

There are comments inline explaining most of it, but to summarize:
1. Use a unique-per-tab ID to construct a path inside a directory for Neovim to listen on
2. If such a path doesn't already exist, starts Neovim listening on that path
3. If such a path _does_ exist, only connect to it when a special command-line flag is given.

I chose the `-k` flag (shorthand for `--kitty-remote`), which also happens to be unused for all of `nvim`, `rg`, `fd`, and `eza` surprisingly, that I then use in my updated Kitty `open-actions.conf`:

```
# ~/.config/kitty/open-actions.conf
protocol file
action launch --type=window --cwd=current -- $SHELL -c "source ~/.zshrc; nvim --kitty-remote $FILE_PATH"
```

This replaces the `protocol`/`action` block we had previously. We get rid of the `--` because the `--remote-tab` used in our script already treats all remaining arguments as filenames.

The nice part about having this as a full-blown script, as opposed to just a shell function, is that we can use it with `xargs`, leading to some even crazier aliases:

```sh
# ~/.zshrc
function rgim {
  extra_args=""
  if [ "$1" = "-k" ]; then
    shift
    extra_args="-k"
  fi
  rg -l "$@" | xargs nvim ${extra_args}
}
alias rgkm="rgim -k"
```

Meaning, `rgkm foobar` will open all files containing the string "foobar" in separate tabs in an existing Neovim pane. Or, you can `rg foobar` to see the matches before clicking on the individual filesnames, and they will open in the existing Neovim just the same. Magical!!

### Notes On Getting `$KITTY_TAB_ID`

Unfortunately, dear reader, I may have pulled a fast one on you in the previous section; we are not done, there is one block remaining in this tower of shell scripts. Kitty only provides a unique-per-window-ID, `$KITTY_WINDOW_ID`, where a "window" is not an OS window but rather a split within a given tab. We require a unique-per-tab-ID instead, thus we are forced to calculate it by hand:

```sh
# ~/.zshrc
if [[ ! -v KITTY_TAB_ID ]] && (( $+commands[kitten] )) then
  # If not already calculated, define KITTY_TAB_ID from our built-in KITTY_WINDOW_ID
  export KITTY_TAB_ID="$(kitten @ ls --match "id:${KITTY_WINDOW_ID}" 2> /dev/null | jq '.[0].tabs[0].id')"
fi
```

For performance, this uses some zsh-isms to check if the variable hasn't been defined already & we have the `kitten` command, in order to keep that shell startup time nice & fast. This requires you to have `allow_remote_control yes` in your `~/.config/kitty/kitty.conf` for the `kitten @ ls` command to work. A little bit of extra gnarliness to an already-pretty-gnarly setup, but in the end it is just a few lines so whatever (:

## Conclusion


These instructions have been tailored for the combination of Kitty + zsh + Neovim, but I'm fairly confident they can be adapted for most other shells/editors running in Kitty too. Not too sure about other terminals though, you might have a harder time scripting the mouse click than in Kitty. I do also recommend checking out [jyn's original post](https://jyn.dev/how-i-use-my-terminal/) for further inspiration on terminal-agnostic approaches, doing the scripting inside `tmux` instead perhaps. Though whatever you end up doing, I highly recommend writing some of it yourself, because it is a very good learning experience[^experience].

And that, my friends, is all I have for you today. Take care & stay frosty 👍


[^eza]: Though maybe there's hope with this [latest PR](https://github.com/eza-community/eza/pull/1664)...
[^env]: Trust me, I tried _hard_. There is sort of a way to copy environments from existing windows using a [`kitten @ launch`](https://sw.kovidgoyal.net/kitty/remote-control/#cmdoption-kitten-launch-copy-env), but it didn't work for launching commands in new windows for whatever reason. The next-best thing is to recreate the environment that I actually care about from scratch.
[^experience]: Use of time, however? Who's to say :)
