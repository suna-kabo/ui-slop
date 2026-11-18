# Real Content First

Use representative content before structure locks.

The purpose is not to create exhaustive edge-case fixtures. It is to prevent an idealized placeholder set from choosing the layout for the real product.

## Build a small content distribution

Include only variations that materially affect the surface, such as:

- short and long names
- similar-looking identifiers
- missing optional fields
- mixed statuses or record types
- zero, few, normal, and dense counts
- long notes or evidence
- awkward dates, numbers, units, or localization
- disabled or unavailable actions
- realistic relationships between objects

Do not invent irrelevant failures.

## Use content to test structure early

Before locking a grid, list, timeline, inspector, canvas, or comparison surface, ask:

- does long content change column or control geometry?
- does missing content create dead holes?
- do similar names require stronger identifiers?
- does dense content make the chosen representation unreadable?
- does the layout still expose the primary decision when multiple statuses coexist?
- does mobile require a different representation rather than smaller text?

A late overflow fix is not equivalent to designing from real variation.

## Keep fixtures semantic

Fixtures should describe product objects and relationships, not visual templates.

Good fixture:

- shipment with long destination
- delayed handoff
- missing optional note
- two similarly named hubs

Bad fixture:

- `cardVariant: compact`
- `usePill: true`
- `heroStyle: editorial`

The fixture must not hard-code the design answer.
