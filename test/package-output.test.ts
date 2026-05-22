import { expect, test } from '@jest/globals';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const packageRoot = join(root, 'package');

const packageNames = readdirSync(packageRoot, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name);

test('all package projects emit rollup esm cjs and declaration outputs', () => {
  expect([...packageNames].sort()).toEqual(['hyar-adapter', 'hyar-cli']);

  for (const packageName of packageNames) {
    const distDir = join(packageRoot, packageName, 'dist');

    expect(existsSync(join(distDir, 'index.mjs'))).toBe(true);
    expect(existsSync(join(distDir, 'index.cjs'))).toBe(true);
    expect(existsSync(join(distDir, 'index.d.ts'))).toBe(true);
  }

  expect(existsSync(join(packageRoot, 'hyar-cli/dist/bin.mjs'))).toBe(true);
  expect(existsSync(join(packageRoot, 'hyar-adapter/dist/skills/react-native/rn-create-app/SKILL.md'))).toBe(true);
});
