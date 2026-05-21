---
name: document-system-contract
description: 说明如何在 Hybrid Agent Rail 中创建可治理、可检索、可维护的长期文档。
keywords: 创建文档, 文档治理, 防止漂移, 写长期文档, 更新文档
doc_type: contract
source_path: docs/AGENTS.md, .codex/skills/create-doc/references/TEMPLATE.md
---
# Document System Contract

## Purpose
说明新增或修改长期文档时必须遵循的最小规则，确保文档能被 Agent 检索、判断、复用和更新。

## Applies To
- 当需要新增 `docs/` 下的长期文档时。
- 当代码接口、Agent 编排、Skill 能力、文件路径或门禁规则发生变化，需要同步更新文档时。
- 当一次需求沉淀出可复用经验、决策依据、模块契约或错误路径，需要写入文档系统时。

## Content
长期文档必须回答四个问题：

1. 这篇文档解决什么问题。
2. 什么场景下应该读取它。
3. 它沉淀了哪些稳定知识、契约、边界或经验。
4. 什么变化发生时必须更新它。

新增文档时，优先从 `.codex/skills/create-doc/references/TEMPLATE.md` 复制轻模板，并保留以下核心结构：

```md
---
name:
description:
keywords:
doc_type:
source_path:
---
# <DocName>

## Purpose

## Applies To

## Content

## Update When
```

如果文档涉及接口、流程、架构决策或失败恢复，再按需保留可选块。不要为了格式完整而保留空章节。

## Update When
- `docs/AGENTS.md` 的 Written Rules 或 Not Written Rules 发生变化。
- `.codex/skills/create-doc/references/TEMPLATE.md` 的 frontmatter、必填章节或可选章节发生变化。
- 新增了文档分类、索引规则、校验规则或文档生成流程。
- 发现当前规则无法阻止过程噪音、实现细节重复、敏感信息或过期结论进入长期文档。

## Does Not Apply To
- 不用于记录单次任务进度、临时 TODO、调试日志或无结论探索。
- 不用于替代代码注释、测试用例或 API 类型定义。
- 不用于保存 token、cookie、私钥、账号凭据或线上密文配置。

## Contract
长期文档的 frontmatter 必须满足：

- `name`：稳定、短小、可作为索引名称。
- `description`：不超过 100 字，说明文档核心内容。
- `keywords`：使用触发短语，帮助 Agent 判断何时读取。
- `doc_type`：标记文档类型，例如 `knowledge`、`contract`、`decision`、`usage`、`workflow`、`experience`、`index`。
- `source_path`：记录权威来源路径；没有明确来源时填写 `none`。

正文必须避免三类内容：

- 可从代码直接读取的逐行实现细节。
- 临时过程噪音，例如一次性命令输出、无结论日志、当前任务状态。
- 敏感信息，例如凭据、密钥、账号隐私和线上密文。

## Usage
创建文档时按以下步骤执行：

1. 判断内容是否应该进入长期文档；如果只是当前任务状态，写入 `.temp` 或 spec 目录。
2. 从 `.codex/skills/create-doc/references/TEMPLATE.md` 复制轻模板。
3. 填写 frontmatter，确保 `keywords` 是触发短语，`source_path` 指向权威来源。
4. 填写 `Purpose`、`Applies To`、`Content`、`Update When` 四个核心章节。
5. 按需保留 `Contract`、`Decision`、`Boundary`、`Failure Recovery` 等可选块。
6. 删除没有内容的可选块，避免模板噪音进入正式文档。
7. 回看 `docs/AGENTS.md`，确认文档没有记录不该进入长期文档的内容。

## Boundary
文档系统的目标是帮助未来 Agent 更快做出正确判断，不是完整记录每次开发发生过什么。能稳定指导未来行为的内容应该沉淀；只能说明当时过程的内容应该留在任务上下文或临时目录。

## Related Documents
- `docs/AGENTS.md`：文档系统的写入规则和禁止事项。
- `.codex/skills/create-doc/references/TEMPLATE.md`：新增长期文档时使用的轻模板。
- `docs/KNOWLEDGE.md`：项目知识索引入口。
