---
name: ui-slop
description: Standalone UI design and engineering workflow for building, rebuilding, refining, or auditing production interfaces without generic AI composition, fixed aesthetic recipes, or repeated interaction grammar. Protects product behavior, loads only the reasoning a task needs, and separates rendered evidence from taste judgment.
---

# UI Slop

UI Slop is a product-specific UI reasoning skill with an evidence loop.

It is not a component library, style catalog, palette generator, house aesthetic, or fixed motion system.

## Route and authority

Choose the smallest task mode:

- **Audit**: inspect and report without changing the product.
- **Refinement**: preserve approved behavior, structure, and visual authority unless the user explicitly changes scope.
- **Rebuild**: preserve product truth and required behavior while allowing structure, interaction model, information architecture, and visual system to change.

Classify the surface by what success means:

- **Workflow**: repeated accurate task completion.
- **Reading**: comprehension, navigation, annotation, comparison.
- **Persuasion**: decision and action from narrative or proof.
- **Immersion**: the artifact or content is the experience.
- **Browse / Collect**: discovery, comparison, saving, revisiting, and traversal.

Use `references/module-map.md` and load only the modules needed by the task or unresolved risk. Historical evidence and release reports are not runtime instructions.

## Protect the product contract

Before changing presentation, identify what must remain correct:

- domain semantics and data correctness
- required workflows and second/third actions
- permissions, saved state, persistence, and reload behavior
- routes, history, deep links, Back/close behavior, and focus return
- imports, exports, downloads, integrations, and offline/recovery behavior when applicable
- keyboard, accessibility, responsive, platform, and framework requirements

Do not weaken behavior because presentation is difficult.

For a rebuild, incumbent DOM, layout, cards, navigation, and styling are evidence, not automatic visual authority.

## Model real content before the shell

Identify the primary user job, domain objects, important relationships, state changes, and repeated actions.

Use representative content before structure locks. Include relevant long, short, missing, mixed, empty, dense, invalid, and similar-looking records instead of designing only around ideal placeholders.

Read `references/real-content-first.md` for substantial content or data surfaces.

## Choose structure from the domain

When structure is genuinely open, compare materially different spatial concepts. Do not run a concept tournament for a narrow refinement.

A useful structure should:

- make the primary job dominant
- expose relationships users need to understand or act on
- keep controls near what they control
- survive removal of color, branding, and decoration
- use familiar conventions when they reduce error or learning cost
- avoid a familiar shell when it exists only because the model reaches for it

Novelty is not a goal. Product fit is.

Read `references/structural-direction.md` and `references/information-design.md` when structure is open.

## Establish a product-grounded visual world

If an approved visual system exists, inherit it unless replacement is requested.

Otherwise derive visual direction from the subject, audience, usage scene, culture, materials, content, tempo, trust level, and interaction frequency.

Do not escape generic SaaS by repeatedly choosing another generic anti-default. Paper/editorial, dark-neon, glass/glow, terminal, soft-card, or any other recurring world requires a product reason.

Read `references/visual-direction.md` when visual authority is missing or being replaced. Load typography, color, media, and asset references only when those axes are material.

## Design presentation rhythm

Typography, density, spacing, grouping, and simultaneous visibility form one information system.

Compress through grouping, alignment, shared context, better representation, and progressive disclosure before shrinking type. Mobile may change information priority or representation instead of preserving desktop density by making everything smaller.

Read `references/presentation-rhythm.md` for workflow, reading, comparison, or data-heavy surfaces.

## Design connected state and continuity

When parts of the product are related, decide what should react together and what should remain anchored.

For repeated workflows, browse paths, nested detail, playback, or persisted work define:

- state lifetime
- next-action locality
- return contract
- traversal or browse topology
- relationship actionability
- what survives reload and why

A feature is incomplete if the user repeatedly reconstructs filters, selection, scroll, playback, or context.

Read `references/task-continuity.md`. For consequential, asynchronous, persistent, nested, or ambiguous interactions, use `references/interaction-contracts.md`.

## Design interaction before motion

Start from domain verbs and object relationships. Decide how selection, manipulation, traversal, comparison, interruption, completion, and return behave before choosing effects.

Behavioral craft is part of the interaction model:

- acknowledge important input promptly
- track direct manipulation continuously when the domain benefits from it
- do not trap the user behind choreography
- continue reversal or retargeting from the visible state when appropriate
- preserve understandable spatial relationships
- make boundaries and completion intentional
- keep repeated use efficient on the tenth use, not only delightful on the first

These are qualities, not universal spring, timing, scale, easing, gesture, or travel values.

Motion comes after interaction. It may explain cause, hierarchy, spatial continuity, or a product-specific authored moment. UI Slop has no default hover lift, image zoom, fade-and-rise, slide direction, spring, or duration recipe.

Read `references/experience-dynamics.md`, `references/interaction-hierarchy.md`, and `references/motion-interaction.md` only when relevant.

## Keep semantics coherent without sameness

Consistency means shared rules and predictable behavior, not forcing unrelated meanings into the same card, pill, badge, micro-label, or metadata treatment.

Different meanings may use typography, position, color, shape, imagery, relationship, or state rather than another wrapper.

Read `references/semantic-diversity.md` for heterogeneous content or repeated metadata systems.

## Compose responsive behavior

Breakpoints should answer content or interaction failure, not habitual device numbers.

Narrow layouts may change representation, navigation, detail behavior, action placement, and information priority while preserving the primary object and task continuity.

Read `references/layout-responsive.md` for substantial responsive work.

## Reject filler and generated habits

Reject unjustified cards-around-everything, pill overload, giant marketing headings in task software, filler subtitles, layout-explanation labels, decorative charts, generic KPI rows, habitual top-right search, generic main-plus-right-rail shells, repeated section templates, and one interaction or visual grammar reused across unrelated products.

Anti-slop does not mean minimal. Replace removed decoration with stronger structure, typography, hierarchy, content, interaction, and subject-specific detail.

## Evidence before taste

For substantial visual work, rendered verification is required when browser tooling exists.

Use a bounded loop:

1. operate the primary workflow with realistic content
2. inspect representative wide and narrow states
3. test keyboard/focus and nested return paths when applicable
4. test reduced motion when motion exists
5. exercise required loading, empty, failure, recovery, and persistence states
6. record findings
7. fix the smallest responsible layer
8. rerun affected evidence plus a bounded regression pass

When the evidence harness is available, use `references/evidence-harness.md`.

Classify evidence as:

- **hard_failure**: a specified requirement or independently verifiable applicable standard failed
- **advisory**: a measured pattern may be harmful but requires product judgment
- **evidence_only**: neutral measurement with no quality verdict
- **blocked**: required evidence could not be executed or observed

A measurable aesthetic proxy is not automatically a failure.

Read `references/evidence-gate.md`, `references/browser-qa.md`, and `references/review-protocol.md` for substantial verification.

## Check for generated recurrence

Before final acceptance, inspect recurring patterns at the relevant layers:

- structural silhouette
- visual-material world
- typography roles
- semantic-to-component mapping
- interaction mechanics
- motion triggers
- responsive transformation
- layout-explanation copy

Similarity is evidence, not failure. Ask whether the pattern is product-justified and whether it causes functional, comprehension, identity, or repeated-use harm.

If no unrelated comparison corpus exists, mark cross-product recurrence as not verified instead of inventing one.

Read `references/ai-fingerprint-gate.md` when recurrence is relevant.

## Final judgment

Objective failures are resolved before taste judgment.

Then ask whether the interface is actually authored for this product:

- do domain objects and relationships shape the experience?
- is information readable at the density the work needs?
- does the visual world come from the product rather than a model habit?
- does interaction preserve orientation and support continued work?
- is mobile intentionally composed?
- does repeated use remain efficient?
- is the weakest visible region still part of the same product?

A clean but interchangeable interface is not finished.

Read `references/taste-gate.md` for final qualitative review.

## Specialists and finish condition

UI Slop must remain useful by itself. Load specialists narrowly for framework implementation, accessibility, performance, motion, platform guidance, image work, or browser automation.

Priority is: explicit user instruction, protected product contract, project/platform constraints, then narrower specialist guidance.

Do not merge specialists' preferred aesthetics.

Do not claim verified work without executed evidence. Report what was operated, measured, observed, blocked, or not checked.
