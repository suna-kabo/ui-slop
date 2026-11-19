import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('SKILL frontmatter and reference links are valid', async () => {
  const skill = await fs.readFile(path.join(root,'SKILL.md'),'utf8');
  assert.match(skill,/^---\r?\nname: ui-slop\r?\ndescription:/);
  const refs = [...skill.matchAll(/`(references\/[^`]+\.md)`/g)].map((m)=>m[1]);
  assert.ok(refs.length >= 10);
  for (const ref of new Set(refs)) await fs.access(path.join(root,ref));
});

test('v3 core sequence is explicit and ordered', async () => {
  const skill = await fs.readFile(path.join(root,'SKILL.md'),'utf8');
  const stages = [
    'Stage 1 — Shape the outcome',
    'Stage 2 — Set product principles and calibration',
    'Stage 3 — Prove the core experience',
    'Stage 4 — Build foundation plus signature',
    'Stage 5 — Review problem, solution, and implementation'
  ];
  let previous = -1;
  for (const stage of stages) {
    const index = skill.indexOf(stage);
    assert.ok(index > previous, `missing or out-of-order stage: ${stage}`);
    previous = index;
  }
});

test('v3 core blocks concept rescue by polish and defines positive readiness', async () => {
  const skill = await fs.readFile(path.join(root,'SKILL.md'),'utf8');
  assert.match(skill,/reshape or discard/i);
  assert.match(skill,/Evidence Gate passes/i);
  assert.match(skill,/Quality Gate is ready/i);
  assert.match(skill,/nothing feels obviously wrong/i);
  assert.match(skill,/first-impression veto/i);
  assert.match(skill,/weakest-link veto/i);
});

test('mandatory v3 operating references exist', async () => {
  const required = [
    'shaping.md',
    'product-principles.md',
    'reference-calibration.md',
    'concept-proof.md',
    'review-stages.md',
    'quality-bar.md'
  ];
  for (const file of required) await fs.access(path.join(root,'references',file));
});

test('module map points only to existing markdown references', async () => {
  const map = await fs.readFile(path.join(root,'references','module-map.md'),'utf8');
  const refs = [...map.matchAll(/`([a-z0-9-]+\.md)`/gi)].map((m)=>m[1]).filter((file)=>file.toLowerCase() !== 'skill.md');
  assert.ok(refs.length >= 20);
  for (const file of new Set(refs)) await fs.access(path.join(root,'references',file));
  assert.match(map,/core sequence is mandatory/i);
});

test('quality bar covers attention, material, behavior, platform, and weakest-link quality', async () => {
  const quality = (await fs.readFile(path.join(root,'references','quality-bar.md'),'utf8')).toLowerCase();
  for (const term of ['attention','visual material','interaction response','continuity','motion','responsive and platform fit','performance perception','weakest-link','ten-second veto']) {
    assert.match(quality,new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  }
});

test('runtime router does not introduce fixed motion recipes', async () => {
  const skill = (await fs.readFile(path.join(root,'SKILL.md'),'utf8')).toLowerCase();
  assert.doesNotMatch(skill,/\b\d{2,4}\s*ms\b/);
  assert.doesNotMatch(skill,/scale\(0\.\d+/);
  assert.match(skill,/not a fixed motion system/);
});
