# Layout and Responsive Structure

Layout should express relationships before copy explains them.

## Group with spacing first

Use this priority:

1. spacing
2. alignment
3. typography
4. divider
5. surface change
6. bounded card/container

Related content should usually be closer together than separate groups.

A useful starting heuristic is that inter-group space is visibly larger than intra-group space, often around 2×, but optical judgment and the project's spacing scale win.

## Shared edges

Align content to deliberate edges.

Every unnecessary stray edge adds visual noise.

Use logical properties (`margin-inline`, `padding-inline`) for direction-aware UI.

## Order by importance

Put the most important content early in reading order and near the leading edge.

DOM order should remain logical when CSS rearranges the layout.

## Controls and content

Interactive elements must read as interactive through:

- shape
- border
- placement
- state
- known platform patterns

Do not rely on instructional text such as "click a row."

## Breakpoints from failure

Do not choose 768/1024 merely because they are familiar.

Resize until the content or interaction stops working, then transform the layout.

Use container queries for components when appropriate.

## Mobile is a composition

Do not accept:

desktop columns → vertical stack

as the only mobile strategy.

Decide:

- what remains primary
- what collapses
- what becomes a sheet
- what becomes a summary
- what moves into navigation
- what representation replaces a wide table
- which actions become persistent or contextual

## Progressive disclosure

Hidden content needs an affordance.

Use:

- familiar disclosure controls
- contextual navigation
- a visible next item/peek
- clear selected state
- stable detail entry points

Do not hide essential content behind invisible gestures.

## Growth

Test realistic:

- long names
- long numbers
- empty values
- translated strings
- multiple lines
- dynamic counts

Avoid fixed dimensions on text containers when content can grow.

Pseudo-localize when localization is relevant.

## RTL

When the product may support RTL:

- mirror spatial relationships using logical properties
- preserve physical geometry only when it is truly physical
- test reading order
- isolate mixed-direction values when needed

## Scroll

Prefer one primary page scroll.

Nested scrolling is acceptable when the workflow clearly benefits, such as:

- long inspector
- virtualized list
- code/data pane
- split editor

Do not create nested scrollers merely to keep cards visually equal.
