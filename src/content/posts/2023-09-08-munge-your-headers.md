---
title: Remember to Munge Your Headers!
description: A writeup of a bug I encountered while working on some WebRTC code for Roam. Contains my debugging process and a solution to a probably-not-too-common problem.
tags: programming, Web, WebRTC
---

So for work, I've been hacking on the Selective Forwarding Unit
([SFU](https://webrtc.ventures/2020/12/webrtc-media-servers-sfus-vs-mcus/))
that we use to send media between clients. Through this, I've found a couple
bugs, one of which had quite a long but rewarding debugging journey.

## The Bug

This bug manifested in such a weird way that I didn't actually catch it at
first. Regular audio and video streams worked just fine. Screenshares
would start, but then crawl to a halt after the first few frames, or after a
couple seconds. I wasn't catching this bug at first because I was sharing my
static desktop and wasn't expecting it to change; only after I started doing
more intensive tests, running a clock on the screenshare for exact timing, did
I notice that things were weird.

## Debugging

At this point, I had done enough other debugging to have a fairly standard
checklist of things to look at. As usual, <chrome://webrtc-internals> was my
go-to.

Looking at the graphs for the screenshare upload, I was seeing plenty of
packets sent, as well as a burst of packets whenever there was large activity
on the screen.

![outbound-rtp graphs](https://static.duvallj.pw/2023-09-08-1.png)

![remote-inbound-rtp graphs](https://static.duvallj.pw/2023-09-08-2.png)

So, I could rule out:

- The upload transceiver not getting created
- The connection not getting negotiated
- The upload MediaStream not getting attached to the transceiver

Next, I looked at the download side. I saw a graph that matched almost exactly
what I was seeing on the screen: a burst of packets, and then nothing.

![inbound-rtp graphs](https://static.duvallj.pw/2023-09-08-3.png)

Because I was seeing _something_, I could rule out the same things as with the
upload. Which was concerning, because up until this point that's all I had been
checking. It seemed I needed to dig a little further.

I first fired up Wireshark to confirm that, indeed, packets _were_ actually
being sent from the SFU to the downloader. This was weird to me, since
Wireshark was reporting packets being sent even though Chrome wasn't reporting
any packets

I then ran Chrome in [debug logging mode](https://support.google.com/chrome/a/answer/6271282?hl=en)
and looking at a live tail of `chrome_debug.log`. In this, I saw a very
suspicious log message being spammed a bunch as soon as the faulty screenshare
started:

```
[6612:28688:1011/191519.091:VERBOSE1:rtp_transport.cc(196)] Failed to demux
RTP packet: PT=96 SSRC=2139439780 MID=e^A
[6612:28688:1011/191519.091:VERBOSE1:rtp_transport.cc(196)] Failed to demux
RTP packet: PT=96 SSRC=2139439780 MID=e^B
[6612:28688:1011/191519.091:VERBOSE1:rtp_transport.cc(196)] Failed to demux
RTP packet: PT=96 SSRC=2139439780 MID=e^C
```

Those `^` characters were actually unprintable! (Just had to reproduce them
here as text). It was looking like uninitialized memory, or a counter, and the
very least, something that should never have been encoded as text. The
[relevant line in chromium](https://webrtc.googlesource.com/src/+/branch-heads/5845/pc/rtp_transport.cc#196)
confirmed that
[yes](https://webrtc.googlesource.com/src/+/branch-heads/5845/call/rtp_demuxer.cc#100),
something was going very wrong, since this value should always be a string in a
properly-encoded packet. Somehow, the SFU was sending malformed packets!

### Where Does This Value Come From?

This MID (Media Identifier) value is supposedly to distinguish between
different media sections when multiple are bundled together. In practice, the
SSRC (Synchronization Source) value seems to be more than enough, but the
WebRTC standard
[requires](https://w3c.github.io/webrtc-extensions/#rtp-header-extension-control-transceiver-interface)
that MIDs be supported if multiple streams are bundled in one connection. To
save on the overhead of creating connections, we do bundle the screenshare
downloads with the camera downloads, and looking at the session descriptions it
was clear that this header extension was being negotiated.

### What Are Header Extensions?

Header Extensions are defined in
[RFC8285](https://www.rfc-editor.org/rfc/rfc8285.html#section-4) and are
basically little bits of extra data that don't need to be in all RTP packets,
and are negotiated per-stream like everything else in the SDP[^1]. To save on
bandwidth, each of the possible header extensions represented by a URI
(Universal Resource Identifier) gets mapped to an ID determined by the offering
participant. An example mapping looks like this:

```
a=extmap:3
http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid
```

This means that packets will have data for header extension ID 3 is fed into
the transport-wide congestion control mechanism, and data for header extension
ID 4 is the MID for the packet.

Because the malformed MIDs are specified in a header extension, I decided to
dump all header extensions for screenshare packets coming out of the SFU, and
sure enough, the header extension ID for the MID extension was present and
being set to invalid values!

## The Solution

Due to the nature of the SFU, the header extension id mappings can be different
for the uploading participant and the downloading participant. And, as it
turned out, we were not properly stripping all header extensions from uploader
packets before forwarding them to the downloaders. The correct thing to do
(which we were already doing for some header extensions) is to store any header
extension data out-of-band for forwarded packets, and just before sending the
packet to the downloader, add back in the header extensions with the correct
ids for that download stream.

And that's it! Hope you were able to take something away from this debugging
journey, I sure learned a lot about WebRTC as I went.

[^1]:
    The SDP also contains negotiation for media codecs, codec extensions,
    what streams exist, etc.
