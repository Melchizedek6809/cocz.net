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
- sha256sum

## Project Structure

```
.
├── content/          # Markdown blog posts
├── pages/            # Markdown static pages
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

Static pages are Markdown files in the `pages/` directory. They use `title` and `description` frontmatter, derive their URL from the filename, and are excluded from the blog index and RSS feed.

## License

MIT
