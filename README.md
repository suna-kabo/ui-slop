# UI Slop v3

UI Slop is a Codex skill for shaping, proving, building, and reviewing production interfaces. Its finish condition is:

> The product contract is protected, the core experience is proven, and no material part of the primary experience feels obviously wrong.

## Install and invoke

With Node.js 20 or newer, clone or update the repository and run these commands from the checkout.

```sh
git clone https://github.com/suna-kabo/ui-slop.git
cd ui-slop
npm ci
npm run skill:install:user
```

The user install goes to `~/.agents/skills/ui-slop/`. On Windows, `~` is your user profile. Start a fresh Codex desktop local session or Codex CLI session. To select the skill explicitly, ask: “Use `$ui-slop` to review this interface.” The installed `SKILL.md` is at the root of the skill directory.

For project scope, run `npm run skill:install:project -- "/path/to/project"`. The command defaults to the directory you invoked npm from. It installs into `<project>/.agents/skills/ui-slop/`. Both installers replace only the UI Slop directory. Use the same install command to update after pulling the latest changes and running `npm ci`. To uninstall, remove the corresponding `ui-slop/` directory and start a fresh session.

Use the bounded [Codex smoke prompt](examples/codex-skill-smoke-prompt.txt) from this checkout to verify discovery and file loading. The installer prints the installed version. You can also read `skill-manifest.json` alongside the resolved `SKILL.md` or run `node "<skill-dir>/tools/ui-slop-v3.mjs" --version`.

## Pack and diagnose

```sh
npm run skill:pack
npm run skill:doctor
npm run skill:doctor -- "/path/to/project"
```

`skill:pack` rebuilds the portable `dist/ui-slop/` directory from the root skill, references, templates, and evidence scripts. The generated manifest records the version, source digest, and file hashes. `skill:doctor` checks that output and any user or target project copies, then checks the Playwright runtime and launches Chromium. It reports repairs without editing files.

## Browser evidence

Skill discovery uses local files and requires no custom MCP. Built-in Codex browser and computer-use tools are optional. UI Slop uses Playwright for repeatable workflow evidence.

To enable capture from an installed copy, run the following using the directory containing the resolved `SKILL.md`. Repeat the dependency step after reinstalling the skill. To run from the checkout, use its root as `<skill-dir>`.

```sh
npm --prefix "<skill-dir>" ci --ignore-scripts
npm --prefix "<skill-dir>" exec --no -- playwright install chromium
node "<skill-dir>/tools/ui-slop-v3.mjs" inspect .
```

On Linux runners that need system libraries, use `playwright install --with-deps chromium`. Set `UI_SLOP_CHROMIUM_PATH` to use a system Chromium executable. See the [Evidence Harness](references/evidence-harness.md) for capture and validation commands.

Evidence Gate status comes from executed requirements and independently verifiable standards. Quality Gate status requires a qualitative review of the rendered and operated experience. [Skill workflow](SKILL.md)
