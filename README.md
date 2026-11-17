# UI Slop

A standalone, composable Agent Skill for production UI that resists generic AI composition, component repetition, shallow interaction design, and fixed generated motion grammar.

UI Slop is not a component library or a fixed visual theme.

It is a UI design and engineering decision system.

Its job is to preserve the product contract while forcing an agent to choose product-specific structure, art direction, typography, information relationships, interaction behavior, responsive behavior, and task continuity, then verify the actual rendered product.

## Current release: v1.9

v1.7 established **Task Continuity** and proved useful across fresh research and store samples.

The next comparative audit exposed a different problem:

> the skill could still prime agents with a small safe animation vocabulary and encourage dense interfaces to buy capacity through microtype.

v1.8 addresses this upstream instead of adding more animation effects.

### Final v1.9 cleanup

Fresh v1.8 generations across Research, Travel, Creative, and Operations showed that interaction topology now varies meaningfully by domain and Presentation Rhythm materially improved readability.

The remaining repeated failure was **second-order visual convergence**: four unrelated products independently landed in a similar warm-paper / dark-ink / thin-rule / restrained-accent material world.

v1.9 keeps the v1.8 interaction and density architecture, and adds only narrow evidence-backed safeguards:

- cross-product material-world comparison before visual-direction lock
- anti-default convergence detection beyond palette/layout similarity
- layout-explanation copy restraint
- direct-manipulation opportunity check for spatial/time-based editable objects
- motion-causality QA so unrelated rerenders do not replay meaningful transitions

No new fixed aesthetic or animation recipe is introduced.

### New in v1.8

**Experience Dynamics**

- interaction concepts before effects
- domain verbs and object manipulation
- reactive depth
- surface transformation
- direct manipulation / action locality
- motion topology
- temporal hierarchy
- behavioral silhouette comparison across unrelated products

**Presentation Rhythm**

- information budget per viewport
- typography role economy
- information-compression order
- microtype-majority warning
- density by region
- coordinated typography + spacing + density

**Motion de-bias**

Removed the old generic recipe that supplied:

- fixed duration bands
- generic travel distances
- press-scale defaults
- transform/opacity as a preferred motion palette
- "small motion vocabulary" wording

Motion now sits downstream of the interaction model.

## Core workflow

```text
route task
→ protect product contract
→ identify user jobs + domain objects
→ map important information relationships
→ define surface mode + intended feeling
→ establish design thesis
→ explore structural directions
→ establish visual + typography direction
→ design presentation rhythm
→ design reactive shared state
→ explore interaction directions
→ design task continuity
→ implement interaction + motion
→ responsive composition
→ browser QA with recorded interaction sequence
→ behavioral + static fingerprint gates
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
│   ├── experience-dynamics.md
│   ├── extension-protocol.md
│   ├── information-design.md
│   ├── information-relationships.md
│   ├── interaction-hierarchy.md
│   ├── interaction-states.md
│   ├── layout-responsive.md
│   ├── motion-interaction.md
│   ├── performance-baseline.md
│   ├── presentation-rhythm.md
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
    ├── cross-sample-findings-v1.7.md
    ├── fieldnote-compare-audit-v1.8.md
    └── natural-cross-product-audit-v1.9.md
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

**Interaction logic should come from the domain, not a reusable effect bag.**

**Density should come from information design before microtype.**

**A task is not finished when the first action works.**

**A clean but interchangeable interface is not finished.**

**Escaping a default by repeating the same anti-default is still convergence.**
