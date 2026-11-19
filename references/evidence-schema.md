# Evidence Schema

UI Slop uses a versioned, evidence-first bundle. Schema changes must be explicit and backward compatibility must never be assumed silently.

## Manifest v2

`manifest.json` records:

- `schema_version`
- `tool_version`
- `generated_at`
- target URL or local fixture name
- `scenario_id`
- requirement ids
- browser name/version
- Node/platform/architecture
- immutable input paths
- one record per viewport/media run
- limitations declared by the scenario

Each run has a status of `completed` or `blocked`.

## Findings

Every finding contains:

- `id`
- `classification`: `hard_failure`, `advisory`, `evidence_only`, or `blocked`
- `outcome`: `fail`, `advisory`, `observed`, or `blocked`
- `category`
- `observation`
- `confidence`
- optional `requirement_id`
- optional evidence payload
- optional reproduction data
- viewport and media context after aggregation

Frequency alone must not promote an advisory to a hard failure.

For captures from 3.0.1 onward, `rendered-micro-label-candidates` is an advisory with checkpoint, viewport, count, and up to 20 samples. Samples report source text and casing inferred from computed text transform, CSS locator, font size in CSS pixels, letter spacing, font family and weight, text geometry, role and interactivity, repetition within the sampled document, and nearby heading context when available. The heuristic surfaces short, small uppercase text with tracking or proximity before a heading in the sampled viewport. Ordinary status or controls can appear here. Candidate presence or absence cannot establish quality.

Final typography remains in `metrics.json` under `typography`. Initial and explicitly captured step observations are additive in `typographyCheckpoints`. Earlier bundles remain valid.

## Trace

Each JSONL trace event is event-sourced around one scenario action.

It includes:

- step number
- action
- requirement id
- start/finish timestamps
- duration
- pass/fail
- optional evidence pointers
- before and after UI state

The UI state is deliberately bounded. It records orientation-relevant facts rather than an unbounded DOM dump.

## Review packet

`review-packet.json` contains:

- the evidence-first isolation contract
- optional brief-file pointer
- scenario description and requirements
- immutable run manifest
- findings

The reviewer should record unprompted findings before reading advisory detector output.

## Integrity

`checksums.json` covers all bundle files except itself.

`validate` checks:

- required files
- supported manifest/review schema
- finding classifications
- required completed-run artifacts
- file checksums

A checksum-valid bundle proves integrity of the recorded files, not that the workflow was sufficient or the design was good.
