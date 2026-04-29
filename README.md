# Cocz.net - Custom Guile SSG

A minimalist static site generator built with Guile Scheme, featuring RSS feed support, sitemaps, and JSON-LD structured data.

## Features

- Markdown post rendering
- RSS feed generation
- XML sitemap generation
- JSON-LD structured data
- Tag-based organization
- Customizable templates

## Requirements

- Guile 3
- guile-commonmark

## Project Structure

```
.
├── content/          # Markdown blog posts
├── public/           # Static assets
├── build.scm         # Build script
├── src/
│   ├── fe/           # Frontend assets
│   └── template.html # HTML template
└── dist/             # Generated site (after build)
```

## Usage

### Build

Build the static site:

```bash
./build.scm
```

This will generate the static site in the `dist/` directory. CSS is embedded directly into each generated HTML page.

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
