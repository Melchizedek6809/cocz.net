---
title: "What's Up with tRPC?"
date: "2025-08-07"
description: "Quick notes after using tRPC in a couple of projects"
tags:
  - tech
  - ai
  - rant
---

<div class="intro">
It seems that [tRPC](https://trpc.io/) has been getting quite popular these days, and while writing code for it is quite nice, it doesn’t seem to fix that many problems and just overcomplicates the project.
</div>

## What’s good about tRPC?
It does provide some benefits if you just want to build some backend API quickly. It is rather simple to add a new endpoint and then use it in a React frontend with full type inference. The whole context system is also quite neat and can make nested routes quite simple to implement.

## What’s bad about tRPC?
It obfuscates the actual network requests quite a bit, making it hard to debug what/when requests are actually happening. It also makes accessing the same API from languages other than TS/JS much harder than just implementing a REST API. In general, I don’t see much added value from tRPC over a well-engineered REST API which can be consumed by pretty much any reasonable runtime. It also seems to slow down `tsc` quite a bit, making the whole dev experience more sluggish.

It also makes simple things like uploading a file much more complicated, sometimes having to resort to workarounds like base64-encoding a file to send it to the tRPC endpoint. All of this is much simpler with standard REST.

Additionally—though this is harder to quantify—it seems to slow down the TS LSP… a lot. I’m working on some tRPC codebase where my M2 Mac requires over a minute after restarting the TS Server to show type information. Compare that to some standard TS full-stack apps I’m working on (with dependencies kept to a minimum) where it restarts in about a second or so.

More generally, I get the feeling that this is just another of these projects that make simple things just a little simpler at the cost of making other things much more complicated, and I’m not sure whether this is a good trade-off—especially considering that AI coding tools work really well at writing simple boilerplate code.

## Conclusions
Gave tRPC a try for some smaller projects of mine, and while it did work quite well, it didn’t feel like much of a game-changer since adding another endpoint to something like Express.js isn’t particularly complicated, though using these endpoints in a React frontend is quite easy to do.

---

*Adiós,*
べン