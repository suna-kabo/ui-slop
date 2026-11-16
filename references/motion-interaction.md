# Motion and Interaction

Motion should explain what changed and where it came from.

## Motion grammar

Define a small vocabulary for the product.

Possible roles:

- hover/press feedback
- selection movement
- filter/list continuity
- inspector/detail opening
- navigation continuity
- page/surface transition
- staged entrance for rare moments
- data state change

Do not give every component a unique animation.

## Timing

Useful starting points:

- hover/press: 100–160ms
- selected indicator: 120–190ms
- local state/filter: 140–210ms
- sheet/inspector/detail: 160–230ms
- lightweight page continuity: 160–260ms

Adjust for travel distance and frequency.

Frequent actions should feel faster than rare staged moments.

## Travel

Keep common movement small.

Examples:

- row/content affordance: 2–4px
- detail transition: roughly 6–16px
- press scale: subtle, around 0.98–0.995 when appropriate

Large travel is for genuinely spatial transitions, not decoration.

## Interruptibility

For interactive state changes, prefer CSS transitions or another mechanism that can reverse smoothly when the user changes intent.

Use keyframes for staged sequences that have a real beginning and end.

## Properties

Prefer transform and opacity for high-frequency motion.

Use blur, clip, mask, shadow, or backdrop effects only when:

- the direction calls for them
- they remain smooth on target hardware
- reduced motion has a sensible alternative

Avoid layout thrashing.

## One authored moment

A single strong interaction can define the product more effectively than scattered micro-effects.

Examples:

- contextual detail grows from the selected object
- active navigation indicator glides across a stable baseline
- a meaningful flow animates through stages after refresh
- a media control uses motion grounded in the content

Do not add a "signature animation" if the product benefits from near-static precision.

## Data movement

Animate data only when it helps users understand:

- reorder
- rank change
- insertion/removal
- state transition
- filter result change

Do not animate hundreds of rows just because data changed.

## Reduced motion

Respect `prefers-reduced-motion`.

Remove:

- unnecessary travel
- parallax
- staged cascades
- ambient loops

Keep:

- immediate state feedback
- focus
- selected state
- necessary visibility changes

## Motion test

Ask:

- Is the user learning something from the motion?
- Is it interruptible?
- Is it faster than the task?
- Does it preserve spatial context?
- Would removing it make the product harder to understand?
- Does reduced motion remain complete?

If not, simplify it.
