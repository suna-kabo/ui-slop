# UI Slop

UI Slop is a standalone Agent Skill for building production interfaces that resist generic AI composition, repeated component grammar, effect-first interaction design, and one-house-style convergence.

It combines a compact product-specific design-reasoning router with a small evidence harness. It is not a component library, style catalog, palette generator, aesthetic score, or fixed motion system.

## Status

**v2.0.0-rc.1** is the current engineering release candidate on `v2/p0-evidence-engine`.

The frozen comparison baseline remains v1.9 on `release/v1.9-final-convergence-cleanup`.

v2 RC does not claim empirical superiority over Impeccable. The predeclared benchmark in `research/v2-benchmark-protocol.md` still has to establish that.

## What v2 changes

v2 deliberately avoids adding another large layer of design ideology.

### Brain

The default `SKILL.md` is a smaller router and product contract. Detailed reasoning is loaded only when relevant through `references/module-map.md`.

The retained core includes:

- domain-shaped structure
- real-content-first modeling
- product-grounded visual direction
- Presentation Rhythm
- connected state and Task Continuity
- Experience Dynamics
- compact interaction contracts
- Behavioral Craft inside interaction reasoning
- semantic diversity
- responsive transformation
- cross-product recurrence review
- Evidence Gate and Taste Gate separation

Behavioral Craft covers prompt response, continuous manipulation where appropriate, interruptibility, reversal/retargeting, spatial continuity, boundary behavior, and repeated-use comfort. These are qualities, not fixed Apple-style physics values.

### Evidence

The P0 tool surface stays intentionally small:

```text
ui-slop inspect
ui-slop capture
ui-slop validate
```

`compare`, `lab`, and `learn` are not shipped as v2 RC commands.

## Install the evidence tooling

Requires Node.js 20+.

```bash
npm install
npx playwright install chromium
```

Playwright is pinned in `package.json` so validation does not silently change with a future browser-tool release.

## Inspect project facts

```bash
node ./tools/ui-slop.mjs inspect . --out .ui-slop/context.json
```

Inspection reports observed stack, package scripts, route candidates, token candidates, motion/test libraries, visual artifacts, and design-context files with provenance and confidence.

Detected implementation facts do not automatically become design authority.

## Capture a real workflow

```bash
node ./tools/ui-slop.mjs capture http://localhost:3000 \
  --scenario ./scenario.json \
  --brief ./brief.txt \
  --out .ui-slop/runs/example
```

Or use a local fixture:

```bash
node ./tools/ui-slop.mjs capture \
  --html ./fixture.html \
  --scenario ./scenario.json \
  --out .ui-slop/runs/example
```

The scenario is product-specific. It can attach requirement IDs to actions/assertions so a failure traces back to the protected product contract.

See `examples/scenario.example.json`.

A run can capture:

- representative responsive screenshots
- normal and reduced-motion variants
- before/after interaction state
- route and Back behavior
- reload/persistence assertions
- focus state and keyboard walk
- bounded accessibility-name inventory
- typography distribution
- interactive geometry
- animation inventory
- runtime/console evidence
- checksummed brief/scenario inputs
- evidence-first review packet

## Validate the evidence bundle

```bash
node ./tools/ui-slop.mjs validate .ui-slop/runs/example
```

Bundle schema and integrity are documented in `references/evidence-schema.md`.

Exit status for capture:

- `0`: completed without hard failures or blocked coverage
- `1`: operational failure
- `2`: hard failure
- `3`: required evidence blocked

## Detector philosophy

Measurement and taste are separate.

### Hard failure

Only explicit contract failures or independently verifiable applicable failures block. Current examples include:

- failed scenario assertion
- page runtime exception
- root horizontal overflow where it is disallowed
- visible interactive control with no observed accessible name

### Advisory

Measured risks that still require product judgment, including:

- microtype-heavy rendered text
- repeated small uppercase labels
- unusually small target geometry where contextual/standards exceptions may apply
- console errors whose task impact is not established

### Evidence only

Neutral inventory such as typography distribution, interaction geometry, accessibility coverage, and animation inventory.

### Blocked

Required evidence that could not be executed or observed.

There is intentionally no numerical aesthetic or originality score.

## Independent review

`references/review-protocol.md` separates generator self-justification from the first critique.

The reviewer receives the product brief/contract and immutable evidence first, records unprompted findings, and only then sees advisory detector output.

Requirements are classified as PASS, FAIL, BLOCKED, or ADVISORY. Unknown evidence is never silently PASS.

## CI validation

The v2 branch runs:

- unit + skill invariant tests on Windows and Linux
- Node.js 20 and 22
- clean dependency install
- Chromium installation
- browser integration tests
- good workflow fixture with Back, persisted state, reload, normal/reduced motion, and checksum tamper detection
- deliberately broken fixture covering runtime error, overflow, unnamed interactive control, microtype, uppercase labels, and small target geometry

Browser CI uploads its generated evidence bundles as a short-lived workflow artifact for inspection.

See `VALIDATION-REPORT.md` for the exact release-candidate result.

## Benchmark discipline

`research/v2-benchmark-protocol.md` predeclares comparison among:

1. no UI/design skill
2. frozen UI Slop v1.9
3. UI Slop v2 candidate
4. current Impeccable

The project should not claim superiority from a screenshot, a feature checklist, or one self-reviewed run.

## Philosophy

**Protect the product contract.**

**Let domain objects and relationships shape the interface.**

**Use real content before structure locks.**

**Design interaction before motion.**

**Measure what can be measured, but do not turn taste into a detector.**

**Unknown evidence is blocked, not passed.**

**Escaping one default by repeating the same anti-default is still convergence.**
