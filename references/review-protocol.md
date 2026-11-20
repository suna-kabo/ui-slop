# Review Protocol

For substantial work, begin with the rendered and operated product. Use `browser-qa.md` for the inspection and correction loop.

## Review mode

Record **INDEPENDENT_REVIEW** when a separate reviewer inspects the rendered and operated product. Otherwise record **SELF_REVIEW** and complete the adversarial pass below before declaring Quality Gate READY.

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

1. Uncoached ten-second pass in `quality-bar.md` on the first useful desktop and mobile viewports
2. Problem review
3. Solution review
4. Implementation review
5. Supporting-copy subtraction audit
6. Protected requirement outcomes
7. Detector and advisory evidence
8. Generator explanation, only after unprompted findings

Perform the mandatory supporting-copy subtraction pass in `quality-bar.md` and record the observed effect in each required state.

## Adversarial self-review

Inspect rendered and operated states before revisiting implementation rationale. Record immediate first-impression problems and actively look for reasons the result should be NOT_READY. Inspect the weakest visible region directly, review supporting-copy candidates, and operate the primary interaction for response and continuity. Review compact or mobile adaptation separately and operate any claimed signature experience.

Record at least the strongest plausible veto and the observation that supports it. Accept it and mark NOT_READY if material, or rebut it with concrete rendered or operated evidence before declaring READY. Intent, such as “the label is useful” or “motion would be distracting,” cannot establish readiness. Unresolved material uncertainty bars READY. Mark BLOCKED when required observations are unavailable, or NOT_READY when the inspected result exposes material harm.

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
- observed impact of removing it and of a quieter alternative
- evidence for restoring the job and its visual treatment, or the decision to merge, relocate, or remove it
