---
title: "A certain magical shooter - My Touhou-Inspired Game Jam Project"
date: "2025-04-23"
description: "A look at my Touhou-inspired shooter game created for a game jam, featuring custom mechanics, pixel art, and lessons learned from the development process."
tags: ["projects", "tech", "gamedev", "javascript", "open-source"]
---

Hey there,

today I'll be writing about an old game I've made for a gamejam which I actually rather like, [A certain magical shooter](https://melchizedek6809.itch.io/a-certain-magical-shooter), the source code is also on [GitHub](https://github.com/Melchizedek6809/a-certain-magical-shooter) if you want to look at the messy internals.

[![Screenshot of the game, showing a flying witch shooting some fairies](/img/a-certain-magical-shooter/screenshot.png)](/img/a-certain-magical-shooter/screenshot.png)

## What is A Certain Magical Shooter?

I tried to mostly recreate the gameplay of earlier Touhou games, with the minor twist that it's going left to right instead of bottom to top.

During development I tried not to be too overambitious and instead just polish some minor mechanics, one way to accomplish this was that I finished pretty much the core gameplay on day one, in the following days I then added nice graphics and lots and lots of polish, just making sure everything fit together.

## Unique Technical Features & Game Mechanics

I think that it plays rather well, but you can be the judge of that. Regarding the internals there is one rather weird decision I made, and that is that I wrote a very rudimentary Lisp/S-Expression syntax for defining when and where the enemies would spawn and when/where they would shoot.

The way this works is that this language actually has a lot of fibers, one for each enemy that is on screen. Then we can just define a sequence/path which this enemy travels along, changing the shoot rate as we travel along the path.

Now since the time limit was quite tough, I think the original plan was 3 days which then got extended to 4 at the last minute which was probably a great idea since one entire unplanned day for adding polish was fantastic and I think everyone's entries improved by a lot due to this.

[![Screenshot of the game, showing a flying witch fighting against a stupid fairy](/img/a-certain-magical-shooter/screenshot_1.png)](/img/a-certain-magical-shooter/screenshot_1.png)

Regarding the implementation: I'd have to look at the code to be sure, but I think I used native JS Datatypes, mainly arrays instead of Cons-cells. The reader was implemented via some regular expressions which turned the S-Expression syntax into JSON which we could then easily read, this whole construction was rather unstable and led to lots of frustrations during development.

## Key Lessons from Game Development

Quite a bit actually, mainly that it's better to do less, but focus on doing the things one actually ends up doing well. I also learned a lot about pixel art and animation which was a conscious decision beforehand since I used [Phaser](https://phaser.io/) which I've already used for a couple of games making the whole coding aspect rather relaxed, that way I could put all efforts into making the gameplay and art as good as possible.

I also tried and make some music using AI tools of the day but the results were all terrible, really glad I found a site of this Japanese composer creating BGM in a Touhou style which was fantastic to listen to and free to use.

[![Screenshot of the game, showing a flying witch shooting some fairies](/img/a-certain-magical-shooter/screenshot_2.png)](/img/a-certain-magical-shooter/screenshot_2.png)

## Future Improvements & Reflections

I would not create my own language/syntax, I should have just stuck to JS and used Promises/Generators instead, by now it's probably not as much of an issue anymore since there are tools like Cursor which can take over the grunt work.

Also add a bit more story/character, think it might have improved the overall experience quite a bit and would have been true to the original.

---

*Adios,*
べン
