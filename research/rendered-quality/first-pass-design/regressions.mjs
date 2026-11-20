import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const [packetArg, outputArg] = process.argv.slice(2);
if (!packetArg || !outputArg) throw Error('Usage: node regressions.mjs <Round 2 review-packet> <output>');
const packet = resolve(packetArg);
const output = resolve(outputArg);
const archived = 'd58f873e729a540b6254b459fdd10281685af668';
const archivePath = 'research/rendered-quality/repeatability-round-2';
const round2 = JSON.parse(execFileSync('git', ['show', `${archived}:${archivePath}/runnable-output-hashes.json`]));
const variants = join(output, 'fixtures');
await mkdir(variants, { recursive: true });

async function cloneVariant(phase, id, name) {
  const prefix = `${phase}/${id}/`;
  const hashes = Object.entries(round2).filter(([file]) => file.startsWith(prefix));
  assert(hashes.length > 0);
  for (const [name, hash] of hashes) {
    const bytes = await readFile(join(packet, name));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, name);
  }
  await cp(join(packet, phase, id), join(variants, name), { recursive: true });
}

async function change(file, original, replacement) {
  const source = await readFile(file, 'utf8');
  assert.equal(source.split(original).length, 2, file);
  await writeFile(file, source.replace(original, replacement));
}

await cloneVariant('final', '86cf04199e', 'old-role');
await cp(join(variants, 'old-role'), join(variants, 'fixed-role'), { recursive: true });
await change(join(variants, 'fixed-role/desk.js'), '()=>$(role)?.focus({preventScroll:true})',
  "()=>{if(page?.load&&dialog.open)paintDetail('dialogTitle');else $(role)?.focus({preventScroll:true})}");
await cloneVariant('final', '0b0915fde5', 'old-enter');
await cp(join(variants, 'old-enter'), join(variants, 'fixed-enter'), { recursive: true });
await change(join(variants, 'fixed-enter/app.js'), "refresh(state.role==='lead'?'advance-load':'piece-select');",
  "refresh(state.role==='lead'?'detail-heading':'piece-select');");
await cloneVariant('initial', 'fc2950d5d4', 'copy');
await mkdir(join(variants, 'checkout'), { recursive: true });
await writeFile(join(variants, 'checkout/index.html'), execFileSync('git', [
  'show', `${archived}:${archivePath}/targeted/checkout.html`,
]));

const server = await serve(variants);
const browser = await chromium.launch();
const results = [];

async function run(name, width, fn) {
  const directory = join(output, `${name}-${width}`);
  await mkdir(directory, { recursive: true });
  const context = await browser.newContext({ viewport: { width, height: 900 },
    reducedMotion: width < 500 ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  page.setDefaultTimeout(3500);
  const runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push(error.message));
  await context.tracing.start({ screenshots: true, snapshots: true });
  const shot = async (name) => page.screenshot({ path: join(directory, `${name}.png`) });
  try {
    await page.goto(`${server.origin}/${name}/`);
    results.push({ name, width, ...await fn(page, shot), runtimeErrors });
    assert.deepEqual(runtimeErrors, []);
  } finally {
    await context.tracing.stop({ path: join(directory, 'trace.zip') });
    await context.close();
  }
}

async function switchRole(page, shot, repaired) {
  const load = page.locator('button[data-open="MC-14"]:visible').first();
  const dialog = page.getByRole('dialog');
  const advance = dialog.getByRole('button', { name: 'Start firing', exact: true });
  await load.press('Enter');
  await dialog.getByRole('button', { name: 'Queue Bisque tray', exact: true }).press('Enter');
  await dialog.getByRole('button', { name: 'Withdraw Bisque tray', exact: true }).waitFor();
  const memberText = await dialog.innerText();
  assert.match(memberText, /550\s*cm²/);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });

  // Force the real Web Lock ordering so results do not depend on host scheduling.
  await page.evaluate(() => new Promise(resolve => navigator.locks.request('mill-creek-firing-desk-v1', () => {
    return new Promise(release => { window.releaseRegressionLock = release; resolve(); });
  })));
  await page.getByRole('button', { name: 'Shift lead', exact: true }).click();
  await load.press('Enter');
  assert(await dialog.getByRole('button', { name: 'Withdraw Bisque tray', exact: true }).isVisible());
  await page.evaluate(() => window.releaseRegressionLock());
  await page.locator('button[data-role="lead"][aria-pressed="true"]').waitFor();
  const leadActionsAgree = await advance.isVisible();
  assert.equal(leadActionsAgree, repaired);
  assert.match(await dialog.innerText(), /550\s*cm²/);
  await shot('after-role-commit');
  if (!repaired) {
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await load.press('Enter');
    await advance.waitFor();
  }
  assert(await dialog.getByRole('button', { name: 'Remove Bisque tray' }).isVisible());
  await dialog.getByRole('button', { name: 'Remove Bisque tray' }).press('Enter');
  await page.waitForFunction(() => document.querySelector('dialog[open]')?.innerText.includes('1,350'));
  await page.reload();
  assert(await advance.isVisible());
  assert.match(await dialog.innerText(), /1,350\s*cm²/);
  await shot('recovered-and-reloaded');
  return { contract: leadActionsAgree ? 'PASS' : 'FAIL', leadActionsAgree, recovery: 'PASS' };
}

async function repeatedEnter(page, shot, repaired) {
  const load = page.locator('button:has-text("MC-14"):visible').first();
  await load.press('Enter');
  await page.locator('#submit-piece').press('Enter');
  await page.getByRole('button', { name: 'Shift lead', exact: true }).click();
  await page.getByRole('button', { name: 'Remove Bisque tray', exact: true }).press('Enter');
  const focused = await page.locator(':focus').getAttribute('id');
  assert.equal(focused, repaired ? 'detail-heading' : 'advance-load');
  await shot('after-remove');
  await page.keyboard.press('Enter');
  const status = await page.locator('.detail [aria-current="step"]').innerText();
  assert.equal(status, repaired ? 'Queued' : 'Firing');
  assert.match(await page.locator('.detail').innerText(), /1,350\s*cm²/);
  await shot('after-repeat');
  await page.goBack();
  await page.locator('.board:visible').waitFor().catch(() => load.waitFor());
  await load.press('Enter');
  assert.equal(await page.locator('.detail [aria-current="step"]').innerText(), status);
  await page.reload();
  // A reload may return to the schedule. Reopen the same selected record.
  if (!(await page.locator('.detail:visible').count())) await load.press('Enter');
  assert.equal(await page.locator('.detail [aria-current="step"]').innerText(), status);
  if (repaired) {
    await page.locator('#advance-load').press('Enter');
    assert.equal(await page.locator('.detail [aria-current="step"]').innerText(), 'Firing');
  }
  return { contract: repaired ? 'PASS' : 'FAIL', focused, afterRepeat: status, recovery: 'PASS' };
}

async function copyTrial(page, shot) {
  const selectors = ['.hero .kicker', '.hero-copy p', '.hero-art span', '#index-note'];
  const checkpoint = () => page.evaluate(() => ({
    firstResultTop: document.getElementById('collection-title').getBoundingClientRect().top,
    firstTitleTop: [...document.querySelectorAll('a,h3')].find(e => e.textContent.trim() === 'Breakwater Steps')
      ?.getBoundingClientRect().top,
  }));
  const original = await checkpoint();
  await shot('original');
  const hidden = await page.addStyleTag({ content: `${selectors.join(',')} { visibility: hidden; }` });
  const reserved = await checkpoint();
  assert.deepEqual(reserved, original);
  await shot('hidden-space-reserved');
  await hidden.evaluate(el => el.remove());
  await page.addStyleTag({ content: `${selectors.join(',')} { display: none; }` });
  const removed = await checkpoint();
  await shot('removed-with-original-geometry');
  await page.addStyleTag({ content: '.hero { min-height: 0; } .hero h1 { margin-block: 0; }' });
  const recomposed = await checkpoint();
  await shot('recomposed');
  assert(recomposed.firstTitleTop < original.firstTitleTop - 10, JSON.stringify({ original, recomposed }));
  const link = page.getByRole('link', { name: 'Breakwater Steps' }).first();
  await link.press('Enter');
  await page.getByRole('heading', { name: 'Breakwater Steps', exact: true }).waitFor();
  assert.match(await page.locator('main').innerText(), /slack tide|Pier Road/);
  await page.goBack();
  await link.waitFor();
  return { original, reserved, removed, recomposed, browseDetailReturn: 'PASS' };
}

async function checkout(page, shot) {
  const button = name => page.getByRole('button', { name, exact: true });
  const cases = [];
  for (const number of ['62', '75']) {
    await page.goto(`${server.origin}/checkout/?case=${number}`);
    await button('Issue kit now').press('Enter');
    assert.match(await page.locator('#content').innerText(), /Reserved pickup\s+12:00\s+Actual issue\s+10:20/);
    await button('Equipment inventory').click();
    const afterIssue = await page.locator('#availability').innerText();
    assert.equal(afterIssue, number === '62' ? 'Available at desk' : 'Unavailable · issued');
    await shot(`issue-${number}`);
    await page.reload();
    assert.equal(await page.locator('#availability').innerText(), afterIssue);
    await button('Pickup desk').click();
    await button('Reverse issue').press('Enter');
    await button('Equipment inventory').click();
    assert.equal(await page.locator('#availability').innerText(), 'Available at desk');
    cases.push({ number, confirmation: 'PASS', synchronized: number === '62' ? 'FAIL' : 'PASS', reversal: 'PASS' });
  }
  return { cases };
}

try {
  for (const width of [1440, 390, 320]) {
    await run('old-role', width, (page, shot) => switchRole(page, shot, false));
    await run('fixed-role', width, (page, shot) => switchRole(page, shot, true));
    await run('old-enter', width, (page, shot) => repeatedEnter(page, shot, false));
    await run('fixed-enter', width, (page, shot) => repeatedEnter(page, shot, true));
    if (width !== 320) await run('copy', width, copyTrial);
    await run('checkout', width, checkout);
  }
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(`${results.length} controlled regression replays completed`);
} finally {
  await browser.close();
  server.close();
}
