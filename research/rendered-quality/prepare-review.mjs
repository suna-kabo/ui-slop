import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const output = process.argv[2];
if (!output) throw new Error('Usage: node prepare-review.mjs <output-directory>');
const template = await readFile(new URL('./review-fixture.html', import.meta.url), 'utf8');
const cases = {
  conventional: {},
  redundant: { css: '.extra{display:block}.redundant{margin:12px 0;padding:14px;background:#eff2eb;border-radius:8px}' },
  hierarchy: { css: 'h1{font:clamp(2.8rem,6.2vw,5.5rem)/1 Georgia,serif}.heading{margin-bottom:46px}.schedule h2{font:2.3rem/1 Georgia,serif;margin-bottom:14px}.capacity,.state{font-size:.68rem;text-transform:uppercase;letter-spacing:.09em}.state{background:#dce8dd;border:1px solid #9dac9d;border-radius:50px;padding:2px 7px}' },
  recovery: { behavior: { noCancel: true } },
  continuity: { behavior: { loseFocus: true } },
  response: { behavior: { delayed: true }, css: 'button:active{background:white}.primary:active{background:#283d35}' },
  detail: { css: '.detail{background:#fff8ee;border:0;border-radius:0;padding:4px}.detail h2{font:2.4rem/1 Georgia,serif}.detail #detail-state,.detail #pieces{font-size:.65rem}.detail .actions{flex-direction:column;align-items:stretch}.detail #close{font-size:.65rem}' },
  unusual: { css: 'header{background:#592648}main{background:repeating-linear-gradient(130deg,#f9efe6,#f9efe6 18px,#f5e6ec 18px,#f5e6ec 36px)}.workspace{grid-template-columns:minmax(0,3fr) minmax(0,2fr)}.schedule h2{text-align:center}.load{grid-template-columns:1fr .55fr;column-gap:8px;border:2px dashed #733361}.load strong{grid-row:span 2}.detail{border:3px double #733361}@media(max-width:690px){.workspace{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.load{grid-template-columns:1fr}.load strong{grid-row:auto}}' },
};

await mkdir(join(output, 'public'), { recursive: true });
const key = {};
// Keep the original blind packet frozen. The optional rerun isolates a follow-up fix.
if (process.argv[3] === '--preserve-pending-focus') {
  cases.conventional.behavior = { preservePendingFocus: true };
}
for (const [name, { css = '', behavior = {} }] of Object.entries(cases)) {
  const id = createHash('sha256').update('wick-review-2026:' + name).digest('hex').slice(0, 10);
  key[id] = name;
  const file = template.replace('/* CONFIG */ {}', JSON.stringify(behavior)).replace('<style id="treatment"></style>', () => '<style>' + css + '</style>');
  await writeFile(join(output, 'public', id + '.html'), file);
}
await writeFile(join(output, 'key.json'), JSON.stringify(key, null, 2) + '\n');
await writeFile(join(output, 'public', 'cases.json'), JSON.stringify(Object.keys(key).sort(), null, 2) + '\n');
