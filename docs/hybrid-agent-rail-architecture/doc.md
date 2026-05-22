---
name: hybrid-agent-rail-architecture
description: 说明 Hybrid Agent Rail 当前模块架构、资源分层和主要数据流。
keywords: 项目架构, Hybrid Agent Rail, 模块分层, package, Skill 系统
doc_type: knowledge
source_path: package, example, skills, .codex/skills, pnpm-workspace.yaml
---
# Hybrid Agent Rail Architecture

## Purpose
说明当前仓库的模块分层和资源组织方式，帮助后续 Agent 在动手前判断应该修改哪一层。

## Applies To
- 当需求涉及 Hyar 包能力、CLI/adapter 关系、Skill 资源、示例工程或测试门禁时。
- 当新增 package、Agent/Skill 资源、示例项目或构建入口时。
- 当需要判断某个能力应沉淀为代码、Skill、文档还是测试时。

## Content
Hybrid Agent Rail 当前由三类资源组成：

1. 运行时代码：`package/*` 是 pnpm workspace 中的可构建包，当前包括 `hyar-adapter` 和 `hyar-cli`。
2. Agent/Skill 资源：`skills/` 存放可被 Agent 发现和注入的领域 Skill，`.codex/skills/` 存放仓库维护型 Skill。
3. 治理与验证：`docs/` 存放长期文档，`test/` 和 `example/` 负责验证 workspace、包产物和跨包消费链路。

当前主要调用链是：

```text
example -> hyar-cli -> hyar-adapter
```

`hyar-adapter` 负责 Hyar 包内 Skill 资源的扫描、公共格式转换、项目级目录写入和失败回滚；`hyar-cli` 负责 `hyar init` 命令解析、交互选择、平台探测和调用 Adapter；`example` 作为 workspace 消费方验证包导出和依赖链。

`skills/` 与 `.codex/skills/` 的边界不同：前者是面向 Agent 运行时的能力资源，后者是维护本仓库资源的治理 Skill，例如文档创建和 curated Skill 创建。

## Update When
- 新增或删除 workspace package，或改变 `example -> hyar-cli -> hyar-adapter` 依赖链。
- Agent/Skill 资源的存放位置、注入方式或治理边界变化。
- 构建、测试、文档治理入口发生结构性变化。
