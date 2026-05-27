---
description: Use Expo DOM components to run web code in a webview on native and as-is on web. Migrate web code to native incrementally.
name: use-dom
---

## use-dom
> Curated from expo's skills

Use Expo DOM components to run web code in a webview on native and as-is on web. Migrate web code to native incrementally.

## Source
- Upstream: https://github.com/expo/skills/tree/main/plugins/expo/skills/use-dom

## How to use
该 Skill 由 hyar 跨端框架精选, 用于 Expo 项目需要用 DOM components 复用 Web 代码、渐进迁移 Web UI 或在 native 中承载 Web-only 库时被 Agent 发现。若要运行包含原始资源、脚本和参考资料的完整上游工作流，请将上游 bundle 安装到当前活跃 Agent 的 skills 目录中：
``` bash
# 查看上游 README，确认准确路径
open https://github.com/expo/skills/tree/main/plugins/expo/skills/use-dom
```
然后，让 Agent 通过该 skill 的名称（use-dom）来调用它，或使用该 skill frontmatter 中列出的任一触发短语来调用它。
