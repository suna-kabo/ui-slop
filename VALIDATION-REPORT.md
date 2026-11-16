# UI Slop v1.7 validation report

## Evidence basis

v1.7 was produced from:

- the v1.6 12-interface controlled benchmark
- the v1.6.1 candidate browser probe
- a second set of four fresh Chat rhythm-store generations

The second set is not treated as a valid four-skill ranking because the frontend-design condition reported that the requested skill was unavailable.

## Scope of change

New runtime reference:

- `references/task-continuity.md`

Updated runtime areas:

- `SKILL.md`
- `references/information-relationships.md`
- `references/browser-qa.md`

Documentation/evidence updates:

- `README.md`
- `CHANGELOG.md`
- `evidence/cross-sample-findings-v1.7.md`

## Design decision

The new guidance is intentionally behavioral/structural.

It does not prescribe:

- a fixed visual style
- a mandatory layout
- a mandatory inspector
- sticky controls everywhere
- URL persistence for all state
- fixed store or dashboard components

## Validation checks

- exactly one SKILL.md
- frontmatter contains name and description
- every reference linked from SKILL.md exists
- detailed continuity guidance remains in references rather than being duplicated into the main workflow
- no benchmark screenshot or generated application is bundled into runtime
- clean package contains only SKILL.md, LICENSE, and references
- full package preserves documentation and evidence
