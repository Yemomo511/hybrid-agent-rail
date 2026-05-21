import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const validatorPath = '.codex/skills/create-curated-skill/validate.mjs';

const writeSkill = (content) => {
  const root = join(process.cwd(), 'skills', `__metadata-test-${Date.now()}-${Math.random()}`);
  const skillDir = join(root, 'flutter-add-widget-test');
  const relativePath = join('skills', root.split('skills/')[1], 'flutter-add-widget-test', 'SKILL.md');
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), content);
  return {
    absolutePath: join(skillDir, 'SKILL.md'),
    relativePath,
    root,
  };
};

const validBody = `## flutter-add-widget-test
> Curated from flutter's skills

Implement a component-level test using \`WidgetTester\` to verify UI rendering and user interactions.

## Source
- Upstream: https://github.com/flutter/skills/tree/main/skills/flutter-add-widget-test

## How to use
该 Skill 由 hyar 跨端框架精选, 用于 Flutter 组件级 Widget 测试需求前被 Agent 发现。若要运行包含原始资源、脚本和参考资料的完整上游工作流，请将上游 bundle 安装到当前活跃 Agent 的 skills 目录中：
\`\`\` bash
# 查看上游 README，确认准确路径
open https://github.com/flutter/skills/tree/main/skills/flutter-add-widget-test
\`\`\`
然后，让 Agent 通过该 skill 的名称（flutter-add-widget-test）来调用它，或使用该 skill frontmatter 中列出的任一触发短语来调用它。
`;

test('accepts optional version and env under metadata', () => {
  const skill = writeSkill(`--- 
name: flutter-add-widget-test
description: Implement a component-level test using \`WidgetTester\` to verify UI rendering and user interactions.
metadata:
  version: Flutter >= 3.0.0
  env: Expo configured
---

${validBody}`);

  try {
    const output = execFileSync('node', [validatorPath, skill.relativePath], {
      encoding: 'utf8',
    });

    assert.match(output, /Curated Skill is valid/);
  } finally {
    rmSync(skill.root, { recursive: true, force: true });
  }
});

test('rejects legacy top-level version and env fields', () => {
  const skill = writeSkill(`--- 
name: flutter-add-widget-test
description: Implement a component-level test using \`WidgetTester\` to verify UI rendering and user interactions.
version: Flutter >= 3.0.0
env: Expo configured
---

${validBody}`);

  try {
    assert.throws(
      () => execFileSync('node', [validatorPath, skill.relativePath], { encoding: 'utf8', stdio: 'pipe' }),
      (error) => {
        const stderr = error.stderr.toString();
        assert.match(stderr, /Unknown frontmatter field: version/);
        assert.match(stderr, /Unknown frontmatter field: env/);
        return true;
      }
    );
  } finally {
    rmSync(skill.root, { recursive: true, force: true });
  }
});
