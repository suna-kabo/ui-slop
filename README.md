# UI Slop

A standalone, composable Agent Skill for production UI that resists generic AI composition, component repetition, and shallow interaction design.

UI Slop is not a component library or a fixed visual theme.

It is a UI design and engineering decision system.

Its job is to preserve the product contract while forcing an agent to choose product-specific structure, art direction, typography, information relationships, interaction, responsive behavior, and task continuity, then verify the actual rendered product.

## Current release: v1.7

v1.6 established three important layers:

- Semantic Diversity
- Reactive Surfaces
- Information Relationships

Two independent sample sets showed those changes working, but also exposed a higher-order failure mode:

> the first action can work while the next action, return path, or preserved context still feels accidental.

v1.7 adds **Task Continuity**.

It asks the agent to design:

- where the next likely action lives
- how long important state should survive
- what Back/close should restore
- how browse-heavy products connect objects beyond filters
- when relationships need an action
- how continuity changes on mobile
- how nested detail/history should behave

The detailed model lives in `references/task-continuity.md` so SKILL.md stays comparatively compact.

## Core workflow

```text
route task
→ protect product contract
→ identify user jobs + domain objects
→ map important information relationships
→ define surface mode + intended feeling
→ establish design thesis
→ explore structural directions
→ run silhouette check
→ establish visual + typography direction
→ build coherent system
→ design semantic diversity + reactive shared state
→ design task continuity
→ implement states + responsive + motion
→ browser QA from first action and live-state follow-up
→ AI Fingerprint Gate
→ Evidence Gate
→ Taste Gate
→ ship
```

## Structure

```text
ui-slop/
├── SKILL.md
├── README.md
├── LICENSE
├── ACKNOWLEDGEMENTS.md
├── CHANGELOG.md
├── .gitignore
├── references/
│   ├── accessibility-baseline.md
│   ├── ai-fingerprint-gate.md
│   ├── art-direction-media.md
│   ├── asset-strategy.md
│   ├── authored-experience.md
│   ├── browser-qa.md
│   ├── coherence-floor.md
│   ├── color-system.md
│   ├── craft-floor.md
│   ├── design-system.md
│   ├── evidence-gate.md
│   ├── extension-protocol.md
│   ├── information-design.md
│   ├── information-relationships.md
│   ├── interaction-hierarchy.md
│   ├── interaction-states.md
│   ├── layout-responsive.md
│   ├── motion-interaction.md
│   ├── performance-baseline.md
│   ├── reactive-surfaces.md
│   ├── semantic-diversity.md
│   ├── structural-direction.md
│   ├── task-continuity.md
│   ├── taste-gate.md
│   ├── typography-system.md
│   ├── visual-commitment.md
│   └── visual-direction.md
└── evidence/
    ├── v1.6.1-candidate-probe.md
    └── cross-sample-findings-v1.7.md
```

## Standalone first

UI Slop should produce a complete design workflow without requiring Impeccable, frontend-design, better-* skills, or another UI skill.

Browser automation, testing, accessibility tooling, image tooling, and performance measurement remain execution and verification capabilities.

## Composable by design

When another specialist skill is active, UI Slop does not fight it.

Priority:

1. explicit user instruction
2. protected product/domain contract
3. project/framework constraints
4. narrower specialist guidance inside its specialty
5. UI Slop system/taste guidance
6. UI Slop fallback suggestions

## Install

### Codex, current project

```bash
mkdir -p .agents/skills
git submodule add <YOUR_REPO_URL> .agents/skills/ui-slop
```

### Codex, all projects for the user

```bash
git clone <YOUR_REPO_URL> ~/.agents/skills/ui-slop
```

PowerShell:

```powershell
git clone <YOUR_REPO_URL> "$HOME\.agents\skills\ui-slop"
```

Other Agent-Skills-compatible environments can copy the whole `ui-slop` directory into their skill path.

## Philosophy

**Protect the product contract. Treat presentation as redesignable.**

**Domain objects should shape the interface.**

**Consistency should not erase semantic differences.**

**Related state should react together.**

**A task is not finished when the first action works.**

**Browse paths are product structure, not just filters.**

**A clean but interchangeable interface is not finished.**
