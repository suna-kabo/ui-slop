"""Create portable ZIPs with file-level SHA-256 evidence manifests."""

import argparse
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
    files["SHA256.json"] = manifest
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
        "history-verification", "historical-findings.md",
    ])
    evidence_zip(args.staging, args.output, "ui-slop-repeatability-evidence", [
        "sealed", "frozen-input-hashes.json", "generation-logs", "scoped-generation-logs",
        "generator-environment.json", "scoped-workspaces", "scoped-workspaces-retry1",
        "scoped-generation-logs-retry1", "fallback-evidence", "review-packet", "artifact-selections.json",
        "runnable-output-hashes.json", "reviewers", "frozen-review-hashes.json", "opening-views",
        "repository-tests.txt", "package-doctor.txt", "package-smoke", "installed-skill-model-smoke.jsonl",
        "investigation.md", "reproduction.md", "inventory.json", "targeted-retests",
    ])
    save(args.output / "archive-sha256.json", {file.name: digest(file.read_bytes())
         for file in sorted(args.output.glob("*.zip"))})
