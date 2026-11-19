# Reproduce the rendered quality investigation

The [investigation report](INVESTIGATION.md) describes the frozen baseline, the evidence, and the limits of the comparisons. The scripts and briefs here are research inputs outside the portable skill.

## Controlled review challenge

From the repository root with dependencies installed and Chromium available:

```sh
node research/rendered-quality/prepare-review.mjs /tmp/ui-slop-cases
UI_SLOP_CHROMIUM_PATH=/usr/bin/chromium node research/rendered-quality/verify-review.mjs /tmp/ui-slop-cases /tmp/ui-slop-captures
```

Omit the browser executable override when using Playwright's managed Chromium. Give reviewers only the original task and a browser URL for each HTML case in the generated `public/` directory. Keep `key.json`, the template, the runner, and the generator rationale outside the first pass. A static localhost server avoids managed Chrome policies that block `file:` navigation.

The runner writes first, detail and reservation screenshots, Playwright traces for the response contrast, and frame observations. It checks cancellation and restoration against the controlled cases. The conventional path adds keyboard-only selection, visible focus, repeated reservation, reload persistence, cancellation, incompatible detail, overflow, and separate reduced-motion and 200% root-text variants at 1440, 768, 390 and 320px. Root text scaling exercises these fixture styles and does not establish full browser zoom or assistive technology conformance. The pending-focus follow-up holds task data and visual treatment constant:

```sh
node research/rendered-quality/prepare-review.mjs /tmp/ui-slop-focus --preserve-pending-focus
UI_SLOP_CHROMIUM_PATH=/usr/bin/chromium node research/rendered-quality/verify-review.mjs /tmp/ui-slop-focus /tmp/ui-slop-focus-captures --expect-pending-focus
```

## Generation comparisons

```sh
node research/rendered-quality/prepare-slices.mjs /tmp/ui-slop-slice-round
```

Use a fresh generation context per condition. Give it the corresponding `runs/<condition>/skill/` folder and [the same two briefs](slice-briefs.md). Restrict its experiment output to `kiln/index.html`, `music/index.html`, and separate review notes. Give all contexts the same runtime, tool access, and time budget. Collect immutable runnable copies under opaque IDs before sharing them with reviewers. Use [the original full kiln brief](full-kiln-brief.md) for the product comparison and [the newsroom brief](dense-brief.md) for the dense workflow check.

To prepare a blind packet, pass `blind-packet.mjs` a JSON array with one object per completed artifact. Each object has a private `label`, a public `task`, and a `directory` containing only runnable files and an `index.html`. Serve its generated `public/` directory and give reviewers only that queue and the briefs. Preserve the key and entry hashes separately. For a common opening-view matrix:

```sh
UI_SLOP_CHROMIUM_PATH=/usr/bin/chromium node research/rendered-quality/capture-artifacts.mjs \
  /tmp/ui-slop-packet/public/queue.json http://127.0.0.1:8765/ /tmp/ui-slop-opening-views
```

Serve the packet at the indicated loopback URL first. The matrix records opening states at four widths, plus reduced motion and root text scaling on mobile. Operation, secondary states, and task judgments need the separate review.

## Installed package smoke

Run `capture --html examples/codex-skill-smoke.html --scenario research/rendered-quality/package-smoke.json` using the installed package's evidence CLI, with a fresh output directory. Then run `validate` against that directory. The scenario verifies the installed evidence tooling and four browser variants. Skill discovery and model execution are separate steps.
