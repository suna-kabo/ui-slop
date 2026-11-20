"""Check preservation and unblind ordinal judgments after reviewers finish."""

import argparse
from pathlib import Path
from statistics import median

from trial import check_seal, hashes, load, read_events, save, sha


def rank_positions(ranking, order):
    assert all(isinstance(tier, list) and tier for tier in ranking), ranking
    flattened = [item for tier in ranking for item in tier]
    assert sorted(flattened) == sorted(order), ranking
    return {item: position for position, tier in enumerate(ranking) for item in tier}


def generation_sequence(events):
    items = [e['item'] for e in events if e.get('type') == 'item.completed'
             and e.get('item', {}).get('type') == 'mcp_tool_call' and not e['item'].get('error')
             and not (e['item'].get('result') or {}).get('isError')]

    def writes_initial(item):
        arguments = item.get('arguments') or {}
        return (item.get('tool') == 'copy_tree' and arguments.get('to') == 'initial') or (
            item.get('tool') == 'write_files' and any(row['path'].replace('\\', '/').startswith('initial/')
                                                     for row in arguments.get('files', [])))

    first = next((i for i, item in enumerate(items) if writes_initial(item)), len(items))
    before = []
    for item in items[:first]:
        if item.get('tool') == 'operate':
            args = item['arguments']
            before.append({key: args[key] for key in ('entry', 'width', 'height', 'label')})
    reads = [path for item in items[:first] if item.get('tool') == 'read_files' for path in item['arguments']['paths']]
    return {'browserRunsBeforeInitialWrite': before, 'filesReadBeforeInitialWrite': reads,
            'initialWriteCalls': sum(writes_initial(item) for item in items), 'initialWriteObserved': first < len(items)}


def summarize(root, generation_root):
    check_seal(root)
    assert hashes(root / 'packet') == load(root / 'frozen-outputs.json')
    assert hashes(root / 'reviewers') == load(root / 'frozen-reviews.json')
    retry = root / 'reviewers-retry'
    if retry.is_dir():
        assert hashes(retry) == load(root / 'frozen-reviews-retry.json')
    assignments = {row['id']: row for row in load(root / 'sealed/assignments.json')}
    runs = load(root / 'selected-runs.json')
    metrics = load(root / 'openings/metrics.json')
    results = []
    for opaque, status in sorted(runs.items()):
        if not status:
            continue
        log = generation_root / f"generations-{status['attempt']}" / f'{opaque}.jsonl'
        events = read_events(log)
        assert not any((row.get('item') or {}).get('type') == 'command_execution' for row in events)
        sequence = generation_sequence(events)
        assert sequence['initialWriteObserved'], opaque
        if assignments[opaque]['condition'] in 'BC':
            assert any(path.replace('\\', '/').endswith('ui-slop/references/concept-proof.md')
                       for path in sequence['filesReadBeforeInitialWrite']), opaque
        thread = next(row['thread_id'] for row in events if row['type'] == 'thread.started')
        verify = [r for r in metrics if r['id'] == opaque and r['variant'] == 'default']
        snapshots = hashes(root / 'packet/initial' / opaque)
        results.append({**assignments[opaque], **status, 'thread': thread, 'files': snapshots,
                        'firstViews': verify, 'sequence': sequence})

    pairwise = {scope: {pair: dict(left=0, right=0, tie=0) for pair in ('A:B', 'A:C', 'B:C')}
                for scope in ('ranking', 'visualRanking', 'interactionRanking')}
    reviews = []
    for work in sorted((root / 'reviewers').iterdir()):
        status = load(work / 'status.json')
        replacement = retry / work.name
        if not status['report'] and (replacement / 'status.json').is_file():
            work = replacement
            status = load(work / 'status.json')
        order = load(work / 'order.json')
        assert status['unchanged'], work
        if not status['report']:
            reviews.append({'reviewer': work.name, 'status': status})
            continue
        file = work / 'process/review.json'
        assert sha(file.read_bytes()) == status['report']
        review = load(file)
        assert review['order'] == order, work
        for opaque in order:
            row = review['observations'][opaque]
            assert row['evidenceGate'] in {'PASS', 'FAIL', 'BLOCKED'}
            assert row['qualityGate'] in {'READY', 'NOT_READY', 'BLOCKED'}
        order_key = {assignments[opaque]['condition']: opaque for opaque in order}
        for scope, pairs in pairwise.items():
            positions = rank_positions(review[scope], order)
            for pair, count in pairs.items():
                l, r = pair.split(':')
                if l not in order_key or r not in order_key:
                    continue
                a, b = positions[order_key[l]], positions[order_key[r]]
                count['left' if a < b else 'right' if a > b else 'tie'] += 1
        reviews.append({'reviewer': work.name, 'product': assignments[order[0]]['product'],
                        'repeat': assignments[order[0]]['repeat'], 'conditions': [assignments[x]['condition'] for x in order],
                        'recordRoot': work.relative_to(root).as_posix(), 'status': status, **review})

    elapsed = {condition: median(row['elapsedSeconds'] for row in results if row['condition'] == condition)
               for condition in 'ABC' if any(row['condition'] == condition for row in results)}
    return {'runs': results, 'reviews': reviews, 'pairwise': pairwise, 'medianSuccessfulSeconds': elapsed}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    parser.add_argument('--generation-root', type=Path)
    args = parser.parse_args()
    summary = summarize(args.root.resolve(), (args.generation_root or args.root).resolve())
    save(args.root / 'summary.json', summary)
    print(f"{len(summary['runs'])} concepts, {len(summary['reviews'])} independent records")
