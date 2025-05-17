---
title: The OS Semester
description: In which I recap how the Spring 2022 semester went for me, focusing on all the cool stuff that happened, particularly in the Operating Systems class at CMU
tags: class review, CMU
---

Wowza, that was quite the semester. A list of the classes I took, also the order
I'll cover them in:

- 10-405 Machine Learning With Large Datasets
- 17-200 Ethics And Policy Issues In Computing
- 21-301 Combinatorics
- 15-410 Operating System Design And Implementation

## 10-405

Taught by Prof. Virginia Smith, this class was an introduction into how you'd
actually construct machine learning systems to perform well at scale. "At
scale" usually meant "on multiple computers", which is indeed a challenge due
to things like communication overhead. We started small, covering things like
distributed Linear Regression and distributed PCA, and ended with
state-of-the-art approaches to Neural Architecture search and Federated
Learning.

Overall, I liked this class a lot. The lectures were very good and the
homeworks chill. One common complaint about homeworks that I share is that they
were sometimes _too_ structured; there was a lot of "fill in this function
signature that we've made for you already". The later homeworks did a better
job of this, and I can understand why they did this in the first place (makes
grading easier and eases the learning curve for frameworks like Apache Spark
and Tensorflow).

This class was within its unit count of 9hrs/week.

## 17-200

Co-taught by Prof. Michael Skirpan and Prof. Sarah Fox, this class was a very
practical overview of contemporary policy issues in computing and how to apply
ethical thinking to those. I really liked this compared to the previous ethics
class I took, which covered ethical frameworks in a more abstract term; getting
to learn about surveillance as "instrumentarian power", unionization movements
in big tech, and dark patterns in UX felt much more real. This class humbled me
with the realization of just how much power is wielded by broken systems, but
also gave some concrete paths for improvement as future tech workers.

This class fulfilled my writing requirement, and overall the weekly writing
assignments and writing midterm/final weren't all that bad. I only wish I had
more time to work on the assignments (no fault of the class, just busy with all
other classes too) and was better at the writing process (mental block on
drafting + reviewing...).

This class was within its unit count of 9hrs/week.

## 21-301

Taught by Prof. Irina Gheorghiciuc, this class covered some novel ways of, you
guessed it, counting things. It started off simple like "what a combination is"
and then quickly progressed to wild things like using functions and their
derivatives (whose coefficients of their Taylor polynomial are the things we
want to count) to do counting, then expanding on that to cool theorems like
Hands and Decks, Lagrangian Inversion, and Inclusion/Exclusion. Very cool to
know that $$u(x) = x\phi(u(x))$$ has a unique solution,

$$[x^n]\left\{u(x)\right\}=\frac{1}{n}[x^{n-1}]\left\{\left(\phi(x)\right)^n\right\}$$

Absolutely magic how this is proved :)

I can see why all my math major friends meme about Irina's lectures (very
unique and humorous style) and her tests (some problems are quite hard). I
really enjoyed this class; while I probably won't get to use much directly
later on, it's nice to keep my mathematical thinking sharp.

This class was within its unit count of 9hrs/week.

## 15-410

Taught by Prof. Dave Eckhardt, this class covered _everything_ you need to know
about writing a simple UNIX-inspired OS kernel, and then some. x86 `cdecl`
stack layout and calling convention, x86 memory model/atomic operations, x86
interrupts (traps, exceptions, faults, hardware), x86 segmentation, x86 virtual
memory mapping, how to structure a large software project, the thread/process
abstraction model (and how to implement it), concurrency problems like
deadlock, syscalls (and how to implement them), and more stuff that we didn't
get around to implementing like filesystems, transactions, IPC/RPC,
paravirtualization, memory consistency, and the experimental CHERI
architecture. In case you couldn't tell from the previous sentence, we wrote
our OS for the x86 architecture and got very familiar with its idiosyncrasies.
In the end, we had a lightly-featured (and working!!) kernel with a simple
threading library able to run some useful multithreaded programs with keyboard
input and console output.

The class moved at a breakneck pace to cover all of these topics (which were
all covered in a lot of detail!); there was hardly a point in lecture where I
wasn't moving my pencil. There was also hardly a day past the first week where
I wasn't working on the OS project; a final `sloccount` of the kernel showed
5000+ lines of mixed C and Assembly (however it counts that (and there was
probably more documentation than that too)).

This class was _not_ within its unit count of 15hrs/week :) More like 25 I
think? Didn't keep too close track, just estimating from the times I tended to
program every day.

### 15-410: It's A Partner Class

For those familiar with 15-410, you may recall that it's mainly a partner
class; 10 of the 14 weeks are spent working on projects with another person.

This did not turn out well.

I didn't realize that people generally find OS partners before class starts, so
everyone I already knew in the class had already found someone by the time I
started looking. In a historic twist of fate, I talked to the person who always
sat next to me in the front row, who turned out also to not have a partner, and
we quickly made a group.

Keep in mind, I had never even seen this person before this class. I had no
idea how this was going to go, but given the questions they asked in class (and
the fact they showed up to class at all) I was fairly optimistic.

They turned out to have many issues. Mental health, physical health, **and**
family issues, all in a negative feedback cycle. Naturally, this precluded
getting work done, often in week-long stretches during schedules where missing
a single day could be a bad setback.

I ended up designing and implementing every single syscall, and every submodule
to support all those syscalls. They contributed some good code and helped walk
through design decisions (especially in the P2 and P4 projects before and after
the big P3 kernel), but overall I'm still a bit salty about the work
distribution even though nothing could really be done.

The course staff knew about these issues and we were awarded generous (and very
necessary) late days. I'm (moderately) proud of what we turned in, but holy cow
I don't want to crunch that hard ever again.

## Random Other Stuff

- OS sapped all my time and I couldn't make many late-night or weekend Frisbee
  practices this semester :(
- My knee is fully better by now though, been working out and going for runs
  just fine
- I've been voted in as Tech Chair for [AAC](https://www.cmuaac.com) for the
  second year in a row! Wow thank you!
- Speaking of, I'll try to do more sketching practice this summer. I completed
  Figuary again this year and have been using Hampton's book a lot and I can
  see the results (from just the parts I've read tho)
- StuCo thoughts coming soon! (when I finish "grading" the finals)
