---
name: skill-test
description: 评测 Skill 的仓库维护型 Skill。用于隔离待测 Skill、运行 coco 测试 Agent、生成结构化证据报告，并给出克制的修改建议；不会直接修改待测 Skill。
---

## Skill Test

## Overview

Skill Test 用于验证一个 Skill 在真实 Agent 使用场景中的表现。它把待测 Skill 复制到隔离路径，通过 `coco` 执行多类用户需求提示词，并生成可追溯的 Markdown 测试报告。

## When To Invoke

- 用户要求测试、评测、验收或回归验证某个 Skill。
- 创建或修改 Skill 后，需要确认 Agent 是否会被 Skill 正确引导。
- 需要输出 `.test/test-report/<skill-name>/<timestamp>/report.md` 证据报告和最小化修改建议。

## Isolation Rule

测试 Agent 只能读取：

1. runner 复制出的隔离版待测 `SKILL.md`。
2. 执行测试所需的目标项目上下文。

禁止把 PRD、讨论记录、设计说明、上一轮测试报告、作者意图或本 Skill 的评价标准暴露给测试 Agent。提示词必须使用固定格式：

```text
读取`{skill-name}`,其位于 {testpath/{skill-name}/SKILL.md},完成以下需求: {test prompt}
```

## Workflow

1. 确认待测 Skill 路径和测试执行 cwd。
2. 运行 runner：

```bash
python3 .codex/skills/skill-test/scripts/run_skill_test.py --skill <skill-dir-or-SKILL.md> --cwd <target-project-cwd>
```

3. 如需覆盖默认提示词，传入一个或多个 `--prompt "<type>::<content>"`。
4. 读取 runner 输出的 `report.md`，重点评审 coco 的思考和输出过程，而不是只看最终是否完成需求。
5. 在报告中补全问题、优先级、证据、评分、是否通过和最小化修改建议。

## Test Prompt Coverage

默认生成 5 个 test prompts：

1. 2 个问题解答。
2. 1 个简单操作执行。
3. 2 个复杂操作执行。

待测 Skill 较小时可以只使用 3-4 个 prompts，但必须至少覆盖 1 个问题解答、1 个简单操作执行和 1 个复杂操作执行。只有这些提示词全部通过，才认为 Skill 能在各类场景上正常工作。

## Observation Priority

不要因为测试 Agent 完成了用户需求就直接判定 Skill 没问题。按以下优先级观察：

1. P0：产生错误或疑问，且严重影响测试 Agent 判断流程，直接不通过。
2. P1：产生错误或疑问，但测试 Agent 尝试自我修复或自行回答，每个扣 15 分。
3. P2：思考中出现不符合预期的描述，暂未造成错误但可能影响后续决策，每个扣 5 分。

重点关注项目本身无法提供、测试 Agent 靠猜测得出的答案，且该猜测会影响决策的情况。

## Report Contract

报告必须写入：

```text
.test/test-report/<skill-name>/<timestamp>/report.md
```

报告至少包含待测 Skill 名称和路径、测试运行时间、执行 cwd、coco 执行协议、退出状态、test prompt 列表、每轮 coco 反馈摘要、问题优先级和证据、是否通过、最终评分、评分依据和最小化修改建议。

## Scoring

总分 100 分。P0 直接判定不通过；每个 P1 扣 15 分；每个 P2 扣 5 分。最终分数大于等于 90 分且不存在 P0 时，Skill Test 判定为通过，否则不通过。

## Modification Advice

Skill Test 只评测，不直接修改待测 Skill。修改建议应保持克制、简洁，只指出让一个已经很强但粗心的技术 Agent 不再忽略关键点所需的最小改动。
