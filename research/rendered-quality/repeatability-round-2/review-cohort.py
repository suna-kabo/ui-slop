"""Give two isolated reviewers each opaque pair and freeze their observations."""

import argparse
import concurrent.futures
import json
from pathlib import Path
import random
import shutil
import subprocess

from cohort import HERE, codex_executable, hashes, save


ASSETS = {".html", ".js", ".mjs", ".css", ".json", ".svg", ".png", ".jpg",
          ".jpeg", ".webp", ".woff", ".woff2", ".avif", ".ico"}
PROMPT = """Independently review this pair of runnable products for the same brief. Open brief.md,
protocol.md and pair.json with the supplied workspace MCP. Treat the pair in listed order.
The two folders initial/ and final/ contain phase-matched artifacts. Visit each first useful
desktop and mobile state visually. Operate each app on the actual frozen tasks and a secondary
state, with keyboard, recovery and return. Capture named screenshots and Playwright traces.
In a snapshot tool call each operate begins in a fresh context, so put related actions in
one sequence. Inspect source only after recording what the rendered app and actions showed.
Do not use the shell or modify the runnable files. Use process/ for output. Give separate
Initial and Final pairwise preferences (or tie/indeterminate), with reasons for visual and
interaction quality at both sizes and exact links to the evidence. Separate Evidence Gate
(PASS/FAIL/BLOCKED on executed contract evidence) from Quality Gate (READY/NOT_READY/BLOCKED
with effects on task decisions). Distinguish visual tradeoffs from material defects. Do not
assign aesthetic scores or guess the source of either app. Explain coverage gaps. Write the
complete independent review to process/review.md before replying. You have 12 minutes.
"""


def runtime_copy(source, target):
    for path in source.rglob("*"):
        if path.is_symlink():
            raise ValueError(f"Unexpected link: {path}")
        if path.is_file() and path.suffix.lower() in ASSETS and not any(
                part.startswith(".") for part in path.relative_to(source).parts):
            dest = target / path.relative_to(source)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, dest)


def prepare(root, source, extend, ready_only):
    sealed = root / "sealed"
    pairs = json.loads((sealed / "review-order.json").read_text())
    packet = root / "review-packet"
    packet.mkdir(exist_ok=extend)
    manifest = root / "runnable-output-hashes.json"
    if manifest.is_file() and hashes(packet) != json.loads(manifest.read_text()):
        raise ValueError("Existing review packet changed after freeze")
    config = json.loads((sealed / "benchmark" / "config.json").read_text())
    coverage = []
    queue = []
    selections = {}
    for row in pairs:
        family, ids = row["family"], row["ids"]
        locations = {}
        for run in ids:
            status = root / "scoped-generation-logs" / f"{run}.status.json"
            locations[run] = source / run if status.is_file() or not ready_only else None
            retry = root / "scoped-workspaces-retry1" / run
            retry_status = root / "scoped-generation-logs-retry1" / f"{run}.status.json"
            if status.is_file() and not (source / run / "final" / "index.html").is_file() and retry_status.is_file():
                locations[run] = retry
            if locations[run]:
                selections[run] = str(locations[run].relative_to(root).as_posix())
        pair = {
            "family": family,
            "ids": ids,
            "states": {phase: [run for run in ids if locations[run] and (locations[run] / phase / "index.html").is_file()]
                       for phase in config["states"]},
        }
        for phase, available in pair["states"].items():
            for run in available:
                path = Path(phase) / run
                if not (packet / path).exists():
                    runtime_copy(locations[run] / phase, packet / path)
                queue.append(dict(id=f"{run}-{phase}", task=family, entry=(path / "index.html").as_posix()))
        coverage.append(pair)
    if not (packet / "benchmark").exists():
        shutil.copytree(sealed / "benchmark", packet / "benchmark", ignore=shutil.ignore_patterns("config.json", "generator.txt"))
    save(packet / "queue.json", queue)
    save(packet / "pairs.json", coverage)
    save(manifest, hashes(packet))
    save(root / "artifact-selections.json", selections)


def review(root, workers, extend, only_pairs):
    packet = root / "review-packet"
    if hashes(packet) != json.loads((root / "runnable-output-hashes.json").read_text()):
        raise ValueError("Review packet changed after freeze")
    pairs = json.loads((packet / "pairs.json").read_text())
    review_root = root / "reviewers"
    review_root.mkdir(exist_ok=extend)
    prior = root / "frozen-review-hashes.json"
    if prior.is_file() and hashes(review_root) != json.loads(prior.read_text()):
        raise ValueError("Existing reviewer records changed after freeze")
    jobs = []
    for index, pair in enumerate(pairs, 1):
        if only_pairs and index not in only_pairs:
            continue
        if not any(len(ready) == 2 for ready in pair["states"].values()):
            continue
        for number in (1, 2):
            directory = review_root / f"{index}-{number}"
            if (directory / "status.json").exists():
                continue
            directory.mkdir()
            shutil.copyfile(packet / "benchmark" / f"{pair['family']}.md", directory / "brief.md")
            shutil.copyfile(packet / "benchmark" / "protocol.md", directory / "protocol.md")
            # Independently randomize the displayed order for each evaluator.
            randomized = json.loads(json.dumps(pair))
            random.SystemRandom().shuffle(randomized["ids"])
            save(directory / "pair.json", randomized)
            for phase, ready in pair["states"].items():
                for run in ready:
                    shutil.copytree(packet / phase / run, directory / phase / run)
            jobs.append(directory)

    def run(directory):
        before = {phase: hashes(directory / phase) for phase in ("initial", "final")}
        transport = (HERE / "workspace-tools.mjs").as_posix()
        spec = (f"mcp_servers.workspace={{command='node', args=['{transport}', 'review'], "
                f"cwd='{directory.as_posix()}', default_tools_approval_mode='approve'}}")
        args = [codex_executable(), "exec", "--ephemeral", "--ignore-user-config", "--skip-git-repo-check",
                "--sandbox", "workspace-write", "--json", "-C", str(directory), "-c", spec, "-"]
        timeout = False
        with (directory / "events.jsonl").open("wb") as events, (directory / "stderr.txt").open("wb") as stderr:
            try:
                result = subprocess.run(args, input=PROMPT.encode(), cwd=directory, stdout=events,
                                        stderr=stderr, timeout=720)
            except subprocess.TimeoutExpired:
                timeout = True
        unchanged = all(before[phase] == hashes(directory / phase) for phase in before)
        review_file = directory / "process" / "review.md"
        save(directory / "status.json", dict(timeout=timeout, returncode=None if timeout else result.returncode,
                    sourcesUnchanged=unchanged, findings=hashes(review_file.parent).get("review.md")))
        print(directory.name, "frozen review" if review_file.is_file() and unchanged else "incomplete", flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        list(pool.map(run, jobs))
    save(root / "frozen-review-hashes.json", hashes(review_root))


def combine(root, waves):
    def verify(wave):
        directory = wave / "reviewers"
        frozen = json.loads((wave / "frozen-review-hashes.json").read_text())
        if hashes(directory) != frozen:
            raise ValueError(f"Review records changed after freeze: {wave.name}")
        return directory

    target = verify(root)
    for wave in waves:
        source = verify(wave)
        for folder in sorted(source.iterdir()):
            if (target / folder.name).exists():
                raise FileExistsError(f"Reviewer ID already present: {folder.name}")
            shutil.copytree(folder, target / folder.name)
    save(root / "frozen-review-hashes.json", hashes(target))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phase", choices=("prepare", "review", "combine"))
    parser.add_argument("root", type=Path)
    parser.add_argument("--workspaces", default="scoped-workspaces")
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--extend", action="store_true")
    parser.add_argument("--ready-only", action="store_true")
    parser.add_argument("--pair", type=int, action="append")
    parser.add_argument("--wave", type=Path, action="append", default=[])
    args = parser.parse_args()
    root = args.root.resolve()
    if args.phase == "prepare":
        prepare(root, root / args.workspaces, args.extend, args.ready_only)
    elif args.phase == "review":
        review(root, args.workers, args.extend, args.pair)
    else:
        combine(root, args.wave)
