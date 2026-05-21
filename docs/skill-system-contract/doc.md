---
name: skill-system-contract
description: 说明 Hyar Skill 资源、维护型 Skill 和 curated Skill 文件夹的组织契约。
keywords: Skill 系统, curated Skill, .codex/skills, skills/flutter, Agent 能力资源
doc_type: contract
source_path: skills/AGENTS.md, skills/README.md, .codex/skills, skills
---
# Skill System Contract

## Purpose
说明当前 Skill 系统的资源边界和文件夹契约，避免后续把运行时 Skill、维护型 Skill 和临时模板混在一起。

## Applies To
- 当新增或维护 `skills/` 下的 Agent 能力资源时。
- 当新增 `.codex/skills/` 下的仓库维护 Skill 时。
- 当从外部仓库精选 Skill 到 Hyar 的跨端知识集合时。

## Content
`skills/` 是 Agent 能力资源目录，承载跨端开发所需的 Workflow Skill 和 Hybrid Info Skill。当前 Flutter 官方 curated Skills 位于 `skills/flutter/<skill-name>/SKILL.md`。

`.codex/skills/` 是仓库维护型 Skill 目录，服务于本仓库自身治理，例如：

- `create-doc`：创建和校验长期文档。
- `create-curated-skill`：把外部 Skill 精选为 Hyar 规范下的 Skill 文件夹。
- `create-skill`：创建 repo-local Skill，并在 `reference/good-example` 内维护可对照的完整好例子。

curated Skill 必须是文件夹形态：

```text
skills/<category>/<skill-name>/SKILL.md
```

文件夹名必须等于 frontmatter `name`。`SKILL.md` 必须保留必选 `Source`，并让 `How to use` 严格遵循 curated 模板，只允许替换发现时机、上游 URL 和 Skill Name。

不要在 `skills/` 根目录保留一次性模板或散落 Markdown 文件。`skills/skill-template.md` 是保留的基础 Skill 作者模板；其他模板和示例应内聚在维护型 Skill 的 `references/` 或既有 `reference/` 资源目录中。

## Update When
- `skills/` 的分类、文件夹结构或注入规则变化。
- `.codex/skills/` 新增维护型 Skill 或已有维护 Skill 的职责变化。
- curated Skill 模板、Source 规则或 `How to use` 严格格式变化。
