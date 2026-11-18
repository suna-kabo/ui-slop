import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  buildBenchmarkPlan,
  prepareBenchmark,
  summarizeBenchmark,
  validateBenchmarkConfig,
  validateBenchmarkDirectory
} from '../tools/benchmark.mjs';

function makeConfig() {
  return {
    schema_version: 1,
    id: 'test-benchmark',
    randomization_seed: 'fixed-seed',
    runs_per_condition: 2,
    reviewers_per_artifact: 2,
    model_contract: {
      model: 'test-model',
      thinking: 'high',
      execution_budget: 'equal'
    },
    metrics: [
      'task_continuity',
      'product_specificity',
      'interaction_quality',
      'information_design',
      'technical_quality'
    ],
    conditions: [
      { id: 'control', label: 'Control', tool_policy: 'same-tools' },
      { id: 'candidate', label: 'Candidate', instructions_ref: 'SKILL.md', tool_policy: 'same-tools' }
    ],
    tasks: [
      { id: 'alpha', brief: 'alpha.md', fixture: 'alpha.json' },
      { id: 'beta', brief: 'beta.md', fixture: 'beta.json' }
    ]
  };
}

async function makeRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-slop-bench-'));
  await fs.writeFile(path.join(root, 'alpha.md'), '# Alpha\n', 'utf8');
  await fs.writeFile(path.join(root, 'beta.md'), '# Beta\n', 'utf8');
  await fs.writeFile(path.join(root, 'alpha.json'), '{"items":[1,2]}\n', 'utf8');
  await fs.writeFile(path.join(root, 'beta.json'), '{"items":[3,4]}\n', 'utf8');
  return root;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

async function completeArtifact(benchDir, item, modelContractHash) {
  const request = await readJson(path.join(benchDir, 'private', 'generation-requests', item.artifact_id + '.json'));
  await writeJson(path.join(benchDir, 'artifacts', item.artifact_id, 'completion.json'), {
    schema_version: 1,
    artifact_id: item.artifact_id,
    model_contract_hash: modelContractHash,
    condition_contract_hash: item.condition_contract_hash,
    input_hash: item.expected_input_hash,
    generation_seed: item.generation_seed,
    request_hash: request.request_hash,
    output_ref: 'artifacts/' + item.artifact_id + '/output'
  });
}

function reviewFor(item, reviewerId, conditionId) {
  const high = conditionId === 'candidate';
  const score = high ? 5 : 2;
  return {
    schema_version: 1,
    benchmark_id: 'test-benchmark',
    reviewer_id: reviewerId,
    reviewer_role: 'independent',
    artifact_id: item.artifact_id,
    requirement_outcomes: [
      { requirement_id: 'r1', outcome: high ? 'PASS' : 'FAIL' },
      { requirement_id: 'r2', outcome: 'PASS' }
    ],
    scores: {
      task_continuity: score,
      product_specificity: score,
      interaction_quality: score,
      information_design: score,
      technical_quality: score
    },
    material_issues: high ? [] : [
      { id: 'issue-1', severity: 'major', summary: 'Control misses the protected workflow.' }
    ],
    notes: ''
  };
}

test('benchmark config creates multiple frozen runs per condition and task', () => {
  const config = makeConfig();
  assert.equal(validateBenchmarkConfig(config), true);
  const plan = buildBenchmarkPlan(config);
  assert.equal(plan.artifact_count, 8);
  assert.equal(new Set(plan.private.condition_key.map((x) => x.generation_seed)).size, 8);
  assert.equal(plan.model_contract_hash.length, 64);
});

test('blind review queue is deterministic and does not disclose condition identity', () => {
  const config = makeConfig();
  const one = buildBenchmarkPlan(config);
  const two = buildBenchmarkPlan(config);
  assert.deepEqual(one.public.blind_queue, two.public.blind_queue);
  const exposed = JSON.stringify(one.public.blind_queue);
  assert.doesNotMatch(exposed, /candidate|control|condition_id|condition_label/);
});

test('prepared benchmark locks task inputs and completion requires enough valid reviews', async () => {
  const root = await makeRoot();
  const benchDir = path.join(root, 'run');
  const config = makeConfig();
  const plan = await prepareBenchmark(config, benchDir, { baseDir: root });

  const inputLock = await readJson(path.join(benchDir, 'input-lock.json'));
  assert.equal(Object.keys(inputLock.tasks).length, 2);
  assert.equal(inputLock.tasks.alpha.brief_sha256.length, 64);
  assert.equal(inputLock.tasks.alpha.fixture_sha256.length, 64);

  const incomplete = await validateBenchmarkDirectory(benchDir, { requireComplete: false });
  assert.equal(incomplete.ok, true);
  assert.equal(incomplete.complete, false);

  for (const item of plan.private.condition_key) {
    await completeArtifact(benchDir, item, plan.model_contract_hash);
    for (const reviewer of ['reviewer-a', 'reviewer-b']) {
      await writeJson(
        path.join(benchDir, 'reviews', reviewer, item.artifact_id + '.json'),
        reviewFor(item, reviewer, item.condition_id)
      );
    }
  }

  const complete = await validateBenchmarkDirectory(benchDir);
  assert.equal(complete.ok, true, complete.errors.join('\n'));
  assert.equal(complete.complete, true);
  assert.equal(complete.expected_artifacts, 8);
});

test('self reviews cannot satisfy the independent-review floor and blind reviews reject condition identity', async () => {
  const root = await makeRoot();
  const benchDir = path.join(root, 'run');
  const config = makeConfig();
  const plan = await prepareBenchmark(config, benchDir, { baseDir: root });
  const item = plan.private.condition_key[0];
  await completeArtifact(benchDir, item, plan.model_contract_hash);

  const selfReview = reviewFor(item, 'self-reviewer', item.condition_id);
  selfReview.reviewer_role = 'self';
  await writeJson(path.join(benchDir, 'reviews', 'self-reviewer', item.artifact_id + '.json'), selfReview);

  const leakedReview = reviewFor(item, 'reviewer-a', item.condition_id);
  leakedReview.condition_id = item.condition_id;
  await writeJson(path.join(benchDir, 'reviews', 'reviewer-a', item.artifact_id + '.json'), leakedReview);

  const result = await validateBenchmarkDirectory(benchDir);
  assert.equal(result.ok, false);
  const text = result.errors.join(' ');
  assert.match(text, /independent reviews/);
  assert.match(text, /must not contain condition identity/);
});

test('validation detects frozen input and benchmark config drift', async () => {
  const root = await makeRoot();
  const benchDir = path.join(root, 'run');
  const config = makeConfig();
  await prepareBenchmark(config, benchDir, { baseDir: root });

  await fs.appendFile(path.join(benchDir, 'inputs', 'alpha', 'brief.md'), 'tamper');
  let result = await validateBenchmarkDirectory(benchDir, { requireComplete: false });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /Frozen brief hash mismatch/);

  await fs.writeFile(path.join(benchDir, 'inputs', 'alpha', 'brief.md'), '# Alpha\n', 'utf8');
  const frozenConfig = await readJson(path.join(benchDir, 'benchmark-config.json'));
  frozenConfig.analysis_contract = { changed_after_prepare: true };
  await writeJson(path.join(benchDir, 'benchmark-config.json'), frozenConfig);
  result = await validateBenchmarkDirectory(benchDir, { requireComplete: false });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /Benchmark config hash mismatch/);
});

test('completion rejects condition-contract or request drift', async () => {
  const root = await makeRoot();
  const benchDir = path.join(root, 'run');
  const config = makeConfig();
  const plan = await prepareBenchmark(config, benchDir, { baseDir: root });
  const item = plan.private.condition_key[0];
  await completeArtifact(benchDir, item, plan.model_contract_hash);

  const completionFile = path.join(benchDir, 'artifacts', item.artifact_id, 'completion.json');
  const completion = await readJson(completionFile);
  completion.condition_contract_hash = 'wrong';
  completion.request_hash = 'wrong';
  await writeJson(completionFile, completion);

  const result = await validateBenchmarkDirectory(benchDir, { requireComplete: false });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /condition_contract_hash mismatch/);
  assert.match(result.errors.join(' '), /request_hash mismatch/);
});

test('summary unblinds only after review and reports reviewer agreement', async () => {
  const root = await makeRoot();
  const benchDir = path.join(root, 'run');
  const config = makeConfig();
  const plan = await prepareBenchmark(config, benchDir, { baseDir: root });

  for (const item of plan.private.condition_key) {
    await completeArtifact(benchDir, item, plan.model_contract_hash);
    for (const reviewer of ['reviewer-a', 'reviewer-b']) {
      await writeJson(
        path.join(benchDir, 'reviews', reviewer, item.artifact_id + '.json'),
        reviewFor(item, reviewer, item.condition_id)
      );
    }
  }

  const summary = await summarizeBenchmark(benchDir);
  assert.equal(summary.review_count, 16);
  assert.equal(summary.independent_review_count, 16);
  assert.equal(summary.conditions.candidate.mean_scores.task_continuity, 5);
  assert.equal(summary.conditions.control.mean_scores.task_continuity, 2);
  assert.equal(summary.conditions.control.major_issue_count, 8);
  assert.equal(summary.reviewer_agreement.exact_outcome_agreement, 1);
});
