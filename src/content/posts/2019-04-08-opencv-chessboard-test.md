---
title: OpenCV Chessboard Test
tags: projects, Computer Vision, TJHSST
---

This was for my Computer Vision class. This thing was pretty simple once you understood it all.

<div>
<figure><video controls src="https://www.hazelduvall.dev/static/test9-small.mp4" style="width: 100%"></video></figure>
The cube is drawn in perspective on the chessboard
</div>

The hardest part was getting the chessboard pattern even when the tissue was obscuring part of it. That could be solved by finding the closest point from the previous frame, only taking the ones with a certain min distance, and calling `cv::solvePnP` on the filtered chessboard pattern.

The next challenge is to do the same thing without the chessboard, but it's pretty hard. Links for future reference:

- <http://users.ics.forth.gr/~lourakis/levmar/index.html>
- <https://people.eecs.berkeley.edu/~yang/courses/cs294-6/papers/TomasiC_Shape%20and%20motion%20from%20image%20streams%20under%20orthography.pdf>
