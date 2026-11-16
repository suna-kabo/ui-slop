# Performance Baseline

UI polish is not successful if the interface becomes slower to use.

## Measure when tooling exists

Prefer actual measurement for claims about:

- load time
- interaction latency
- long-task blocking
- scroll performance
- layout shift
- bundle weight
- memory

If you only observed the UI, say observed rather than measured.

## Interaction budget

Frequent actions should respond immediately.

Avoid making users wait for:

- hover animation
- pressed animation
- filter animation
- tab movement
- inspector opening
- route transition

Animation may continue after the state becomes clear, but it should not gate the action.

## Rendering

Be careful with:

- large animated blur
- repeated `backdrop-filter`
- large animated shadows
- continuous gradients
- layout-affecting width/height animation
- JS animation loops
- unnecessary re-render of large data sets

Prefer compositor-friendly changes for high-frequency motion.

## Large lists and data

When data is large:

- avoid animating every row
- avoid rebuilding the whole table for one small state change when the framework offers a cheaper path
- consider virtualization when the product genuinely needs it
- keep filtering/sorting responsive
- preserve selection and focus through updates

Do not add virtualization to a small list just because it sounds performant.

## Dependencies

Do not add a large UI/animation library for an effect native CSS or the existing stack can handle well.

Reuse the project's existing primitives when they are sufficient.

## Fonts and assets

- use efficient web font formats
- load only used weights/styles
- preload only when it materially improves first render
- avoid layout shift from late font swaps
- size media appropriately
- lazy-load non-critical heavy media where appropriate

## Scroll and resize

Inspect:

- long page scroll
- sticky surfaces
- nested scroll panes
- inspector/detail scroll
- resize transitions
- mobile scrolling

Jank during the real task matters more than an impressive isolated animation.

## Reduced motion

Reduced motion should also reduce unnecessary animation work.

Do not keep expensive visual effects running invisibly.

## Acceptance

For substantial UI work, check at least:

- initial render
- primary navigation/state changes
- detail/inspector opening
- filter/search/sort
- long-list/table scroll where relevant
- resize/responsive transition
- mobile interaction
- reduced motion

Remove decorative effects that materially harm responsiveness.
