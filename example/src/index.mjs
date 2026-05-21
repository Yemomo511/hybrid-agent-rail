import assert from 'node:assert/strict';
import { describeCliRuntime } from 'hyar-cli';

const runtime = describeCliRuntime();

assert.equal(runtime.name, 'hyar-cli');
assert.equal(runtime.adapter.name, 'hyar-adapter');
assert.equal(runtime.adapter.protocol, 'workspace');

console.log(JSON.stringify(runtime, null, 2));
