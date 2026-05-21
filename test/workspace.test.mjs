import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { join } from 'node:path';

const root = process.cwd();

const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const readText = (path) => readFileSync(join(root, path), 'utf8');

test('root pnpm workspace exposes package and example projects', () => {
  assert.equal(existsSync(join(root, 'pnpm-workspace.yaml')), true);

  const workspace = readText('pnpm-workspace.yaml');
  assert.match(workspace, /package\/\*/);
  assert.match(workspace, /example/);

  const rootPackage = readJson('package.json');
  assert.equal(rootPackage.packageManager.startsWith('pnpm@'), true);
  assert.equal(rootPackage.scripts.build, 'pnpm -r --filter "./package/*" build');
  assert.equal(rootPackage.scripts.test, 'pnpm run test:workspace && pnpm run build && pnpm run test:smoke');
});

test('hyar-cli depends on hyar-adapter through the workspace protocol', () => {
  const adapterPackage = readJson('package/hyar-adapter/package.json');
  const cliPackage = readJson('package/hyar-cli/package.json');

  assert.equal(adapterPackage.name, 'hyar-adapter');
  assert.equal(cliPackage.name, 'hyar-cli');
  assert.equal(cliPackage.dependencies['hyar-adapter'], 'workspace:*');
});

test('example depends on hyar-cli through the workspace protocol', () => {
  const examplePackage = readJson('example/package.json');

  assert.equal(examplePackage.name, 'hyar-example');
  assert.equal(examplePackage.private, true);
  assert.equal(examplePackage.dependencies['hyar-cli'], 'workspace:*');
  assert.equal(examplePackage.scripts.smoke, 'node src/index.mjs');
});
