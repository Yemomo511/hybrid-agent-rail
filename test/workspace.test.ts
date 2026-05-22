import { expect, test } from '@jest/globals';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const packageRoot = join(root, 'package');

type PackageJson = {
  name: string;
  private?: boolean;
  packageManager?: string;
  scripts: Record<string, string>;
  dependencies?: Record<string, string>;
};

const readPackageJson = (path: string): PackageJson => JSON.parse(readFileSync(join(root, path), 'utf8')) as PackageJson;
const readText = (path: string): string => readFileSync(join(root, path), 'utf8');
const packageNames = (): string[] =>
  readdirSync(packageRoot, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

test('root pnpm workspace exposes package and example projects', () => {
  expect(existsSync(join(root, 'pnpm-workspace.yaml'))).toBe(true);

  const workspace = readText('pnpm-workspace.yaml');
  expect(workspace).toMatch(/package\/\*/);
  expect(workspace).toMatch(/example/);

  const rootPackage = readPackageJson('package.json');
  expect(rootPackage.packageManager?.startsWith('pnpm@')).toBe(true);
  expect(rootPackage.scripts.build).toBe('pnpm -r --filter "./package/*" build');
  expect(rootPackage.scripts.test).toBe(
    'pnpm run check:package-code && pnpm run test:workspace && pnpm run test:adapter-cli && pnpm run build && pnpm run test:package-output && pnpm run test:smoke && pnpm run test:example-api && pnpm run test:example-hyar-init'
  );
  expect(rootPackage.scripts['test:workspace']).toBe('NODE_OPTIONS=--experimental-vm-modules jest --runTestsByPath test/workspace.test.ts --watchman=false');
  expect(rootPackage.scripts['test:adapter-cli']).toBe(
    'NODE_OPTIONS=--experimental-vm-modules jest --runTestsByPath test/adapter-cli.test.ts --watchman=false'
  );
  expect(rootPackage.scripts['test:example-hyar-init']).toBe(
    'NODE_OPTIONS=--experimental-vm-modules jest --runTestsByPath test/example-hyar-init.test.ts --watchman=false'
  );
  expect(rootPackage.scripts['test:package-output']).toBe('NODE_OPTIONS=--experimental-vm-modules jest --runTestsByPath test/package-output.test.ts --watchman=false');
  expect(rootPackage.scripts['test:example-api']).toBe('pnpm --filter hyar-example test:api');
});

test('hyar-cli depends on hyar-adapter through the workspace protocol', () => {
  const adapterPackage = readPackageJson('package/hyar-adapter/package.json');
  const cliPackage = readPackageJson('package/hyar-cli/package.json');

  expect(adapterPackage.name).toBe('hyar-adapter');
  expect(cliPackage.name).toBe('hyar-cli');
  expect(cliPackage.dependencies?.['hyar-adapter']).toBe('workspace:*');
});

test('package projects own their rollup config locally', () => {
  expect(existsSync(join(root, 'config/rollup.package.config.mjs'))).toBe(false);

  for (const packageName of packageNames()) {
    const packageJson = readPackageJson(`package/${packageName}/package.json`);

    expect(existsSync(join(packageRoot, packageName, 'rollup.config.mjs'))).toBe(true);
    expect(existsSync(join(packageRoot, packageName, 'tsconfig.build.json'))).toBe(true);
    expect(packageJson.scripts.build).toBe('tsc -p tsconfig.build.json && rollup -c');
  }
});

test('example depends on hyar-cli through the workspace protocol', () => {
  const examplePackage = readPackageJson('example/package.json');

  expect(examplePackage.name).toBe('hyar-example');
  expect(examplePackage.private).toBe(true);
  expect(examplePackage.dependencies?.['hyar-cli']).toBe('workspace:*');
  expect(examplePackage.scripts['init:skills']).toBe('hyar init --agents codex --frameworks react-native');
  expect(examplePackage.scripts.smoke).toBe('node src/index.mjs');
  expect(examplePackage.scripts['test:api']).toBe('node src/test-api.mjs');
});
