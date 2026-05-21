## Hybrid Agent Rail
为跨端App， 跨端SDK开发提供的一套Agent Harness框架，整体只包括 Skill 和 Agent。 Skill 负责原子能力，如知识，指导，步骤，工具等。Agent 负责模块和流程组织。


## 协作开发流程
待更新 Github 协作流程。

## 需求开发流程
- 涉及多模块修改时， 请 `git worktree` 完成对应工作，需求完成后删除对应的`worktree`
- 任何针对npm环境，如新增npm依赖，修改package.json, 需要在删除`worktree`后，切换到对应的开发分支，将`worktree`的环境同步到本地后进行之前在`worktree`中同样测试，只有这个测试完成后才能算结束。


## Reference
- 文档入口: [knowlegde](docs/KNOWLEDGE.md) 
## Rules
- **完成任何需求时，请务必进入更新文档系统环节，防止文档漂移**。文档系统的更新部分请参考 `docs/AGENTS.md`。