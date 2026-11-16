# Typography System

Typography is one of the strongest signals that an interface was actually art-directed.

A readable font can still make the whole product feel generic.

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

Examples:

- warm humanist sans + restrained numeric style
- soft grotesk with no mono except identifiers
- expressive display face + calm utility sans
- narrow technical sans + open body sans
- serif-led reading system + restrained sans controls

Do not audition two almost-identical sans fonts and call it exploration.

## Product roles

Possible roles:

- display/identity
- task title
- section
- body
- control
- metadata
- numeric
- identifier/code
- caption
- collection/promotional title

Not every product needs every role.

Do not let "large bold sans" carry the entire hierarchy.

## Small-size survival

Test:

- 12–14px controls
- 14–16px body
- changing numbers
- long names
- punctuation
- mixed case
- non-English content if relevant
- mobile rendering

A display face can fail in dense UI.

## Numerals

Use tabular numerals where changing values need stable alignment.

Do not force mono onto every number.

A proportional UI face with tabular numeral features may feel more refined than a monospace family in every data cell.

Use mono when identifiers, code-like values, or product voice justify it.

## Weight and width

Use the smallest set of weights that creates the hierarchy.

Avoid 700/800 everywhere.

Variable font axes can help when they materially improve density, emphasis, responsiveness, or identity.

Do not animate font axes merely because possible.

## Production behavior

- prefer WOFF2 when self-hosting
- load only used weights/styles
- verify licensing
- avoid synthetic bold/italic when it distorts the face
- minimize layout shift
- set useful fallbacks
- test fallback metrics
- use `font-variant-numeric: tabular-nums` where appropriate
- use `text-wrap: balance` selectively for short headings
- use `text-wrap: pretty` selectively for short prose
- use `overflow-wrap: break-word` for hostile tokens
- keep important truncated content recoverable
- keep mobile inputs browser-safe
- set document `lang`
- handle mixed direction with `dir` / `bdi`

## Display type does not rescue generic structure

A giant headline does not make a generic shell authored.

On Workflow surfaces, display type must communicate task-critical state or genuine product identity.

Do not add slogans merely because the page looks empty.

## Emotional role

For identity-heavy products, test whether typography contributes:

- warmth
- energy
- precision
- nostalgia
- softness
- speed
- collectibility
- intimacy

If the product should feel cared for and the type feels like a browser default, the system is unfinished.

## Final type test

Ask:

- Would I choose this same family for three unrelated products?
- Is it helping the product voice?
- Did I compare a materially different direction?
- Are small UI states still excellent?
- Do numbers behave properly?
- Does the type feel intentionally selected?

If not, revisit it.
