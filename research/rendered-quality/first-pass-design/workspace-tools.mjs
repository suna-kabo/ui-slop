// A scoped MCP transport for benchmark hosts without a working nested shell.
import { createInterface } from 'node:readline';
import { createServer } from 'node:http';
import { readFile, writeFile, readdir, mkdir, cp, lstat, realpath } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = await realpath(process.cwd());
const reviewOnly = process.argv[2] === 'review';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

async function scoped(name) {
  if (typeof name !== 'string' || isAbsolute(name) || name.includes(':')) throw Error('Use a relative path');
  const target = resolve(root, name);
  const path = relative(root, target);
  if (path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path)) throw Error('Path outside workspace');
  let ancestor = root;
  for (const part of path.split(sep).filter(Boolean)) {
    ancestor = resolve(ancestor, part);
    const info = await lstat(ancestor).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
    if (info?.isSymbolicLink()) throw Error('Links are unavailable');
  }
  return target;
}

const server = createServer(async (request, response) => {
  try {
    const name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
    const file = await scoped(name.endsWith('/') ? `${name}index.html` : name);
    const type = types[extname(file)];
    if (!type || name.startsWith('skill/')) throw Error('Unavailable asset');
    const bytes = await readFile(file);
    response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(bytes);
  } catch {
    response.writeHead(404).end();
  }
});

function tool(name, description, properties, required, run) {
  return { name, description, inputSchema: { type: 'object', properties, required }, run };
}

const str = { type: 'string' };
const strings = { type: 'array', items: str };
const text = (message) => ({ type: 'text', text: typeof message === 'string' ? message : JSON.stringify(message, null, 2) });
const tools = [
  tool('list_files', 'List the entries in a workspace directory.', { path: str }, ['path'],
    async ({ path }) => [text(await readdir(await scoped(path)))]),
  tool('read_files', 'Read exact UTF-8 text files. Use this for the brief, assigned skill and source.',
    { paths: strings }, ['paths'], async ({ paths }) => Promise.all(paths.map(async (path) =>
      text(`${path}\n${await readFile(await scoped(path), 'utf8')}`)))),
  tool('write_files', 'Create or replace UTF-8 source or process evidence files. The assigned inputs are read-only.',
    { files: { type: 'array', items: { type: 'object', properties: { path: str, content: str },
      required: ['path', 'content'] } } }, ['files'], async ({ files }) => {
    for (const { path, content } of files) {
      const file = await scoped(path);
      const category = relative(root, file).split(sep)[0];
      const allowed = reviewOnly ? ['process'] : ['proof', 'initial', 'final', 'process'];
      if (!allowed.includes(category)) throw Error('Use an output folder');
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, content);
    }
    return [text(files.map(({ path }) => path))];
  }),
  tool('copy_tree', 'Copy a proof or initial directory to a new initial or final directory.',
    { from: { enum: ['proof', 'initial'] }, to: { enum: ['initial', 'final'] } }, ['from', 'to'],
    async ({ from, to }) => {
      if (reviewOnly || !['proof', 'initial'].includes(from) || !['initial', 'final'].includes(to) || from === to) throw Error('Invalid copy');
      const target = await scoped(to);
      if (await lstat(target).catch((error) => { if (error.code !== 'ENOENT') throw error; })) {
        throw Error('Destination already exists');
      }
      await cp(await scoped(from), target, { recursive: true, force: false, errorOnExist: true });
      return [text(`Copied ${from} to ${to}`)];
    }),
  tool('operate', 'Run Playwright Chromium in a fresh context. Run actual actions and inspect screenshots. Each action uses CSS or Playwright selector syntax. Use snapshot to get visible text, focus and overflow. Captures and the trace are stored in process/.', {
    entry: str, label: str, width: { type: 'integer' }, height: { type: 'integer' },
    reducedMotion: { type: 'boolean' },
    steps: { type: 'array', items: { type: 'object', properties: {
      action: { enum: ['click', 'tap', 'fill', 'select', 'check', 'focus', 'press', 'assertText', 'assertVisible', 'assertFocus', 'reload', 'back', 'snapshot', 'capture'] },
      selector: str, value: str,
    }, required: ['action'] } },
  }, ['entry', 'label', 'width', 'height', 'steps'], operate),
];

let browser;
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

async function operate({ entry, label, width, height, reducedMotion, steps }) {
  if (!/^(proof|initial|final)\//.test(entry) || !/^[a-z0-9-]{1,70}$/i.test(label)
      || width < 280 || width > 2000 || height < 350 || height > 1600 || steps.length > 70) {
    throw Error('Invalid entry, label, viewport or step count');
  }
  await scoped(entry);
  const dir = await scoped(`process/${label}`);
  await mkdir(dir, { recursive: false }).catch(async (error) => {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(dir, { recursive: true });
  });
  browser ??= await chromium.launch(process.env.UI_SLOP_CHROMIUM_PATH
    ? { executablePath: process.env.UI_SLOP_CHROMIUM_PATH } : {});
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 600,
    serviceWorkers: 'block',
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  const errors = [];
  const rows = [];
  const images = [];
  page.setDefaultTimeout(2400);
  page.on('pageerror', (error) => errors.push(error.message));
  await context.route('**/*', (route) => route.request().url().startsWith(`${origin}/`) ? route.continue() : route.abort());
  await context.routeWebSocket('**/*', (webSocket) => webSocket.close());
  await context.tracing.start({ screenshots: true, snapshots: true });
  try {
    await page.goto(`${origin}/${entry}`, { timeout: 6000 });
    for (const [index, { action, selector, value }] of steps.entries()) {
      const item = selector && page.locator(selector).first();
      const at = performance.now();
      try {
        if (action === 'click' || action === 'tap' || action === 'check' || action === 'focus') await item[action]();
        else if (action === 'fill') await item.fill(value);
        else if (action === 'select') await item.selectOption({ label: value });
        else if (action === 'press') await (item ?? page.keyboard).press(value);
        else if (action === 'reload') await page.reload();
        else if (action === 'back') await page.goBack();
        else if (action === 'assertVisible' && !(await item.isVisible())) throw Error('Element is not visible');
        else if (action === 'assertText' && !(await item.innerText()).includes(value)) throw Error(`Missing text: ${value}`);
        else if (action === 'assertFocus' && !(await item.evaluate((element) => element === document.activeElement))) throw Error('Unexpected focus');
        else if (action === 'snapshot') rows.push(await page.evaluate(() => ({
          route: location.hash, content: document.body.innerText.slice(0, 3500),
          focus: document.activeElement.outerHTML.slice(0, 240), overflow: document.documentElement.scrollWidth > innerWidth,
        })));
        else if (action === 'capture' && images.length < 3) {
          const bytes = await page.screenshot({ type: 'jpeg', quality: 75, path: resolve(dir, `${index}.jpg`) });
          images.push({ type: 'image', mimeType: 'image/jpeg', data: bytes.toString('base64') });
        }
        rows.push({ index, action, elapsedMs: Math.round(performance.now() - at) });
      } catch (error) {
        rows.push({ index, action, error: error.message });
        break;
      }
    }
  } finally {
    await context.tracing.stop({ path: resolve(dir, 'trace.zip') });
    await context.close();
    await writeFile(resolve(dir, 'steps.json'), JSON.stringify({ entry, width, height, errors, steps, rows }, null, 2));
  }
  return [text({ rows, errors }), ...images];
}

async function invoke({ method, params }) {
  if (method === 'initialize') return { protocolVersion: params.protocolVersion,
    capabilities: { tools: {} }, serverInfo: { name: 'isolated-ui-benchmark', version: '1.0.0' } };
  if (method === 'ping') return {};
  if (method === 'tools/list') return { tools: tools.map(({ run, ...definition }) => definition) };
  if (method === 'tools/call') {
    const definition = tools.find(({ name }) => name === params.name);
    if (!definition) throw Error('Unknown tool');
    return { content: await definition.run(params.arguments) };
  }
  throw Error(`Unsupported method ${method}`);
}

for await (const line of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
  const request = JSON.parse(line);
  if (request.id === undefined) continue;
  let reply;
  try {
    reply = { result: await invoke(request) };
  } catch (error) {
    reply = { result: { isError: true, content: [text(error.message)] } };
  }
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, ...reply })}\n`);
}
await browser?.close();
server.close();
