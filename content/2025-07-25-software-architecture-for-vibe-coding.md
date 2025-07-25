---
title: "Designing software architecture for AI coding assistants"
date: "2025-07-25"
description: "AI coding assistants excel at small projects but struggle with larger codebases. Here's how we can architect systems to scale AI development effectively."
tags: ["software-architecture", "ai", "vibecoding", "llm", "development", "claude-code"]
---

## The Promise and Pain of AI Coding

While I am quite dissatisfied with the experience of coding agents like Claude Code for projects that reach a certain size, they are amazing for quickly spinning up a prototype or building small sites and scripts.

This led me to think about how one might go about structuring things to allow AI agents to still work effectively for bigger projects. One problem is that right now there's no real consensus on how to actually architect a good system. Though it probably helps that a lot of people agree on what makes certain systems bad. This, however, might not transfer to what makes a system architecture good for AI agents, so I'm trying to organize my thoughts in this article.

## Where AI Agents Hit Their Limits

A general limitation of most AI agents is the limited context window. This is probably the biggest limitation and a big reason why things work great for small-scale projects but then quickly fall apart—the LLM just can't keep track of everything.

Another issue is that, at least in my experience, properly encapsulating things is essential for the assistant to get things right. I've rarely gotten acceptable results for changes that require non-obvious modifications all across the codebase. Just adding a new function/method or adding a new case works pretty well though.

I've also had pretty bad experiences letting the AI write stateful React components. The component itself is not an issue, and they do an excellent job at that. But figuring out how to handle state, how to pass it through the component hierarchy, and how to build things in a way that the AI can later extend properly has rarely worked out. So far I've mostly had the agent build a prototype and then rewritten all the state-handling code myself later. This still helps a little but not as much as I'd like it to.

Compared to that, I have a couple of projects that don't use React at all but render everything server-side using, for example, EJS. This works surprisingly well because the AI has no problem figuring out that it needs new data in the template, so it makes sure to pass it along from the endpoint. No careful restructuring is necessary, and if one keeps prompting the AI to take a look at the endpoints/templates and see whether there's room for simplification, they do an okay job.

## What Humans Struggle With (That AI Doesn't)

Another aspect that might be worth pondering for a bit is what kinds of limitations human coders have, especially compared to LLMs. One thing is that LLMs know pretty much all the common languages and frameworks that are in common use—you'll be hard-pressed to find a human that can write reasonable code in 100+ languages.

Another problem is that humans can only work on a single thing at a time, whereas with agents you're generally only limited by how much you're willing to spend on inference. You could just run 100+ agents in parallel producing thousands of lines of code per second, so the question is how one could enable this.

Humans are also quite slow when it comes to learning new abstractions, while an LLM can easily scan and read a codebase and figure out how to use them quickly enough.

## Architectural Strategies for AI Development

One way to circumvent the limited context window is to make sure to use old and stable libraries and use as few custom abstractions as possible. The models have vast amounts of code in their training set, so the knowledge on how to use these libraries is part of the weights. Custom abstractions, even if simple and beautiful, still need to be put into the context window. This puts a limit on how many custom abstractions one can have in a codebase before it overwhelms the LLM, leading to terrible results.

However, these abstractions can still be used as long as any change only requires a limited amount of knowledge about this particular codebase. So let's say we have 10 subsystems working together—for human coders it might be better to build 20 abstractions used in every subsystem. For an LLM, it might be better, though, to make sure that any subsystem only uses a couple of abstractions, even if that means that the total number of abstractions is greater.

In general, I think one needs to be careful that any one change only touches at most 2 subsystems at once, since a global change will fill the context window rather quickly. One should be able to do a global change, though, by using proper API versioning: first introducing the new API, and then changing every subsystem in sequence to use the new API. That way we never have a situation where the LLM needs global awareness.

Additionally, static typing seems absolutely necessary since the feedback loop with the type checker catches a lot of errors and greatly improves the quality of the results. Another thing, though this probably requires direct support by the agent, is proper hiding of implementation details. Let's say the LLM needs to use a certain class—as long as we're only using it, we only need to know about the public methods, and for those we should also get by with the type signature and comment describing the proper usage. The method body or private methods should never matter to an outside consumer. However, so far Claude Code, for example, still happily seems to read the entire module when it only needs to know about a certain class. Maybe tighter LSP integration would be key here since it should easily be able to distill essential information for the LLM to use.

Apart from that, I'm thinking that microservices might be a good pattern for LLM usage, since it enforces proper encapsulation and for the most part all functionality of a service can be described by an OpenAPI spec or something similar. Though modules and classes should serve a similar purpose without all the problems that come from distributed systems.

## Next Steps

I'll be experimenting a bit with different architecture patterns and languages to try and figure out which approach produces the best results. This would be good to know for future projects and would be quite valuable insight for my own coding agent work.

-----

*Adiós,*
べン