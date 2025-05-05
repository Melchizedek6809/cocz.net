# CoCZ.net 🌟

Source code for my blog over at [cocz.net](https://cocz.net/)

Now it also contains a custom Static Site Generator (SSG) and built with TypeScript, Express, and Vite! (｀・ω・´)

## Why another SSG

I tried to use Zola for blogging but got very frustrated trying to add JSON-LD using the template system, I'm no fan of templating languages at all (in my opinion they are just atrocious untested programming languages, I'd rather use something sensible).

So after giving up on that I looked around for some other SSGs but had to give up on most of them because they either bloated up the output, had no good way to theme/extend things with a proper language.

Now here we are, one afternoon spent with Cursor and I've got everything I need, and even done in a way that I can extend it further down the line.

## Features ✨

- 🚀 Fast and modern development experience with Vite
- 📝 Markdown support with markdown-it
- 💅 Syntax highlighting with highlight.js
- 🔧 TypeScript for type safety
- 🎨 Custom styling and theming
- 📱 Responsive design

## Prerequisites 🛠️

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation 🏗️

1. Clone the repository:
```bash
git clone https://github.com/Melchizedek6809/cocz.net.git
cd cocz.net
```

2. Install dependencies:
```bash
npm install
```

## Development 🚀

To start the development server:
```bash
npm run dev
```

## Building for Production 🏭

To build the project:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Type Checking ✅

Run type checking for frontend:
```bash
npm run typecheck:fe
```

Run type checking for backend:
```bash
npm run typecheck:be
```

Run all type checks:
```bash
npm test
```

## Project Structure 📁

```
cocz.net/
├── src/           # Source code
├── content/       # Content files (markdown, etc.)
├── public/        # Static assets
├── dist/          # Build output
└── vite.config.ts # Vite configuration
```

## Technologies Used 🛠️

- TypeScript
- Express
- Vite
- markdown-it
- highlight.js
- YAML

## License 📄

MIT License
