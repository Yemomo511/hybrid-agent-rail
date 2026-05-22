---
name: adapter-cli-injection-contract
description: 说明 hyar init 项目级 Skill 注入的资源来源、平台目录和写入事务边界。
keywords: hyar init, 项目级 Skill 注入, Adapter CLI, .codex/skills, .hyar rollback, dist skills 软链
doc_type: contract
source_path: package/hyar-adapter/src, package/hyar-cli/src, skills
---
# Adapter CLI Injection Contract

## Purpose
说明 `hyar init` 的项目级 Skill 注入契约，避免后续改动误写用户级目录或破坏跨平台共享 Skill 格式。

## Applies To
- 当修改 `hyar init` 命令、Adapter scanner/coordinator/emitter 或 package 内置 Skill 资源定位时。
- 当新增 Agent 平台、框架过滤规则、Skill 输出格式或写入事务策略时。
- 当排查 `.codex/skills`、`.claude/skills`、`.cursor/skills`、`.trae/skills` 注入结果时。

## Content
`hyar init` 只写目标项目内的项目级 Skill 目录，不写任何用户级或全局目录。`--cwd` 决定所有目标路径、`.hyar/tmp` 和 `.hyar/rollback` 的根目录；不传时使用当前工作目录。

源 Skill 只来自 Hyar 包自带资源。开发态以仓库根 `skills/` 为源码，普通构建会把 `hyar-adapter/dist/skills` 建成指向根 `skills/` 的软链；包态以 `hyar-adapter/dist/skills` 为内置资源，正式发版构建必须把根 `skills/` 复制成 adapter `dist/skills` 内的真实目录。目标项目自己的 `skills/` 不参与扫描。

平台写入目录固定为：

```text
Codex       -> <cwd>/.codex/skills/<skill-name>
Claude Code -> <cwd>/.claude/skills/<skill-name>
Cursor      -> <cwd>/.cursor/skills/<skill-name>
Trae        -> <cwd>/.trae/skills/<skill-name>
AntiGravity -> <cwd>/.agents/skills/<skill-name>
```

Codex 使用自己的 `.codex/skills` 项目级目录，不再与 AntiGravity 共享 `.agents/skills`。当多个平台目标目录相同时，Adapter 才会在写入计划中标记共享目标。

Scanner 只做基础结构校验：`SKILL.md` 存在、frontmatter 可解析、`name` 和 `description` 必填、`name` 等于文件夹名且为小写 kebab-case、本次扫描范围内 `name` 不重复。按框架过滤时总是包含 `skills/share/*` 和根级 Skill；KMP/UniApp 当前没有专属 Skill 时允许继续，只有最终扫描结果为空才失败。

Coordinator 输出跨平台最低公共结构，只保留 `name`、`description` 和可选 `metadata.version` / `metadata.env`。存在 version/env 时，需要同步追加到 description，并在 `## Pre Requirement(必读)` 中按 `版本要求`、`环境要求` 去重更新。

Emitter 使用事务目录替换目标 Skill 文件夹。临时产物写入 `<cwd>/.hyar/tmp/<run-id>`，覆盖前备份到 `<cwd>/.hyar/rollback/<run-id>`。写入失败必须尝试回滚；如果回滚失败，保留 rollback 目录并报告需要人工检查的目标路径。`.gitignore` 只自动维护 `.hyar/tmp/` 和 `.hyar/rollback/` 两条规则。

## Update When
- 平台目录、共享关系、资源复制白名单或事务目录变化。
- Scanner 校验边界、框架过滤规则或公共 `SKILL.md` frontmatter 字段变化。
- `hyar-cli` 包名、bin 命令、交互/非交互参数或 `--cwd` 语义变化。
- package 开发构建不再把根 `skills/` 软链到 `hyar-adapter/dist/skills`，或 release 构建不再把根 `skills/` 复制成真实目录。
