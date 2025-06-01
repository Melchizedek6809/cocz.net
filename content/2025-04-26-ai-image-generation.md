---
title: "My AI Image Generation Journey: ChatGPT vs Gemini"
date: "2025-04-26"
description: "Comparing ChatGPT, Gemini, and post-processing workflows for creating web-ready images with practical prompting tips and real results"
tags: ["vibe-coding", "ai", "image-generation", "dall-e", "gemini", "gimp"]
image: /img/ai_imagegen.jpg
---

Alright, so in the last couple of days I've been quite busy polishing [MandoMaster](https://mandomaster.com/) to get it to a state that I'm content with to show widely. Have learned quite a bit and I do enjoy the end result so now it's just about cleaning up what we already have so that I can put my main focus on [other projects](https://codewaifu.net/) and become just a user trying to improve their Chinese.

[![Example image generated for one of the mandomstar lessons](/img/ai_imagegen.jpg)](/img/ai_imagegen.jpg)

During these days I frequently needed header/hero images for various pages. For example, each lesson now contains a hero image, mainly so things don't look as boring and so that in the list view each item is at least somewhat visually distinct.

This whole process still isn't perfect but it does work and produces some decent results. I'll still try other methods in the coming days and I'll probably write another post giving a final verdict.

## What I've Tried So Far

For quick context, here's a rundown of the AI image tools I've been experimenting with:

- **ChatGPT's DALL-E**: Produces decent images with readable text, but often lacks visual appeal
- **Google's Gemini**: Creates visually interesting images but with nonsensical text elements
- **Post-processing**: GIMP for manual edits + AI upscalers like Img.Upscaler and waifu2x

Each has its strengths and weaknesses, which I'll dive into below. I haven't yet tried Midjourney or Stable Diffusion, but they're next on my list.

## ChatGPT

Honestly, using ChatGPT for image generation has been somewhat disappointing. While it does produce results and is actually rather good at generating readable text/characters, the images generally look rather boring. This might just be due to me writing bad prompts, but Gemini seems to produce far more visually appealing results using the same prompt.

Today I'll give ChatGPT another try and might just let it write the prompt itself or give me advice on how to get better results. I'm basically just playing around with it to get to a result I feel confident shipping.

## Gemini

So far I like Gemini's results the most. They do tend to produce text/characters that are nonsense, but the overall visual appeal is definitely there. At times it needs multiple tries to get it right, and I do have to tweak the images afterward quite often, but it significantly reduces the amount of work needed.

## Editing images afterward

If I have very specific changes I want to make, I now skip further AI prompting and instead open the generated image in [GIMP](https://www.gimp.org/) to make the desired adjustments. Since I'm working on rather stylized images, this isn't much of an issue. I mostly just scale down things 4x when I'm done and then use an AI upscaler to remove a lot of the noise added by the AI or by my manual edits. 

Right now I'm using [Img.Upscaler](https://imgupscaler.com/) which works quite well. I also tried [waifu2x](https://www.waifu2x.net/) but the results weren't as pleasing.

## My Workflow

A quick summary of my current image generation workflow:

1. Generate initial image using Gemini with detailed prompts
2. If needed, edit in GIMP to fix text or other details
3. Downscale by 4x to remove artifacts
4. Upscale with Img.Upscaler to restore quality
5. Final minor adjustments if necessary

This approach gives me just enough control while still leveraging the AI's creative capabilities.

## Prompting Tips

After dozens of attempts, here are some prompting strategies I've found helpful:

- **Be overly specific**: "Create a colorful, stylized Chinese classroom scene with a teacher at a whiteboard" works better than vague prompts like "Chinese lesson image"
- **Mention art style**: Adding "in the style of [artist/movement]" drastically changes results. I've had good luck with "digital illustration" and "isometric pixel art"
- **Add an image with a color palette you like**: for the header images I like to use a similar color palette in most of them, so I've added another header image with a color palette I like to the prompt and told Gemini to use it as a reference
- **List what NOT to include**: For ChatGPT especially, saying "no text overlay" or "avoid human faces" helps prevent common issues
- **Iterate on successful prompts**: When you get something close, refine that prompt rather than starting over
- **Aspect ratio matters**: Specifying "16:9 landscape format" or "square 1:1 ratio" helps create images that fit your layout

These are early findings, and I'm still learning what works best. If you have tips that work well for you, I'd love to hear them!

## Future Experiments

Today I still have several lessons that need editing and hero images. I'll use this opportunity to try different approaches, since this challenge will likely come up again in the future. I'm going to try figuring out how to get ChatGPT to produce better results. Beyond that, I should probably give Midjourney and various Stable Diffusion models a try as well.

Some specific things I want to test:
- Different prompt structures for better DALL-E results
- Using reference images with ChatGPT
- Finding the right balance between AI generation and manual editing

## Conclusion

It's still amazing to me how much easier content generation has become. Now I can just type out a rough draft (or let an AI generate it), edit it with AI assistance, generate headers and generally clean everything up. AI can add reasonable keywords/metadata, write acceptable titles, and generate header images (which I don't love yet, but they enable nice designs when representing articles visually).

I'm excited to get better at using these tools and to figure out where the actual limitations lie.

---

*Adios,*
べン
