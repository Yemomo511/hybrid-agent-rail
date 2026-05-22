#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
const cliEntry = resolve(packageDir, 'dist/bin.mjs');
const adapterEntry = resolve(packageDir, 'node_modules/hyar-adapter/dist/index.mjs');
const workspaceRoot = resolve(packageDir, '../..');

if ((!existsSync(cliEntry) || !existsSync(adapterEntry)) && existsSync(resolve(workspaceRoot, 'pnpm-workspace.yaml'))) {
  const pnpmCandidates = ['pnpm', '/opt/homebrew/bin/pnpm'];
  let result;

  for (const pnpmCommand of pnpmCandidates) {
    result = spawnSync(pnpmCommand, ['run', 'build'], {
      cwd: workspaceRoot,
      stdio: 'inherit'
    });

    if (!result.error) {
      break;
    }
  }

  if (result.status !== 0) {
    if (result.error) {
      console.error(`Failed to run pnpm build for hyar-cli: ${result.error.message}`);
    }
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(cliEntry)) {
  console.error('hyar cli entry was not found. Run `pnpm --filter hyar-cli build` first.');
  process.exit(1);
}

await import(pathToFileURL(cliEntry).href);

