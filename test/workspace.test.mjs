import { expect, test } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const readText = (path) => readFileSync(join(root, path), 'utf8');

test('root pnpm workspace exposes package and example projects', () => {
  expect(existsSync(join(root, 'pnpm-workspace.yaml'))).toBe(true);

  const workspace = readText('pnpm-workspace.yaml');
  expect(workspace).toMatch(/package\/\*/);
  expect(workspace).toMatch(/example/);

  const rootPackage = readJson('package.json');
  expect(rootPackage.packageManager.startsWith('pnpm@')).toBe(true);
  expect(rootPackage.scripts.build).toBe('pnpm -r --filter "./package/*" build');
  expect(rootPackage.scripts.test).toBe('pnpm run test:workspace && pnpm run build && pnpm run test:package-output && pnpm run test:smoke && pnpm run test:example-api');
  expect(rootPackage.scripts['test:workspace']).toBe('NODE_OPTIONS=--experimental-vm-modules jest --runTestsByPath test/workspace.test.mjs --watchman=false');
  expect(rootPackage.scripts['test:package-output']).toBe('NODE_OPTIONS=--experimental-vm-modules jest --runTestsByPath test/package-output.test.mjs --watchman=false');
  expect(rootPackage.scripts['test:example-api']).toBe('pnpm --filter hyar-example test:api');
});

test('hyar-cli depends on hyar-adapter through the workspace protocol', () => {
  const adapterPackage = readJson('package/hyar-adapter/package.json');
  const cliPackage = readJson('package/hyar-cli/package.json');

  expect(adapterPackage.name).toBe('hyar-adapter');
  expect(cliPackage.name).toBe('hyar-cli');
  expect(cliPackage.dependencies['hyar-adapter']).toBe('workspace:*');
});

test('example depends on hyar-cli through the workspace protocol', () => {
  const examplePackage = readJson('example/package.json');

  expect(examplePackage.name).toBe('hyar-example');
  expect(examplePackage.private).toBe(true);
  expect(examplePackage.dependencies['hyar-cli']).toBe('workspace:*');
  expect(examplePackage.scripts.smoke).toBe('node src/index.mjs');
  expect(examplePackage.scripts['test:api']).toBe('node src/test-api.mjs');
});
