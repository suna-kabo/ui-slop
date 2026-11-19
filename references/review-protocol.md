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

Perform the mandatory supporting-copy subtraction pass in `quality-bar.md` and record the observed effect in each required state.

## Requirement outcomes

- **PASS** — executed evidence supports the requirement
- **FAIL** — executed evidence contradicts it
- **BLOCKED** — evidence unavailable
- **ADVISORY** — risk requiring product judgment

Unknown is not PASS.

## Quality readiness

Use the READY / NOT_READY / BLOCKED criteria in `quality-bar.md` and cite the rendered evidence. Keep the Evidence Gate outcome separate.

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
