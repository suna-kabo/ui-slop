import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const [historyArg, outputArg] = process.argv.slice(2);
if (!historyArg || !outputArg) throw new Error('Usage: node historical.mjs <extracted-history> <output>');
const history = resolve(historyArg);
const output = resolve(outputArg);
await mkdir(output, { recursive: true });

const selector = {
  blind: { heading: 'h1', subhead: '.section-head h2', status: '.load-tile:visible .tile-state',
    capacity: '.load-tile:visible .tile-capacity', pill: '.live-row .badge' },
  test: { heading: 'h1', subhead: '.section-head h2', status: '.row .badge',
    capacity: '.row .capacity', pill: '.live' },
};

async function inspect(page, selectors) {
  return page.evaluate((fields) => ({
    route: location.hash,
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    mode: document.body.dataset.role ?? null,
    metrics: Object.fromEntries(Object.entries(fields).map(([name, query]) => [name,
      [...document.querySelectorAll(query.replace(':visible', ''))].filter((el) =>
        el.getClientRects().length && (!query.includes(':visible') || el.offsetWidth > 0)).slice(0, 5).map((el) => {
        const style = getComputedStyle(el);
        return { text: el.innerText.trim(), size: style.fontSize, family: style.fontFamily,
          weight: style.fontWeight, color: style.color, background: style.backgroundColor };
      })])),
  }), selectors);
}

async function frames(page, control, selectors) {
  await page.evaluate(({ trigger, result, capacity }) => {
    window.replayFrames = [];
    document.addEventListener('pointerdown', (event) => {
      if (!event.target.closest(trigger)) return;
      const start = performance.now();
      function sample(now) {
        window.replayFrames.push({ elapsedMs: Math.max(0, now - start),
          message: document.querySelector(result)?.textContent.trim(),
          capacity: document.querySelector(capacity)?.textContent.trim(),
          focus: document.activeElement.id || document.activeElement.outerHTML.slice(0, 160) });
        if (now - start < 240) requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    }, { once: true, capture: true });
  }, selectors);
  await control.click();
  await page.waitForFunction(() => window.replayFrames.at(-1)?.elapsedMs >= 240);
  return page.evaluate(() => window.replayFrames);
}

async function blindWorkflow(page, mobile, capture) {
  const dialog = page.getByRole('dialog');
  const board = page.locator(mobile ? '.agenda' : '.grid-board');
  const load = (id) => board.locator(`[data-load="${id}"]`).last();
  const juniper = load('F-048');
  await juniper.focus();
  await page.keyboard.press('Enter');
  const original = await dialog.innerText();
  assert.match(original, /16\/24 capacity units/);
  assert.match(original, /Studio rack\s+16 units/);
  assert.match(original, /Needs 10 units; only 8 open/);
  const frameTrace = await frames(page, dialog.locator('[data-add="W-085"]'), {
    trigger: '[data-add="W-085"]', result: '#load-feedback', capacity: '.load-summary',
  });
  assert.match(await dialog.innerText(), /20\/24 capacity units/);
  await capture('assigned');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.activeElement.dataset.load === 'F-048');
  await page.reload();
  await juniper.click();
  assert.match(await dialog.innerText(), /20\/24 capacity units/);
  await dialog.getByRole('button', { name: 'Return to queue' }).click();
  assert.match(await dialog.innerText(), /16\/24 capacity units/);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.activeElement.dataset.load === 'F-048');
  await load('F-047').click();
  await capture('second-load');
  await page.keyboard.press('Escape');
  await page.locator('[data-week="1"]').click();
  const weekBeforeReload = await page.locator('.calendar-tools h2').innerText();
  await page.reload();
  const weekAfterReload = await page.locator('.calendar-tools h2').innerText();
  await page.locator('[data-action="role"]').click();
  await page.waitForURL(/#work$/);
  const memberPiece = page.locator('main [data-piece="W-089"]');
  await memberPiece.click();
  await dialog.getByRole('button', { name: 'View load' }).click();
  const memberCapacity = await dialog.innerText();
  assert.match(memberCapacity, /34\/36 capacity units/);
  assert.doesNotMatch(memberCapacity, /Studio rack/);
  await capture('member-load');
  await dialog.getByRole('button', { name: 'Back to submission' }).click();
  assert.equal(await page.locator(':focus').textContent(), 'View load');
  await page.keyboard.press('Escape');
  await page.locator('main [data-action="submit"]').click();
  const form = dialog.locator('form');
  await form.locator('[name="name"]').fill('Replay witness cup');
  await form.locator('button[type="submit"]').click();
  assert.match(await form.innerText(), /Choose the clay body/);
  await form.locator('[name="clay"]').selectOption('White stoneware');
  await form.locator('[name="stage"]').selectOption('Bone dry');
  await form.locator('button[type="submit"]').click();
  assert.match(await dialog.innerText(), /Added to the firing queue/);
  await page.keyboard.press('Escape');
  await page.reload();
  await page.locator('main [data-piece]').filter({ hasText: 'Replay witness cup' }).click();
  const queuedMemberActions = await dialog.getByRole('button').allTextContents();
  assert.match(queuedMemberActions.join(' '), /Edit submission/);
  assert.doesNotMatch(queuedMemberActions.join(' '), /Withdraw|Delete|Remove/);
  await capture('member-queued');
  await page.keyboard.press('Escape');
  await page.locator('[data-view="schedule"]').click();
  await page.waitForURL(/#schedule$/);
  const agenda = mobile ? await page.locator('.agenda').innerText() : null;
  await page.goBack();
  await page.waitForURL(/#work$/);
  const back = await page.locator(':focus').evaluate((el) => el.id);
  return { original, frameTrace, memberCapacity, queuedMemberActions, weekBeforeReload,
    weekAfterReload, back, agenda };
}

async function testWorkflow(page, capture) {
  const dialog = page.getByRole('dialog');
  const memberAgenda = await page.locator('main').innerText();
  await page.locator('nav [href="#staff"]').click();
  await page.waitForURL('**/#staff');
  await capture('staff');
  await page.locator('[data-manage="F-116"]').click();
  const initialManifest = await dialog.innerText();
  assert.match(initialManifest, /Oxide test cups/);
  await capture('manifest');
  const control = dialog.getByRole('button', { name: 'Add Wave-rim serving platter to load' });
  const frameTrace = await frames(page, control, { trigger: '[data-add-piece="P-226"]',
    result: '[data-message]', capacity: '.piece-top' });
  assert.match(await dialog.innerText(), /Wave-rim serving platter added/);
  await capture('assigned');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.activeElement.dataset.manage === 'F-116');
  await page.reload();
  await page.locator('[data-manage="F-116"]').click();
  await dialog.getByRole('button', { name: 'Return Wave-rim serving platter to queue' }).click();
  assert.match(await dialog.innerText(), /returned to the queue/);
  await page.keyboard.press('Escape');
  await page.locator('[data-manage="F-115"]').click();
  await capture('second-load');
  await page.keyboard.press('Escape');
  await page.locator('nav [href="#schedule"]').click();
  await page.waitForURL('**/#schedule');
  const ocean = page.locator('main [data-load="F-115"]').first();
  await ocean.click();
  const memberLoad = await dialog.innerText();
  await capture('member-load');
  await page.keyboard.press('Escape');
  await page.locator('[data-week="1"]').click();
  const weekBeforeReload = await page.locator('.range').first().innerText();
  await page.reload();
  const weekAfterReload = await page.locator('.range').first().innerText();
  await page.goBack();
  await page.waitForURL('**/#staff');
  const back = await page.locator(':focus').innerText();
  const staff = (id) => page.locator(`[data-manage="${id}"]`);
  async function advance(label) {
    await dialog.getByRole('button', { name: label, exact: true }).click();
    await dialog.getByRole('button', { name: label, exact: true }).click();
  }
  await staff('F-116').click();
  await advance('Begin loading');
  await dialog.getByRole('button', { name: 'Start firing', exact: true }).click();
  const overlap = await dialog.locator('[data-message]').innerText();
  assert.match(overlap, /already has an active load/);
  await page.keyboard.press('Escape');
  await staff('F-114').click();
  await advance('Mark cooling');
  await advance('Release for pickup');
  await page.keyboard.press('Escape');
  await staff('F-116').click();
  await advance('Start firing');
  await page.keyboard.press('Escape');
  await page.locator('nav [href="#schedule"]').click();
  const futureActive = await page.locator('.hero').innerText();
  assert.match(futureActive, /Firing now/);
  assert.match(futureActive, /Nov 24/);
  await capture('future-firing-now');
  await page.locator('main [data-submit]').click();
  await dialog.locator('[name="name"]').fill('Replay witness cup');
  await dialog.locator('button[type="submit"]').click();
  await dialog.getByRole('button', { name: 'View piece' }).click();
  await dialog.getByRole('button', { name: 'Withdraw', exact: true }).click();
  await dialog.getByRole('button', { name: 'Keep submission' }).click();
  assert.match(await dialog.innerText(), /Replay witness cup/);
  await dialog.getByRole('button', { name: 'Withdraw', exact: true }).click();
  await dialog.getByRole('button', { name: 'Withdraw piece' }).click();
  await capture('member-withdrawn');
  await page.keyboard.press('Escape');
  await page.locator('nav [href="#pieces"]').click();
  await page.reload();
  assert.doesNotMatch(await page.locator('main').innerText(), /Replay witness cup/);
  return { memberAgenda, initialManifest, frameTrace, memberLoad, weekBeforeReload, weekAfterReload,
    back, overlap, futureActive, withdrawalPersists: true };
}

const server = spawn(process.execPath, ['server.mjs'], {
  cwd: join(history, 'v3-test'), stdio: ['ignore', 'pipe', 'inherit'],
});
let browser;
try {
  const [announced] = await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(([code]) => { throw new Error(`Original HTTP entry point exited ${code}`); }),
  ]);
  const testUrl = announced.toString().match(/http:\/\/127\.0\.0\.1:\d+/)[0];
  browser = await chromium.launch(process.env.UI_SLOP_CHROMIUM_PATH
    ? { executablePath: process.env.UI_SLOP_CHROMIUM_PATH } : {});
  const results = { chromium: browser.version(), cases: [] };
  const variants = [
    [1440, 950, 'no-preference', false], [768, 900, 'no-preference', false],
    [390, 844, 'no-preference', false], [320, 800, 'no-preference', false],
    [390, 844, 'reduce', false], [390, 844, 'no-preference', true],
  ];
  for (const [variant, url, workflow] of [
    ['blind', pathToFileURL(join(history, 'v3-blind-2', 'index.html')).href, blindWorkflow],
    ['test', testUrl, testWorkflow],
  ]) {
    for (const [width, height, reducedMotion, zoom] of variants) {
      const mobile = width < 768;
      const name = `${variant}-${width}-${zoom ? 'zoom' : reducedMotion === 'reduce' ? 'reduce' : 'normal'}`;
      const dir = join(output, name);
      await mkdir(dir, { recursive: true });
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion, hasTouch: mobile });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.setDefaultTimeout(4500);
      const capture = (label) => page.screenshot({ path: join(dir, `${label}.png`) });
      const result = { name, errors };
      await context.tracing.start({ screenshots: true, snapshots: true });
      try {
        await page.goto(url);
        await page.locator('h1').waitFor();
        if (zoom) await page.addStyleTag({ content: 'html { zoom: 2; }' });
        result.opening = await inspect(page, selector[variant]);
        await capture('opening');
        if (!zoom && [390, 1440].includes(width)) {
          result.workflow = variant === 'blind' ? await workflow(page, mobile, capture) : await workflow(page, capture);
        }
      } catch (error) {
        result.interrupted = error.message;
        await capture('interrupted');
      } finally {
        results.cases.push(result);
        await context.tracing.stop({ path: join(dir, 'trace.zip') });
        await context.close();
      }
    }
  }
  const match = await browser.newPage({ viewport: { width: 1919, height: 906 } });
  await match.goto(pathToFileURL(join(history, 'v3-blind-2', 'index.html')).href);
  await match.locator('[data-action="role"]').click();
  await match.waitForURL(/#work$/);
  await match.locator('[data-view="schedule"]').click();
  await match.waitForURL(/#schedule$/);
  await match.locator('.grid-board:visible').waitFor();
  await match.getByRole('heading', { name: 'Firing schedule', exact: true }).waitFor();
  await match.screenshot({ path: join(output, 'annotation-match.png') });
  results.annotationComparison = await inspect(match, selector.blind);
  await writeFile(join(output, 'observations.json'), JSON.stringify(results, null, 2));
  console.log(results.cases.map(({ name, interrupted }) => `${name}: ${interrupted ?? 'captured'}`).join('\n'));
  if (results.cases.some((result) => result.interrupted || result.errors.length)) process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}
