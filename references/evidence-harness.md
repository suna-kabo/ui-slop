# Evidence Harness

The v2 evidence tooling collects reproducible browser facts around a product-specific workflow. It does not choose a visual style or turn taste into a score.

## Install

Requires Node.js 20+.

```bash
npm install
npx playwright install chromium
```

A system Chromium may be supplied with `UI_SLOP_CHROMIUM_PATH`.

## Commands

```bash
node ./tools/ui-slop.mjs inspect <project-root> --out .ui-slop/context.json

node ./tools/ui-slop.mjs capture <url> \
  --scenario <scenario.json> \
  --brief <brief.txt> \
  --out .ui-slop/runs/<run-id>

node ./tools/ui-slop.mjs capture --html <fixture.html> \
  --scenario <scenario.json> \
  --out .ui-slop/runs/<run-id>

node ./tools/ui-slop.mjs validate .ui-slop/runs/<run-id>
```

`evidence` remains a compatibility alias for `capture` during the release-candidate period.

## Exit status

- `0`: capture completed without hard failures or blocked coverage
- `1`: operational or bundle-validation failure
- `2`: one or more hard failures
- `3`: required evidence was blocked

A blocked run is not a pass.

## Scenario contract

A scenario defines the real workflow to exercise. It is not a design template.

It may include requirement ids so a failed action or assertion can be traced back to the product contract.

Supported actions:

- `click`
- `hover`
- `press`
- `fill`
- `wait`
- `back`
- `reload`
- `snapshot`
- `assertVisible`
- `assertText`
- `assertUrl`
- `assertStorage`
- `assertFocus`
- `assertNoOverflow`

Use stable semantic locators when possible. Keep scenarios focused on one meaningful workflow rather than crawling the whole product.

See `examples/scenario.example.json`.

## Evidence bundle

Each run contains checksummed inputs and outputs:

- `inputs/scenario.json`
- optional `inputs/brief.txt`
- `manifest.json`
- `findings.json`
- `review-packet.json`
- `checksums.json`
- viewport/media directories containing screenshots, accessibility inventory, metrics, focus trace, findings, and event trace

The event trace records before/after URL, focus, scroll, selected/expanded/pressed state signals, motion count, duration, requirement id, and action result.

The capture manifest records tool version, schema version, browser version, runtime platform, viewport/media variants, and blocked/completed status.

Read `evidence-schema.md` for the stable field contract.

## Measurement versus judgment

The finding model is deliberately asymmetric.

### Hard failure

Only explicit product-contract failures or independently verifiable applicable failures should block.

Current examples include:

- failed scenario assertion
- page runtime exception
- root horizontal overflow when horizontal scrolling is not allowed
- visible interactive control with no observed accessible name

### Advisory

Measured risks that require product judgment, for example:

- a high share of visible text rendered as microtype
- repeated small uppercase labels
- very small interaction geometry where standards contain exceptions
- console errors whose task impact is not established

### Evidence only

Neutral inventory such as:

- typography distribution
- interaction geometry
- accessibility inventory coverage
- animation inventory

Do not create an aesthetic score from these measurements.

## Accessibility inventory

The harness records a bounded DOM-derived accessibility-name inventory for visible interactive elements. This is useful evidence but is not a replacement for a full accessibility tree, assistive-technology testing, or the applicable standard.

A limitation or unsupported path becomes `blocked` when required evidence cannot be collected. It must never become a silent pass.

## Privacy

`.ui-slop/` is ignored by default.

Use scenario `redact` locators to mask sensitive screenshot regions. Do not record passwords, secrets, private account data, or unbounded DOM dumps.

Prefer synthetic or local fixtures for benchmark work. Review evidence before sharing it outside the project.
