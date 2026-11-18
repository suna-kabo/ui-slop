# Browser QA

Use bounded rendered review for substantial visual work.

When the P0 evidence harness is available, prefer a repeatable scenario over ad hoc screenshots. The browser is evidence collection, not an automatic taste judge.

## Pass A

Operate representative real states and inspect:

- first useful viewport
- primary multi-step workflow
- selection and detail
- second and third likely actions
- nested detail and Back/return
- realistic long/dense/missing content
- narrow/mobile transformation
- keyboard and focus where applicable
- reduced motion when motion exists
- required loading, empty, error, retry, or persistence states
- runtime and console failures

Collect material findings before editing.

## Fix batch

Repair the responsible layer, not isolated pixels when the issue is systemic.

Examples:

- fix mobile information priority rather than one overflow
- fix state ownership rather than one lost selection
- fix interaction causality rather than swapping an animation
- fix typography roles rather than several unrelated font sizes

## Pass B

Rerun affected evidence and a bounded regression path.

Confirm no new failure in keyboard, return behavior, responsive composition, or required state.

Stop when remaining findings are advisory/minor and explicitly understood.

## Operate, do not only look

A screenshot cannot prove behavior.

Where applicable, click, type, filter, select, compare, manipulate, follow relationships, use Back/forward, resize, scroll, keyboard navigate, retry, reload, export, or continue from an already-selected state.

## Record a state sequence

For the primary workflow, record:

- user action
- selected object or route before/after
- what changed
- what stayed anchored
- focus target
- scroll anchor when relevant
- persistent state changes
- next likely action
- screenshot or ARIA evidence id
- animation or transition observation when relevant

Test at least one second or third action for repeated-work products.

## Keyboard walk

Use actual key input rather than inferring accessibility from source alone.

Record focus stops and required-action checkpoints. A control that was never reached or activated is not verified.

Do not fail a design solely because a computed outline property is absent. Custom focus indicators may require visual review.

## Behavioral Craft review

When relevant, test:

- prompt response to input
- direct manipulation tracking
- interruption
- reversal or retargeting
- spatial continuity
- boundary feedback
- repeated-use comfort

Do not require gesture physics for ordinary forms or non-manipulative interfaces.

## Motion causality

Trigger at least one unrelated state change that should not replay a meaningful transition.

If a route, timeline, relationship trace, or other meaningful motion replays only because a broad render rebuilt the element, fix state or animation ownership.

## Presentation rhythm

At real scale inspect:

- information value in the first working viewport
- dead regions
- text-size distribution
- body/reading comfort
- repeated typographic roles
- density by region
- desktop versus mobile information priority

A high small-text ratio is advisory evidence, not automatic failure.

## Cross-product recurrence

When an actual comparison corpus is available, describe structural, visual-material, typography, semantic-component, interaction, motion-trigger, and responsive similarities.

Similarity is not a quality score. Ask whether it is product-justified and harmful.

When no comparison corpus is available, mark recurrence as not verified.

## Honesty

If browser execution, auth, fixtures, or a required state are unavailable, mark the check blocked or not verified. Do not claim visual or interaction validation from source alone.
