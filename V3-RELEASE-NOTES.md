# UI Slop v3.0.0-rc.1 release notes

## Architecture replacement

v3 replaces the v2 runtime sequence:

> route → modules → build → evidence → taste → polish

with:

> shape → principles and calibration → concept proof → foundation plus signature → staged review

This is not another layer of aesthetic rules.

## Mandatory core

Substantial new, rebuild, or replacement work now requires:

- Experience Brief
- three to five product-specific principles
- quality calibration
- high-information concept proof
- explicit concept selection, revision, or rejection
- problem review
- solution review
- implementation review
- Evidence Gate pass
- Quality Gate ready

## New readiness model

A result may be technically valid and still be not ready.

Quality readiness can be vetoed by:

- unearned attention
- weak concept
- low-fidelity visual material
- detached or inert behavior
- poor platform adaptation
- obvious weakest-link quality cliffs
- immediate first-impression problems

A veto must be concrete and tied to product harm.

## Familiar foundation plus signature

v3 uses familiar, platform-appropriate foundations for ordinary behavior and concentrates custom work in one to three domain-derived signature experiences.

It does not require every component to be novel.

## Rejection path

Concepts may be discarded before full implementation when structure, interaction, visual material, or platform fit cannot reach the bar.

Polish is no longer the fallback for concept failure.

## Evidence tooling

The existing Node/Playwright evidence engine remains intentionally separate from qualitative readiness.

The package now exposes `tools/ui-slop-v3.mjs`, which records v3 tool provenance while reusing the validated evidence engine.

## Claim boundary

This release candidate encodes a stronger operating model.

It does not prove that v3 is better than v2 or any external design system. Independent multi-task evaluation remains required.
