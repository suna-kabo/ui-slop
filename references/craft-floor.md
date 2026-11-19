# Craft Floor

Use this during concept proof and implementation review.

Craft is not a final decorative pass. It is the execution quality that makes the approved idea trustworthy.

This is not a house style.

## Materials

Every visible material must support the intended quality:

- typefaces
- photography
- illustration
- icons
- diagrams
- 3D or procedural graphics
- video
- texture
- controls
- native browser surfaces

Do not build a premium composition around placeholder-quality material.

## Surfaces

Use:

- spacing for grouping
- alignment for relationship
- type for hierarchy
- borders for structure or state
- surface shifts for context
- shadows for real elevation

Do not wrap every semantic region or use a border because an element otherwise feels unfinished.

Nested surfaces should share a coherent geometry. Check padding-to-radius relationships and clipping.

## Optical alignment

Geometric centering is not always visual centering.

Inspect:

- play triangles
- chevrons
- icons beside text
- checkmarks
- badges
- asymmetric symbols
- cap height
- baselines
- image focal points
- button label balance

Nudge optically when needed.

## Typography

Inspect the rendered result:

- weight and optical size
- line height
- measure
- tracking and case
- wraps and orphans
- role count
- numeric stability
- alignment
- font loading and fallback
- mobile scaling

Do not use tiny uppercase or monospace metadata as a universal authenticity device.

## Browser surfaces

When relevant, inspect:

- text selection
- caret
- focus ring
- scrollbar
- underline offset
- autofill
- native select/menu behavior
- drag state
- overscroll
- tap highlight
- safe-area behavior

Style defaults only when the product benefits and accessibility remains intact.

## Copy

Controls name the action they perform.

The same action keeps the same name through the flow.

Errors identify failure and recovery.

Empty states distinguish absence from failure.

Run the layout-explanation test:

- If hierarchy, adjacency, imagery, navigation, or conventional semantics already explain the region, remove the label or helper copy.
- Keep secondary copy only when it changes a decision, clarifies state, prevents error, supplies necessary context, or enables action.
- Do not add micro-labels to make a composition look designed.

Run a supporting-copy subtraction pass in the rendered first viewport and primary detail state:

- temporarily remove eyebrows, kickers, overlines, section numbers, figure labels, category/type/mode labels, helper descriptions, and repeated captions
- restore only those that perform a unique necessary job
- reject adjacent descriptor stacks when title, layout, image, or control state already communicates the same meaning
- reject descriptions that paraphrase nearby headings or narrate visible imagery
- reject tiny uppercase or monospace copy used mainly as an editorial, archival, premium, or technical costume

Necessary secondary copy is allowed. Decorative authenticity is not a necessary role.

## Data

Align comparable numbers.

Use tabular numerals where movement would cause jitter.

Keep units consistent and attached to values.

Distinguish unknown, not applicable, zero, stale, and unavailable.

Do not make every number bold.

## Interaction finish

Inspect:

- visual and hit target alignment
- hover, focus, press, active, selected, disabled, pending, error, and success
- response at the point of action
- focus movement and restoration
- scroll anchoring
- pointer/touch differences
- interruption and reversal
- transition ownership
- repeated-use speed

A generic transition does not finish a weak interaction model.

## Density

Check the actual useful viewport.

Ask:

- does padding consume more space than information?
- are rows and groups scannable?
- is empty space creating focus or only length?
- is microtype buying density?
- is the surface too sparse for the session length?
- is it too compressed for accurate action?
- does mobile retain the right context?

## Visual leftovers

Remove:

- redundant headings
- repeated subtitles
- duplicated metadata
- stacked eyebrow or descriptor text
- repeated secondary descriptions
- accidental one-off colors
- inconsistent radii
- placeholder icons
- unexplained badges
- debug or implementation-facing text
- dead controls
- detached actions
- empty containers
- decorative section numbering without navigational or editorial value

## Weakest-region pass

Name the three weakest visible or interactive regions.

Do not spend the final work polishing the hero while:

- filters feel default
- a modal feels generic
- a drawer loses origin
- an empty state is unfinished
- mobile navigation belongs to another product
- a visual asset reads as a placeholder
- a control row is detached from the object
- motion feels canned

Raise the weakest region or simplify the direction until no material quality cliff remains.
