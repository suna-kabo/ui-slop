# Motion and Interaction

Motion should communicate **cause, relationship, hierarchy, continuity, or authored character**.

Do not begin with a reusable effect vocabulary.

Begin with the interaction concept.

Read `experience-dynamics.md` first for substantial interactive work.

## Motion thesis

Before implementing meaningful motion, state:

- which interaction or transition deserves authorship
- what continuity or relationship needs explanation
- what object remains the anchor
- what the user should notice first, second, and last
- which routine feedback should remain nearly immediate
- what reduced motion should preserve

A thesis such as "fade panels in" or "add hover lift" is not specific enough.

## Choose material by meaning

Select the implementation mechanism after deciding what the transition communicates.

Useful families may include:

- spatial continuity
- shared-element or object continuity
- layout/reflow continuity
- crop/mask/reveal
- relationship/path reveal
- focus/depth/material change
- data-state interpolation
- immediate state feedback
- no motion

No family is the default.

Do not stack several techniques merely to appear sophisticated.

## Relative timing, not a recipe

Timing should follow frequency, distance, consequence, and sequence.

Principles:

- feedback to a direct action should feel immediate
- frequently repeated transitions should complete before they feel like latency
- larger spatial or structural changes may take longer when the extra time improves comprehension
- exits usually need less attention than entrances
- staged sequences must not block the task

Do not copy universal duration bands into every product.

If the project already has a motion system, preserve its established timing unless the redesign explicitly replaces it.

## Spatial logic

Movement should have a reason.

If an object moves, the direction and distance should follow:

- origin and destination
- hierarchy
- physical/spatial relationship
- navigation direction
- content transformation

Do not add small arbitrary translates merely to make opacity changes feel animated.

## Interaction response

Hover, focus, press, selection, drag, traversal, and detail do not need the same feedback material.

Use the smallest response that makes the state legible and feels native to the product.

Do not turn these into defaults:

- hover lift
- image zoom
- selected accent stripe
- fade-and-rise
- generic slide-in detail
- identical easing everywhere

## Interruption and repeated use

Interactive transitions should behave correctly when the user changes intent quickly.

Where interruption matters, use implementation that can reverse or retarget cleanly.

Repeated use is part of the design test. A transition that feels impressive once can feel obstructive on the twentieth use.

## Data and relationship changes

Animate data only when motion improves understanding of what moved, appeared, disappeared, changed rank, or changed relationship.

Preserve object identity where possible.

Do not redraw the entire surface when a smaller continuity cue would explain the change better.

## Performance

Choose implementation appropriate to the runtime and target devices.

Prefer efficient techniques, but do not mistake "transform and opacity are fast" for an art direction.

Use heavier effects only when the visual world and performance budget justify them.

Measure when the effect is material to the experience.

## Reduced motion

Respect `prefers-reduced-motion` and platform equivalents.

Reduced motion should preserve:

- state confirmation
- hierarchy
- selection
- relationship understanding
- continuity where a static alternative can express it

Do not blindly set every animation to near-zero if that destroys useful feedback.

## Cross-product motion audit

Compare the interaction mechanics with unrelated recent work.

If several products all use the same combination of hover lift, image zoom, fade/slide detail, accent-stripe selection, and identical easing, treat that as convergence even when the palettes and layouts differ.

Return to `experience-dynamics.md` and redesign the interaction concept instead of merely changing duration or easing.

## Motion test

Ask:

- What meaning would be lost if this motion disappeared?
- Does the direction come from the interaction model?
- Does sequence direct attention usefully?
- Is it interruptible where needed?
- Does repeated use remain comfortable?
- Is the same mechanism being reused only because it is convenient?
- Does reduced motion retain the information?

If the answer is mostly "it feels smoother," simplify or rethink it.
