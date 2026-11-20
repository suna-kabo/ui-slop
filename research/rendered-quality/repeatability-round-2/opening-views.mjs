import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [packet, output] = process.argv.slice(2);
if (!packet || !output) throw new Error('Usage: node opening-views.mjs <review-packet> <captures>');
const root = resolve(packet);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.json': 'application/json' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
    if (pathname === 'favicon.ico') return response.writeHead(204).end();
    const path = resolve(root, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    if (relative(root, path).startsWith('..')) return response.writeHead(403).end();
    const content = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' }).end(content);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
try {
  const capture = fileURLToPath(new URL('../capture-artifacts.mjs', import.meta.url));
  const child = spawn(process.execPath, [capture, join(root, 'queue.json'),
    `http://127.0.0.1:${server.address().port}/`, output], { stdio: 'inherit' });
  const [exit] = await once(child, 'exit');
  if (exit) process.exitCode = exit;
} finally {
  server.close();
}
