import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const baseline = '3a2e5468a79e5ef5a5bdb3e52445d0fca99cf903';
if (!process.argv[2]) throw new Error('Usage: node prepare-slices.mjs <new-output-directory>');
const output = resolve(process.argv[2]);
await mkdir(output);
const archive = join(output, 'v3.0.1-baseline.zip');
execFileSync('git', ['archive', '--format=zip', '-o', archive, baseline]);

const calibration = `
## Experimental calibration handoff

Choose the one or two quality risks most likely to survive a technically correct build. For each, observe a comparable reference at working scale, and operate it if judging behavior. Record a concrete observed mechanism, its tradeoff and limit, the decision it changes, and the visible or operated result that would reverse that decision. For a major open choice, render two credible treatments on the same representative content in a bounded surface. Use the observed comparison to select the proof. Report unavailable reference behavior explicitly.
`;
const critique = `
## Experimental rendered critique

Before reading records or source, inspect the rendered first useful wide and narrow states with just the task and runnable artifact. Attempt the core action, one second action, and return or reversal. Inspect the weakest detail and reaction from input through next action. Freeze exact findings and user consequences before seeing rationale. If the generator must self-review, use a fresh browser context and delay opening its design notes. For the highest impact finding, render an intact alternative, operate both, then correct and recheck the affected path and its neighbor. For copy candidates remove the layout footprint and inspect the recomposed state.
`;

for (const condition of ['A', 'B', 'C', 'D']) {
  const skill = join(output, 'runs', condition, 'skill');
  await mkdir(skill, { recursive: true });
  execFileSync('unzip', ['-q', archive, '-d', skill]);
  for (const [enabled, file, intervention] of [
    ['BD', 'reference-calibration.md', calibration],
    ['CD', 'review-protocol.md', critique],
  ]) {
    if (!enabled.includes(condition)) continue;
    const ref = join(skill, 'references', file);
    await writeFile(ref, await readFile(ref, 'utf8') + intervention);
  }
}
