---
title: "Python’s ecosystem is a mess"
date: "2025-08-09"
description: "Beginner-friendly? Not in my experience. A lot of important things that are quite simple in other languages feel almost impossible in Python."
tags:
  - tech
  - rant
  - python
---

<div class="intro">
So, yesterday I tried to set up SDXL to experiment with various UIs and models since I've been out of the loop there for a bit and got super frustrated at how hard it is to just run some Python code off of GitHub.
</div>

## Package management in Python
Python seems like one of the few languages where package management seems even more tiresome than in C/C++, and that is considering that those don't really have a widely used package manager (though I suppose apt/pacman somewhat count as on).
So for example let's compare what I need to do to compile/run some application I've found on GitHub, with most languages it's a couple of lines of code to build/run the app and you're good to go.

### Rust
For example with Rust, a supposedly super complicated language, I generally only have to run `cargo run`.
Setting up a Rust toolchain is also quite simple with rustup, although you can also install it with your distros package manager and things generally work, I think I've only ever had issues with rusty_v8 on FreeBSD, and I think some minor issues on Windows ARM, apart from that things in generally just work.

### Node.js
This time a language that a lot of beginners learn, here it's also quite simple in general, for the most part you just run `npm ci` and you have all dependencies installed, then look at the Readme or package.json to figure out how to start things (might have to start some docker containers in the background for Databases and such). You might have to use `pnpm` which works similar enough to npm to not be much of a problem, installation is also quite simple.

### C
For a language that doesn't have a package manager it's quite simple, on unix-like systems at least, for the most part you can do `./configure && make` and then you get an executable to run, the configure script might complain about missing dependencies but these you can quite easily figure out and install with you systems package manager, not that hard.

### Python
Now Python. The first problem is that it apparently doesn’t care about backwards compatibility; it’s almost as bad as Lua—most projects need a very specific Python version to run at all.
So how do you do that? Arch Linux for example only ships the newest Python in the standard repos, so you need to set up a venv or something to use that exact version. Then you use pip to install dependencies from some .txt file (really? A text file listing a couple of names?). At least you can pin versions.
This inevitably fails because one dependency uses native code and there’s no automatic fallback to compile it if no binary is available.
But wait—some projects use Anaconda or Miniconda, others use uv. There’s also pipx, which I don’t even know how it differs from pip. Oh, and isn’t there Poetry too? Why can’t this ecosystem just pick ONE standard for describing a package and its dependencies? Node.js nailed this: every project uses the same package.json.

## Distributing applications
This is another serious issue. How do you distribute your Python application? I’ve helped a couple of kids get into game dev with Python/pygame, and as soon as they build something cool they want to share it with friends… but how?

Even if we restrict ourselves to Windows PCs, there’s no simple way to bundle the program and all dependencies into a single .exe. Telling a non-developer friend to install Python, pygame, and everything else is a bit much.

These days I just teach them JavaScript/TypeScript. Works way better! The language itself doesn’t seem harder for them, and the huge win is that you can host the game for free on GitHub. One simple CI pipeline deploys everything to GitHub Pages and they get a shareable link. Sure, writing the pipeline is a little fiddly, but you can usually copy-paste a standard file that works for most games.

Native languages are obviously more complicated, but distributing a Rust executable, for example, isn’t that bad. Cargo is standardized enough that plenty of templates exist one can just use.

## Conclusions
I actively argue against using Python for anything, except AI/ML, where you’re basically forced into it because all the essential libraries are Python-only. It’s frustrating, because outside that niche I haven’t found a single redeeming quality. It just feels like a slow, messy language that people assume is “good for beginners” and then teach by default.

---

*Adiós,*
べン