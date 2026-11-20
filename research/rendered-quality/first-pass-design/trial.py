"""Freeze, generate, and independently review first-pass concepts."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import random
import shutil
import subprocess
import time
import uuid


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
BASE = '3a2e5468a79e5ef5a5bdb3e52445d0fca99cf903'
SKILL = Path('.agents/skills/ui-slop')
GEN_SECONDS = 480
REVIEW_SECONDS = 480
RUNTIME = {'.html', '.js', '.css', '.mjs', '.json', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff2', '.ico'}
FLAGS = ['--ephemeral', '--ignore-user-config', '--skip-git-repo-check', '--sandbox', 'workspace-write',
         '--enable', 'skip_host_skill_discovery', '--enable', 'omit_skill_descriptions',
         '--disable', 'shell_tool', '--disable', 'unified_exec', '--json']


def sha(data):
    return hashlib.sha256(data).hexdigest()


def hashes(folder):
    return {p.relative_to(folder).as_posix(): sha(p.read_bytes()) for p in sorted(folder.rglob('*')) if p.is_file()}


def encode(value):
    return (json.dumps(value, indent=2, ensure_ascii=False) + '\n').encode('utf-8')


def save(path, value):
    path.write_bytes(encode(value))


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def checked_bundle(path):
    manifest = load(path / 'skill-manifest.json')
    actual = hashes(path)
    actual.pop('skill-manifest.json')
    assert actual == manifest['files'], str(path)
    assert sha(encode(manifest['files'])) == manifest['sourceDigest'], str(path)
    return manifest


def prepare(root, repeats, selection):
    root.mkdir(parents=True, exist_ok=True)
    sealed = root / 'sealed'
    sealed.mkdir()
    shutil.copytree(HERE / 'briefs', sealed / 'briefs')
    for name in ('generator.txt', 'PROTOCOL.md'):
        shutil.copyfile(HERE / name, sealed / name)
    shutil.copyfile(selection, sealed / 'selection-experiment.txt')
    shutil.copytree(REPO / 'dist' / 'ui-slop', sealed / 'original')
    base = checked_bundle(sealed / 'original')
    for name in base['files']:
        if name == 'package.json':
            continue  # The repository installer generates a runtime-only package manifest.
        blob = subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=REPO)
        assert blob.replace(b'\r\n', b'\n') == (sealed / 'original' / name).read_bytes(), name
    intervention = sealed / 'intervention'
    shutil.copytree(sealed / 'original', intervention)
    relative = 'references/concept-proof.md'
    file = intervention / relative
    text = file.read_text(encoding='utf-8')
    before, _, middle = text.partition('## Alternatives\n')
    _, _, after = middle.partition('## Proof sequence\n')
    assert before and after
    paragraph = (sealed / 'selection-experiment.txt').read_text(encoding='utf-8').strip()
    file.write_bytes(f'{before}## Alternatives\n\n{paragraph}\n\n## Proof sequence\n{after}'.encode())
    altered = load(intervention / 'skill-manifest.json')
    altered['files'][relative] = sha(file.read_bytes())
    altered['sourceDigest'] = sha(encode(altered['files']))
    save(intervention / 'skill-manifest.json', altered)
    assert {k for k, h in base['files'].items() if altered['files'][k] != h} == {relative}
    checked_bundle(intervention)
    rng = random.SystemRandom()
    runs, blocks = [], []
    for product in ('radio', 'print'):
        for repeat in range(1, repeats + 1):
            block = []
            for condition in 'ABC':
                opaque = uuid.uuid4().hex[:10]
                block.append(opaque)
                runs.append(dict(id=opaque, product=product, repeat=repeat, condition=condition))
            rng.shuffle(block)
            blocks.append(dict(product=product, ids=block))
    rng.shuffle(runs)
    rng.shuffle(blocks)
    save(sealed / 'assignments.json', runs)
    save(sealed / 'blocks.json', blocks)
    save(sealed / 'environment.json', dict(frozenRevision=BASE, flags=FLAGS, budget=GEN_SECONDS,
                                          reviewBudget=REVIEW_SECONDS, model='native CLI default',
                                          workspaceToolsSha256=sha((HERE / 'workspace-tools.mjs').read_bytes())))
    (sealed / 'review-prompt.txt').write_bytes(REVIEW.encode())
    save(root / 'frozen-inputs.json', hashes(sealed))


def check_seal(root):
    assert hashes(root / 'sealed') == load(root / 'frozen-inputs.json'), 'Frozen input changed'
    env = load(root / 'sealed/environment.json')
    assert env['flags'] == FLAGS and env['workspaceToolsSha256'] == sha((HERE / 'workspace-tools.mjs').read_bytes())


def executable():
    if os.environ.get('CODEX_APP_RUNTIME_CLI_PATH'):
        return os.environ['CODEX_APP_RUNTIME_CLI_PATH']
    for name in ('codex.exe', 'codex'):
        if path := shutil.which(name):
            return path
    raise FileNotFoundError('Native Codex CLI unavailable')


def run_session(workspace, prompt, log, mode, seconds):
    address = (HERE / 'workspace-tools.mjs').as_posix()
    spec = (f"mcp_servers.workspace={{command='node', args=['{address}', '{mode}'], "
            f"cwd='{workspace.as_posix()}', default_tools_approval_mode='approve'}}")
    command = [executable(), 'exec', *FLAGS, '-C', str(workspace), '-c', spec, '-']
    start = time.monotonic()
    started = datetime.now(timezone.utc).isoformat()
    timeout = False
    with log.with_suffix('.jsonl').open('wb') as events, log.with_suffix('.stderr.txt').open('wb') as stderr:
        try:
            completed = subprocess.run(command, input=prompt.encode(), cwd=workspace, stdout=events,
                                       stderr=stderr, timeout=seconds)
        except subprocess.TimeoutExpired:
            timeout = True
    return dict(started=started, elapsedSeconds=round(time.monotonic()-start, 2), timeout=timeout,
                returncode=None if timeout else completed.returncode)


def read_events(path):
    events = []
    for row in path.read_bytes().splitlines():
        try:
            events.append(json.loads(row))
        except (ValueError, UnicodeError):
            continue  # Preserve an interrupted final event in the raw log.
    return events


def generation(root, workers, only, attempt):
    check_seal(root)
    sealed = root / 'sealed'
    logs = root / f'generations-{attempt}'
    logs.mkdir()
    cases = [x for x in load(sealed / 'assignments.json') if not only or x['id'] in only]
    prompt = (sealed / 'generator.txt').read_text(encoding='utf-8')

    def generate(case):
        opaque = case['id']
        work = root / f'work-{attempt}' / opaque
        work.mkdir(parents=True)
        shutil.copyfile(sealed / 'briefs' / f"{case['product']}.md", work / 'brief.md')
        condition = case['condition']
        assignment = 'No UI/design skill is assigned. Use only brief.md and your ordinary implementation judgment.'
        digest = None
        if condition in 'BC':
            bundle = sealed / ('original' if condition == 'B' else 'intervention')
            shutil.copytree(bundle, work / SKILL)
            digest = checked_bundle(work / SKILL)['sourceDigest']
            assignment = (f'Use only the local project-installed UI Slop at `{SKILL.as_posix()}/SKILL.md`. '
                          'Read it and its adjacent skill-manifest.json through workspace tools before coding. '
                          'Read the referenced concept-proof and follow the skill through solution selection. '
                          'The experiment ends at the selected runnable proof, before the full-build stage. '
                          'Record the manifest sourceDigest and the absolute installed path in process/record.md.')
        (work / 'assignment.md').write_bytes(assignment.encode())
        log = logs / opaque
        status = run_session(work, prompt, log, 'generate', GEN_SECONDS)
        events = read_events(log.with_suffix('.jsonl'))
        calls = [e['item'] for e in events if e.get('type') == 'item.completed' and e.get('item', {}).get('tool') == 'read_files'
                 and not e['item'].get('error') and not (e['item'].get('result') or {}).get('isError')]
        paths = [p.replace('\\', '/').removeprefix('./') for e in calls for p in e['arguments']['paths']]
        assigned = [p for p in paths if p.startswith(SKILL.as_posix() + '/')]
        opened = {f'{SKILL.as_posix()}/{name}' for name in ('SKILL.md', 'skill-manifest.json', 'references/concept-proof.md')}
        status.update(id=opaque, attempt=attempt, digest=digest, skillFilesRead=assigned,
                      skillVerified=(opened.issubset(paths) and checked_bundle(work / SKILL)['sourceDigest'] == digest)
                      if digest else not assigned and not (work / SKILL).exists(),
                      ready=(work / 'initial/index.html').is_file(),
                      usage=next((e.get('usage') for e in reversed(events) if e.get('type') == 'turn.completed'), None))
        save(log.with_suffix('.status.json'), status)
        print(opaque, status['ready'], status['skillVerified'], status['elapsedSeconds'], flush=True)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        list(pool.map(generate, cases))


def copy_runtime(source, dest):
    for p in source.rglob('*'):
        assert not p.is_symlink()
        if p.is_file() and p.suffix.lower() in RUNTIME:
            path = dest / p.relative_to(source)
            path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(p, path)


def packet(root):
    check_seal(root)
    dest = root / 'packet'
    dest.mkdir()
    inventory, queue = {}, []
    for case in load(root / 'sealed' / 'assignments.json'):
        opaque = case['id']
        selected = None
        for logs in sorted(root.glob('generations-*')):
            status = logs / f'{opaque}.status.json'
            if status.is_file():
                record = load(status)
                if record['ready'] and record['skillVerified']:
                    selected = record
                    break
        inventory[opaque] = selected
        if selected:
            work = root / f"work-{selected['attempt']}" / opaque
            copy_runtime(work / 'initial', dest / 'initial' / opaque)
            queue.append(dict(id=opaque, task=case['product'], entry=f'initial/{opaque}/index.html'))
    save(root / 'selected-runs.json', inventory)
    save(dest / 'queue.json', queue)
    save(root / 'frozen-outputs.json', hashes(dest))


def selected_packet(root, destination):
    check_seal(root)
    assert hashes(root / 'packet') == load(root / 'frozen-outputs.json')
    destination.mkdir()
    shutil.copytree(root / 'sealed', destination / 'sealed')
    shutil.copyfile(root / 'frozen-inputs.json', destination / 'frozen-inputs.json')
    selections = load(root / 'selected-runs.json')
    save(destination / 'selected-runs.json', selections)
    provenance, queue = {}, []
    packet_path = destination / 'packet'
    packet_path.mkdir()
    for row in load(root / 'packet/queue.json'):
        case = row['id']
        source = root / f"work-{selections[case]['attempt']}" / case
        phase = 'final' if (source / 'final/index.html').is_file() else 'initial'
        provenance[case] = {'source': phase, 'sha256': hashes(source / phase)}
        copy_runtime(source / phase, packet_path / 'initial' / case)
        queue.append(row)
    save(packet_path / 'queue.json', queue)
    save(destination / 'selected-proof-sources.json', provenance)
    save(destination / 'frozen-outputs.json', hashes(packet_path))


REVIEW = '''Independently review three anonymous first-pass runnable concepts. Read brief.md, tasks.md, and order.json. Use workspace tools only. Look at each opening at 1440x900 and 390x844 before examining any source. For each design, operate the primary task, recovery and a second action at both sizes, combining steps into one operation per width where possible. Save evidence and specific consequences. Use fewer than 22 browser operations total and finish within eight minutes. Do not modify app files or infer conditions. Save process/review.json with keys order (array of IDs), observations (object keyed by ID, each value containing typography, composition, weakest, interaction, evidenceGate, qualityGate, evidence), ranking (best to worst array of arrays of IDs, tie IDs share an array), visualRanking, interactionRanking (same format), disagreementPoints (array of tradeoffs), and gaps (array of unverified claims). Use only PASS/FAIL/BLOCKED for Evidence Gate and READY/NOT_READY/BLOCKED for Quality Gate. Include exact paths or labels for your browser evidence. Save the record before ending. No numerical aesthetic grades.'''


def review(root, workers, only=None, retry=False):
    check_seal(root)
    packet_dir = root / 'packet'
    assert hashes(packet_dir) == load(root / 'frozen-outputs.json')
    dest = root / ('reviewers-retry' if retry else 'reviewers')
    dest.mkdir()
    reviewers = []
    for i, block in enumerate(load(root / 'sealed' / 'blocks.json'), start=1):
        available = [x for x in block['ids'] if (packet_dir / 'initial' / x / 'index.html').is_file()]
        if len(available) < 2:
            continue
        for second in (1, 2):
            slot = f'{i}-{second}'
            if only and slot not in only:
                continue
            work = dest / slot
            work.mkdir()
            order = available.copy()
            random.SystemRandom().shuffle(order)
            save(work / 'order.json', order)
            for opaque in order:
                copy_runtime(packet_dir / 'initial' / opaque, work / 'initial' / opaque)
            shutil.copyfile(root / 'sealed' / 'briefs' / f"{block['product']}.md", work / 'brief.md')
            protocol = (root / 'sealed' / 'PROTOCOL.md').read_text(encoding='utf-8')
            task = protocol.split('**Switchboard path.**' if block['product'] == 'radio' else '**Fold Fair path.**')[1].split('\n\n')[0].strip()
            (work / 'tasks.md').write_bytes(task.encode())
            reviewers.append(work)

    def evaluate(work):
        before = hashes(work / 'initial')
        frozen_prompt = (root / 'sealed/review-prompt.txt').read_text(encoding='utf-8')
        status = run_session(work, frozen_prompt, work / 'review', 'review', REVIEW_SECONDS)
        report = work / 'process' / 'review.json'
        status['unchanged'] = before == hashes(work / 'initial')
        status['report'] = sha(report.read_bytes()) if report.is_file() else None
        save(work / 'status.json', status)
        print(work.name, status['unchanged'], bool(status['report']), flush=True)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        list(pool.map(evaluate, reviewers))
    seal = 'frozen-reviews-retry.json' if retry else 'frozen-reviews.json'
    save(root / seal, hashes(dest))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=('prepare', 'generate', 'packet', 'review', 'selected-packet'))
    parser.add_argument('root', type=Path)
    parser.add_argument('--workers', type=int, default=8)
    parser.add_argument('--repeats', type=int, default=2)
    parser.add_argument('--only', action='append')
    parser.add_argument('--attempt', type=int, default=1)
    parser.add_argument('--selection', type=Path, default=HERE / 'selection-experiment.txt')
    parser.add_argument('--destination', type=Path)
    parser.add_argument('--retry-review', action='store_true')
    args = parser.parse_args()
    root = args.root.resolve()
    if args.action == 'prepare':
        prepare(root, args.repeats, args.selection)
    elif args.action == 'generate':
        generation(root, args.workers, args.only, args.attempt)
    elif args.action == 'packet':
        packet(root)
    elif args.action == 'selected-packet':
        if args.destination is None:
            parser.error('selected-packet requires --destination')
        selected_packet(root, args.destination.resolve())
    else:
        review(root, args.workers, args.only, args.retry_review)
