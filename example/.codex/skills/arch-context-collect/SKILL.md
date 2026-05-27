---
description: 在用户回答任一 Skill 的前置问题后使用。适用于把架构、环境、版本、平台、包管理器、测试目标、UI 策略等前置信息写入项目根目录 .hyar/ARCH_CONTEXT.md，并在后续 Skill 提问前复用这些答案，避免重复询问。
name: arch-context-collect
---

## Arch Context Collect

## Overview

将用户对 Skill 前置问题的回答沉淀到项目根目录 `.hyar/ARCH_CONTEXT.md`。其他 Skill 再次收集前置信息前必须先读取该文件，能复用就不要重复问。

## When To Invoke

- 用户回答了任一 Skill 的前置问题。
- Skill 刚确认了环境、版本、平台、架构、包管理器、测试目标、UI 策略或交付约束。
- 其他 Skill 准备提问前，需要读取已有前置信息并判断是否可复用。

## Workflow

1. 定位目标项目根目录，并读取 `.hyar/ARCH_CONTEXT.md`；文件不存在时创建 `.hyar/` 和该文件。
2. 从本轮上下文提取：问题描述、前置项名称、用户回答、适用 Skill、更新时间。
3. 用前置项名称作为去重键；同一个环境变量或前置项的问题描述只保留一份。
4. 如果前置项已存在，更新用户回答和更新时间，并把当前 Skill 追加到适用 Skill 列表；不要复制一段新的问题描述。
5. 如果前置项不存在，追加一条结构化记录。
6. 后续任一 Skill 收集前置信息前，先读取该文件并复用已确认答案。

## Record Format

使用 Markdown，保持可读、可手工修改：

```markdown
# ARCH_CONTEXT

## target-platforms

- 问题描述: 目标平台和产品形态是什么？
- 用户回答: Android + iOS App
- 适用 Skill: hyar-framework-check, rn-create-app
- 更新时间: 2026-05-26 15:30:00 +08:00
```

## Dedup Rules

- 去重键是前置项名称，例如 `rn-version`、`target-platforms`、`package-manager`、`test-scope`。
- 问题描述语义相同但措辞不同，也合并到同一前置项。
- 用户新回答与旧答案冲突时，用新答案覆盖，并保留更新时间。
- 适用 Skill 使用逗号分隔，追加前先去重。

## Pre-Question Best Practice

当该 Skill 被用于记录前置问题答案时，不再向用户追加提问。若必须补字段，使用最小默认值：

- 前置项名称：最佳实践默认使用英文 kebab-case，取稳定概念名。
- 适用 Skill：最佳实践默认填写当前触发记录的 Skill 名称。
- 更新时间：最佳实践默认使用当前本地时间和时区。

## Anti-Patterns

- 每次回答都追加一份重复的问题描述。
- 把临时推理过程、未确认猜测或完整聊天记录写入 `.hyar/ARCH_CONTEXT.md`。
- 在其他 Skill 提问前跳过 `.hyar/ARCH_CONTEXT.md`，导致重复询问同一前置项。
