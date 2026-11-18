import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runEvidence, validateBundle } from '../tools/ui-slop.mjs';

async function withServer(html, fn) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type':'text/html; charset=utf-8'});
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  try {
    await fn('http://127.0.0.1:' + address.port + '/');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

const artifactRoot = process.env.UI_SLOP_TEST_ARTIFACT_DIR ? path.resolve(process.env.UI_SLOP_TEST_ARTIFACT_DIR) : null;

async function makeRunRoot(prefix) {
  if (!artifactRoot) return fs.mkdtemp(path.join(os.tmpdir(), prefix));
  const root = path.join(artifactRoot, prefix.replace(/-+$/,''));
  await fs.rm(root, {recursive:true, force:true});
  await fs.mkdir(root, {recursive:true});
  return root;
}

const goodHtml = '<!doctype html><html><head><style>' +
  'body{font:16px system-ui;margin:0;padding:24px}.panel{max-width:640px}.detail[hidden]{display:none}' +
  '@media(prefers-reduced-motion:no-preference){.detail{transition:opacity .15s}}' +
  '</style></head><body><main class="panel">' +
  '<h1>Queue</h1><button id="open">Inspect job</button><p id="saved">Not watched</p>' +
  '<section id="detail" class="detail" hidden><h2>Job 17</h2><button id="watch">Watch job</button><button id="close">Close detail</button></section>' +
  '<script>' +
  'const d=document.querySelector("#detail"),o=document.querySelector("#open"),w=document.querySelector("#watch"),c=document.querySelector("#close"),s=document.querySelector("#saved");' +
  'function sync(){s.textContent=localStorage.getItem("watched")==="yes"?"Watched":"Not watched"}sync();' +
  'o.onclick=()=>{d.hidden=false;history.pushState({detail:true},"","?detail=17")};' +
  'w.onclick=()=>{localStorage.setItem("watched","yes");sync()};' +
  'c.onclick=()=>{d.hidden=true;o.focus();history.back()};' +
  'addEventListener("popstate",()=>{d.hidden=true;o.focus()});' +
  '</script></main></body></html>';

const brokenHtml = '<!doctype html><html><head><style>body{margin:0;width:900px;font-size:11px}.x{font-size:11px}</style></head><body>' +
  '<button></button><button style="width:16px;height:16px">x</button>' +
  '<div class="x">ONE</div><div class="x">TWO</div><div class="x">THREE</div><div class="x">FOUR</div><div class="x">FIVE</div><div class="x">SIX</div><div class="x">SEVEN</div><div class="x">EIGHT</div>' +
  '<script>setTimeout(()=>{throw new Error("fixture boom")},0)</script></body></html>';

test('browser evidence captures workflow, persistence, reduced motion and validates checksums', async () => {
  await withServer(goodHtml, async (url) => {
    const out = await makeRunRoot('good-run-');
    const runDir = path.join(out,'run');
    const scenario = {
      id:'good-flow',
      requirements:[
        {id:'inspect',text:'User can inspect a job and return.'},
        {id:'persist',text:'Watch state survives reload.'}
      ],
      viewports:[
        {name:'desktop',width:1440,height:900},
        {name:'compact',width:900,height:700},
        {name:'mobile',width:390,height:844}
      ],
      mediaVariants:['normal','reduced'],
      keyboardWalk:{maxStops:12},
      steps:[
        {action:'click',locator:{role:'button',name:'Inspect job'},requirementId:'inspect'},
        {action:'assertUrl',contains:'detail=17',requirementId:'inspect'},
        {action:'click',locator:{role:'button',name:'Watch job'},requirementId:'persist'},
        {action:'assertStorage',storage:'localStorage',key:'watched',equals:'yes',requirementId:'persist'},
        {action:'back',requirementId:'inspect'},
        {action:'assertVisible',locator:{role:'button',name:'Inspect job'},requirementId:'inspect'},
        {action:'reload',requirementId:'persist'},
        {action:'assertText',locator:{selector:'#saved'},equals:'Watched',requirementId:'persist'},
        {action:'assertNoOverflow'}
      ]
    };
    const result = await runEvidence({url,scenario,outDir:runDir,briefText:'Keep job context and persisted watch state.'});
    assert.equal(result.findings.filter((f)=>f.classification==='hard_failure').length,0);
    assert.equal(result.findings.filter((f)=>f.classification==='blocked').length,0);
    assert.equal(result.runs.length,6);
    assert.deepEqual([...new Set(result.runs.map((r)=>r.viewport.name))].sort(),['compact','desktop','mobile']);
    const reducedRuns = result.runs.filter((r)=>r.media==='reduced');
    assert.equal(reducedRuns.length,3);
    assert.ok(reducedRuns.every((r)=>r.metrics.media.prefersReducedMotion===true));
    const validated = await validateBundle(runDir);
    assert.equal(validated.ok,true, validated.errors.join('\n'));

    const manifest = JSON.parse(await fs.readFile(path.join(runDir,'manifest.json'),'utf8'));
    assert.equal(manifest.schema_version,2);
    assert.equal(manifest.inputs.brief,'inputs/brief.txt');
    assert.deepEqual([...new Set(manifest.runs.map((r)=>r.viewport.name))].sort(),['compact','desktop','mobile']);

    await fs.appendFile(path.join(runDir,'inputs','brief.txt'),'tamper');
    const tampered = await validateBundle(runDir);
    assert.equal(tampered.ok,false);
    assert.match(tampered.errors.join(' '),/Checksum mismatch/);
  });
});

test('broken fixture produces objective failures without turning style metrics into blockers', async () => {
  await withServer(brokenHtml, async (url) => {
    const out = await makeRunRoot('broken-run-');
    const result = await runEvidence({
      url,
      outDir:path.join(out,'run'),
      scenario:{
        id:'broken',
        viewports:[{name:'mobile',width:390,height:844}],
        steps:[{action:'wait',ms:30}],
        keyboardWalk:false
      }
    });
    const hardIds = result.findings.filter((f)=>f.classification==='hard_failure').map((f)=>f.id);
    assert.ok(hardIds.includes('root-horizontal-overflow'));
    assert.ok(hardIds.includes('page-error'));
    assert.ok(hardIds.includes('unnamed-interactive'));
    assert.ok(result.findings.some((f)=>f.id==='microtype-heavy' && f.classification==='advisory'));
    assert.ok(result.findings.some((f)=>f.id==='uppercase-micro-label-recurrence' && f.classification==='advisory'));
  });
});
