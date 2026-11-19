# Evidence Gate

Run this before qualitative readiness judgment.

Evidence Gate answers:

> Did required behavior and independently verifiable standards actually work in executed states?

It does not answer whether the product is excellent, authored, alive, or ready to ship. That belongs to `quality-bar.md`.

## Classification

### hard_failure

Use only when a specified product requirement or independently verifiable applicable standard fails in an executed state.

Examples:

- core action cannot be completed
- required route, history, return, or saved state breaks
- required control is unreachable by a supported input path
- interactive control lacks a required accessible name
- critical content or action is clipped
- required recovery path is absent
- runtime exception breaks the task
- applicable measured contrast or accessibility criterion fails
- required input response misses an explicit performance budget

Record reproduction and evidence.

### advisory

Use for measured or observed risk requiring product judgment.

Examples:

- high small-text share
- repeated uppercase micro-labels
- unusually small target geometry where exceptions may apply
- weak-looking affordance
- repeated cards, pills, or generic motion
- unusual whitespace or density
- cross-product similarity
- a response that feels late without a measured budget

Advisory does not become a hard failure merely because it is frequent.

A material advisory may still become a **quality veto** during qualitative review when its product harm is concrete.

### evidence_only

Neutral inventory with no automatic verdict:

- typography distribution
- component counts
- palette and material tokens
- interaction trace
- animation inventory
- focus sequence
- spacing and geometry
- responsive comparison
- timing measurements

### blocked

Required evidence could not be executed or observed.

Unknown is not pass.

## Verification matrix

Record actual status:

| Area | Status examples |
| --- | --- |
| Core flows | operated / automated / blocked / not verified |
| Pointer/touch | operated / blocked / not verified |
| Keyboard/focus | operated / blocked / not verified |
| Back/return/persistence | operated / blocked / not verified |
| Contrast/text scaling | measured / inspected / blocked / not verified |
| Wide/compact/narrow | inspected / blocked / not verified |
| Reduced motion | inspected / not applicable / blocked |
| Loading/error/recovery | inspected / not applicable / blocked |
| Performance | measured / observed / blocked / not verified |
| Console/runtime | clean / findings / blocked / not checked |

Never upgrade observed to measured.

## Completion

Evidence Gate passes when:

- no unresolved hard failure remains
- required evidence is not blocked without disclosure
- every protected requirement has executed support or an explicit limitation

Passing Evidence Gate is necessary but insufficient.

Overall readiness additionally requires:

- Solution review selected the concept
- Implementation review is ready
- Quality Gate has no unresolved veto

A valid but obviously unfinished interface does not pass overall readiness.
