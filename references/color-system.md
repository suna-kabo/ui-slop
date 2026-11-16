# Color System

Color direction should come from the product, not from a universal UI Slop palette.

## Separate four layers

Treat these as different systems:

1. **neutral/surface**
2. **accent/interaction**
3. **status**
4. **data/category** when genuinely required

Do not borrow a status hue as the brand by accident.

Positive green does not imply:

- green selection
- green focus
- green navigation
- green brand
- green chart defaults

## No default accent hue

When the project has no brand color, choose accent from the product thesis.

Do not automatically pick blue, purple, green, or any other "safe" model favorite.

For substantial new visual systems, compare at least two rendered palette directions when practical.

A useful comparison changes the color direction materially while keeping the composition stable enough to judge the palette.

## Build roles, not random swatches

A new system typically needs:

- page/canvas
- primary surface
- raised/contextual surface if needed
- divider/border
- primary text
- secondary text
- muted text
- accent solid
- accent subtle
- accent text
- focus
- positive
- negative/destructive
- warning
- information if distinct from accent
- selection
- chart/data roles only when needed

Do not create a status ramp that no component uses.

## Primitive and semantic tokens

If the project supports a token architecture:

- primitives describe values/hues
- semantic tokens describe jobs
- components consume semantic tokens

Prefer `--color-text-secondary` over `--blue-600` in component code.

Do not use a border token as text because the current value happens to look right.

## One color, one meaning

Use the same hue consistently for the same meaning.

If accent and destructive/positive colors are too similar, separate them enough that state does not blur into branding.

Critical meaning must also have text, iconography, shape, placement, or another non-color cue.

## Neutral direction is part of the design

Neutral does not mean charcoal.

Possible neutral worlds include:

- cool white / graphite
- warm paper / ink
- mineral gray / navy
- soft stone / oxblood
- dark aubergine / parchment
- deep navy / mist
- near-black / warm gray

Choose one because it suits the product.

## Dark and light

Do not add both themes automatically.

If both are required:

- give each its own token mapping
- preserve hierarchy, not literal step reversal
- reduce chroma where dark surfaces need it
- recheck every important pair
- keep one switching mechanism

## Contrast

Never invent a numeric contrast result.

If tooling can measure the rendered foreground/background pair, measure it.
If not, say it was not verified.

The accessibility requirement belongs to the Evidence Gate. Color owns the remediation.

## Gradients

Use a gradient only when it contributes to:

- depth
- data encoding
- atmosphere appropriate to the subject
- a deliberate signature moment

Do not use gradients as a shortcut for "premium."

## Color convergence test

Before final acceptance ask:

- Would I choose nearly this palette for an unrelated product?
- Is the accent color carrying too many unrelated meanings?
- Did positive/negative status hues accidentally define the whole brand?
- Does the palette still make sense if the product logo disappears?

If the palette feels like a model default, revisit the direction.
