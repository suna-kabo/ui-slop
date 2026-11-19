# UI Slop 3.0.0 validation report

## Source and scope

The release starts from validated v3 documentation head `b7caf39c789f0c55db146ee532d3d133d697a561`. The checkout's divergent v3 tip, `bbb5df8ee06fcc8786dca8c2fa98cea25aa3ea63`, had the identical file tree. The release commit preserves both histories. The previous report and its recorded GitHub Actions results remain available at the validated head.

The canonical source is root `SKILL.md` and the runtime files it routes to. The generated bundle records version 3.0.0, normalized content hashes, and a deterministic source digest. Evidence manifests use the version of the package that captured them.

Substantial work requires a recorded problem review, a runnable vertical proof with a selection decision before full build, and an implementation review before readiness. Supporting-copy subtraction is mandatory in three representative states. The objective Evidence Gate and qualitative Quality Gate remain separate.

## Local validation

Windows, Node 22.18.0, npm 10.9.3, Playwright 1.63.0 and Chromium 151.0.7922.34.

| Check | Result |
| --- | --- |
| Clean lockfile install | PASS with `npm ci --offline --ignore-scripts` from a populated npm cache |
| Unit and package tests | 14 passed. Exercised deterministic packaging, stale file removal, user/project update isolation, Windows paths with spaces and Unicode, installed hashes, and CLI version provenance. |
| Skill invariants | 4 passed. Covered stage and readiness gates, copy subtraction, and absence of fixed motion recipes. |
| Doctor | PASS against the generated bundle and temporary user and project installations with installed evidence dependencies. Broken fixtures correctly failed for stale output, injected MCP configuration, dependency mismatch, a missing reference, version drift, and malformed frontmatter. |
| Browser integration | 3 passed with `UI_SLOP_TEST_FILE_FIXTURES=1`. Exercises wide/compact/mobile views, normal/reduced motion, primary workflow, Back, persistence, overflow, objective/advisory separation, checksums, and standalone HTML capture. |
| Default HTTP integration | BLOCKED by Chromium `ERR_NETWORK_ACCESS_DENIED` on local loopback here. CI continues to run HTTP fixtures by default. |
| Benchmark harness | Prepare and validate with `--allow-incomplete` passed. |
| Codex discovery | The bounded CLI smoke reached local startup and was blocked by access to the Codex state database. The manual prompt remains available for a fresh local session. |

This validation concerns the packaging and executable skill workflow. Product readiness remains a judgment tied to the rendered and operated experience.
