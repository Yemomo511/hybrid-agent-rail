import assert from 'node:assert/strict';
import { runCliPackageTestApi } from 'hyar-cli';

const result = runCliPackageTestApi();

assert.deepEqual(result, {
  packageName: 'hyar-cli',
  format: 'rollup',
  dependency: {
    packageName: 'hyar-adapter',
    format: 'rollup',
    ok: true
  },
  ok: true
});

console.log(JSON.stringify(result, null, 2));
