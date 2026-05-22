---
name: workspace-package-contract
description: 说明 pnpm workspace、Rollup package 构建和跨包依赖契约。
keywords: pnpm workspace, package 构建, Rollup, hyar-cli, hyar-adapter
doc_type: contract
source_path: pnpm-workspace.yaml, package.json, package
---
# Workspace Package Contract

## Purpose
说明当前 package workspace 的稳定契约，避免新增包或改构建时破坏跨包消费链路。

## Applies To
- 当新增、重命名或删除 `package/*` 下的 workspace package 时。
- 当修改 Rollup 配置、package exports、workspace 依赖或根测试脚本时。
- 当 `example` 需要消费新的 Hyar package 能力时。

## Content
仓库使用 pnpm workspace，当前 workspace 成员为 `package/*` 和 `example`。根构建脚本只构建 `package/*`，示例项目通过 workspace 依赖消费构建后的包。

package 层当前保持两级依赖：

```text
hyar-cli depends on hyar-adapter through workspace:*
hyar-example depends on hyar-cli through workspace:*
```

package 构建由各 package 内部的 `rollup.config.mjs` 声明。每个 package 以 `src/index.ts` 为入口，输出 ESM、CJS 和 declaration 文件到 `dist/`。workspace 内部依赖应作为 external 保留，由 workspace 协议连接，而不是被 Rollup 打包进下游产物。

新增 package 时，应同步检查：

1. `pnpm-workspace.yaml` 是否能覆盖该包。
2. package `exports` 是否提供 ESM/CJS/types 入口。
3. package 内部 `rollup.config.mjs` 是否能正确读取根 `tsconfig.base.json` 并保留 workspace 内部依赖。
4. `test/package-output.test.ts` 是否需要覆盖新的产物要求。

## Update When
- workspace 成员范围、包命名或依赖方向变化。
- Rollup 输出格式、exports 结构或 TypeScript declaration 生成规则变化。
- example 消费链路或根构建/测试脚本变化。
