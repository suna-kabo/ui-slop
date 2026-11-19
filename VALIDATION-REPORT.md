# UI Slop v3.0.0-rc.1 validation report

## Status

Engineering validation: **PASS**

Design-operating-model implementation: **COMPLETE FOR RC1**

Empirical claim that v3 produces better interfaces than v2 or external systems: **NOT ESTABLISHED**

This report separates architecture implementation, automated engineering validation, and empirical output quality.

## Baseline

v3 is based on the validated v2 RC2 branch:

`v2/p0-evidence-engine`

Base implementation commit:

`19fb7f73abed9bdeb2575ca88aff7ab779fa186a`

The existing evidence engine and blinded benchmark infrastructure remain available. v3 replaces the runtime design operating model rather than discarding the validated tooling.

## Architecture change

v3 replaces:

> route → modules → build → evidence → taste → polish

with:

> shape → product principles and calibration → concept proof → foundation plus signature → problem / solution / implementation review

The new mandatory core requires:

- a short Experience Brief
- three to five product-specific principles
- platform and best-in-class quality calibration
- a high-information vertical concept proof
- an explicit select / revise / reject decision before full implementation
- familiar foundations plus concentrated signature behavior
- separate problem, solution, and implementation reviews
- Evidence Gate pass
- Quality Gate ready

## Positive readiness model

A technically valid product may still be `NOT_READY`.

The v3 Quality Gate can veto readiness for a concrete material issue in:

- attention
- editing and copy
- concept fidelity
- visual material fidelity
- typography
- control locality and affordance
- interaction response
- continuity
- motion causality
- responsive and platform fit
- performance perception
- weakest-link quality
- first impression

A quality veto must identify the observed state and explain user or product harm. It is not an aesthetic score or a mechanism for enforcing personal preference.

## Concept rejection

v3 explicitly permits reshaping or discarding a concept before full implementation when structure, interaction model, visual material, or platform fit cannot reach the required bar.

Craft and browser review are no longer expected to rescue a concept-level failure after a full site has been built.

## Reference ownership

Mandatory v3 references:

- `references/shaping.md`
- `references/product-principles.md`
- `references/reference-calibration.md`
- `references/concept-proof.md`
- `references/review-stages.md`
- `references/quality-bar.md`

`references/module-map.md` makes the five-stage core mandatory and routes specialist reasoning without duplicating a large handbook into the main skill.

## Research provenance

The architecture is documented in:

- `research/v3-design-operating-model.md`
- `research/v3-benchmark-findings.md`

The research record distinguishes official design-practice sources, exploratory benchmark observations, model inference, and unproven claims.

The exploratory benchmark rounds used one seed and limited independent review. They were sufficient to discover architecture failures but not to establish superiority.

## Evidence tooling

Package version:

`3.0.0-rc.1`

Public commands remain:

- `inspect`
- `capture`
- `validate`

The package entrypoint is `tools/ui-slop-v3.mjs`. The wrapper binds v3 provenance at both the CLI and public module boundary while reusing the validated v2 Node/Playwright evidence engine.

The evidence engine remains objective and evidence-first. Automated aesthetic scoring was not added.

## Automated validation

Validated implementation head:

`af61bb456dfd09b0b6f91f08ce9df403a8e17bbe`

GitHub Actions run:

`44542344830`

Result: **5 / 5 jobs passed**

### Unit / skill matrix

Passed:

- Ubuntu, Node 20
- Ubuntu, Node 22
- Windows, Node 20
- Windows, Node 22

Every matrix entry completed:

- clean dependency installation
- evidence-tool unit tests
- benchmark integrity tests
- SKILL/reference integrity
- mandatory five-stage ordering
- mandatory v3 operating references
- positive readiness and quality-bar coverage
- absence of fixed motion recipes
- v3 CLI version provenance

### Browser integration

Passed on Ubuntu / Node 20 with fresh Chromium.

Validated:

- desktop 1440×900
- compact 900×700
- mobile 390×844
- normal and reduced-motion variants
- detail selection and URL/history transition
- persisted state and reload
- Back behavior
- focus and keyboard traces
- root overflow assertion
- objective/advisory finding separation
- evidence bundle schema and checksum validation
- checksum tamper detection
- v3 manifest tool provenance
- RC2 benchmark prepare/validate smoke

### Evidence artifact

- name: `ui-slop-v3-evidence`
- artifact id: `14537449495`
- size: `203365` bytes
- digest: `sha256:739b474016555b09bb2983a0ec0dda01c41f6adeecdb7a704124058715b22fc1`
- expiry: 2026-12-03

## Engineering claim boundary

RC1 may claim only that:

- the v3 operating sequence is encoded and testable
- the v2 evidence engine remains integrated
- mandatory core references and templates exist
- package and CI entrypoints target v3
- staged qualitative readiness is represented in the runtime instructions and review protocol
- cross-platform and browser engineering validation passes

RC1 does not yet prove:

- that “nothing feels obviously wrong” will be achieved on every run
- that independent reviewers will agree on every quality veto
- that v3 outperforms v2, Hallmark, Taste, UI UX Pro Max, Emil, Impeccable, or no-skill baselines
- that one quality calibration set transfers across products
- that the current evidence harness measures every component of perceived quality

## Required empirical validation

Run fresh unrelated tasks that do not repeat the furniture-exhibition benchmark.

At minimum test:

1. one repeated workflow
2. one browse/collect or media product
3. one persuasion or public-facing experience
4. one dense reading or research surface
5. one mobile-first interaction-heavy product

Use multiple seeds for decisive claims. Review first impressions, protected behavior, problem/solution/implementation outcomes, and quality vetoes independently.

## RC1 verdict

**v3.0.0-rc.1 is complete and passes engineering validation as a design-operating-model release candidate.**

It is not empirically justified to claim that v3 consistently produces interfaces where nothing feels obviously wrong.

The architecture now makes that outcome an explicit, reviewable readiness condition, provides a rejection path before full build, and prevents technical validity from being mistaken for product readiness.
