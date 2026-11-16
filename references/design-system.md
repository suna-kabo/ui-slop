# Design System

Use this reference when creating a new UI language or consolidating an inconsistent frontend.

The goal is not to build a giant design-system bureaucracy. The goal is to make the product feel like one deliberate system.

## 1. Start with product hierarchy

Define:

- primary workflow
- secondary workflows
- utility actions
- diagnostics / implementation detail
- contextual detail surfaces

Visual weight should follow this hierarchy.

Do not give every feature the same visual importance.

## 2. Establish tokens before screen-by-screen polish

Define a compact set of tokens for:

- canvas
- primary surface
- raised/contextual surface
- primary text
- secondary text
- muted text
- interaction accent
- positive
- negative
- warning
- information
- focus
- border/divider
- spacing
- radius
- control height
- type scale
- motion duration
- easing

Use semantic names rather than page-specific names.

## 3. Opinionated fallback palette

When no brand direction exists, begin from a restrained neutral system:

- 85–90% neutral charcoal / near-black / gray / off-white
- 10–15% semantic or interaction color
- subtle surface deltas instead of heavy card boundaries
- soft off-white text on dark surfaces
- muted secondary text
- one restrained cool interaction accent
- muted green positive
- muted coral negative
- restrained amber warning

Color should communicate state, hierarchy, focus, or selection.

Avoid decorative color.

## 4. Surface grammar

Do not place every object inside a card.

Choose the lightest separation that works:

1. spacing
2. alignment
3. typography
4. divider/rule
5. subtle background delta
6. bounded surface/card only when the object genuinely needs containment

Avoid nested rounded rectangles.

Use modest radii unless the product explicitly calls for a softer visual language.

## 5. Typography grammar

When no brand type system exists, prefer a rounded or humanist UI family.

Use a small number of roles:

- page/task title
- section title
- primary body/data
- secondary metadata
- control text
- numeric/data emphasis

Do not create hierarchy by endlessly increasing font sizes.

Use weight, contrast, spacing, and alignment together.

## 6. Interaction states

Every interactive element should have coherent states where relevant:

- default
- hover
- pressed
- selected
- focus-visible
- disabled
- loading
- error/success feedback

Do not invent a new visual language for each component.

Selection should feel stable.

Press feedback should be immediate.

Focus must be visible.

## 7. Motion grammar

Use motion for:

- continuity
- state change
- navigation
- selection
- contextual depth
- cause and effect

A useful default family:

- hover / press: 100–160ms
- selection / tab indicator: 120–180ms
- filter / small state: 140–200ms
- inspector / sheet: 160–220ms
- lightweight page continuity: 160–240ms

Prefer `transform` and `opacity`.

Keep travel small.

The static design can remain humble. Motion may carry more personality.

## 8. Responsive grammar

Do not merely shrink the desktop system.

Define what happens to:

- navigation
- filters
- tables
- inspectors
- toolbars
- secondary evidence
- long labels
- actions
- multi-column comparison

Mobile may use a structurally different representation while remaining visually related.

## 9. System coherence test

Across several unrelated screens, ask:

- Do spacing and type feel related?
- Do selected states speak the same language?
- Do inspectors feel connected to their source objects?
- Do controls share size and feedback logic?
- Is semantic color consistent?
- Does motion use the same timing character?
- Do mobile and desktop feel like the same product?
- Are there local exceptions that should become shared rules?
- Are there shared rules that are forcing bad local layouts?

A good system creates coherence without making every screen identical.
