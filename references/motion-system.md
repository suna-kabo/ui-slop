# Motion and Interaction System

Motion is part of the interaction model.

Its job is to explain continuity, state change, hierarchy, cause and effect, and spatial relationships.

Do not animate merely to make the product look expensive.

## Character

Good motion should feel:

- immediate
- responsive
- controlled
- context-aware
- slightly expressive when appropriate
- easy to ignore when the user is moving quickly

The static interface may remain visually restrained. Interaction can carry more personality.

## Timing

Useful starting ranges:

| Interaction | Typical duration |
| --- | ---: |
| hover / press feedback | 100–160ms |
| selection / tab indicator | 120–180ms |
| filter or small state transition | 140–200ms |
| inspector / sheet / contextual detail | 160–220ms |
| lightweight page continuity | 160–240ms |

These are guidance, not fixed laws.

Use longer durations only when the user benefits from perceiving spatial movement.

Never make common actions wait for an animation to finish.

## Distance

Keep motion distances small.

Examples:

- interactive row: 2–4px directional response
- page/detail content: roughly 6–14px when directional continuity matters
- press state: subtle compression around 0.98–0.99 scale when appropriate

Large travel should be reserved for genuinely large spatial changes.

## Preferred properties

Prefer compositor-friendly animation:

- `transform`
- `opacity`

Use other properties only when their visual value justifies the layout/paint cost.

Be careful with:

- width / height animation
- large box-shadow animation
- blur and backdrop-filter animation
- continuous gradients
- large fixed elements with expensive effects
- JavaScript animation loops

Avoid layout thrashing.

## Hover

Hover should reveal interactivity without turning every row into a glowing card.

Possible treatments:

- slight text/surface contrast increase
- small translation
- restrained accent rule
- icon/action reveal
- sparkline or supporting detail gaining contrast

Do not move content enough to disturb scanning.

## Pressed state

Pressed states should acknowledge input immediately.

Possible treatments:

- subtle compression
- surface darkening/lightening
- short opacity change

Do not use bounce as a default press language.

## Selection

Selection should feel stable and persistent.

Where useful, use shared moving elements rather than recreating unrelated backgrounds for each state.

Examples:

- active navigation underline glides to the selected item
- segmented control highlight moves between options
- selected row identity remains visible when an inspector opens

## Inspectors and detail surfaces

Open detail from a direction that preserves the user's spatial model.

For example:

- right-side inspector enters from the right
- mobile bottom sheet rises from the bottom
- drill-in content moves slightly forward while the originating context remains visually connected

Avoid theatrical travel.

Closing should restore focus and feel like returning to the source object.

## Data changes

Animate data only when motion helps the user understand a change.

Good candidates:

- rank movement
- newly appearing or disappearing filtered records
- state change
- selection continuity

Do not animate hundreds of rows for spectacle.

For large lists, prefer highlighting the changed state over animating every position.

## Page transitions

Page transitions should support orientation, not imitate a presentation deck.

Small opacity + directional transform is usually enough.

Do not delay route readiness.

## Reduced motion

Respect `prefers-reduced-motion`.

Reduced motion should:

- remove travel
- remove unnecessary opacity sequences
- preserve state feedback
- preserve focus
- keep the interface fully understandable

Do not simply increase duration or replace one decorative animation with another.

## Performance acceptance

Inspect motion in the real browser.

Check:

- interaction latency
- scroll smoothness
- long-list performance
- resize behavior
- mobile hardware assumptions
- no long tasks caused by decorative motion

If polish makes the interface feel slower, remove the effect.
