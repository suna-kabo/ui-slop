import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = (file) => fs.readFile(new URL('../' + file, import.meta.url), 'utf8');

test('substantial work gates full build and completion on recorded stage outcomes', async () => {
  const skill = await read('SKILL.md');
  const stages = [...skill.matchAll(/^## Stage (\d) — (.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(stages, ['1', '2', '3', '4', '5']);
  assert.match(skill, /Experience Brief[\s\S]*problem review[\s\S]*Advance on PASS/);
  assert.match(skill, /three to five product-specific principles[\s\S]*calibration notes/);
  assert.match(skill, /runnable vertical slice[\s\S]*artifact path or URL[\s\S]*SELECT \/ REVISE \/ REJECT[\s\S]*Only SELECT unlocks the full build/);
  assert.match(skill, /passing problem review, selected proof, ready implementation review, Evidence Gate PASS, and Quality Gate READY/);
  const template = await read('examples/review-record.template.md');
  for (const field of ['Calibration notes', 'Runnable concept-proof', '| Problem', '| Solution', '| Implementation',
    'Evidence Gate', 'Quality Gate', 'hard failures, quality vetoes, advisories, and blocked checks']) {
    assert.ok(template.includes(field), field);
  }
});

test('both gates require evidence and readiness remains qualitative', async () => {
  const skill = await read('SKILL.md');
  const quality = await read('references/quality-bar.md');
  assert.match(skill, /Evidence Gate.*PASS, FAIL, or BLOCKED against executed evidence/);
  assert.match(skill, /Quality Gate.*READY, NOT_READY, or BLOCKED with specific observations.*qualitative judgment/);
  for (const term of ['concrete observations', 'operated primary flow', 'first-impression', 'weakest visible region',
    'observed material veto', 'user or product harm', 'could not be assessed', 'Ten-second veto']) {
    assert.ok(quality.includes(term), term);
  }
  assert.match(skill, /The product contract is protected, the core experience is proven, and no material part of the primary experience feels obviously wrong\./);
});

test('mandatory supporting-copy rules cover all layers, rendered states and restoration grounds', async () => {
  const skill = await read('SKILL.md');
  const quality = await read('references/quality-bar.md');
  assert.match(skill, /mandatory \*\*supporting-copy subtraction pass\*\* in `references\/quality-bar\.md` on the first useful viewport, primary detail or focused state, and a compact or mobile state/);
  const section = quality.split('## Mandatory supporting-copy subtraction')[1]?.split('\n## ')[0];
  assert.ok(section);
  const concepts = [
    'Secondary labels are not default layers', 'Descriptions must supply unique information',
    'first useful viewport', 'primary detail or focused state', 'compact or mobile state', 'temporarily hide',
    'eyebrow text', 'kickers', 'overlines', 'section numbers', 'figure labels', 'captions',
    'category/type/mode labels', 'repeated subtitles', 'helper descriptions', 'duplicated metadata',
    'Collapse descriptor stacks', 'tiny uppercase or monospace', 'premium, editorial, archival, or technical authenticity',
    'Restore copy only if', 'genuine ambiguity', 'hides state', 'weakens a decision', 'necessary provenance',
    'increases error risk', 'meaningfully hurts action discovery', 'There is no universal ban',
    'Navigation, live state, action, risk, genuine disambiguation, provenance, scope, units, and constraints'
  ];
  for (const concept of concepts) assert.ok(section.includes(concept), concept);
  for (const reference of ['craft-floor', 'browser-qa', 'review-protocol']) {
    assert.match(await read(`references/${reference}.md`), /mandatory supporting-copy subtraction pass in `quality-bar\.md`/);
  }
});

test('workflow expresses interaction logic without fixed motion recipes', async () => {
  const skill = await read('SKILL.md');
  assert.match(skill, /Motion can express interaction logic\. The workflow must make sense without it/);
  assert.doesNotMatch(skill, /cubic-bezier\(|scale\(0\.\d+|\b\d+ms\b/i);
});
