---
title: What Makes Rust Amazing?
tags: daily thoughts
---

I've been thinking about this for a while, and I think it's finally time to put
these thoughts into a blog post. Will update this later to fill out missing
sections but right now I just gotta put these thoughts down while I have some
time.

### Overview

- [References and Ownership](#references-and-ownership)
  - [Lifetimes](#lifetimes)
  - [Real Move Semantics](#real-move-semantics)
- [Good Defaults and Good Tooling](#good-defaults-and-good-tooling)
- [Culture of Safety](#culture-of-safety)
- [Algebraic Datatypes](#algebraic-datatypes)
- [Traits Instead of Objects](#traits-instead-of-objects)

Note I have organized these in decreasing importance, at least in my view.

## References and Ownership

This is the **_biggest_** thing ever. Like the other stuff I mention later on
is really important too, but without this _you don't have Rust_, you have
something like Zig or D which while still very good, simply just can't provide
the same guarantees that Rust does in terms of memory safety.

A simple explanation of references in Rust: there are two types:

- `&T`, an immutable a.k.a. shared reference
- `&mut T`, a mutable a.k.a. exclusive reference

Coming from C++, the analogues are `const T&` and `T&`, and coming from pretty
much any other language the analogues are... kind of nothing. If you have a
reference to an object in Python, Java, Javascript, Go, etc., it's a mutable
one, with kind of um no guarantees around really really classic problems like
thread safety and mutable aliasing.

A classic example of mutable aliasing, a.k.a reference invalidation, is the
following:

```c++
#include <iostream>
#include <vector>

int main(int argc, char** argv) {
    // Create a vector
    std::vector<int> x = {1, 2, 3, 4};
    // Get a reference to the second element in the vector
    const auto& y = x[1];
    std::cout << y << std::endl;
    // Mutate the vector, invalidating `y`
    x.push_back(5);
    std::cout << x[4] << std::endl;
    // ***Insta-UB***
    std::cout << y << std::endl;
}
```

The funny thing, the absolutely hilarious thing is that, at the time of this
writing, no modern C++ compiler (gcc, clang, MSVC) catches this in their
standard compilation pass, even with all warnings enabled. The equivalent Rust
code:

```rust
fn main() {
    let mut x = vec![1, 2, 3, 4];
    let y = &x[1];
    println!("{}", y);
    x.push(5);
    println!("{}", x[4]);
    println!("{}", y);
}
```

shows a very readable error messages explaining exactly how You Messed Up:

```
error[E0502]: cannot borrow `x` as mutable because it is also borrowed as immutable
 --> src/main.rs:5:5
  |
3 |     let y = &x[1];
  |              - immutable borrow occurs here
4 |     println!("{}", y);
5 |     x.push(5);
  |     ^^^^^^^^^ mutable borrow occurs here
6 |     println!("{}", x[4]);
7 |     println!("{}", y);
  |                    - immutable borrow later used here

For more information about this error, try `rustc --explain E0502`.
error: could not compile `playground` due to previous error
```

This is huge and prevents whole classes of memory errors simply by enforcing
mutation to only be done by one "section" of code at a time.

### Lifetimes

How this gets enforced is with lifetimes. A lifetime can be thought of as "how
long a reference is good for". In the above example, we got an error because we
had a shared reference's lifetime overlap with that of an exclusive reference.

Lifetimes are also useful because the maximum amount of time a lifetime can be
valid for is the lifespan of an object, from when it is created (think
`malloc`, but you can also have stack-only objects) to when it is dropped
(think `free` or popping the stack frame).

### Real Move Semantics

Ownership is the other mechanism that makes this possible. I distinguish Rust's
ownership and move semantics from C++'s icky thing where a """moved""" object
is still valid but """empty""" somehow because this is the Real Deal; once you
move a Value (data in memory) out of a Variable (label in the program), that
Variable is no longer valid. To even do a move in the first place, the compiler
must guarantee that there are _no outstanding references to that variable_.

This mechanism allows the compiler to **automatically insert calls to drop
values** when it detects a variable with ownership cannot possibly be used
again. Again, this entire system is just a really neat way for the compiler to
statically guarantee exclusive mutation of objects, which is much more
complicated but just as important as doing bounds checks on all accesses.

TODO: explain this better

## Good Defaults and Good Tooling

TODO

## Culture of Safety

TODO

## Algebraic Datatypes

TODO

## Traits Instead of Objects

TODO

<hr/>

So yeah sorry it's unfinished and a bit rambly, I promise I'll get around to
the rest of it eventually, at some point, later idk
