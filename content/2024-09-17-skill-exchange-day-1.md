+++
title = "Skill X Change - Day 1"
date = "2024-09-17"

[taxonomies]
tags = ["projects", "tech", "skillxchange"]
+++

So, I'm calling quits on this project. Mainly because working with
this stack is just no fun and mostly just slows me down. Still good
that I tried things so out, so that now I know WHY I don't like certain
parts of the stack. So, in this Entry I'll kinda talk about each componten,
what I thought of it and whether I'd use it again or not, and most importantly:
for what kind of project I'd use it. Since I'm currently mostly interested in
finishing concentrated MVP's as fast as possible to figure out whether the idea
itself is any good.

## Observations

### Astro
Worked quite alright, still a big fan of it, especially for sites that are mostly static,
since this is where for me at least the main advantage lies over next.js, maybe they
improved things by now, but last time I checked the static export didn't seem to get
all that much attention, especially when it came to optimizations.

Although I gotta say, the way api routes were handled aren't all that great.
Really not a fan of having these hidden options you kinda have to know about
to make sure it doesn't try to prerender/cache your api route:

```javascript
export const prerender = false;
// You need to export this value in an api route so it works in hybrid mode... not a fan
```

### React
So yeah, React works quite well, as expected, though I still have to say, somehow it just
doesn't feel that fulfilling.  I kinda get the vibe that React really shines when you need
complex frontend components (since it has by far the biggest ecosystem), or you have at least
a smallish team with junior devs who benefit from the constraints React enforces.

But considering that I basically just want somewhat nicer looking textboxes I think for
the projects I'm doing right now the cost/benefit ratio just isn't there, especially
considering that if I want complex frontend components they'll probably be something
that I'll need to write by myself anyways, so might as well just write things the
vanilla way.

### Tailwind
Worked much better than expected, although looking at some of the classes that
some of these material tailwind components had was kinda disgusting, take the
nice looking text input with a label as an example:

```html
<div class="relative w-full min-w-[200px] h-11"><input type="email" name="email" class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-3 rounded-md border-blue-gray-200 focus:border-blue-500 !w-full" placeholder=" "><label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500">E-Mail </label></div>
```

I mean, it works and looks quite alright... but who can understand this after the fact? Haven't we learned anything from the whole Perl write once read never problems. I mean it's kinda cool on some level, but this adds a massive layer of abstraction with unclear benefit, only to write a couple characters less, and I gotta say typing is rarely the limiting factor, especially when one has an LLM assistant that understand quite often
what you want while writing the first couple of characters already.

SO yeah, Tailwind is not something I'll choose again, doesn't really seem to add any benefit whatsover, especially in a larger project it seems quite harmful. IT also seems terribly slow since there are now sooo many classes that the browser needs to match, and there might be thousands of rules in the background. Just why? I mean lets take `absolute` as an example, if I'm in a CSS file and I type `po[Return]ab[Return]`, doesn't seem all that slower...

Oh and if a Tailwind fan reads this, please tell me why you enjoy it, I genuinely do not understand why someone would use this and would love to
understand why it's getting so popular, since it has to fix some sort of problem that I'm currently unaware of.

### Supabase
This one was quite alright, although I didn't really get to use it all that much. Gotta say the admin interface was pretty slick, setting up the schema was quite pleasant for the most part, had some issues while renaming/changing the type of a column and had to this multi step process so I wouldn't get an error message. Will probably give it a try in the future if I need the multiplayer features (those seem pretty cool), but so far I think I'll just stick to SQLite.

## Conclusions
So, this was a very educational project that got me thinking, I'm kinda wondering now what other kinds of CGI Languages one could use that have
great SQLite bindings. Since I've come to the conclusion that for these super focused MVP's the following stack is the one I'll try next:

### PHP
Yeah I know, it's not a great language, but similar to golang the benefit comes from something else, mainly the CGI model. It's just such a simple
model that allows for super fast iteration times.  And I gotta say, for all its warts, PHP got the string concatenation operator right, since string concatenation is quite different from addition, so having a separate operator seems like a pretty good decision. It's also nice that it is probably
one of the few languages here that combines a simple model with pretty much instant iteration times BUT still allowing for scalability down the line.

Apart from that PHP gets ugly really quickly, but as long as the entire project is just a couple thousand lines it seems like quite the alright choice, given thet one doesn't need WebSockets

### SQLite
Can't say enough good things about this underappreciated gem, it's just such a joy to work with since one doesn't need to concern oneself with how
to connect to the DB, which user, which password, all of those superfluous details go away and you just point it towards a file... and that's it!
Also super convenient during development, oh something weird is happening but only in production? Just sftp the entire DB on my dev laptop and I can
test things out to my hearts content.

### Vanilla JS
While I do like TypeScript a lot, it's really nice to skip the build step, especially if the backend is not written in Node, since this means one
can pass on npm entirely. Also helps that most people have a somewhat newish browser so one can use modern JS without transpilation (since ES3 isn't that great to write, it works but it's not nice).

### Cron
Sometimes things need to run in the background, why not just use a cronjob for that to regularly run a script


But yeah, I'm not entirely sold on PHP and might try some other languages for the backend but right now I don't know one that fits as well, at
least when considering the somewhat popular ones. Golang might kinda fit, but you still have a compilation cycle there, and Lua is just a language I do not like (the VM/Implementation is absolutely fantastic, but the language...). It might be interesting to write Ruby CGI scripts, since Ruby probably has great SQLite bindings, but I'm not sure how big the ecosystem is outside of Rails.  Apart from that I guess Racket/CL might be an option, but I'm not sure how well they fit the whole FastCGI architecture, but they probably can't be beat when it comes to iteration times. Although I gotta say, having a script running that watches your source dir and rsync's everything to the server on any change feels super satisfying and not really slower than a REPL, with the added benefit that the REPL/Source can't desynchronize during development.