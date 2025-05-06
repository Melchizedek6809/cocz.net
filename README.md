# Cocz.net - Custom TypeScript SSG

A minimalist static site generator built with TypeScript, featuring RSS feed support, sitemaps, and JSON-LD structured data.

## Features

- Markdown post rendering
- RSS feed generation
- XML sitemap generation
- JSON-LD structured data
- Tag-based organization
- Development server with hot reloading
- Customizable templates

## Project Structure

```
.
├── content/          # Markdown blog posts
├── public/           # Static assets
├── src/
│   ├── build.ts      # Build process for static site generation
│   ├── entry.ts      # Entry class for managing blog posts
│   ├── fe/           # Frontend assets (CSS, JS)
│   ├── pages.ts      # Page renderers
│   ├── rss.ts        # RSS feed generator
│   ├── server.ts     # Development server
│   ├── sitemap.ts    # Sitemap generator
│   ├── template.html # HTML template
│   └── utils.ts      # Utility functions
└── dist/             # Generated site (after build)
```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

This will start a local server at http://localhost:3000 with hot reloading.

### Build

Build the static site:

```bash
npm run build
```

This will generate the static site in the `dist/` directory.

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
