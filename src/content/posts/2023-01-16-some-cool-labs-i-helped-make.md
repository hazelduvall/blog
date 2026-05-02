---
title: Some Cool Labs I Helped Make
description: In the Fall 2022 semester at CMU, I (as a TA) helped design and run some programming labs for 15-316 Software Foundations of Security and Privacy. I'll go over why I think these labs are really cool without giving away any hints that aren't already in the lab writeups. This post is about the first of the two labs.
tags: projects, CMU
---

As a full disclaimer, the vast majority of work for these labs was done by the
professor for [15-316 Software Foundations of Security and
Privacy](https://15316-cmu.github.io/), [Matt
Fredrikson](https://www.cs.cmu.edu/~mfredrik/). As a TA, I helped a little bit
with coming up with the ideas for the labs and also a little with basic
file/object structure and autograders.

So, while I can't really even claim 20% credit for these, I'm still really
proud that I had any part in them that all and think they are super neat labs
to work through. Also, they're open source so you can follow along at home too!

## [Lab 1: Analyzing Safety](https://github.com/15316-cmu/lab1-2022)

This lab is all about _instrumenting code_ and then _proving properties about
the original code through the instrumented version_. You may be wondering what
any of these words mean so let's go through an example.

### Tinyscript

Here is some code:

```
x := i;
while x < (i-i)-1 do
    x := x + 1
done
```

You may notice that the syntax is similar to, but not exactly the same as, any
language you've ever seen[^1]. This is because it is a language you have never
seen. For simplicity, this course uses a fairly small language we call
Tinyscript with simple and intuitive and easy-to-specify semantics. Full syntax
tree and interpreter can be found in the repository.

### Safety Properties

Anyways back to safety: a **_safety property_** is class[^2] of traces that can be
defined by excluding all failing traces[^3] with just a finite prefix. That is,
as soon as you see "something unsafe", you know the safety property has been
violated.

Unfortunately, you can't neatly divide programs into "satisfies a safety
property" and "doesn't satisfy a safety property" since that would require
solving the halting problem[^4]. Plus, with our arbitrary-precision variables,
you can't brute-force every input combination to see if the safety property is
violated (or the program doesn't halt in a reasonable amount of time). So, what
can you do?

### Dynamic Logic

There is a formula called a **_box modality_**, which we denote as $$[\alpha]P$$
where $$\alpha$$ is a program, and $$P$$ is a boolean predicate, which is
itself a predicate saying "for all runs of $$\alpha$$, $$P$$ will hold in the
terminating state".

Turns out, there are rules on how to simplify this when given a specific
$$\alpha$$ and $$P$$! I'll spare you most of the details (take the class or
read the code to see how it's done), but I should note one, which is the rule
for loops:

$$[\texttt{while}(Q)\ \texttt{do}\ \alpha\ \texttt{done}]P \leftrightarrow [\texttt{if}(Q)\ \texttt{then}\ \alpha\ \texttt{else}\ \texttt{pass}\ \texttt{endif};\texttt{while}(Q)\ \texttt{do}\ \alpha\ \texttt{done}]P$$

yeah um there's a bit of infinite recursion here. One way to handle this is by
giving up and pursuing a different area of computer science, since this is
again equivalent to the halting problem. Another way is to unroll the loop for
"enough iterations" and call it a day. We take the latter approach.

With all these rules to turn box modalities into regular formulae, we can just
plug that resulting formula into [Z3](https://github.com/Z3Prover/z3) and bask
in the glory of modern computation. Hooray for automated theorem provers!

### Program Instrumentation

So now we have a tool to help us reason about a condition at the end of a
program, but safety properties can be violated at any time in our program. How
can we reconcile this? Simple: we _rewrite the program so that any operation
that could violate the property sets a marker that cannot be changed
afterwards_.

Here is how we would do that for the [previously-shown program](#tinyscript),
for the safety property `x > 0`:

```
#violated := 0;
x := i;
if !(x > 0) then #violated := 1 else pass endif;
while x < (i-i)-1 do
    x := x + 1;
    if !(x > 0) then #violated := 1 else pass endif
done
```

We've instrumented every assignment to `x` with a check afterwards to make sure
that it's value doesn't dip below zero.

By the magic of "it's really easy to recur over syntax trees", doing this
instrumentation automatically is fairly simple if you're clever. With this
method, proving the safety property becomes equivalent to proving
$$[f(\alpha)](\texttt{\#violated} = 0)$$ (where $$f$$ is the instrumentation
function), which we have the tools for!

All the problems in the lab (bounded execution, no unused variables, taint
analysis w/o implicit flows) are meant to be solved using this strategy. If you
have some time and are curious about this, definitely check it out! [It's free
online](https://github.com/15316-cmu/lab1-2022) and the writeup there is _much_
better than what I could explain here.

[^1]: Unless, of course, you've taken this course before

[^2]: like a set, "but better"

[^3]: Assignments to variables at each step in the program

[^4]:
    Consider: a program that does something unsafe only after (safely)
    determining if a passed-in program terminates.
