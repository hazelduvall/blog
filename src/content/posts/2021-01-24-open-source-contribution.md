---
title: My First "Real" Open Source Contribution
tags: AI, Computer Vision, projects
---

Near [the beginning of winter break](./2020-12-21-finally-more-time.html), I
had an idea to contribute an implementation to ONNX, Microsoft's Open Source
neural network accelerator. I had just been dropped from the Aerospace
internship (due to accepting a position for Facebook's summer software
engineering internship (more on that later I swear)), and AI ideas were still
fresh in my mind, so it was a good opportunity to keep my programming skills
sharp.

I'm proud to announce that I've done it! You can check out my work [here](https://github.com/onnx/models/blob/master/vision/object_detection_segmentation/fcn/README.md).
The full README.md is a bit too wordy to include (and honestly is redundant to
list again here), but I'll include the description section so you have an idea
of what I was working on.

<hr/>

### Description

Fully Convolutional Networks (FCNs) are a neural network model for real-time
class-wise image segmentation. As the name implies, every weight layer in the
network is convolutional. The final layer has the same height/width as the input
image, making FCNs a useful tool for doing dense pixel-wise predictions without
a significant amount of postprocessing. Being fully convolutional also provides
great flexibility in the resolutions this model can handle.

The specific model I contributed can detect 20 different classes, corresponding
to the [COCO 2012](https://cocodataset.org/#home) class analouges of the
[PASCAL VOC](http://host.robots.ox.ac.uk/pascal/VOC/) classes. The models were
sourced from PyTorch models pre-trained on the COCO train2017 dataset using this
class subset.

<hr/>

Oh, also, something I should mention: today is a double post! Go check out
[the previous post](./2021-01-23-facestuff-1.html) for more code stuff I did recently.
