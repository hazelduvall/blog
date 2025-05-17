---
title: I Made A Webring
description: "In which I show off a webring that I brainstormed w/ some college friends & wrote in under 3 hours"
tags: Web, CMU
---

Recently, both I and a friend of mine (James) have dove back into making our
blogs better. I don't have a whole lot of graphical changes to show for mine,
so [his](https://gallicch.io/) is **much more impressive**. When he showed it
off in the Discord we share with the rest of our CMU friends, it garnered a lot
of attention, and one thing led to another, and suddenly the talk about
"wouldn't it be neat if we were all in a webring together?" turned into me
having a domain name in my cart & plans to write the darn thing from scratch
the next morning.

<https://cmuwebr.ing/> is the result. I'm pretty proud of it; took 2:30hr from
"ok let's bang this thing out" to "website is live & ready to have sites added
to it". I read some other webring implementations before trying this, but chose
not to use any because it really is too darn simple to _not_ just write your
own that you fully control, imo. There is a file
<https://cmuwebr.ing/static/sites.json> that the server (written in Python
using [Sanic](https://sanic.dev/)) reads, and each site on the ring indexes
into it w/ their ID, and the server takes care of redirecting the prev/next
links. I also plan on writing a Javascript snippet that will parse said JSON &
replace the links on the page so redirects don't have to go thru my server, but
that's for later.

As the founder of the webring, of course I'm already on it! You can see it at
the bottom of every page. I think this is a very good use of the footer space;
I do want to encourage more "low-tech" ways of socializing and discovery on the
internet. RSS feeds, webrings, emails, it's like I've travelled back to the
90s!! Not to be all RETVRN (HTML is **_way_** better than it was back then) but
yeah I enjoy this a lot more.

If you're a CMU friend & want to join the webring, view the instructions on
[GitHub](https://github.com/duvallj/cmuwebr.ing). Or send me an email! If
you're not a robot I'm sure you can find where...
