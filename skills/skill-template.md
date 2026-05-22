--- 
name: <Skill Name>
description: <完整说明该 Skill 能做什么，以及什么时候应该使用它。请写清楚触发场景、目标文件类型、框架或任务类型。>
---

## <Skill Name>

## Overview

<用 1-2 句话说明该 Skill 让 Agent 获得什么能力，以及它解决什么稳定问题。>

## When To Invoke

<列出该 Skill 应该被触发的具体场景。优先写可观察的用户请求、文件类型、框架能力或任务目标。>

- <触发场景 1>
- <触发场景 2>
- <触发场景 3>

## Metadata Guidance

默认不要写 `metadata`。只有满足以下条件时，才在 frontmatter 中新增对应字段：

- `metadata.version`：当前 Skill 的知识只适用于某个跨端框架的特定版本或版本区间，例如 `React Native >= 0.74`。通用知识、选型指南、流程方法论不要写。
- `metadata.env`：当前 Skill 要求项目已经开启某个强配置或具备某个特定环境，例如“已启用 React Native New Architecture”或“已配置 Expo CNG”。没有强配置前提不要写。

## Structuring This Skill

<选择最适合该 Skill 的结构，完成后删除不适用的结构说明。>

### Workflow-Based

适用于有明确步骤顺序的流程型 Skill，例如“读取需求 -> 生成计划 -> 执行实现 -> 验证结果”。

建议结构：

1. `## Overview`
2. `## When To Invoke`
3. `## Workflow`
4. `## Validation`
5. `## Good Example`

### Task-Based

适用于提供多个独立操作能力的 Skill，例如“创建、读取、修改、导出”。

建议结构：

1. `## Overview`
2. `## When To Invoke`
3. `## Quick Start`
4. `## <Task Category 1>`
5. `## <Task Category 2>`

### Reference/Guidelines

适用于规范、标准、API 使用规则或代码风格类 Skill。

建议结构：

1. `## Overview`
2. `## When To Invoke`
3. `## Guidelines`
4. `## Anti-Patterns`
5. `## Good Example`

### Capabilities-Based

适用于提供多个互相关联能力的系统型 Skill。

建议结构：

1. `## Overview`
2. `## When To Invoke`
3. `## Core Capabilities`
4. `## Workflow`
5. `## Validation`

## Upstream Skill<可选，只有该 Skill 依赖并补充其他 Skill 时填写>

- Upstream: <上游 Skill 名称或 Skill bundle URL。不得填写普通文档、API 页面、模块路径或参考资料。>

## How to use<可选，只有该 Skill 依赖并补充其他 Skill 时填写>
该 Skill 是对 Upstream Skill 的补充。因此在使用该 Skill 前，务必请将上游 Skill bundle 安装到当前活跃 Agent 的 skills 目录中：
``` bash
# 查看上游 Skill README，确认准确路径
open <Upstream Skill Bundle Url>
```

## <Custom Description>

<!-- 自己的 Skill 描述 -->

<根据上面选择的结构编写 Skill 正文。正文应优先包含 Agent 完成任务所需的流程、规则、示例和验证方式，不要放入创建过程、安装说明、变更记录等噪音。>

## Resources<可选，如果该 Skill 需要捆绑资源>

只创建当前 Skill 真正需要的资源目录。没有需要时删除本节。

### scripts/

用于可直接执行的脚本，例如固定格式转换、代码生成、校验、批处理等。适合需要确定性或会被重复重写的逻辑。

### references/

用于需要按需加载的详细参考资料，例如 API 文档、框架规范、领域知识、复杂流程说明等。较长内容优先放到 references，避免让 `SKILL.md` 过长。

### assets/

用于最终产物会复制或使用的资产，例如模板文件、样板工程、图片、字体、图标、示例数据等。assets 通常不需要直接读入上下文。

## Good Example<可选，代码风格类 Skill 必须提供>

<提供一个真实、具体、可模仿的好例子。不要使用纯占位文本；如果该 Skill 有输出模板，请将完整好例子放入 example/good-output.md。>
