# Evidence Harness

The P0 tooling exists to collect reproducible evidence. It does not choose an aesthetic.

## Commands

```bash
npm install
npx playwright install chromium
node ./tools/ui-slop.mjs inspect <project-root> --out .ui-slop/context.json
node ./tools/ui-slop.mjs evidence <url> --scenario <scenario.json> --out .ui-slop/runs/<run-id>
node ./tools/ui-slop.mjs validate .ui-slop/runs/<run-id>
```

A system Chromium can be supplied with `UI_SLOP_CHROMIUM_PATH` when appropriate.

## Evidence run contents

A run contains:

- `manifest.json`
- `findings.json`
- `review-packet.json`
- `checksums.json`
- viewport/media subdirectories with screenshots, ARIA snapshots, metrics, focus trace, findings, and event trace

Keep `.ui-slop/runs/` out of public git by default when it may contain product or user data.

## Scenario contract

A scenario describes the product-specific workflow. It is not a design template.

Supported actions include:

- click
- hover
- press
- fill
- wait
- back
- reload
- snapshot
- assertVisible
- assertText
- assertUrl
- assertStorage

Use stable semantic locators when possible. Scenario assertions turn required product behavior into reproducible hard evidence.

## Measurement versus judgment

The harness uses three evidence levels plus blocked coverage:

- `hard_failure`: explicit workflow assertion, runtime correctness, or independently verifiable requirement failed
- `advisory`: a measured pattern deserves review but is not automatically wrong
- `evidence_only`: neutral inventory
- `blocked`: required evidence could not run

Examples of evidence-only or advisory measurements include text-size distribution, small-target inventory, uppercase micro-label counts, and animation inventory.

Do not create an aesthetic score from these measurements.

## Privacy

Scenarios may provide screenshot mask locators through `redact`.

Do not record passwords, secrets, private account data, or unbounded DOM dumps. Prefer synthetic/local fixtures for benchmark work.
