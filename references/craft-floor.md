# Craft Floor

Load this after the design direction is settled and before final polish.

This is not a style. It is a quality floor.

## Surfaces

Use:

- borders for structure/state
- shadows for elevation
- surface shifts for context
- spacing for grouping

Do not use borders merely because every box needs an edge.

Nested surfaces should use visually compatible radii.
When nested rounded shapes feel wrong, check whether padding and radius relationships are causing the mismatch.

## Optical alignment

Geometric centering is not always visual centering.

Inspect:

- play triangles
- chevrons
- icons beside text
- badges
- asymmetric symbols
- cap-height alignment

Nudge optically when needed.

## Browser surfaces are part of the product

When relevant, inspect:

- text selection
- caret
- focus ring
- scrollbar treatment
- underline offset
- form autofill
- native select/menu behavior
- tabular numerals
- drag states

Do not style them merely to remove browser defaults. Style them only when the product benefits and accessibility remains intact.

## Copy polish

Controls name the action they perform.
The same action keeps the same name through the flow.
Errors identify failure and recovery.
Empty states distinguish absence from failure.

## Data polish

Align comparable numbers.
Use tabular numerals where movement would cause jitter.
Keep units consistent.
Do not make every number bold.

## Density polish

Check the actual working viewport.

Ask:

- does padding consume more space than information?
- are rows easy to scan?
- are unrelated groups visibly separated?
- is the product too sparse for the session length?
- is it too cramped for accurate action?

## Visual leftovers

Remove:

- redundant headings
- repeated subtitles
- duplicate labels
- accidental one-off colors
- inconsistent radii
- placeholder icons
- unexplained badges
- debug text
- implementation-facing copy
- dead controls

The final pass should make the product quieter and more intentional, not busier.


## Weakest-region pass

Before calling the craft pass complete, name the three weakest visible regions.

Do not spend the last pass polishing the strongest hero/header while:

- filters feel default
- a drawer feels generic
- an empty state is unfinished
- mobile navigation is weaker
- form controls belong to another visual system

Raise the weakest region until no material quality cliff remains.

Read `coherence-floor.md` when the problem crosses several utility surfaces.
