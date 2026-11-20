import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const name = 'ui-slop';
const dist = path.join(root, 'dist', name);
const manifestFile = 'skill-manifest.json';
const scripts = ['tools/ui-slop-v3.mjs', 'tools/ui-slop.mjs'];
const required = [
  'SKILL.md', 'LICENSE', 'package-lock.json',
  'references/module-map.md', 'references/shaping.md', 'references/product-principles.md',
  'references/reference-calibration.md', 'references/concept-proof.md', 'references/craft-floor.md',
  'references/review-stages.md', 'references/review-protocol.md', 'references/quality-bar.md',
  'references/browser-qa.md', 'references/evidence-gate.md', 'references/evidence-harness.md',
  'references/evidence-schema.md',
  'examples/experience-brief.template.md', 'examples/product-principles.template.md',
  'examples/review-record.template.md', 'examples/scenario.example.json', ...scripts
];
const forbidden = /(?:^|\/)(?:\.mcp|mcp)\.json$/i;
const json = (value) => JSON.stringify(value, null, 2) + '\n';
const digest = (value) => createHash('sha256').update(value).digest('hex');
const missing = (error) => error.code === 'ENOENT';

async function stat(file) {
  return fs.lstat(file).catch((error) => {
    if (!missing(error)) throw error;
    return null;
  });
}

async function readSource(file) {
  const location = path.join(root, file);
  if (!(await stat(location))?.isFile() || !((await fs.realpath(location)).startsWith(await fs.realpath(root) + path.sep))) {
    throw new Error(`Required source file is missing or is a link outside the source: ${file}`);
  }
  return (await fs.readFile(location, 'utf8')).replace(/\r\n/g, '\n');
}

function references(file, content) {
  if (!file.endsWith('.md')) return [];
  const matches = content.matchAll(/[`](?:(?:\.\/)?((?:references|examples|tools)\/[a-z0-9_.-]+)|([a-z0-9_.-]+\.md))[`]|\]\(((?:\.\.?\/)?[a-z0-9_./-]+\.(?:md|json|mjs))(?:#[^)]*)?\)/gi);
  return Array.from(matches, ([, full, short, link]) => {
    if (full) return full;
    if (short === 'SKILL.md') return short;
    return path.posix.normalize(path.posix.join(path.posix.dirname(file), short ?? link));
  });
}

async function bundleFiles() {
  const pkg = JSON.parse(await readSource('package.json'));
  const { version, type, bin, engines, dependencies } = pkg;
  if (pkg.name !== name || !/^3\.\d+\.\d+(?:-[\w.-]+)?$/.test(version) ||
      type !== 'module' || bin?.[name] !== './tools/ui-slop-v3.mjs' || engines?.node !== '>=20' ||
      Object.keys(dependencies ?? {}).join() !== 'playwright' || !/^\d+\.\d+\.\d+$/.test(dependencies.playwright)) {
    throw new Error('Invalid package name, v3 version, Node requirement, evidence entrypoint, or dependencies in package.json.');
  }

  const files = new Map();
  const pending = new Set(required);
  for (const file of pending) {
    if (forbidden.test(file) || (!required.includes(file) && !/^references\/[a-z0-9_.-]+\.md$/.test(file))) {
      throw new Error(`Unexpected runtime reference: ${file}`);
    }
    const content = await readSource(file);
    if (/\bmcpServers\b/.test(content)) throw new Error(`MCP configuration found in ${file}`);
    files.set(file, content);
    for (const reference of references(file, content)) pending.add(reference);
  }

  const skill = files.get('SKILL.md');
  const description = /^---\nname: ui-slop\ndescription: ([^\n]+)\n---\n/.exec(skill)?.[1];
  if (!description || description.length > 1024 || !/^[a-z]/i.test(description) || /:(?:\s|$)|\s#|[\x00-\x1f]/.test(description)) {
    throw new Error('SKILL.md requires name: ui-slop and a nonempty, single-line description in YAML frontmatter.');
  }
  for (const file of scripts) {
    if (!files.get(file).startsWith('#!/usr/bin/env node\n')) throw new Error(`Missing Node shebang: ${file}`);
  }

  const entrypoint = path.join(root, bin[name]);
  for (const file of scripts) {
    try {
      execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Node cannot execute ${file}: ${error.stderr?.toString().trim() || error.message}`);
    }
  }
  if (execFileSync(process.execPath, [entrypoint, '--version'], { encoding: 'utf8' }).trim() !== version) {
    throw new Error(`Version from ${bin[name]} differs from package.json (${version}).`);
  }

  const lock = JSON.parse(files.get('package-lock.json'));
  const locked = lock.packages?.[''];
  if (lock.name !== name || lock.version !== version || locked?.name !== name || locked.version !== version ||
      locked.dependencies?.playwright !== dependencies.playwright ||
      locked.bin?.[name] !== bin[name].replace(/^\.\//, '') || locked.engines?.node !== engines.node ||
      lock.packages?.['node_modules/playwright']?.version !== dependencies.playwright ||
      lock.packages?.['node_modules/playwright-core']?.version !== dependencies.playwright) {
    throw new Error('package-lock.json is out of sync with package.json.');
  }

  files.set('package.json', json({ name, version, private: true, type, bin, engines, dependencies }));
  const ordered = new Map([...files].sort(([left], [right]) => left < right ? -1 : left === right ? 0 : 1));
  const hashes = Object.fromEntries(Array.from(ordered, ([file, content]) => [file, digest(content)]));
  ordered.set(manifestFile, json({ schemaVersion: 1, name, version, sourceDigest: digest(json(hashes)), files: hashes }));
  return { files: ordered, version };
}

async function rename(from, to) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await fs.rename(from, to);
      return;
    } catch (error) {
      // Windows scanners can briefly hold a handle to a newly written directory.
      if (process.platform !== 'win32' || attempt === 5 || !['EPERM', 'EBUSY', 'EACCES'].includes(error.code)) throw error;
      await delay(25 * 2 ** attempt);
    }
  }
}

// Stage on the same filesystem. Keep the previous directory until promotion succeeds.
async function replaceDirectory(parent, bundle) {
  const destination = path.join(parent, name);
  const lock = path.join(parent, '.ui-slop-install-lock');
  await fs.mkdir(lock).catch((error) => {
    if (error.code === 'EEXIST') {
      throw new Error(`Another update is in progress or left a backup at ${lock}. Inspect it before retrying.`, { cause: error });
    }
    throw error;
  });
  const next = path.join(lock, 'next');
  const previous = path.join(lock, 'previous');
  let backedUp = false;
  try {
    const old = await stat(destination);
    if (old && !old.isDirectory()) throw new Error(`Expected a real directory at ${destination}`);
    for (const [file, content] of bundle.files) {
      const output = path.join(next, file);
      await fs.mkdir(path.dirname(output), { recursive: true });
      await fs.writeFile(output, content);
      if (scripts.includes(file)) await fs.chmod(output, 0o755);
    }
    if (old) {
      await rename(destination, previous);
      backedUp = true;
    }
    await rename(next, destination);
    backedUp = false;
    return destination;
  } catch (error) {
    if (backedUp) {
      try {
        await rename(previous, destination);
        backedUp = false;
      } catch (restoreError) {
        throw new Error(`Could not restore ${destination}. Backup at ${previous}: ${restoreError.message}`, { cause: error });
      }
    }
    throw error;
  } finally {
    if (!backedUp) await fs.rm(lock, { recursive: true, force: true, maxRetries: 5 });
  }
}

async function ensureDirectory(parent, relative) {
  const directory = path.join(parent, relative);
  await fs.mkdir(directory).catch((error) => {
    if (error.code !== 'EEXIST') throw error;
  });
  if (!(await fs.lstat(directory)).isDirectory()) throw new Error(`Expected a real directory at ${directory}`);
  return directory;
}

async function install(target, bundle) {
  const base = await fs.realpath(target);
  const agents = await ensureDirectory(base, '.agents');
  return replaceDirectory(await ensureDirectory(agents, 'skills'), bundle);
}

async function verifyDirectory(directory, bundle, installed) {
  if (!(await stat(directory))?.isDirectory()) throw new Error(`Expected a real directory at ${directory}`);
  const expected = new Set(bundle.files.keys());
  const folders = new Set(Array.from(expected, (file) => path.posix.dirname(file)));
  const issues = [];
  async function visit(relative = '') {
    for (const entry of await fs.readdir(path.join(directory, relative), { withFileTypes: true })) {
      const file = relative ? `${relative}/${entry.name}` : entry.name;
      if (installed && file === 'node_modules' && entry.isDirectory()) continue;
      if (entry.isDirectory() && folders.has(file)) {
        await visit(file);
      } else if (entry.isFile() && expected.delete(file)) {
        const absolute = path.join(directory, file);
        if (digest(await fs.readFile(absolute)) !== digest(bundle.files.get(file))) issues.push(`changed ${file}`);
        if (scripts.includes(file) && process.platform !== 'win32') {
          await fs.access(absolute, constants.X_OK).catch(() => issues.push(`not executable: ${file}`));
        }
      } else {
        issues.push(`${forbidden.test(file) ? 'MCP file' : 'unexpected file or directory'}: ${file}`);
      }
    }
  }
  await visit();
  issues.push(...Array.from(expected, (file) => `missing ${file}`));
  if (issues.length) throw new Error(issues.join('; '));
}

async function doctor(project) {
  let failures = 0;
  async function check(label, remediation, verify) {
    try {
      const detail = await verify();
      console.log(`PASS ${label}${detail ? ` — ${detail}` : ''}`);
      return detail ?? true;
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${label} — ${error.message.split('\n', 1)[0]}\n  Fix: ${remediation}`);
      return null;
    }
  }

  await check('Node', 'Install Node.js 20 or newer, then rerun npm run skill:doctor.', () => {
    if (Number(process.versions.node.split('.')[0]) < 20) throw new Error(process.version);
    return process.version;
  });
  let bundle;
  await check('Source frontmatter, required files, versions, and MCP independence',
    'Restore the named source files from main (git restore -- <file>), or sync package metadata with npm install --package-lock-only.', async () => {
      bundle = await bundleFiles();
      return bundle.version;
    });
  if (bundle) {
    await check('Generated bundle', 'npm run skill:pack', () => verifyDirectory(dist, bundle, false));
  } else {
    console.log('SKIP bundle and installed integrity — repair source, then run npm run skill:pack');
  }

  const runtimes = new Set([path.resolve(root)]);
  const home = path.resolve(os.homedir());
  const targets = [
    [home, 'User', 'npm run skill:install:user'],
    [project, 'Project', `npm run skill:install:project -- "${project}"`]
  ];
  const seen = new Set();
  let userMismatch = false;
  for (const [target, label, fix] of targets) {
    const directory = path.join(target, '.agents', 'skills', name);
    if (seen.has(directory)) continue;
    seen.add(directory);
    const result = await check(`${label} install (${directory})`, fix, async () => {
      if (!(await stat(directory))) return 'absent (optional)';
      if (bundle) await verifyDirectory(directory, bundle, true);
      if (bundle) runtimes.add(directory);
      return bundle?.version ?? 'present (integrity skipped)';
    });
    if (label === 'User') userMismatch = !result;
    if (label === 'Project' && bundle && result === bundle.version && userMismatch) {
      console.log(`For this project, explicitly load ${path.join(directory, 'SKILL.md')} (UI Slop ${result}).`);
    }
  }

  const browsers = new Set();
  for (const directory of runtimes) {
    const repo = directory === path.resolve(root);
    const npmCommand = repo ? 'npm' : `npm --prefix "${directory}"`;
    const chromium = await check(`Playwright (${directory})`, `${npmCommand} ci --ignore-scripts`, () => {
      const require = createRequire(path.join(directory, 'package.json'));
      const actual = require('playwright/package.json').version;
      const expected = require('./package.json').dependencies.playwright;
      if (actual !== expected) throw new Error(`Expected ${expected}, found ${actual}`);
      const { chromium } = require('playwright');
      browsers.add(chromium);
      return actual;
    });
    if (!chromium) console.log('SKIP Chromium launch — restore Playwright first');
  }

  for (const chromium of browsers) {
    const executablePath = process.env.UI_SLOP_CHROMIUM_PATH || undefined;
    await check(`Chromium (${executablePath ?? 'Playwright-managed'})`,
      'From the checkout run npx playwright install chromium (use --with-deps chromium on Linux), or correct UI_SLOP_CHROMIUM_PATH.', async () => {
        const browser = await chromium.launch({
          executablePath,
          timeout: 15000
        });
        try {
          return browser.version();
        } finally {
          await browser.close();
        }
      });
  }
  console.log(failures ? `Doctor failed (${failures} checks).` : 'Doctor passed.');
  return failures ? 1 : 0;
}

const [command, target, ...extra] = process.argv.slice(2);
try {
  if (!['pack', 'install-user', 'install-project', 'doctor'].includes(command) ||
      extra.length || (target !== undefined && !['install-project', 'doctor'].includes(command))) {
    throw new Error('Usage: node tools/skill-package.mjs pack | install-user | install-project [project] | doctor [project]');
  }

  const invocation = process.env.INIT_CWD || process.cwd();
  const project = path.resolve(invocation, target ?? '.');
  if (command === 'doctor') {
    process.exitCode = await doctor(project);
  } else {
    const bundle = await bundleFiles();
    const installedPath = command === 'pack'
      ? await replaceDirectory(await ensureDirectory(root, 'dist'), bundle)
      : await install(command === 'install-user' ? os.homedir() : project, bundle);
    console.log(`UI Slop ${bundle.version} ${command === 'pack' ? 'packed' : 'installed'} at ${installedPath}`);
  }
} catch (error) {
  console.error(`UI Slop ${command ?? ''} failed: ${error.message}`);
  process.exitCode = 1;
}
