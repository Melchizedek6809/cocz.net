import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import { render } from './pages';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createServer = async () => {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: __dirname,
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: resolve(__dirname, '../dist'),
      assetsDir: 'assets',
    }
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the public directory
  app.use(express.static(resolve(__dirname, '../public')));

  const renderTemplate = async (url: string, head: string, body: string) => {
    const rawTemplate = await fs.readFile(resolve(__dirname, 'template.html'), 'utf-8');

    const template = await vite.transformIndexHtml(
      url,
      rawTemplate
    );

    return template
      .replace('<!-- HEAD_CONTENT_PLACEHOLDER -->', head)
      .replace('<!-- BODY_CONTENT_PLACEHOLDER -->', body);
  }

  app.use(/(.*)/, async (req, res) => {
    const url = req.originalUrl;

    try {
      let { head, body, status, contentType } = await render(url);

      contentType = contentType || 'text/html';
      if (contentType === 'text/html') {
        body = await renderTemplate(url, head, body);
      }

      // Send the rendered HTML back
      res.status(status).set({ 'Content-Type': contentType }).end(body);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error(e);
      res.status(500).end((e as Error).stack);
    }
  });

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
  });
};

createServer();