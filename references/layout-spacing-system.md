# Layout and Spacing System

Use this reference when establishing or correcting the spatial system of a product.

## Principle

Spacing is not decoration. It communicates relationship.

A good layout should let users infer:

- what belongs together
- what is separate
- what is primary
- what is supporting
- what can be acted on
- what changes when another object is selected

Do not solve composition by adding containers.

## Density

Default to medium density unless the product clearly requires otherwise.

Medium density should provide:

- enough information for fast scanning
- enough separation for low fatigue
- no oversized marketing whitespace inside working software
- no cramped control wall
- no repeated card padding consuming most of the viewport

Density should change by context. A research ledger may be denser than an inspector header. Mobile may simplify representation rather than merely increasing vertical length.

## Spacing rhythm

Prefer a small coherent rhythm rather than dozens of arbitrary values.

A useful starting family is:

- 4
- 8
- 12
- 16
- 24
- 32
- 48

Do not force every layout into these numbers if optical balance requires adjustment.

Use smaller gaps for:

- label + value
- icon + text
- tightly related controls
- rows within one dataset

Use larger gaps for:

- workflow boundaries
- section transitions
- changes in task
- context shifts

## Surfaces

Avoid nested-card architecture by default.

Before adding a surface container, ask whether hierarchy can instead be expressed with:

- spacing
- alignment
- a rule/divider
- typography
- background delta
- indentation
- sticky positioning

Prefer small surface deltas over large decorative cards when the product is data-heavy.

## Desktop composition

Use available desktop width intentionally.

At 1440 and 1920:

- do not trap the interface inside an unnecessarily narrow centered column
- do not stretch text lines to unreadable widths
- use the width for comparison, context, inspectors, or meaningful density
- preserve a clear reading path

Empty space is allowed when it creates focus. It is a problem when it makes the UI look unfinished or forces unnecessary scrolling.

## Responsive composition

Do not treat responsive design as "stack everything vertically."

At each breakpoint decide:

- what must remain visible
- what can collapse
- what can move into contextual disclosure
- what should change representation
- whether navigation should change form
- whether an inspector should become a sheet/full-screen route

Mobile is allowed to be structurally different from desktop.

## Alignment

Prefer strong alignment over decoration.

Use:

- consistent text starts
- aligned numeric columns
- predictable action positions
- stable identity columns
- shared baselines when practical

Misalignment should indicate hierarchy or nesting intentionally, not accidental CSS drift.

## Scrolling

Prefer one primary page scroll where practical.

Avoid nested internal scrollers unless the product genuinely benefits from independently scrollable regions.

Sticky headers, filters, or identity columns should be used only when they materially improve long-list orientation.

## Final spatial test

At each major viewport ask:

- Is related content close enough?
- Are unrelated workflows clearly separated?
- Is any area empty because the composition is weak?
- Is any area crowded because controls were not prioritized?
- Is space being consumed by containers rather than information?
- Does the reading path remain obvious?
