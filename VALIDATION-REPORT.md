# UI Slop 3.0.1 validation report

## Release scope

The hardening release starts from canonical `main` at `5b243fcb38be83457fc430f0a8700353b54c25be`. The five-stage workflow, runnable concept proof, portable skill package, and separate Evidence and Quality Gates remain the release contract.

The browser regression reproduced a zero count on 3.0.0 for normal-case DOM text rendered with uppercase CSS, small type, and tracking. On 3.0.1 the fixture produces a structured advisory with the observed computed styles. Stateful captures also surface a label present only at a recorded intermediate checkpoint. A genuine uppercase status is observed without a hard failure, and a hidden label and a CSS-lowercased label are excluded.

Skill invariants cover the burden of proof for a clickable eyebrow, the domain justification and observable proof required for a signature claim, the primary interaction continuity decision, separate mobile operation, and the strongest plausible veto required for adversarial self-review.

## Local validation

Windows, Node 22.18.0, npm 10.9.3, Playwright 1.63.0 and Playwright-managed Chromium 153.0.8010.12.

| Check | Result |
| --- | --- |
| Clean dependency install | `npm ci` passed. |
| Unit and package tests | 14 passed, including Windows-safe user and project installs and broken Doctor fixtures. |
| Skill invariants | 7 passed. |
| Playwright browser integration | 4 passed, using the default HTTP fixture transport and the standalone HTML capture path. |
| Package and Doctor | Two packs produced identical manifests. Doctor passed for the generated bundle and temporary user and project installs, including a Chromium launch. |
| CLI and compatibility | Packed and installed CLIs reported `3.0.1`. The 3.0.1 validator accepted the 3.0.0 reproduction bundle. |
| Benchmark harness | Prepare and validate with `--allow-incomplete` passed. |

The detector samples rendered text at the initial, final, and explicitly captured steps. Its output informs review. Quality readiness still requires rendered and operated evidence of the experience.
