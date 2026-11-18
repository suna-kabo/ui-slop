#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

// ---- src/utils.mjs ----

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function readJson(p) {
  return JSON.parse(await fs.readFile(p, 'utf8'));
}

async function writeJson(p, value) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function sha256File(p) {
  const data = await fs.readFile(p);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function nowIso() {
  return new Date().toISOString();
}

function slug(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) { out._.push(arg); continue; }
    const eq = arg.indexOf('=');
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      out[key] = next;
      i += 1;
    } else {
      out[key] = true;
    }
  }
  return out;
}

function stableId(prefix, value) {
  const digest = crypto.createHash('sha1').update(String(value)).digest('hex').slice(0, 10);
  return `${prefix}-${digest}`;
}
// ---- src/context.mjs ----

const STACK_HINTS = [
  ['nextjs', ['next']], ['react', ['react']], ['vue', ['vue']], ['nuxt', ['nuxt']],
  ['svelte', ['svelte', '@sveltejs/kit']], ['astro', ['astro']], ['angular', ['@angular/core']],
  ['solid', ['solid-js']], ['qwik', ['@builder.io/qwik']], ['remix', ['@remix-run/react']]
];
const MOTION_HINTS = ['framer-motion', 'motion', 'gsap', '@react-spring/web', 'react-spring', '@motionone/dom'];
const TEST_HINTS = ['@playwright/test', 'playwright', 'vitest', 'jest', 'cypress', '@testing-library/react'];

async function walk(root, maxFiles = 4000) {
  const out = [];
  const ignored = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'coverage', '.ui-slop']);
  async function visit(dir) {
    if (out.length >= maxFiles) return;
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      if (out.length >= maxFiles) break;
      if (ignored.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(full);
      else out.push(full);
    }
  }
  await visit(root);
  return out;
}

function rel(root, p) { return path.relative(root, p).replaceAll('\\', '/'); }

function evidence(value, source, confidence = 'high') {
  return { value, observed_source: source, confidence };
}

async function inspectProject(rootInput = process.cwd()) {
  const root = path.resolve(rootInput);
  const pkgPath = path.join(root, 'package.json');
  let pkg = null;
  if (await exists(pkgPath)) {
    try { pkg = await readJson(pkgPath); } catch { pkg = null; }
  }
  const deps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  const depNames = Object.keys(deps);
  const stacks = STACK_HINTS
    .filter(([, names]) => names.some((name) => depNames.includes(name)))
    .map(([name]) => name);
  const motionLibraries = MOTION_HINTS.filter((name) => depNames.includes(name));
  const tests = TEST_HINTS.filter((name) => depNames.includes(name));

  const files = await walk(root);
  const routes = files
    .map((p) => rel(root, p))
    .filter((p) => /(^|\/)(app|pages|routes)\//.test(p) && /\.(tsx?|jsx?|vue|svelte|astro)$/.test(p))
    .slice(0, 200);
  const tokenFiles = files
    .map((p) => rel(root, p))
    .filter((p) => /(tokens?|theme|design-system).*(\.css|\.scss|\.json|\.ts|\.js)$/i.test(p))
    .slice(0, 100);
  const visualArtifacts = files
    .map((p) => rel(root, p))
    .filter((p) => /(screenshot|snapshot|golden|visual).*(\.png|\.jpe?g|\.webp|\.snap|\.yml|\.yaml)$/i.test(p))
    .slice(0, 100);
  const designDocs = ['PRODUCT.md', 'DESIGN.md', 'design-system.md', 'brand-guidelines.md']
    .filter((name) => files.some((p) => rel(root, p).toLowerCase().endsWith(name.toLowerCase())))
    .map((name) => files.map((p) => rel(root, p)).find((p) => p.toLowerCase().endsWith(name.toLowerCase())));
  const configs = files
    .map((p) => rel(root, p))
    .filter((p) => /(^|\/)(playwright|vite|next|nuxt|astro|svelte|tailwind|vitest|jest|cypress).*\.(config\.)?(js|mjs|cjs|ts|json)$/i.test(p))
    .slice(0, 100);

  return {
    schema_version: 1,
    root,
    framework_stack: evidence(stacks, pkg ? 'package.json' : null, pkg ? 'high' : 'low'),
    package_scripts: evidence(pkg?.scripts ?? {}, pkg ? 'package.json' : null, pkg ? 'high' : 'low'),
    motion_libraries: evidence(motionLibraries, pkg ? 'package.json' : null, pkg ? 'high' : 'low'),
    test_libraries: evidence(tests, pkg ? 'package.json' : null, pkg ? 'high' : 'low'),
    route_candidates: evidence(routes, 'filesystem heuristics', 'medium'),
    token_candidates: evidence(tokenFiles, 'filesystem heuristics', 'medium'),
    visual_artifacts: evidence(visualArtifacts, 'filesystem heuristics', 'medium'),
    design_context_docs: evidence(designDocs.filter(Boolean), 'filesystem heuristics', 'medium'),
    config_candidates: evidence(configs, 'filesystem heuristics', 'medium'),
    limitations: [
      'Dynamic routes and runtime-generated design state may not be discoverable statically.',
      'Detected files are evidence, not visual or product authority.',
      'No extracted token, font, library, or incumbent pattern is automatically a design requirement.'
    ]
  };
}
// ---- src/scenario.mjs ----

const ACTIONS = new Set([
  'click', 'hover', 'press', 'fill', 'wait', 'back', 'reload', 'snapshot',
  'assertVisible', 'assertText', 'assertUrl', 'assertStorage'
]);

async function loadScenario(file) {
  const scenario = await readJson(file);
  validateScenario(scenario);
  return scenario;
}

function validateScenario(s) {
  if (!s || typeof s !== 'object') throw new Error('Scenario must be an object.');
  if (!s.id || typeof s.id !== 'string') throw new Error('Scenario requires string id.');
  if (!Array.isArray(s.steps) || s.steps.length === 0) throw new Error('Scenario requires non-empty steps.');
  if (s.steps.length > 80) throw new Error('Scenario exceeds 80 steps. Split it into focused workflows.');
  for (const [index, step] of s.steps.entries()) {
    if (!step || typeof step !== 'object' || !ACTIONS.has(step.action)) {
      throw new Error(`Unsupported action at step ${index + 1}.`);
    }
    if (['click','hover','fill','assertVisible','assertText'].includes(step.action) && !step.locator) {
      throw new Error(`${step.action} at step ${index + 1} requires locator.`);
    }
    if (step.action === 'press' && typeof step.key !== 'string') throw new Error(`press at step ${index + 1} requires key.`);
    if (step.action === 'wait' && (!Number.isFinite(step.ms) || step.ms < 0 || step.ms > 5000)) throw new Error(`wait at step ${index + 1} must be 0..5000ms.`);
    if (step.action === 'assertStorage' && (!step.storage || !step.key)) throw new Error(`assertStorage at step ${index + 1} requires storage and key.`);
  }
  if (s.viewports && (!Array.isArray(s.viewports) || s.viewports.some((v) => !v.name || !v.width || !v.height))) {
    throw new Error('viewports must contain name, width, height.');
  }
  return true;
}

function defaultViewports() {
  return [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ];
}
// ---- src/locator.mjs ----
function resolveLocator(page, spec) {
  if (!spec || typeof spec !== 'object') throw new Error('Locator must be an object.');
  if (spec.testId) return page.getByTestId(spec.testId);
  if (spec.role) return page.getByRole(spec.role, spec.name ? { name: spec.name, exact: spec.exact ?? false } : undefined);
  if (spec.label) return page.getByLabel(spec.label, { exact: spec.exact ?? false });
  if (spec.placeholder) return page.getByPlaceholder(spec.placeholder, { exact: spec.exact ?? false });
  if (spec.text) return page.getByText(spec.text, { exact: spec.exact ?? false });
  if (spec.selector) return page.locator(spec.selector);
  throw new Error('Locator needs testId, role, label, placeholder, text, or selector.');
}
// ---- src/metrics.mjs ----
async function collectPageMetrics(page) {
  return page.evaluate(() => {
    const visible = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0;
    };
    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.replace(/\s+/g, ' ').trim();
      const parent = node.parentElement;
      if (!text || !parent || !visible(parent)) continue;
      const size = parseFloat(getComputedStyle(parent).fontSize) || 0;
      textNodes.push({ chars: text.length, size, text: text.slice(0, 120) });
    }
    const totalChars = textNodes.reduce((n, x) => n + x.chars, 0);
    const charsLe12 = textNodes.filter((x) => x.size <= 12).reduce((n, x) => n + x.chars, 0);
    const charsGe15 = textNodes.filter((x) => x.size >= 15).reduce((n, x) => n + x.chars, 0);
    const uppercaseMicro = textNodes.filter((x) => x.size <= 12 && /[A-Z]/.test(x.text) && x.text === x.text.toUpperCase() && x.text.length >= 3);

    const interactives = [...document.querySelectorAll('a[href],button,input,select,textarea,[role="button"],[role="link"],[role="tab"],[role="menuitem"],[tabindex]')]
      .filter((el) => visible(el))
      .map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute('role'),
          text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 100),
          width: Math.round(r.width * 10) / 10,
          height: Math.round(r.height * 10) / 10,
          x: Math.round(r.x * 10) / 10,
          y: Math.round(r.y * 10) / 10,
          outlineStyle: s.outlineStyle,
          outlineWidth: s.outlineWidth,
          boxShadow: s.boxShadow,
          cursor: s.cursor
        };
      });

    const animationInventory = [...document.getAnimations({ subtree: true })].map((a) => {
      const effect = a.effect;
      const target = effect?.target;
      const timing = effect?.getTiming?.() || {};
      return {
        playState: a.playState,
        currentTime: typeof a.currentTime === 'number' ? a.currentTime : null,
        target: target instanceof Element ? `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}${target.classList?.length ? `.${[...target.classList].slice(0,3).join('.')}` : ''}` : null,
        duration: typeof timing.duration === 'number' ? timing.duration : String(timing.duration ?? ''),
        iterations: timing.iterations ?? null,
        easing: timing.easing ?? null
      };
    });

    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight
      },
      typography: {
        visibleChars: totalChars,
        charsLe12,
        charsGe15,
        pctLe12: totalChars ? charsLe12 / totalChars : 0,
        pctGe15: totalChars ? charsGe15 / totalChars : 0,
        uppercaseMicroLabels: uppercaseMicro.length,
        samples: uppercaseMicro.slice(0, 20)
      },
      interactives,
      animationInventory
    };
  });
}

async function collectFocusState(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!(el instanceof HTMLElement)) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const name = el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || el.getAttribute('placeholder') || el.getAttribute('name') || '';
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      role: el.getAttribute('role'),
      name: String(name).trim().slice(0, 140),
      tabIndex: el.tabIndex,
      box: { x: r.x, y: r.y, width: r.width, height: r.height },
      outlineStyle: s.outlineStyle,
      outlineWidth: s.outlineWidth,
      outlineColor: s.outlineColor,
      boxShadow: s.boxShadow
    };
  });
}

async function collectAriaSnapshot(page) {
  if (typeof page.ariaSnapshotJSON === 'function') {
    return page.ariaSnapshotJSON({ mode: 'default', depth: 12, boxes: true });
  }
  return { unsupported: true, reason: 'page.ariaSnapshotJSON is unavailable in this Playwright version.' };
}

function flattenAria(tree, out = []) {
  if (Array.isArray(tree)) {
    for (const item of tree) flattenAria(item, out);
    return out;
  }
  if (!tree || typeof tree !== 'object') return out;
  out.push(tree);
  if (Array.isArray(tree.children)) for (const child of tree.children) flattenAria(child, out);
  return out;
}
// ---- src/checks.mjs ----

const INTERACTIVE_ROLES = new Set(['button','link','textbox','searchbox','checkbox','radio','combobox','slider','spinbutton','switch','menuitem','tab','treeitem']);

function evaluateEvidence({ metrics, aria, runtimeErrors = [], consoleErrors = [], scenarioFailures = [], allowHorizontalScroll = false }) {
  const findings = [];
  const add = (classification, category, id, observation, extra = {}) => findings.push({
    id, classification, category, observation, confidence: extra.confidence ?? 'high', ...extra
  });

  for (const failure of scenarioFailures) {
    add('hard_failure', 'contract', `scenario-${failure.step}`, failure.message, { reproduction: failure.reproduction, confidence: 'high' });
  }
  for (const err of runtimeErrors) add('hard_failure', 'runtime', 'page-error', String(err), { confidence: 'high' });
  for (const err of consoleErrors) add('advisory', 'runtime', 'console-error', String(err), { confidence: 'medium' });

  if (metrics?.document && !allowHorizontalScroll && metrics.document.scrollWidth > metrics.document.clientWidth + 1) {
    add('hard_failure', 'responsive', 'root-horizontal-overflow', `Document scrollWidth ${metrics.document.scrollWidth}px exceeds clientWidth ${metrics.document.clientWidth}px.`, { confidence: 'high' });
  }

  if (aria && !aria.unsupported) {
    const unnamed = flattenAria(aria).filter((node) => INTERACTIVE_ROLES.has(node.role) && !String(node.name ?? '').trim());
    for (const node of unnamed.slice(0, 50)) {
      add('hard_failure', 'accessibility', 'unnamed-interactive', `Interactive role ${node.role} has no accessible name.`, { evidence: node, confidence: 'high' });
    }
  } else {
    add('evidence_only', 'coverage', 'aria-snapshot-unavailable', aria?.reason ?? 'ARIA snapshot unavailable.', { confidence: 'high' });
  }

  if (metrics?.typography) {
    add('evidence_only', 'typography', 'text-size-distribution', 'Visible text size distribution collected.', { evidence: metrics.typography, confidence: 'high' });
    if (metrics.typography.pctLe12 >= 0.6) {
      add('advisory', 'typography', 'microtype-heavy', `${Math.round(metrics.typography.pctLe12 * 100)}% of visible text characters render at 12px or smaller. Review whether density is being purchased through legibility loss.`, { evidence: metrics.typography, confidence: 'medium' });
    }
    if (metrics.typography.uppercaseMicroLabels >= 8) {
      add('advisory', 'copy', 'uppercase-micro-label-recurrence', `${metrics.typography.uppercaseMicroLabels} visible small uppercase text nodes were observed. Review whether they represent real semantic roles or layout-explanation labels.`, { evidence: metrics.typography.samples, confidence: 'medium' });
    }
  }

  if (metrics?.interactives) {
    const small = metrics.interactives.filter((x) => x.width > 0 && x.height > 0 && (x.width < 24 || x.height < 24));
    add('evidence_only', 'interaction', 'interactive-geometry', 'Interactive geometry inventory collected.', { evidence: { count: metrics.interactives.length, smallTargets: small.slice(0,50) }, confidence: 'high' });
    if (small.length) {
      add('advisory', 'interaction', 'small-targets', `${small.length} visible interactive elements are smaller than 24px in at least one dimension. Review applicable WCAG target-size exceptions and the actual interaction context before treating this as a failure.`, { evidence: small.slice(0,20), confidence: 'medium' });
    }
  }

  if (metrics?.animationInventory) {
    add('evidence_only', 'motion', 'animation-inventory', 'Animation inventory collected without aesthetic verdict.', { evidence: metrics.animationInventory, confidence: 'high' });
  }

  return findings;
}

function summarizeFindings(findings) {
  const counts = { hard_failure: 0, advisory: 0, evidence_only: 0, blocked: 0 };
  for (const f of findings) counts[f.classification] = (counts[f.classification] ?? 0) + 1;
  return counts;
}
// ---- src/review.mjs ----
function buildReviewPacket({ manifest, findings, scenario }) {
  return {
    schema_version: 1,
    review_mode: 'evidence-first',
    isolation_contract: [
      'Review the original brief/contract and evidence before reading any generator self-assessment.',
      'Do not turn advisory measurements into objective failures without product-specific reasoning.',
      'Use PASS, FAIL, BLOCKED, or ADVISORY per requirement.',
      'Cite evidence ids or trace steps for every material finding.',
      'Unknown or unexecuted checks are BLOCKED, never silently PASS.'
    ],
    scenario: { id: scenario.id, description: scenario.description ?? null },
    run: manifest,
    findings
  };
}
// ---- src/validate.mjs ----

async function validateBundle(runDir) {
  const required = ['manifest.json', 'findings.json', 'review-packet.json', 'checksums.json'];
  const missing = [];
  for (const f of required) if (!(await exists(path.join(runDir, f)))) missing.push(f);
  if (missing.length) return { ok: false, errors: [`Missing required files: ${missing.join(', ')}`] };
  const manifest = await readJson(path.join(runDir, 'manifest.json'));
  const checksums = await readJson(path.join(runDir, 'checksums.json'));
  const errors = [];
  if (manifest.schema_version !== 1) errors.push(`Unsupported manifest schema_version ${manifest.schema_version}.`);
  if (!manifest.scenario_id || !Array.isArray(manifest.runs)) errors.push('Manifest lacks scenario_id or runs.');
  for (const [rel, expected] of Object.entries(checksums)) {
    const file = path.join(runDir, rel);
    if (!(await exists(file))) { errors.push(`Checksum target missing: ${rel}`); continue; }
    const actual = await sha256File(file);
    if (actual !== expected) errors.push(`Checksum mismatch: ${rel}`);
  }
  return { ok: errors.length === 0, errors, manifest };
}
// ---- src/evidence.mjs ----

async function loadChromium() {
  try { return (await import('playwright')).chromium; }
  catch (first) {
    try { return (await import('playwright-core')).chromium; }
    catch { throw new Error(`Playwright is required for browser evidence capture. Install dependencies with npm install. Original error: ${first.message}`); }
  }
}

async function launchBrowser(headed = false) {
  const chromium = await loadChromium();
  const executablePath = process.env.UI_SLOP_CHROMIUM_PATH || undefined;
  return chromium.launch({ headless: !headed, executablePath });
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function checkpoint(page, outDir, label, redact = []) {
  const safe = slug(label);
  const img = path.join(outDir, 'captures', `${safe}.png`);
  const ariaFile = path.join(outDir, 'aria', `${safe}.json`);
  await ensureDir(path.dirname(img));
  await ensureDir(path.dirname(ariaFile));
  const masks = redact.map((spec) => resolveLocator(page, spec));
  await page.screenshot({ path: img, fullPage: false, mask: masks });
  const aria = await collectAriaSnapshot(page);
  await writeJson(ariaFile, aria);
  return { screenshot: path.relative(outDir, img).replaceAll('\\','/'), aria: path.relative(outDir, ariaFile).replaceAll('\\','/'), ariaData: aria };
}

async function executeStep(page, step, stepIndex, outDir, redact) {
  const base = { step: stepIndex + 1, action: step.action, started_at: nowIso(), status: 'pass' };
  try {
    if (step.action === 'click') await resolveLocator(page, step.locator).click();
    else if (step.action === 'hover') await resolveLocator(page, step.locator).hover();
    else if (step.action === 'press') await page.keyboard.press(step.key);
    else if (step.action === 'fill') await resolveLocator(page, step.locator).fill(step.value ?? '');
    else if (step.action === 'wait') await page.waitForTimeout(step.ms);
    else if (step.action === 'back') await page.goBack({ waitUntil: 'domcontentloaded' });
    else if (step.action === 'reload') await page.reload({ waitUntil: 'domcontentloaded' });
    else if (step.action === 'assertVisible') {
      const visible = await resolveLocator(page, step.locator).isVisible();
      if (!visible) throw new Error('Expected locator to be visible.');
    }
    else if (step.action === 'assertText') {
      const text = await resolveLocator(page, step.locator).innerText();
      if (step.equals !== undefined && text !== step.equals) throw new Error(`Expected text exactly ${JSON.stringify(step.equals)}, got ${JSON.stringify(text)}.`);
      if (step.contains !== undefined && !text.includes(step.contains)) throw new Error(`Expected text containing ${JSON.stringify(step.contains)}, got ${JSON.stringify(text)}.`);
    }
    else if (step.action === 'assertUrl') {
      const url = page.url();
      if (step.equals !== undefined && url !== step.equals) throw new Error(`Expected URL ${step.equals}, got ${url}.`);
      if (step.contains !== undefined && !url.includes(step.contains)) throw new Error(`Expected URL containing ${step.contains}, got ${url}.`);
    }
    else if (step.action === 'assertStorage') {
      const value = await page.evaluate(({ storage, key }) => window[storage]?.getItem(key), { storage: step.storage, key: step.key });
      if (step.equals !== undefined && value !== step.equals) throw new Error(`Expected ${step.storage}.${step.key}=${JSON.stringify(step.equals)}, got ${JSON.stringify(value)}.`);
      if (step.exists === true && value == null) throw new Error(`Expected ${step.storage}.${step.key} to exist.`);
    }
    else if (step.action === 'snapshot') {
      const cp = await checkpoint(page, outDir, step.label ?? `step-${stepIndex + 1}`, redact);
      base.evidence = { screenshot: cp.screenshot, aria: cp.aria };
    }

    if (step.capture === true && step.action !== 'snapshot') {
      const cp = await checkpoint(page, outDir, step.label ?? `step-${stepIndex + 1}`, redact);
      base.evidence = { screenshot: cp.screenshot, aria: cp.aria };
    }
    base.url = page.url();
    base.focus = await collectFocusState(page);
    base.finished_at = nowIso();
    return base;
  } catch (error) {
    base.status = 'fail';
    base.message = error instanceof Error ? error.message : String(error);
    base.url = page.url();
    base.focus = await collectFocusState(page).catch(() => null);
    base.finished_at = nowIso();
    return base;
  }
}

async function keyboardWalk(page, config = {}) {
  const maxStops = Math.min(Number(config.maxStops ?? 30), 80);
  const trace = [];
  const seen = new Map();
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  for (let i = 0; i < maxStops; i += 1) {
    await page.keyboard.press('Tab');
    const focus = await collectFocusState(page);
    if (!focus) break;
    const key = `${focus.tag}|${focus.id ?? ''}|${focus.role ?? ''}|${focus.name}|${Math.round(focus.box.x)}|${Math.round(focus.box.y)}`;
    trace.push({ index: i + 1, focus });
    const first = seen.get(key);
    if (first !== undefined) {
      trace.push({ index: i + 1, cycle_to: first });
      break;
    }
    seen.set(key, i + 1);
  }
  return trace;
}

async function runVariant(browser, url, htmlPath, scenario, viewport, media, outDir) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: media === 'reduced' ? 'reduce' : 'no-preference',
    colorScheme: scenario.colorScheme ?? 'light'
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (e) => runtimeErrors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  if (htmlPath) {
    const html = await fs.readFile(htmlPath, 'utf8');
    await page.setContent(html, { waitUntil: scenario.waitUntil ?? 'domcontentloaded', timeout: scenario.timeoutMs ?? 30000 });
  } else {
    await page.goto(url, { waitUntil: scenario.waitUntil ?? 'domcontentloaded', timeout: scenario.timeoutMs ?? 30000 });
  }
  await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
  if (scenario.settleMs) await page.waitForTimeout(scenario.settleMs);

  const variantDir = path.join(outDir, `${slug(viewport.name)}-${media}`);
  await ensureDir(variantDir);
  const initial = await checkpoint(page, variantDir, 'initial', scenario.redact ?? []);
  const trace = [];
  const scenarioFailures = [];
  for (let i = 0; i < scenario.steps.length; i += 1) {
    const record = await executeStep(page, scenario.steps[i], i, variantDir, scenario.redact ?? []);
    trace.push(record);
    if (record.status === 'fail') {
      scenarioFailures.push({ step: i + 1, message: record.message, reproduction: scenario.steps[i] });
      if (scenario.stopOnFailure !== false) break;
    }
  }
  const final = await checkpoint(page, variantDir, 'final', scenario.redact ?? []);
  const metrics = await collectPageMetrics(page);
  const aria = final.ariaData;
  const focusTrace = scenario.keyboardWalk === false ? [] : await keyboardWalk(page, scenario.keyboardWalk ?? {});
  const findings = evaluateEvidence({
    metrics,
    aria,
    runtimeErrors,
    consoleErrors,
    scenarioFailures,
    allowHorizontalScroll: scenario.allowHorizontalScroll === true
  });
  await writeJson(path.join(variantDir, 'metrics.json'), metrics);
  await writeJson(path.join(variantDir, 'findings.json'), findings);
  await writeJson(path.join(variantDir, 'focus-trace.json'), focusTrace);
  await fs.writeFile(path.join(variantDir, 'trace.jsonl'), `${trace.map((x) => JSON.stringify(x)).join('\n')}\n`, 'utf8');
  await context.close();
  return {
    viewport,
    media,
    directory: path.relative(outDir, variantDir).replaceAll('\\','/'),
    finding_summary: summarizeFindings(findings),
    runtime_errors: runtimeErrors.length,
    console_errors: consoleErrors.length,
    scenario_failures: scenarioFailures.length,
    initial: { screenshot: initial.screenshot, aria: initial.aria },
    final: { screenshot: final.screenshot, aria: final.aria },
    findings,
    trace,
    metrics,
    focusTrace
  };
}

async function runEvidence({ url, htmlPath = null, scenario, outDir, headed = false, toolVersion = '2.0.0-alpha.1' }) {
  await fs.rm(outDir, { recursive: true, force: true });
  await ensureDir(outDir);
  const browser = await launchBrowser(headed);
  const viewports = scenario.viewports ?? [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ];
  const mediaVariants = scenario.mediaVariants ?? ['normal'];
  const runs = [];
  try {
    for (const viewport of viewports) {
      for (const media of mediaVariants) runs.push(await runVariant(browser, url, htmlPath, scenario, viewport, media, outDir));
    }
  } finally {
    await browser.close();
  }
  const manifest = {
    schema_version: 1,
    tool_version: toolVersion,
    generated_at: nowIso(),
    url: url ?? null,
    html_fixture: htmlPath ? path.basename(htmlPath) : null,
    scenario_id: scenario.id,
    browser: 'chromium',
    runs: runs.map((r) => ({
      viewport: r.viewport,
      media: r.media,
      directory: r.directory,
      finding_summary: r.finding_summary,
      runtime_errors: r.runtime_errors,
      console_errors: r.console_errors,
      scenario_failures: r.scenario_failures
    })),
    limitations: scenario.limitations ?? []
  };
  const allFindings = runs.flatMap((r) => r.findings.map((f) => ({ ...f, viewport: r.viewport.name, media: r.media })));
  await writeJson(path.join(outDir, 'manifest.json'), manifest);
  await writeJson(path.join(outDir, 'findings.json'), allFindings);
  await writeJson(path.join(outDir, 'review-packet.json'), buildReviewPacket({ manifest, findings: allFindings, scenario }));

  const files = [];
  async function visit(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(p);
      else if (!p.endsWith('checksums.json')) files.push(p);
    }
  }
  await visit(outDir);
  const checksums = {};
  for (const file of files.sort()) checksums[path.relative(outDir, file).replaceAll('\\','/')] = await sha256File(file);
  await writeJson(path.join(outDir, 'checksums.json'), checksums);
  return { manifest, findings: allFindings, runs };
}
// ---- src/cli.mjs ----

const HELP = `UI Slop v2 P0 tooling\n\nUsage:\n  ui-slop inspect [project-root] [--out <context.json>]\n  ui-slop evidence <url> --scenario <scenario.json> --out <run-dir> [--headed]
  ui-slop evidence --html <fixture.html> --scenario <scenario.json> --out <run-dir>\n  ui-slop validate <run-dir>\n\nThe tooling collects evidence. It does not choose visual style or convert advisory measurements into aesthetic failures.\n`;

async function runCli(argv) {
  const [verb, ...rest] = argv;
  if (!verb || ['help','--help','-h'].includes(verb)) { console.log(HELP); return 0; }
  const args = parseArgs(rest);
  try {
    if (verb === 'inspect') {
      const root = args._[0] ?? process.cwd();
      const report = await inspectProject(root);
      if (args.out) await writeJson(path.resolve(args.out), report);
      console.log(JSON.stringify(report, null, 2));
      return 0;
    }
    if (verb === 'evidence') {
      const url = args._[0] ?? null;
      const htmlPath = args.html ? path.resolve(args.html) : null;
      if ((!url && !htmlPath) || !args.scenario || !args.out) throw new Error('evidence requires URL or --html, plus --scenario and --out.');
      const scenario = await loadScenario(path.resolve(args.scenario));
      const result = await runEvidence({ url: url ?? 'about:blank', htmlPath, scenario, outDir: path.resolve(args.out), headed: args.headed === true });
      const hardFailures = result.findings.filter((f) => f.classification === 'hard_failure').length;
      console.log(JSON.stringify({ run: path.resolve(args.out), hard_failures: hardFailures, findings: result.findings.length }, null, 2));
      return hardFailures ? 2 : 0;
    }
    if (verb === 'validate') {
      const dir = args._[0];
      if (!dir) throw new Error('validate requires a run directory.');
      const result = await validateBundle(path.resolve(dir));
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    console.error(`Unknown command: ${verb}\n\n${HELP}`);
    return 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

export { inspectProject, validateScenario, evaluateEvidence, summarizeFindings, runEvidence, validateBundle, runCli };

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const code = await runCli(process.argv.slice(2));
  process.exitCode = code;
}
