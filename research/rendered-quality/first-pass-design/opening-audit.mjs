import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const [packetArg, outputArg, phase] = process.argv.slice(2);
if (!packetArg || !outputArg) throw Error('Usage: node opening-audit.mjs <packet> <output> [initial]');
const packet = resolve(packetArg);
const output = resolve(outputArg);
const queue = JSON.parse(await readFile(join(packet, 'queue.json'), 'utf8')).filter(row =>
  !phase || row.entry.startsWith(`${phase}/`) || row.id.endsWith(`-${phase}`));
await mkdir(output, { recursive: true });
const server = await serve(packet);
const browser = await chromium.launch();
const data = [];
try {
  for (const { id, task, entry } of queue) {
    for (const [width, height, variant] of [[1440, 900, 'default'], [390, 844, 'default'],
      [320, 740, 'default'], [390, 844, 'reduced'], [390, 844, 'root-200']]) {
      const context = await browser.newContext({ viewport: { width, height },
        reducedMotion: variant === 'reduced' ? 'reduce' : 'no-preference' });
      try {
        await context.route('**/*', r => r.request().url().startsWith(`${server.origin}/`) ? r.continue() : r.abort());
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        await page.goto(`${server.origin}/${entry}`);
        if (variant === 'root-200') await page.addStyleTag({ content: ':root { font-size: 200% !important; }' });
        await page.evaluate(() => document.fonts.ready);
        const facts = await page.evaluate(() => {
          function inView(element) {
            const r = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight
              && style.visibility === 'visible' && style.display !== 'none';
          }
          function factsFor(el) {
            const style = getComputedStyle(el);
            return { text: el.innerText.trim().replace(/\s+/g, ' ').slice(0, 80),
              family: style.fontFamily, pixels: Number.parseFloat(style.fontSize),
              weight: style.fontWeight, top: Math.round(el.getBoundingClientRect().top) };
          }
          const headings = [...document.querySelectorAll('h1,h2,[role=heading]')].filter(inView).slice(0, 8).map(factsFor);
          const statuses = [...document.querySelectorAll('[class*="status"],[class*="badge"],[class*="pill"]')]
            .filter(inView).map(factsFor).filter(x => x.text && x.text.length < 38).slice(0, 12);
          let bodyBackground = getComputedStyle(document.body).backgroundColor;
          if (bodyBackground === 'rgba(0, 0, 0, 0)') bodyBackground = getComputedStyle(document.documentElement).backgroundColor;
          return { headings, statuses, bodyBackground, visibleButtons: [...document.querySelectorAll('button')].filter(inView).length,
            rootOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            rootSize: getComputedStyle(document.documentElement).fontSize };
        });
        const cdp = await context.newCDPSession(page);
        await cdp.send('DOM.enable');
        await cdp.send('CSS.enable');
        const { root } = await cdp.send('DOM.getDocument');
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'h1' });
        const fonts = nodeId ? (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts : [];
        const file = `${id}-${width}-${variant}.png`;
        await page.screenshot({ path: join(output, file) });
        data.push({ id, task, width, height, variant, file, ...facts, fonts, errors });
      } finally {
        await context.close();
      }
    }
  }
  await writeFile(join(output, 'metrics.json'), JSON.stringify(data, null, 2));
  console.log(`${data.length} opening states captured`);
} finally {
  await browser.close();
  server.close();
}
