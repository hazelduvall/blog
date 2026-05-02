---
title: Some Cool Labs I Helped Make, Pt. 2
description: In the Fall 2022 semester at CMU, I (as a TA) helped design and run some programming labs for 15-316 Software Foundations of Security and Privacy. I'll go over why I think these labs are really cool without giving away any hints that aren't already in the lab writeups. This post is about the second of the two labs
tags: projects, CMU
---

<style>.center {display:flex;justify-content:center;}</style>

Read [Part 1](./2023-01-16-some-cool-labs-i-helped-make.html) first! That lab
was already super cool, but this one is even better imo 😎

## [Lab 2: Authorization & Trust](https://github.com/15316-cmu/lab2-2022)

This lab is all about _writing an automated theorem prover_ for a limited set
of theorems to prove. As a part of that, you get to learn the answers to fun
questions like

### What Does It Mean To Prove Something?

That is, how can we show something like $$(A \rightarrow B) \land (B \rightarrow C) \rightarrow (A \rightarrow C)$$ is true?

#### What Does It Mean For Something To Be True?

Great question! Is $$A$$ true? Why not?

The answer is, _it depends on your interpretation of $$A$$_. And I mean that
word "interpretation" quite literally, that's the vocabulary we use for "the
assignment of truth values to variables.

There is an interpretation where $$A$$ is true: $$\{A: \top\}$$, and an
interpretation where $$A$$ is false: $$\{A: \bot\}$$.

So to be more precise, when we are asking if some logical formula is true, we
are really asking whether it is _true in all interpretations_. Here's some
symbols:

$$\models P \leftrightarrow \forall I. I \models P$$

#### So Back To The Main Question: Proofs

So now we have this idea of interpretations, and truthiness from the standard
boolean connectives $$(\land, \lor, \rightarrow, \lnot)$$, and need some way of
showing that a formula will hold under any interpretation. Not only that, the
way we do this needs to be in some format that a computer can quickly recognize
and manipulate, so text is right out[^2].

The solution we use is **proof transformation rules in a tree structure**. A
single rule might go something like this:

$$\frac{\Gamma,A \vdash B}{\Gamma \vdash A \rightarrow B, \Delta}(\rightarrow R)$$

The more complex rule is at the bottom, and gets broken up into simpler
rules as you go up the tree. More explanations of symbols:

- $$\vdash$$: If everything on the left side is true, then at least one thing
  on the right right is true. Like a big implication but more flexible for
  our needs.
- $$\Gamma,\Delta$$: Leftover clauses on the right and left hand sides of the
  $$\vdash$$ to signify which rule we are applying to and when we can carry
  things over[^3].

To finish a proof, you need to "close out" every single branch, signified by
$$\star$$. Here are some rules that do this:

$$\frac{\star}{\Gamma \vdash \top, \Delta}(\top) \quad\quad \frac{\star}{\Gamma, \bot \vdash \Delta}(\bot) \quad\quad \frac{\star}{\Gamma,P \vdash P,\Delta}(id)$$

These types of proofs (in the right format) can be easily checked by a
computer, since all it as to do is, for each proof rule, check that it was
applied properly. Then, since you know all the proof rules are valid, the
entire proof must be valid!

Unfortunately, I can't write out an example, since doing simple ones of those
is a homework problem early in the class, but u get the gist right? Moving on!

### What Are We Trying To Prove, Exactly?

So imagine you are a smart door lock. You have some notion of "who is allowed
to access this door" and "who is allowed to delegate access to this door".
These are can be encoded as affirmation logic[^4] principles like:

| A                            | B                                                                        |
| ---------------------------- | ------------------------------------------------------------------------ |
| `door` says `canopen(hazel)` | `door` says forall `p`. (`hazel` says `canopen(p)`) implies `canopen(p)` |

These statements have a close tie to cryptography! A "says" clause is like a
signed statement, and proving the identity of the signer requires knowing about
Certificate Authorities, and it all gets pretty complicated, but! _There is a
reason for all of it_ and _it can be automated very naturally_.

The lab is then to present a series of virtual doors with the appropriate
signed statements and a proof using those statements to show that you can enter
the door. The proof goals are as follows:

1. Given a signed statement you can enter the door, construct enough of the rest
   of the proof (with CAs and such) to get the "says" statement
2. Given a delegation of authority, open the door
3. Given a very broad transitive delegation policy, open the door
4. Exploit the door's certificate checking code to open a door you logically
   shouldn't be able to

Sounds simple right?? :)

I really enjoy this lab because it combines together a lot of disparate topics
and they all still work together well, and it really shows the power of
computers to do Logic, very quickly, and it feels like magic.

That's pretty much all I can say without spoiling the rest of the lab, if this
still sounds interesting to you I think you should [read
it](https://github.com/15316-cmu/lab2-2022) and try it out! It is free! I
really appreciate that this course is just,, publicly available to anyone who
wants to learn it (even if the lectures really bring out the best in the
subject but i digress).

That's about it, thanks for reading!!

[^2]: Yes, not even ChatGPT can reliably do stuff like this 😔

[^3]:
    As an exercise, convince yourself that all the proof rules I've shown are
    true!

[^4]:
    Working with these "says" clauses is a little tricky and has a lot of
    subtlety to it. If you're interested in learning more, I highly recommend
    reading the [15-316 course
    notes](https://15316-cmu.github.io/2022/schedule.html). They are available
    for free online and are really comprehensive!!
