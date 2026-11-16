# UI Slop

An opinionated anti-slop Agent Skill for designing, rebuilding, refining, and auditing production user interfaces.

UI Slop is not a component library and not a fixed visual theme. It is a **UI design and engineering operating system** for agents.

The name is intentionally blunt. The skill exists to stop generic AI-generated interface habits before they become the product.

Its core idea is simple:

> Protect the product contract. Treat presentation as redesignable. Build a coherent visual and interaction system, then verify it in the real browser.

The skill is designed to fight generic AI-generated UI by combining product hierarchy, layout, spacing, typography, restrained color, interaction motion, accessibility, performance, and mandatory browser self-review.

## What it covers

- product-contract discovery before visual changes
- ground-up redesign authority when permitted
- anti-AI-slop rules
- no defensive or implementation-facing product copy
- information architecture and hierarchy
- layout, density, and spacing rhythm
- rounded / humanist typography defaults
- restrained color and shape language
- motion and interaction grammar
- tables, lists, inspectors, and mobile composition
- browser interaction and visual critique loops
- accessibility and 200% reflow
- frontend performance
- updating obsolete presentation-specific tests without weakening behavior
- capability discovery, including relevant skills/plugins/tools when the host permits it

## Philosophy

UI Slop does **not** force every product to look the same.

User-provided brand direction, existing design systems, and product constraints override the fallback aesthetic.

When no direction is supplied, the defaults favor:

- calm, modern, mature interfaces
- medium density
- rounded or humanist UI typography
- neutral foundations with restrained semantic color
- modest radii and minimal decorative surfaces
- high-quality motion used for continuity rather than spectacle
- static screens that feel humble, with personality revealed through interaction

## Skill structure

```text
ui-slop/
├── SKILL.md
├── README.md
├── LICENSE
├── .gitignore
├── references/
│   ├── visual-defaults.md
│   ├── design-system.md
│   ├── origin-principles.md
│   ├── layout-spacing-system.md
│   ├── typography-system.md
│   ├── motion-system.md
│   └── review-checklist.md
└── examples/
    ├── audit-only.md
    ├── ground-up-rebuild.md
    └── refinement-pass.md
```

A skill is a folder anchored by `SKILL.md`. Supporting references can be loaded when needed.

## Install

For Codex, project-scoped skills live under `.agents/skills/`; user-scoped skills live under `~/.agents/skills/`.

### User-scoped

```bash
git clone <YOUR_UI_SLOP_REPO_URL> ~/.agents/skills/ui-slop
```

PowerShell:

```powershell
git clone <YOUR_UI_SLOP_REPO_URL> "$HOME\.agents\skills\ui-slop"
```

### Track it inside a Git project

If you want the skill version pinned with a project, use a submodule rather than an accidental nested Git repository:

```bash
mkdir -p .agents/skills
git submodule add <YOUR_UI_SLOP_REPO_URL> .agents/skills/ui-slop
```

You can also copy the `ui-slop` folder manually into the skills directory used by another compatible agent environment.

Then ask the agent to use `ui-slop` for a UI build, redesign, refinement, or audit. Compatible agents can also discover it automatically from the `name` and `description` in `SKILL.md`.

The release ZIP is also valid as an OpenAI skill bundle: it contains one top-level `ui-slop/` folder and exactly one `SKILL.md`.

## Typical uses

- rebuild an existing app without inheriting its visual debt
- redesign a dashboard that feels generic or AI-generated
- establish a coherent layout / spacing / motion system
- refine an already-good UI without over-designing it
- audit a frontend for hierarchy, usability, accessibility, and polish
- give a coding agent enough autonomy to make visual decisions and iterate in-browser

## System references

- [Visual defaults](references/visual-defaults.md)
- [Design system](references/design-system.md)
- [Layout and spacing](references/layout-spacing-system.md)
- [Typography](references/typography-system.md)
- [Motion and interaction](references/motion-system.md)
- [Final review checklist](references/review-checklist.md)
- [Origin principles](references/origin-principles.md)

The references are progressive disclosure. The agent should load the relevant parts when the task needs them rather than treating every file as mandatory context for every tiny UI change.

## Tool and plugin autonomy

Before substantial UI work, the skill tells the agent to inspect available capabilities for frontend implementation, design, browser automation, accessibility, performance, and visual review.

When the host environment allows it, the agent may discover, enable, or install useful skills/plugins. Any authentication or explicit permission requirement still follows the host platform's approval flow.

## Not a visual template

UI Slop intentionally does not ship a fixed page template, component library, or mandatory palette.

The point is to produce interfaces that are coherent with their product, not interfaces that all look like UI Slop.

## License

MIT.
