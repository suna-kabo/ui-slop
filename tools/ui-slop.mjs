#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const TOOL_VERSION = '2.0.0-rc.2';
const MANIFEST_SCHEMA_VERSION = 2;

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
  'assertVisible', 'assertText', 'assertUrl', 'assertStorage', 'assertFocus', 'assertNoOverflow'
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

  const requirementIds = new Set();
  if (s.requirements !== undefined) {
    if (!Array.isArray(s.requirements)) throw new Error('requirements must be an array.');
    for (const item of s.requirements) {
      if (!item || typeof item.id !== 'string' || !item.id || typeof item.text !== 'string' || !item.text) {
        throw new Error('Each requirement needs non-empty string id and text.');
      }
      if (requirementIds.has(item.id)) throw new Error('Duplicate requirement id: ' + item.id);
      requirementIds.add(item.id);
    }
  }

  const validateLocator = (locator, label) => {
    if (!locator || typeof locator !== 'object') throw new Error(label + ' requires locator.');
    const keys = ['testId','role','label','placeholder','text','selector'].filter((key) => locator[key] !== undefined);
    if (keys.length !== 1 && !(keys.includes('role') && locator.name !== undefined)) {
      throw new Error(label + ' locator must use one primary locator strategy.');
    }
  };

  for (const [index, step] of s.steps.entries()) {
    const at = 'step ' + (index + 1);
    if (!step || typeof step !== 'object' || !ACTIONS.has(step.action)) throw new Error('Unsupported action at ' + at + '.');
    if (step.requirementId && requirementIds.size && !requirementIds.has(step.requirementId)) {
      throw new Error('Unknown requirementId at ' + at + ': ' + step.requirementId);
    }
    if (['click','hover','fill','assertVisible','assertText','assertFocus'].includes(step.action)) validateLocator(step.locator, step.action + ' at ' + at);
    if (step.action === 'press' && typeof step.key !== 'string') throw new Error('press at ' + at + ' requires key.');
    if (step.action === 'wait' && (!Number.isFinite(step.ms) || step.ms < 0 || step.ms > 5000)) throw new Error('wait at ' + at + ' must be 0..5000ms.');
    if (step.action === 'assertStorage') {
      if (!['localStorage','sessionStorage'].includes(step.storage) || !step.key) throw new Error('assertStorage at ' + at + ' requires localStorage/sessionStorage and key.');
      if (step.equals === undefined && step.exists === undefined) throw new Error('assertStorage at ' + at + ' requires equals or exists.');
    }
    if (step.action === 'assertText' && step.equals === undefined && step.contains === undefined) throw new Error('assertText at ' + at + ' requires equals or contains.');
    if (step.action === 'assertUrl' && step.equals === undefined && step.contains === undefined) throw new Error('assertUrl at ' + at + ' requires equals or contains.');
    if (step.capture !== undefined && typeof step.capture !== 'boolean') throw new Error('capture at ' + at + ' must be boolean.');
  }

  if (s.viewports !== undefined) {
    if (!Array.isArray(s.viewports) || s.viewports.length === 0) throw new Error('viewports must be a non-empty array.');
    const names = new Set();
    for (const v of s.viewports) {
      if (!v || typeof v.name !== 'string' || !v.name || !Number.isInteger(v.width) || !Number.isInteger(v.height) || v.width < 240 || v.height < 240 || v.width > 7680 || v.height > 7680) {
        throw new Error('viewports must contain unique name and integer width/height between 240 and 7680.');
      }
      if (names.has(v.name)) throw new Error('Duplicate viewport name: ' + v.name);
      names.add(v.name);
    }
  }

  if (s.mediaVariants !== undefined) {
    if (!Array.isArray(s.mediaVariants) || s.mediaVariants.length === 0 || s.mediaVariants.some((v) => !['normal','reduced'].includes(v))) {
      throw new Error('mediaVariants may contain only normal and reduced.');
    }
  }

  if (s.redact !== undefined) {
    if (!Array.isArray(s.redact)) throw new Error('redact must be an array of locators.');
    s.redact.forEach((locator, index) => validateLocator(locator, 'redact[' + index + ']'));
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
async function collectPageMetrics(page, typographyOnly = false) {
  return page.evaluate((typographyOnly) => {
    const visible = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0;
    };
    const headingSelector = 'h1,h2,h3,h4,h5,h6,[role="heading"]';
    const interactiveSelector = 'a[href],button,input,select,textarea,summary,[role="button"],[role="link"],[role="tab"],[role^="menuitem"],[tabindex]';
    const landmarkSelector = 'section,article,header,main,[role="region"]';
    const semanticSelector = `${interactiveSelector},${headingSelector},[role],output`;
    const nativeRoles = { a: 'link', button: 'button', output: 'status', summary: 'button' };
    const headingBoxes = new Map();
    const round = (n) => Math.round(n * 10) / 10;
    const box = (rect) => ({ x: round(rect.x), y: round(rect.y), width: round(rect.width), height: round(rect.height) });
    const selectorFor = (element) => {
      const segments = [];
      for (let el = element; el && el !== document.body; el = el.parentElement) {
        if (el.id) {
          const id = '#' + CSS.escape(el.id);
          if (document.querySelectorAll(id).length === 1) return [id, ...segments].join(' > ');
        }
        const tag = CSS.escape(el.localName);
        const siblings = Array.from(el.parentElement.children).filter((sibling) => sibling.localName === el.localName);
        segments.unshift(siblings.length === 1 ? tag : `${tag}:nth-of-type(${siblings.indexOf(el) + 1})`);
      }
      return ['body', ...segments].join(' > ');
    };
    const nearbyHeading = (parent, rect, size) => {
      const region = parent.closest(landmarkSelector) ?? document.body;
      if (!headingBoxes.has(region)) {
        headingBoxes.set(region, Array.from(region.querySelectorAll(headingSelector))
          .filter(visible)
          .map((element) => ({ element, rect: element.getBoundingClientRect() })));
      }
      let nearest = null;
      for (const heading of headingBoxes.get(region)) {
        if (heading.element.contains(parent) || heading.rect.right <= rect.left || heading.rect.left >= rect.right) continue;
        const gap = Math.max(heading.rect.top - rect.bottom, rect.top - heading.rect.bottom, 0);
        if (gap <= 4 * size && (!nearest || gap < nearest.gap)) nearest = { ...heading, gap };
      }
      return nearest && {
        selector: selectorFor(nearest.element),
        position: rect.top < nearest.rect.top ? 'before' : 'after',
        gap: round(nearest.gap)
      };
    };
    const textNodes = [];
    const uppercaseMicro = [];
    const range = document.createRange();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.replace(/\s+/g, ' ').trim();
      const parent = node.parentElement;
      if (!text || !parent || !visible(parent)) continue;
      const style = getComputedStyle(parent);
      const size = parseFloat(style.fontSize) || 0;
      textNodes.push({ chars: text.length, size });

      if (size > 12 || text.length < 3 || text.length > 64) continue;
      const transform = style.textTransform.split(' ');
      const renderedText = transform.includes('uppercase') ? text.toUpperCase()
        : transform.includes('lowercase') ? text.toLowerCase() : text;
      if (renderedText === renderedText.toLowerCase() || renderedText !== renderedText.toUpperCase()) continue;
      if (!parent.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) continue;
      range.selectNodeContents(node);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;

      const owner = parent.closest(semanticSelector);
      const role = owner?.getAttribute('role') || nativeRoles[owner?.localName]
        || (owner?.matches(headingSelector) ? 'heading' : null);
      const interactive = Boolean(parent.closest(interactiveSelector));
      const inViewport = rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
      const heading = inViewport ? nearbyHeading(parent, rect, size) : null;
      const tracked = parseFloat(style.letterSpacing) >= size * 0.045;
      uppercaseMicro.push({
        text,
        renderedText,
        selector: selectorFor(parent),
        size,
        letterSpacing: style.letterSpacing,
        textTransform: style.textTransform,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        box: box(rect),
        inViewport,
        role,
        interactive,
        nearbyHeading: heading,
        candidate: inViewport && (tracked || (!interactive && heading?.position === 'before'))
      });
    }
    const totalChars = textNodes.reduce((n, x) => n + x.chars, 0);
    const charsLe12 = textNodes.filter((x) => x.size <= 12).reduce((n, x) => n + x.chars, 0);
    const charsGe15 = textNodes.filter((x) => x.size >= 15).reduce((n, x) => n + x.chars, 0);
    const repetitions = new Map();
    for (const label of uppercaseMicro) {
      repetitions.set(label.renderedText, (repetitions.get(label.renderedText) ?? 0) + 1);
    }
    for (const label of uppercaseMicro) label.repeatedCount = repetitions.get(label.renderedText);
    const candidates = uppercaseMicro.filter((label) => label.candidate);
    const typography = {
      visibleChars: totalChars,
      charsLe12,
      charsGe15,
      pctLe12: totalChars ? charsLe12 / totalChars : 0,
      pctGe15: totalChars ? charsGe15 / totalChars : 0,
      uppercaseMicroLabels: uppercaseMicro.length,
      samples: uppercaseMicro.slice(0, 20),
      microLabelCandidateCount: candidates.length,
      microLabelCandidates: candidates.slice(0, 20)
    };
    if (typographyOnly) return typography;

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
      typography,
      interactives,
      animationInventory
    };
  }, typographyOnly);
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

async function collectAccessibilityInventory(page) {
  try {
    const items = await page.evaluate(() => {
      const visible = (el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0 && el.getAttribute('aria-hidden') !== 'true';
      };
      const nativeRole = (el) => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'button') return 'button';
        if (tag === 'a' && el.hasAttribute('href')) return 'link';
        if (tag === 'textarea') return 'textbox';
        if (tag === 'select') return 'combobox';
        if (tag === 'input') {
          const type = (el.getAttribute('type') || 'text').toLowerCase();
          if (type === 'hidden') return null;
          if (['button','submit','reset','image'].includes(type)) return 'button';
          if (type === 'checkbox') return 'checkbox';
          if (type === 'radio') return 'radio';
          if (type === 'range') return 'slider';
          if (type === 'number') return 'spinbutton';
          return 'textbox';
        }
        return null;
      };
      const labelledByText = (el) => {
        const raw = el.getAttribute('aria-labelledby');
        if (!raw) return '';
        return raw.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
      };
      const labelText = (el) => {
        if ('labels' in el && el.labels) return [...el.labels].map((x) => x.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
        return '';
      };
      const nameFor = (el) => {
        const aria = (el.getAttribute('aria-label') || '').trim();
        if (aria) return { name: aria, source: 'aria-label' };
        const labelled = labelledByText(el);
        if (labelled) return { name: labelled, source: 'aria-labelledby' };
        const labels = labelText(el);
        if (labels) return { name: labels, source: 'label' };
        const alt = (el.getAttribute('alt') || '').trim();
        if (alt) return { name: alt, source: 'alt' };
        const type = (el.getAttribute('type') || '').toLowerCase();
        const value = (el.getAttribute('value') || '').trim();
        if (el.tagName.toLowerCase() === 'input' && ['button','submit','reset'].includes(type) && value) return { name: value, source: 'value' };
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) return { name: text, source: 'text' };
        const childAlt = [...el.querySelectorAll('img[alt]')].map((img) => img.getAttribute('alt') || '').join(' ').trim();
        if (childAlt) return { name: childAlt, source: 'descendant-alt' };
        const title = (el.getAttribute('title') || '').trim();
        if (title) return { name: title, source: 'title' };
        return { name: '', source: null };
      };

      return [...document.querySelectorAll('a[href],button,input:not([type="hidden"]),select,textarea,[role]')]
        .filter(visible)
        .map((el) => {
          const explicitRole = el.getAttribute('role');
          const role = explicitRole || nativeRole(el);
          const name = nameFor(el);
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            role,
            explicitRole,
            nativeInteractive: Boolean(nativeRole(el)),
            name: name.name.slice(0, 160),
            nameSource: name.source,
            disabled: Boolean(el.disabled) || el.getAttribute('aria-disabled') === 'true',
            tabIndex: el.tabIndex,
            box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          };
        });
    });
    return { blocked: false, method: 'dom-accessible-name-inventory-v1', items };
  } catch (error) {
    return { blocked: true, method: 'dom-accessible-name-inventory-v1', reason: error instanceof Error ? error.message : String(error), items: [] };
  }
}
// ---- src/checks.mjs ----

const INTERACTIVE_ROLES = new Set(['button','link','textbox','searchbox','checkbox','radio','combobox','slider','spinbutton','switch','menuitem','tab','treeitem']);

function evaluateEvidence({ metrics, accessibility, runtimeErrors = [], consoleErrors = [], scenarioFailures = [], blockedReasons = [], allowHorizontalScroll = false }) {
  const findings = [];
  const add = (classification, category, id, observation, extra = {}) => findings.push({
    id,
    classification,
    outcome: classification === 'hard_failure' ? 'fail' : classification === 'blocked' ? 'blocked' : classification === 'advisory' ? 'advisory' : 'observed',
    category,
    observation,
    confidence: extra.confidence ?? 'high',
    ...extra
  });

  for (const reason of blockedReasons) add('blocked', 'coverage', reason.id || 'blocked-evidence', reason.message || String(reason), { confidence: 'high' });

  for (const failure of scenarioFailures) {
    add('hard_failure', 'contract', 'scenario-' + failure.step, failure.message, {
      requirement_id: failure.requirementId ?? null,
      reproduction: failure.reproduction,
      confidence: 'high'
    });
  }
  for (const err of runtimeErrors) add('hard_failure', 'runtime', 'page-error', String(err), { confidence: 'high' });
  for (const err of consoleErrors) add('advisory', 'runtime', 'console-error', String(err), { confidence: 'medium' });

  if (metrics?.document && !allowHorizontalScroll && metrics.document.scrollWidth > metrics.document.clientWidth + 1) {
    add('hard_failure', 'responsive', 'root-horizontal-overflow', 'Document scrollWidth ' + metrics.document.scrollWidth + 'px exceeds clientWidth ' + metrics.document.clientWidth + 'px.', { confidence: 'high' });
  }

  if (accessibility?.blocked) {
    add('blocked', 'accessibility', 'accessibility-inventory-blocked', accessibility.reason || 'Accessibility inventory unavailable.', { confidence: 'high' });
  } else if (accessibility?.items) {
    const interactiveRoles = new Set(['button','link','textbox','searchbox','checkbox','radio','combobox','slider','spinbutton','switch','menuitem','tab','treeitem']);
    const unnamed = accessibility.items.filter((node) => interactiveRoles.has(node.role) && !node.disabled && !String(node.name ?? '').trim());
    for (const node of unnamed.slice(0, 50)) {
      add('hard_failure', 'accessibility', 'unnamed-interactive', 'Visible interactive role ' + node.role + ' has no observed accessible name.', {
        evidence: node,
        confidence: node.nativeInteractive ? 'high' : 'medium'
      });
    }
    add('evidence_only', 'accessibility', 'accessibility-inventory', 'Visible accessibility inventory collected.', {
      evidence: { method: accessibility.method, count: accessibility.items.length },
      confidence: 'high'
    });
  }

  if (metrics?.typography) {
    add('evidence_only', 'typography', 'text-size-distribution', 'Visible text size distribution collected.', { evidence: metrics.typography, confidence: 'high' });
    if (metrics.typography.pctLe12 >= 0.6) {
      add('advisory', 'typography', 'microtype-heavy', Math.round(metrics.typography.pctLe12 * 100) + '% of visible text characters render at 12px or smaller. Review whether density is being purchased through legibility loss.', { evidence: metrics.typography, confidence: 'medium' });
    }
    if (metrics.typography.uppercaseMicroLabels >= 8) {
      add('advisory', 'copy', 'uppercase-micro-label-recurrence', metrics.typography.uppercaseMicroLabels + ' visible small uppercase text nodes were observed. Review whether they represent real semantic roles or layout-explanation labels.', { evidence: metrics.typography.samples, confidence: 'medium' });
    }
  }
  const typographyStates = [
    ...(metrics?.typographyCheckpoints ?? []),
    { state: 'final', typography: metrics?.typography }
  ];
  for (const { state, typography } of typographyStates) {
    if (!typography?.microLabelCandidateCount) continue;
    add('advisory', 'copy', 'rendered-micro-label-candidates',
      typography.microLabelCandidateCount + ' small uppercase text runs with tracking or heading proximity were observed. Review their task value and placement in context.',
      {
        evidence: { state, viewport: metrics.viewport, count: typography.microLabelCandidateCount, candidates: typography.microLabelCandidates },
        confidence: 'medium'
      });
  }

  if (metrics?.interactives) {
    const small = metrics.interactives.filter((x) => x.width > 0 && x.height > 0 && (x.width < 24 || x.height < 24));
    add('evidence_only', 'interaction', 'interactive-geometry', 'Interactive geometry inventory collected.', { evidence: { count: metrics.interactives.length, smallTargets: small.slice(0,50) }, confidence: 'high' });
    if (small.length) {
      add('advisory', 'interaction', 'small-targets', small.length + ' visible interactive elements are smaller than 24px in at least one dimension. Review applicable target-size exceptions and the actual interaction context before treating this as a failure.', { evidence: small.slice(0,20), confidence: 'medium' });
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
function buildReviewPacket({ manifest, findings, scenario, briefFile = null }) {
  return {
    schema_version: 2,
    review_mode: 'evidence-first',
    isolation_contract: [
      'Review the original brief/contract and evidence before reading any generator self-assessment.',
      'Record unprompted findings before consulting advisory detector findings.',
      'Do not turn advisory measurements into objective failures without product-specific reasoning.',
      'Use PASS, FAIL, BLOCKED, or ADVISORY per requirement.',
      'Cite evidence ids or trace steps for every material finding.',
      'Unknown or unexecuted checks are BLOCKED, never silently PASS.'
    ],
    brief_file: briefFile,
    scenario: {
      id: scenario.id,
      description: scenario.description ?? null,
      requirements: scenario.requirements ?? []
    },
    run: manifest,
    findings
  };
}
// ---- src/validate.mjs ----

async function validateBundle(runDir) {
  const required = ['manifest.json', 'findings.json', 'review-packet.json', 'checksums.json', 'inputs/scenario.json'];
  const missing = [];
  for (const f of required) if (!(await exists(path.join(runDir, f)))) missing.push(f);
  if (missing.length) return { ok: false, errors: ['Missing required files: ' + missing.join(', ')] };

  const manifest = await readJson(path.join(runDir, 'manifest.json'));
  const findings = await readJson(path.join(runDir, 'findings.json'));
  const review = await readJson(path.join(runDir, 'review-packet.json'));
  const checksums = await readJson(path.join(runDir, 'checksums.json'));
  const errors = [];

  if (manifest.schema_version !== MANIFEST_SCHEMA_VERSION) errors.push('Unsupported manifest schema_version ' + manifest.schema_version + '.');
  if (!manifest.scenario_id || !Array.isArray(manifest.runs)) errors.push('Manifest lacks scenario_id or runs.');
  if (review.schema_version !== 2 || review.review_mode !== 'evidence-first') errors.push('Review packet schema or mode is invalid.');
  if (!Array.isArray(findings)) errors.push('findings.json must be an array.');

  const allowed = new Set(['hard_failure','advisory','evidence_only','blocked']);
  if (Array.isArray(findings)) {
    for (const finding of findings) {
      if (!finding || !allowed.has(finding.classification)) errors.push('Invalid finding classification.');
      if (!finding.id || !finding.category || !finding.observation) errors.push('Finding missing id/category/observation.');
    }
  }

  for (const run of manifest.runs ?? []) {
    if (!run.directory) { errors.push('Run missing directory.'); continue; }
    if (run.status === 'completed') {
      for (const rel of ['metrics.json','findings.json','focus-trace.json','trace.jsonl']) {
        if (!(await exists(path.join(runDir, run.directory, rel)))) errors.push('Completed run missing ' + run.directory + '/' + rel);
      }
    }
  }

  for (const [rel, expected] of Object.entries(checksums)) {
    const file = path.join(runDir, rel);
    if (!(await exists(file))) { errors.push('Checksum target missing: ' + rel); continue; }
    const actual = await sha256File(file);
    if (actual !== expected) errors.push('Checksum mismatch: ' + rel);
  }

  return { ok: errors.length === 0, errors, manifest, finding_count: Array.isArray(findings) ? findings.length : null };
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

async function checkpoint(page, outDir, label, redact = [], observeTypography = false) {
  const safe = slug(label);
  const img = path.join(outDir, 'captures', safe + '.png');
  const accessibilityFile = path.join(outDir, 'accessibility', safe + '.json');
  await ensureDir(path.dirname(img));
  await ensureDir(path.dirname(accessibilityFile));
  const masks = redact.map((spec) => resolveLocator(page, spec));
  await page.screenshot({ path: img, fullPage: false, mask: masks });
  const accessibility = await collectAccessibilityInventory(page);
  await writeJson(accessibilityFile, accessibility);
  return {
    screenshot: path.relative(outDir, img).replaceAll('\\','/'),
    accessibility: path.relative(outDir, accessibilityFile).replaceAll('\\','/'),
    accessibilityData: accessibility,
    typography: observeTypography ? await collectPageMetrics(page, true) : undefined
  };
}

async function collectUiState(page) {
  const focus = await collectFocusState(page);
  const rest = await page.evaluate(() => {
    const active = [...document.querySelectorAll('[aria-current],[aria-selected="true"],[aria-expanded="true"],[aria-pressed="true"],input:checked')]
      .slice(0, 40)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        role: el.getAttribute('role'),
        current: el.getAttribute('aria-current'),
        selected: el.getAttribute('aria-selected'),
        expanded: el.getAttribute('aria-expanded'),
        pressed: el.getAttribute('aria-pressed'),
        checked: 'checked' in el ? Boolean(el.checked) : null,
        text: (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }));
    const animations = document.getAnimations({ subtree: true });
    return {
      title: document.title,
      scroll: { x: window.scrollX, y: window.scrollY },
      active_states: active,
      motion: {
        total: animations.length,
        running: animations.filter((a) => a.playState === 'running' || a.playState === 'pending').length
      }
    };
  });
  return { url: page.url(), focus, ...rest };
}

async function executeStep(page, step, stepIndex, outDir, redact, typographyCheckpoints) {
  const started = Date.now();
  const base = {
    step: stepIndex + 1,
    action: step.action,
    requirement_id: step.requirementId ?? null,
    started_at: nowIso(),
    status: 'pass',
    before: await collectUiState(page)
  };
  try {
    if (step.action === 'click') await resolveLocator(page, step.locator).click();
    else if (step.action === 'hover') await resolveLocator(page, step.locator).hover();
    else if (step.action === 'press') await page.keyboard.press(step.key);
    else if (step.action === 'fill') await resolveLocator(page, step.locator).fill(step.value ?? '');
    else if (step.action === 'wait') await page.waitForTimeout(step.ms);
    else if (step.action === 'back') await page.goBack({ waitUntil: 'domcontentloaded' });
    else if (step.action === 'reload') await page.reload({ waitUntil: 'domcontentloaded' });
    else if (step.action === 'assertVisible') {
      if (!(await resolveLocator(page, step.locator).isVisible())) throw new Error('Expected locator to be visible.');
    }
    else if (step.action === 'assertText') {
      const text = await resolveLocator(page, step.locator).innerText();
      if (step.equals !== undefined && text !== step.equals) throw new Error('Expected text exactly ' + JSON.stringify(step.equals) + ', got ' + JSON.stringify(text) + '.');
      if (step.contains !== undefined && !text.includes(step.contains)) throw new Error('Expected text containing ' + JSON.stringify(step.contains) + ', got ' + JSON.stringify(text) + '.');
    }
    else if (step.action === 'assertUrl') {
      const current = page.url();
      if (step.equals !== undefined && current !== step.equals) throw new Error('Expected URL ' + step.equals + ', got ' + current + '.');
      if (step.contains !== undefined && !current.includes(step.contains)) throw new Error('Expected URL containing ' + step.contains + ', got ' + current + '.');
    }
    else if (step.action === 'assertStorage') {
      const value = await page.evaluate(({ storage, key }) => window[storage]?.getItem(key), { storage: step.storage, key: step.key });
      if (step.equals !== undefined && value !== step.equals) throw new Error('Expected ' + step.storage + '.' + step.key + '=' + JSON.stringify(step.equals) + ', got ' + JSON.stringify(value) + '.');
      if (step.exists === true && value == null) throw new Error('Expected ' + step.storage + '.' + step.key + ' to exist.');
      if (step.exists === false && value != null) throw new Error('Expected ' + step.storage + '.' + step.key + ' not to exist.');
    }
    else if (step.action === 'assertFocus') {
      const matched = await resolveLocator(page, step.locator).evaluate((el) => el === document.activeElement);
      if (!matched) throw new Error('Expected locator to own focus.');
    }
    else if (step.action === 'assertNoOverflow') {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflow) throw new Error('Expected no root horizontal overflow.');
    }

    if (step.action === 'snapshot' || step.capture === true) {
      const state = step.label ?? 'step-' + (stepIndex + 1);
      const cp = await checkpoint(page, outDir, state, redact, true);
      base.evidence = { screenshot: cp.screenshot, accessibility: cp.accessibility };
      typographyCheckpoints.push({ state, typography: cp.typography });
    }
  } catch (error) {
    base.status = 'fail';
    base.message = error instanceof Error ? error.message : String(error);
  }
  base.after = await collectUiState(page).catch(() => null);
  base.duration_ms = Date.now() - started;
  base.finished_at = nowIso();
  return base;
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

  try {
    if (htmlPath) {
      const html = await fs.readFile(htmlPath, 'utf8');
      await page.setContent(html, { waitUntil: scenario.waitUntil ?? 'domcontentloaded', timeout: scenario.timeoutMs ?? 30000 });
    } else {
      await page.goto(url, { waitUntil: scenario.waitUntil ?? 'domcontentloaded', timeout: scenario.timeoutMs ?? 30000 });
    }
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
    if (scenario.settleMs) await page.waitForTimeout(scenario.settleMs);

    const variantDir = path.join(outDir, slug(viewport.name) + '-' + media);
    await ensureDir(variantDir);
    const initial = await checkpoint(page, variantDir, 'initial', scenario.redact ?? [], true);
    const typographyCheckpoints = [{ state: 'initial', typography: initial.typography }];
    const trace = [];
    const scenarioFailures = [];

    for (let i = 0; i < scenario.steps.length; i += 1) {
      const record = await executeStep(page, scenario.steps[i], i, variantDir, scenario.redact ?? [], typographyCheckpoints);
      trace.push(record);
      if (record.status === 'fail') {
        scenarioFailures.push({
          step: i + 1,
          requirementId: scenario.steps[i].requirementId ?? null,
          message: record.message,
          reproduction: scenario.steps[i]
        });
        if (scenario.stopOnFailure !== false) break;
      }
    }

    const final = await checkpoint(page, variantDir, 'final', scenario.redact ?? []);
    const metrics = await collectPageMetrics(page);
    metrics.typographyCheckpoints = typographyCheckpoints;
    metrics.media = {
      prefersReducedMotion: await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
      colorScheme: scenario.colorScheme ?? 'light'
    };
    const accessibility = final.accessibilityData;
    const focusTrace = scenario.keyboardWalk === false ? [] : await keyboardWalk(page, scenario.keyboardWalk ?? {});
    const findings = evaluateEvidence({
      metrics,
      accessibility,
      runtimeErrors,
      consoleErrors,
      scenarioFailures,
      allowHorizontalScroll: scenario.allowHorizontalScroll === true
    });

    await writeJson(path.join(variantDir, 'metrics.json'), metrics);
    await writeJson(path.join(variantDir, 'findings.json'), findings);
    await writeJson(path.join(variantDir, 'focus-trace.json'), focusTrace);
    await fs.writeFile(path.join(variantDir, 'trace.jsonl'), trace.map((x) => JSON.stringify(x)).join('\n') + '\n', 'utf8');

    return {
      status: 'completed',
      viewport,
      media,
      directory: path.relative(outDir, variantDir).replaceAll('\\','/'),
      finding_summary: summarizeFindings(findings),
      runtime_errors: runtimeErrors.length,
      console_errors: consoleErrors.length,
      scenario_failures: scenarioFailures.length,
      initial: { screenshot: initial.screenshot, accessibility: initial.accessibility },
      final: { screenshot: final.screenshot, accessibility: final.accessibility },
      findings,
      trace,
      metrics,
      focusTrace
    };
  } finally {
    await context.close();
  }
}

async function runEvidence({ url, htmlPath = null, scenario, outDir, headed = false, toolVersion = TOOL_VERSION, briefText = null, briefSource = null }) {
  validateScenario(scenario);
  await fs.rm(outDir, { recursive: true, force: true });
  await ensureDir(outDir);
  await ensureDir(path.join(outDir, 'inputs'));
  await writeJson(path.join(outDir, 'inputs', 'scenario.json'), scenario);
  let briefFile = null;
  if (briefText !== null) {
    briefFile = 'inputs/brief.txt';
    await fs.writeFile(path.join(outDir, briefFile), String(briefText), 'utf8');
  }

  const browser = await launchBrowser(headed);
  const browserVersion = browser.version();
  const viewports = scenario.viewports ?? defaultViewports();
  const mediaVariants = scenario.mediaVariants ?? ['normal'];
  const runs = [];

  try {
    for (const viewport of viewports) {
      for (const media of mediaVariants) {
        try {
          runs.push(await runVariant(browser, url, htmlPath, scenario, viewport, media, outDir));
        } catch (error) {
          const finding = {
            id: 'variant-blocked',
            classification: 'blocked',
            outcome: 'blocked',
            category: 'coverage',
            observation: error instanceof Error ? error.message : String(error),
            confidence: 'high'
          };
          runs.push({
            status: 'blocked',
            viewport,
            media,
            directory: slug(viewport.name) + '-' + media,
            finding_summary: summarizeFindings([finding]),
            runtime_errors: 0,
            console_errors: 0,
            scenario_failures: 0,
            findings: [finding],
            trace: [],
            metrics: null,
            focusTrace: []
          });
        }
      }
    }
  } finally {
    await browser.close();
  }

  const manifest = {
    schema_version: MANIFEST_SCHEMA_VERSION,
    tool_version: toolVersion,
    generated_at: nowIso(),
    target: {
      url: htmlPath ? null : (url ?? null),
      html_fixture: htmlPath ? path.basename(htmlPath) : null
    },
    scenario_id: scenario.id,
    requirement_ids: (scenario.requirements ?? []).map((x) => x.id),
    browser: { name: 'chromium', version: browserVersion },
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
    inputs: {
      scenario: 'inputs/scenario.json',
      brief: briefFile,
      brief_source: briefSource ? path.basename(briefSource) : null
    },
    runs: runs.map((r) => ({
      status: r.status,
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
  await writeJson(path.join(outDir, 'review-packet.json'), buildReviewPacket({ manifest, findings: allFindings, scenario, briefFile }));

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

const HELP = 'UI Slop v2 evidence tooling\n\nUsage:\n' +
  '  ui-slop inspect [project-root] [--out <context.json>]\n' +
  '  ui-slop capture <url> --scenario <scenario.json> --out <run-dir> [--brief <brief.txt>] [--headed]\n' +
  '  ui-slop capture --html <fixture.html> --scenario <scenario.json> --out <run-dir> [--brief <brief.txt>]\n' +
  '  ui-slop validate <run-dir>\n\n' +
  'The tooling collects evidence. It does not choose visual style or convert advisory measurements into aesthetic failures.\n';

async function runCli(argv) {
  const [verb, ...rest] = argv;
  if (!verb || ['help','--help','-h'].includes(verb)) { console.log(HELP); return 0; }
  if (verb === '--version' || verb === 'version') { console.log(TOOL_VERSION); return 0; }
  const args = parseArgs(rest);
  try {
    if (verb === 'inspect') {
      const root = args._[0] ?? process.cwd();
      const report = await inspectProject(root);
      if (args.out) await writeJson(path.resolve(args.out), report);
      console.log(JSON.stringify(report, null, 2));
      return 0;
    }
    if (verb === 'capture' || verb === 'evidence') {
      const url = args._[0] ?? null;
      const htmlPath = args.html ? path.resolve(args.html) : null;
      if ((!url && !htmlPath) || !args.scenario || !args.out) throw new Error('capture requires URL or --html, plus --scenario and --out.');
      const scenario = await loadScenario(path.resolve(args.scenario));
      let briefText = null;
      let briefSource = null;
      if (args.brief) {
        briefSource = path.resolve(args.brief);
        briefText = await fs.readFile(briefSource, 'utf8');
      }
      const result = await runEvidence({
        url: url ?? 'about:blank',
        htmlPath,
        scenario,
        outDir: path.resolve(args.out),
        headed: args.headed === true,
        briefText,
        briefSource
      });
      const summary = summarizeFindings(result.findings);
      console.log(JSON.stringify({
        run: path.resolve(args.out),
        status: summary.blocked ? 'blocked' : summary.hard_failure ? 'failed' : 'completed',
        summary,
        findings: result.findings.length
      }, null, 2));
      if (summary.blocked) return 3;
      return summary.hard_failure ? 2 : 0;
    }
    if (verb === 'validate') {
      const dir = args._[0];
      if (!dir) throw new Error('validate requires a run directory.');
      const result = await validateBundle(path.resolve(dir));
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    console.error('Unknown command: ' + verb + '\n\n' + HELP);
    return 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

export { TOOL_VERSION, inspectProject, validateScenario, evaluateEvidence, summarizeFindings, runEvidence, validateBundle, runCli };

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const code = await runCli(process.argv.slice(2));
  process.exitCode = code;
}
