import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { join } from 'node:path';

const root = process.cwd();
const packageRoot = join(root, 'package');

const packageNames = readdirSync(packageRoot, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name);

test('all package projects emit rollup esm cjs and declaration outputs', () => {
  assert.deepEqual(packageNames.toSorted(), ['hyar-adapter', 'hyar-cli']);

  for (const packageName of packageNames) {
    const distDir = join(packageRoot, packageName, 'dist');

    assert.equal(existsSync(join(distDir, 'index.mjs')), true, `${packageName} should emit ESM output`);
    assert.equal(existsSync(join(distDir, 'index.cjs')), true, `${packageName} should emit CJS output`);
    assert.equal(existsSync(join(distDir, 'index.d.ts')), true, `${packageName} should emit type declarations`);
  }
});
