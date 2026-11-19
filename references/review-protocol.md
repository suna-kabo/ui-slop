# Review Protocol

For substantial work, separate generator reasoning from reviewer judgment.

## Review mode

Record **INDEPENDENT_REVIEW** when a separate reviewer can inspect the rendered and operated product. When one is unavailable, record **SELF_REVIEW** and complete the adversarial pass below before declaring Quality Gate READY.

## Inputs

Start with the original request, protected requirements, and a runnable artifact or immutable evidence. Include anything needed to operate it safely. Hold the Experience Brief, principles, implementation rationale, and detector findings until the reviewer records the first findings.

## Review order

1. Run the ten-second pass in `quality-bar.md` on the first useful desktop and mobile states.
2. Operate the primary action, a second action, and return or recovery. Inspect the weakest detail or secondary state. Record the observed consequence before opening the supporting records.
3. Use the brief, principles, and evidence to complete the stage reviews. Follow `review-stages.md`, inspect protected outcomes and blocked checks, and perform the mandatory supporting-copy subtraction pass in `quality-bar.md`.
4. Consider the generator’s explanation once findings are on record.

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

## Fix and rerun

Fix the smallest responsible layer that can solve the issue. When the right correction is uncertain, render a bounded alternative on the same content and compare both in use. Preserve the first observation and the result after correction.

Rerun:

- affected evidence
- one bounded regression path
- first-impression inspection if the visible composition changed
- supporting-copy subtraction if labels or descriptions changed

Do not mark READY while a material issue is merely “understood.”
