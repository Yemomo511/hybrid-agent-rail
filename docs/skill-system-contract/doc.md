---
name: skill-system-contract
description: 说明 Hyar Skill 资源、维护型 Skill、curated Skill、选择门禁和前置信息复用契约。
keywords: Skill 系统, curated Skill, .codex/skills, skills/flutter, Agent 能力资源, 框架选择门禁, metadata 约束, ARCH_CONTEXT
doc_type: contract
source_path: skills/AGENTS.md, skills/README.md, .codex/skills, skills
---
# Skill System Contract

## Purpose
说明当前 Skill 系统的资源边界、文件夹契约、关键选择门禁和前置信息复用规则，避免后续把运行时 Skill、维护型 Skill、临时模板和用户环境上下文混在一起。

## Applies To
- 当新增或维护 `skills/` 下的 Agent 能力资源时。
- 当新增 `.codex/skills/` 下的仓库维护 Skill 时。
- 当从外部仓库精选 Skill 到 Hyar 的跨端知识集合时。

## Content
`skills/` 是 Agent 能力资源目录，承载跨端开发所需的 Workflow Skill 和 Hybrid Info Skill。普通 repo-local Skill 必须位于 `skills/<category>/<skill-name>/SKILL.md`，不能直接放在 `skills/<skill-name>/SKILL.md`。

分类目录按能力归属决定：React Native 专属 Skill 放在 `skills/react-native/`；跨端通用知识放在 `skills/share/`；语言专属 Skill 放在 `skills/dart/`、`skills/kotlin/` 等语言目录；新的单独框架在 `skills/<framework>/` 下建立目录。React Native App 创建类 Skill 位于 `skills/react-native/rn-create-app/SKILL.md`，用于在创建项目前确认 Expo / Community CLI / 既有原生 App 集成路径、New Architecture / Legacy Architecture、RN 版本和 Android/iOS 平台范围；React Native 导航类 Skill 位于 `skills/react-native/rn-router/SKILL.md`，用于在导航需求中判断 Expo Router / React Navigation 选型、deep link/Web/typed routes 和新老版本迁移姿势；当用户架构或导航约束不明确时，必须先询问而不是直接创建项目或改导航结构。

跨端框架选择类 Skill 位于 `skills/share/hyar-framework-check/SKILL.md`，用于在推荐 KMP、React Native、Flutter、uni-app 前确认用户画像、目标平台、团队技术栈、原生能力和 UI 策略。该类选择门禁不完整时，Agent 必须继续询问，不能直接推荐框架；框架理念和选择依据必须来自 Skill 的 `references/` 官方资料摘要，而不是凭通用印象判断。

当前 Flutter 官方 curated Skills 位于 `skills/flutter/<skill-name>/SKILL.md`，Expo 官方 curated Skills 位于 `skills/react-native/<skill-name>/SKILL.md`，继续由 `create-curated-skill` 维护。

`.codex/skills/` 是仓库维护型 Skill 目录，服务于本仓库自身治理，例如：

- `create-doc`：创建和校验长期文档。
- `create-curated-skill`：把外部 Skill 精选为 Hyar 规范下的 Skill 文件夹。
- `create-skill`：创建 repo-local Skill，并在 `reference/good-example` 内维护可对照的完整好例子。
- `skill-test`：隔离评测待测 Skill，通过 `coco` 运行测试提示词，并生成 `.test/test-report/<skill-name>/<timestamp>/report.md` 证据报告。

`create-skill` 的标准产物是一个分类目录下的 Skill 文件夹，至少包含 `SKILL.md`，并且只允许按需补充 `scripts/`、`references/`、`assets/` 三类资源目录；维护型 Skill 如需自测，可以补充 `__test__/`。`skills/skill-template.md` 是基础 Skill 作者模板，也是 `create-skill` 生成模板的权威参考。`create-skill` 不得创建、修改或校验 curated Skill。

普通 Skill 默认不写 `metadata`。只有当 Skill 知识只适用于某个跨端框架的特定版本或版本区间时，才写 `metadata.version`；只有当 Skill 要求项目已经开启某个强配置或具备某个特定环境时，才写 `metadata.env`。通用知识、选型指南和流程方法论不应为了补足描述而写 metadata。

`Upstream Skill` 只表示当前 Skill 依赖并补充另一个 Skill。普通文档、API 页面、模块路径或参考资料不能写入 `Upstream Skill`，应放入 `references/` 或正文参考说明。

普通 Skill 如果需要收集前置信息，必须在提问前先读取目标项目根目录 `.hyar/ARCH_CONTEXT.md`；已有同一前置项答案时直接复用，不能重复询问。仍缺信息时，每个前置问题必须提供一个“最佳实践”选项，并给出可执行默认值。默认值遵循：最小化 > 最大化；最新技术 > 老技术；通用技术 > 小范围技术。

`skills/share/arch-context-collect/SKILL.md` 负责在用户回答任一 Skill 前置问题后，将问题描述、前置项名称、用户回答、适用 Skill 和更新时间写入 `.hyar/ARCH_CONTEXT.md`。同一个环境变量或前置项的问题描述只存储一份；后续回答只更新答案、更新时间或追加适用 Skill。

curated Skill 必须是文件夹形态，通常包含 `> Curated from ...`，例如 `skills/flutter/*/SKILL.md`：

```text
skills/<category>/<skill-name>/SKILL.md
```

文件夹名必须等于 frontmatter `name`。`SKILL.md` 必须保留必选 `Source`，并让 `How to use` 严格遵循 curated 模板，只允许替换发现时机、上游 URL 和 Skill Name。

不要在 `skills/` 根目录保留一次性模板或散落 Markdown 文件。`skills/skill-template.md` 是保留的基础 Skill 作者模板；其他模板和示例应内聚在维护型 Skill 的 `references/` 或既有 `reference/` 资源目录中。

## Update When
- `skills/` 的分类、文件夹结构或注入规则变化。
- 跨端框架选择门禁、框架官方资料来源或推荐输出契约变化。
- 普通 Skill 的前置信息提问、最佳实践选项或 `.hyar/ARCH_CONTEXT.md` 记录契约变化。
- 普通 Skill 的 metadata 使用约束变化。
- `.codex/skills/` 新增维护型 Skill 或已有维护 Skill 的职责变化。
- curated Skill 模板、curated `Source` 规则、repo-local `Upstream Skill` 规则或 `How to use` 严格格式变化。
