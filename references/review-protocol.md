# Independent Review Protocol

For substantial work, the strongest review separates evidence collection from the generator's self-justification.

## Review order

1. Give the reviewer the original brief or protected contract.
2. Give the reviewer the immutable evidence bundle and only source snippets needed to verify behavior.
3. Reviewer records unprompted findings first.
4. Only then expose detector/advisory findings.
5. Classify each requirement as PASS, FAIL, BLOCKED, or ADVISORY.
6. Cite evidence ids, trace steps, screenshots, or source evidence for material findings.
7. Fix the smallest responsible layer.
8. Rerun affected checks plus a bounded regression pass.

Do not give the reviewer the generator's victory narrative before the first critique.

## Classification

- **PASS**: executed evidence supports the requirement.
- **FAIL**: executed evidence contradicts a required behavior or standard.
- **BLOCKED**: evidence could not be executed or observed.
- **ADVISORY**: qualitative or measured concern requiring product judgment.

Unknown is not PASS.

## Reviewer scope

The reviewer may judge:

- product specificity
- hierarchy and information design
- interaction continuity
- behavioral craft
- visual coherence
- responsive composition
- whether advisory patterns cause actual harm

The reviewer must not convert frequency counts or similarity scores into automatic aesthetic failures.

If no isolated reviewer is available, mark the review process as degraded rather than claiming independence.
