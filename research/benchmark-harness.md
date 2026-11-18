# V2 Benchmark Execution Harness

This is the executable companion to `v2-benchmark-protocol.md`. It exists to make the empirical comparison reproducible without adding another public UI Slop command.

## Predeclared round

The RC2 round is frozen in `benchmark.config.rc2.json`.

It compares five conditions:

1. no UI/design skill
2. frozen UI Slop v1.9
3. compressed v2 reasoning with the evidence loop disabled
4. v2 reasoning with the evidence loop enabled
5. a frozen Impeccable comparator

The corpus contains five unrelated product modes. Each condition receives three independent generation runs per task, for 75 artifacts total. Every artifact requires two independent blind reviews before the round is considered complete.

## Prepare

```bash
node tools/benchmark.mjs prepare research/benchmark.config.rc2.json --out .ui-slop/benchmark/rc2
```

Preparation copies every brief and fixture into the run directory, records SHA-256 hashes, freezes the model contract, creates opaque artifact ids, and writes a deterministic blind-review queue.

The condition map and generation requests live under `private/`. Reviewers must not receive that directory before submitting their first-pass review.

## Generate

Execute every JSON request in `private/generation-requests/` in a fresh isolated context. Hold the declared model, thinking level, task inputs, and execution budget constant.

After an artifact is produced, create:

```json
{
  "schema_version": 1,
  "artifact_id": "artifact-...",
  "model_contract_hash": "...",
  "condition_contract_hash": "...",
  "input_hash": "...",
  "generation_seed": "...",
  "request_hash": "...",
  "output_ref": "path-or-immutable-reference-to-the-produced-artifact"
}
```

at `artifacts/<artifact-id>/completion.json`.

Do not substitute a different model, skill revision, brief, fixture, or budget without invalidating the affected artifact.

## Blind review

Give each independent reviewer:

- the frozen task brief and fixture
- the produced artifact and runnable/source evidence needed to inspect it
- the public blind-review queue
- the review template

Do not disclose condition identity. Do not provide the generator's self-assessment before first-pass review.

Requirement outcomes are `PASS`, `FAIL`, `BLOCKED`, or `ADVISORY`. Metric scores use 1 to 5. Material issues are classified `major` or `minor`.

Store reviews at:

```text
reviews/<reviewer-id>/<artifact-id>.json
```

At least two valid independent reviews are required per artifact.

## Validate before unblinding

```bash
node tools/benchmark.mjs validate .ui-slop/benchmark/rc2
```

The validator rejects missing artifacts, benchmark-config drift, frozen brief/fixture drift, model-contract drift, condition-contract drift, request/seed drift, condition identity leaked into blind review records, malformed reviews, and insufficient independent-review coverage. Self-review never satisfies the independent-review floor.

For a progress check only:

```bash
node tools/benchmark.mjs validate .ui-slop/benchmark/rc2 --allow-incomplete
```

An incomplete round is not a passing empirical benchmark.

## Unblind and summarize

Only after full validation:

```bash
node tools/benchmark.mjs summarize .ui-slop/benchmark/rc2 --out .ui-slop/benchmark/rc2/summary.json
```

The summary reports condition-level independent review means, FAIL/BLOCKED requirement rates, major-issue rates, and exact reviewer agreement. It does not manufacture a single aesthetic score.

## Required interpretation

The benchmark may support a superiority claim only if repeated paired results show a reproducible advantage in task continuity, grounded product specificity, or interaction quality without material regression in accessibility, technical craft, runtime cost, or developer experience.

A prettier screenshot, unusual styling, or one winning seed is insufficient.

Publish invalid runs and negative results. If independent reviewers or isolated generation contexts are unavailable, mark the empirical round BLOCKED rather than replacing them with self-review.


## Causal contrasts

Do not interpret the five conditions as one ordered leaderboard.

Use these predeclared contrasts:

- **compression**: v1.9 versus compressed v2 router. Native evidence tooling is disabled for both.
- **evidence-loop**: compressed v2 router versus v2 full. The intended treatment difference is the evidence loop.
- **full-system**: v2 full versus Impeccable full. Each system may use its own packaged tooling, but both stay inside the same execution budget.
- **secondary baselines**: no-skill versus v1.9 and no-skill versus compressed v2.

This split avoids attributing a tooling advantage to prose compression or treating unequal native tool surfaces as if they were the same causal treatment.
