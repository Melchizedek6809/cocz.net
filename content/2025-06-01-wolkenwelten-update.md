---
title: "WolkenWelten Update - Multiplayer Now Working in TypeScript Version!"
date: "2025-06-01"
description: "Finally got around to fixing the multiplayer and completed some very successful tests today"
tags: ["tech", "projects", "ai-coding", "gamedev", "web-games"]
image: /img/wolkenwelten/wwts3.jpg
---

[![Screenshot of me running around](/img/wolkenwelten/wwts3.jpg)](/img/wolkenwelten/wwts3.jpg)

<div class="intro">
It's been a while! I've been quite busy with a new job but finally got some time to do some relaxed coding during the weekend and returned to WolkenWelten (just can't let this project go).
</div>

## The Multiplayer Challenge

For a while now, I've been trying to get multiplayer working, but nothing quite panned out. Especially frustrating were my attempts to get Claude/Cursor to implement the final steps - I think I tried about 4 times, and it always ended up completely breaking everything. First, I simply asked it to "synchronize these entities over the network please," and nothing worked. Then I tried to be more detailed, even going as far as describing the now-implemented system in great detail (the prompt was 50 lines or so, specifying everything), but it still completely broke everything.

Yesterday I finally decided to implement these basics myself, without any AI help. I removed all non-essential features like the fire system, spells, inventory, and items, focusing solely on getting characters working well over the network with movement/attacks and world manipulation.

The good news is that I really like the current architecture. Most entities don't need to concern themselves with the network at all - they just need to provide/extend a serialize/deserialize method, and that's it. Hopefully Claude can help quite a bit with reimplementing these features now that the hard bits are taken care of.

## Design Choices & Trade-offs

Before describing the architecture I've settled on, I'd like to discuss some (known) limitations of the current approach, as there are significant trade-offs to consider.

### Trusting the Players

This is a big one, and a choice many games decide against. I might reconsider this decision in a future version, but for now, I'm choosing to trust players. This means I'm willing to accept a certain percentage of cheaters to simplify development and improve the overall experience for non-cheaters.

I don't see this game as particularly competitive - it's more of a fun experience to enjoy with friends on a lazy afternoon, or something to play with other students during classes.

Because of this, I think the risk of cheaters ruining the fun is somewhat low, especially if everybody involved knows each other, since even simple cheating attempts will be quite easy to notice. This makes it more of a social problem than a technical one, especially since the game is free software, making the development of hacked clients very simple (particularly with AI coding tools). It's also quite hard to distinguish between hacked clients and legitimate mods - where do you draw the line? Since I'd absolutely love to see and play modded versions of this game, I think it might be better to focus on making the game as fun as possible and building a community around it.

Additionally, trusting players makes it much easier to deal with high-latency clients, making it more enjoyable to play with friends who are far away.

## Current Architecture

Generally, we have a single source of truth for any entity. The difference might be that, depending on the entity, it might not be the server.

We start by establishing a WebSocket connection to the server and then running a JSON-RPC-like protocol on top of it (with one exception: Chunks, which I'll explain later). For that, we have a class that's used by both client and server, allowing us to queue RPC calls which are batched and sent to the other end while wrapping everything in Promises so we can simply do something like:

```typescript
const playerId = await this.network.setPlayerID();
```

Which is just some syntactic sugar on top of:

```typescript
queue.call("getPlayerID", undefined);
```

This `queue` method pushes the name and arguments onto an array, adds an ID from a local counter (which is part of the reply and required for looking up the associated Promise in the client). Adding new handlers is also very simple:

```typescript
queue.registerCallHandler("addLogEntry", (args: unknown) => console.log(args as string));
```

### World Chunks

This system has been working for a while now, and generally it works quite well, although performance isn't all that great. Here, the server is the only authoritative source, but each client can change the world by calling functions on the server that can modify any block they desire. This changes the Chunk data structure on the server, updating the last_updated number (essentially an iteration/frame counter).

This leads to the server pushing updated chunks to the client because the server actually keeps track of each last_updated number for each client. We simply check all the chunks in the vicinity of the player periodically and push the entire chunk whenever something has changed (we might implement delta encoding later, but I'd prefer to optimize this worst-case first).

Additionally, the client notifies the server about chunks it's dropping because they're too far away (we have a sort of garbage collector running periodically on the client, removing distant chunks to keep heap size in check). While writing this, I realize it might be worth experimenting with running the GC whenever we have too many chunks loaded, instead of every 30 seconds or so.

Transferring chunks is also the one thing we don't do via JSON-RPC. Because we'd have to base64 encode the binary data and generate massive strings, we instead just have a different WebSocket message format which encodes the chunk data and the coordinates in a binary format, which should be much more efficient.

All of this should also be gzip encoded transparently by the WebSocket implementation (though I haven't verified this yet).

### Entity Synchronization

Here we just use normal JSON-RPC style function calls. Whenever a new Entity (or most likely a subclass) gets created, we allocate a unique ID. These can be shared over the network because when we connect to a server, we reset this counter to `playerID << 28`, giving us many entities before we have a collision. Additionally, each Entity has an ownerID which is the playerID of the node responsible for doing physics and general world simulation (0 == server).

We now also require a serialize/deserialize method which includes these IDs as well as a keyword indicating the type of Entity. Every node also has a Map where we can get the constructor for any registered Node type. On every frame, we iterate over all Entities and serialize the ones we are responsible for, then send a big batch of these objects to the server. The server then also serializes all Entities that are not owned by that particular client and sends these objects in response.

This way only one node updates each Entity, and since the ownerID is also serialized, we can change owners for existing objects. For example, a player could use a spell creating a Fireball entity - as soon as it's fired and the position/velocity vectors are calculated, we set the ownerID to 0 and force a serialization to the server. Once the server receives this Entity, it looks up the Fireball constructor, creates a new Entity of that type, and then proceeds with updating and broadcasting serialized versions of it to all connected clients.

We could, however, also just let the player remain the owner of that particular Entity, because the server then just acts as a middleman, which works quite well for Characters, for example.

## Future Improvements

I'm considering several optimizations and features for future updates:
- Refining the entity ownership transfer system
- Improving network performance (especially for Chunk updates)
- Experiment with delta compression for chunk updates

## Closing Thoughts

It's taken me a while to get to this state, but I really enjoy the overall architecture. It should be simple enough for inexperienced coders and AI tools to work with, allowing for easy experimentation with different Entity types. All that's required for a new networked Entity is a serialize/deserialize method, which shouldn't be hard to implement.

Now, I've got a lot of issues and bugs to fix after testing the current version with some friends today. My next steps will focus on making the overall gameplay feel nice and polishing the user experience. Thanks for reading until the end!

---
*Adios,*
べン
