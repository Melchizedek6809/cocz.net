---
title: "Rust WebDev - a delightful experience"
date: "2025-11-02"
description: "Much more productive than anticipated"
tags:
  - tech
  - rust
  - webdev
---

## Intro

Alright, so for the past couple of weeks I've been hard at work migrating a Node backend to Rust. Mainly this was due to some architectural problems with the old implementation and since a lot of parts had to be rewritten anyways I thought I might try out another language. Don't get me wrong, Node is fine, but it's also not a language that's super fun to write. Or to be more exact, the overall ecosystem isn't all that fun, while it is productive and generally gets the work done and can be quite fast/efficient, it has been taken over by people that just want to get things done with the least amount of effort and understanding possible. Probably doesn't help that it's become the language that every young developer starts with.

So, since I've been meaning to rewrite this app for a while now I thought this might be a good chance to try out some other languages/runtimes. First I gave [Elixir](https://elixir-lang.org/)/[Phoenix](https://www.phoenixframework.org/) a try, and while it did feel quite productive it didn't quite click with me, afterwards I gave [Bun](https://bun.sh/) and [Elysia](https://elysiajs.com/) a shot which worked quite well but the combination of Bun segfaulting a little too often for my taste in combination with the overall experience not being that different from node led me to give an old favorite another shot: **Rust**.

## Tech Stack

So first off I'll be describing the overall tech stack since this might not apply to other frameworks, I knew from the start that I needed something async (LOTS of mostly idle websockets), which probably meant [tokio](https://tokio.rs/). Since [axum](https://github.com/tokio-rs/axum) seemed to be one of the bigger framework I though I'd give it a try since the example did look quite nice, and so far axum seems like a fine choice, don't remember a single instance where it made issues for me, just a solid performer overall!

Apart from that I still needed a way to talk to a database, postgresql to be exact, for this I wanted to give [sqlx](https://elysiajs.com/) a try, checking queries during compilation sounded somewhat unusual but I've really grown to like it. While it didn't make me that much more productive it generally just works reliably.

Of course we have a couple of standard Rust crates like anyhow, serde and so on, not going to bother going into this more since they are just solid performers overall (as has been my general experience with the overall Crates ecosystem).

Oh and before I forget, of course [mold](https://github.com/rui314/mold) is used as the linker during development, combining this with [bacon](https://github.com/Canop/bacon) which automatically recompiles whenever a file changes is a rather smooth development environment, not quite as fast as Vite or Bun but still fast enough that it doesn't slow me down (~500ms on my ratherrrr average Desktop).

The frontend is being bundled via Bun, I have a script that runs the Bun bundler in watch mode for the various frontend bundles the app requires, Rust then either serves them directly when in development, or uses include_bytes to embed the HTML bundle into the Rust executable (still have to figure out how to add the assets themselves, but so far things work quite well).

## The Ecosystem

Rust has quite the extensive ecosystem for doing backend webdev by now, so in general I didn't feel any less productive due to missing libraries (which can be a problem with languages like Scheme for example). Additionally I'm always pleasantly surprised by the overall quality of the crates ecosystem, quite unlike the JS ecosystem where I generally have to try out at least 2-3 libraries before finding one that actually works good enough and is actively maintained.

## Productivity

Funnily enough I didn't feel any slower writing Rust, in general it didn't seem to make much of a difference as compared to languages with a GC. I kind of feel as though Rust is greatly suited for doing API backends, since the main point that slows one down in writing Rust is when having to specify complicated lifetimes, which doesn't happen in API backend for the most part. Most state is pushed to the database anyways, making each request independent of each other, because of this one pretty much never has to share state between requests which means no complicated lifetimes! This makes writing Rust not that different from writing JS/TS with the added benefit of the compiler actively nudging one into writing a stateless app server.

Additionally I was really missing proper sum types / enums in TS, there are just so many things that are much easier to express via sum types and pattern matching that I might even say Rust has made me more productive. One thing that has been bothering me a little though is duplicate types, since it's just an API backend the frontend is doing most of the rendering and we need to specify the types somehow, so far I've just written zod schemas myself for the couple of types that are relevant to the frontend, but I've read that there are some crates that can automatically generate types (maybe even schemas?) straight from Rust types. Will give those a try in the future but so far I wanted to keep things somewhat simple, especially when it comes to additional build steps I'm a little hesitant.

Also Rust having a sound type system builtin makes the overall experience so much nicer, TypeScript is sadly only a veneer on top of raw JS and therefore inherits a lot of dynamic behaviour from that, which sometimes is nice but generally something I'd like to avoid for software that needs to be reliable.

## Performance

Still haven't deployed the rewritten backend into production yet, so far things seem quite snappy, although performance wasn't an issue with the old backend the memory consumption alone is much better and the CPU load for that process actually going to 0% when idle, unlike Node.js which always seems to do something (might just be Express.js or one of the various packages though).

## Final verdict

I'm really suprised at how easy it was to use Rust for this project, would have thought that it'd be a little harder but ended up being rather simple. Honestly now I'm thinking of doing most projects, even the small prototypes directly in Rust since I feel just as productive and the result is much more stable/performant and to top it all off: Rust is more fun to write than JS/TS. Especially TypeScript isn't quite as fun to write as it was a couple of years ago, I think the ecosystem embracing TS that much has led to some issues since now everything needs to be completely typed, which is a commendable goal but does end up with absolutely arcane type definitions that regularly break my LSP and otherwise slowing my machine down to a crawl (especially tRPC while nice, does make my machine feel quite slow).

Now I just need to find a nicer alternative to React for the frontend, too bad that most alternatives don't have mature component libraries since to me that's the main benefit of using a framework. Will give SolidJS a try in another project soon though, since it keeps coming up and the examples I've seen do look quite enticing.

---

*Adiós,*
べン