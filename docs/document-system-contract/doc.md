---
name: document-system-contract
description: 说明 Hybrid Agent Rail 文档系统的写入边界、索引规则和校验要求。
keywords: 文档系统, 文档治理, KNOWLEDGE, create-doc, 防止漂移
doc_type: contract
source_path: docs/AGENTS.md, .codex/skills/create-doc
---
# Document System Contract

## Purpose
说明长期文档应该记录什么、如何进入索引、如何校验，避免文档系统记录过程噪音或重复代码细节。

## Applies To
- 当新增、修改或删除 `docs/` 下的长期文档时。
- 当模块边界、Agent/Skill 约定、package 契约、测试门禁或权威来源路径变化时。
- 当需要判断某段内容是否应该进入文档系统时。

## Content
文档系统只沉淀会影响未来 Agent 判断和执行的稳定知识，包括模块职责边界、文件系统结构、命名规范、输入输出契约、产物格式、门禁规则和重要决策依据。

不要把单次任务状态、调试日志、临时草稿、逐文件作用说明或可从代码直接读出的实现细节写入长期文档。文档应描述模块级概念和稳定约束，不替代代码、测试或注释。

每篇长期文档必须包含 frontmatter：`name`、`description`、`keywords`、`doc_type`、`source_path`。正文必须包含：`Purpose`、`Applies To`、`Content`、`Update When`。

受治理文档必须使用目录化结构：`docs/<name>/doc.md`。其中 `<name>` 必须和文档 frontmatter 中的 `name` 保持一致；不要再创建 `docs/<name>.md` 形式的长期文档。

`docs/KNOWLEDGE.md` 是扁平索引，只记录文档链接、`name`、`description`、`keywords` 和 `doc_type`。Source 链接目标必须写为 `<name>/doc.md`；`source_path` 只存在于具体文档 frontmatter 中。

新增或修改文档后必须运行：

```bash
node .codex/skills/create-doc/validate.mjs docs/<name>/doc.md
node .codex/skills/create-doc/validate-knowlegdge.mjs docs/<name>/doc.md
```

## Update When
- `docs/AGENTS.md` 的写入边界、禁止事项或元信息规则变化。
- `.codex/skills/create-doc` 的模板、Knowledge 同步规则或校验器变化。
- 文档路径、索引结构或文档分类发生变化。
