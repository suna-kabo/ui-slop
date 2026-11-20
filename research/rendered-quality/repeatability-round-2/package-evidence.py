"""Create portable ZIPs with file-level SHA-256 evidence manifests."""

import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path, PurePosixPath
import zipfile

from cohort import digest, save


def make_zip(output, files):
    if not files:
        raise ValueError("Missing content for archive")
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=7) as archive:
        for name, file in sorted(files.items()):
            item = zipfile.ZipInfo(name, date_time=(2026, 11, 21, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            archive.writestr(item, file.read_bytes())
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise ValueError(f"ZIP integrity check failed: {output.name}")
        if set(archive.namelist()) != set(files):
            raise ValueError(f"Unexpected ZIP member: {output.name}")
        for name in archive.namelist():
            if digest(archive.read(name)) != digest(files[name].read_bytes()):
                raise ValueError(f"Hash mismatch for {name}")


def file_tree(source, prefix):
    if source.is_file():
        return {prefix: source}
    return {str(PurePosixPath(prefix, file.relative_to(source).as_posix())): file
            for file in source.rglob("*") if file.is_file() and not file.is_symlink()}


def skill_zip(source, output):
    manifest = json.loads((source / "skill-manifest.json").read_text())
    files = {name: source / name for name in manifest["files"]}
    if any(digest(file.read_bytes()) != manifest["files"][name] for name, file in files.items()):
        raise ValueError("Clean skill payload does not match its manifest")
    files["skill-manifest.json"] = source / "skill-manifest.json"
    make_zip(output / "ui-slop-3.0.1-repeatability-candidate.zip", {
        f"ui-slop/{name}": file for name, file in files.items()
    })


def evidence_zip(staging, output, slug, members):
    files = {}
    for member in members:
        source = staging / member
        if source.exists():
            files.update(file_tree(source, member))
    manifest = staging / f"{slug}-file-hashes.json"
    save(manifest, {name: digest(path.read_bytes()) for name, path in sorted(files.items())})
    files[f"SHA256-{slug}.json"] = manifest
    make_zip(output / f"{slug}.zip", files)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("staging", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("skill", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    skill_zip(args.skill, args.output)
    evidence_zip(args.staging, args.output, "ui-slop-kilnroom-historical-replay", [
        "history", "historical-source-hashes.json", "historical-captures", "historical-replay.txt",
        "history-verification", "HISTORICAL.md",
    ])
    pairs = json.loads((args.staging / "review-packet" / "pairs.json").read_text())
    reviewer_summary = []
    by_family = {}
    for index, pair in enumerate(pairs, 1):
        folders = [f"reviewers/{index}-{number}" for number in (1, 2)]
        by_family.setdefault(pair["family"], []).extend(folders)
        for folder in folders:
            reviewer_summary += [f"{folder}/{name}" for name in (
                "pair.json", "brief.md", "protocol.md", "status.json", "process/review.md",
            )]
    evidence_zip(args.staging, args.output, "ui-slop-repeatability-evidence", [
        "sealed", "frozen-input-hashes.json", "generation-logs", "scoped-generation-logs",
        "generator-environment.json", "scoped-workspaces", "scoped-workspaces-retry1",
        "scoped-generation-logs-retry1", "fallback-evidence", "review-packet", "artifact-selections.json",
        "runnable-output-hashes.json", "frozen-review-hashes.json", "opening-views", *reviewer_summary,
        "repository-tests.txt", "package-doctor.txt", "package-smoke", "installed-skill-model-smoke.jsonl",
        "final-repository-tests.txt", "final-package-doctor.txt", "final-package-smoke",
        "final-package-validate.json", "final-installed-skill-model-smoke.jsonl",
        "INVESTIGATION.md", "REPRODUCE.md", "HISTORICAL.md", "benchmark", "inventory.json",
        "targeted", "targeted-retests",
    ])
    with ThreadPoolExecutor(max_workers=len(by_family)) as pool:
        results = [pool.submit(evidence_zip, args.staging, args.output, f"ui-slop-blind-traces-{family}", folders)
                   for family, folders in by_family.items()]
        for result in results:
            result.result()
    save(args.output / "archive-sha256.json", {file.name: digest(file.read_bytes())
         for file in sorted(args.output.glob("*.zip"))})
