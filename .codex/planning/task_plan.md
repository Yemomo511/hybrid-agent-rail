# pnpm 项目初始化任务计划

## 总目标

使用 pnpm 初始化 Hybrid Agent Rail monorepo，并建立 `example -> hyar-cli -> hyar-adapter` 的本地 workspace 依赖链。

## 子任务与验收标准

### 子任务 1：建立 workspace 结构验收

- 产物：`test/workspace.test.ts`
- 验收标准：
  - 测试能检查根目录 `pnpm-workspace.yaml`
  - 测试能检查根包脚本、package 目录、example 目录
  - 测试能检查 `example` 依赖 `hyar-cli`
  - 测试能检查 `hyar-cli` 依赖 `hyar-adapter`

### 子任务 2：初始化 pnpm workspace 与包元数据

- 产物：`package.json`、`pnpm-workspace.yaml`、`tsconfig.base.json`
- 验收标准：
  - workspace 包含 `package/*` 与 `example`
  - 根脚本提供 `build`、`test`、`test:workspace`、`test:smoke`
  - 根开发依赖包含 TypeScript 与 Rollup 构建链

### 子任务 3：实现 hyar-adapter 与 hyar-cli 最小包

- 产物：`package/hyar-adapter/*`、`package/hyar-cli/*`
- 验收标准：
  - `hyar-adapter` 可构建 CJS 与 ESM 产物
  - `hyar-cli` 通过 `workspace:*` 依赖 `hyar-adapter`
  - `hyar-cli` 导出的运行时描述能包含 adapter 信息

### 子任务 4：实现 example 消费链路

- 产物：`example/package.json`、`example/src/index.mjs`
- 验收标准：
  - `example` 通过 `workspace:*` 依赖 `hyar-cli`
  - 构建后 `pnpm --filter hyar-example smoke` 能从 `hyar-cli` 读到 `hyar-adapter`

### 子任务 5：安装依赖、验证并提交

- 验收标准：
  - `pnpm install` 成功生成 lockfile
  - `pnpm test` 成功
  - `git diff --check` 成功
  - 使用中文规范提交，提交信息以 `[AI]` 开头

### 子任务 6：补齐 package 测试 API 与 example 安装验收

- 产物：`example/src/test-api.mjs`、`package/*/src/index.ts`
- 验收标准：
  - 每个 package 均通过 Rollup 输出 `dist/index.mjs`、`dist/index.cjs`、`dist/index.d.ts`
  - `hyar-adapter` 暴露 `runAdapterPackageTestApi`
  - `hyar-cli` 暴露 `runCliPackageTestApi`，并在内部调用 `hyar-adapter`
  - `example` 通过已安装的 `hyar-cli` 运行测试 API，并证明链路来自 `hyar-cli -> hyar-adapter`

### 子任务 7：接入 Jest 单元测试依赖与配置

- 产物：`package.json`、`pnpm-lock.yaml`、`jest.config.mjs`
- 验收标准：
  - 根开发依赖包含 `jest`
  - Jest 配置使用 Node 测试环境并匹配 `test/**/*.test.ts`
  - 根测试脚本不再使用 `node --test`

### 子任务 8：迁移已有单元测试到 Jest 断言风格

- 产物：`test/workspace.test.ts`、`test/package-output.test.ts`
- 验收标准：
  - 测试用例从 `node:test` 与 `node:assert/strict` 迁移到 `@jest/globals`
  - 原有 workspace、脚本、依赖链、构建产物验收语义保持不变

### 子任务 9：验证并提交 Jest 接入

- 验收标准：
  - `pnpm run test:workspace` 成功
  - `pnpm run build` 成功
  - `pnpm run test:package-output` 成功
  - `pnpm test` 成功
  - `git diff --check` 成功
  - 使用中文规范提交，提交信息为 `[AI]test: 接入 Jest 单元测试`

### 子任务 10：统一 Jest 测试文件为 TypeScript

- 产物：`test/workspace.test.ts`、`test/package-output.test.ts`、`jest.config.mjs`
- 验收标准：
  - 当前已有 Jest 测试文件均使用 `.ts` 后缀
  - Jest 配置能通过 `ts-jest` 执行 TypeScript 测试
  - 根测试脚本指向 `.test.ts` 测试文件
  - 原有 workspace、脚本、依赖链、构建产物验收语义保持不变

### 子任务 11：同步测试文档

- 产物：`test/AGENTS.md`
- 验收标准：
  - 文档说明 Jest 测试统一使用 `.test.ts`
  - 文档列出 `test:workspace`、`test:package-output` 与 `pnpm test` 的职责
  - 文档说明 `ts-jest`、ESM VM Modules、`--watchman=false` 和 Rollup package 构建输入范围约定

---

# hybrid-written-plan Skill 创建任务计划

## 总目标

创建一个 repo-local Hybrid Skill，作为上游 `superpowers:writing-plans` 的跨端补充，要求计划阶段显式判断是否涉及原生修改以及应该采用哪种桥接形式。

## 子任务与验收标准

### 子任务 1：确认 Skill 边界与位置

- 产物：`skills/hybrid-written-plan/SKILL.md`
- 验收标准：
  - Skill 位于仓库 `skills/` 目录
  - frontmatter 能触发跨端、React Native、Flutter、原生桥接计划场景
  - 内容明确其上游为 `superpowers:writing-plans`

### 子任务 2：补充跨端计划决策规则

- 产物：`skills/hybrid-written-plan/SKILL.md`
- 验收标准：
  - 计划要求包含 `Hybrid Native Impact`
  - 明确判断是否涉及 Android/iOS 原生修改
  - 明确桥接形式选择规则与验证要求
  - 提供可复用 Good Example

### 子任务 3：同步 Skill 元信息与文档系统

- 产物：`skills/hybrid-written-plan/agents/openai.yaml`、`docs/hybrid-written-plan-skill.md`、`docs/KNOWLEDGE.md`
- 验收标准：
  - `agents/openai.yaml` 与 Skill 内容一致
  - 文档系统记录该 Skill 的职责边界和更新条件
  - 文档校验通过

### 子任务 4：验证并提交

- 验收标准：
  - `quick_validate.py` 校验 Skill 通过
  - `create-doc` 文档校验通过
  - `git diff --check` 通过或明确说明既有无关问题
  - 使用中文规范提交，提交信息以 `[AI]` 开头
