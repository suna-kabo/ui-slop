# Reproduce the validation

Run these commands from the repository root with Node 22, Python 3.10+, Git and Playwright Chromium. `ROUND`, `ORIGINAL` and `OUTPUT` below denote an external staging directory, the original user-provided ZIP and a separate delivery directory. Replace them with paths when running the commands. Node scripts use the locked `playwright` dependency. Set `UI_SLOP_CHROMIUM_PATH` only when using a separate Chromium executable.

```sh
npm ci
npx playwright install chromium
npm test
python -B research/rendered-quality/repeatability-round-2/cohort.py prepare ROUND --original ORIGINAL
node research/rendered-quality/repeatability-round-2/historical.mjs ROUND/history ROUND/historical-captures
```

`prepare` refuses to regenerate an existing seal. It records the exact Git revision extracts, assignments and frozen hashes. The supplied archive is extracted into `ROUND/history` and independently hashed. Replay uses the first app's documented `index.html` entry and the second app's `server.mjs` (the command behind `npm start`). Playback data is written only to the separate capture directory. For a trace, run `npx playwright show-trace <path-to-trace.zip>`.

## Recreate the experiment

Fresh generation takes access to a Codex CLI account and may take 12 minutes per active case. The default launcher uses the CLI's workspace-write shell and installed Playwright. The scoped variant uses a local MCP process offering filesystem operations inside that one run directory and Playwright against a loopback origin. It supplies the same tool surface to all runs. The Windows desktop environment required the latter. Select a worker count the model deployment can support and use the same model throughout the cohort. The delivered packet is usable directly without a model account.

```sh
python -B research/rendered-quality/repeatability-round-2/cohort.py generate ROUND --scoped-tools --workers 12
python -B research/rendered-quality/repeatability-round-2/review-cohort.py prepare ROUND
python -B research/rendered-quality/repeatability-round-2/review-cohort.py review ROUND --workers 6
node research/rendered-quality/repeatability-round-2/opening-views.mjs ROUND/review-packet ROUND/opening-views
```

To operate a delivered app, extract the evidence ZIP and serve `review-packet/` on loopback, for example `python -m http.server 8765 --bind 127.0.0.1 --directory review-packet`. Use the entry paths in `review-packet/queue.json`. The app can retain local state on the same origin. For clean comparisons use a fresh browser context for each app and phase. Reviewers receive only the anonymized pair and benchmark materials. Verify `runnable-output-hashes.json` before review and seal findings with `frozen-review-hashes.json` before reading `sealed/private-key.json`. Keep generation process records outside the blind directory. Initial and Final copies are distinct run states even when the files are identical. Early interruptions and unknown gates remain visible in the reports.

The common opening matrix is six browser states per available entry point. The text variant applies `font-size: 200%` to the root. It exercises relative text scaling and can leave fixed-pixel styles unchanged. Historical replays use a separate CSS zoom stress probe. Read reviewer traces for state changes, recovery, focus and second actions. An opening capture alone cannot establish those behaviors.

## Package and installed smoke

```sh
npm run skill:pack
node tools/skill-package.mjs install-project ROUND/installed-project
npm --prefix ROUND/installed-project/.agents/skills/ui-slop ci --ignore-scripts
node tools/skill-package.mjs doctor ROUND/installed-project
node ROUND/installed-project/.agents/skills/ui-slop/tools/ui-slop-v3.mjs capture --html examples/codex-skill-smoke.html --scenario research/rendered-quality/package-smoke.json --out ROUND/package-smoke
node ROUND/installed-project/.agents/skills/ui-slop/tools/ui-slop-v3.mjs validate ROUND/package-smoke
python -B research/rendered-quality/repeatability-round-2/package-evidence.py ROUND OUTPUT dist/ui-slop
```

Create `ROUND/installed-project` before installing. The doctor checks both the project and any pre-existing user install. A mismatched user install is recorded separately from the clean project package. The clean ZIP only contains the runtime manifest and its hashed payload. The evidence ZIPs have independent `SHA256.json` manifests.
