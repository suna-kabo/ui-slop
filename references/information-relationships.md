# Information Relationship Map

Use this before detailed component design when a product has several connected data or content regions.

The map can be a short text artifact. It does not need to be visible to users.

## Define the graph

Write the important objects and relationships.

Example:

Collection
- contains Products
- features Characters
- has Release Events
- belongs to Campaign
- relates to Archive Collection

Product
- belongs to Collection
- features Character
- has Availability State
- has Release Date
- relates to Products

This prevents the UI from becoming a set of disconnected cards.

## Mark relationship strength

Classify relationships:

- primary: should usually be visible or reactive
- secondary: reveal on selection/detail
- tertiary: deep detail only

Do not show every relationship all the time.

## Place frequently revisited relationships

From an already selected, filtered, or resumed state, identify the next relationship the user is likely to inspect or follow again.

When that relationship is central to the task, put its value or an appropriate contextual entry near the current working context.

Use an extra surface when it supports a distinct inspection or prevents clutter.

For action locality, state lifetime, nested detail, browse paths, and return behavior, read `task-continuity.md`.

## Choose where the relationship lives

Relationships can be communicated through:

- adjacency
- shared axis
- connecting line
- shared color/category
- synchronized selection
- filtered list
- timeline
- detail expansion
- breadcrumb/path
- map
- ordering
- transition

Prefer the representation that matches the domain.

## Avoid duplicate representation

If a relationship is already obvious spatially, do not repeat it as a badge.

If selection already highlights availability in a release timeline, a persistent status chip may be unnecessary.

If a product image visibly changes to sold-out treatment and the action is disabled with clear text, another "SOLD OUT" badge may add little.

## State ownership

Decide which object owns each state.

Bad:

- filter component owns filter state
- chart owns selected ticker
- table owns another selected ticker
- detail owns a third copy

Better:

- one shared selected object
- each relevant view derives from it

This improves consistency, navigation, and responsiveness.

## Completion test

The UI should help the user understand not only objects, but relationships between them.

If the user can see every fact but cannot understand how the facts connect, the information architecture is incomplete.
