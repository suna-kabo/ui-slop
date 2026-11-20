import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

export async function serve(directory) {
  const root = resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      let name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
      if (name === 'favicon.ico') return response.writeHead(204).end();
      if (!name || name.endsWith('/')) name += 'index.html';
      const path = resolve(root, name);
      const local = relative(root, path);
      if (local === '..' || local.startsWith(`..${sep}`) || isAbsolute(local)) return response.writeHead(403).end();
      const bytes = await readFile(path);
      response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' }).end(bytes);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
