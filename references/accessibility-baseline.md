# Accessibility Baseline

Accessibility is part of the design system, not a final patch.

## Native first

Prefer native semantic elements:

- `<button>` for actions
- `<a href>` for navigation
- native form controls when they can meet the design

Do not rebuild platform behavior with clickable divs without a strong reason.

## Keyboard walk

Complete the primary flow without a pointer.

Verify:

- every action is reachable
- focus order follows the intended task
- focus is visible
- focus does not disappear behind sticky UI
- dialogs/sheets contain focus when modal
- focus returns to the invoking control when a modal closes
- escape/back behavior is predictable where appropriate

## Names, roles, states

Controls need understandable accessible names.

State should be exposed where relevant:

- selected/current
- expanded/collapsed
- checked/pressed
- disabled
- sort state
- validation state

Do not add ARIA that duplicates or fights native semantics.

## Color and contrast

Critical meaning cannot rely on color alone.

Measure rendered contrast when tooling allows.
Do not fabricate numeric contrast claims.

## Zoom and reflow

For web products, inspect:

- 200% text/zoom
- narrow reflow around 320px when the product supports mobile/narrow web
- no clipped critical action
- no hidden content that cannot be recovered

## Touch

On touch surfaces:

- controls need usable hit areas
- adjacent actions need enough separation
- hover-only information needs another path

## Motion

Respect reduced motion.
Avoid motion that can trigger discomfort when it is not necessary for comprehension.

## Live updates

When state changes without moving focus, announce important changes when users otherwise would not know they occurred.

Do not over-announce rapidly changing data.

## Forms

Associate labels with fields.
Place errors where they can be found.
Do not rely on placeholder text as the only label.

## Verification

Do not claim screen-reader, keyboard, contrast, or zoom verification if you did not perform it.

Report the strongest evidence you actually have.
