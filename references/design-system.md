# Design System

A design system should make screens feel related without forcing identical composition.

## Minimal token set

Define only what the product uses.

Possible token groups:

- color roles
- typography roles
- spacing steps
- radius
- border/divider
- elevation
- control sizes
- focus
- motion duration/easing
- z-index/layer roles
- content widths

Avoid dozens of tokens before any UI proves they are needed.

## Semantic ownership

Components should consume roles:

- background canvas
- background surface
- text primary
- text secondary
- border subtle
- accent solid
- selection
- focus
- destructive

Avoid component names in global semantic tokens unless the role is genuinely component-specific.

## Component consistency

Shared grammar should cover:

- control height
- label placement
- state feedback
- focus
- spacing rhythm
- icon sizing
- selected state
- error presentation

Do not force unrelated workflows into the same card component.

## Dark/light variants

If multiple appearances exist, token remapping should preserve semantic hierarchy.

Do not reverse a light palette mechanically.

## Documentation timing

For a brand-new visual world, let the first implementation test the system before treating every token choice as permanent.

After the direction proves itself, document the stable system.

For an established product, preserve and extend the existing system unless the user requests replacement.
