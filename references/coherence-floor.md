# Coherence and Weakest-Region Floor

A product is judged by its weakest visible region, not the average quality of its best screens.

A beautiful main surface with generic utilities still feels unfinished.

## Inspect all visible systems

Include:

- main content
- navigation
- filters
- search
- tabs/mode switches
- utility rails
- inspectors
- drawers/dialogs
- empty states
- loading states
- errors
- settings
- export/download controls
- mobile navigation/detail
- confirmation/toast states

## Common coherence failure

The main area is art-directed, but the secondary area falls back to:

- default form controls
- generic rounded cards
- random icon styles
- admin-like filter rails
- unrelated button shapes
- different typography
- generic bottom sheet
- default toast styling

This creates the feeling that several templates were stitched together.

## Preserve hierarchy without losing identity

Secondary UI should normally be quieter than the primary surface.

Quieter does **not** mean generic.

Carry over selected parts of the system:

- typography
- line/divider language
- shape grammar
- icon language
- focus treatment
- color roles
- motion
- spacing rhythm
- material/surface behavior

## Weakest-region test

During browser review, identify the three least polished visible regions.

Ask for each:

- Does it belong to the same product?
- Is its role obvious?
- Did it fall back to a framework/browser default?
- Is its information density appropriate?
- Is its interaction complete?
- Does mobile preserve the same quality?

If one region is materially below the rest, the interface is not finished.

## Utility controls deserve design

Filters, search, export, sort, and view controls are used frequently.

Treat them as part of the product rather than leftover plumbing.

Design:

- placement
- grouping
- selected state
- keyboard behavior
- density
- labels
- relationship to the content they control

Do not decorate them aggressively. Make them coherent.

## Micro-craft sweep

At 100% scale inspect:

- optical alignment
- text baselines
- icon sizing
- hit targets
- border joins
- nested radii
- divider endings
- hover/pressed continuity
- focus shape
- truncation
- empty states
- scroll edges
- sticky boundaries
- mobile safe areas

The user notices care cumulatively.
