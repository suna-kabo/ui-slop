# Semantic Diversity

A coherent design system should make different meanings feel related.

It should **not** make different meanings look identical.

Use this reference when labels, badges, chips, metadata, annotations, statuses, captions, filters, and alerts begin collapsing into the same component vocabulary.

## The failure mode: semantic-to-component collapse

This happens when the system starts with a component and forces many meanings into it.

Examples:

- campaign metadata → tiny uppercase label
- artwork credit → tiny uppercase label
- announcement heading → tiny uppercase label
- preorder → badge
- in stock → badge
- archive → badge
- optional → badge
- category → badge
- filter → pill
- navigation → pill

The page may be consistent but still feel generated because one visual sentence is repeated for unrelated meanings.

## Start from semantic role

Before choosing a component, classify the information.

Possible roles:

- identity / title
- campaign or collection mark
- status
- availability
- timeline event
- category
- source / provenance
- caption / credit
- annotation
- warning / exception
- filter
- selection
- action
- navigation
- relationship
- progress
- ownership
- quantity
- comparison

Different roles may share typography or color tokens without sharing the same shape.

## Choose an expression channel

Meaning can be expressed through more than a badge.

Possible channels:

- wording
- type style
- hierarchy
- position
- alignment
- color
- iconography
- line / divider
- image treatment
- shape
- spatial attachment
- motion
- timing
- progressive disclosure
- relationship to another object
- persistent state change

Ask:

> Which channel communicates this meaning most naturally?

Do not automatically answer "a pill".

## Status is not one component

Different statuses can deserve different treatments.

Example for commerce:

- preorder → release date / timeline / attached order window
- in stock → quiet fulfillment indicator
- low stock → quantity pressure or stronger urgency
- sold out → product image and action state visibly change
- upcoming → release date leads
- archive → collection context and purchasing controls change

The system can remain coherent through shared type, spacing, color roles, and motion.

## Repetition budget

Repeated visual forms are useful when they help scanning.

Use repetition deliberately for:

- rows in the same list
- statuses of the same semantic class
- comparable metrics
- repeated actions
- navigation peers

Question repetition when the same form appears across unrelated semantic classes.

During browser review, identify the most repeated visual treatment.

Ask:

- How many different meanings does it carry?
- Are those meanings actually peers?
- Would removing one component force a more natural expression?
- Is consistency helping recognition or erasing distinction?

## Consistency without sameness

Good consistency can come from:

- shared type family
- spacing rhythm
- icon language
- interaction timing
- color role
- line weight
- alignment
- surface material

Not every label needs the same container.

Not every state needs the same badge.

Not every annotation needs uppercase tracking.

## Final semantic audit

List the visible semantic roles on the first important viewport.

If three or more unrelated roles use the same visual component without a strong scanning reason, revisit the system.
