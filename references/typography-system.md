# Typography System

Typography is part of product structure, not a finishing layer.

## Default character

When no brand type system is supplied, prefer a rounded or humanist UI face with:

- mature softness
- strong small-size readability
- generous x-height
- clear counters
- distinct 1 / I / l and 0 / O
- useful medium and semibold weights
- clear numerals
- good tabular figures when available

Avoid defaulting to:

- harsh industrial grotesks
- exaggerated condensed faces
- editorial serif systems in dense operational UI
- childish rounded fonts
- display fonts used for body UI

## Audition fonts in the actual product

Do not choose a font only because it is popular.

When practical, render at least two or three plausible candidates in the real interface and compare:

- page title
- navigation
- dense table/list row
- small metadata
- numbers
- long labels
- buttons
- mobile view

Judge rhythm and legibility, not only personality.

## Hierarchy

Create hierarchy through a controlled combination of:

- size
- weight
- contrast
- spacing
- case
- line-height

Do not rely on font size alone.

Avoid giant page titles in working software unless the task genuinely benefits from them.

## Numeric data

Use tabular numerals where column comparison matters.

Align decimal or percentage information consistently when practical.

Do not let a decorative font choice damage the readability of numbers.

## External fonts

If adding a font:

- verify licensing
- prefer WOFF2
- self-host when appropriate
- minimize weights/files
- use variable fonts when they reduce cost without browser issues
- preload only what materially improves rendering
- provide sensible fallbacks
- avoid visible layout shift

## Scaling

The interface must remain usable with 200% text scaling.

Do not hide essential actions behind fixed-height containers.

Avoid text that only fits because the default zoom is small.
