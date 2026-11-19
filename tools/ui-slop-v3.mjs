#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  inspectProject,
  validateScenario,
  evaluateEvidence,
  summarizeFindings,
  runEvidence as runEvidenceEngine,
  validateBundle
} from './ui-slop.mjs';

const TOOL_VERSION = '3.0.0-rc.1';

const HELP = 'UI Slop v3 evidence tooling\n\nUsage:\n' +
  '  ui-slop inspect [project-root] [--out <context.json>]\n' +
  '  ui-slop capture <url> --scenario <scenario.json> --out <run-dir> [--brief <brief.txt>] [--headed]\n' +
  '  ui-slop capture --html <fixture.html> --scenario <scenario.json> --out <run-dir> [--brief <brief.txt>]\n' +
  '  ui-slop validate <run-dir>\n\n' +
  'The tooling collects executed evidence. Problem, solution, implementation, and quality readiness remain reviewer judgments.\n';

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      out._.push(arg);
      continue;
    }
    const eq = arg.indexOf('=');
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      out[key] = next;
      i += 1;
    } else {
      out[key] = true;
    }
  }
  return out;
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function runEvidence(options) {
  return runEvidenceEngine({
    ...options,
    toolVersion: options?.toolVersion ?? TOOL_VERSION
  });
}

async function runCli(argv) {
  const [verb, ...rest] = argv;

  if (!verb || ['help', '--help', '-h'].includes(verb)) {
    console.log(HELP);
    return 0;
  }

  if (verb === '--version' || verb === 'version') {
    console.log(TOOL_VERSION);
    return 0;
  }

  const args = parseArgs(rest);

  try {
    if (verb === 'inspect') {
      const root = args._[0] ?? process.cwd();
      const report = await inspectProject(root);
      if (args.out) await writeJson(path.resolve(args.out), report);
      console.log(JSON.stringify(report, null, 2));
      return 0;
    }

    if (verb === 'capture' || verb === 'evidence') {
      const url = args._[0] ?? null;
      const htmlPath = args.html ? path.resolve(args.html) : null;

      if ((!url && !htmlPath) || !args.scenario || !args.out) {
        throw new Error('capture requires URL or --html, plus --scenario and --out.');
      }

      const scenario = JSON.parse(await fs.readFile(path.resolve(args.scenario), 'utf8'));
      validateScenario(scenario);

      let briefText = null;
      let briefSource = null;
      if (args.brief) {
        briefSource = path.resolve(args.brief);
        briefText = await fs.readFile(briefSource, 'utf8');
      }

      const result = await runEvidence({
        url: url ?? 'about:blank',
        htmlPath,
        scenario,
        outDir: path.resolve(args.out),
        headed: args.headed === true,
        briefText,
        briefSource
      });

      const summary = summarizeFindings(result.findings);
      console.log(JSON.stringify({
        run: path.resolve(args.out),
        status: summary.blocked ? 'blocked' : summary.hard_failure ? 'failed' : 'completed',
        summary,
        findings: result.findings.length
      }, null, 2));

      if (summary.blocked) return 3;
      return summary.hard_failure ? 2 : 0;
    }

    if (verb === 'validate') {
      const dir = args._[0];
      if (!dir) throw new Error('validate requires a run directory.');
      const result = await validateBundle(path.resolve(dir));
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }

    console.error(`Unknown command: ${verb}\n\n${HELP}`);
    return 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

export {
  TOOL_VERSION,
  inspectProject,
  validateScenario,
  evaluateEvidence,
  summarizeFindings,
  runEvidence,
  validateBundle,
  runCli
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await runCli(process.argv.slice(2));
}
