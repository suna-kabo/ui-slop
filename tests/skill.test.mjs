import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);

test('SKILL frontmatter and reference links are valid', async () => {
  const skill = await fs.readFile(path.join(root,'SKILL.md'),'utf8');
  assert.match(skill,/^---\nname: ui-slop\ndescription:/);
  const refs = [...skill.matchAll(/\x60(references\/[^\x60]+\.md)\x60/g)].map((m)=>m[1]);
  assert.ok(refs.length >= 10);
  for (const ref of new Set(refs)) await fs.access(path.join(root,ref));
});

test('module map points only to existing markdown references', async () => {
  const map = await fs.readFile(path.join(root,'references','module-map.md'),'utf8');
  const refs = [...map.matchAll(/\x60?([a-z0-9-]+\.md)\x60?/gi)].map((m)=>m[1]);
  for (const file of new Set(refs)) await fs.access(path.join(root,'references',file));
});

test('runtime router does not reintroduce fixed motion recipes', async () => {
  const skill = (await fs.readFile(path.join(root,'SKILL.md'),'utf8')).toLowerCase();
  assert.doesNotMatch(skill,/\b\d{2,4}\s*ms\b/);
  assert.doesNotMatch(skill,/scale\(0\.\d+/);
  assert.match(skill,/not universal spring, timing, scale, easing/);
});
