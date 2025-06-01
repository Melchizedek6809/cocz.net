---
title: "MaoMi - Building a Vibe Coding Platform for Web Games"
date: "2025-05-11"
description: "Exploring my journey creating MaoMi, an LLM-powered platform that aims to make web game development accessible to non-programmers through AI assistance, asset generation, and intuitive interfaces."
tags: ["tech", "projects", "ai-coding", "gamedev", "web-games"]
image: /img/maomi/maomi1.webp
---

[![Screenshot of the current MaoMi LLM-Assitant](/img/maomi/maomi1.webp)](/img/maomi/maomi1.webp)

<div class="intro">
I've started on another project called MaoMi: the idea is to make a sort of v0/bolt.new for GameDev. My main goal is to get more familiar with building sophisticated LLM-powered tools.
</div>

## Why MaoMi?
After using Cursor for quite a while, I'm still super impressed with how much it can actually do when prompted properly. Especially in the beginning of a project, it can one-shot a lot of complicated programs. From my experience, most issues start appearing as the codebase grows.

There are certain projects, though, that never really grow above a certain size, mainly GameJam games and little browser games. I was thinking that for these kinds of projects, using an LLM might actually be great and even be a workable solution for non-coders.

This idea came to me because many friends have asked over the years how to get into GameDev. They enjoy playing games and have had ideas for little games they'd like to build but don't know where to start. Setting up Cursor and a local dev environment already seems too much for them. Building a platform where the beginning is super simple might be worthwhile—if the idea ends up being good, they can export everything and proceed with Cursor/Windsurf to make a proper game.

Another limitation of editors like Cursor/Windsurf is that they don't specialize in games, so they can't generate assets for you. It would be great if one could simply say `I want a snake game, but instead of a snake it should be a cat eating fish` and it generates the code, graphics for the cat/fish, and maybe even sound effects and a cute soundtrack.

## Core Features
Here's a short overview of the planned features and the current state, since I've already been working on this for a couple of days.

### Game Browser & Distribution Platform
Distribution is quite the problem. I've seen this when working with teens, teaching them how to build games with Python/PyGame. After a while, they want to show their friends the cool games they've been working on... and it's terrible. Making an executable is a lot of work, and then they might need to host it somewhere. It would be much simpler to just send a link to friends and be done with it. A browser game might even work on mobile devices (as long as there are touch controls).

To make this super easy, MaoMi has a Game Browser from the beginning. Every game being created has a little page with the game embedded as well as information about it. This section can be extended with a comment section/upvoting, but this isn't strictly necessary in the MVP phase.

### Game Templates
Another issue is that people don't know where to start, which engine to pick, and generally how to proceed from their idea. To make this super simple, I've added a template system. After creating a new game, the user chooses whether it should be 2D or 3D (only 2D is supported for now). Then it uses a template with a working example in Phaser.js / Three.js depending on the choice, allowing them to iteratively change things to get closer to their idea.

By limiting the choices, we can ensure that the starting point is actually good and also ensure that the LLM knows how to develop for this. Additionally, we select technologies that don't need complicated dependencies.

### AI-Powered Editor
Unlike Cursor, we're actually hiding most of the code. It is available in a separate tab, but the idea is that users should only use the AI to modify the code. Right now, we have a 2-column setup with the game running in the left column and a chat interface on the right where users can describe what they want to change. This lets them instantly see the results.

### Voice Interface
I haven't started on this yet, but I'm quite excited about adding a voice interface, which might completely replace the chat interface. This should make things much easier since most people talk way faster than they can write. Additionally, this frees a lot of screen real estate, allowing a full-screen preview of the game where we're just listening to the player as they play and then modify the game as it's being tested.

Another benefit is that this actually allows it to be used on a phone/tablet, since typing is quite a chore there, but talking to your phone is much simpler and quicker. This is especially important since many people these days don't have a computer/laptop but just a phone.

### Asset Generation
This is one of the biggest features for me, and also one where I still have no real idea how well it will work. I'm thinking of trying various diffusion models like Flux/Stable Diffusion with strict presets to hopefully create usable assets. 

I might separate some features, for example, generating tilemaps seems like a common enough task that it might be useful as a standalone feature. Or creating a walking animation for a sprite—one just provides a sprite looking down, and the AI then generates a simple 3-frame walk cycle in all 4 directions. This would be a feature I'd love to use (a separate tool can generate the first sprite based on a description).

Sound effects would also be great to generate directly. It might be sensible to build a tool that gets two separate inputs: one describing what the sound effect should sound like, and another with an overall art direction describing the feel to achieve (a punch sound for a Mario game should sound very different from one for a gory Souls-like).

Background music could also be generated automatically given the overall art direction/tone of the game and the specific situation where it's played. At least in my opinion, it's probably more important for things to sound like they all fit together.

### Version Management
Not quite as exciting as the other features, but absolutely essential nonetheless. Cursor seems unusable without a Git repo or the ability to rollback, since at times it just makes things worse with every change. Being able to start over from the last known good version is required to avoid giving up entirely.

### LLM Avatar / Character
Another idea that many people really like is giving the LLM an avatar and personality. This came about because I always like to change the prompt in Cursor to give the assistant a personality, since the default seems rather dull/cold/corporate. One teen I showed Cursor to changed their assistant to only respond in rhymes, which he absolutely loved and laughed at during many interactions.

I think this can be enhanced by giving the LLM an actual avatar that can move around, show animations, and display stylized emotions. The first (and only in the MVP) character I'm building is a somewhat obese cat that is quite arrogant and smug, especially regarding users since they can't code and need to ask the cat for help. Everyone I've told about this so far thought it might be quite funny, so this will be the character I'm focusing on.

## Current Implementation Status
Since I've been working for a couple of days on this already, a lot of things already work, especially everything non-LLM related is pretty much complete for the MVP stage.

### Authentication System
Users can register/login (still have to add OAuth login via GitHub/Google though).
There are also different user roles, mainly me being an admin and having access to a dashboard for seeing what's happening on the site. This will probably be enhanced with moderation capabilities since we do allow users to upload random content, which can lead to some abuse.

### Game Management
Users can create/browse games, write descriptions in Markdown, and set games to private/public. Once we have some users, it might be sensible to add tags (which should probably be AI-generated) to simplify browsing/searching for particular games.

### Version Control
Creating a new release from the current dev state is possible, as is reverting to an old version. Additionally, there is support for downloading/uploading a version using a Zip file in the same format that itch.io/LD uses, mainly for testing the iframe functionality using some old GameJam titles of mine.

### Code Editor
There is a manual Editor based on CodeMirror. This isn't really intended to be used by end users, but in the beginning, it is essential since it allows me to check what the LLM is doing and fix the prompts/overall system based on what I see.

It's also nice to allow users to change assets on their own, since especially when it comes to graphics, I've seen many people really taking to it and wanting to do their own art. Here it might be good to create placeholder graphics using AI, with the user then downloading them and using them as templates for doing their own art, since they often need to have a certain format/dimensions to work properly.

### AI Assistant
A basic chat is implemented. The way it's supposed to work is that the LLM has a set of commands/tools it can use to modify the codebase. In the system prompt, it is instructed to use these to help the user build their Phaser game. So far it kind of works, but considering I just started on it today, the overall architecture will still change quite a lot.

I still have to make the switch to TypeScript in the future, since right now we're just working with JavaScript, and a lot of errors appear during runtime. Making sure that at least tsc says what we're doing is ok sounds like a good step to make the overall system less frustrating to use. We can automatically send any type error to the LLM, which it'll hopefully fix automatically in a sort of agentic workflow.

So far, I still haven't read up on what others are doing or how editors like Windsurf/Cursor actually work under the hood. When it comes to projects like these, I like to start out unencumbered by knowledge of the usual structure to make sure I can freely explore. I will definitely read up a little after I've gained some experience and seen firsthand what type of problems I run into, since many of them will probably have solutions that are somewhat common knowledge.

## Looking Forward
I'm still very excited about this project. There are many challenges ahead that are really difficult for me since at times I'm not sure I can actually pull things off. The asset generation feature is particularly challenging—I'm not even sure whether it can be done at all. It seems possible, but unlike with code where there is Cursor/Windsurf/bolt.new/v0, I don't know of a single tool that generates usable game art from just a prompt. I've searched around a couple of times and could only see some very complicated comfy UI workflows that worked for one particular coder and their game. So far, I haven't seen a general solution.


---
*Adios,*
べン
