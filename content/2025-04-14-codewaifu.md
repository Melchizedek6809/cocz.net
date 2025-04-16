+++
title = "CodeWaifu: AI Code Assistant with Voice Control and VTuber Avatar"
date = "2025-04-14"
description = "Exploring my plans to build CodeWaifu, an AI coding assistant with voice control and a VTuber avatar that works alongside your favorite IDE"

[taxonomies]
tags = ["tech", "projects", "node", "llm"]
+++

Greetings, this time I'll write about a project I haven't started yet but rather one I'm about to start with. Instead of writing about things I've learned/experienced, I'll try and use this entry to sort out my thoughts and come up with a plan on how to approach things.

It will be interesting to compare my expectations with actual reality once I start implementing things, so if you read this post you'll probably be interested in the retrospective that I'm about to write in a couple of weeks.

## What is CodeWaifu?

CodeWaifu is my take on an AI Code Editor since there are a couple of ideas I'd like to experiment with. It's more similar to <a href="https://aider.chat/">Aider</a> or <a href="https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview">Claude Code</a> rather than an IDE like <a href="https://www.cursor.com/">Cursor</a> or <a href="https://windsurf.com/">Windsurf</a>.

This is mainly because it should help simplify things somewhat while allowing users to use the IDE of their choice (would love to return to Emacs).

### What makes CodeWaifu unique?

Here I'll list a couple of ideas I want to experiment with, since they sound very interesting to me but we'll see whether they'll actually work out.

#### Voice Control

One of the main features is Voice Control and Text-to-speech. I'd like to see how well it works if I can just keep CodeWaifu running in the background, listening in and as soon as I mention a CodeWord it becomes active waiting for me to prompt it on what to do. This is mainly because the current model as used by Cursor for example means I have to focus the Chat interace, type in my prompt and then wait for the reply which I'll probably just accept without looking anyways.

I'd rather do this via Voice Command since then I can just keep coding in my editor and the LLM can just figure out how to do the task I prompted it to in the background. Once everything is done it'll just tell me the reply and do all the edits immediately. Will have to try it out but I think this could be a very comfortable way to work.

#### VTuber like Avatar

Some will probably think it's cringe, but considering that one can basically talk to this program I think giving it a sort of human-like appearance would be reasonable. Think something like Siri/Alexa. I'd also like to give it a VTuber like avatar that one can see in addition to the Chat interface (Voice control should be optional, writing is totally fine).

This might make things more approachable and I think might make it more fun to use, since I kind of dislike how the tech scene turned corporate, hopefully this will add a little whimsy to our daily work. Additionally: I think it might be fun if the avatar complains to the user that it is hungry and wants to be fed credits since otherwise it can't think straight.

#### Personify LLM models

I'd like to combine each LLM model with a particular voice, avatar and system prompt that makes them feel and behave somewhat differently. One could also jokingly add certain nods to the companies creating them (give the Gemini Avatar Google colored things, or maybe one of those hats). They could also be sisters and look similar when they are from the same company / line.

## Implementation Plans

Just a couple of notes on how I'm planning on implementing CodeWaifu.

### Tech stack

I'll start off with a copy of the [MandoMaster](/mandomaster/) backend for the server-side component, the client side app will most likely be Electron based, while this might seem bloated I'll need the following:

- Proper Unicode/IME support
- 3D Accelerated Graphics
- Mature library ecosystem
- Portability (at least Win/Mac/Lin and the 3 more popular BSDs on x86 and ARM)
- HTTPS

While I could build this in other languages, it probably won't be much leaner anyways. I can always rewrite things if it ends up being actually useful though (would love to use Common Lisp here TBH).

### LLM Provider

I'll just try out [OpenRouter](https://openrouter.ai/) since they seem to offer most LLM's for a reasonable price, since in the beginning I want to easily try out different models, though direct access to the Anthropic API might be sensible since at least from my experiences with Cursor, Claude is the most useful model by far.

### Challenges

Most challenging will be figuring out how to get the most out of the LLMs and how much context to provide to them, since from what I've heard giving them too much information can just confuse them. So we'll see how hard it is to build a coding agent out of an LLM like Claude 3.7

## Business Model

While all the tech stuff is important, how to make money, or in this case, how to ensure I'm not losing money on inference is rather important. Any AI-powered tool needs a sustainable business approach to cover the ongoing costs of LLM API calls.

### Pricing

I'll probably use the same pricing model that Cursor uses, will have to calculate how expensive those requests actually end up being, but as long as I'm not losing money I'm content. It might be fun to actually sell different costumes for the avatars for a fixed price to make some additional money, kind of add Gacha mechanics to an AI Editor.

## Next steps

So, this is pretty much my plan for now, we'll see how it works out. While this idea has been floating around my mind for a while now right now I really wanna try it out because I'm daily driving <a href="https://www.netbsd.org/">NetBSD</a> on my Laptop where Cursor/Windsurf don't seem to be available. So I'll just try and build my own.

Oh and if you're interested, I've already bought a domain and put up a <a href="https://codewaifu.net/">placeholder page</a>. Will probably take a while but I'll probably make another post about how well things work and if it actually seems to be useful how to distribute it to people.
