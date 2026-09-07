---
title: "Goodbye GuixSD"
date: "2025-09-07"
description: "I'm back on Arch now after giving both GuixSD and NixOS a try"
tags:
  - tech
  - linux
  - free software
  - guix
  - nix
---

In the last week I've given both GuixSD and NixOS a try, installing GuixSD on my desktop computer and NixOS on my laptop. In the beginning, things were alright, but as soon as I wanted to do more than just browse the web on my machines, things started to fall apart.

The problems I encountered were mostly the same, though GuixSD sadly had a few more issues. Pretty soon I came to the conclusion that doing development on these machines is actually harder than on a normal Linux distribution.

## The Nonguix Problem

First off, the whole nonguix issue. While I do have a certain amount of respect for the GNU project, the way they handle nonguix and proprietary drivers/firmware just seems so stupid. I think NixOS does it right here—during installation you get a checkbox asking whether you want nonfree firmware/software or not. That's it.

GuixSD could do something similar since they already check whether the machine you're installing it on requires nonfree drivers. Instead of just throwing an error, they should allow you to use linux mainline right there in the installer.

The installation of GuixSD was quite complicated. First I tried to follow some blog post on how to use a nonguix installation image, but that resulted in an unbootable system. Then I tried the CLI approach and gave up after `guix pull` still wasn't done after 2 hours.

The way I finally got it working was by installing GuixSD with linux-libre (since the desktop I was installing it on only needed nonfree drivers for WiFi and the GPU) and then switching to linux mainline for GPU drivers.

In general, I really dislike the overall vibes I get from the linux-libre fanatics. Why does it matter whether the nonfree firmware is loaded by the driver or shipped on the device itself? From what I understand, most of the supported hardware just ships the proprietary blobs on the hardware itself.

So it sounds like it's less about actually using/supporting free hardware and more about using devices that give one the illusion of freedom. I'd much rather see more effort being spent on developing actual free hardware alternatives and promoting them.

## Performance Issues

This is another issue I thought I might accept but just couldn't. Doing a `guix pull` is so atrociously slow that I can't accept it. We have blazingly fast machines these days, and with the right software they just fly.

For example, on the same machine I could install a basic Arch Linux system in about 5 minutes, then install packages for about 15 minutes, and restore my home directory from a backup on my NAS (which takes about an hour—could speed it up by using Ethernet or cleaning up my backups). But after that's finished, I have a system that works great.

I suppose with Nix/Guix the same should be even simpler since just loading my custom config should result in a fully working system. But arriving there seems to take quite some time. In general this isn't much of an issue for me since most interesting stuff lives in my home directory, and by now it takes me about 5 minutes to adjust the config files in my `/etc/`.

## Documentation Gaps

While Guix does have quite a nice manual, sadly it just wasn't enough. I regularly ran into issues and had to search the web to find somebody who had accomplished this somehow. Most of the time I just had to browse Guix configs from random people on GitHub and figure out what was possible and how by reading the source.

This was also a problem with NixOS, where there was even less documentation, but that was made up for by much more help on the web. There I could generally figure out most things by finding old posts on Reddit or Stack Overflow.

But while doing this, I started questioning the overall architecture. The general idea seems to be to provide an abstraction layer over the upstream software and then build the configuration out of Nix expressions/Scheme code. If that's the case, then each package maintainer is also maintaining a public API, which sounds like a lot of responsibility and should mean lots of high-quality documentation so people can figure out how to use these packages/modules.

Here I was quite disappointed that, at least out of the box, there wasn't a great LSP-like editing setup for these system configuration files. It would be fantastic if I could get autocomplete for all packages with inline documentation on possible values and what they do—like you get for pretty much any modern language. Even with a language like C, you get header files you can read to figure out how to use some library.

## Where Are the Promised Benefits?

One feature I was initially quite excited about was per-project dev environments. It sounded like a great idea, especially when combined with direnv. And on the terminal it actually works great—I could just `cd` into some directory and suddenly have a full C toolchain. Fantastic.

However, the problem is that this doesn't seem to play well with editors. Since I hadn't installed these globally, I had issues actually getting the required header files for the LSP, or the LSP in general. Additionally, getting tree-sitter grammars for Emacs just did not work at all. Emacs could not download the pre-packaged ones or compile them, and installing the grammars globally seemed to do nothing.

VS Code wasn't much better and also struggled with finding LSPs, ending with me just installing everything globally. Maybe this could be worked around by adding the editor to the environment, but I don't want multiple versions of Emacs/VS Code running all the time, and I do switch quite often between projects.

Additionally, I've noticed that for the projects I maintain/contribute to, I don't really need per-project environments since they all work with the latest versions of GCC/Rust/Node/SBCL.

It also seemed like quite often there wasn't any good abstraction at all, so I still needed to configure most system packages separately—only this time in Nix/Scheme instead of by editing a config file. To me this seems like quite a missed opportunity, since it'd be great if I could specify what behavior I'd like and then, depending on the backend/other installed packages, Nix/Guix would figure things out for me.

With a nice editor on top, this could be quite interesting. But the problem is that I already know how to set up all the system packages I care about, so now I have to learn a new syntax to gain what exactly?

## The Flakes Confusion

This is something I still haven't quite figured out. A lot of people seem really excited about flakes and use them for pretty much everything. But it's still an experimental feature, and some people advise against using it. To me as a newcomer, this is quite confusing—it seems like there are 2 ways to set up Nix but no clear description of when to use what.

## Internet Dependency Issues

While I don't travel quite as much these days, this has bitten me in the past when trying out GuixSD. You need to change a small part of your system config and suddenly it pulls in all these packages over the web, but you only have a cheap eSIM with limited traffic.

This is never a problem with normal distros—you can change your config as much as you want without any internet connectivity whatsoever. You can then plan ahead a little, and when you're at an Airbnb/hotel/cafe with nice WiFi, you update all packages.

## Conclusion

I still like the overall idea, but so far I've only seen it slowing me down in my daily work. Of course, this might be less of an issue once you get more familiar with the system, but for that to happen, good documentation helps a lot. Additionally, I need some things to work MUCH better out of the box to consider such a change.

It does seem like a nice way to manage cloud instances, though.

---

*Adiós,*
べン
