"""Freeze inputs and launch isolated Codex CLI sessions. Python 3.10+."""

import argparse
import concurrent.futures
import datetime
import hashlib
import io
import json
import os
from pathlib import Path
import random
import shutil
import stat
import subprocess
import uuid
import zipfile


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
INPUTS = HERE / "benchmark"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def hashes(root):
    return {p.relative_to(root).as_posix(): digest(p.read_bytes())
            for p in sorted(root.rglob("*")) if p.is_file()}


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def extract(archive, dest):
    """Accept file and directory entries with canonical, portable names only."""
    dest.mkdir(parents=True, exist_ok=False)
    seen = set()
    entries = archive.infolist()
    if sum(entry.file_size for entry in entries) > 250_000_000:
        raise ValueError("Archive exceeds extraction limit")
    for entry in entries:
        name = entry.filename.rstrip("/")
        parts = name.split("/")
        if (any(part in ("", ".", "..") or part.endswith((" ", ".")) for part in parts)
                or any(char in name for char in '\\:<>|?*"')
                or any(Path(part).is_reserved() for part in parts)
                or name.casefold() in seen or stat.S_ISLNK(entry.external_attr >> 16)):
            raise ValueError(f"Unsafe or duplicate archive path: {entry.filename!r}")
        seen.add(name.casefold())
        target = dest.joinpath(*parts)
        if entry.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(entry) as source, target.open("xb") as output:
                shutil.copyfileobj(source, output)


def prepare(root, original):
    root.mkdir(parents=True, exist_ok=True)
    if (root / "sealed").exists():
        raise FileExistsError("Frozen input directory already exists")
    sealed = root / "sealed"
    shutil.copytree(INPUTS, sealed / "benchmark")
    config = json.loads((INPUTS / "config.json").read_text())
    for label, revision in (("A", config["baseline"]), ("B", config["candidate"])):
        data = subprocess.check_output([
            "git", "archive", "--format=zip", revision, "SKILL.md", "references", "examples"
        ], cwd=REPO)
        extract(zipfile.ZipFile(io.BytesIO(data)), sealed / label)

    runs = []
    pairs = []
    randomizer = random.SystemRandom()
    for family in config["families"]:
        for repeat in range(1, config["runsPerCell"] + 1):
            pair = []
            for condition in ("A", "B"):
                run_id = uuid.uuid4().hex[:10]
                run = root / "workspaces" / run_id
                shutil.copytree(sealed / condition, run / "skill")
                shutil.copyfile(sealed / "benchmark" / f"{family}.md", run / "brief.md")
                runs.append(dict(id=run_id, family=family, repeat=repeat, condition=condition))
                pair.append(run_id)
            randomizer.shuffle(pair)
            pairs.append(dict(family=family, ids=pair))
    randomizer.shuffle(runs)
    randomizer.shuffle(pairs)
    save(sealed / "private-key.json", runs)
    save(sealed / "review-order.json", pairs)
    save(root / "frozen-input-hashes.json", hashes(sealed))

    if original:
        history = root / "history"
        with zipfile.ZipFile(original) as archive:
            extract(archive, history)
        save(root / "historical-source-hashes.json", {
            "archive": digest(original.read_bytes()), "files": hashes(history)
        })


def codex_executable():
    # The Windows installer provides the native executable through this runtime variable.
    executable = os.environ.get("CODEX_APP_RUNTIME_CLI_PATH") or shutil.which("codex")
    if not executable:
        raise FileNotFoundError("codex executable missing")
    return executable


def generate(root, workers, model, scoped_tools, only, attempt):
    sealed = root / "sealed"
    frozen = json.loads((root / "frozen-input-hashes.json").read_text())
    if hashes(sealed) != frozen:
        raise ValueError("Frozen experiment inputs changed")
    config = json.loads((sealed / "benchmark" / "config.json").read_text())
    runs = json.loads((sealed / "private-key.json").read_text())
    if only:
        runs = [case for case in runs if case["id"] == only]
        if not runs:
            raise ValueError("Unknown run ID")
    prompt = (sealed / "benchmark" / "generator.txt").read_text(encoding="utf-8")
    browser_lib = REPO / "node_modules" / "playwright"
    if not (browser_lib / "package.json").is_file():
        raise FileNotFoundError("Run npm ci in the repository before generating")
    if scoped_tools:
        prompt += "\nUse the local workspace MCP tools for all reads, writes, copies and Playwright Chromium operations. Do not use the shell. Keep labels for browser runs unique. Preserve the proof separately under proof/.\n"
    else:
        prompt += f"\nFor browser testing only, import Playwright from the absolute path {browser_lib.as_posix()}/index.mjs.\n"
    suffix = f"-{attempt}" if attempt else ""
    logs = root / (("scoped-generation-logs" if scoped_tools else "generation-logs") + suffix)
    logs.mkdir(exist_ok=False)
    exe = codex_executable()
    args = [exe, "exec", "--ephemeral", "--ignore-user-config", "--skip-git-repo-check",
            "--sandbox", "workspace-write", "--json"]
    if model:
        args.extend(["--model", model])
    save(logs / "configuration.json", dict(workers=workers, model=model or "CLI default",
                                          budgetMinutes=config["runBudgetMinutes"], flags=args[2:],
                                          transport="scoped local MCP" if scoped_tools else "nested shell"))

    def run_case(case):
        run_id = case["id"]
        directory = root / (("scoped-workspaces" if scoped_tools else "workspaces") + suffix) / run_id
        case_args = [*args, "-C", str(directory)]
        if scoped_tools:
            shutil.copytree(sealed / case["condition"], directory / "skill")
            shutil.copyfile(sealed / "benchmark" / f"{case['family']}.md", directory / "brief.md")
            path = (HERE / "workspace-tools.mjs").as_posix()
            case_args.extend(["-c", f"mcp_servers.workspace={{ command='node', args=['{path}'], "
                              f"cwd='{directory.as_posix()}', default_tools_approval_mode='approve' }}"])
        started = datetime.datetime.now(datetime.timezone.utc).isoformat()
        timeout = False
        with (logs / f"{run_id}.jsonl").open("wb") as events, (logs / f"{run_id}.stderr.txt").open("wb") as stderr:
            with subprocess.Popen([*case_args, "-"], cwd=directory,
                                  stdin=subprocess.PIPE, stdout=events, stderr=stderr) as process:
                try:
                    process.communicate(prompt.encode(), timeout=60 * config["runBudgetMinutes"])
                except subprocess.TimeoutExpired:
                    timeout = True
                    process.kill()
                    process.communicate()
        result = dict(id=run_id, started=started, timeout=timeout, returncode=process.returncode,
                      finished=datetime.datetime.now(datetime.timezone.utc).isoformat())
        save(logs / f"{run_id}.status.json", result)
        print(json.dumps(result), flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        list(executor.map(run_case, runs))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phase", choices=("prepare", "generate"))
    parser.add_argument("root", type=Path)
    parser.add_argument("--original", type=Path)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--model")
    parser.add_argument("--scoped-tools", action="store_true")
    parser.add_argument("--run-id")
    parser.add_argument("--attempt", choices=("retry1",))
    args = parser.parse_args()
    root = args.root.resolve()
    if args.phase == "prepare":
        prepare(root, args.original)
    else:
        generate(root, args.workers, args.model, args.scoped_tools, args.run_id, args.attempt)


if __name__ == "__main__":
    main()
