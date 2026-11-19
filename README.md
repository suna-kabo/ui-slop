# UI Slop

UI Slop is a standalone Agent Skill for shaping, proving, building, and reviewing production interfaces.

It is designed for cases where a merely correct, responsive, accessible, or visually defensible interface is not enough.

The v3 finish condition is:

> **The product contract is protected, the core experience is proven, and no material part of the primary experience feels obviously wrong.**

UI Slop is not a component library, style catalog, house aesthetic, palette generator, or fixed motion system.

## Status

**v3.0.0-rc.1** is the design-operating-model release candidate on `v3/shape-prove-build`.

It replaces the v2 runtime sequence without discarding the v2 evidence engine.

The v1.9 and v2 branches remain historical baselines.

This release does not claim empirical superiority over other design systems. The new architecture is a falsifiable response to benchmark findings and must be tested on unrelated product modes.

## Why v3 exists

v2 accumulated substantial knowledge about:

- product-specific structure
- real content
- task continuity
- interaction models
- visual direction
- authored experience
- responsive behavior
- browser evidence
- taste and craft review

Exploratory benchmarks showed that much of this knowledge was optional, loaded late, or unable to reject a weak concept before a complete interface had already been built.

Technically complete outputs could still expose obvious quality cliffs within seconds:

- unearned labels and explanatory chrome
- detached controls
- generic modals
- inert or decorative interaction
- low-fidelity primary assets
- responsive reflow without platform adaptation
- one unfinished utility region undermining the whole result

v3 changes the operating sequence rather than adding another final checklist.

## The five-stage core

### 1. Shape

Write a short Experience Brief:

- user and context
- meaningful outcome
- irreducible core
- protected truth
- non-goals
- quality risks

Start from the need, not the requested page or feature list.

### 2. Product principles and calibration

Create three to five product-specific decision principles.

Calibrate against:

- platform conventions
- relevant best-in-class references
- incumbent strengths
- category defaults and anti-defaults

References set a bar; they are not templates.

### 3. Concept proof

Before completing the full surface, prove a vertical slice with:

- real content
- primary visual material at near-final fidelity
- highest-risk interaction
- entry, action, result, and return
- wide and narrow behavior
- pointer, touch, and keyboard implications
- one second action

Reshape or discard a concept that cannot meet the bar. Do not defer concept failure as polish.

### 4. Foundation plus signature

Use familiar, native, accessible foundations for ordinary behavior.

Concentrate custom design and engineering in one to three domain-derived signature experiences.

Motion may express the interaction logic. It is not the logic.

### 5. Staged review

Review separately:

1. problem
2. solution
3. implementation

Then require both:

- Evidence Gate pass
- Quality Gate ready

## “Nothing feels obviously wrong”

This does not mean perfection or infinite iteration.

A material issue is one a skilled reviewer can point to and explain as harmful to:

- trust
- comprehension
- agency
- continuity
- visual quality
- repeated-use efficiency
- platform fit
- performance
- intended feeling

The Quality Gate can veto readiness for:

- unearned attention
- a weak concept
- low-fidelity visual material
- detached or inert behavior
- platform afterthoughts
- visible weakest-link quality cliffs
- immediate first-impression problems

A veto requires concrete product reasoning. It is not permission to enforce personal taste.

## Runtime references

The v3 core lives in `SKILL.md`.

Mandatory operating references:

- `references/shaping.md`
- `references/product-principles.md`
- `references/reference-calibration.md`
- `references/concept-proof.md`
- `references/review-stages.md`
- `references/quality-bar.md`

`references/module-map.md` routes specialist concerns such as structure, typography, media, interaction, continuity, responsive behavior, accessibility, performance, and evidence.

Templates:

- `examples/experience-brief.template.md`
- `examples/product-principles.template.md`
- `examples/review-record.template.md`

## Evidence tooling

The public tool surface remains small:

```text
ui-slop inspect
ui-slop capture
ui-slop validate
```

Requires Node.js 20+.

```bash
npm install
npx playwright install chromium
```

### Inspect project facts

```bash
ui-slop inspect . --out .ui-slop/context.json
```

### Capture a workflow

```bash
ui-slop capture http://localhost:3000 \
  --scenario ./scenario.json \
  --brief ./brief.txt \
  --out .ui-slop/runs/example
```

Or:

```bash
ui-slop capture \
  --html ./fixture.html \
  --scenario ./scenario.json \
  --out .ui-slop/runs/example
```

### Validate a bundle

```bash
ui-slop validate .ui-slop/runs/example
```

The evidence engine collects executed behavior, responsive screenshots, focus and state traces, accessibility inventory, typography and interaction geometry, animation inventory, runtime findings, checksums, and an evidence-first review packet.

Automated evidence does not issue aesthetic verdicts.

## Review discipline

For substantial work, the reviewer receives:

1. original request
2. Experience Brief
3. product principles
4. runnable artifact or immutable evidence
5. protected requirements
6. blocked checks

The reviewer records unprompted findings before seeing the generator’s rationale.

Requirements use PASS / FAIL / BLOCKED / ADVISORY.

Quality readiness separately uses READY / NOT_READY / BLOCKED.

## Research record

- `research/v3-design-operating-model.md`
- `research/v3-benchmark-findings.md`
- `research/v2-benchmark-protocol.md`

The v3 research record documents why the architecture changed and what remains unproven.

## Philosophy

**Shape before UI.**

**Use a few product principles to make decisions.**

**Prove the core experience before completing the surface.**

**Use familiar foundations and concentrated signature behavior.**

**Treat visual material, motion, copy, performance, and platform fit as design materials.**

**Review problem, solution, and implementation separately.**

**A valid interface can still be not ready.**

**Do not ship while an obvious quality cliff remains.**
