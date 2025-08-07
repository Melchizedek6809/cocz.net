---
title: "What's up with tRPC"
date: "2025-08-05"
description: ""
tags:
  - tech
  - ai
  - rant
---

<div class="intro">
It seems that [tRPC](https://trpc.io/) has been getting quite popular these days, and while the development experience is rather nice. It doesn't seem to fix many problems and just overcomplicates a lot of things.
</div>

## What's good about tRPC?
It does provide some benefits if you just want to build some backend API quickly, it is rather simple to add a new endpoint and then use it in a React frontend with full type inference, the whole context system is also quite neat and can make nested routes quite simple to implement.

## What's bad about tRPC?
It obfuscates the actual network requests quite a bit, making it hard to debug what/when requests are actually happening, it also makes accessing the same API from languages other than TS/JS much harder than just implementing a REST API. In general I don't see much added value from tRPC over a well engineered REST API which can be consumed by pretty much any reasonable runtime. It also seems to slow down tsc quite a bit, making the whole dev experince more sluggish.

It also makes simple things like uploading a file much more complicated, sometimes having to resort to workarounds like base64 encoding a file to send it to the tRPC endpoint. All of this is much simpler with standard REST.

-----

*Adiós,*
べン