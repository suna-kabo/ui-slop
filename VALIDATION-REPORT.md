# UI Slop v2 P0 validation report

## Scope

This branch is an implementation experiment, not a claim that v2 is already better than Impeccable.

P0 intentionally limits the build to:

- compressed runtime router
- real-content-first structural guidance
- compact interaction contracts
- Behavioral Craft inside Experience Dynamics
- small browser evidence harness
- deterministic/advisory/evidence-only finding separation
- evidence-first independent review protocol
- reproducible benchmark protocol

`compare`, `lab`, and `learn` are not implemented as P0 commands.

## Router reduction

v1.9 SKILL.md:

- 479 lines
- 22,171 bytes in the candidate branch tree

v2 P0 SKILL.md:

- 254 lines
- 11,688 bytes

This is approximately a 47% byte reduction while retaining routing, product contract, structural reasoning, visual direction, Presentation Rhythm, Experience Dynamics, Task Continuity, Evidence Gate, AI Fingerprint Gate, and Taste Gate.

The reduction is a candidate hypothesis. It still requires the predeclared v1.9-versus-v2 ablation before claiming better instruction efficiency.

## Unit tests

Command:

```bash
npm test
```

Result:

- 4 tests passed
- 0 failed

Covered:

- scenario validation
- unknown action rejection
- required locator validation
- project context observation
- hard failure versus advisory separation
- scenario assertion classification

## Browser evidence smoke

The execution environment blocked normal browser navigation with Chromium policy, so the harness was exercised through its local HTML-fixture mode using the installed Playwright Core fallback and system Chromium.

Good fixture:

- one desktop viewport
- normal and reduced-motion variants
- interactive state change
- screenshot capture
- focus walk
- metrics
- evidence bundle validation
- 0 hard failures

Broken fixture deliberately included:

- runtime exception
- page-wide horizontal overflow at 390px
- all visible text at 11px
- eight uppercase micro-labels
- 16px interactive target

Observed classification:

- 2 hard failures: runtime exception, root horizontal overflow
- advisories: microtype-heavy, uppercase micro-label recurrence, small target geometry
- evidence-only: text-size distribution, interaction geometry, animation inventory, ARIA coverage state

This is the intended separation. Aesthetic proxies did not block the run.

## Evidence bundle validation

The generated good fixture bundle passed checksum and manifest validation.

Each run contains:

- manifest
- findings
- review packet
- checksums
- screenshots
- ARIA evidence or explicit unsupported coverage
- focus trace
- event trace
- metrics

## ARIA coverage limitation

The local fallback Playwright Core available in the execution environment predates `page.ariaSnapshotJSON()`. The harness therefore recorded ARIA JSON coverage as evidence-only unavailable rather than silently passing it.

The repository package declares Playwright 1.63+, where the JSON ARIA snapshot API is available. This path still requires a clean install smoke in CI or another environment before v2 P0 can be called release-ready.

## Dependency-install limitation

The environment's npm install attempt timed out. Browser smoke used the preinstalled Playwright Core fallback instead. This validates the harness logic and graceful fallback path, but not a fresh package installation.

A clean npm install plus browser smoke is therefore still required in CI.

## No aesthetic hard-coding review

P0 does not include:

- industry-to-style mapping
- palette recommendation database
- aesthetic quality score
- universal spacing scale
- universal motion timing
- universal spring values
- default hover lift
- fixed mobile pattern
- originality score

Current numeric heuristics are either:

- objective execution constraints, or
- advisory measurements that explicitly require human/model judgment

## Next validation

Before promoting v2 beyond alpha:

1. clean-install test on Windows and POSIX
2. Playwright 1.63+ ARIA JSON smoke
3. v1.9 full-router versus compressed-v2 ablation
4. no-skill / v1.9 / v2 / Impeccable multi-run blind benchmark
5. false-positive fixture set for every hard detector rule
6. independent reviewer test using immutable evidence packet

## Status

P0 implementation smoke: PASS with documented environment limitations.

Best-in-class claim: NOT TESTED.
