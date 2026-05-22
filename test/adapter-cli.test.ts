import { expect, test } from '@jest/globals';
import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { HyarAdapterService } from '../package/hyar-adapter/src/index';
import { runInitCommand } from '../package/hyar-cli/src/index';

const makeTempDir = async (): Promise<string> => {
  return mkdtemp(join(tmpdir(), 'hyar-adapter-cli-'));
};

const writeSkill = async (root: string, skillPath: string, body: string): Promise<void> => {
  const skillDir = join(root, skillPath);
  await mkdir(skillDir, { recursive: true });
  await writeFile(join(skillDir, 'SKILL.md'), body, 'utf8');
};

const readText = async (path: string): Promise<string> => {
  return readFile(path, 'utf8');
};

test('scanner filters selected framework skills and reports all validation errors', async () => {
  const resourceRoot = await makeTempDir();
  await writeSkill(
    resourceRoot,
    'react-native/rn-create-app',
    `---
name: rn-create-app
description: Create RN app.
metadata:
  version: React Native 0.85
---

## Body
`
  );
  await writeSkill(
    resourceRoot,
    'flutter/flutter-add-widget-test',
    `---
name: wrong-name
description: Add widget test.
---

## Body
`
  );
  await writeSkill(
    resourceRoot,
    'share/broken-skill',
    `---
name: broken-skill
---

## Body
`
  );

  const service = new HyarAdapterService({ resourceRoot });
  const result = await service.scanSkills({ frameworks: ['react-native'] });

  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error('expected scan to fail');
  }
  expect(result.errors.map((item) => item.code).sort()).toEqual(['missing-description']);
  expect(result.errors[0]?.file).toContain('share/broken-skill/SKILL.md');
});

test('scanner fails duplicate selected skill names before writing', async () => {
  const resourceRoot = await makeTempDir();
  await writeSkill(
    resourceRoot,
    'react-native/rn-create-app',
    `---
name: rn-create-app
description: Create RN app.
---

## Body
`
  );
  await writeSkill(
    resourceRoot,
    'share/rn-create-app',
    `---
name: rn-create-app
description: Duplicate RN app skill.
---

## Body
`
  );

  const service = new HyarAdapterService({ resourceRoot });
  const result = await service.scanSkills({ frameworks: ['react-native'] });

  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error('expected scan to fail');
  }
  expect(result.errors).toEqual([
    expect.objectContaining({
      code: 'duplicate-skill-name',
      name: 'rn-create-app'
    })
  ]);
});

test('coordinator emits shared skill markdown with normalized requirements', async () => {
  const resourceRoot = await makeTempDir();
  await writeSkill(
    resourceRoot,
    'react-native/rn-create-app',
    `---
name: rn-create-app
description: Create RN app.
allowed-tools: Bash
metadata:
  version: React Native 0.85
  env: Android, iOS
---

## Pre Requirement(必读)
当要求不符合时，禁止使用该 Skill。
- 版本要求: React Native 0.74

## Body
`
  );

  const service = new HyarAdapterService({ resourceRoot });
  const result = await service.scanSkills({ frameworks: ['react-native'] });
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(result.errors.map((item) => item.message).join('\n'));
  }

  const [skill] = service.coordinateSkills(result.skills);

  expect(skill?.content).toContain('Create RN app. 版本要求: React Native 0.85。环境要求: Android, iOS。');
  expect(skill?.content).not.toContain('allowed-tools');
  expect(skill?.content.match(/版本要求:/g)).toHaveLength(2);
  expect(skill?.content).toContain('- 版本要求: React Native 0.85');
  expect(skill?.content).toContain('- 环境要求: Android, iOS');
});

test('adapter writes project skills transactionally and marks shared targets', async () => {
  const resourceRoot = await makeTempDir();
  const cwd = await makeTempDir();
  await writeSkill(
    resourceRoot,
    'react-native/rn-create-app',
    `---
name: rn-create-app
description: Create RN app.
---

## Body
`
  );
  await mkdir(join(resourceRoot, 'react-native/rn-create-app/references'), { recursive: true });
  await writeFile(join(resourceRoot, 'react-native/rn-create-app/references/ref.md'), '# ref\n', 'utf8');
  await writeFile(join(resourceRoot, 'react-native/rn-create-app/README.md'), '# ignored\n', 'utf8');
  await mkdir(join(cwd, '.codex/skills/rn-create-app'), { recursive: true });
  await writeFile(join(cwd, '.codex/skills/rn-create-app/old.txt'), 'old', 'utf8');

  const service = new HyarAdapterService({ resourceRoot });
  const result = await service.injectProjectSkills({
    agents: ['codex', 'antigravity', 'claude', 'cursor', 'trae'],
    cwd,
    frameworks: ['react-native']
  });

  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  expect(result.plan.overwrites).toEqual([join(cwd, '.codex/skills/rn-create-app')]);
  expect(result.plan.targets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        agents: ['codex'],
        relativeRoot: '.codex/skills',
        shared: false
      })
    ])
  );
  await expect(stat(join(cwd, '.codex/skills/rn-create-app/old.txt'))).rejects.toThrow();
  expect(await readText(join(cwd, '.codex/skills/rn-create-app/SKILL.md'))).toContain('name: rn-create-app');
  expect(await readText(join(cwd, '.codex/skills/rn-create-app/references/ref.md'))).toBe('# ref\n');
  await expect(stat(join(cwd, '.codex/skills/rn-create-app/README.md'))).rejects.toThrow();
  expect(await readText(join(cwd, '.gitignore'))).toContain('.hyar/tmp/');
  expect(await readText(join(cwd, '.gitignore'))).toContain('.hyar/rollback/');
});

test('cli non-interactive init writes selected project skills and rejects bad cwd', async () => {
  const resourceRoot = await makeTempDir();
  const cwd = await makeTempDir();
  await writeSkill(
    resourceRoot,
    'react-native/rn-create-app',
    `---
name: rn-create-app
description: Create RN app.
---

## Body
`
  );

  const success = await runInitCommand({
    agents: 'codex,claude',
    cwd,
    frameworks: 'react-native',
    interactive: false,
    resourceRoot
  });

  expect(success.ok).toBe(true);
  expect(await readText(join(cwd, '.codex/skills/rn-create-app/SKILL.md'))).toContain('Create RN app.');
  expect(await readText(join(cwd, '.claude/skills/rn-create-app/SKILL.md'))).toContain('Create RN app.');

  const failure = await runInitCommand({
    agents: 'codex',
    cwd: join(cwd, 'missing'),
    frameworks: 'react-native',
    interactive: false,
    resourceRoot
  });

  expect(failure.ok).toBe(false);
  if (failure.ok) {
    throw new Error('expected bad cwd to fail');
  }
  expect(failure.error.message).toContain('--cwd');
});
