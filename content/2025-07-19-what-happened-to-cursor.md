---
title: "Cursor's Pricing Train-Wreck: What the Hell Happened?"
date: "2025-07-19"
description: "A short rant (and post-mortem) on Cursor's sudden pricing pivot and why I'm walking away."
tags: ["tech", "ai", "rant"]
---

<div class="intro">
If you blinked last week, you probably missed Cursor lighting its reputation on fire. I'm writing this mainly to vent, but also to figure out how a tool I loved managed to shoot itself in both feet.
</div>

## What actually changed?

For the past year I paid $20/month and got **500 fast premium requests** to models like Claude. Depending on the model, a single call cost 0.5 or 2 of those requests. The system was transparent: I could see exactly how much runway I had left, and I rarely ran dry. On the odd month I did, I knew the counter reset in a few days and life went on.

Then—overnight—Cursor announced "unlimited" requests. Sounds dreamy, right? The fine print revealed it was really **$20 worth of API credits**, after which you hit opaque rate-limits. Worse, if you didn't set a spend cap, the system silently flipped to usage-based pricing and people racked up triple-digit bills while they were just… coding. I had a $5 hard limit, so I dodged the bullet, but after a day or two of normal work I was throttled into oblivion.

The whole switch was communicated via one popup I reflexively accepted because I still trusted the product. Big mistake.

## Where they screwed up

### 1. Orwellian marketing
Calling it "unlimited" when it's roughly **10% of the old quota** is just plain insulting.

### 2. Black-box rate limits
When you hit the wall you get an error: *Rate limit exceeded*. How long until you can continue? Five minutes? Five hours? Five days? Cursor won't say.
Compare that to Claude Code: the moment you hit the cap, it tells you "Back in 2 h 14 m" or offers an upgrade. Third-party burn-rate calculators even let you *plan* your session. That's how professionals treat other professionals.

### 3. Mystery tiers
Cursor added pricier plans that promise "more usage." How much more? **No one fucking knows.** I'd happily pay extra for a great tool, but after this stunt I'm not handing over any more money to them without a clear description of what I'll be getting.

### 4. Radio silence after the backlash
Weeks later there's still no real fix—just refunds for the surprise bills (probably to avoid lawsuits). Usage might be lighter now because people are fleeing; I actually managed a long session a couple of days ago without throttling. That's not a policy change, it's a side effect.

## Trying to understand their side
I get it, Cursor probably ran into issues because if you combine Claude 4 with some MCP servers you can make a single request go quite far. I've also managed this mainly by adding the Playwright MCP Server (great tool btw!) and adjusting the system prompt to get Cursor to regularly do 20-30 tool calls with a single request, using up tokens like crazy.

It's understandable that with things changing like this the pricing strategy also needs to change for things to stay fair. Having a simple question resulting in ~50 tokens and a massive refactor producing thousands of tokens cost the same amount of requests would surely lead to problems. If things were communicated like this and with proper transparent rate limits, then I'd be a happy Cursor user still, but this is just a complete trainwreck.

## So what now?

Technically Cursor is still great. The UX, the inline diffs, the little touches—they're all still there. But this wasn't a technical failure; it was a business decision executed with staggering stupidity. They torched user trust with a single update.

I've cancelled my subscription and moved to Claude Code. It isn't as *charming* as Cursor yet, but it's predictable, transparent, and respects my time. There are too many good AI editors out there to keep using one that apparently has no respect for their userbase.

-----

*Adiós,*
べン