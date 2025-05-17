---
title: Deep Learning Research Project
description: My group's final paper for CMU's 10-417 Fall 2021 research project. We used seq2seq transformers to explore title generation from abstracts.
tags: projects, AI, CMU
---

This semester, my group and I at CMU did some simple research for 10-417,
Intermediate Deep Learning. By "group" I mean fellow undergraduates in the
class. **You can view the paper [here](https://static.duvallj.pw/f21-10417-project.pdf)**.

Our project inspired by [the arXiv dataset on Kaggle](https://www.kaggle.com/Cornell-University/arxiv),
specifically one of the tasks, "Title prediction by abstract". That seemed
pretty cool, and a good opportunity to learn about modern NLP models, so we
dove right in.

Looking back on our progress, I probably should've spent less time reading and
debugging frameworks that didn't work, and more time training models. I read
a lot about Language Models, models that predict how likely a given piece of
text is to be non-gibberish, only to come to the conclusion they aren't very
good at summarization anyways. Still, trying to understand them to the level
that I attempted to implement them was very helpful to understand the basis
behind a lot of other techniques; I got to see how everything "fit together" in
a sense.

One of the main takeaways from the project was that this task is a lot harder
than it seemed! Many titles are pretty creative, not having an obvious relation
with the abstract or using non-standard lingustic constructs. Other titles were
able to be predicted a lot more easily, and on the whole there was a wide range
of prediction accuracy. Seeing predicted titles was humorous at times, I
wonder if I should set up a Twitter bot or something...

**TL;DR** [paper here](https://static.duvallj.pw/f21-10417-project.pdf), didn't get good results
but learned a lot.
