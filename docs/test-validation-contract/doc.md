---
name: test-validation-contract
description: 说明当前测试分层、package 代码质量门禁和已知环境边界。
keywords: 测试门禁, package 代码质量, pnpm test, ESLint, Prettier, ts-jest
doc_type: contract
source_path: package.json, test/AGENTS.md, test, example, jest.config.mjs, eslint.config.mjs, .prettierrc.json
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
check:package-code -> test:workspace -> build -> test:package-output -> test:smoke -> test:example-api
```

各阶段职责：

1. `check:package-code` 对 `package/*/src/**/*.ts` 执行 ESLint 与 Prettier 检查。
2. `test:workspace` 校验 pnpm workspace、根脚本、package 依赖链和 example workspace 依赖。
3. `build` 使用 Rollup 构建 `package/*`。
4. `test:package-output` 校验每个 package 输出 ESM、CJS 和 declaration。
5. `test:smoke` 运行 example 基础消费链路。
6. `test:example-api` 校验 example 对 CLI API 的结构化调用结果。

文档和 Skill 变更不一定需要触发完整 package 构建，但必须运行对应治理 Skill 的 validator，并至少执行 `git diff --check`。如果变更触及 package 源码，应先跑 `pnpm run check:package-code`；如果变更触及 workspace、包导出、测试脚本或 example 消费链路，应跑完整 `pnpm test`。

当前环境中 `pnpm test` 可能在 Jest 配置阶段报 `Module ts-jest in the transform option was not found`。遇到该错误时，应先核查 pnpm 安装状态、Jest 解析方式和本地 `node_modules/.bin`，不要把它误判为业务测试失败。

## Update When
- 根 `test` 脚本、package 代码质量脚本或任一分阶段测试脚本变化。
- Jest、Rollup、TypeScript 或 pnpm workspace 配置变化。
- example 验收职责或 package 输出要求变化。
