import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { TOOL_VERSION, evaluateEvidence, inspectProject, summarizeFindings, validateScenario } from '../tools/ui-slop.mjs';

test('version is release candidate', () => {
  assert.equal(TOOL_VERSION, '2.0.0-rc.1');
});

test('scenario contract validates requirements and focused workflow', () => {
  assert.equal(validateScenario({
    id:'x',
    requirements:[{id:'r1',text:'Keyboard path works'}],
    steps:[{action:'press',key:'Tab',requirementId:'r1'},{action:'assertNoOverflow'}]
  }), true);
  assert.throws(() => validateScenario({ id:'x', steps:[{action:'invent'}] }), /Unsupported action/);
  assert.throws(() => validateScenario({ id:'x', steps:[{action:'click'}] }), /requires locator/);
  assert.throws(() => validateScenario({ id:'x', steps:[{action:'assertText',locator:{text:'x'}}] }), /requires equals or contains/);
  assert.throws(() => validateScenario({ id:'x', requirements:[{id:'r',text:'x'}], steps:[{action:'press',key:'Tab',requirementId:'missing'}] }), /Unknown requirementId/);
});

test('detector separates objective failures from aesthetic advisory and neutral evidence', () => {
  const findings = evaluateEvidence({
    metrics:{
      document:{scrollWidth:500,clientWidth:390},
      typography:{visibleChars:100,charsLe12:90,charsGe15:0,pctLe12:.9,pctGe15:0,uppercaseMicroLabels:9,samples:[]},
      interactives:[{width:16,height:16}],
      animationInventory:[]
    },
    accessibility:{blocked:false,method:'test',items:[]},
    runtimeErrors:[],consoleErrors:[],scenarioFailures:[],allowHorizontalScroll:false
  });
  const summary = summarizeFindings(findings);
  assert.equal(summary.hard_failure, 1);
  assert.ok(summary.advisory >= 3);
  assert.ok(summary.evidence_only >= 3);
});

test('unnamed visible interactive is hard while unavailable inventory is blocked', () => {
  const hard = evaluateEvidence({
    metrics:null,
    accessibility:{blocked:false,method:'test',items:[{role:'button',name:'',disabled:false,nativeInteractive:true}]}
  });
  assert.equal(hard[0].classification, 'hard_failure');

  const blocked = evaluateEvidence({
    metrics:null,
    accessibility:{blocked:true,reason:'not available',items:[]}
  });
  assert.equal(blocked[0].classification, 'blocked');
});

test('scenario assertion failure carries requirement id', () => {
  const findings = evaluateEvidence({
    metrics:null,
    accessibility:{blocked:false,method:'test',items:[]},
    scenarioFailures:[{step:2,requirementId:'save',message:'failed'}]
  });
  assert.equal(findings[0].classification, 'hard_failure');
  assert.equal(findings[0].requirement_id, 'save');
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
