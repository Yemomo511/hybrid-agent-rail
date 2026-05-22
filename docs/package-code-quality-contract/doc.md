---
name: package-code-quality-contract
description: 说明 package 源码的 ESLint、Prettier 门禁和修改验收顺序。
keywords: package 代码规范, ESLint, Prettier, lint:package, format:package:check
doc_type: contract
source_path: package.json, eslint.config.mjs, .prettierrc.json, package
---
# Package Code Quality Contract

## Purpose
说明 `package/*/src/**/*.ts` 的代码质量门禁，确保后续 package 源码修改先通过 ESLint 和 Prettier。

## Applies To
- 当修改 `package/*/src/**/*.ts` 下的 TypeScript 源码时。
- 当新增、重命名或删除 package 源码文件时。
- 当调整 ESLint、Prettier 或 package 代码质量脚本时。

## Content
package 源码只约束 `package/*/src/**/*.ts`，不默认覆盖 `test/`、`example/`、`.codex/`、`skills/` 或 `docs/`，避免把治理范围一次性扩大到非 package 源码。

当前代码质量门禁由根脚本提供：

```bash
pnpm run lint:package
pnpm run format:package:check
pnpm run check:package-code
```

`lint:package` 使用 ESLint flat config 检查 package TypeScript 源码；`format:package:check` 使用 Prettier 检查格式；`check:package-code` 是 package 源码修改的最小必跑门禁。

修改 package 源码后的验收顺序是：

```text
check:package-code -> build -> package-output/example tests
```

如果只改文档或 Skill，不需要运行 package 代码质量门禁；如果改动影响 package exports、workspace 依赖或 example 消费链路，还应继续运行完整 `pnpm test`。

## Update When
- `eslint.config.mjs`、`.prettierrc.json` 或 `.prettierignore` 变化。
- 根 `package.json` 的 lint、format、check 或 test 脚本变化。
- package 源码目录、文件类型或质量门禁作用域变化。
