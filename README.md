# Cocz.net - Custom TypeScript SSG

A minimalist static site generator built with TypeScript, featuring RSS feed support, sitemaps, and JSON-LD structured data.

## Features

- Markdown post rendering
- RSS feed generation
- XML sitemap generation
- JSON-LD structured data
- Tag-based organization
- Customizable templates

## Project Structure

```
.
├── content/          # Markdown blog posts
├── public/           # Static assets
├── src/
│   ├── build.ts      # Build process for static site generation
│   ├── entry.ts      # Entry class for managing blog posts
│   ├── fe/           # Frontend assets
│   ├── pages.ts      # Page renderers
│   ├── rss.ts        # RSS feed generator
│   ├── sitemap.ts    # Sitemap generator
│   ├── template.html # HTML template
│   └── utils.ts      # Utility functions
└── dist/             # Generated site (after build)
```

## Usage

### Build

Build the static site:

```bash
npm run build
```

This will generate the static site in the `dist/` directory, including a content-hashed CSS file in `dist/assets/`.

## Content Format

Blog posts are Markdown files in the `content/` directory with YAML frontmatter:

```md
---
title: "Post Title"
date: "2025-05-05"
description: "Post description"
tags: ["tag1", "tag2"]
---

Post content goes here...
```

## License

MIT
