"""Package the portable baseline and sealed research evidence separately."""

import argparse
import hashlib
from pathlib import Path
import zipfile

from trial import HERE, checked_bundle, encode, save


def digest_stream(source):
    digest = hashlib.sha256()
    while chunk := source.read(1024 * 1024):
        digest.update(chunk)
    return digest.hexdigest()


def digest_file(file):
    with file.open('rb') as source:
        return digest_stream(source)


def collect(folder, prefix, includes):
    def archive_name(name):
        return f'{prefix}/{name}' if prefix else name

    for name in includes:
        path = folder / name
        if path.is_file():
            yield archive_name(name), path
        elif path.is_dir():
            for file in path.rglob('*'):
                if file.is_file() and not file.is_symlink():
                    yield archive_name(file.relative_to(folder).as_posix()), file


def write_archive(output, files):
    members = {}
    manifest = f'{output.stem}-file-sha256.json'
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=5) as archive:
        for name, file in sorted(files):
            assert name not in members, name
            members[name] = digest_file(file)
            archive.write(file, name)
        archive.writestr(manifest, encode(members))
    with zipfile.ZipFile(output) as archive:
        assert set(archive.namelist()) == set(members) | {manifest}
        for name, digest in members.items():
            with archive.open(name) as source:
                assert digest_stream(source) == digest, name


def package(root, followup, selected, output):
    output.mkdir(parents=True, exist_ok=True)
    baseline = root / 'sealed/original'
    manifest = checked_bundle(baseline)
    stable = output / 'ui-slop-3.0.1-stable.zip'
    # Keep the installer-compatible skill ZIP limited to runtime bytes.
    with zipfile.ZipFile(stable, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name in ('skill-manifest.json', *manifest['files']):
            archive.write(baseline / name, 'ui-slop/' + name)
    with zipfile.ZipFile(stable) as archive:
        assert archive.testzip() is None
        for name, digest in manifest['files'].items():
            with archive.open('ui-slop/' + name) as source:
                assert digest_stream(source) == digest
    trial = ['sealed', 'frozen-inputs.json', 'packet', 'frozen-outputs.json', 'selected-runs.json',
             'generations-1', 'generations-2', 'work-1', 'work-2', 'openings', 'reviewers',
             'frozen-reviews.json', 'reviewers-retry', 'frozen-reviews-retry.json', 'summary.json']
    core = ['round2-openings', 'regressions', 'repository-tests.txt', 'baseline-doctor.txt',
            'baseline-browser-smoke', 'baseline-browser-verify.json']
    report = ('INVESTIGATION.md', 'REPRODUCE.md', 'PROTOCOL.md', 'briefs',
              'selection-experiment.txt', 'selection-followup.txt', 'regression-results.json')
    artifacts = [stable, output / 'first-pass-initial-trial.zip', output / 'first-pass-followup-trial.zip']
    write_archive(artifacts[1], [*collect(root, 'initial-trial', trial + core), *collect(HERE, '', report)])
    write_archive(artifacts[2], [*collect(followup, 'followup-trial', trial),
                                 *collect(selected, 'selected-proofs', trial + ['selected-proof-sources.json']),
                                 *collect(HERE, '', report)])
    save(output / 'archive-sha256.json', {file.name: digest_file(file) for file in artifacts})
    print('Verified both research archives and the clean stable package.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    parser.add_argument('followup', type=Path)
    parser.add_argument('selected', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    package(args.root, args.followup, args.selected, args.output)
