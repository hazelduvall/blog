---
title: First Week at College! Or, How to Install MPL (MaPLe)
tags: daily thoughts, CMU
---

All in all, not too bad of a week at all! Classes haven't ramped up yet, so all
the assignments this week were easy introductory ones. Computer Vision (16-385)
should shape up to be a very good class based on the lectures and the fact that
programming homework is 70% of the grade (I love programming!!).

For being alone in an apartment during quarantine, I've been doing pretty well.
I've taken lots of walks around campus and Schenley Park as well as participate
in Figuary (figure drawing month).

However, one day I got really bored with all my free time, and decided to do
something programming-related instead. My Parallel Computing (15-210) class uses
[MaPLe](https://github.com/mpllang/mpl), a home-grown fork of the
[MLton](http://mlton.org/) implementation of
[Standard ML](https://en.wikipedia.org/wiki/Standard_ML) (SML) designed with
simple parallel/concurrent programming primitives. We learned SML syntax and
functional programming concepts in [15-150](https://www.cs.cmu.edu/~15150/),
and I already have some experience in parallel from TJ, so using it shouldn't be
too hard.

CMU provides the MPL compiler on their remote servers, available by SSH, but I
prefer to work locally. So, like ya do, I compiled MPL myself using their
instructions. It was surprisingly easy so I thought I'd share how to do it with
the rest of my class. Here is the full guide I wrote up and shared on the class
[Diderot](https://diderot.one/):

<hr>

# Learn you a local MPL install for great good!

Hello everyone! Today I will be showing you how to install MPL (MaPLe, the
Parallel SML compiler thingy) locally, on your own machine, because you might
be like me and not prefer to do things on the Andrew machines.

First, like with any good recipe, I will tell you my life story. A long time
ago, I did not know how to compile things. Then, I started using CentOS (for
various reasons) which never has up-to-date packages. Wanting to use up-to-date
packages, I had to learn how to compile things. Along the way, I got pretty
good at compiling things, even if they were hard to set up.

Fortunately for you, MPL falls on the easier side of programs you have to
compile yourself! And without further ado, let's get right into that:

## Installing Dependencies

I will be providing two sets of instructions: one for those running Debian 10
(or derivatives like Ubuntu or Linux Mint), and those running MacOS Big Sur. I
have tested both sets on respective fresh and squeaky clean installations, so
if they don't work for you then too bad good luck fixing your environment. If
you are running another Linux Distribution (or even worse, a BSD \*shudders\*),
then I trust you known what you are doing well enough to adapt these
instructions to your own liking. If you are on Windows, just get Debian for
WSL (so much better than using a virtual machine)[^1].

### Installing Packaged Dependencies

According to its README.md, MPL requires the following packages to be
installed for it to be built (N.B. make sure your package manager is working
and up-to-date before running these!).

Debian:

```bash
sudo apt install build-essential libgmp-dev git wget
```

macOS: First, install XCode from the app store and homebrew from
<https://brew.sh/> if you haven't already. Then, run

```bash
xcode-select --install
brew install coreutils git gcc gmp mlton
```

(Note: binutils, make, and bash should be present by default on macOS with the
XCode CLI tools installed. If they are not and compiling MPL fails, run
`brew install binutils make bash` and try to compile MPL again)

### Installing MLton (Linux only)

Homebrew is nice enough to have a pre-compiled MLton in their package
repository, but unfortunately Debian is not so nice. So, we will simply have
to download the package and install it ourselves[^2]:

```bash
wget https://github.com/MLton/mlton/releases/download/on-20201002-release/mlton-20201002-1.amd64-linux.tgz
tar xzf mlton-20201002-1.amd64-linux.tgz
```

Next, skip ahead to the "Installing MPL" section and complete the first step,
replacing all instances of mpl with mlton. Then, change directory back to
where you ran the wget command and run:

```bash
cd mlton-20201002-1.amd64-linux
make PREFIX=$HOME/.local/mlton install
```

You should have mlton in your path now; try running `mlton` with no arguments to
test. If it prints out a version number, you should be set. If not, then idk
try to figure it out.

## Compiling MPL

For both systems: change directory to a suitable build folder, and run the
following:

```bash
git clone https://github.com/MPLlang/mpl.git
cd mpl
```

Then, on Linux:

```bash
make all
```

MacOS is a bit tougher, but not too much. MPL was written with Linux in mind,
and as such, uses a few Linux-isms in its code. So, I made a
[patch](https://gist.github.com/hazelduvall/0ed62747ee765ed663eeca59a141c820) that
gets rid of those in a way that doesn't affect the functionality of MPL too
much (I don't think, at least). The following commands download and apply that
patch, as well as tell the Makefile to use XCode tools:

```zsh
curl -sSL https://gist.githubusercontent.com/hazelduvall/0ed62747ee765ed663eeca59a141c820/raw/d65448c91fac52e59afd58982cad0663488842ac/0001-MacOS-fixes.patch -o 0001-MacOS-fixes.patch
git apply 0001-MacOS-fixes.patch
make AR=ar RANLIB=ranlib all
```

## Installing MPL

Now, if you're like me, you like to just type `mpl` to run something instead of
`/huge/path/to/a/build/folder/mpl/build/bin/mpl`. I like to put built binaries
in a `~/.local` directory, and then add that directory to my path. Doing that
for mpl:

```bash
cd $HOME
mkdir -p .local/mpl
# Run this line in your shell, and also add it to your ~/.bashrc or ~/.zshrc or similar:
export PATH=$PATH:$HOME/.local/mpl/bin
```

Now, navigate to the directory you cloned mpl to earlier, and run:

```bash
make PREFIX=$HOME/.local/mpl install
```

And that's it! You're done, congratulations! As a test, go to the examples
folder of mpl and try to run make nqueens to see if the compiler works
correctly.

# DISCLAIMER: DESPITE MY BEST EFFORTS IN TRYING ALL THESE STEPS MYSELF, THEY ARE NOT GUARANTEED TO WORK FOR YOU.

So please, use your head and a search engine before typing a comment about how
you got a scary error message and want someone to fix it.

# ALSO READ THE WHOLE THING PLEASE

<hr/>

[^1]: As much as I would also like to provide instructions for native Windows, being a Windows power-user myself, the preferred method for emulating a Unix environment, MSYS2/MinGW64 [doesn't let MLton use fork() for some reason](http://mlton.org/RunningOnMinGW), and I staunchly refuse to recommend Cygwin, so yeah just use WSL.

[^2]: The astute reader might have noticed that we are not using the latest version of MLton. That is because the Github release for it with glibc 2.23 is broken (bad ld.so in the mlton-compile executable, "only" requires a minor change to the released bin/mlton script that is more trouble than it's worth to put here), and the other version is for glibc 2.31 which is too new for Debian.
