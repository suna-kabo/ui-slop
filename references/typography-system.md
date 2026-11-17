# Typography System

Typography is one of the strongest signals that an interface was actually art-directed.

A readable font can still make the whole product feel generic.

Read `presentation-rhythm.md` when typography and density are tightly coupled.

## Start from voice

Before choosing a family, describe the typographic voice.

Useful dimensions:

- soft ↔ sharp
- playful ↔ formal
- technical ↔ human
- compact ↔ open
- contemporary ↔ archival
- neutral ↔ expressive
- geometric ↔ calligraphic
- quiet ↔ energetic

Choose a direction that supports the product.

## Convenience is not a design reason

Arial, Helvetica, Segoe UI, Roboto, Inter, SF-like system sans, and similar neutral families can be correct.

They should not win an open-ended substantial design merely because:

- they already exist
- they are safe
- the agent knows them
- they render everywhere
- they are common in SaaS

If the product should feel authored, audition a direction with more character before settling on a generic neutral.

Keep sensible generic fallbacks.

## Audition directions, not names

For substantial new visual systems, compare at least two materially different typographic directions when practical.

A direction includes:

- family/pairing
- weight strategy
- width/size strategy
- numerals
- case
- tracking
- line height
- heading/body/control relationship

Do not audition two almost-identical sans fonts and call it exploration.

## Use role economy

Start with the fewest roles that make hierarchy unmistakable.

A working product often needs only:

- primary/task title
- body/reading
- controls/labels
- metadata/data
- optional identifier or display role when the content requires it

Add a role only when it performs a job the existing system cannot perform clearly.

Do not create a special microtype style for every semantic subtype.

Repeated roles should remain consistent across screens and states.

## Avoid typographic semantic collapse

Treat this as a generated-UI failure mode:

- many unrelated roles become tiny uppercase labels
- condensed uppercase + tracking carries most of the hierarchy
- metadata, section headings, captions, status, and provenance all look alike
- mono is used broadly because the product contains data

Consistency should come from the system, not from turning secondary information into one visual texture.

## Reading comfort and small-size survival

Primary reading text should normally remain around ordinary browser body scale or equivalent unless the product has a strong dense-interface reason.

Dense controls and metadata may be smaller when genuinely secondary.

Test the rendered face at real scale with:

- long names
- prose
- changing numbers
- punctuation
- mixed case
- non-English content when relevant
- mobile
- 200% text/zoom

Do not assume a nominal size proves readability.

If the majority of visible working copy on desktop is around 12px or smaller, inspect whether the layout is buying density with legibility loss. This is a warning, not a universal numeric ban.

## Numerals

Use tabular numerals where changing values need stable alignment.

Do not force mono onto every number.

A proportional UI face with tabular numeral features may feel more refined than a monospace family in every data cell.

Use mono when identifiers, code-like values, or product voice justify it.

## Weight and width

Use the smallest set of weights that creates the hierarchy.

Avoid heavy weight everywhere.

Variable font axes can help when they materially improve density, emphasis, responsiveness, or identity.

Do not animate font axes merely because possible.

## Production behavior

- prefer efficient web font formats such as WOFF2 when self-hosting
- load only used weights/styles
- verify licensing
- avoid synthetic bold/italic when it distorts the face
- minimize layout shift
- set useful fallbacks
- test fallback metrics
- use tabular figures where appropriate
- keep important truncated content recoverable
- keep mobile inputs browser-safe
- set document language
- handle mixed direction when relevant

## Display type does not rescue generic structure

A giant headline does not make a generic shell authored.

On Workflow surfaces, display type must communicate task-critical state or genuine product identity.

Do not add slogans merely because the page looks empty.

## Final type test

Ask:

- Would I choose this same family for three unrelated products?
- Is it helping the product voice?
- Did I compare a materially different direction?
- Are role distinctions clear without a forest of micro-labels?
- Is body/reading text comfortable at real scale?
- Do numbers behave properly?
- Did typography solve hierarchy, or merely squeeze more content into the viewport?

If not, revisit the system.
