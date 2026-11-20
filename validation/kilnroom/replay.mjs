import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const options = process.argv.slice(2);
const variants = options.includes('--before-only') ? ['before'] : ['before', 'after'];
const capture = options.includes('--capture');
const browser = await chromium.launch({ executablePath: process.env.UI_SLOP_CHROMIUM_PATH });
const profiles = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'compact', viewport: { width: 1024, height: 800 } },
  { name: 'mobile', ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
  { name: 'narrow', ...devices['Pixel 7'], viewport: { width: 320, height: 760 }, reducedMotion: 'reduce' }
];

try {
  for (const variant of variants) {
    for (const { name, ...settings } of profiles) {
      const context = await browser.newContext(settings);
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
          if (message.type() === 'error') errors.push(message.text());
        });
        const entry = new URL(`${variant}/index.html`, import.meta.url);
        const screenshot = async scene => {
          if (!capture || !['desktop', 'mobile'].includes(name)) return;
          const file = new URL(`screenshots/${variant}-${name}-${scene}.png`, import.meta.url);
          await page.screenshot({ path: fileURLToPath(file), animations: 'disabled', scale: 'css' });
        };
        const activate = element => settings.hasTouch ? element.tap() : element.click();
        const loadTile = id => page.locator(`.load-tile[data-load="${id}"]:visible`).first();
        const dialog = page.getByRole('dialog');
        await page.goto(entry.href);
        await screenshot('schedule');
        const tile = variant === 'after' && settings.hasTouch
          ? page.locator('.agenda-day').filter({ hasText: 'Sunday, Nov 22' }).locator('[data-load="F-048"]')
          : loadTile('F-048');
        await activate(tile);
        assert.match(await dialog.textContent(), /16\/24 capacity units/);
        assert.match(await dialog.textContent(), /Needs 10 units; only 8 open/);
        await screenshot('detail');
        const add = dialog.getByRole('button', { name: 'Add Carved breakfast bowls' });
        if (variant === 'after' && settings.hasTouch) assert.ok((await add.boundingBox()).height >= 44);
        if (settings.hasTouch) await add.tap();
        else {
          await add.focus();
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          assert.equal(await add.evaluate(button => button === document.activeElement), true);
          assert.equal(await add.evaluate(button => getComputedStyle(button).outlineStyle), 'solid');
          await page.keyboard.down('Enter');
          await page.keyboard.down('Enter');
          await page.keyboard.up('Enter');
        }
        assert.match(await dialog.textContent(), /20\/24 capacity units/);
        const feedback = dialog.locator('#load-feedback');
        assert.match(await feedback.textContent(), /added to Juniper/);
        assert.equal(await feedback.evaluate(element => element === document.activeElement), true);
        if (variant === 'after') {
          assert.equal(await feedback.evaluate(element => element.closest('.dialog-foot') !== null), true);
        }
        await screenshot('allocated');
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement?.dataset.load === 'F-048');
        assert.equal(await tile.evaluate(button => button === document.activeElement), true);
        for (const projection of await page.locator('.load-tile[data-load="F-048"]:visible').all()) {
          assert.match(await projection.textContent(), /20\/24/);
        }
        const nav = page.getByRole('navigation', { name: 'Workspace' });
        const queue = nav.locator('[data-view="queue"]');
        await activate(queue);
        await page.waitForURL(url => url.hash === '#queue');
        assert.equal(await page.getByRole('button', { name: /Carved breakfast bowls/ }).count(), 0);
        await page.reload();
        assert.equal(await page.getByRole('button', { name: /Carved breakfast bowls/ }).count(), 0);
        await activate(nav.locator('[data-view="schedule"]'));
        await page.waitForURL(url => url.hash === '#schedule');
        await activate(tile);
        assert.match(await dialog.textContent(), /20\/24 capacity units/);
        await activate(dialog.getByRole('button', { name: 'Return to queue' }));
        assert.match(await dialog.textContent(), /16\/24 capacity units/);
        assert.match(await feedback.textContent(), /returned to the queue/);
        await activate(dialog.getByRole('button', { name: 'Load kiln', exact: true }));
        assert.equal(await dialog.locator('[aria-current="step"]').textContent(), 'Loading');
        assert.match(await feedback.textContent(), /updated to loading/);
        await activate(dialog.getByRole('button', { name: 'Start firing', exact: true }));
        assert.match(await feedback.textContent(), /scheduled for Nov 21/);
        assert.equal(await dialog.locator('[aria-current="step"]').textContent(), 'Loading');
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement?.dataset.load === 'F-048');
        assert.match(await tile.textContent(), /Loading/);
        await page.reload();
        assert.match(await tile.textContent(), /Loading/);
        if (variant === 'after' && settings.hasTouch) {
          assert.match(await loadTile('F-048').textContent(), /Loading/);
        }
        const pippin = loadTile('F-047');
        await activate(pippin);
        await activate(dialog.getByRole('button', { name: 'Mark cooling' }));
        assert.equal(await dialog.locator('[aria-current="step"]').textContent(), 'Cooling');
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        assert.match(await pippin.textContent(), /Cooling/);
        const live = page.locator('.live-row[data-load="F-047"]');
        assert.match(await live.textContent(), /Cooling/);
        await activate(live);
        assert.equal(await dialog.locator('[aria-current="step"]').textContent(), 'Cooling');
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await activate(page.locator('[data-action="role"]'));
        await page.waitForURL(url => url.hash === '#work');
        const piece = page.locator('[data-piece="W-089"]:visible');
        assert.match(await piece.textContent(), /Cooling/);
        await activate(piece);
        assert.equal(await dialog.locator('[aria-current="step"]').textContent(), 'Cooling');
        await activate(dialog.getByRole('button', { name: 'View load' }));
        assert.equal(await dialog.locator('[aria-current="step"]').textContent(), 'Cooling');
        await activate(dialog.getByRole('button', { name: 'Back to submission' }));
        assert.equal(await dialog.locator('[data-from-piece]').evaluate(button => button === document.activeElement), true);
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement?.dataset.piece === 'W-089');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.deepEqual(errors, []);
        console.log(`${variant} ${name}: allocation, repeated activation, reversal, state/guards, reload, role, nested return, focus, layout and runtime passed`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
