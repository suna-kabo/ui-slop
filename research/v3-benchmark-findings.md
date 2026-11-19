# v3 benchmark findings that motivated the architecture

Date: 2026-11-19

Status: qualitative exploratory evidence, not a superiority claim.

## Inputs

Two small manual benchmark rounds were run with isolated ChatGPT/Codex contexts.

### Track A — product/workflow

Task: investigative research workspace, Casewire.

Conditions included no-skill, UI Slop v1.9, compressed v2 reasoning, v2 full workflow, and an Impeccable fallback condition.

The round used one generation per condition and one reviewer. It was useful for discovering issues, not for statistical claims.

Main observations:

- v2 full and v1.9 produced the strongest task continuity
- compressed v2 reasoning was less reliable than v1.9 in this sample
- saved state did not automatically preserve visible task context
- a polished generic SaaS shell could remain competitive on basic correctness
- Impeccable ran in fallback mode because its native launcher was unavailable, so it was not a full-system comparison

### Track B — visual/taste

Task: fictional design-archive exhibition for portable furniture.

Conditions:

- UI Slop v2
- Emil Kowalski skills
- Hallmark
- Taste Skill
- UI UX Pro Max

A first constrained run prohibited images, fonts, network, libraries, and multi-file output. It suppressed the strengths of several systems and forced convergence toward text-heavy research UI. That run is not a fair visual-ceiling comparison.

A second full-capability run allowed assets, fonts, packages, research, browser verification, and multi-file projects.

## Cross-condition findings

The full-capability outputs improved dramatically but still shared visible problems:

- editorial labels, figure numbers, and institutional metadata competed for attention
- curatorial copy repeated what layout and imagery already communicated
- object controls were detached from the objects they affected
- detail frequently defaulted to a generic modal
- hover and press behavior was often decorative rather than causal
- state changes existed, but spatial continuity and local response were weak
- many animations were entrance effects, not interaction design
- mobile often reflowed rather than changing the interaction model
- one or two weak regions exposed the whole result as unfinished within seconds
- technically responsive and accessible output could still feel dead

## UI Slop v2 findings

Strengths:

- strong domain and product reasoning
- product-specific object representation
- clear semantics and continuity logic
- avoidance of generic SaaS structure
- willingness to generate procedural construction studies rather than rely on cards

Weaknesses:

- primary visual material did not always reach the fidelity implied by the art direction
- concept validity was rewarded more than execution quality
- custom representation did not automatically become a compelling direct interaction
- generic modal/detail patterns remained
- quality references were optional and late
- visible qualitative failures remained advisory rather than blocking readiness

## Competitor findings

These are observations from one task and one seed.

- Taste and Hallmark showed stronger packaged art direction and final visual finish.
- UI UX Pro Max produced strong image quality and an immediately readable composition, but relied more on established editorial patterns.
- Emil’s routed workflow produced limited motion in this task; the run did not explicitly force its full animation-specialist sequence, so it does not measure Emil’s motion ceiling.

## Core lesson

The problem was not only visual polish.

The outputs lacked a complete chain:

> user intent → shaped product → product principles → proved interaction → high-fidelity material → platform-native foundation → signature behavior → staged review

Adding another final checklist would not repair the architecture.

## Acceptance target

The v3 target is:

> No unresolved material part of the first useful viewport or primary flow feels obviously wrong to a skilled reviewer.

This target must be supported by concrete findings and independent review. It is not a numerical taste score or a promise of perfection.
