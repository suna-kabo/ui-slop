# UI Slop v1.8 validation report

## Evidence basis

v1.8 is based on:

- the v1.6 controlled 12-interface benchmark
- the v1.6.1 continuity probe
- the second fresh-Chat store sample set
- the v1.7 Fieldnote research comparison against Impeccable
- direct inspection of UI Slop v1.7 source and the generated Fieldnote CSS/JS

## Key evidence

Rendered 1440×900 first-viewport typography measurement:

- UI Slop Fieldnote: 73.3% of visible text characters at 12px or smaller; 22.1% at 15px or larger; 48 visible interactive elements
- comparator Fieldnote Atlas: 44.6% at 12px or smaller; 50.3% at 15px or larger; 29 visible interactive elements

The UI Slop output also reproduced the v1.7 motion recipe closely:

- v1.7 reference supplied fixed timing/travel bands and preferred transform/opacity
- generated Fieldnote used 140/210/280ms tokens
- detail used opacity + 10px translate + clip
- Saved used opacity + 8px translate + clip
- mobile detail used opacity + 14px translate + clip

This supports a source-level de-bias change rather than another effect layer.

## Runtime changes

New references:

- `references/experience-dynamics.md`
- `references/presentation-rhythm.md`

Rewritten/updated:

- `SKILL.md`
- `references/motion-interaction.md`
- `references/typography-system.md`
- `references/information-design.md`
- `references/authored-experience.md`
- `references/ai-fingerprint-gate.md`
- `references/browser-qa.md`

Task Continuity remains substantially unchanged because current samples validate it.

## De-bias changes

Removed from the general motion reference:

- fixed timing bands
- generic travel-distance defaults
- press-scale defaults
- transform/opacity as a preferred design palette
- "small motion vocabulary" wording

Added upstream:

- multiple interaction concepts before effects
- domain verbs/object behavior
- reactive depth
- surface transformation
- motion topology
- temporal hierarchy
- behavioral silhouette comparison
- recorded interaction-sequence QA

Added presentation discipline:

- typography role economy
- typographic semantic-collapse detection
- information budgets
- information-compression order
- microtype-majority warning
- region-specific density

## Validation checks

- exactly one `SKILL.md`
- YAML frontmatter has `name` and `description`
- all references linked from `SKILL.md` exist
- no universal duration/travel/press-scale recipe remains in `motion-interaction.md`
- clean runtime package contains only `SKILL.md`, `LICENSE`, and `references/`
- full package contains source, docs, validation, and evidence
- Task Continuity reference remains present
- comparison evidence is recorded without copying comparator aesthetic or implementation

## Known limitation

v1.8 has not yet been validated by a fresh generation. It is an evidence-driven revision package intended for the next fresh test.
