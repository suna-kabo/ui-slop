# UI Slop

UI Slop is a standalone Agent Skill for building production interfaces that resist generic AI composition, repeated component grammar, effect-first interaction design, and one-house-style convergence.

It is not a component library, style catalog, palette generator, or fixed motion system.

## Status

- Stable design-reasoning baseline: **v1.9 candidate**
- Experimental next branch: **v2 P0 evidence engine**

The v2 work intentionally does not add another large layer of design ideology. It compresses the runtime router, keeps the strongest v1.9 reasoning, and adds reproducible evidence collection.

## What remains distinctive

UI Slop treats several common generated-interface failures as first-class design problems:

- domain-agnostic structural shells
- semantic-to-component collapse
- density purchased through microtype
- task flows that lose selection, filters, scroll, or return context
- interaction designed as a reusable animation bag
- cross-product recurrence in structure, material world, typography, interaction, and responsive behavior

Similarity is evidence, not an automatic quality failure. Conventional patterns remain valid when they serve the task.

## v2 P0 architecture

```text
BRAIN
  compact router
  product contract
  structural reasoning
  real-content-first modeling
  presentation rhythm
  experience dynamics + behavioral craft
  task continuity
  compact interaction contracts
  anti-convergence reasoning

EVIDENCE
  project inspection
  Playwright browser capture
  workflow scenario assertions
  responsive screenshots
  ARIA snapshots
  keyboard focus trace
  reduced-motion runs
  typography / geometry / animation inventory
  runtime and console evidence

CHECKS
  hard_failure
  advisory
  evidence_only
  blocked

REVIEW
  evidence-first independent reviewer protocol
```

`compare`, `lab`, and `learn` remain research directions rather than required P0 commands.

## Tooling

Requires Node.js 20+.

```bash
npm install
npx playwright install chromium
```

### Inspect a project

```bash
node ./tools/ui-slop.mjs inspect . --out .ui-slop/context.json
```

The report contains observed stack, routes, token candidates, motion libraries, tests, and design-context files with source and confidence. It does not choose a design direction.

### Capture evidence

```bash
node ./tools/ui-slop.mjs evidence http://localhost:3000 \
  --scenario ./scenario.json \
  --out .ui-slop/runs/example
```

The scenario contains product-specific actions and assertions. It is not a UI template.

A run stores:

- manifest
- checksums
- viewport screenshots
- ARIA snapshots
- event trace
- focus trace
- text and interaction metrics
- findings
- isolated-review packet

### Validate a bundle

```bash
node ./tools/ui-slop.mjs validate .ui-slop/runs/example
```

## Detector philosophy

The tool may block only on explicit required behavior or independently verifiable applicable standards.

Examples of hard failures:

- required scenario assertion failed
- root viewport overflow where horizontal scrolling is not allowed
- page runtime exception
- interactive accessible role with no accessible name

Examples that remain advisory or evidence-only:

- percentage of visible text at 12px or below
- uppercase micro-label count
- small target geometry where standards include exceptions
- animation inventory
- interaction counts

There is intentionally no numeric aesthetic score.

## Runtime references

`SKILL.md` is a router. `references/module-map.md` defines the smallest useful modules for each task.

New v2 references include:

- `references/real-content-first.md`
- `references/interaction-contracts.md`
- `references/evidence-harness.md`
- `references/review-protocol.md`

Behavioral Craft is integrated into `references/experience-dynamics.md` rather than added as another large philosophy layer.

## Benchmark discipline

`research/v2-benchmark-protocol.md` defines the planned comparison against:

- no-skill baseline
- frozen v1.9
- v2 candidate
- current Impeccable

The project should not claim superiority from one attractive screenshot or one self-reviewed run.

## Philosophy

**Protect the product contract.**

**Let domain objects and relationships shape the interface.**

**Design interaction before motion.**

**Use real content before structure locks.**

**Measure what can be measured, but do not turn taste into a detector.**

**Unknown evidence is blocked, not passed.**

**Escaping one default by repeating the same anti-default is still convergence.**
