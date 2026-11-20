import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

const [target] = process.argv.slice(2);
if (!target) throw new Error('Usage: node replay.mjs <evidence-directory>');
const output = resolve(target);
await mkdir(output, { recursive: true });
const browser = await chromium.launch(process.env.UI_SLOP_CHROMIUM_PATH
  ? { executablePath: process.env.UI_SLOP_CHROMIUM_PATH } : {});
const results = [];
try {
  for (const width of [1440, 390, 320]) {
    for (const number of ['62', '75']) {
      const directory = join(output, `${number}-${width}`);
      await mkdir(directory, { recursive: true });
      const context = await browser.newContext({ viewport: { width, height: 850 },
        reducedMotion: width === 320 ? 'reduce' : 'no-preference' });
      await context.tracing.start({ screenshots: true, snapshots: true });
      try {
        const page = await context.newPage();
        await page.goto(new URL(`checkout.html?case=${number}`, import.meta.url).href);
        const control = (name) => page.getByRole('button', { name, exact: true });
        await control('Issue kit now').focus();
        await page.keyboard.press('Enter');
        assert.match(await page.locator('#feedback').innerText(), /issued at 10:20/);
        assert.equal(await page.locator(':focus').getAttribute('id'), 'feedback');
        assert.match(await page.locator('#content').innerText(), /Reserved pickup\s+12:00\s+Actual issue\s+10:20/);
        await page.screenshot({ path: join(directory, 'primary-confirmation.png') });

        await control('Equipment inventory').click();
        const afterIssue = await page.locator('#availability').innerText();
        await page.screenshot({ path: join(directory, 'other-view.png') });
        await page.reload();
        assert.equal(await page.locator('#availability').innerText(), afterIssue);
        await control('Pickup desk').click();
        assert.match(await page.locator('#content').innerText(), /Actual issue\s+10:20/);
        await control('Reverse issue').click();
        assert.match(await page.locator('#feedback').innerText(), /Issue reversed/);
        await control('Equipment inventory').click();
        assert.equal(await page.locator('#availability').innerText(), 'Available at desk');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const afterOperationGate = afterIssue === 'Unavailable · issued' ? 'PASS' : 'FAIL';
        assert.equal(afterOperationGate, number === '62' ? 'FAIL' : 'PASS');
        results.push({ number, width, confirmationOnly: 'PASS', crossView: afterOperationGate, afterIssue,
          reversal: 'PASS', reload: 'PASS' });
      } finally {
        await context.tracing.stop({ path: join(directory, 'trace.zip') });
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
