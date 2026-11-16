# Task Continuity

Use this when the product contains repeated work, browsing, selection, detail inspection, saved state, nested routes, playback, or any flow where the user is likely to continue from an existing state.

Reactive design answers:

> What changes together?

Task continuity answers:

> After the user acts, what is the natural next step, where is it, what context survives, and how do they return?

A surface can have correct shared state and still interrupt the task.

## 1. Design the task chain, not only the current screen

For each primary workflow, write the likely sequence.

Examples:

Operations:

hub selected
→ compare with network
→ inspect exceptions
→ move to next hub
→ keep comparison context

Store:

collection chosen
→ inspect product
→ follow related product
→ return through previous product or rack
→ continue browsing without rebuilding filters

Music:

draft selected
→ preview version
→ compare another version
→ change stage
→ continue playback while browsing

The interface should support the chain, not merely make every individual step possible.

## 2. Decide state lifetime explicitly

Important state should not survive or disappear by accident.

Classify meaningful state into one of these lifetimes.

### Transient

Exists only while a temporary interaction is open.

Examples:

- hover preview
- tooltip
- open menu
- temporary search suggestions

### View-local

Belongs to the current working view.

Examples:

- a local sort
- an expanded subsection
- a temporary comparison mode

### Navigation continuity

Should usually survive entering detail and returning.

Examples:

- filters
- selected object
- sort
- scroll position
- active collection
- active time range

### Session continuity

Should usually survive related navigation within the session.

Examples:

- current playback
- queued item
- active workspace
- current operating shift

### Persistent

Should survive reload or later visits when the product contract supports it.

Examples:

- favorites
- user preferences
- saved views
- durable drafts

Do not persist everything.

Persistence has cost:

- stale context
- surprising return states
- privacy implications
- hard-to-reset interfaces

Make the lifetime decision because it helps the task.

## 3. Keep likely next actions local

When the user selects or activates an object, the next likely high-frequency action should normally be available near that selected context or through a persistent contextual control.

Bad recurring pattern:

select row low in a long ledger
→ only Inspect action remains far above
→ scroll away from the selected row
→ inspect
→ close
→ lose spatial position

Better options may include:

- inline contextual action
- row-level action
- selected-object dock
- sticky contextual bar
- nearby detail affordance
- keyboard action tied to the selected object

Do not duplicate every action everywhere.

Use locality for actions that are frequent, consequential, or naturally follow selection.

## 4. Define the return contract

Every transient or route-level detail interaction should have a deliberate return result.

For each important entry point, decide:

- what closes or goes Back
- which route is restored
- which filters remain
- which selection remains
- which sort remains
- which scroll position returns
- where keyboard focus returns
- whether playback/ongoing work continues
- whether nested detail returns to previous detail or skips directly to the list

Examples:

catalog → product → Back
should usually restore the exact catalog context.

product A → related product B → Back
may reasonably return to product A before returning to the catalog.

saved drawer → product → Back
should have an intentional answer: return to Saved, return to underlying browse context, or another clearly designed destination.

A direct deep link has no previous in-product context. Give it an explicit fallback.

## 5. Design browse topology, not only filters

Search, sort, and facets are utilities.

They are not a complete discovery model for a browse-heavy product.

Map the meaningful objects as a graph.

Example:

collection
↔ release
↔ character
↔ product
↔ related product
↔ archive
↔ saved item

Then decide which edges deserve visible paths.

Useful browse paths may include:

- collection → products
- character → goods
- product → collection
- product → related product
- release → upcoming items
- archive → previous collection
- saved item → related discovery

Do not force every cross-object exploration through a dropdown or reset-to-catalog step.

The topology should shape page composition.

If every browse-heavy product becomes:

hero
→ filters
→ equal-width grid
→ detail
→ related strip

challenge the structure even if each individual component is polished.

## 6. Make important relationships actionable

Showing a relationship is not always enough.

If users are likely to follow or compare it, expose an appropriate action.

Examples:

- a version relationship may need preview/play, not only a version name
- a selected hub may need inspect/compare nearby
- a collection reference may need a direct path back into that collection
- an exception marker may need a route to the related incident when that supports the task

Do not turn every relationship into a button.

Actionability should follow frequency and user intent.

## 7. Preserve mode context deliberately

Saved, Archive, Search, Collections, Inspect, Compare, and similar modes can behave as:

- overlays on the current context
- nested routes
- sibling routes
- separate workspaces

Choose intentionally.

When switching modes, decide whether the previous state is:

- preserved underneath
- stored for Back
- cleared
- transformed into the new mode

Do not let implementation convenience make this decision.

## 8. Responsive continuity

A flow that works on desktop can break on mobile even when the layout technically fits.

Check whether:

- the selected object remains visible
- the next action remains reachable without unnecessary backtracking
- sticky controls do not duplicate or contradict detail controls
- touch has a persistent equivalent to hover
- returning restores a meaningful scroll/focus position
- bottom docks represent current state rather than repeating it confusingly

Responsive design includes continuity, not only reflow.

## 9. History and URL semantics

Use browser history when it represents meaningful navigation.

Good candidates:

- route-level detail
- collection/mode changes users expect Back to reverse
- nested product/detail exploration
- deep-linkable analysis state when product requirements support it

Not every transient filter or popover needs a URL.

When state is not in the URL, still define whether reload should restore it.

## 10. Test the second and third action

First-pass QA often proves only that features exist.

For repeated work, test from live state.

Example:

1. filter
2. select
3. inspect
4. return
5. select the next object
6. inspect again

Or:

1. enter collection
2. open product
3. follow related product
4. Back
5. Back
6. open Saved
7. return to the prior browse context

Observe:

- unnecessary scroll distance
- re-entered filters
- lost selection
- unexpected mode resets
- duplicated controls
- focus landing away from the task
- history skipping meaningful intermediate context

## 11. Completion questions

Before shipping a multi-step product, ask:

- What is the most likely next action after selection?
- Is it located where the user is now?
- Which state survives detail and Back?
- Which state survives reload, and why?
- Does nested detail return through meaningful intermediate states?
- Are filters doing discovery work that should belong to richer browse paths?
- Can the user act on the relationships that matter?
- Does the same task remain coherent on touch and keyboard?

If the user can complete every step but repeatedly has to reconstruct context, the interface is functionally complete but interaction-incomplete.
