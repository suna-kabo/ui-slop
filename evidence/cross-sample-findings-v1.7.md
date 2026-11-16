# Cross-sample findings for v1.7

UI Slop v1.7 is based on two independent sample sets.

## Sample Set 1

The controlled 12-interface benchmark used three product briefs across Baseline, UI Slop v1.6, Impeccable, and frontend-design.

Blind placement:

- Parcel operations: UI Slop 2nd
- Rhythm merchandise: UI Slop 2nd
- Music sketch workspace: UI Slop 1st

The benchmark validated the v1.6 additions:

- Semantic Diversity
- Reactive Surfaces
- Information Relationships

It also exposed recurring friction after the first successful action.

### Parcel Relay

A selected hub updated comparison state correctly, but the only Inspect action could be outside the viewport after selecting a low row on mobile. Closing detail restored focus to the remote Inspect button rather than the selected row area.

Finding:

- shared state was correct
- action locality and task continuation were weak

### SYNC/RUSH

Product detail preserved filters and focus, but switching through Saved could return to an unfiltered catalog. Related-product detail also skipped the previous product when using Back.

Finding:

- individual detail continuity worked
- mode transitions and nested return contracts were not explicitly designed

### Music workspace

The strongest UI Slop result separated selected draft from currently playing draft and preserved transport state across navigation.

Finding:

- deliberate state ownership and continuity materially improved the product
- related versions were visible, but not all relationships were equally actionable

## Sample Set 2

A second set of four fresh Chat generations used the same rhythm-store brief.

Important methodology note:

- Impeccable v4.9.2 instructions were actually loaded.
- The requested frontend-design skill was unavailable in that chat, and the generator explicitly reported that no substitute design skill was used.
- Therefore Sample Set 2 is useful as another generation sample, but not as a valid four-skill ranking.

The PULSE//BREAK output most clearly reflects the UI Slop v1.6.1 guidance.

It demonstrated several improvements relative to Sample Set 1:

- collection selection changes the visual/content world
- character browsing is a first-class path
- release context remains attached to collection context
- previous collections are exposed as a browse path
- product detail snapshots collection/filter state
- nested related-product detail creates another history entry
- Back can return through the previous product before returning to browse
- Saved is an overlay, so the underlying browse context is not destroyed
- favorites persist separately from temporary browse state

These are positive examples of task continuity.

## Repeated evidence across both sets

The strongest reusable conclusion is not another visual rule.

It is that UI Slop needs an explicit model for continuity after the first action.

The model should cover:

1. Action Locality
2. State Lifetime
3. Return Contract
4. Browse Topology
5. Relationship Actionability
6. Responsive continuity

## What is not being added

The samples do not justify:

- a mandatory store layout
- mandatory sticky docks
- mandatory URL persistence for all filters
- mandatory inline detail
- a fixed number of browse paths
- more badges, cards, or visual tokens
- copying Impeccable or frontend-design aesthetics

The new rules are behavioral and structural.

## Decision

Promote the v1.6.1 placement/second-pass QA insight into a broader Task Continuity reference.

Keep detailed guidance out of SKILL.md through progressive disclosure.
