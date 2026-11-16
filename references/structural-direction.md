# Structural Direction

Use this before styling when the product shell is new, replaceable, or clearly generic.

## Start from domain objects

List the objects users actually think about.

Examples:

- fulfillment: orders, stages, exceptions, carriers, bins
- research: hypotheses, comparisons, evidence, movement, notes
- travel: days, places, routes, time, distance, reservations
- music: tracks, waveform, versions, takes, notes, playback state
- store: collections, characters, releases, drops, stock, variants

Ask:

> Which object should define the page geometry?

A domain object should influence the composition, not merely appear inside a generic card.

## Create at least three structural concepts

For substantial open-direction work, outline at least three materially different spatial models before locking the shell.

Examples:

- timeline / route
- split comparison canvas
- dense indexed ledger
- stage flow with attached exceptions
- spatial map
- object shelf / carousel
- full-canvas artifact
- narrative sequence
- constellation/relationship field
- catalog spread

Avoid three variants that are all:

header + hero + cards + right rail

## Low-style first

Judge structure before styling.

Use any lightweight method:

- text wireframe
- unstyled DOM
- grayscale HTML
- rough boxes
- quick rendered sketch

Do not let gradients, fonts, imagery, shadows, or radius rescue weak structure.

## Workflow surfaces resist landing-page grammar

For Workflow surfaces, treat these as suspicious unless task-critical:

- large slogan hero
- eyebrow + headline + subtitle
- decorative opening statement
- detached top-right controls
- giant empty introduction
- marketing CTA hierarchy

The user's task should begin near the first meaningful viewport.

## Controls belong near what they control

Filters, sort, time range, mode switch, and actions should sit where their relationship is obvious.

A segmented control floating in a page corner is not good hierarchy merely because it looks tidy.

## Detail surfaces

Do not default to a right-side rounded card.

Choose among:

- inline expansion
- contextual column
- object-anchored detail
- drawer/sheet
- popover
- split pane
- focus mode
- detail route
- list replacement with context-preserving navigation

Base the choice on:

- frequency
- required width
- comparison needs
- context preservation
- mobile behavior

## Silhouette test

Remove or ignore:

- color
- copy
- icons
- imagery
- brand name

Look only at geometry.

Ask:

- Could this be an unrelated SaaS product with labels swapped?
- Does the domain still influence the silhouette?
- Is the strongest shape just cards/right rail?
- Does the product have its own spatial model?

If unrelated products produce the same silhouette, reject the structure.

## Structural lock

Proceed to detailed visual styling only when:

- primary job is obvious
- domain objects shape the page
- desktop/mobile transformations are intentional
- unnecessary landing-page grammar is gone
- controls are spatially related to their targets
- silhouette feels product-specific
