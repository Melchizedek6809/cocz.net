---
title: "Planetarium: keeping track of architecture while vibecoding"
date: "2025-07-29"
description: "I've made a little VS Code extension that shows me a graph of a project and all dependencies, will try it out while vibe coding to (hopefully) keep the slop at bay"
tags: ["software-architecture", "ai-agents", "vibecoding", "llm-development", "vs-code", "tooling"]
image: /img/planetarium/planetarium0.webp
---

<div class="intro">
Just a simple tool I've built for myself that hopefully helps keep a codebase clean during vibecoding
</div>

[![Screenshot of planetarium looking at Wolkenweltn-ts](/img/planetarium/planetarium0.webp)](/img/planetarium/planetarium0.webp)

## Why I Built This

So, after ranting a bit about how terrible vibe coding is for anything somewhat complex I've researched a bit and it seems that managing context is one of the main problems for coding agents. Additionally there seems to be some indicators that AI agents do a better job while working on microservies. This led me to try it out myself and so I started refactoring the bitmenu codebase a bit to try and decompose and modularize it better, and while not object/scientific it does seem to improve the quality of the changes claude code makes.

To better understand the codebase, especially as it's undergoing rapid changes due to AI agents, I've built myself a tool in the form of a VS Code extension for quickly visualizing what the current architecture is, focusing on quickly showing which modules are referenced throughout the codebase as well as providing some ballpark figures for complexity (lines of code... not great, I know, but it's probably one of the simpler metrics to calculate).

[![Screenshot of planetarium looking at Codewaifu](/img/planetarium/planetarium1.webp)](/img/planetarium/planetarium1.webp)

I've also (well Claude Code to be exact, it's 99% vibecoded) a feature that colors nodes/arrows red/green depending on whether they've been added or removed when compared to the last commit. This should hopefully quickly indicate when an AI agent starts importing like crazy increasing overall system complexity. Since it seems like the ideal are many modules that only depend on a handful of other modules.

Also have to say that Claude Code worked really well here, I was pretty much only doing testing (apart from debugging some minor issues in the beginning) and providing overall guidance on what to do, which features to add (and also which to remove). Though I suppose this just underlines that AI agents are remarkable for small projects, but then quickly grind to a halt as the system
gathers a complexity that is too big to fit into the limited context window of today's models.

Now, I've only spent about an hour to build this prototype but I'll be testing it out in the coming days while working on some other projects of mine to try and reduce complexity. Might actually end up publishing it to the repo if it ends up being useful to me, since so far it's just an idea.

-----

*Adiós,*
べン