---
title: I Was An OS TA
description: In the Spring 2023 Semester at CMU, I was a TA for Operating Systems Design and Implementation (15-410). In this post, I reminisce about the experience and what I learned from it.
tags: class review, CMU
---

Wow. I actually made it. Since early-ish at CMU, I had known that an "OS TA"
was a laudable thing to be[^1], but after [The OS
Semester](./2022-05-11-the-os-semester.html), I wasn't sure I'd actually be
one. Sure, I'd applied the [semester I was already scheduled to be a TA for
15-316](./2022-10-19-taing.html), and applied again "just in case", but I
didn't _really_ think I'd actually get it. It was only (checks notes)
**December 24th** that I found out for sure, through a friend refreshing the TA
assignment page for their own position. What a Christmas present lol.

This final semester at CMU, I only took [15-462 Computer
Graphics](http://15462.courses.cs.cmu.edu/spring2023/), so I had plenty of time
to attend another class, do research for a professor, teach [my
stuco](https://rust-stuco.github.io/), and TA this class. hm. work expands to
fill the available time, huh?

## What Does An OS TA Do?

In a nutshell:

- grade projects
- hold office hours
- slowly add to existing projects

All in collaboration with [Professor Dave
Eckhardt](https://www.cs.cmu.edu/~davide/), who has been teaching the course
for long enough to have taught some current professors at CMU.

Oh! Also! I was the only "official" TA that semester, all others were alumni or
PhD students kindly contributing in their spare time.

### Grading

This is The Big One™. All 5 projects, 2 homeworks, a midterm, and a final.

For those latter 3 categories of written assignment, it's not too big a deal.
There are fairly standardized rubrics/methodologies for grading, and the main
feedback given is point values (which students can come into office hours to
discuss if they want). What makes OS grading so infamous[^2] for its grading is
the sheer amount of extremely detailed feedback given on all the coding
projects.

For those coding projects, there is a standard set of tests that the code has
to pass[^3], and then the rest of the points are left to Architecture and Code
Quality. How do you grade these? You read the code, of course! And by "you" I
mean "me and Dave and a small army of masters/PhD students/alumni".

Reading all the code written by other students (especially by masters
students!) was really useful. It made me appreciate my own coding style[^4]
also opened my eyes to other things you should pay attention to while coding.

I will be part of the "small army" next semester[^5], and will be more than
happy to help read more code :)

### Office Hours

As the only "official" TA, I did hold a lot of office hours. Dave (Eckhardt)
and Dave (O'Halloran) also held their own professor office hours, and a few
alumni held remote office hours on weekends.

In office hours, I was supposed to never give out solutions, only ask questions
about what they had tried and hadn't tried in an attempt to get them to think
about the problem more fully. This method is difficult and frustrating on both
sides but on the whole I agree that it does lead to better learning outcomes.

I stuck to a fairly regular schedule and was always surprised by when students
did or didn't come in. There were sometimes big influxes after an assignment
was released, right before it was due, or even just in the middle, but just as
often those times would be empty. And I would work on grading during the
downtime instead (:

### Adding To Existing Projects

Due to a limit on the number of hours I could work in a week[^6], and a general
sense of wanting to do other things besides OS, I unfortunately did not do a
whole lot of this. I tried my best at updating the VM infrastructure to the
[now-publicly available version](https://www.intel.com/content/www/us/en/developer/articles/tool/simics-simulator.html)
instead of the older still-proprietary one CMU uses, and failed due to
some very interesting reasons that I should probably write up some time.

I _was_ able to write a small test program for P4 that ran on a hypervisor that
the students wrote, but really Dave did most of the tough stuff with super
funky cursed Assembly and I just had to understand why it worked and hook it up
into a small shell. It is called `dog` and when you type "dog" it types out
"cat" instead, wow crazy.

## Did I Enjoy It?

I think this was a very worthwhile experience! I highly respect Dave Eckhardt
so having more time to interact with him was fun. There were also some fun
parts to grading and office hours, but on the whole it was a lot of work. I
still would do it again though. Even if it feels like a slog during, I can come
out the other side feeling like "yeah, I Did That". Just like [taking
OS](2022-05-11-the-os-semester.html#section-3), I guess.

[^1]: It's a TA for a 4xx-level class, after all! And a prestigious one at that

[^2]:
    For being perpetually late. I did the best I could to not continue this
    trend, I believe a big reason is Dave taking on a huge workload and not
    being able to deliver until it would be _exceedingly_ inappropriate not to,
    not just regularly inappropriate.

[^3]:
    Dave likes to say that "just passing all the tests will get you to a C".
    I cannot say enough about the grading mechanism to confirm nor deny the
    veracity of this statement.

[^4]:
    _Lots_ of documentation. Everywhere. Explain the why of every single
    piece of code before I write it down because I _know_ I will forget stuff
    later.

[^5]:
    I needed basically the whole semester to get into a groove with grading,
    and Dave joked that he wants a return on his investment.

[^6]:
    20 hours. That turned out to not be enforced at all, and I could go over very
    easily without raising any flags it seemed.
