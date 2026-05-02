---
title: Working at Facebook
description: A young and naïve intern details his experiences of not even 5 weeks at a large tech company
tags: daily thoughts
---

I think I've mentioned this in a previous blog, but ya I have summer internship
at Facebook. A big part of it was probably my school, as there are a lot of
other CMU rising juniors and seniors and graduate students here as well (all at
the same start date for convenience), but I like to think part of it was also a
good interview performance (what can I say i know some graph algorithms).

They had a whole team selection process, and probably because I put
"comfort using Rust(lang) = high" on the sheet and had systems just below AI in
terms of project preference, I was put on an infrastructure team working on a
large Rust code base.

### The Code

Ima wax poetic about how cool Rust is for a sec because this is my blog and I
make the rules here. So: **_Rust is super cool holy cow._**

- `rustfmt` makes sure no matter who writes the code, it all becomes readable
  at the end because everything from capitalization to spacing is opinionated.
- Builder patterns are encouraged by the language and safe to use and work
  pretty darn well as a result. If you don't know what a builder pattern is,
  it's basically something like

```rust
let foo = FooBuilder::new()
            .set_bar(5)
            .set_kaz(17)
            .build();
```

- The type system makes everything safe and even though you "fight" the
  compiler at times it's really all about making you code better and I love
  the very descriptive and colorful error messages

Seriously if you have a project you're considering doing in C or C++ due to
performance reasons just use Rust you'll thank me later.

Ok so back to Facebook: because the team is using Rust, and they didn't quite
expect an intern to have known Rust before the internship when they were
drafting up the project plan, I breezed through the first few tasks and am now
working on pretty real stuff that hopefully will be useful to other engineers
there. Can't divulge too much about the project specifics unfortunately but
it's fairly widely used internal app, I'm just adding more user-facing metrics
to it.

At this point, I'm sort of in a Rust + SQL part of the project, and may even
transfer over to Python + SQL once I need to use another certain internal
framework. I haven't actually used too much SQL before, but [SQL Builder](https://docs.rs/sql-builder/3.1.1/sql_builder/struct.SqlBuilder.html)
has been very nice to use in Rust, and the [Presto Docs](https://prestodb.io/docs/current/)
are surprisingly well-writen and informative. Sub-queries, `GROUP BY`, and
`FILTER(WHERE ...)` are magic, query executors doin some crazy stuff to get
those to be efficient with so much data.

Internal documentation alternates between "We have something from 2016 on it
but it's horribly out of date, just read the code (oh wait you don't even know
what the thing you're looking for is called? sux to be u)" and "Everything is
explained perfectly and has examples and test cases and is formatted well"
which is hm so I'm glad I have a good manager. Which brings me to...

### The People

With few execptions, everyone I've met at Facebook has been very nice and
willing to help. My team and especially my manager + peers have been extremely
helpful at answering my n00b questions at any hour of the workday and making me
feel welcome and appreciated. Another great thing, what I also liked about CMU
and TJHSST and what I should expect from most good tech companies, is that
everyone is super smart. I like being surrounded by smart and hard-working
people because that in energizing and I like both the environment and how it
makes me a better person.

In some respects, I may have been lucky, because hearing from a few other
interns (during optional organized "just get on a call and hang out with
other interns in an unmonitored breakout room" that of course I'm going to go
to) it seems not all the teams are this quality or they're having trouble
adapting to work and not getting enough support or they don't really like the
work they were assigned or whatever. I can get jazzed about lots of
computer-related stuff and like to be sociable so that helps, but I'm still
very glad I got the team I did.

<hr/>

**TL;DR Facebook is a neat place with neat projects**, still don't know how
much I agree with their ethics even with them trying to turn themselves around.
