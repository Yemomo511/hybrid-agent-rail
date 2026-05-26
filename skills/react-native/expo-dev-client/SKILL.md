---
name: expo-dev-client
description: Build and distribute Expo development clients locally or via TestFlight.
---

## expo-dev-client
> Curated from expo's skills

Build and distribute Expo development clients locally or via TestFlight.

## Source
- Upstream: https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-dev-client

## How to use
该 Skill 由 hyar 跨端框架精选, 用于 Expo 项目因自定义原生代码、第三方原生模块或 apple targets 需要 development client 时被 Agent 发现。若要运行包含原始资源、脚本和参考资料的完整上游工作流，请将上游 bundle 安装到当前活跃 Agent 的 skills 目录中：
``` bash
# 查看上游 README，确认准确路径
open https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-dev-client
```
然后，让 Agent 通过该 skill 的名称（expo-dev-client）来调用它，或使用该 skill frontmatter 中列出的任一触发短语来调用它。
