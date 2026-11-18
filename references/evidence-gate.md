# Evidence Gate

Run this before qualitative taste review.

The gate separates verifiable failure from measured risk and neutral evidence.

## Classification model

### hard_failure

Use only when a specified product requirement or independently verifiable applicable standard fails in an executed state.

Examples:

- core action cannot be completed
- required route or history behavior breaks
- required saved state is lost
- required control is unreachable by its supported input path
- interactive control lacks an accessible name when a name is required
- critical content or action is clipped at a supported viewport
- required recovery path is absent
- runtime exception breaks the task
- applicable required contrast or accessibility criterion is measured and fails

Every hard failure should record reproduction and evidence.

### advisory

Use for measured or observed patterns that may cause a problem but require product-specific judgment.

Examples:

- large share of visible text at small sizes
- repeated small uppercase labels
- unusually small target geometry where standards include exceptions
- repeated cards, pills, or hover treatments
- motion replay after a state change that may be unrelated
- weak-looking affordance
- unusual whitespace or density
- cross-product visual similarity

Advisory does not block by itself.

### evidence_only

Use for neutral inventory with no automatic quality verdict:

- typography distribution
- component counts
- palette and material tokens
- interaction trace
- animation inventory
- focus sequence
- spacing or geometry measurements
- responsive state comparison

### blocked

Use when required evidence could not be executed or observed because of missing auth, unstable build, unavailable browser, unsupported platform, inaccessible fixture, or another explicit limitation.

Unknown is not pass.

## Evidence versus preference

Do not turn personal preference into deterministic correctness.

A font, radius, density, palette, navigation pattern, or familiar component is not wrong solely because another reviewer would choose differently.

A familiar pattern may be correct when it reduces error, onboarding cost, or platform inconsistency.

## Verification matrix

For substantial work, record the actual status of applicable checks:

| Area | Status examples |
| --- | --- |
| Core flows | operated / automated / blocked / not verified |
| Keyboard | operated / blocked / not verified |
| Focus | inspected / measured / blocked / not verified |
| Contrast | measured / blocked / not verified |
| Zoom or text scaling | inspected / blocked / not verified |
| Narrow width | inspected / blocked / not verified |
| Reduced motion | inspected / not applicable / blocked |
| Required states | inspected / not applicable / blocked |
| Performance | measured / observed / blocked / not verified |
| Console/runtime | clean / findings / blocked / not checked |

Never upgrade observed to measured.

## Completion

Fix hard failures before claiming completion.

Advisories should be resolved, accepted with a product reason, or left explicitly open. Evidence-only measurements remain available to the independent reviewer.

Use `review-protocol.md` for independent review and `evidence-harness.md` when the P0 tooling is available.
