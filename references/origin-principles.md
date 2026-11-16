# Origin Principles

UI Slop was generalized from a successful ground-up rebuild of a dense research product.

The reusable lessons were:

- protect product semantics, not accidental presentation
- simplify the interface rather than weakening domain logic
- treat inherited presentation as disposable when rebuild authority is granted
- establish user jobs before choosing components
- reject generic dashboard defaults
- remove defensive and implementation-facing copy
- make typography, layout, spacing, and motion part of one system
- verify in the actual rendered product
- let accessibility and performance shape the design
- update obsolete presentation-specific tests without weakening behavior
- reject work that is merely clean

Later benchmark work exposed another failure mode: a strong product-specific visual world can become a model default when generalized too literally.

UI Slop therefore does **not** preserve the original product's charcoal, green, density, or typography as universal defaults.

The skill preserves the decision process, not the old aesthetic.


## Structural convergence lesson

The v1.2 benchmark exposed a deeper failure mode than palette convergence.

Unrelated products used different colors but still shared:

- eyebrow + large headline + subtitle
- detached controls
- generic main + right-rail structure
- rounded inspector cards
- similar mobile sheet behavior
- overly safe typography

This showed that anti-slop must challenge **structure, type, copy, and interaction fingerprints**, not only palette.

v1.3 therefore preserves the decision process while explicitly rejecting repeated silhouettes and convenience typography.


## BEATLINE fresh-agent lesson

A fresh-agent fandom store test showed that strong art direction can coexist with a subtler generated pattern:

- campaign metadata
- announcement labels
- artwork captions
- product availability

were repeatedly expressed through a small set of uppercase labels and badges.

This revealed **semantic-to-component collapse**.

The same test also showed that content relationships were often presented statically rather than through coordinated shared-state behavior.

v1.6 therefore adds Semantic Diversity, Reactive Surfaces, and Information Relationship Map guidance.
