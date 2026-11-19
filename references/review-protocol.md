# Independent Review Protocol

For substantial work, separate generator reasoning from reviewer judgment.

## Inputs

Give the reviewer:

1. original user request
2. Experience Brief
3. product principles
4. runnable artifact or immutable evidence
5. protected requirements
6. known blocked checks

Do not begin with the generator’s rationale or victory narrative.

## Review order

1. Uncoached first impression
2. Problem review
3. Solution review
4. Implementation review
5. Protected requirement outcomes
6. Detector and advisory evidence
7. Generator explanation, only after unprompted findings

## Requirement outcomes

- **PASS** — executed evidence supports the requirement
- **FAIL** — executed evidence contradicts it
- **BLOCKED** — evidence unavailable
- **ADVISORY** — risk requiring product judgment

Unknown is not PASS.

## Quality readiness

Separately record:

- **READY**
- **NOT_READY**
- **BLOCKED**

`NOT_READY` requires at least one concrete quality veto tied to user or product harm.

A quality veto may concern:

- attention
- editing
- concept
- material fidelity
- typography
- affordance
- interaction response
- continuity
- motion
- responsive/platform fit
- performance
- weakest-link quality

Do not convert preference into a veto.

## Reviewer record

For each material finding include:

- stage: problem / solution / implementation
- affected state or viewport
- observation
- user/product harm
- evidence
- responsible layer
- recommendation: keep / revise / reshape / reject
- severity: material / minor

## Fix and rerun

Fix the smallest responsible layer that can solve the issue.

Rerun:

- affected evidence
- one bounded regression path
- first-impression inspection if the visible composition changed

Do not mark READY while a material issue is merely “understood.”
