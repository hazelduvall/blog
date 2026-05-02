---
title: WebRTC Perfect Negotiation
description: An addendum to the seminal Firefox blog post about Perfect Negotiation in WebRTC
tags: programming, Web, WebRTC
---

As part of my job, I have been working pretty closely with
[WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API), a
technology for doing real-time audio/video communications. It's an open
standard steered entirely _ahem_ supported by Chrome, so it's the natural
choice for anything Electron-based.

It's a peer-to-peer technology, so part of the standard includes specifications
for how the peers do a dance for agreeing on who's sending what tracks, who's
initiating the TLS encryption, what are the mutually supported codecs anyways,
that sort of stuff. This gets pretty complex since it's all being done over the
network, asynchronously. [Perfect
Negotiation](https://blog.mozilla.org/webrtc/perfect-negotiation-in-webrtc/),
then, is a way of setting up the callbacks for this negotiation such that
everything "just works" and both sides can use higher-level APIs instead of
worrying about the nitty-gritty.

The blog post linked above does an excellent job of explaining the concept in
more depth and providing code to go along with it. However, it's actually
slightly incorrect in my experience!

In the section for handling remote session descriptions, there is a piece of
code that goes like this:

```javascript
if (description.type == "offer" && pc.signalingState != "stable") {
  if (!polite) return;
  await Promise.all([
    pc.setLocalDescription({ type: "rollback" }),
    pc.setRemoteDescription(description),
  ]);
} else {
  await pc.setRemoteDescription(description);
}
if (description.type == "offer") {
  await pc.setLocalDescription(await pc.createAnswer());
  io.send({ description: pc.localDescription });
}
```

The error is as follows: calling `setLocalDescription({type: "rollback"})` in
Chrome when `pc.signalingState === "stable"` will throw an error. Additionally,
Chrome doesn't seem to guarantee the promises inside `Promise.all` are
necessarily run in order. So, the correct code would actually be something
like:

```javascript
if (description.type == "offer") {
  if (!polite && pc.signalingState !== "stable") return;
  await Promise.all([
    async () => {
      if (pc.signalingState !== "stable") {
        await pc.setLocalDescription({ type: "rollback" });
      }
    },
    pc.setRemoteDescription(description),
  ]);
  await pc.setLocalDescription(await pc.createAnswer());
  io.send({ description: pc.localDescription });
} else {
  await pc.setRemoteDescription(description);
}
```

The original blog post seems to assume that the order of arguments to
`Promise.all` will control the order more than I have observed.
`setLocalDescription` may be queued first, but it isn't necessarily polled to
completion first; in <chrome://webrtc-internals>, I see `setLocalDescription`
queued before `setRemoteDescription`, but `setRemoteDescriptionOnSuccess`
before `setLocalDescriptionOnFailure`.

Not sure if this information is present anywhere else online, I sure couldn't
find it when searching for "Failed to execute 'setLocalDescription' on
'RTCPeerConnection': Called in wrong signalingState: stable". Not that it will
matter, my blog has terrible SEO lol.
