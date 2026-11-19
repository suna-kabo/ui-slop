# Quality Bar

This is a positive readiness bar, not a style score.

The target is not universal perfection. The target is that no material part of the primary experience feels obviously wrong.

## Readiness

Assess independently of the Evidence Gate.

- **READY** requires concrete observations from an operated primary flow, first useful viewport, primary detail or focused state, and relevant compact/mobile and signature states. Complete the applicable mode in `review-protocol.md`, record first-impression findings, the supporting-copy pass, and the weakest visible region, and resolve every material veto.
- **NOT_READY** means an observed material veto remains. Cite the state or interaction, the issue, and the user or product harm.
- **BLOCKED** means a required state or interaction could not be assessed. Identify the missing evidence. Record any observed vetoes even when coverage is blocked.

## What counts as a material quality issue

A material issue is observable and explainable as harm to one or more:

- trust
- comprehension
- agency
- continuity
- visual quality
- repeated-use efficiency
- intended feeling
- platform fit
- performance perception

Personal preference alone is not material.

## Attention

Inspect the first useful viewport and primary states.

Reject when:

- labels, badges, numbering, institutional chrome, or helper copy compete with the primary object
- several elements demand equal emphasis
- negative space is accidental rather than focusing or pacing
- decorative authenticity tokens replace actual hierarchy
- the main action is visually secondary to explanatory UI

Every element must earn attention.

## Mandatory supporting-copy subtraction

For the first useful viewport, primary detail or focused state, and compact or mobile state, render the interface with candidate copy removed or consolidated. Collapse the vacated space and any wrapper that only served the copy. Compare the intact and recomposed states at the same width, then operate the affected task. Look for changes to attention, spacing, visibility, and action discovery.

Start with eyebrows, kickers, numbering, captions, stacked descriptors, helper text that repeats the title or state, and duplicated metadata. A category, mode, filter, or deep link can be useful while its current placement competes with the task. Try moving it to the title, a conventional control, nearby state, or an on-demand surface.

Preserve accessible names, live feedback, safety, provenance, units, and context needed for a decision. Restore visible text or prominence where the comparison shows that users lose information or discover an action less reliably. Record the consequential change and its effect in each inspected state.

## Composition

The viewport should read as one composition, not a collection of individually reasonable components.

Inspect:

- relationship between image/object and text
- dominant and supporting shapes
- crop and alignment
- tension and balance
- content rhythm
- transitions between dense and quiet regions
- whether wide space is used intentionally
- whether every section repeats one template

## Visual material

The chosen material must meet the fidelity implied by the direction.

This includes:

- photography
- illustration
- iconography
- 3D or procedural rendering
- diagrams
- maps
- charts
- texture
- video
- typography as image

A strong concept with placeholder-looking material is not ready.

Judge:

- silhouette
- proportion
- lighting or depth
- crop
- material credibility
- consistency
- resolution
- authorship
- relationship to content

## Typography

Inspect actual rendering, not token names.

Check:

- typeface suitability
- optical size and weight
- line length and line height
- tracking and case
- wrapping and orphaning
- baseline and cap-height alignment
- numeric stability
- responsive scaling
- contrast between display, body, utility, and data roles
- whether small uppercase or monospace labels are carrying too much hierarchy

A font pairing is not a typography system.

## Control locality and affordance

Controls should live where their relationship is obvious.

Reject:

- detached segmented controls when the object can be manipulated directly
- surfaces that look interactive but contain small isolated targets
- dead zones
- controls whose wording describes a mode rather than the action
- generic pill groups used to make an inert surface appear designed
- icon-only actions with weak discoverability

## Interaction response

For every primary action inspect the chain:

> input → acknowledgment → transition → state → next action

Response should begin promptly at the point of action.

Judge:

- press/focus/hover acknowledgment
- pending state
- local versus global response
- interruption and reversal
- boundary feedback
- state persistence
- next-action locality
- repeated-use comfort

Functional state change is not automatically sufficient behavioral quality. Operate press and activation as well as hover. Review abrupt image or content replacement, text or color changes that carry the whole response to a meaningful action, and transitions with no clear result or next action. Tie any veto to observed harm.

## Continuity

Open, close, select, filter, compare, reorder, save, navigate, and return should preserve the relationships the user needs.

When the flow depends on understanding a transformation, relationship, mechanism, object state, navigation context, or manipulated content, record what binds the action to its result, what stays anchored, and whether users can recover, find focus, and continue efficiently. Record whether special continuity is warranted and what the operated result shows. Ordinary immediate behavior can be right when it communicates enough. Animation is optional.

Reject when:

- content appears from nowhere
- detail loses its origin without reason
- Back returns to the wrong state or position
- responsive transformation hides the active object
- focus and scroll contradict visual continuity
- a modal replaces a stronger object-anchored relationship by habit

## Motion

Motion must explain:

- cause and effect
- origin and destination
- hierarchy
- topology
- relationship
- progress
- completion

Decorative entrance, hover lift, image zoom, or universal fade/slide does not count as interaction quality.

Check:

- necessity
- immediate feedback
- natural weight
- interruption
- retargeting
- reduced motion
- repeated-use cost
- frame stability

An interface can animate and still feel dead.

## Responsive and platform fit

Do not review only layout width.

Inspect:

- content priority
- input method
- navigation model
- control placement
- crop
- density
- safe areas
- touch targets
- keyboard/focus
- sheet versus route versus inline detail
- motion distance and performance
- browser and device conventions

Operate the compact or mobile flow separately. Record how its priorities, input, and continuation suit that context. Passing an overflow check or watching the layout reflow cannot establish adaptation.

## Performance perception

Measure when possible and observe always.

Look for:

- delayed input acknowledgment
- long main-thread tasks
- dropped frames
- layout shifts
- font/image flashes
- unstable dimensions
- slow transitions used to hide work
- loading states that destroy structure

Fast completion cannot compensate for late feedback; smooth animation cannot compensate for delayed input.

## Weakest-link pass

Inspect the weakest visible region directly and record the evidence and consequence. Include other weak points where they threaten the primary experience.

Fix the responsible system, not isolated pixels.

The result is not ready while one obvious quality cliff exposes the rest as unfinished.

## Ten-second veto

Inspect the rendered first useful viewport separately on desktop and mobile before considering the implementation rationale. Record what attracts attention first and whether it should. Name what first looks generic, awkward, unnecessary, cheap, detached, over-described, under-resolved, or inconsistent. Look for small supporting elements competing with the primary task, mechanically styled type, controls detached from their targets, the weakest visible region, and anything that needs a designer's explanation to defend.

Use the first impression to direct deeper inspection, without a style score. An unresolved material finding blocks READY.
