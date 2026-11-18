import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { evaluateEvidence, inspectProject, summarizeFindings, validateScenario } from '../tools/ui-slop.mjs';

test('scenario contract accepts focused workflow and rejects unknown action', () => {
  assert.equal(validateScenario({ id:'x', steps:[{action:'press', key:'Tab'}] }), true);
  assert.throws(() => validateScenario({ id:'x', steps:[{action:'invent'}] }), /Unsupported action/);
  assert.throws(() => validateScenario({ id:'x', steps:[{action:'click'}] }), /requires locator/);
});

test('detector separates objective failure from aesthetic advisory', () => {
  const findings = evaluateEvidence({
    metrics:{
      document:{scrollWidth:500,clientWidth:390},
      typography:{visibleChars:100,charsLe12:90,charsGe15:0,pctLe12:.9,pctGe15:0,uppercaseMicroLabels:9,samples:[]},
      interactives:[],animationInventory:[]
    },
    aria:[],runtimeErrors:[],consoleErrors:[],scenarioFailures:[],allowHorizontalScroll:false
  });
  const summary = summarizeFindings(findings);
  assert.equal(summary.hard_failure, 1);
  assert.ok(summary.advisory >= 2);
  assert.ok(summary.evidence_only >= 2);
});

test('scenario assertion failure is hard', () => {
  const findings = evaluateEvidence({metrics:null,aria:[],runtimeErrors:[],consoleErrors:[],scenarioFailures:[{step:2,message:'failed'}]});
  assert.equal(findings[0].classification, 'hard_failure');
});

test('project inspection reports source evidence without choosing design', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-slop-context-'));
  await fs.writeFile(path.join(root,'package.json'), JSON.stringify({dependencies:{react:'1','framer-motion':'1'},scripts:{dev:'vite'}}));
  await fs.mkdir(path.join(root,'src','pages'),{recursive:true});
  await fs.writeFile(path.join(root,'src','pages','home.tsx'),'export default null');
  const report = await inspectProject(root);
  assert.ok(report.framework_stack.value.includes('react'));
  assert.ok(report.motion_libraries.value.includes('framer-motion'));
  assert.ok(report.route_candidates.value.includes('src/pages/home.tsx'));
  assert.match(report.limitations.join(' '), /automatically a design requirement/);
});
