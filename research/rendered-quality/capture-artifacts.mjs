import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [queueFile, baseUrl, output] = process.argv.slice(2);
if (!queueFile || !baseUrl || !output) {
  throw new Error('Usage: node capture-artifacts.mjs <public/queue.json> <local-server-url> <capture-directory>');
}
const queue = JSON.parse(await readFile(queueFile, 'utf8'));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.UI_SLOP_CHROMIUM_PATH });
const results = [];
try {
  for (const { id, task, entry } of queue) {
    for (const width of [1440, 768, 390, 320]) {
      const variants = width === 390 ? ['normal', 'reduced', 'text-200'] : ['normal'];
      for (const variant of variants) {
        const context = await browser.newContext({
          viewport: { width, height: width < 500 ? 844 : 900 },
          reducedMotion: variant === 'reduced' ? 'reduce' : 'no-preference',
        });
        try {
          const page = await context.newPage();
          const errors = [];
          const failedResponses = [];
          page.on('response', response => {
            if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url() });
          });
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => {
            if (message.type() === 'error') errors.push(message.text());
          });
          await page.goto(new URL(entry, baseUrl).href, { waitUntil: 'domcontentloaded' });
          if (variant === 'text-200') await page.addStyleTag({ content: ':root{font-size:200% !important}' });
          await page.evaluate(() => document.fonts.ready);
          const observed = await page.evaluate(() => ({
            title: document.title,
            headings: [...document.querySelectorAll('h1')].map(el => el.innerText),
            fontSize: getComputedStyle(document.documentElement).fontSize,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          }));
          const file = [id, width, variant].join('-') + '.png';
          await page.screenshot({ path: join(output, file) });
          results.push({ id, task, width, variant, ...observed, file, errors, failedResponses });
        } finally {
          await context.close();
        }
      }
    }
  }
  await writeFile(join(output, 'first-view.json'), JSON.stringify(results, null, 2) + '\n');
} finally {
  await browser.close();
}
