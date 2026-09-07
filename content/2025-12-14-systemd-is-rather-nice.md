---
title: "systemd is rather nice"
date: "2025-12-14"
description: "Managing a Rust/Axum backend with it left me quite impressed"
tags:
  - tech
  - systemd
  - linux
  - devops
  - webdev
---

Hey, so for the last month I've been playing around a lot with Rust and writing various backends with it, trying out various architectures and crates and see which combination I enjoy the most. Still really content with Axum and the overall choice of Rust, don't quite know why but writing Rust is just so satisfying, you do a huge change and then just fix the compiler errors / clippy errors one by one and for the most part if it compiles things actually work (unlike other languages/runtimes).

Now, one of the bigger projects I've started is a new kind of git forge called [RubHub](https://rubhub.net/) and since I wanted to start dogfooding it pretty much immediately I had to figure out how to deploy this thing.

First up I just went with Docker, mainly since a Dockerfile makes it rather simple for other people to run you backend software meaning I'd have to write one anyways, might as well use it myself. So after finishing that I just setup a super simple compose file to actually run that thing on some VPS. And while it does work I wanted to support multiple replicas from the beginning, not because it's necessary but because it should be quite simple as long as your state lives somewhere else. And while it did work there were a couple of things I noticed that I quite disliked.

## Using Docker Compose in production

So one of the problems that I encountered quite early on was that I had to use `network-mode: host` because I am using `SO_REUSEPORT` to have multiple processes listen on the same socket and have the Linux kernel load-balance between them. I could have also done this in the nginx reverse-proxy that does TLS but I didn't like that I'd have to specify in the nginx config every replica, kind of liked the simplicity of just running multiple processes and nginx not having to know how many replicas there are right now.

In general this works quite alright, of course that behaviour only works on Linux which is fine since for now that's the OS I'm using for serving the "production" site.

Apart from that one thing that bothered me is that the implementation in `podman` doesn't seem to support multiple replicas, additionally from what I can tell compose doesn't really check if a replica went down or restart them which kind of seems to be the main benefit of having them in the first place.

Additionally one thing that irked me was that the Rust backend only used 6-10 MB of memory, but then docker added another 123 MB on top of that, not sure about you but doesn't sit right with me if a "slim" container runtime uses 10x the amount of memory than the actual service.

## systemd

So while Docker does work I wanted an alternative that was a bit leaner, funnily enough I landed on systemd. It's already managing the VPS anyways so might as well use it for managing this service as well. So first I just wrote a very simple unit file running a single replica, easy enough and worked quite well, multiple replicas were also quite simple to add by just using a templated service, so now I could just do `systemctl enable rubhub@1 --now && systemctl enable rubhub@2 --now ` and have 2 replicas up and running. Rather nice, another nice benefit of using systemd is that I don't have separate system/application logs, they both get put into journald and then transmitted to my Grafana dashboard. So now I was looking into what other things I might try to make things more resilient, and found out about the whole notify system and of course there was already a Rust crate for using it. This now allows my backend to tell systemd that it started up correctly and is ready (with an additional timeout/check that produces an error in the syslog if it failed to start up in a certain amount of time) as well as a watchdog that requires my backend to regularly notify systemd otherwise it gets restarted and an error gets put into the syslog. This seemed rather nice, especially when using a single-threaded async runtime this meant that if for some reason a task got stuck in an infinite loop (or very very long operation) I could detect this. Rather nice since this actually protects the backend against a lot of mistakes I might make, I mean sure I try my best not to write code that could end up blocking the entire runtime but mistakes do happen and it's nice to know that in that case the application server will be restarted and an error appears in the syslog for me to investigate later.

Additionally I found it quite nice to find out that you could also directly give the capabilities to the service to open a privileged port as a normal user, should harden things some more since otherwise I'd have to run things as root and drop privileges, but much simpler to just run as a restricted user from the beginning.

## Conclusion

So in general I have really underestimated systemd, there is a lot of hate on the internet about it bloating up systems and everything but I have to say here I quite liked the various features it provides, from what I know there aren't many init systems doing similar things, generally requiring you to write your own supervisor / service manager if you want more sophisticated monitoring/supervision, so quite nice to know that a single 50 line unit file, and about 30 lines of Rust code are sufficient to get you all of those benefits.

---

*Adiós,*
べン
