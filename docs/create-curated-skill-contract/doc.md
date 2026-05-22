---
name: create-curated-skill-contract
description: 说明 curated Skill 的创建模板、必选 Source 和严格 How to use 校验契约。
keywords: curated Skill, 精选 Skill, Source 必选, How to use 模板, create-curated-skill
doc_type: contract
source_path: .codex/skills/create-curated-skill/SKILL.md, .codex/skills/create-curated-skill/validate.mjs
---
# Create Curated Skill Contract

## Purpose
说明精选外部 Skill 进入 `skills/` 时必须遵循的模板和校验规则，避免 curated Skill 格式漂移。

## Applies To
- 当需要把外部 Skill、上游 Skill bundle 或框架官方 Skill 精选为 `skills/<category>/<name>/SKILL.md` 时。
- 当修改 `.codex/skills/create-curated-skill/` 的模板、示例、校验器或输出规则时。
- 当审核 `skills/` 下 curated Skill 是否符合仓库约定时。

## Content
`.codex/skills/create-curated-skill/` 是 curated Skill 的维护入口。创建 curated Skill 时，必须先读取内部模板 `references/curated-skill-template.md`，并用 `references/curated-skill-example.md` 对照最终格式。

curated Skill 的稳定契约包括：

1. 产物必须是 Skill 文件夹，入口文件必须是 `skills/<category>/<name>/SKILL.md`。
2. Skill 文件夹名必须与 frontmatter `name` 保持一致。
3. frontmatter 必须包含 `name` 和 `description`，只允许按需在 `metadata` 下补充 `version`、`env`。
4. 正文必须包含 `## <name>`、`> Curated from ...`、`## Source`、`## How to use`。
5. `## Source` 是必选章节，必须写 `- Upstream: http(s)://...`，不允许继续使用 `## Source<可选>`。
6. `## How to use` 必须严格遵循模板句式，只允许替换发现时机简述、上游 URL 和 Skill Name。

完成 curated Skill 后，必须运行：

```bash
node .codex/skills/create-curated-skill/validate.mjs skills/<category>/<name>
```

该校验器只审核 curated Skill 文件夹、`SKILL.md` 结构、字段、模板残留和跨字段一致性，不判断上游 Skill 内容质量。可选兼容信息必须写入 `metadata.version` 和 `metadata.env`，不能继续使用顶层 `version` 或 `env`。上游是否真的适合精选，仍需要开发者基于来源可信度和跨端场景价值判断。

## Update When
- curated Skill 的模板、示例、必选章节或 frontmatter 字段变化。
- `validate.mjs` 的审核规则、错误边界或命令入口变化。
- `skills/` 下 curated Skill 的组织方式、命名方式或来源记录方式变化。
