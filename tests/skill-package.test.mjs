import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const fromRoot = (file) => new URL('../' + file, import.meta.url);
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));

test('pack, install and doctor operate on isolated paths and report actionable failures', async (t) => {
  const temp = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'ui slop test ')));
  t.after(() => fs.rm(temp, { recursive: true, force: true }));
  const checkout = path.join(temp, 'source #1');
  const home = path.join(temp, 'home with spaces');
  const project = path.join(temp, 'project 雪 #2');
  const destination = (target) => path.join(target, '.agents', 'skills', 'ui-slop');
  const dist = path.join(checkout, 'dist', 'ui-slop');
  await Promise.all([checkout, home, project].map((directory) => fs.mkdir(directory)));
  for (const source of ['SKILL.md', 'LICENSE', 'package.json', 'package-lock.json', 'examples', 'references', 'tools']) {
    await fs.cp(fromRoot(source), path.join(checkout, source), { recursive: true });
  }
  const run = (...args) => {
    const result = spawnSync(process.execPath, [path.join(checkout, 'tools', 'skill-package.mjs'), ...args], {
      cwd: checkout,
      env: { ...process.env, HOME: home, USERPROFILE: home, INIT_CWD: project },
      encoding: 'utf8',
      timeout: 20000
    });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  };
  function pass(...args) {
    const result = run(...args);
    assert.equal(result.status, 0, result.output);
    return result.output;
  }
  function fail(pattern, ...args) {
    const result = run(...args);
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, pattern);
    return result.output;
  }

  pass('pack');
  const manifestPath = path.join(dist, 'skill-manifest.json');
  const manifest = await readJson(manifestPath);
  const { version } = await readJson(fromRoot('package.json'));
  assert.equal(manifest.version, version);
  assert.equal(manifest.sourceDigest, createHash('sha256').update(JSON.stringify(manifest.files, null, 2) + '\n').digest('hex'));
  for (const [file, hash] of Object.entries(manifest.files)) {
    assert.equal(createHash('sha256').update(await fs.readFile(path.join(dist, file))).digest('hex'), hash);
  }
  assert.deepEqual((await fs.readdir(dist)).sort(), ['LICENSE', 'SKILL.md', 'examples', 'package-lock.json', 'package.json', 'references', 'skill-manifest.json', 'tools']);
  assert.deepEqual((await fs.readdir(path.join(dist, 'tools'))).sort(), ['ui-slop-v3.mjs', 'ui-slop.mjs']);
  const wrongPlaywright = path.join(checkout, 'node_modules', 'playwright');
  await fs.mkdir(wrongPlaywright, { recursive: true });
  await fs.writeFile(path.join(wrongPlaywright, 'package.json'), '{"name":"playwright","version":"0.0.0"}');
  const stale = path.join(dist, 'stale.txt');
  await fs.writeFile(stale, 'stale');
  const doctor = fail(/unexpected file or directory: stale\.txt/, 'doctor');
  assert.match(doctor, /Fix: npm run skill:pack/);
  assert.match(doctor, /FAIL Playwright[\s\S]*Fix: npm ci --ignore-scripts/);
  assert.equal(await fs.readFile(stale, 'utf8'), 'stale');
  const original = await fs.readFile(path.join(checkout, 'SKILL.md'), 'utf8');
  await fs.writeFile(path.join(checkout, 'SKILL.md'), original.replace(/\r?\n/g, '\r\n'));
  pass('pack');
  assert.deepEqual(await readJson(manifestPath), manifest);
  await assert.rejects(fs.access(stale), { code: 'ENOENT' });

  const other = path.join(home, '.agents', 'skills', 'other-skill');
  await fs.mkdir(other, { recursive: true });
  await fs.writeFile(path.join(other, 'SKILL.md'), 'other');
  await fs.writeFile(path.join(home, '.agents', '.mcp.json'), '{}');
  const userOutput = pass('install-user');
  assert.ok(userOutput.includes(destination(home)), userOutput + ' expected ' + destination(home));
  assert.ok(pass('install-project').includes(destination(project)));
  const explicit = path.join(temp, 'explicit % target');
  await fs.mkdir(explicit);
  assert.ok(pass('install-project', path.relative(project, explicit)).includes(destination(explicit)));
  for (const location of [home, project, explicit]) {
    assert.deepEqual(await readJson(path.join(destination(location), 'skill-manifest.json')), manifest);
    const versionResult = spawnSync(process.execPath, [path.join(destination(location), 'tools', 'ui-slop-v3.mjs'), '--version'], { encoding: 'utf8' });
    assert.equal(versionResult.status, 0, versionResult.stderr);
    assert.equal(versionResult.stdout.trim(), version);
  }
  const injected = path.join(destination(project), '.mcp.json');
  await fs.writeFile(injected, '{}');
  const broken = fail(/MCP file: \.mcp\.json/, 'doctor');
  assert.match(broken, /Fix: npm run skill:install:project/);
  assert.match(broken, /PASS User install/);
  assert.equal(await fs.readFile(injected, 'utf8'), '{}');
  pass('install-project');
  await assert.rejects(fs.access(injected), { code: 'ENOENT' });
  assert.equal(await fs.readFile(path.join(other, 'SKILL.md'), 'utf8'), 'other');
  assert.equal(await fs.readFile(path.join(home, '.agents', '.mcp.json'), 'utf8'), '{}');

  const userManifest = path.join(destination(home), 'skill-manifest.json');
  await fs.writeFile(userManifest, JSON.stringify({ ...manifest, version: '3.0.1' }));
  const conflict = fail(/FAIL User install/, 'doctor');
  assert.match(conflict, /PASS Project install/);
  assert.ok(conflict.includes(`explicitly load ${path.join(destination(project), 'SKILL.md')} (UI Slop ${version})`));
  assert.equal((await readJson(userManifest)).version, '3.0.1');

  const reference = path.join(checkout, 'references', 'quality-bar.md');
  await fs.rename(reference, reference + '.saved');
  fail(/Required source file.*quality-bar\.md/, 'pack');
  assert.deepEqual(await readJson(manifestPath), manifest);
  await fs.rename(reference + '.saved', reference);
  await fs.appendFile(reference, '\n`missing-runtime-reference.md`\n');
  fail(/Required source file.*missing-runtime-reference\.md/, 'pack');
  await fs.writeFile(reference, await fs.readFile(fromRoot('references/quality-bar.md')));
  await fs.appendFile(reference, '\nmcpServers\n');
  fail(/MCP configuration found in references\/quality-bar.md/, 'pack');
  await fs.writeFile(reference, await fs.readFile(fromRoot('references/quality-bar.md')));
  const lockPath = path.join(checkout, 'package-lock.json');
  const lock = await readJson(lockPath);
  await fs.writeFile(lockPath, JSON.stringify({ ...lock, version: '3.99.0' }));
  fail(/package-lock.json is out of sync/, 'doctor');
  await fs.writeFile(lockPath, JSON.stringify(lock));
  await fs.writeFile(path.join(checkout, 'SKILL.md'), original.replace('name: ui-slop', 'name: other'));
  fail(/SKILL.md requires name: ui-slop/, 'doctor');
});
