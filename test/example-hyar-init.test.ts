import { expect, test } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const exampleRoot = join(root, 'example');

test('example can run npx hyar init and receive project skills', async () => {
  await rm(join(exampleRoot, '.agents'), {
    force: true,
    recursive: true
  });
  await rm(join(exampleRoot, '.hyar'), {
    force: true,
    recursive: true
  });

  await execFileAsync('npx', ['hyar', 'init', '--agents', 'codex', '--frameworks', 'react-native'], {
    cwd: exampleRoot
  });

  const skillPaths = [
    join(exampleRoot, '.agents/skills/hyar-framework-check/SKILL.md'),
    join(exampleRoot, '.agents/skills/rn-create-app/SKILL.md'),
    join(exampleRoot, '.agents/skills/rn-newarch-modules-create/SKILL.md')
  ];

  for (const skillPath of skillPaths) {
    expect(existsSync(skillPath)).toBe(true);
  }
  expect(readFileSync(skillPaths[1], 'utf8')).toContain('name: rn-create-app');
});
