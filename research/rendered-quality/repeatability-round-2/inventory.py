"""Summarize frozen product and reviewer records without scoring design."""

import argparse
import json
from pathlib import Path

from cohort import digest, hashes, save


def events(file):
    if not file.is_file():
        return []
    return [json.loads(line) for line in file.read_text(encoding="utf-8").splitlines() if line]


def tool_calls(records, name):
    return [row["item"] for row in records if row.get("type") == "item.completed"
            and row.get("item", {}).get("tool") == name]


def run_record(root, case, selections):
    run_id = case["id"]
    origin = selections.get(run_id, f"scoped-workspaces/{run_id}")
    path = root / origin
    logs = "scoped-generation-logs-retry1" if "-retry1/" in origin else "scoped-generation-logs"
    log = root / logs / f"{run_id}.jsonl"
    records = events(log)
    calls = tool_calls(records, "operate")
    snapshots = {}
    for state in ("initial", "final"):
        directory = root / "review-packet" / state / run_id
        if not (directory / "index.html").is_file():
            snapshots[state] = None
            continue
        files = hashes(directory)
        snapshots[state] = dict(entry=f"review-packet/{state}/{run_id}/index.html",
                                entrySha256=files["index.html"],
                                treeSha256=digest(json.dumps(files, sort_keys=True).encode()))

    evidence = []
    for test in sorted((path / "process").glob("*/steps.json")):
        raw = json.loads(test.read_text(encoding="utf-8"))
        evidence.append(dict(label=test.parent.name, state=raw["entry"], width=raw["width"],
                             actionErrors=sum("error" in row for row in raw["rows"]),
                             runtimeErrors=raw["errors"]))
    status = log.with_suffix(".status.json")
    return {**case, "snapshots": snapshots, "workspace": origin, "hasProof": (path / "proof/index.html").is_file(),
            "thread": next((row.get("thread_id") for row in records if row["type"] == "thread.started"), None),
            "usage": next((row.get("usage") for row in reversed(records) if row["type"] == "turn.completed"), None),
            "runtime": json.loads(status.read_text()) if status.is_file() else None,
            "browserToolFailures": sum(bool(call.get("error") or (call.get("result") or {}).get("isError"))
                                       for call in calls),
            "browserEvidence": evidence,
            "reviewRecords": [str(record.relative_to(root).as_posix()) for record in sorted(
                (path / "process").glob("*.md"))]}


def main(root, output):
    original = json.loads((root / "historical-source-hashes.json").read_text())
    if hashes(root / "history") != original["files"]:
        raise ValueError("Historical files changed after extraction")
    if hashes(root / "sealed") != json.loads((root / "frozen-input-hashes.json").read_text()):
        raise ValueError("Benchmark inputs changed after freeze")
    if hashes(root / "review-packet") != json.loads((root / "runnable-output-hashes.json").read_text()):
        raise ValueError("Runnable snapshots changed after freeze")
    expected = json.loads((root / "frozen-review-hashes.json").read_text())
    if hashes(root / "reviewers") != expected:
        raise ValueError("Review records changed after freeze")
    key = json.loads((root / "sealed" / "private-key.json").read_text())
    selections = json.loads((root / "artifact-selections.json").read_text())
    inventory = sorted((run_record(root, case, selections) for case in key),
                       key=lambda case: (case["family"], case["repeat"], case["condition"]))
    save(output, inventory)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    main(args.root, args.output)
