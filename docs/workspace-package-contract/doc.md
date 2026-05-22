---
name: workspace-package-contract
description: 说明 pnpm workspace、Rollup package 构建和跨包依赖契约。
keywords: pnpm workspace, package 构建, Rollup, hyar-cli, hyar-adapter, build:release, dist skills 软链
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

package 构建由各 package 内部的 `rollup.config.mjs` 和 package-local `tsconfig.build.json` 声明。每个 package 以 `src/index.ts` 为库入口，输出 ESM、CJS 和 declaration 文件到 `dist/`；如果 package 提供 bin，例如 `hyar-cli` 的 `hyar`，还需要输出对应可执行入口。workspace 内部依赖、Node 内建模块和 package dependencies 应作为 external 保留，由 workspace 或 npm 依赖连接，而不是被 Rollup 打包进下游产物。

当前 package 构建先使用 `tsc --emitDeclarationOnly` 生成声明文件，再使用 Rollup 生成 JS 产物。`hyar-adapter` 普通开发构建会把 `package/hyar-adapter/dist/skills` 建成指向仓库根 `skills/` 的软链，确保本地 Skill 修改能被 `hyar init` 立即读取。正式发版必须使用 release 构建，把根 `skills/` 复制成 `dist/skills` 内的真实目录，确保 npm 包运行时能读取内置 Skill 资源。

新增 package 时，应同步检查：

1. `pnpm-workspace.yaml` 是否能覆盖该包。
2. package `exports` 是否提供 ESM/CJS/types 入口。
3. package 内部 `rollup.config.mjs` 和 `tsconfig.build.json` 是否能正确读取根 `tsconfig.base.json` 并保留 workspace 内部依赖。
4. `test/package-output.test.ts` 是否需要覆盖新的产物要求。

发布 package 前应运行 `pnpm run build:release`，而不是只运行普通 `pnpm run build`。普通构建产物中的 `dist/skills` 可以是软链；release 构建产物中的 `dist/skills` 必须是真实目录。

## Update When
- workspace 成员范围、包命名或依赖方向变化。
- Rollup 输出格式、exports 结构或 TypeScript declaration 生成规则变化。
- example 消费链路或根构建/测试脚本变化。
