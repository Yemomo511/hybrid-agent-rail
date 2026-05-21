---
name: flutter-curated-skills
description: 记录 Flutter 官方 Skills 在 Hybrid Agent Rail 中的精选目录、来源和维护边界。
keywords: Flutter 官方 Skill, flutter/skills, skills/flutter, Flutter 精选 Skill, curated Skill
doc_type: contract
source_path: skills/flutter
---
# Flutter Curated Skills

## Purpose
记录 `skills/flutter/` 下 Flutter 官方 curated Skills 的来源、目录边界和更新规则，方便后续 Agent 判断何时读取或维护。

## Applies To
- 当需求涉及 Flutter 测试、布局、架构、路由、本地化、HTTP 或 JSON 序列化能力时。
- 当需要从 Flutter 官方 `flutter/skills` 同步、增删或更新 curated Skill 时。
- 当审核 `skills/flutter/` 是否仍与官方 README 的 Available Skills 保持一致时。

## Content
`skills/flutter/` 存放从 Flutter 官方 `flutter/skills` 精选的 Skill 文件夹。每个文件夹以 Skill 名称命名，并包含一个 `SKILL.md`，只保留触发描述、上游来源和严格的安装/调用说明，不复制完整上游 bundle 的脚本、资源或参考资料。

当前目录覆盖 Flutter 官方 README 中列出的 10 个 Available Skills：

1. `flutter-add-integration-test`
2. `flutter-add-widget-preview`
3. `flutter-add-widget-test`
4. `flutter-apply-architecture-best-practices`
5. `flutter-build-responsive-layout`
6. `flutter-fix-layout-issues`
7. `flutter-implement-json-serialization`
8. `flutter-setup-declarative-routing`
9. `flutter-setup-localization`
10. `flutter-use-http-package`

新增或更新文件时必须使用 `.codex/skills/create-curated-skill/` 的内部模板，并运行：

```bash
node .codex/skills/create-curated-skill/validate.mjs skills/flutter/<skill-name>
```

如果需要完整上游工作流，应根据每个 curated Skill 的 `Source` URL 安装或查看 Flutter 官方 bundle，而不是在本仓库重复维护上游脚本。

## Update When
- Flutter 官方 `flutter/skills` README 的 Available Skills 列表发生变化。
- Flutter 官方某个 Skill 的 description、目录名或上游路径发生变化。
- `.codex/skills/create-curated-skill/` 的 curated Skill 模板或校验契约发生变化。
- `skills/flutter/` 的目录边界、命名规则或来源记录方式发生变化。
