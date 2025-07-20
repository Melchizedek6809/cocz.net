---
title: "A Type-Safe, Lightweight i18n System in TypeScript"
date: "2025-07-20"
description: "Sick of JSON-based i18n? Here's a lightweight, type-safe approach to internationalization in TypeScript that doesn't need libraries or boilerplate."
tags: ["tech", "i18n", "rant"]
---

<div class="intro">
While working on bitmenu and adding i18n I though I'd write an entry about how I like to handle translations in TypeScript projects.
</div>

## The common i18n pattern (and why I hate it)
It's quite common to use libraries like react-i18next for building applications supporting multiple languages, they mainly work by providing a function that takes a single string argument and returns the string to be used.

I absolutely hate this approach because it's very error prone and I've only seen it work somewhat by adding helper scripts that run in CI to make sure one doesn't forget keys or uses keys that don't exist in the application.

## A better, type-safe alternative
It's simple enough to not require any libraries, it's just a couple of lines of typescript that provide a much more powerful interface than libraries using the approach mentioned earlier:

### i18n.ts
```typescript
import { en } from "./en";
import { de } from "./de";

export const lang = document.querySelector("html")?.getAttribute("lang") || "de";
export const getKeys = (language: string) => {
	switch (language.substring(0, 2).toLowerCase()) {
		default:
		case "en":
			return en;
		case "de":
			return de;
	}
};
export const t = getKeys(lang);
```

### en.ts
```typescript
export const en = {
	cart: {
		showOrder: "Show order",
		hideOrder: "Hide order",
		submit: "Send now",
		total: "Total:",
	},
};
export type TranslationKeys = typeof en;
```

### de.ts
```typescript
import type { TranslationKeys } from "./en";

export const de: TranslationKeys = {
	cart: {
		showOrder: "Bestellung ansehen",
		hideOrder: "Bestellung verstecken",
		submit: "Jetzt absenden",
		total: "Gesamt:",
	},
};
```

Now you can use this system as follows in the rest of the application:
```typescript
import { t } from "./i18n";

console.log(t.cart.showOrder)
```

Notice how we don't need to pass a string to a function, instead we have a complete object we can just pick the right string from. This has a couple of very important benefits:

- Full autocomplete without any plugins
- Using a key that doesn't exist results in a type error
- Forgetting to translate a key results in a type error as well
- We don't need to add yet another library!

I absolutely love this approach, it's much more maintainable in my experience. You can even use functions for some keys if the translation needs arguments, tsc will notice this and force you to actually call it and provide the right arguments.

## Room for improvement
Right now I'm just bundling everything together for all users, this isn't much of an issue because in my projects I only have a couple hundred keys and support only a handful languages.

It's not that complicated though to adapt this scheme to dynamically import the language required.
Any LLM coding agent should be able to do that in a couple of seconds.

-----

*Adiós,*
べン