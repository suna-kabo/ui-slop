import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const [input, output, option] = process.argv.slice(2);
if (!input || !output) {
  throw new Error('Usage: node verify-review.mjs <prepared-cases-directory> <capture-directory>');
}
await mkdir(output, { recursive: true });
const key = JSON.parse(await readFile(join(input, 'key.json'), 'utf8'));
const browser = await chromium.launch({ executablePath: process.env.UI_SLOP_CHROMIUM_PATH });
const observations = [];
const server = createServer(async (request, response) => {
  try {
    const id = new URL(request.url, 'http://localhost').pathname.slice(1);
    if (id === 'favicon.ico') {
      response.writeHead(204).end();
      return;
    }
    if (!Object.hasOwn(key, id)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      .end(await readFile(join(input, 'public', id + '.html')));
  } catch {
    response.destroy();
  }
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

async function openCase(id, width, { reduced = false, scaled = false } = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://127.0.0.1:' + server.address().port + '/' + id);
  if (scaled) await page.addStyleTag({ content: 'html:root{font-size:200%}' });
  return { context, page, errors };
}

const shot = (page, name) => page.screenshot({ path: join(output, name + '.png'), fullPage: true });
async function noHorizontalOverflow(page) {
  const width = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  assert.ok(width[0] <= width[1], 'Root horizontal overflow ' + width.join(' > '));
}

try {
  for (const [id, name] of Object.entries(key)) {
    for (const width of [1440, 390]) {
      const { context, page, errors } = await openCase(id, width);
      if (name === 'response' || name === 'conventional') {
        await context.tracing.start({ screenshots: true, snapshots: true });
      }
      await shot(page, name + '-' + width + '-schedule');
      await page.locator('[data-load="0"]').click();
      await page.locator('#detail').waitFor();
      await shot(page, name + '-' + width + '-detail');

      await page.evaluate(() => {
        window.reviewSamples = [];
        const status = document.querySelector('#feedback');
        const count = document.querySelector('#north-count');
        let started;
        let previous;
        const read = event => {
          const state = [status.textContent, count.textContent, document.activeElement?.id];
          const signature = JSON.stringify(state);
          if (signature === previous) return;
          window.reviewSamples.push({ event, ms: Math.round(performance.now() - started), state });
          previous = signature;
        };
        document.querySelector('#reserve').addEventListener('pointerdown', () => {
          started = performance.now();
          read('press');
          function frame() {
            read('frame');
            if (performance.now() - started < 1000) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        }, { once: true });
      });
      await page.locator('#reserve').click();
      await page.getByText('One shelf slot reserved.', { exact: true }).waitFor();
      await shot(page, name + '-' + width + '-reserved');
      const canCancel = await page.locator('#cancel').isVisible();
      assert.equal(canCancel, name !== 'recovery');
      const frames = await page.evaluate(() => window.reviewSamples);
      await page.locator('#close').click();
      const restoresFocus = await page.locator('[data-load="0"]').evaluate(el => el === document.activeElement);
      assert.equal(restoresFocus, name !== 'continuity');
      assert.equal(frames.some(frame => frame.state[0].startsWith('Reserving')), name !== 'response');
      observations.push({ name, id, width, canCancel, restoresFocus, frames, errors });
      assert.deepEqual(errors, []);
      if (name === 'response' || name === 'conventional') {
        await context.tracing.stop({ path: join(output, name + '-' + width + '-trace.zip') });
      }
      await context.close();
    }
  }

  const redundant = Object.keys(key).find(id => key[id] === 'redundant');
  for (const width of [1440, 390]) {
    const { context, page } = await openCase(redundant, width);
    const firstLoadTop = () => page.locator('[data-load="0"]').evaluate(el => el.offsetTop);
    const before = await firstLoadTop();
    await page.addStyleTag({ content: '.extra{visibility:hidden}' });
    assert.equal(await firstLoadTop(), before, 'Visibility alone preserves the footprint');
    await shot(page, 'redundant-' + width + '-hidden-only');
    await page.locator('.extra').evaluateAll(nodes => nodes.forEach(node => node.remove()));
    const recomposed = await firstLoadTop();
    assert.ok(recomposed < before, 'Subtraction should release the space');
    await shot(page, 'redundant-' + width + '-recomposed');
    observations.push({ name: 'copy subtraction', width, before, recomposed });
    await context.close();
  }

  const baseline = Object.keys(key).find(id => key[id] === 'conventional');
  for (const width of [1440, 768, 390, 320]) {
    for (const options of [{}, { reduced: true }, { scaled: true }]) {
      const { context, page, errors } = await openCase(baseline, width, options);
      await noHorizontalOverflow(page);
      await page.keyboard.press('Tab');
      const north = page.locator('[data-load="0"]');
      assert.equal(await north.evaluate(el => el.matches(':focus-visible')), true);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#detail').evaluate(el => el === document.activeElement), true);
      await noHorizontalOverflow(page);
      assert.match(await page.locator('#detail-state').innerText(), /2 shelf slots free/);
      assert.match(await page.locator('#fit').innerText(), /hand-painted fern handles/);
      await page.keyboard.press('Tab');
      const reserve = page.locator('#reserve');
      assert.equal(await reserve.evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
      if (option === '--expect-pending-focus') {
        assert.equal(await reserve.getAttribute('aria-disabled'), 'true');
        assert.equal(await reserve.evaluate(el => el === document.activeElement), true);
      }
      await page.keyboard.press('Enter');
      await page.locator('#cancel').waitFor();
      assert.match(await page.locator('#north-count').innerText(), /^1 shelf slot free$/);
      await page.reload();
      await north.click();
      await page.locator('#cancel').waitFor();
      assert.match(await page.locator('#pieces').innerText(), /hand-painted fern handles/);
      await page.locator('#cancel').press('Enter');
      assert.match(await page.locator('#north-count').innerText(), /^2 shelf slots free$/);
      assert.equal(await page.locator('#reserve').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await north.evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      assert.match(await page.locator('#fit').innerText(), /incompatible/);
      assert.equal(await page.locator('#reserve').isVisible(), false);
      await noHorizontalOverflow(page);
      assert.deepEqual(errors, []);
      observations.push({ name: 'conventional regression', width, ...options, errors });
      await context.close();
    }
  }
  await writeFile(join(output, 'observations.json'), JSON.stringify(observations, null, 2) + '\n');
  console.log('Verified 16 controlled renders and 12 keyboard/persistence/resizing runs.');
} finally {
  await browser.close();
  server.close();
}
