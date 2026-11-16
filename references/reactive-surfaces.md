# Reactive Surfaces and Information Relationships

Responsive layout answers:

> How does this interface adapt to available space?

Reactive design answers:

> What else should respond when the user expresses interest, changes context, or selects data?

Use this for dashboards, research tools, stores, media products, creative tools, maps, operations surfaces, and other products with meaningful relationships between objects.

## Do not add interactivity for decoration

The goal is not more animation, charts, hover effects, or tooltips.

Interaction should reveal a relationship that static composition cannot express as clearly.

Good reactive behavior improves:

- comparison
- causality
- continuity
- orientation
- drill-down
- discovery
- state understanding

## Map shared state before building isolated components

Identify the state that several regions care about.

Examples:

- selected object
- active collection
- active character
- filter set
- time range
- current route
- playback state
- current shift
- selected theme/ticker
- hovered/focused data point
- saved/favorite state
- expanded hierarchy node

Then map which regions should react.

Example:

collection selected
→ campaign artwork changes
→ product shelf changes
→ release timeline changes
→ character emphasis changes
→ related collections change

This is stronger than five components each managing unrelated local state.

## Interest states

Use different interaction states for different levels of user intent.

### Hover / focus

Temporary preview.

Useful for:

- highlighting related marks
- previewing metadata
- revealing a lightweight relationship

Do not hide essential information behind hover.

### Click / tap / keyboard activation

Persistent interest.

Useful for:

- selected object
- cross-filtering
- comparison
- detail
- stable related highlighting

The state should remain until changed or dismissed.

### Route / mode change

Higher-level context.

Useful for:

- collection
- time period
- workspace
- stage
- primary object

Preserve history and return behavior when relevant.

## Linked views

When several views represent the same domain, selection should propagate intentionally.

Examples:

### Data dashboard

Select a category:
- chart highlights it
- table filters or marks it
- summary updates
- comparison baseline remains visible
- details persist

### Research

Select a stock/theme:
- row remains selected
- relative metrics update
- evidence/note updates
- peers become available
- history preserves return context

### Operations

Select a stage:
- throughput context updates
- exceptions filter
- age/SLA distribution updates
- downstream impact is shown

### Store / fandom

Select a collection:
- artwork world updates
- products update
- release calendar updates
- related character emphasis changes
- related collection path updates

### Creative / media

Play/select a draft:
- waveform/playback state updates
- notes remain attached
- stage controls update
- now-playing persists across relevant navigation

## Charts are optional

Do not add a chart simply because the product has data.

Use a visualization only when position, length, area, time, or relationship makes the information easier to understand.

A useful interactive dashboard may contain:

- one chart
- no chart
- a table + linked detail
- a spatial map
- a timeline
- a stage flow
- a relationship graph

The domain chooses the representation.

## Transition data meaningfully

When filtered, sorted, ranked, or time-ranged data changes:

- preserve object identity where possible
- help the user see what moved or disappeared
- avoid reset/flicker that destroys continuity
- do not animate hundreds of rows merely for spectacle

Motion should explain change.

## Responsive interaction

Do not design a desktop-only hover system.

For every important reactive relationship:

- tap/click must work
- keyboard must work
- mobile needs a persistent equivalent
- narrow layouts may move linked information closer together
- hover can enhance but cannot be the only route

## Reactive density

A reactive surface can reduce visual clutter.

Instead of showing every state as a permanent badge/card:

- reveal relevant context when an object is selected
- connect related information through shared state
- update a timeline/rail/context area
- alter the object itself when state changes

Behavior can carry meaning that would otherwise become repeated UI components.

## Relationship audit

Before completion, identify the three most important domain relationships.

For each, ask:

- Can the user discover this relationship?
- Does selection make it clearer?
- Do related regions respond together?
- Is the response persistent enough to understand?
- Does it still work by touch and keyboard?
- Does reduced motion preserve the information?

If the product contains meaningful relationships but every component behaves independently, the surface is probably under-designed.
