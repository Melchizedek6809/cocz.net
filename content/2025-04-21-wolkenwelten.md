+++
title = "WolkenWelten: From C++ to TypeScript in Game Development"
date = "2025-04-21"
description = "Discover how I built WolkenWelten, a moddable voxel sandbox game, across multiple languages and the surprising advantages of TypeScript and web technologies for game dev."

[taxonomies]
tags = ["gamedev", "voxel", "typescript", "c", "cpp", "rust", "modding", "web-games", "programming-languages", "projects"]
+++

# The WolkenWelten Journey

Today I'm diving into one of my most ambitious projects, [WolkenWelten](https://wolkenwelten.net/) - a voxel sandbox game that evolved across multiple programming languages over several years. While development has slowed down (I'm now focusing mainly on the Web/TypeScript version when I find time), the journey taught me invaluable lessons about game engines, modding systems, and language trade-offs.

![A third-person view of WolkenWelten's TypeScript version showing the blocky voxel world with islands floating in the sky](/img/wolkenwelten/wwts.jpg)

**Table of Contents:**
- [The Vision: A Moddable Voxel Sandbox](#the-vision-a-moddable-voxel-sandbox)
- [The C++ Prototype: Skycastle](#the-c-prototype-skycastle)
- [The C Rewrite: Performance and Multiplayer](#the-c-rewrite-performance-and-multiplayer)
- [Nujel: Creating a Custom Scripting Language](#nujel-creating-a-custom-scripting-language)
- [Browser Adventures: Emscripten and WASM](#browser-adventures-emscripten-and-wasm)
- [The Rust Experiment: V8 Integration](#the-rust-experiment-v8-integration)
- [The TypeScript Revolution](#the-typescript-revolution-one-language-to-rule-them-all)
- [Lessons Learned](#lessons-learned)

## The Vision: A Moddable Voxel Sandbox

The idea mainly grew out of my frustrations while playing [Minecraft](https://www.minecraft.net/). I would have loved it if there
were proper first-party modding support, turning it less into a game and more into an engine. This
was mainly fueled by me playing an indie sandbox game that felt similar to Minecraft
in my childhood, [Clonk](https://clonk.de/).

A nice aspect of it was that one could download all kinds of game objects from the internet and
not only play special maps and such, but actually mix and match various mods leading to all sorts
of strange situations (Fighting off an alien swarm with Dragonball characters instead of firearms was
a nice one for example).

A more modern take on this is probably [Garry's Mod](https://store.steampowered.com/app/4000/Garrys_Mod/), which I've also spent far too much time in.

But in general the idea was to fully embrace the modding community and allow players to combine
all sorts of mods/plugins together, think [WordPress](https://wordpress.org/) or [Emacs](https://www.gnu.org/software/emacs/).

Another very important aspect, which was most important first but grew less important over
time, was performance. This is mainly because machines just kept getting faster and
a super cheap used machine could even play normal Minecraft rather well.

### Key Design Goals:
- **Ultimate modding freedom** - Let players combine mods without conflicts
- **High performance** - Run well even on modest hardware like Raspberry Pi
- **Multiplayer first** - Design with multiplayer in mind from the beginning
- **Accessible development** - Make creating mods easier than in other voxel games

## The C++ Prototype: Skycastle

![Early C++ version of WolkenWelten showing basic voxel terrain rendering](/img/wolkenwelten/wwcpp.jpg)

I first started developing what would become the C version of WolkenWelten in
C++. This was mainly because there were some features of C++ I rather like, mainly
function overloading. Also, there were some great libraries for doing matrix/vector
math for 3D games.

So I started just coding ahead in C++. While I could have used something like
[Vulkan](https://www.vulkan.org/), I wanted to stick to [OpenGL (ES)](https://www.khronos.org/opengles/) so that we could also support low-level
hardware. My main idea was that a [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) should be enough.

Modding was considered but the main idea was to just ship the source code to
people and they could then mod the game in C++ if they wanted (this didn't allow for
mix and matching, but in general nothing was really figured out at that point).

Soon the engine and game took shape and I learned a lot about voxel programming
and game/graphics development in general.

Additionally, over time I grew frustrated with C++, mainly due to the slow compilation
times. So after a while I started porting things over to C, mainly because by
now I actually knew what I needed and the overall engine structure had settled.

This meant that I had to write my own code for doing matrix/vector math because
there was no lib that I actually enjoyed using. This didn't pose much of a
problem and I do like how things turned out (only took me a couple of days I
think, that might be because I was writing rather C-like code from the
start anyways).

> **Technical Highlight:** The C++ version laid the foundation for the voxel engine with OpenGL (ES) support, focusing on low-end hardware compatibility.

## The C Rewrite: Performance and Multiplayer

![C version of WolkenWelten showing improved graphics and terrain generation](/img/wolkenwelten/wwc1.jpg)

Now that the codebase was in C, another big problem came up. Up until this point
the entire code was single-player only, and I had no idea how to actually do
multiplayer. This was sure to become a problem since playing with others is
much more fun and should probably be introduced somewhat early in development
since it will have quite the impact on the overall architecture of the game.

So the plan was to make sure that everything would work in multiplayer.
There wouldn't be a difference between multiplayer and singleplayer mode -
we could just fork off a server process and connect to it for a singleplayer
experience.

This was a bit harder but didn't take too long since there wasn't much to the
game yet, although there already were grappling hooks. I think that was one of the
first interactions with the world and got added quite soon after mining/block
placement.

Around this time I also started streaming the development over on [Twitch](https://www.twitch.tv/melchizedek6809).

By now we had a multiplayer voxel sandbox. I'd also added a couple of items
and interactions. Over time we added a GUI system and crafting recipes, and things
kind of took shape, but one of the problems was still mod support.

First off, I tried sticking with C, using makefiles and code generators to look
at all of the source files in a special directory and then figure out which
hooks there are in these mod files. It would then generate code that calls all
of the hooks in turn. These hooks were for things like the game starting where
we could then add new items or recipes.

![C version with GUI elements, inventory system, and improved lighting](/img/wolkenwelten/wwc2.jpg)

> **Technical Highlight:** The C version introduced a client-server architecture where even single-player mode runs as a local server, making multiplayer a core part of the design.

### Assembly Optimizations

This version also got a couple of procedures written in assembly (x86_64 and AARCH64),
mainly because I dislike SIMD intrinsics and this was one of the ways to really
improve performance. It made a massive difference on the Raspberry Pi, much more so
than on normal Desktop machines, probably because the hardware was overall more limited.

### Modding Challenges

This system worked rather well but the problem was that modders needed the source
code, would have to code in C, and recompile things all the time. This wasn't
quite as bad since C compilation times were quite manageable, but still, things
could be improved.

## [Nujel](/nujel): Creating a Custom Scripting Language

![WolkenWelten with Nujel scripting integration showing a more complex world with custom entities](/img/wolkenwelten/wwc3.jpg)

Now I think it was during one Christmas when I went away to visit my family and didn't
stream for a while that I thought I'd just write my own scripting language. I've
done similar things before and thought that if I gave it an S-Expression based
syntax, parsing would be rather simple. So I just tried it out to see how simple
it'd be.

While the beginning was rather simple, it of course led to a lot of work down the
line since implementing your own language including libraries and VM is quite a
bit of work. Albeit a fun one.

During this time I also made Nujel into a somewhat problematic language because
I was adding things to it that would only really be useful for WolkenWelten.

But yeah, during this time I mostly tried to improve Nujel, open up more of the
C Engine to Nujel, and port most of the content to use Nujel.

> **Technical Highlight:** Nujel was a custom Lisp-inspired language with S-Expression syntax, designed specifically to make modding more accessible without C compilation.

## Browser Adventures: [Emscripten](https://emscripten.org/) and WASM

![Final C version of WolkenWelten running in a browser via WebAssembly](/img/wolkenwelten/wwc4.jpg)

It is still quite amazing to me that we could actually compile the C code to
JS/WASM and run everything in the browser. While I consciously know what a
browser is capable of, it still mostly seems like a place for gaudy looking
2D games. While there doesn't seem to be much technically stopping games from
actually shipping proper Browser versions, somehow it doesn't seem to happen.
Maybe because [Steam](https://store.steampowered.com/) works well enough and doesn't require one to write things
in a different way.

> **Technical Highlight:** Using Emscripten, the entire C codebase was compiled to [WebAssembly](https://webassembly.org/), proving that complex 3D voxel games can run efficiently in browsers.

## The Rust Experiment: V8 Integration

![Rust version of WolkenWelten featuring a first-person battle with a giant crab monster](/img/wolkenwelten/wwrs.jpg)

Over time I grew dissatisfied with how much time it took to get basic
functionality implemented in Nujel, and in general it didn't seem like much of
an improvement while taking up most of the development time. So I thought I'd
try something else. Since I don't like [Lua](https://www.lua.org/) all that much, and think [Python](https://www.python.org/)
is too slow, I thought we might try and embed a JS Runtime like [V8](https://v8.dev/).

After some experiments I discovered that [Deno](https://deno.land/) actually provides some crates for
easily embedding V8 into a [Rust](https://www.rust-lang.org/) project. Since I was intrigued by Rust for
some time, I thought I might try and rewrite things in Rust instead.

This whole effort stopped quite soon because I realized that it wasn't much
better than the old Nujel way. We still had to spend a lot of time exposing
functionality from the engine to the scripting layer.

Also, Rust compilation times were quite bad, at least compared to C.

Another thing I noticed here is just how fast V8 actually is, especially if
you have code where it can infer that integer math will suffice. Then it can
actually compete with more low-level languages like [Go](https://go.dev/)/[D](https://dlang.org/) when it comes to raw
performance.

This gave me an interesting idea which brings us to the next implementation.

> **Technical Highlight:** The Rust version attempted to use Deno's V8 bindings to embed JavaScript as the scripting language, revealing V8's impressive performance for numeric operations.

## The TypeScript Revolution: One Language to Rule Them All

![TypeScript version featuring improved graphics, third-person view, and more detailed world](/img/wolkenwelten/wwts2.jpg)

The (so far) last iteration of the overall idea, this time completely written
in [TypeScript](https://www.typescriptlang.org/). I noticed that I could easily port the C/Rust parts and get
somewhat similar performance, while gaining complete portability, super easy
distribution, and almost instant iteration times due to modern tooling like
[Vite](https://vitejs.dev/).

This also allows for the entire game to be written in one language. That way
we don't have to expose certain parts to the scripting layer since everything
is always available.

Mods are also safe to run, since web browsers are probably one of the most well
tested sandboxes out there. And pretty much anyone can just fork the repo on
[GitHub](https://github.com/) and then deploy to [GH Pages](https://pages.github.com/) using the same CI pipeline I'm using.

I still really like the way things are structured here. Sadly, I've taken on
a new job at this point which left me with far less free time, so things kind
of stalled.

From time to time I still work on this version, currently focusing on adding
multiplayer which already somewhat works but with a lot of limitations. I would
love to turn this into a game that plays similar to [Super Smash Brothers](https://www.smashbros.com/) but
with elemental powers similar to [Avatar](https://avatar.fandom.com/wiki/Avatar:_The_Last_Airbender).

> **Technical Highlight:** The TypeScript version achieves comparable performance to the lower-level implementations while dramatically improving development speed, mod support, and distribution.

## Lessons Learned

After working on WolkenWelten across multiple languages and paradigms, I've gained several key insights:

1. **Language trade-offs matter**: C++ offered libraries but slow compilation, C was faster to compile but required more manual work, Rust had strong safety but slow compilation, and TypeScript provided the best balance for this project.

2. **Modding architecture is crucial**: Design for modding from the start rather than trying to bolt it on later.

3. **Unified language environments win**: Having the entire codebase in one language eliminates the scripting interface problem.

4. **Web technologies are surprisingly capable**: Modern browsers and WebGL/WebGPU can handle sophisticated 3D games with decent performance.

5. **Iteration speed beats raw performance**: Fast development cycles and easy distribution ultimately matter more than squeezing out the last bits of performance.

If you're interested in exploring the project further, check out the [GitHub repository](https://github.com/wolkenwelten/wolkenwelten-ts) for the TypeScript version. I'd love to hear your thoughts or see contributions if you're into voxel games or web-based game development!

---

*Adios,*
べン
