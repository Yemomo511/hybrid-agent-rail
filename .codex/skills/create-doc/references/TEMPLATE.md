---
name: <knowledge-name>
description: <knowledge-description>(精炼简要概括这个文档说明的核心内容，不超过100字。)
keywords: <keywords-phrase>, <keywords-phrase>(使用一个个简短触发短语，例如: 在终端运行cli命令, 运行npx命令, 初始化Agents环境)
doc_type: knowledge | contract | decision | usage | workflow | experience | index
source_path: <relative-source-path>(记录该文档对应的权威来源路径，例如 packages/cli/src 或 skills/create-doc/SKILL.md；无明确来源时填写 none。文档文件必须位于 docs/<knowledge-name>/doc.md。)
---
# <DocName>
<--精炼的名称，说明文档的作用-->

## Purpose
<-- 文档的作用：说明这篇文档解决什么问题，不超过100字。>

## Applies To
<-- 什么时候应该读取这篇文档。
- 使用简短场景描述，强调触发条件。
- 如果只适用于特定模块、阶段、Agent、Skill 或工作流，需要明确写出边界。
-->

## Content
<-- 正文内容。
- 只记录稳定知识、职责边界、接口契约、使用姿势、决策依据、失败恢复或高价值经验。
- 不记录临时过程、无结论调试日志、单次任务进度、可从代码直接读取的逐行实现细节。
-->

## Update When
<-- 什么变化发生时必须更新这篇文档。
- 例如：相关接口变更、文件路径迁移、Agent 编排变化、Skill 能力变化、门禁规则变化、权威来源变化。
- 如果无法确认当前事实，需要标注待验证，而不是写成确定结论。
-->

<!-- Optional Blocks：按需保留，不需要时删除。

## Preconditions
当前文档需要前置知识时填写，常用于“如何去做”的指导性文档。
仅列出项目业务前置知识，不写 npm、Rollup、TypeScript、Markdown 等通用技术前置知识。

## Does Not Apply To
记录容易误用但不适用的场景，帮助 Agent 避免错误调用。

## Contract
记录输入、输出、上下游依赖、产物格式、消费方和兼容边界。

## Decision
记录方案选择、取舍原因、适用边界、被否定路径和最终结论。

## Usage
记录典型调用方式、使用步骤、示例和注意事项。

## Boundary
记录能力边界、非目标、限制条件和禁止事项。

## Failure Recovery
记录失败信号、排查路径、恢复动作和允许中止的条件。

## Related Documents
记录相关文档、上游文档、下游文档和索引入口。

## Last Verified
记录最近一次验证时间、验证方式和验证范围；高漂移文档建议保留。
-->
