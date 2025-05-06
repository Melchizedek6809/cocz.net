import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import { render } from './pages';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Render a template with the given head and body content
 */
const renderTemplate = async (
  vite: any, 
  url: string, 
  head: string, 
  body: string
): Promise<string> => {
  const rawTemplate = await fs.readFile(resolve(__dirname, 'template.html'), 'utf-8');
  const template = await vite.transformIndexHtml(url, rawTemplate);
  
  return template
    .replace('<!-- HEAD_CONTENT_PLACEHOLDER -->', head)
    .replace('<!-- BODY_CONTENT_PLACEHOLDER -->', body);
};

/**
 * Handle an HTTP request and return the response
 */
const handleRequest = async (
  vite: any,
  req: express.Request, 
  res: express.Response
): Promise<void> => {
  const url = req.originalUrl;

  try {
    // Render the page
    const { head, body, status, contentType = 'text/html' } = await render(url);

    // For HTML content, apply the template
    let content = body;
    if (contentType === 'text/html') {
      content = await renderTemplate(vite, url, head, body);
    }

    // Send the response
    res.status(status).set({ 'Content-Type': contentType }).end(content);
  } catch (e) {
    vite.ssrFixStacktrace(e as Error);
    console.error(e);
    res.status(500).end((e as Error).stack);
  }
};

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

  // Handle all requests
  app.use(/(.*)/, async (req, res) => {
    await handleRequest(vite, req, res);
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
};

createServer();