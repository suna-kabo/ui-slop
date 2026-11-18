# UI Slop v2.0.0-rc.2 validation report

## Status

Engineering release-candidate validation: **PASS**

Empirical claim that UI Slop is better than Impeccable: **NOT EXECUTED**

This distinction is deliberate. RC2 makes the predeclared multi-condition benchmark executable and auditable, but the 75 generated artifacts and independent blind reviews have not yet been executed.

## Baseline

v2 RC is based on the frozen v1.9 candidate:

`588c9cb2910d3866a4c75f6ccf35a3b95d9c4058`

The v1.9 baseline remains available independently for ablation.

## Runtime brain

v2 keeps the strongest v1.9 reasoning while reducing default instruction load.

The default router retains:

- protected product contract
- real-content-first modeling
- domain-shaped structure
- product-grounded visual direction
- Presentation Rhythm
- Task Continuity
- Experience Dynamics
- Behavioral Craft
- interaction contracts
- semantic diversity
- responsive transformation
- anti-convergence reasoning
- Evidence Gate / Taste Gate separation

Detailed reasoning is routed through `references/module-map.md` rather than duplicated into the main skill.

This compression is an engineering change, not proof of better generation quality. RC2 now predeclares the v1.9 versus compressed-v2 ablation in an executable benchmark, but the empirical ablation result remains required.

## P0 tool surface

Only three public capabilities are shipped:

- `inspect`
- `capture`
- `validate`

The older `evidence` verb remains a temporary compatibility alias for `capture`.

No `compare`, `lab`, or `learn` command is part of v2 RC.

## Evidence schema

Manifest schema: **v2**

Each evidence bundle stores:

- immutable scenario input
- optional brief input
- manifest with tool/browser/runtime metadata
- viewport/media run status
- screenshots
- bounded accessibility inventory
- metrics
- focus trace
- event-sourced interaction trace
- findings
- evidence-first review packet
- checksums

Trace events record before/after orientation state rather than an unbounded DOM dump.

`validate` checks required files, schema version, finding classifications, completed-run artifacts, and checksums.

## Finding model

### hard_failure

Blocks only when required behavior or a supported independently verifiable condition fails.

Current hard checks:

- failed scenario assertion
- page runtime exception
- root horizontal overflow when horizontal scrolling is disallowed
- visible enabled interactive role with no observed accessible name

### advisory

Current examples:

- console error without proven task impact
- high share of visible text at 12px or below
- repeated small uppercase labels
- small target geometry where applicability/exceptions require judgment

### evidence_only

Current examples:

- typography distribution
- interaction geometry
- accessibility inventory coverage
- animation inventory

### blocked

Required evidence that could not be executed or observed.

No aesthetic count, similarity score, or style frequency can automatically become a hard failure.

## Automated validation

GitHub Actions validation covers:

### Unit / skill matrix

Operating systems:

- Ubuntu
- Windows

Node versions:

- 20
- 22

Every matrix entry performs a clean dependency install, then runs:

- tool unit tests
- SKILL/reference invariant tests
- no-fixed-motion-recipe runtime-router invariant

Final RC2 unit/skill matrix result: **4 / 4 jobs passed**. Benchmark integrity tests are part of every unit matrix entry.

### Browser integration

Environment:

- Ubuntu
- Node 20
- clean dependency install
- pinned Playwright
- fresh Chromium install

The integration suite runs two local HTTP fixtures. The good workflow is exercised at desktop (1440×900), compact (900×700), and mobile (390×844), each under normal and reduced-motion preferences.

#### Good workflow fixture

Validates:

- detail selection
- URL/history transition
- persisted watch state
- Back behavior
- reload persistence
- root overflow assertion
- normal motion preference
- reduced-motion preference
- evidence bundle creation
- manifest schema v2
- checksum validation
- checksum tamper detection

Result: **PASS**

#### Deliberately broken fixture

Contains:

- page runtime exception
- root horizontal overflow
- unnamed visible button
- microtype-heavy text
- repeated small uppercase labels
- small interactive target

Expected classification:

- runtime exception: hard failure
- root overflow: hard failure
- unnamed interactive: hard failure
- microtype: advisory
- uppercase-label recurrence: advisory
- small target geometry: advisory/evidence, not automatic blocker

Result: **PASS**

The browser job also prepares and validates the frozen RC2 benchmark corpus in incomplete smoke mode, then uploads generated evidence bundles and benchmark-smoke artifacts for inspection.

## Cross-platform defects caught during validation

The CI loop caught and corrected several test-harness assumptions before RC:

- module-map parsing accidentally treated a prose mention of `SKILL.md` as a reference file
- file URL path handling was not Windows-safe
- frontmatter tests initially assumed LF line endings
- one regex patch incorrectly escaped newline tokens

These were test/validation defects, not hidden passes. The branch was not called release-ready until Windows/Linux and browser validation were green.


## RC2 empirical benchmark infrastructure

RC2 adds a research-only harness at `tools/benchmark.mjs`. It is intentionally not part of the public `ui-slop inspect/capture/validate` command surface.

The frozen round in `research/benchmark.config.rc2.json` contains:

- five unrelated product tasks
- five conditions: no-skill, v1.9, compressed v2, v2 plus evidence loop, frozen Impeccable
- three generation runs per condition per task
- two independent blind reviews required per artifact
- a frozen model/thinking/execution contract
- SHA-256 locked briefs and fixtures
- opaque artifact ids and a private condition key
- completion metadata validation before scoring
- condition-contract, generation-seed, request-hash, benchmark-config, and frozen-input drift detection
- self-review excluded from the independent-review completion floor
- blind review records rejected if they contain condition identity
- post-review unblinding and reviewer-agreement reporting

A complete round therefore requires 75 generated artifacts and 150 independent blind review records.

The harness can prove protocol integrity and detect config, input, model, condition, seed, and request drift. It also enforces that self-review cannot satisfy the independent-review floor. It cannot substitute for actual independent generation and review.

## What v2 RC deliberately does not claim

It does not prove:

- superior visual taste
- better output than Impeccable
- cross-product recurrence detection as an objective quality metric
- universal accessibility coverage
- full assistive-technology behavior
- every framework/route can be inferred statically
- advisory thresholds are aesthetic truths

The accessibility inventory is deliberately bounded and does not replace the browser accessibility tree, assistive technologies, or applicable standards.

## Remaining research validation

Before claiming UI Slop is better than Impeccable, execute `research/v2-benchmark-protocol.md`:

1. no-skill baseline
2. frozen v1.9
3. v2 compressed reasoning without evidence loop
4. v2 with evidence loop
5. current Impeccable
6. same model/settings/brief/fixtures within each round
7. multiple runs/seeds
8. blind first-pass review
9. publish invalid and negative results

The claim threshold remains reproducible improvement in task continuity, grounded product specificity, or interaction quality without material regression in accessibility, technical craft, runtime cost, or developer experience.

## Validation provenance

Validated implementation head:

`255d02de8b9095d98ccd98413674efd850abe026`

GitHub Actions run:

`44349833156`

Result: **5 / 5 jobs passed**

The browser job completed:

- six good-workflow variants: desktop, compact, and mobile under normal and reduced-motion preferences
- deliberately broken fixture classification checks
- RC2 benchmark prepare smoke for all 75 planned artifact slots
- incomplete-mode benchmark integrity validation
- evidence artifact upload

Uploaded artifact:

- name: `ui-slop-browser-evidence`
- artifact id: `14446833729`
- digest: `sha256:bbe8a1d2cdf48fab71c2da3c316fb4eb54376ad32a6b0ba78d85b7387e300c70`

## Release-candidate verdict

**v2.0.0-rc.2 is complete as an engineering release candidate.**

The P0 implementation now includes the compressed runtime router, browser evidence loop, detector separation, independent-review protocol, three-viewport verification, and an executable blinded benchmark/ablation harness.

The remaining blocker is empirical execution by isolated generators and independent reviewers. The repository is ready to collect that evidence without pretending the evidence already exists.

It is not yet justified to label UI Slop better than Impeccable.
