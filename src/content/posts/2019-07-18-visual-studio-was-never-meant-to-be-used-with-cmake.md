---
title: Visual Studio was never meant to be used with CMake
tags: daily thoughts
---

Today I was locked in bloody struggle with CMake + Visual Studio, trying to get a small-ish open source project to compile. After 3 hours of non-stop effort, I can say that I have been defeated for now but am not giving up hope. I got past all the stupid cmake errors and the stupid dependency errors but am stuck on a stupid linking error (seriously? Why is it trying to link to a binary that I never told it to? **and whose name is only slightly different from the one it should link to?**)

It could be worse. At least this software was meant to be built on Windows with MSVC. And has a binary release in case I give up. But I won't. Probably.
