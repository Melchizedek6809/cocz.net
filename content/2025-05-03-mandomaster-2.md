---
title: "MandoMaster 2: Evolution of a Chinese Learning Tool"
date: "2025-05-03"
description: "A journey through the latest developments of MandoMaster, exploring improved lessons, AI-powered content creation, and the integration of beautiful Midjourney-generated imagery in this Chinese learning application."
tags: ["tech", "projects", "node", "llm"]
---

<div class="intro">
So I've been continuing working a little on MandoMaster, a free Chinese learning app. If you're interested in the beginning then you can read my <a href="/mandomaster">earlier entry</a>. In this entry I'd like to share how some things worked out as well as some (minor) lessons I learned along the way.
</div>

[![Screenshot of the redesigned mandomaster.com start page](/img/mandomaster/mm2_sc0.webp)](/img/mandomaster/mm2_sc0.webp)

## Latest Developments
While the overall idea has stayed the same, pretty much every aspect has been improved and polished.

### Structured Learning Path with AI-Enhanced Lessons
Before one could just add vocabulary to the review pile one by one without any sort of general explanation or plan.
Now things are quite different in that there are lessons a user must work through one by one. These introduce new concepts as well as vocabulary in a preset path and then add entries to the review pile after finishing a lesson.

[![Screenshot of the lesson overview](/img/mandomaster/mm2_sc1.webp)](/img/mandomaster/mm2_sc1.webp)

#### Writing process
Just like the normal dictionary entries, a lot of AI was used in the process here. In general, I specified the overall theme of the particular lesson and mostly specified the vocabulary that was to be taught in that particular lesson. I'd then use the AI to actually write a lesson about that, which I'd then reorder and rewrite heavily to fit the overall style. Basically a long back and forth just like the rest of the codebase.

#### Header Images
All of the lessons also have a header image. While it doesn't add any information, I think it does make things look somewhat nicer and in my opinion greatly helps the overview since you now have an image representing each lesson. Sometimes the image also represents the lesson quite well, while some topics were rather hard to describe in images.

I tried using both [Gemini and ChatGPT at first](/ai-image-generation/) which somewhat worked but wasn't great. In the end, I settled on the following workflow for generating these headers using Gemini/Midjourney:

- Use Gemini 2.5 Pro with a prompt telling it to create a comma-separated list of up to 15 tags specifying an image that represents the following lesson
- Copy and Paste this list and combine it with a custom prefix I've written giving an overall art direction into Midjourney
- Refine in Midjourney by generating variants of good-looking pictures and then editing/upscaling a final version

This worked really well and I still really enjoy the pictures generated via Midjourney, prompting some rather big redesigns.

[![Screenshot of a lesson showing a header image](/img/mandomaster/mm2_sc2.webp)](/img/mandomaster/mm2_sc2.webp)

### Enhanced Dictionary Search
I've (well, Claude 3.7 actually) written a dead simple search for the dictionary. While it's not particularly sophisticated, it works well enough for my use case when I need to look something up to check the reading/characters for a particular word.

### Improved Social Media Integration
Thanks to [url2og](/url2og), MandoMaster also has very nice OpenGraph images and improved metadata which makes it show up much better in most messaging apps and social media apps.

### Flexible Vocabulary Card System
I also generalized the dictionary view into a sort of general vocabulary card with two forms: a big one for the dictionary or the section at the end of a lesson listing all the vocabulary. The other form is an inline form that can be used within the lesson which then automatically shows the pinyin and allows one to hear a voice sample when clicking on the particular card.

[![Screenshot of the end of a lesson showing these vocabulary cards](/img/mandomaster/mm2_sc3.webp)](/img/mandomaster/mm2_sc3.webp)

## SEO and Discoverability Insights
I'm still learning a lot about how to design for searchability, but things are looking somewhat alright. It does get far more impressions/clicks than pretty much any other page I've made, which still isn't great but seems as though my efforts did have some effect. I'll probably stick to it and fine-tune things here and there in the future for various experiments.

## Conclusion
Rather fun project, learned a lot about SEO though I'm still somewhat lost. Apart from that, it does work as intended and helps at least me greatly in learning/reviewing my Chinese every day. I've also finally tried out Midjourney due to this and am quite excited about using it in future projects due to the great results I've gotten so far, because I feel that similar to Cursor, it's a great tool which one just has to learn how to use properly.

---
*Adios,*
べン
