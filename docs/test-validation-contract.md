---
name: test-validation-contract
description: 说明当前测试分层、验收入口和已知环境门禁边界。
keywords: 测试门禁, pnpm test, Jest, ts-jest, package-output, example smoke
doc_type: contract
source_path: package.json, test/AGENTS.md, test, example, jest.config.mjs
---
# Test Validation Contract

## Purpose
说明当前测试链路验证什么，以及改动后应该选择哪些门禁，避免只跑局部命令就误判完成。

## Applies To
- 当修改 workspace 配置、package 构建、CLI/adapter 依赖链或 example 消费链路时。
- 当修改 Jest、Rollup、TypeScript 或根测试脚本时。
- 当文档或 Skill 变更需要最小可验证闭环时。

## Content
当前根测试链路为：

```text
test:workspace -> build -> test:package-output -> test:smoke -> test:example-api
```

各阶段职责：

1. `test:workspace` 校验 pnpm workspace、根脚本、package 依赖链和 example workspace 依赖。
2. `build` 使用 Rollup 构建 `package/*`。
3. `test:package-output` 校验每个 package 输出 ESM、CJS 和 declaration。
4. `test:smoke` 运行 example 基础消费链路。
5. `test:example-api` 校验 example 对 CLI API 的结构化调用结果。

文档和 Skill 变更不一定需要触发完整 package 构建，但必须运行对应治理 Skill 的 validator，并至少执行 `git diff --check`。如果变更触及 workspace、包导出、测试脚本或 example 消费链路，应跑完整 `pnpm test`。

当前环境中 `pnpm test` 可能在 Jest 配置阶段报 `Module ts-jest in the transform option was not found`。遇到该错误时，应先核查 pnpm 安装状态、Jest 解析方式和本地 `node_modules/.bin`，不要把它误判为业务测试失败。

## Update When
- 根 `test` 脚本或任一分阶段测试脚本变化。
- Jest、Rollup、TypeScript 或 pnpm workspace 配置变化。
- example 验收职责或 package 输出要求变化。
