---
name: ui-slop
description: Shape, prove, build, and review production interfaces. Use for new UI, redesigns, refinements, or audits that need product-specific structure, responsive interaction, and browser evidence.
---

# UI Slop

> The product contract is protected, the core experience is proven, and no material part of the primary experience feels obviously wrong.

For substantial rebuilds and new surfaces, complete the five stages in order and record each result as you go. A blocked prerequisite blocks advancement until resolved. Compress the sequence for a narrow refinement, keep audit work to inspection and findings, and preserve approved behavior and scope.

## Stage 1 — Shape the outcome

Read `references/shaping.md`. Record a short **Experience Brief** covering the user and context, meaningful outcome, irreducible core, protected product contract, non-goals, and highest quality risks. Use `examples/experience-brief.template.md`.

Record the **problem review** before committing to a concept. Follow `references/review-stages.md`. Advance on PASS, reshape the brief on RESHAPE, and record unavailable prerequisites on BLOCKED.

## Stage 2 — Set product principles and calibration

Read `references/product-principles.md` and `references/reference-calibration.md`. Write **three to five product-specific principles** that resolve actual tensions and change decisions. Use `examples/product-principles.template.md`.

Record **calibration notes** connecting an observed reference or incumbent mechanism to a decision and the result that would make you reconsider it. Identify where the core experience earns custom work.

## Stage 3 — Prove the core experience

Read `references/concept-proof.md` and `references/craft-floor.md`. Use `references/module-map.md` to load specialist guidance for the highest proof risk before choosing the direction. Build and operate a **runnable vertical slice** with representative content and near-final primary visual material. Exercise the highest-risk interaction through entry, action, result, second action, and return at wide and narrow sizes, with relevant inputs. A written explanation, static mockup, or screenshot alone cannot pass.

Record the **concept-proof** artifact path or URL, exercised states, observations, and unresolved risks. Record the **solution review** and its **SELECT / REVISE / REJECT** decision, or BLOCKED if required proof is unavailable. Only SELECT unlocks the full build. Revise and re-prove, or reject and reshape.

## Stage 4 — Build foundation plus signature

Use accessible platform conventions for ordinary behavior. Claim a signature experience only when the shaped problem earns it under `references/concept-proof.md`. Define response, continuity, boundaries, recovery, focus, and the next action for the primary flow. Motion can express interaction logic. The workflow must make sense without it.

Use the module map for implementation risks. Apply the supporting-copy pass in `references/quality-bar.md` during proof and build so supporting text earns its place early.

## Stage 5 — Review problem, solution, and implementation

Record the **implementation review** against the shaped problem and selected concept. If either changed materially, revisit its review before assessing readiness. Use `references/review-stages.md`, `references/review-protocol.md`, `references/browser-qa.md`, and `examples/review-record.template.md`. Operate the interface, including at narrow width. Record `INDEPENDENT_REVIEW` or `SELF_REVIEW` and complete the applicable protocol before declaring Quality Gate READY.

Run the mandatory **supporting-copy subtraction pass** in `references/quality-bar.md` on the first useful viewport, primary detail or focused state, and a compact or mobile state. Record what was removed or restored and why.

- **Evidence Gate** — Apply `references/evidence-gate.md`. Record PASS, FAIL, or BLOCKED against executed evidence. Use `references/evidence-harness.md` for repeatable Playwright capture. Preserve advisories separately.
- **Quality Gate** — Apply `references/quality-bar.md`. Record READY, NOT_READY, or BLOCKED with specific observations from rendered, operated states. Each veto must identify user or product harm. Quality readiness is a qualitative judgment.

A substantial result is ready only with a passing problem review, selected proof, ready implementation review, Evidence Gate PASS, and Quality Gate READY. Reopen the responsible stage for failures or vetoes. Make unavailable required checks visible as BLOCKED.

Keep one compact record linking the brief, principles, calibration notes, proof and decision, three reviews, and two gates. Report unresolved hard failures, vetoes, advisories, and blocked checks with their evidence.
