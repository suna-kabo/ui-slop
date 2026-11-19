import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: node blind-packet.mjs <artifact-list.json> <new-output-directory>');
const list = JSON.parse(await readFile(input, 'utf8'));
await mkdir(output);
await mkdir(join(output, 'public'));
const key = {};
for (const { label, task, directory } of list) {
  const source = resolve(directory);
  const files = {};
  for (const name of (await readdir(source, { recursive: true })).sort()) {
    const file = join(source, name);
    const stat = await lstat(file);
    if (stat.isDirectory()) continue;
    if (!stat.isFile()) throw new Error('Non-regular file in ' + label + ': ' + name);
    files[name.replaceAll('\\', '/')] = createHash('sha256').update(await readFile(file)).digest('hex');
  }
  const entry = await readFile(join(source, 'index.html'));
  const id = createHash('sha256').update('ui-slop-rendered-quality-v3').update(label).update(entry).digest('hex').slice(0, 12);
  if (Object.hasOwn(key, id)) throw new Error('Duplicate artifact ' + label);
  await cp(source, join(output, 'public', id), { recursive: true });
  key[id] = { label, task, files };
}
const queue = Object.entries(key).map(([id, { task }]) => ({ id, task, entry: id + '/index.html' }));
queue.sort((a, b) => a.id.localeCompare(b.id));
await writeFile(join(output, 'public', 'queue.json'), JSON.stringify(queue, null, 2) + '\n');
await writeFile(join(output, 'key.json'), JSON.stringify(key, null, 2) + '\n');
