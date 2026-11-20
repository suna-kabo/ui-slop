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

test('supporting-copy review requires recomposition and operation in the affected states', async () => {
  const skill = await read('SKILL.md');
  const quality = await read('references/quality-bar.md');
  assert.match(skill, /mandatory \*\*supporting-copy subtraction pass\*\* in `references\/quality-bar\.md`/);
  const section = quality.split('## Mandatory supporting-copy subtraction')[1]?.split('\n## ')[0];
  assert.ok(section);
  const concepts = [
    'first useful viewport', 'primary detail or focused state', 'compact or mobile state',
    'Collapse any wrapper', 'same viewport size', 'operate the affected task',
    'accessible names', 'live feedback', 'safety', 'provenance', 'units', 'decision context'
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

test('making a category eyebrow clickable cannot satisfy the burden for keeping it prominent', async () => {
  const quality = await read('references/quality-bar.md');
  const subtraction = quality.split('## Mandatory supporting-copy subtraction')[1].split('\n## ')[0];
  assert.match(subtraction, /Clickability alone is insufficient/);
  assert.match(subtraction, /secondary information or actions work in the title, a conventional control, nearby state, or on demand/);
  assert.match(subtraction, /Restore visible copy or prominence when the operated comparison exposes lost meaning, discoverability, or protection/);
});

test('a generic crop toggle cannot establish a signature claim and continuity is judged in use', async () => {
  const proof = await read('references/concept-proof.md');
  assert.match(proof, /A signature experience is optional/);
  assert.match(proof, /domain truth[\s\S]*user capability[\s\S]*conventional treatment is insufficient[\s\S]*distinct observable behavior the reviewer operated/);
  assert.match(proof, /gallery, modal, carousel, tab switch, crop toggle, or decorative animation does not qualify on its own/);
  assert.match(proof, /slice does not demonstrate it, revise or reject before SELECT/);
  assert.match(await read('references/review-stages.md'), /did the operated proof establish the domain benefit under `concept-proof\.md`/);
  const quality = await read('references/quality-bar.md');
  assert.match(quality, /Functional state change is not automatically sufficient behavioral quality/);
  assert.match(quality, /Record whether special continuity is warranted and what the operated result shows[\s\S]*Ordinary immediate behavior can be right[\s\S]*Animation is optional/);
  assert.match(quality, /Operate the compact or mobile flow separately[\s\S]*watching the layout reflow cannot establish adaptation/);
});

test('READY without an independent reviewer requires an adversarial rendered review', async () => {
  const skill = await read('SKILL.md');
  assert.match(skill, /Use `references\/review-protocol\.md` for the review mode/);
  const protocol = await read('references/review-protocol.md');
  assert.match(protocol, /\*\*INDEPENDENT_REVIEW\*\* when a separate reviewer inspects[\s\S]*Otherwise record \*\*SELF_REVIEW\*\* and complete the adversarial pass below before declaring Quality Gate READY/);
  const adversarial = protocol.split('## Adversarial self-review')[1].split('\n## ')[0];
  for (const requirement of ['rendered and operated states before revisiting implementation rationale',
    'first-impression problems', 'reasons the result should be NOT_READY', 'weakest visible region directly',
    'supporting-copy candidates', 'response and continuity', 'mobile adaptation separately', 'operate any claimed signature experience']) {
    assert.ok(adversarial.includes(requirement), requirement);
  }
  assert.match(adversarial, /strongest plausible veto[\s\S]*mark NOT_READY[\s\S]*rebut it with concrete rendered or operated evidence/);
  assert.match(adversarial, /Unresolved material uncertainty bars READY\. Mark BLOCKED when required observations are unavailable/);
  assert.match(await read('examples/review-record.template.md'), /SELF_REVIEW only\. Strongest plausible veto, accepted or rebutted, with concrete evidence/);
  const quality = await read('references/quality-bar.md');
  assert.match(quality, /first useful viewport separately on desktop and mobile before considering the implementation rationale/);
  assert.match(quality, /An unresolved material finding blocks READY/);
  const evidence = await read('references/evidence-gate.md');
  assert.match(evidence, /Evidence proves that an observed state exists and was exercised\. It does not prove that the state is well designed/);
  assert.match(evidence, /Disclose unavailable required evidence and mark the gate BLOCKED/);
});
