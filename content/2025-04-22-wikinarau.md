---
title: "WikiNarau: Interactive Learning Meets Wiki"
date: "2025-04-22"
description: "Exploring the development of WikiNarau, a platform combining wiki collaboration with interactive learning materials"
image: /img/wikinarau.png
tags: 
  - "projects"
  - "tech"
  - "web-components"
  - "javascript"
  - "nodejs"
  - "open-source"
---

Hello again,

This time I'll be talking about another of my (many) projects where development stalled but I'm not quite ready to call it quits, this one is called [WikiNarau](https://wikinarau.org/), since everything is open-source / free software you can take a look at the [source code](https://github.com/wikinarau/wikinarau) as well.

[![A look at wikinarau.org, showing an example page with multiple accordion boxes one can open and close](/img/wikinarau.png)](/img/wikinarau.png)

## What is WikiNarau?

It's supposed to be a Wiki where instead of collaboratively working on articles, one creates interactive learning material.
Think [H5P](https://h5p.org/) combined with Wikipedia.

The idea was to first focus on language courses since that's somewhat simple to define and there are lots of standards, also an old colleague of mine has a lot of experience teaching German to a Spanish-speaking audience. I also wanted to
add some simple beginners courses on Japanese since teaching the basics shouldn't pose much of a problem for me.

## Technical Architecture

So, since this blog is mostly written with a technical audience in mind let's do a deep dive into the technical architecture:

### Backend: Node.js with SQLite

The backend is implemented in Node.js with Express, as a database SQLite3 is used. Earlier versions were using LevelDB but I switched it over because at some point I needed some more complicated queries and I thought it'd be simpler to use a proper database rather than doing things on my own.

Apart from that this isn't using much, nothing special for templating since at its heart it is a sort of special CMS system, where each entry/page is versioned and stored in the system.

As an aside, each page is generated via a single database entry containing a JSON object defining all the content elements. The way we handle it is that each element contains a type field specifying which class is responsible for this object, we then turn the JSON Data into an Object which we can then render to HTML.

[![A look at wikinarau.org this time showing the editor for changing any of the sites content](/img/wikinarau2.png)](/img/wikinarau2.png)

### Frontend: Web Components with Lit.js

On the frontend we go all in regarding Web Components, to make that a little bit more comfortable we use Lit.js for specifying them, which ends up being real nice. Overall the experience was fantastic, I only have 2 minor objections:

#### Unstyled Content Flash

Quite often I ran into a flash of unstyled content, so far I've only seen it in development builds, but that might be due to me spending a lot more time in the dev environment than in production. Still it somewhat irks me that all of the JS needs to be evaluated before the browser actually knows what it's supposed to do, as far as I know there also isn't really
any support for hydration which also seems quite tricky to implement if you want to use a ShadowDOM.

#### Rich Text Editor Challenges

Maybe I just didn't know any better but I really could not find a nice Rich Text Editor that works within a ShadowDOM. I tried porting some of the bigger editors but it seemed like a lot of work, so I kinda rolled my own using [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) since it only took me half an hour or so, and hopefully I can replace it in a later version with a proper one (would love to use [ProseMirror](https://prosemirror.net/)).

## Lessons Learned and Future Directions

This was a pretty good example of what not to do. I've been too focused on building the tech instead of gathering users first and then building based on user demand. I still think the overall idea is great, since projects like wikibooks seem great but a little limited. Would have probably been better to set up a Discord server or something and try and gather teachers and educators there before writing a single line of code.

Apart from that on a technical note I realized how absolutely nice native Web Components are to work with, it makes everything so simple, as long as things are structured in a somewhat reasonable manner. One thing I'm currently somewhat stuck on is the entire Database and underlying sync engine, since I've already started and think I can get a somewhat generalized synchronization system going where we can just query/set things on the client with changes then automatically propagating to the backend and from then on to other clients. Then we could build very complicated collaborative applications out of a couple of primitives that abstract away most of the networking that has to happen underneath.

---

*Adios,*
べン
