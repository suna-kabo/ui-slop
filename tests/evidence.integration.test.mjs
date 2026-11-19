import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { TOOL_VERSION, runEvidence, validateBundle } from '../tools/ui-slop-v3.mjs';

async function withFixture(html, fn) {
  // Local file navigation exercises history and persistence on hosts that block loopback.
  // CI uses the default HTTP transport.
  if (process.env.UI_SLOP_TEST_FILE_FIXTURES === '1') {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-slop-file-'));
    try {
      const file = path.join(directory, 'index.html');
      await fs.writeFile(file, html);
      return await fn(pathToFileURL(file).href);
    } finally {
      await fs.rm(directory, { recursive: true, force: true });
    }
  }
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
  await fs.rm(root,{recursive:true,force:true});
  await fs.mkdir(root,{recursive:true});
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
  await withFixture(goodHtml, async (url) => {
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
    assert.equal(manifest.tool_version,TOOL_VERSION);
    assert.equal(manifest.inputs.brief,'inputs/brief.txt');
    assert.deepEqual([...new Set(manifest.runs.map((r)=>r.viewport.name))].sort(),['compact','desktop','mobile']);

    await fs.appendFile(path.join(runDir,'inputs','brief.txt'),'tamper');
    const tampered = await validateBundle(runDir);
    assert.equal(tampered.ok,false);
    assert.match(tampered.errors.join(' '),/Checksum mismatch/);
  });
});

test('broken fixture produces objective failures without turning style metrics into blockers', async () => {
  await withFixture(brokenHtml, async (url) => {
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

test('local HTML capture runs without a fixture server and records public provenance', async () => {
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-slop-html-'));
  try {
    const htmlPath = path.join(fixture, 'fixture.html');
    await fs.writeFile(htmlPath, '<!doctype html><html lang="en"><body><button onclick="this.nextElementSibling.hidden=false">Show status</button><p hidden>Ready</p></body></html>');
    const outDir = await makeRunRoot('local-html-');
    const result = await runEvidence({
      htmlPath,
      outDir,
      scenario: {
        id: 'local-html',
        requirements: [{ id: 'status', text: 'The status can be revealed.' }],
        viewports: [{ name: 'mobile', width: 390, height: 844 }],
        mediaVariants: ['reduced'],
        steps: [
          { action: 'click', locator: { role: 'button', name: 'Show status' }, requirementId: 'status' },
          { action: 'assertVisible', locator: { text: 'Ready' }, requirementId: 'status' },
          { action: 'assertNoOverflow' }
        ]
      }
    });
    assert.equal(result.runs.length, 1);
    assert.deepEqual(result.findings.filter((item) => ['blocked', 'hard_failure'].includes(item.classification)), []);
    const manifest = JSON.parse(await fs.readFile(path.join(outDir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.tool_version, TOOL_VERSION);
    assert.equal((await validateBundle(outDir)).ok, true);
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});

test('computed uppercase micro-labels surface as contextual advisories at captured states', async () => {
  const html = `<!doctype html><html lang="en"><style>
    body { font: 16px system-ui; }
    .micro { font: 600 10px monospace; letter-spacing: 1px; text-transform: uppercase; }
    h1 { margin: 4px 0; }
  </style><main>
    <header><a id="eyebrow" class="micro" href="#collection">Field collection</a><h1>Field notes</h1></header>
    <p id="collection"><span class="micro">Field collection</span> holds the field team's annotated specimens.</p>
    <output id="status" class="micro" role="status">READY</output>
    <div style="opacity:0"><span id="hidden" class="micro">Hidden label</span></div>
    <span id="lowercase" class="micro" style="text-transform:lowercase">LOWERED LABEL</span>
    <button id="open" onclick="document.querySelector('#detail').hidden=false">Open detail</button>
    <button id="close" onclick="document.querySelector('#detail').hidden=true">Close detail</button>
    <section id="detail" hidden><span id="detail-label" class="micro">Detail collection</span><h2>Specimen detail</h2></section>
  </main></html>`;
  await withFixture(html, async (url) => {
    const out = await makeRunRoot('computed-labels-');
    const { findings, runs } = await runEvidence({
      url,
      outDir: path.join(out, 'run'),
      scenario: {
        id: 'computed-labels',
        viewports: [{ name: 'mobile', width: 390, height: 844 }],
        steps: [
          { action: 'click', locator: { selector: '#open' }, capture: true, label: 'focused-detail' },
          { action: 'click', locator: { selector: '#close' } }
        ]
      }
    });
    assert.equal(runs.length, 1);
    assert.deepEqual(findings.filter((item) => ['blocked', 'hard_failure'].includes(item.classification)), []);
    const candidates = findings.filter((item) => item.id === 'rendered-micro-label-candidates');
    assert.deepEqual(candidates.map((item) => item.evidence.state), ['initial', 'focused-detail', 'final']);
    assert.ok(candidates.every((item) => item.classification === 'advisory' && item.viewport === 'mobile'));

    const initial = candidates[0].evidence;
    assert.deepEqual(initial.viewport, { width: 390, height: 844 });
    const eyebrow = initial.candidates.find((item) => item.selector === '#eyebrow');
    assert.equal(eyebrow.text, 'Field collection');
    assert.equal(eyebrow.renderedText, 'FIELD COLLECTION');
    assert.equal(eyebrow.textTransform, 'uppercase');
    assert.equal(eyebrow.size, 10);
    assert.equal(eyebrow.fontFamily, 'monospace');
    assert.equal(eyebrow.fontWeight, '600');
    assert.equal(eyebrow.letterSpacing, '1px');
    assert.equal(eyebrow.repeatedCount, 2);
    assert.equal(eyebrow.nearbyHeading.position, 'before');
    assert.ok(eyebrow.box.width > 0 && eyebrow.box.height > 0);
    assert.equal(eyebrow.role, 'link');
    assert.equal(eyebrow.interactive, true);
    assert.ok(initial.candidates.some((item) => item.selector === '#status' && item.role === 'status'));
    assert.ok(!initial.candidates.some((item) => ['#hidden', '#lowercase'].includes(item.selector)));
    assert.ok(candidates[1].evidence.candidates.some((item) => item.selector === '#detail-label'));
    assert.ok(!candidates[2].evidence.candidates.some((item) => item.selector === '#detail-label'));
  });
});
