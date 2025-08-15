---
title: "Why has Linux stopped innovating?"
date: "2025-08-16"
description: "Some thoughts on what's happened to Linux over the last decade and why new technologies haven't been widely embraced"
tags:
  - tech
  - linux
  - free software
---

<div class="intro">
While researching users of io_uring, I've gone down a tangent trying to figure out why most new Linux technologies aren't seeing much adoption
</div>

## Introduction
I've been using Linux and BSD Operating Systems for about 20 years now, starting with Fedora Core 5, switching to Ubuntu after a while, then moving to Arch Linux and mostly staying there while using Gentoo, Alpine, NixOS, GuixSD, FreeBSD and NetBSD on and off.

In general, I've noticed a change in the overall community which seems less enthusiastic these days. Back then a new release was exciting, and podcasts like the Linux Action Show exemplified a certain passion and enthusiasm that somehow got lost over the years. Additionally, it seems that a lot of newer Linux components have mostly angered and fractured the community, with many distributions defining themselves by NOT using certain components (glibc and especially systemd, for example).

## Pulseaudio
This was probably the first one that saw widespread hate, with people actively advocating against its adoption. Especially as users got forced into using it over time because various applications dropped support for ALSA, leaving people to either run pulseaudio or find alternatives for those apps. (I do remember getting quite upset at Firefox dropping ALSA support, since I generally much preferred ALSA/JACK and had a lot of issues initially with pulseaudio.)

## Unity
Another forced replacement that angered a lot of people (or maybe they were just very loud). I know that I was affected by it and switched from Gnome 2 to ratpoison, which over time led me to Arch Linux. Most of the issues I had with my Ubuntu installation got fixed because I looked things up in the Arch Wiki, which got me wondering why I wasn't using that distro since their wiki seemed to have all the answers. I absolutely loved my setup back then when they still had their own BSD-inspired init system.

## Gnome 3
Gnome 3 was also met with a lot of resistance. It did feel like it overly simplified things to a fault, trying their hardest to hop on the tablet bandwagon (the iPad was released just a bit earlier—coincidence? I think not!). It was rather bad in the beginning from what I remember, though in the long run they kind of got their act together and made it work somehow for desktop users. I know a friend of mine was running Gnome 3 for quite a while, and I never really could get used to it. It just felt so dumbed down and generally not like anything that made efficient use of screen real estate. Also, though this is subjective, it never really looked all that pleasing, especially if you compare it to modern KDE versions which do look gorgeous (though I prefer something more minimal, I can respect KDE).

It's also interesting that this caused a fork of the Gnome 2 codebase named MATE—the first time I've seen a fork of an old version gain some sort of traction. But that might just be because Gnome 2 was actually really good and, with the right theme, also looked quite good for its time.

## Btrfs
Back in the day this was hyped quite a bit—finally replacing the aging ext4 default with a proper modern CoW filesystem. I did try it out a couple of times and it was the only time I've had data loss due to a filesystem bug. Never again gave it a shot. Also, from what I can tell, it's been in development for quite a while and hasn't gained much traction, with most distros still using ext4. Generally it seems like xfs/zfs have gained more adoption.

## systemd
Probably **the** most controversial change in Linux, with a lot of outrage from the community and many forked distros that just remove systemd and replace it with something else. I was also quite against it in the beginning, having a lot of issues when Arch switched to it. Though over time it has mostly stabilized and works quite well now. Also, having some sort of standard way for defining/running services seems like a good idea.

## Wayland
Another replacement for some older *nix technology that's mostly Linux-only and which a lot of people actively avoid. This time it's also quite justified since, for the most part, basic functionality barely works after over a decade of development. I mean, just try to record your screen on Wayland—depending on your compositor it might work or not. In general, the issue here seems to be that working old technology gets replaced by some hyped piece of technology that doesn't really improve things that much, while breaking a lot of edge use-cases which angers power-users who require these features.

## Docker
While some people really dislike Docker, it has become pretty much **the** standard way of packaging software for production. Still, it seems to have split the community a bit, and the missing BSD support leaves a bad aftertaste since this makes using FreeBSD much harder for servers. Before, it didn't really matter that much since to user space programs it seemed similar enough to not cause many issues.

## io_uring
Another hyped technology that seems to not really have much of an impact. Although in this case there wasn't much outcry over it, probably because it can be completely avoided if one doesn't want to use it. It does promise some big performance improvements which a lot of people would enjoy. From what I could tell, there isn't really much software that uses it. I would have thought that by now software like nginx, apache, and HAProxy would have incorporated it to gain a nice performance increase. Kind of wonder why that is?

## Wireguard
Not sure whether this can be considered a Linux innovation. It seems to be widely adopted by now, with most OSes having support for it—probably just because it works much better than OpenVPN while being much simpler to configure. Adding this mainly to end things on a somewhat optimistic note.

## Snap
I don't know anybody who actually likes to use snap packages. It's also quite infuriating that quite often snapd is running on Ubuntu servers that aren't using a single snap package, but it's still running, eating up quite a bit of CPU for something that's not being used at all.

## Conclusions
I'm wondering what has been happening. A lot of these technologies were met with resistance and sometimes forced on users, leading to a lot of anger. Also, generally it's not really clear whether things improved at all. The Linux machine I'm using today isn't really all that different from what I've been running a decade ago. At times I do try out newer distros and come away quite dissatisfied, though I am quite impressed with KDE, which is just a gorgeous desktop environment. Additionally, Krita, KiCad and Kdenlive have all come from KDE and are absolutely fantastic pieces of software that work great and provide excellent alternatives to proprietary software.

Another observation is that most of these hyped but seriously flawed projects came from either RedHat or Canonical. Maybe this is just the result of Linux development mostly being done by corporate programmers instead of the free software hackers who did most of the early work.

---

*Adiós,*
べン