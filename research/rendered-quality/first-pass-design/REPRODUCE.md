# Reproduce the first-pass design trial

Run these from the repository root with Node 22, Python 3.10+, Git, Playwright Chromium and the native Codex CLI on PATH. On the Windows desktop the launcher uses `CODEX_APP_RUNTIME_CLI_PATH`. Replace `ROUND` with an external staging directory. `R2_PACKET` is the previously frozen `review-packet/` directory from [Round 2](https://github.com/suna-kabo/ui-slop/tree/d58f873e729a540b6254b459fdd10281685af668/research/rendered-quality/repeatability-round-2/review-packet). The regression runner verifies those app bytes against the committed manifest before examining them.

```sh
npm ci
npx playwright install chromium
npm test
npm run skill:pack
python -B research/rendered-quality/first-pass-design/trial.py prepare ROUND
python -B research/rendered-quality/first-pass-design/trial.py generate ROUND --workers 12
python -B research/rendered-quality/first-pass-design/trial.py packet ROUND
python -B research/rendered-quality/first-pass-design/trial.py review ROUND --workers 8
node research/rendered-quality/first-pass-design/opening-audit.mjs ROUND/packet ROUND/openings
node research/rendered-quality/first-pass-design/opening-audit.mjs R2_PACKET ROUND/round2-openings initial
node research/rendered-quality/first-pass-design/regressions.mjs R2_PACKET ROUND/regressions
python -B research/rendered-quality/first-pass-design/summarize.py ROUND
```

`prepare` stores the same baseline runner configuration, private assignments, protocol and hashes before launching a session. Each app has a fresh working directory. The scoped local transport offers only file operations within that workspace and Playwright on a loopback origin. Host skill descriptions and host discovery are disabled, as are shell tools. B and C read the exact local installed skill, manifest and concept-proof reference through the scoped transport. Logs retain the reads and subsequent use. A's workspace has no skill. The experimental intervention runtime differs from original in exactly one reference file and the integrity manifest. The runnable trial copies and reviewer records are hashed before unblinding.

For the follow-up, prepare a fresh `FOLLOWUP` directory with `--selection research/rendered-quality/first-pass-design/selection-followup.txt` and repeat the same generation, capture and review commands. The following commands prepare and evaluate the secondary endpoint at the close of concept proof. They do not regenerate the apps.

```sh
python -B research/rendered-quality/first-pass-design/trial.py selected-packet FOLLOWUP --destination SELECTED
python -B research/rendered-quality/first-pass-design/trial.py review SELECTED --workers 8
node research/rendered-quality/first-pass-design/opening-audit.mjs SELECTED/packet SELECTED/openings
python -B research/rendered-quality/first-pass-design/summarize.py SELECTED --generation-root FOLLOWUP
python -B research/rendered-quality/first-pass-design/package.py ROUND FOLLOWUP SELECTED OUTPUT
```

The selected-proof packet includes the source phase and SHA-256 receipts in `selected-proof-sources.json`. Its local packet paths are neutral and identical in form to the first-draft paths, which keeps the artifact copies anonymous for reviewers. The investigation identifies which endpoint each result describes.

The package copies contain generated runtime manifests with LF-normalized text. `prepare` checks their runtime source against the frozen Git blobs after normalizing CRLF. A generation retry can use `generate ROUND --attempt 2 --only OPAQUE_ID`. The packet uses the first complete verified attempt. A reviewer retry can use `review ROUND --retry-review --only 1-2 --workers 1`. Both original and retry artifacts are retained, and the retry is used only when the first session has no saved verdict. Live provider model identity, seed and temperature are not emitted by these CLI sessions. Lower the worker count for capacity-constrained providers.

The delivered `packet/` runs on loopback without a model account. Serve it with `python -m http.server 8765 --bind 127.0.0.1 --directory packet`, then open the requested path from `packet/queue.json`. Keep a clean browser context for each comparison. `openings/metrics.json` lists the rendered type metrics and actual H1 glyph families from Chromium's CSS domain. The doubled root-text probe affects relative text sizing. It is separate from physical-device or assistive-technology assessment. `npx playwright show-trace <trace.zip>` opens the evidence timeline.

The regression runner's overall pass requires the exact archived defects to fail their contract checks and fixture-only repairs to pass. It also compares hiding selected redundant copy, eliminating those boxes, and recomposing the reserved hero height on the same content. The checkout fixture tests confirmation, second-view agreement, persistence and reversal independently of the concept experiment. The prior candidate branches and archived artifact sources are preserved.
