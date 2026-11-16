# Asset and Font Sourcing Strategy

Some products can be finished through structure, type, color, and native controls alone.

Others cannot.

Decide the asset strategy before implementation.

## Classify the need

### None

Appropriate when:

- the task is data/control heavy
- imagery would add noise
- identity can live in structure/type/state

### Structural graphics

Examples:

- diagrams
- maps
- route lines
- waveform shapes
- custom separators
- charts with real decision value

These may be generated in code when that is the best medium.

### Product / content imagery

Examples:

- merchandise
- travel places
- album art
- portfolio work
- characters
- editorial photography

If this imagery carries product value, placeholders are not a finished state.

### Illustration / texture / icon system

Use when the product world genuinely benefits from:

- bespoke illustration
- collection motifs
- texture
- custom icon language
- ornamental graphics grounded in the subject

## Finished versus prototype

CSS circles, gradient blobs, and geometric stand-ins are acceptable for:

- wireframes
- structural tests
- early direction demos

They are not automatically acceptable as final art direction for a visual product.

If the user asks for a finished visual surface and suitable tools/assets are available:

- use existing approved assets
- search for licensed/allowed references where appropriate
- generate original assets when permitted
- create a coherent icon/illustration language
- optimize and integrate them

If the required art cannot be produced, disclose that the implementation still contains placeholders.

## Typography sourcing

Before accepting a convenience font:

1. inspect the project's existing fonts
2. inspect locally available fonts when relevant
3. identify whether the chosen face actually fits the product
4. when identity matters and no suitable face exists, use available web/asset tooling to source a properly licensed family when permitted
5. self-host efficient formats where appropriate
6. load only used weights/styles
7. record the source/license in the project when required

Generic fallbacks remain fallbacks.

Do not turn "the environment already had Arial/Inter" into art direction.

## Font audition

For substantial identity-heavy work, compare materially different directions.

Test:

- display identity
- body/control readability
- dense small text
- numbers
- punctuation
- long labels
- mobile
- fallback rendering

## Asset coherence

All assets should belong to one visual world.

Check:

- stroke weight
- corner geometry
- crop behavior
- color treatment
- texture
- line quality
- illustration perspective
- icon fill/stroke language
- motion behavior

Do not mix stock icons, custom line icons, emoji, and unrelated illustration styles without reason.

## Performance

Assets must still meet the product's performance needs.

Use:

- responsive images
- sensible compression
- lazy loading where appropriate
- stable dimensions
- WOFF2 fonts
- reduced motion
- no decorative heavyweight media that harms the task
