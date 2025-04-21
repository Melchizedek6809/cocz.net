+++
title = "WolkenWelten"
date = "2025-04-21"
description = ""

[taxonomies]
tags = ["tech", "projects", "c"]
+++

So, today I'll be writing about one of my longer running projects, [WolkenWelten](https://wolkenwelten.net/).
Although I can say up front that development stalled and if anything I might only continue working on the
Web/TypeScript version. Now I'd like to first introduce the overall idea followed by some of the
implementations and what I learned along the way.

## The idea

The idea mainly grew out of my frustrations while playing Minecraft, I would have loved it if there
were proper first party modding support, turning it less into a game and more into an engine. This
was mainly fueled by me playing an indie sandbox game that felt similar to minecraft
in my childhood, [Clonk](https://clonk.de/).

A nice aspect of it was that one could download all kinds of game objects from the internet and
not only play special maps and such, but actually mix and match various mods leading to all sorts
of strange situations (Fighting off an alien swarm with Dragonball characters instead of firearms was
a nice one for example).

A more modern take on this is probably Garry's Mod, which I've also spent far too much time in.

But in general the idea was to fully embrace the modding community and allow players to combine
all sorts of mods/plugins together, think WordPress or Emacs.

Another very important aspect, which was most important first but grew less important over
time was performance. This is mainly because machines just kept getting faster and
a super cheap used machine could even play normal minecraft rather well.

## WolkenWelten C++

I first started developing what would become the C version of WolkenWelten in
C++, this is mainly because there were some features of C++ I rather like, mainly
function overloading, also there were some great libraries for doing matrix/vector
math for 3D games.

So I started just coding ahead in C++, while I could have used something like
Vulkan I wanted to stick to OpenGL (ES) so that we could also support low-level
hardware, my main idea was that a Raspberry Pi 4 should be enough.

Modding was considered but the main idea was to just ship the source code to
people and they can then mod the game in C++ if they want (this didn't allow for
mix and matching but in general nothing was really figured out at that point).

Soon the engine and game took shape and I learned a lot about voxel programming
and game/graphics development in general.

Additionally over time I grew frustrated with C++, mainly the slow compilation
times. So after a while I started porting things over to C, mainly because by
now I actually knew what I needed and the overall engine structure kinda settled.

This meant that I had to write my own code for doing matrix/vector math because
there was no lib that I actually enjoyed using, this didn't pose much of a
problem and I do like how things turned out (only took me a couple of days I
think, that might be though because I was writing rather C-like code from the
start anyways).

## WolkenWelten C

Now that the codebase was in C another big problem came it, up until this point
the entire code was single-player only, and I had no idea how to actually do
multiplayer. This was sure to become a problem since playing with others is
much more fun and should probably be introduced somewhat early in development
since it will have quite the impact on the overall architecture of the game.

So the plan was that to make sure that everything would work in multiplayer
there wouldn't be a difference between multiplayer and singleplayer mode,
we could just fork off a server process and connect to it for a singleplayer
experience.

This was a bit harder but didn't take too long since there wasn't much to the
game yet, although there already were grappling hooks. Think that was one of the
first interactions with the world and got added quite soon after mining/block
placement.

Around this time I also started streaming the development over on Twitch.

By now we had a multiplayer voxel sandbox, I've also added a couple of items
and interactions, over time we added a GUI system and crafting recipes and things
kind of took shape, but one of the problem was still mod support.

First off I tried sticking with C, using makefiles and code generators to look
at all of the source files in a special directory and then figure out which
hooks there are in these mod files, it would then generate code that calls all
of the hooks in turn. These hooks were for things like the game starting where
we could then add new items or recipes.

This system worked rather well but the problem was that modders needed the source
code, would have to code in C and recompile things all the time, this wasn't
quite as bad since C compilation times were quite manageable but still, things
could be improved.

## Nujel

Now I think it was during one christmas where I went away for my family and didn't
stream for a while that I though I'd just write my own scripting language, I've
done similar things before and thought that if I gave it an S-Expression based
syntax parsing would be rather simple, so I just tried it out to see how simple
it'd be.

While the beginning was rather simple, it of course led to a lot of work down the
line since implementing your own language including libraries and VM is quite a
bit of work. Albeit fun one.

During this time I've also made Nujel into a somewhat problematic language because
I was adding things to it that would only really be useful for Wolkenwelten.

But yeah, during this time I mostly tried to improve Nujel, open up more of the
C Engine to Nujel and port most of the content to use Nujel.

## Emscripten / WASM

It is still quite amazing to me that we could actually compile the C code to
JS/WASM and run everything in the browser, while I consciously know what a
browser is capable of, it still mostly seems like a place for gaudy looking
2d games, while there doesn't seem to be much technically stopping games from
actually shipping proper Browser versions, somehow it doesn't seem to happen,
maybe because Steam works well enough and doesn't require one to write things
in a different way.

## WolkenWelten Rust

Over time I grew dissatisfied with how much time it took to get basic
functionality implemented in Nujel, and in general it didn't seem like much of
an improvement while taking up most of the development time. So I thought I'd
try something else, since I don't like Lua all that much, and think Python
is too slow I thought we might try and embed a JS Runtime like V8.

After some experiments I've seen that Deno actually provides some crates for
easily embedding V8 into a Rust project, so since I was intrigued by Rust for
some time now I thought I might try and rewrite things in Rust instead.

This whole effort stopped quite soon because I realized that it wasn't much
better than the old Nujel way, we still had to spend a lot of time exposing
functionality from the engine to the scripting layer.

Also Rust compilation times were quite bad, at least compared to C.

Another thing I've noticed here is just how fast V8 actually is, especially if
you have code where it can infer that integer math will suffice, then it can
actually compete with more low-level languages like Go/D when it comes to raw
performance.

This gave me an interesting idea which brings us to the next implementation

## WolkenWelten TS

The (so far) last iteration of the overall idea, this time completely written
in TypeScript. I've noticed that I could easily port the C/Rust parts and get
somewhat similar performance, while gaining complete portability, super easy
distribution and almost instant iteration times due to modern tooling like
Vite.

This also allows for the entire game to be written in one language, that way
we don't have to expose certain parts to the scripting layer since everything
is always available.

Mods are also safe to run, since web browsers are probably one of the most well
tested sandboxes out there. And pretty much anyone can just for the repo on
GitHub and then deploy to GH Pages using the same CI pipeline I'm using.

I still really like the way things are structured here, sadly I've taken on
a new job at this point which left me with far less free time so things kind
of stalled.

From time to time I still work on this version, currently focusing on adding
multiplayer which already somewhat works but with a lot of limitations. Would
love to turn this into a game that playes similar to Super Smash Brothers but
with elemental powers similar to Avatar.


---

*Adios,*
べン
