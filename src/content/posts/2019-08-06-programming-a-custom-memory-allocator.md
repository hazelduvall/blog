---
title: Programming a Custom Memory Allocator
tags: daily thoughts
---

Uh, it's super hard and I failed in the 2 hours I gave myself. The basic idea was this: keep track of the current block of memory, its size, and the index. If the index ever goes out of bounds, allocate a new block twice the size of the current one and copy everything over to that.

I first encountered a double-free error. Just wanting to get something to work, I commented out the code that freed the old buffer knowing full well that would cause a memory leak. No dice, now we have a use-after-free. No problem, silly me, I forgot to change the pointers within the data (lots of linked lists), so I'll just calculate the offset and add it to everything. Still nothing and now we're back to the double-free. I honestly have no idea what I did wrong but maybe it'll be clearer in the morning. If I can't figure it out soon, I'll just go to keeping track of all the malloc-ed memory in another art and free that iteratively (I was getting a stack overflow error when trying to free it recursively, which was why I build the allocator in the first place).
