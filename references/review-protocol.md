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
5. Supporting-copy subtraction audit
6. Protected requirement outcomes
7. Detector and advisory evidence
8. Generator explanation, only after unprompted findings

The supporting-copy audit covers the first useful viewport, primary detail state, and one compact or mobile state. It examines eyebrow text, kickers, overlines, section and figure labels, category/type/mode labels, captions, helper descriptions, subtitles, and repeated metadata. Temporarily remove these layers and restore only those that perform a unique necessary job.

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

Secondary labels and descriptions are not failed by category. They become a veto when they repeat meaning, simulate authenticity, compete with the primary object or task, or expose weak hierarchy. They remain valid when they are necessary for navigation, state, action, error prevention, disambiguation, provenance, scope, units, constraints, or risk.

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

For supporting copy, also record:

- text or role inspected
- unique job claimed
- result after subtraction
- keep / shorten / merge / remove

## Fix and rerun

Fix the smallest responsible layer that can solve the issue.

Rerun:

- affected evidence
- one bounded regression path
- first-impression inspection if the visible composition changed
- supporting-copy subtraction if labels or descriptions changed

Do not mark READY while a material issue is merely “understood.”
