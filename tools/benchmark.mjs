#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const BENCHMARK_SCHEMA_VERSION = 1;

function canonical(v) {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonical(v[k])]));
  return v;
}
function stable(v) { return JSON.stringify(canonical(v)); }
function hash(v) { return crypto.createHash('sha256').update(v).digest('hex'); }
async function hashFile(file) { return crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'); }
async function exists(file) { try { await fs.access(file); return true; } catch { return false; } }
async function readJson(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), {recursive:true});
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}
function needString(v, label) {
  if (typeof v !== 'string' || !v.trim()) throw new Error(label + ' must be a non-empty string.');
}
function unique(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item !== 'object') throw new Error(label + ' entries must be objects.');
    needString(item.id, label + ' id');
    if (seen.has(item.id)) throw new Error('Duplicate ' + label + ' id: ' + item.id);
    seen.add(item.id);
  }
}
function shuffled(items, seed) {
  return [...items].sort((a,b) => {
    const av = hash(seed + '\0' + a.artifact_id).slice(0,12);
    const bv = hash(seed + '\0' + b.artifact_id).slice(0,12);
    return av === bv ? a.artifact_id.localeCompare(b.artifact_id) : av.localeCompare(bv);
  });
}

export function validateBenchmarkConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Benchmark config must be an object.');
  if (config.schema_version !== BENCHMARK_SCHEMA_VERSION) throw new Error('Benchmark config schema_version must be 1.');
  needString(config.id, 'Benchmark id');
  needString(config.randomization_seed, 'randomization_seed');
  if (!Number.isInteger(config.runs_per_condition) || config.runs_per_condition < 2 || config.runs_per_condition > 50) {
    throw new Error('runs_per_condition must be an integer between 2 and 50.');
  }
  if (!Array.isArray(config.conditions) || config.conditions.length < 2) throw new Error('conditions must contain at least two entries.');
  if (!Array.isArray(config.tasks) || config.tasks.length < 2) throw new Error('tasks must contain at least two entries.');
  unique(config.conditions, 'condition');
  unique(config.tasks, 'task');

  for (const c of config.conditions) {
    needString(c.label, 'condition ' + c.id + ' label');
    if (c.instructions_ref !== undefined && c.instructions_ref !== null) needString(c.instructions_ref, 'condition ' + c.id + ' instructions_ref');
    if (c.tool_policy !== undefined) needString(c.tool_policy, 'condition ' + c.id + ' tool_policy');
  }
  for (const t of config.tasks) {
    needString(t.brief, 'task ' + t.id + ' brief');
    if (t.fixture !== undefined && t.fixture !== null) needString(t.fixture, 'task ' + t.id + ' fixture');
  }
  if (!config.model_contract || typeof config.model_contract !== 'object') throw new Error('model_contract is required.');
  needString(config.model_contract.model, 'model_contract.model');
  needString(config.model_contract.thinking, 'model_contract.thinking');
  needString(config.model_contract.execution_budget, 'model_contract.execution_budget');

  if (config.reviewers_per_artifact !== undefined &&
      (!Number.isInteger(config.reviewers_per_artifact) || config.reviewers_per_artifact < 1 || config.reviewers_per_artifact > 20)) {
    throw new Error('reviewers_per_artifact must be an integer between 1 and 20.');
  }
  const metrics = config.metrics || ['task_continuity','product_specificity','interaction_quality','information_design','technical_quality'];
  if (!Array.isArray(metrics) || !metrics.length ||
      metrics.some((x) => typeof x !== 'string' || !x.trim()) ||
      new Set(metrics).size !== metrics.length) {
    throw new Error('metrics must be a non-empty unique string array.');
  }
  return true;
}

export function buildBenchmarkPlan(config, frozenInputs = {}) {
  validateBenchmarkConfig(config);
  const metrics = config.metrics || ['task_continuity','product_specificity','interaction_quality','information_design','technical_quality'];
  const modelHash = hash(stable(config.model_contract));
  const key = [];

  for (const task of config.tasks) {
    for (const condition of config.conditions) {
      for (let run = 1; run <= config.runs_per_condition; run += 1) {
        const seed = hash(config.randomization_seed + '\0' + task.id + '\0' + condition.id + '\0' + run).slice(0,16);
        const artifact = 'artifact-' + hash(config.id + '\0' + task.id + '\0' + condition.id + '\0' + run + '\0' + seed).slice(0,16);
        const conditionContractHash = hash(stable({
          condition_id: condition.id,
          label: condition.label,
          instructions_ref: condition.instructions_ref || null,
          tool_policy: condition.tool_policy || null
        }));
        key.push({
          artifact_id:artifact,
          task_id:task.id,
          condition_id:condition.id,
          run_index:run,
          generation_seed:seed,
          model_contract_hash:modelHash,
          condition_contract_hash:conditionContractHash,
          expected_input_hash:frozenInputs[task.id] ? frozenInputs[task.id].input_hash : null
        });
      }
    }
  }

  const requests = key.map((item) => {
    const condition = config.conditions.find((x) => x.id === item.condition_id);
    const task = config.tasks.find((x) => x.id === item.task_id);
    const frozen = frozenInputs[task.id] || {};
    const request = {
      schema_version:1,
      benchmark_id:config.id,
      artifact_id:item.artifact_id,
      task_id:item.task_id,
      condition_id:item.condition_id,
      condition_label:condition.label,
      instructions_ref:condition.instructions_ref || null,
      tool_policy:condition.tool_policy || null,
      brief:frozen.brief_path || task.brief,
      fixture:frozen.fixture_path || task.fixture || null,
      run_index:item.run_index,
      generation_seed:item.generation_seed,
      model_contract:config.model_contract,
      model_contract_hash:modelHash,
      condition_contract_hash:item.condition_contract_hash,
      input_hash:item.expected_input_hash
    };
    request.request_hash = hash(stable(request));
    return request;
  });

  return {
    schema_version:1,
    benchmark_id:config.id,
    artifact_count:key.length,
    model_contract_hash:modelHash,
    reviewers_per_artifact:config.reviewers_per_artifact || 2,
    metrics,
    public:{
      blind_queue:shuffled(key.map((x) => ({
        artifact_id:x.artifact_id,
        task_id:x.task_id,
        run_index:x.run_index
      })), config.randomization_seed),
      review_template:{
        schema_version:1,
        benchmark_id:config.id,
        reviewer_id:'<reviewer-id>',
        reviewer_role:'independent',
        artifact_id:'<artifact-id>',
        requirement_outcomes:[],
        scores:Object.fromEntries(metrics.map((m) => [m,null])),
        material_issues:[],
        notes:''
      }
    },
    private:{condition_key:key,generation_requests:requests}
  };
}

export async function prepareBenchmark(config, outDir, options = {}) {
  validateBenchmarkConfig(config);
  const baseDir = options.baseDir || process.cwd();
  await fs.mkdir(outDir, {recursive:true});
  const frozen = {};

  for (const task of config.tasks) {
    const briefSource = path.resolve(baseDir, task.brief);
    if (!(await exists(briefSource))) throw new Error('Task ' + task.id + ' brief does not exist: ' + task.brief);
    const dir = path.join(outDir, 'inputs', task.id);
    await fs.mkdir(dir, {recursive:true});
    const briefTarget = path.join(dir, 'brief' + (path.extname(task.brief) || '.txt'));
    await fs.copyFile(briefSource, briefTarget);

    let fixtureTarget = null;
    if (task.fixture) {
      const fixtureSource = path.resolve(baseDir, task.fixture);
      if (!(await exists(fixtureSource))) throw new Error('Task ' + task.id + ' fixture does not exist: ' + task.fixture);
      fixtureTarget = path.join(dir, 'fixture' + (path.extname(task.fixture) || '.json'));
      await fs.copyFile(fixtureSource, fixtureTarget);
    }

    const briefSha = await hashFile(briefTarget);
    const fixtureSha = fixtureTarget ? await hashFile(fixtureTarget) : null;
    frozen[task.id] = {
      brief_path:path.relative(outDir, briefTarget).replaceAll('\\','/'),
      brief_sha256:briefSha,
      fixture_path:fixtureTarget ? path.relative(outDir, fixtureTarget).replaceAll('\\','/') : null,
      fixture_sha256:fixtureSha,
      input_hash:hash(stable({brief_sha256:briefSha,fixture_sha256:fixtureSha}))
    };
  }

  const plan = buildBenchmarkPlan(config, frozen);
  await writeJson(path.join(outDir,'benchmark-config.json'), config);
  await writeJson(path.join(outDir,'input-lock.json'), {schema_version:1,benchmark_id:config.id,tasks:frozen});
  await writeJson(path.join(outDir,'blind-review-queue.json'), {
    schema_version:1,
    benchmark_id:config.id,
    artifact_count:plan.artifact_count,
    reviewers_per_artifact:plan.reviewers_per_artifact,
    metrics:plan.metrics,
    artifacts:plan.public.blind_queue
  });
  await writeJson(path.join(outDir,'review-template.json'), plan.public.review_template);
  await writeJson(path.join(outDir,'private','condition-key.json'), {
    schema_version:1,
    benchmark_id:config.id,
    model_contract_hash:plan.model_contract_hash,
    artifacts:plan.private.condition_key
  });

  for (const request of plan.private.generation_requests) {
    await writeJson(path.join(outDir,'private','generation-requests',request.artifact_id + '.json'), request);
    await fs.mkdir(path.join(outDir,'artifacts',request.artifact_id), {recursive:true});
  }
  await fs.mkdir(path.join(outDir,'reviews'), {recursive:true});
  return plan;
}

function validateReview(review, metrics, artifactId) {
  const errors = [];
  if (!review || typeof review !== 'object') return ['Review must be an object.'];
  if (review.schema_version !== 1) errors.push('Review schema_version mismatch.');
  if (artifactId && review.artifact_id !== artifactId) errors.push('Review artifact_id mismatch.');
  if (typeof review.reviewer_id !== 'string' || !review.reviewer_id.trim()) errors.push('Review requires reviewer_id.');
  if (!['independent','self'].includes(review.reviewer_role)) errors.push('reviewer_role must be independent or self.');
  if ('condition_id' in review || 'condition_label' in review || 'instructions_ref' in review) {
    errors.push('Blind review must not contain condition identity.');
  }

  for (const metric of metrics) {
    const value = review.scores && review.scores[metric];
    if (!Number.isFinite(value) || value < 1 || value > 5) errors.push('Score ' + metric + ' must be between 1 and 5.');
  }

  if (!Array.isArray(review.requirement_outcomes) ||
      review.requirement_outcomes.some((x) =>
        !x || typeof x.requirement_id !== 'string' ||
        !['PASS','FAIL','BLOCKED','ADVISORY'].includes(x.outcome))) {
    errors.push('Invalid requirement_outcomes.');
  }

  if (!Array.isArray(review.material_issues) ||
      review.material_issues.some((x) =>
        !x || typeof x.id !== 'string' || !x.id ||
        !['major','minor'].includes(x.severity) ||
        typeof x.summary !== 'string' || !x.summary)) {
    errors.push('Invalid material_issues.');
  }
  return errors;
}

export async function validateBenchmarkDirectory(root, options = {}) {
  const requireComplete = options.requireComplete !== false;
  const required = [
    'benchmark-config.json',
    'input-lock.json',
    'blind-review-queue.json',
    path.join('private','condition-key.json')
  ];
  const errors = [];
  for (const rel of required) if (!(await exists(path.join(root,rel)))) errors.push('Missing ' + rel + '.');
  if (errors.length) return {ok:false,complete:false,errors,artifacts:[]};

  const config = await readJson(path.join(root,'benchmark-config.json'));
  const inputLock = await readJson(path.join(root,'input-lock.json'));
  const queue = await readJson(path.join(root,'blind-review-queue.json'));
  const key = await readJson(path.join(root,'private','condition-key.json'));
  const plan = buildBenchmarkPlan(config, inputLock.tasks || {});

  if (stable(queue.artifacts) !== stable(plan.public.blind_queue)) errors.push('Blind review queue does not match deterministic plan.');
  if (key.model_contract_hash !== plan.model_contract_hash) errors.push('Model contract hash mismatch.');

  const artifacts = [];
  for (const item of key.artifacts || []) {
    const result = {artifact_id:item.artifact_id,complete:false,reviews:0,independent_reviews:0,self_reviews:0,errors:[]};
    const completionFile = path.join(root,'artifacts',item.artifact_id,'completion.json');

    if (await exists(completionFile)) {
      const c = await readJson(completionFile);
      if (c.schema_version !== 1) result.errors.push('completion.json schema_version mismatch.');
      if (c.artifact_id !== item.artifact_id) result.errors.push('completion.json artifact_id mismatch.');
      if (c.model_contract_hash !== plan.model_contract_hash) result.errors.push('completion.json model_contract_hash mismatch.');
      if (c.condition_contract_hash !== item.condition_contract_hash) result.errors.push('completion.json condition_contract_hash mismatch.');
      if (c.input_hash !== item.expected_input_hash) result.errors.push('completion.json input_hash does not match frozen task inputs.');
      if (c.generation_seed !== item.generation_seed) result.errors.push('completion.json generation_seed mismatch.');
      const requestFile = path.join(root,'private','generation-requests',item.artifact_id + '.json');
      if (!(await exists(requestFile))) {
        result.errors.push('Missing frozen generation request.');
      } else {
        const request = await readJson(requestFile);
        if (c.request_hash !== request.request_hash) result.errors.push('completion.json request_hash mismatch.');
      }
      if (typeof c.output_ref !== 'string' || !c.output_ref.trim()) result.errors.push('completion.json requires output_ref.');
      result.complete = result.errors.length === 0;
    } else if (requireComplete) {
      result.errors.push('Missing completion.json.');
    }

    const reviewsRoot = path.join(root,'reviews');
    if (await exists(reviewsRoot)) {
      for (const dirent of await fs.readdir(reviewsRoot,{withFileTypes:true})) {
        if (!dirent.isDirectory()) continue;
        const reviewFile = path.join(reviewsRoot,dirent.name,item.artifact_id + '.json');
        if (!(await exists(reviewFile))) continue;
        const review = await readJson(reviewFile);
        const reviewErrors = validateReview(review, plan.metrics, item.artifact_id);
        if (review.reviewer_id !== dirent.name) reviewErrors.push('reviewer_id must match review directory name.');
        if (reviewErrors.length) result.errors.push('Review ' + dirent.name + ': ' + reviewErrors.join(' '));
        else {
          result.reviews += 1;
          if (review.reviewer_role === 'independent') result.independent_reviews += 1;
          else result.self_reviews += 1;
        }
      }
    }

    if (requireComplete && result.independent_reviews < plan.reviewers_per_artifact) {
      result.errors.push('Expected at least ' + plan.reviewers_per_artifact + ' independent reviews, found ' + result.independent_reviews + '.');
    }
    artifacts.push(result);
  }

  for (const item of artifacts) for (const e of item.errors) errors.push(item.artifact_id + ': ' + e);
  return {
    ok:errors.length===0,
    complete:artifacts.every((x)=>x.complete && x.independent_reviews>=plan.reviewers_per_artifact),
    errors,
    artifacts,
    expected_artifacts:plan.artifact_count
  };
}

function mean(values) { return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null; }
function round(v) { return v === null ? null : Math.round(v*1000)/1000; }

export async function summarizeBenchmark(root) {
  const config = await readJson(path.join(root,'benchmark-config.json'));
  const inputLock = await readJson(path.join(root,'input-lock.json'));
  const key = await readJson(path.join(root,'private','condition-key.json'));
  const plan = buildBenchmarkPlan(config, inputLock.tasks || {});
  const conditionFor = new Map(key.artifacts.map((x)=>[x.artifact_id,x.condition_id]));
  const taskFor = new Map(key.artifacts.map((x)=>[x.artifact_id,x.task_id]));
  const reviews = [];
  const reviewsRoot = path.join(root,'reviews');

  if (await exists(reviewsRoot)) {
    for (const dirent of await fs.readdir(reviewsRoot,{withFileTypes:true})) {
      if (!dirent.isDirectory()) continue;
      const dir = path.join(reviewsRoot,dirent.name);
      for (const file of await fs.readdir(dir,{withFileTypes:true})) {
        if (!file.isFile() || !file.name.endsWith('.json')) continue;
        const artifact = file.name.slice(0,-5);
        if (!conditionFor.has(artifact)) continue;
        const review = await readJson(path.join(dir,file.name));
        const reviewErrors = validateReview(review, plan.metrics, artifact);
        if (reviewErrors.length) throw new Error('Invalid review ' + dirent.name + '/' + file.name + ': ' + reviewErrors.join(' '));
        reviews.push({...review,condition_id:conditionFor.get(artifact),task_id:taskFor.get(artifact)});
      }
    }
  }

  const conditions = {};
  for (const condition of config.conditions) {
    const independent = reviews.filter((r)=>r.condition_id===condition.id && r.reviewer_role==='independent');
    const self = reviews.filter((r)=>r.condition_id===condition.id && r.reviewer_role==='self');
    const scores = {};
    for (const metric of plan.metrics) scores[metric] = round(mean(independent.map((r)=>r.scores[metric])));
    const outcomes = independent.flatMap((r)=>r.requirement_outcomes);

    conditions[condition.id] = {
      label:condition.label,
      independent_reviews:independent.length,
      self_reviews:self.length,
      mean_scores:scores,
      fail_requirement_rate:outcomes.length ? round(outcomes.filter((x)=>x.outcome==='FAIL').length/outcomes.length) : null,
      blocked_requirement_rate:outcomes.length ? round(outcomes.filter((x)=>x.outcome==='BLOCKED').length/outcomes.length) : null,
      major_issues_per_independent_review:round(mean(independent.map((r)=>r.material_issues.filter((x)=>x.severity==='major').length))),
      major_issues_per_self_review:round(mean(self.map((r)=>r.material_issues.filter((x)=>x.severity==='major').length))),
      major_issue_count:independent.flatMap((r)=>r.material_issues).filter((x)=>x.severity==='major').length
    };
  }

  const byArtifact = new Map();
  for (const r of reviews.filter((x)=>x.reviewer_role==='independent')) {
    if (!byArtifact.has(r.artifact_id)) byArtifact.set(r.artifact_id,[]);
    byArtifact.get(r.artifact_id).push(r);
  }

  let pairs=0, compared=0, agreed=0;
  for (const rs of byArtifact.values()) {
    for (let i=0;i<rs.length;i+=1) {
      for (let j=i+1;j<rs.length;j+=1) {
        pairs+=1;
        const left=new Map(rs[i].requirement_outcomes.map((x)=>[x.requirement_id,x.outcome]));
        const right=new Map(rs[j].requirement_outcomes.map((x)=>[x.requirement_id,x.outcome]));
        for (const id of new Set([...left.keys(),...right.keys()])) {
          if (left.has(id)&&right.has(id)) {
            compared+=1;
            if(left.get(id)===right.get(id)) agreed+=1;
          }
        }
      }
    }
  }

  return {
    schema_version:1,
    benchmark_id:config.id,
    generated_at:new Date().toISOString(),
    review_count:reviews.length,
    independent_review_count:reviews.filter((x)=>x.reviewer_role==='independent').length,
    self_review_count:reviews.filter((x)=>x.reviewer_role==='self').length,
    reviewer_agreement:{
      compared_pairs:pairs,
      compared_requirement_outcomes:compared,
      exact_outcome_agreement:compared?round(agreed/compared):null
    },
    conditions,
    interpretation_guardrails:[
      'Do not treat score differences as causal unless the generation contract was held constant and run completion was validated.',
      'Do not claim superiority from aesthetic novelty alone.',
      'Inspect per-task and negative results before collapsing findings into a headline.',
      'Reviewer agreement is descriptive evidence, not proof of reviewer correctness.'
    ]
  };
}

const HELP =
  'UI Slop research benchmark harness\n\n' +
  'Usage:\n' +
  '  node tools/benchmark.mjs prepare <config.json> --out <benchmark-dir>\n' +
  '  node tools/benchmark.mjs validate <benchmark-dir> [--allow-incomplete]\n' +
  '  node tools/benchmark.mjs summarize <benchmark-dir> [--out <summary.json>]\n\n' +
  'This is research tooling, not a public ui-slop product command.\n';

function parseArgs(argv) {
  const out={_:[]};
  for(let i=0;i<argv.length;i+=1){
    const arg=argv[i];
    if(!arg.startsWith('--')){out._.push(arg);continue;}
    const key=arg.slice(2);
    const next=argv[i+1];
    if(next&&!next.startsWith('--')){out[key]=next;i+=1;}
    else out[key]=true;
  }
  return out;
}

export async function runBenchmarkCli(argv) {
  const verb=argv[0];
  if(!verb||['help','--help','-h'].includes(verb)){console.log(HELP);return 0;}
  const args=parseArgs(argv.slice(1));

  try {
    if(verb==='prepare'){
      if(!args._[0]||!args.out)throw new Error('prepare requires <config.json> and --out.');
      const configPath=path.resolve(args._[0]);
      const config=await readJson(configPath);
      const plan=await prepareBenchmark(config,path.resolve(args.out),{
        baseDir:path.dirname(path.dirname(configPath))
      });
      console.log(JSON.stringify({
        benchmark_id:plan.benchmark_id,
        artifacts:plan.artifact_count,
        out:path.resolve(args.out)
      },null,2));
      return 0;
    }

    if(verb==='validate'){
      if(!args._[0])throw new Error('validate requires <benchmark-dir>.');
      const result=await validateBenchmarkDirectory(path.resolve(args._[0]),{
        requireComplete:args['allow-incomplete']!==true
      });
      console.log(JSON.stringify(result,null,2));
      return result.ok?0:1;
    }

    if(verb==='summarize'){
      if(!args._[0])throw new Error('summarize requires <benchmark-dir>.');
      const summary=await summarizeBenchmark(path.resolve(args._[0]));
      if(args.out)await writeJson(path.resolve(args.out),summary);
      console.log(JSON.stringify(summary,null,2));
      return 0;
    }

    throw new Error('Unknown benchmark command: ' + verb);
  } catch(error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url))){
  process.exitCode=await runBenchmarkCli(process.argv.slice(2));
}
