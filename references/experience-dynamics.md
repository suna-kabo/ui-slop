# Experience Dynamics

Use this when the product contains meaningful interaction beyond ordinary form submission or static navigation.

The goal is not more motion. The goal is to design how the product responds to attention, selection, manipulation, traversal, interruption, completion, and return.

## Start from domain verbs

Name what users actually do to domain objects before choosing effects.

Examples include inspect, compare, trace, scrub, arrange, tune, annotate, queue, group, collect, revisit, follow, and manipulate.

The useful question is:

> What does this user do to this object, and what should the rest of the product do in response?

Do not turn a verb list into a component library.

## Choose the interaction model before motion

When behavior is materially open, compare interaction models that differ in how the user manipulates or traverses the domain, not in animation style.

Possible relationship patterns can include anchored context, traversal, focus transformation, direct manipulation, or another product-specific model. These are examples, not defaults.

Choose based on task frequency, content, consequence, input modes, and the product's conceptual model.

Do not jump from "detail opens" to "fade + slide".

## Interaction logic creates consistency

Consistency should come from:

- the same object behaving predictably
- cause and result remaining legible
- stable state ownership
- coherent spatial rules
- similar consequences receiving similar feedback
- return behavior matching entry behavior

Consistency should not come from giving every state change the same effect.

## Behavioral Craft

Behavioral Craft describes the quality of the user's control over an interaction. It is not an Apple aesthetic and it does not prescribe spring values, timing bands, scale factors, or gesture thresholds.

Use only the properties relevant to the domain:

### Prompt response

Important input should acknowledge promptly enough that the user understands it was received. Completion may take longer, but feedback should not wait unnecessarily.

### Continuous control

When users directly manipulate a spatial or time-based object, the representation should normally track meaningful input continuously rather than hiding the result until release.

Do not force direct manipulation where a deliberate confirmation step is safer or clearer.

### Interruptibility

If an interaction is long enough to be meaningfully interrupted, user input should not be trapped behind choreography. Interruption should resolve to a coherent current state.

### Reversal and retargeting

Where appropriate, reversal or retargeting should continue from the current visible state rather than restarting an unrelated canned sequence.

### Spatial continuity

Movement or transformation should preserve the relationship the user is trying to understand. Enter and return behavior should not imply contradictory origins.

### Boundary behavior

Edges, limits, invalid targets, and completion should provide intentional feedback. A hard stop, resistance, snap, confirmation, or no movement can all be correct depending on the domain.

### Repeated-use comfort

A behavior that delights once can become friction on the tenth use. High-frequency work should not wait behind decorative transitions or repeated ceremony.

These are review questions, not a universal physics engine.

## Reactive depth

When the user expresses interest in an object, decide which regions should remain still and which should re-rank, filter, reveal, compress, expand, re-anchor, update comparison context, or expose a next action.

Do not make everything react. Reactivity should reduce the cost of understanding the new context.

## Surface transformation

Some task changes deserve a different spatial model rather than content replacement inside fixed boxes.

Examples can include comparison taking over the working region, selected objects gaining room while context compresses, relationship traversal re-anchoring the workspace, or mobile changing interaction mode rather than stacking desktop panels.

Do not transform layout merely to look dynamic.

## Direct manipulation and locality

For high-frequency spatial or time-based edits, ask whether the action belongs on or next to the object, in persistent contextual controls, or in manipulation of the representation itself.

Keep precise alternatives and keyboard/touch access where appropriate.

## Motion topology

Motion is one possible expression of interaction logic.

Before choosing it, answer:

1. What changed?
2. What caused it?
3. What remains the anchor?
4. What relationship should become clearer?
5. What should the eye understand first?
6. Does motion improve that understanding?

Implementation may use spatial movement, shared-element continuity, reflow, crop or mask, relationship drawing, material change, focus/depth change, or no animation.

These are capabilities, not defaults.

## Temporal hierarchy

Sequence only when it explains cause and result, parent and child, selection and related context, before and after, or traversal and destination.

Do not stagger every list or animate every changed element merely because it looks polished.

The task should not wait behind choreography.

## Interaction vocabulary collapse

Investigate when unrelated products repeatedly use the same mechanics, such as:

- every hover lifts or enlarges
- every image zooms
- every detail fades and translates
- every selected object gets the same accent treatment
- every route uses the same slide direction
- every mobile view collapses into the same sheet pattern

A single occurrence can be correct. Repetition without a domain reason suggests effect-first design.

## Verification

Operate the primary workflow and record a state sequence.

Check:

- relationship clarity
- orientation
- next-action locality
- direct-manipulation quality where relevant
- interruption or reversal where relevant
- touch and keyboard equivalents
- reduced-motion behavior
- repeated-use efficiency
- whether unrelated state changes replay meaningful motion

Use `interaction-contracts.md` for a consequential interaction and `browser-qa.md` for rendered evidence.
