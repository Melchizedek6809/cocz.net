---
title: "Hello GuixSD"
date: "2025-08-29"
description: "I've long been intrigued by declarative distros like NixOS/GuixSD, now I'm going all in!"
tags:
  - tech
  - linux
  - free software
  - guix
  - nix
---

<div class="intro">
I'm writing this from my desktop running GuixSD. I'm also running NixOS on my laptop to give both a fair try—quite excited to see which of the two I'll end up liking more.
</div>

## GuixSD

[GuixSD](https://guix.gnu.org/) is a Linux distribution that lets you define your entire operating system configuration using Guile Scheme. As a long-time fan of Lisp, this greatly appeals to me, so I’ve chosen GuixSD for my main desktop machine.

Since it’s a GNU project, the documentation is excellent—I really appreciate how much effort most GNU projects put into their manuals. That said, there’s still quite a steep learning curve. You need to wrap your head around a lot of unfamiliar concepts if you want more than just a very boring desktop experience. It also more or less requires learning Scheme, though for me that’s actually a plus since I haven’t been writing much Scheme lately.

The installation process was… complicated. Officially, only **linux-libre** is supported. At first I tried installing with a **nonguix** installation medium, but failed miserably. The TUI installer worked fine, but the resulting system wouldn’t boot. I then tried the CLI approach but gave up after a `guix pull` spent half an hour crawling to just 3%.

Luckily, my desktop only needs proprietary firmware for the GPU, so I ended up installing standard GuixSD with the **linux-libre** kernel, then added the nonguix channel to get a standard Linux kernel so I could actually use my GPU. I hadn’t realized AMD GPUs aren’t supported in linux-libre—I always thought AMD was preferable to NVIDIA on Linux. But from what I’ve gathered, only older Intel iGPUs are properly supported in linux-libre.

While that wasn’t too bad, I did forget to set up the nonguix substitute servers. This meant I ended up compiling my own Linux kernel, which took a while but was surprisingly painless. (I really like how these systems can transparently compile from source—fantastic feature!)

Now I’ve set up my usual i3 environment, with **IceCat** instead of Chromium. It’s been a while since I used Firefox as my daily driver, and I’m not sure whether it’s Guix or the IceCat patches, but it actually feels snappy—I really like it.

I’ve also been playing around with **direnv** while doing some C coding on Nujel. It’s very convenient to have environments change automatically as you `cd` around the filesystem. This will be especially nice when experimenting with various languages where I might not have full toolchains installed on every machine I use.

Package availability isn’t as broad as on Nix or Arch, which I expected. But that just makes it more fun to create Guix packages for the small programs I’ve grown attached to over the years.

To my surprise, the Emacs experience wasn’t all that great. It works as expected in general, but using distinct dev environments causes issues since the required LSPs may not be available in the global Emacs environment.

So far, I’ve just added `node` and `clang` to my user profile so Emacs can use `npm` for a TypeScript LSP and `clangd` for C/C++. There are direnv packages for Emacs too, though I haven’t quite figured out how to use them properly.

Another unsolved problem is **tree-sitter**. Even after adding the grammars to my user profile, Emacs can’t find the `.so` files. I’m considering two possible fixes:

### Option 1: Create my own Emacs package
Might be worth it, since I spend so much time in Emacs. I could compile the tree-sitter grammars as part of the package and maybe also include the Emacs packages I use.

### Option 2: Locate the `.so` files manually in Elisp
I’d rather not, since it feels hacky. But tree-sitter lets you specify directories for grammars. I could query the system to figure out where Guix stores them and set the path. If multiple directories aren’t supported, I might have to create a directory of symlinks to all the grammars. It’d probably work, but it doesn’t feel clean. Still, it’s a fallback if building my own Emacs package turns out too complicated.

### Conclusions
I’m excited to dive deeper into Guix itself. I want to figure out why NixOS updates are so much faster than Guix—surely Guile should be a much faster runtime than Nix? Maybe there’s room for optimization.

## NixOS on the horizon

On my laptop, I’m giving NixOS a try. While I’m not a huge fan of the language, the ecosystem feels much bigger, and it helps that they have no issue supporting non-free firmware (pretty much required for most notebooks). I also like how updates are noticeably faster than on Guix.

So far, I haven’t spent much time customizing the system, so I’ll probably write more about my NixOS experience in a later article.

---

*Adiós,*
べン
