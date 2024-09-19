+++
title = "Skill X Change - Day 0"
date = "2024-09-16"

[taxonomies]
tags = ["projects", "webdev", "skillxchange"]
+++

So for my first project I though I'd build a simple Web Page/App where people
can specify what they know and what they'd like to know, and the system
then matches people up so they hopefully learn something nice from each
other, not particularly novel/innovative but that's alright, it's the first
project and I still have to find a stack that works well for me.

![Screenshot 1](/img/skillxchange/day0/1.png)

## TechStack
So, for this project I mainly wanted to try out different technologies
that looked like they might simplify getting simple Apps done, we'll see
how that turns out.

### [Astro](https://astro.build/)
I've already used Astro a couple of times and I've been quite content with it

### [React](https://react.dev/)
While I do like lit.js, JSX is just nice and the Ecosystem is much bigger. Also there
are some things that are hard to do in a Shadow DOM.

### [Tailwind](https://tailwindcss.com/)
Never used this one before, kinda disliked the concept (what's the point, I can just write CSS!)
but have to say that when using a Component based FE Library like React, it kinda makes sense.

### [Material Tailwind](https://www.material-tailwind.com/)
Since I have no intention of building generic UI components for this project, some component
library just makes sense, this one looked kinda nice from afar and at least for now has
been quite alright, although the TS Types seem incorrect, so I've switched to JS for some
files/components (since it doesn't help that if a component is mostly just simple JSX).

### [Supabase](https://supabase.com/)
I wanted to try out firebase, but didn't like the whole Google lock-in, and it also seemed
a bit more complicated, while searching for alternatives I've stumbled upon Supabase which
looked like a pretty nice, open-source alternative.

## Results of Day 0
I didn't have too much time today but I did manage to work for a couple of hours during the night,
mainly setting things up, reading the docs. In the end I got a super simple skeleton of
an App, the Supabase Auth/Registration kinda works, but Session/Auth handling in general
doesn't really for now.

Generally have to say That Astro/React were Rock-Solid, Material Tailwind was also pretty nice to work with,
although that Uber component `<Typography>` doesn't sit right with me, don't really see the benefit over a
straigt `<p>`/`<h1>` or whatever, I suppose it's necessary for styles, though I'd then prefer separate
Components, since it's terrible to type out `<Typography variant="h1">Hello, World!</Typography>` instead of `<h1>Hello, World!</h1>`.

![Screenshot 0](/img/skillxchange/day0/0.png)

I'm still warming up to Tailwind, not entirely sure whether it adds that much if you're already using a
component library, but it's not bad, though takes a while to get used to writing it.

Supabase has also been quite nice, really like the Dashboard, felt kinda nice and had a general Schema up in no time. We'll see
how well it actually ends up being when it's being used by the app, since today I mostly just got some sort of basic Authentication
working.

![Screenshot 2](/img/skillxchange/day0/2.png)

If you want to look at the code including its entire history, then you can do so over on [GitHub](https://github.com/Melchizedek6809/skillexchange).

## Asides
Had 돼지국밥(Dwaeji gukbap) for lunch today which was really tasty, apparently a Busan specialy and definitely something to try out when you get the chance. Although the food here in general is fantastic, getting some fresh 김밥(Gimbap) for breakfast feels quite luxurious, even though it's pretty cheap.

Alright, it's 4:06 AM here in Busan right now, time to go to bed.