---
title: "Vibecoding: why Claude Code is the wrong approach"
date: "2025-07-24"
description: "Putting the AI coding assistant in a separate CLI is a terrible idea"
tags: ["tech", "ai", "rant"]
---

## The promise vs. reality

In the last couple of weeks I've been using Claude Code extensively, both at work and for my own side projects.
And while in the beginning the results looked impressive, I'm now quite dissatisfied and convinced that the entire
approach is wrong as long as LLMs don't make a huge leap forward in capabilities.

While it is impressive that you can give a short description to Claude Code and have it go at it, adding tasks, finishing them and in general just generating lots of code, in my experience it completely fails to do anything useful as soon as the project
you're working on becomes slightly more complicated.

## Why Cursor worked better

This was to be expected, however I did not anticipate that as soon as your project spans more than a couple thousand lines things
seem to completely fall apart. With Cursor this was much less noticeable because it was integrated into the IDE, putting you in
charge and if you thought about the problem, added the necessary context and provided a detailed prompt on how to fix it combined with some good rules defining your overall style/taste would give quite satisfying results.

## The CLI problem

Putting Claude Code into a separate terminal pushes one into the direction of only giving high-level directions, if you also couple this with a missing diff view you're pretty much expected to take on a more hands-off role and let the LLM do its thing.
In general I have to say that outside of building a super dirty prototype Claude Code has become quite useless to me since any
project I've been working on for more than a couple days quickly exceeds that threshold where it just starts messing things up.

It also seems as though this is a sort of gradual decline, kind of like the bigger the codebase gets the less it understands it and just ends up complicating things much further which quickly results in a state where neither LLM nor I understand what is going on anymore. Although at times it's quite surprising how it gets very simple things wrong, for example executing `pmpn` instead of `pnpm`, while it quickly realizes the mistake this mistake has me quite concerned. The missing IDE integration also means that it doesn't get immediate linting errors, instead having to manually try and run the type checker or linter (which it doesn't do all the time).

So in general I think that these AI agents need to be tightly coupled to an IDE to allow for quick review/iterations because they mess up quite often. Letting the LLM run loose for 10 minutes, generating thousands of lines of code doesn't seem to work at all apart from whipping up a quick landing page or something. Sometimes it kind of works, but as soon as you seriously start testing the code it generates it becomes super buggy.

## What it's actually good at (not much)

Although to be fair, it is quite good at implementing standard functions but even here I had to interject pretty much all the time to fix errors (or prompt it to fix the mistakes). It seems that most people would like for these coding agents to run completely unattended, just give it a ticket and off we go. From what I've seen on multiple projects now this rarely works out at all. At times it also builds quite reasonable UI components as long as they're not too complicated, though I'm not sure whether this is actually helping all that much considering that there are a lot of high quality component libraries and most of the work is just combining these in a sensible manner.

## What I actually want

I think tight coupling with an IDE is quite important, it also needs to be super low-effort to get the LLM to take over, like the Cmd/Ctrl + K key in Cursor (would love a voice interface here). Additionally integrating something like Playwright from the beginning and analyzing the project to provide clear instructions on how to handle common tasks as well as how to debug seem essential, somehow Claude Code doesn't seem to adhere too well to these.

## The verdict
For now I'll greatly reduce my usage of AI coding tools, Cursor was in a sweet spot for a bit there, but the recent issues have made me a little pessimistic about it. Additionally it was super slow all the time, making VS Code feel almost snappy in comparison. Apart from that I'll keep working on Codewaifu in my spare time and maybe get a usable coding agent out of it.

-----

*Adiós,*
べン