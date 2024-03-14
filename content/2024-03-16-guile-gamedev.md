+++
title = "Thoughts on interactive programming"
date = "2024-03-16"

[taxonomies]
tags = ["tech", "scheme", "guile"]
+++

So, after deciding to take GuixSD for another spin on my x220. I've become interested
in trying out Guile again. For starters I wanted to do a simple Pong, since it shouldn't be that hard,
and after getting things working I can play around with the structure to see what works best.

I've been doing all this in Emacs with geiser and while doing this started to doubt the usefulness of
REPL-driven environments like geiser/slime for game development. While having a REPL for exploring the
system is pretty powerful I struggled with keeping the Source code and REPL state in sync. Since sometimes
I forgot to redefine a changed procedure, or got issues with the module system since the load-paths were different
when executing the script from a terminal or via geiser.

Generally it feels quite inferior to the experience I get when using TypeScript with something like Vite where
I can just switch focus to the browser, thereby saving the file which triggers a hot-reload and in a couple of
milliseconds I'm seeing the new version. This also means that I'm always seeing a version based on the actual source code, and by exposing some internals via globalThis I also get a REPL
for exploring the system. Oh and this also circumvents the problem of geiser going unresponsive after accidentally executing an infinite loop, which at least once also took Emacs with it
(although this might be due to the SDL2 FFI).

All this makes me think about how to handle these in Nujel, and I've come to a couple of conlusions:

1. The module system needs to be coupled to the filesystem by default.
2. The REPL needs to execute on a separate thread/fiber where the editor can inject code, even if we're stuck in an infinite loop.
3. File changes should automatically be reflected in the REPL.
4. C-c / C-x e should only really be used when debugging, not during normal development.
5. Syntax / compiler errors should be shown right in the editor as one writes, not a separate buffer when evaluating some form

Now I kinda wanna work on the editor/emacs-clone for Nujel
