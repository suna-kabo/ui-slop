---
name: ui-slop
description: Standalone UI design and engineering workflow for building, rebuilding, refining, or auditing production interfaces without generic AI composition, fixed aesthetic recipes, or repeated interaction grammar. Protects product behavior, routes only the needed design reasoning, and requires rendered evidence for substantial work.
---

# UI Slop

UI Slop helps an agent make interfaces that feel specific to the product, usable under repeated real work, and verifiable in the browser.

It is not a component library, style catalog, palette generator, or fixed motion system.

## Route first

Choose the smallest mode that fits:

- **Audit**: inspect and report only.
- **Refinement**: preserve approved product behavior and visual authority; fix material issues.
- **Rebuild**: protect product truth and required behavior while allowing structure, interaction model, information architecture, and visual system to change.

Classify the surface by the user's success condition:

- **Workflow**: complete repeated tasks accurately and efficiently.
- **Reading**: understand, navigate, annotate, or compare information.
- **Persuasion**: decide and act from a narrative or proof.
- **Immersion**: experience the artifact or content itself.
- **Browse / Collect**: discover, compare, save, revisit, and move between related objects.

A product may contain several surface modes.

Read only the modules the task needs. Use `references/module-map.md` as the routing map.

## Protect the product contract

Before changing presentation, identify what must remain correct:

- domain semantics and data correctness
- required user workflows
- auth and permissions
- saved or persistent state
- routes, history, deep links, and return behavior
- imports, exports, downloads, and integrations
- loading, empty, failure, retry, and offline behavior when applicable
- keyboard, focus, accessibility, and responsive requirements
- platform or framework constraints

Do not weaken behavior because presentation is difficult.

For a rebuild, existing layout and components are evidence, not automatic visual authority.

## Model the real product before designing the shell

Identify:

- primary user job
- domain objects
- relationships users need to understand or act on
- important state changes
- repeated second and third actions, not only first-click success
- realistic content variation

Use representative content before structure locks. Include relevant long, short, missing, mixed, empty, dense, invalid, or similar-looking records rather than designing only around ideal placeholders.

Read `references/real-content-first.md` for substantial data or content surfaces.

## Choose structure from the domain

For open-direction work, explore materially different spatial concepts when the choice could change the product experience. Do not run a concept tournament for a narrow refinement with an already-set structure.

Judge structure before styling:

- does the primary job dominate the composition?
- do important relationships shape the page?
- are controls near what they control?
- does the structure still make sense without color, imagery, and branding?
- is a familiar pattern being used because it helps the task, or only because it is a model habit?

Familiar patterns are allowed when they reduce error, learning cost, or inconsistency. Novelty is not a goal.

Read `references/structural-direction.md` and `references/information-design.md` when structure is open.

## Establish a product-grounded visual direction

If a protected visual system exists, inherit it unless the user asked for replacement.

Otherwise ground the direction in the subject, audience, usage scene, content, culture, materials, tempo, trust level, and interaction frequency. Compare materially different directions only when major visual axes are genuinely open.

Do not escape generic SaaS by repeatedly choosing another generic anti-default. Repeated paper/editorial, dark-neon, glass/glow, soft-card, terminal, or other house worlds across unrelated products are evidence of convergence, not proof of originality.

Read `references/visual-direction.md` when visual authority is missing or being replaced. Load typography, color, media, and asset references only when those decisions are material.

## Design presentation rhythm

Typography, density, spacing, and simultaneous visibility are one information system.

Compress information through grouping, alignment, shared context, representation, and progressive disclosure before shrinking type. Dense work can be compact without turning most visible copy into microtype.

Mobile should change information priority or representation when needed instead of preserving desktop density by shrinking everything.

Read `references/presentation-rhythm.md` for data-heavy, workflow, reading, or comparison surfaces.

## Design connected state and task continuity

When state is related, decide what should react together and what should remain anchored.

For repeated workflows, browsing, nested detail, playback, or saved-state flows define:

- state lifetime
- next-action locality
- return contract for Back or close
- browse or traversal topology
- relationship actionability
- what survives reload and why

A feature is not complete if the user repeatedly reconstructs filters, selection, scroll, playback, or context after each action.

Read `references/task-continuity.md`. Use `references/interaction-contracts.md` for consequential, asynchronous, persistent, nested, or otherwise ambiguous interactions.

## Design interaction before motion

Start from domain verbs and object relationships. Decide how selection, manipulation, traversal, comparison, and return should behave before choosing effects.

Behavioral craft belongs inside the interaction model:

- important input should receive prompt feedback
- direct manipulation should track input continuously when the domain benefits from it
- interruptible interactions should not force the user to wait for choreography
- reversal or retargeting should continue from the current visible state when appropriate
- spatial relationships should remain understandable
- boundaries and completion should feel intentional
- repeated use should remain efficient, not theatrical

These are qualities, not universal spring, timing, scale, easing, or gesture values.

Motion is downstream of interaction. It may explain cause, hierarchy, spatial continuity, or a product-specific authored moment. Do not establish a reusable UI Slop animation recipe.

Read `references/experience-dynamics.md`, `references/interaction-hierarchy.md`, and `references/motion-interaction.md` only when their scope is relevant.

## Keep semantics diverse without losing system coherence

Consistency means shared rules and predictable behavior, not forcing unrelated meanings into the same pill, badge, card, tiny uppercase label, or metadata treatment.

Different semantic roles may use typography, position, color, shape, image treatment, relationship, or state change rather than another component wrapper.

Read `references/semantic-diversity.md` for heterogeneous content or repeated metadata systems.

## Compose responsive behavior

Breakpoints should respond to content or interaction failure, not habitual device numbers.

On narrow layouts, representation, navigation, detail behavior, action placement, and information priority may change. Preserve the primary object and task continuity.

Read `references/layout-responsive.md` for substantial responsive work.

## Reject filler and generated habits

Reject unjustified:

- cards around everything
- pills or badges as the default semantic language
- giant marketing headings in task software
- filler subtitles and layout-explanation labels
- decorative charts and generic KPI rows
- habitual top-right search
- generic main-plus-right-rail shells
- repeated section templates
- one visual world or interaction grammar reused across unrelated products

Anti-slop does not mean minimal. Replace removed decoration with stronger structure, typography, hierarchy, content, interaction, and subject-specific detail.

## Evidence before taste

For substantial visual work, rendered verification is required when browser tooling exists.

Use a bounded evidence loop:

1. operate the primary workflow with realistic content
2. inspect representative wide and narrow states
3. test keyboard and focus where applicable
4. test nested detail and return behavior
5. inspect reduced motion when motion exists
6. inspect loading, empty, error, or recovery states required by the product
7. record material findings
8. fix related findings together
9. rerun only the affected evidence plus a regression pass

When the P0 evidence tooling is available, use `references/evidence-harness.md`. A screenshot alone cannot prove interaction quality.

Evidence classifications:

- **hard_failure**: a specified requirement or independently verifiable standard fails
- **advisory**: measured pattern that may be a problem but requires product judgment
- **evidence_only**: neutral measurement with no automatic quality verdict
- **blocked**: required evidence could not be executed or observed

Never convert an aesthetic proxy into a hard failure merely because it is measurable.

Read `references/evidence-gate.md`, `references/browser-qa.md`, and `references/review-protocol.md` when verifying substantial work.

## AI Fingerprint Gate

Before acceptance, inspect for repeated generated patterns at several layers:

- structural silhouette
- visual-material world
- typography role collapse
- semantic-to-component collapse
- repeated interaction mechanics
- repeated motion triggers
- repeated responsive transformation
- layout-explanation copy

Similarity is evidence, not automatic failure. Ask whether the pattern is product-justified and whether it causes functional, comprehension, identity, or repeated-use harm.

If no unrelated comparison corpus is available, mark cross-product recurrence as not verified rather than inventing one.

Read `references/ai-fingerprint-gate.md` when recurrence is relevant.

## Taste Gate

After objective failures are resolved, judge whether the finished interface is actually authored for this product:

- would the structure still feel specific without the logo?
- do domain objects and relationships shape the interface?
- is typography readable and intentional?
- does the visual world come from the product rather than a model habit?
- does interaction reveal relationships and preserve orientation?
- can the user continue naturally through second and third actions?
- is mobile intentionally composed?
- does repeated use remain efficient?
- is the weakest visible region part of the same product world?

A clean but interchangeable interface is not finished.

Read `references/taste-gate.md` when making the final qualitative judgment.

## Specialist skills

UI Slop must remain useful by itself. Load specialists narrowly for framework implementation, accessibility, performance, motion, image generation, browser automation, or platform-specific guidance.

Priority:

1. explicit user instruction
2. protected product/domain contract
3. project and platform constraints
4. narrower specialist guidance inside its specialty
5. UI Slop reasoning

Do not merge several specialists' preferred aesthetics into one product.

## Finish condition

Do not claim verified work without evidence.

Report what was operated, measured, observed, blocked, or not checked. Preserve product behavior tests. Replace presentation tests only when they freeze obsolete presentation rather than current behavior or accessibility.
