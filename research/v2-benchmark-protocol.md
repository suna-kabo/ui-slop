# UI Slop v2 Benchmark Protocol

This protocol exists to test whether UI Slop improves outcomes rather than merely producing a recognizable style.

## Conditions

At minimum compare:

1. no UI/design skill
2. UI Slop v1.9 frozen baseline
3. UI Slop v2 candidate
4. current Impeccable

UI UX Pro Max can be included when its intended role fits the task, but it is not required for every round.

Use the same base model, thinking setting, product brief, fixture data, tool permissions, and execution budget within a round.

## Samples

Use several unrelated product modes, for example:

- investigative research
- spatial/travel planning
- creative sequencing
- operations/control
- browse/collect or commerce

Do not reuse the exact products that shaped a new rule as the only validation set.

Use multiple independent seeds/runs per condition when feasible.

## What must stay blind

Review artifacts as A/B/C/D before revealing skill identity.

The first reviewer pass should receive:

- original brief
- runnable/source evidence as needed
- evidence bundle

Do not provide generator self-justification before the first critique.

## Measures

### Product outcome

- required workflow completion
- second and third action continuity
- Back/return behavior
- state preservation
- error/recovery behavior
- keyboard and supported-input access

### Interaction quality

- domain-specific interaction model
- direct manipulation where appropriate
- prompt feedback
- interruption/reversal where relevant
- spatial continuity
- repeated-use efficiency

### Information design

- hierarchy
- realistic content robustness
- typography readability
- useful density
- mobile information priority

### Product specificity

- domain objects shape the structure
- visual world is product-grounded
- semantics are not collapsed into one component grammar
- interaction mechanics are not merely a reusable effect bag

### Technical quality

- accessibility failures
- viewport clipping/overflow
- runtime errors
- reduced motion
- supported responsive states

## Cross-product recurrence

Analyze feature families separately:

- structure
- visual material
- typography
- semantic-to-component mapping
- interaction state graph
- motion triggers
- responsive transformations

Do not collapse them into an originality score.

High similarity is a review signal, not an automatic failure.

## Predeclared v2 success condition

Do not claim UI Slop is better than Impeccable unless repeated paired trials show a reproducible advantage in task continuity, grounded product specificity, or interaction quality without material regression in accessibility, technical craft, runtime cost, or developer experience.

Aesthetic novelty alone does not count.

## Ablation

Explicitly test:

- v1.9 full router versus compressed v2 router
- v2 reasoning without evidence tooling versus v2 reasoning plus evidence tooling

This determines whether improvements come from less instruction interference, better reasoning, or the verification loop.

## Negative results

Publish material failures and invalid comparisons. A benchmark with a missing specialist, broken tool, or incomplete run must be labeled invalid rather than scored as a normal condition.


## Executable RC2 round

The predeclared executable round is stored in `research/benchmark.config.rc2.json` and uses `tools/benchmark.mjs`.

The five conditions are:

1. no UI/design skill
2. frozen UI Slop v1.9 at `588c9cb2910d3866a4c75f6ccf35a3b95d9c4058`
3. compressed v2 router with the evidence loop disabled
4. v2 router with the evidence loop enabled
5. Impeccable frozen at `d41d9860b0094dcb68030657da63461212835aaa`

The five corpus tasks cover investigative research, spatial/time planning, creative sequencing, operational triage, and browse/collect work.

Each condition receives three independent runs per task. Each produced artifact requires two independent blind reviews. This yields 75 generated artifacts and 150 independent review records for a complete RC2 round.

`prepare` freezes brief/fixture hashes and the model contract. Reviewers receive opaque artifact ids, not condition identity. `validate` rejects incomplete coverage and input/model drift. `summarize` unblinds only after reviews exist.

See `research/benchmark-harness.md` for the execution procedure.

The presence of this harness is not itself empirical evidence. Until isolated generation runs and independent reviews are actually completed, the superiority question remains untested.


## Predeclared causal contrasts

The RC2 five-condition design is not a single causal ladder. Analyze pairwise contrasts according to what actually changes:

- **v1.9 vs compressed v2** tests reasoning compression with native evidence tooling disabled.
- **compressed v2 vs v2 full** tests the incremental evidence loop.
- **v2 full vs Impeccable full** is an end-to-end system comparison. Each may use its native packaged tooling inside the same execution budget.
- **no-skill vs v1.9** and **no-skill vs compressed v2** are secondary skill-effect baselines.

Do not use the full-system comparison to claim the prose router alone caused a difference. Do not disable a competitor's defining packaged tooling and then call the result an end-to-end comparison.
