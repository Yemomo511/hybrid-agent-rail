---
name: eas-update-insights
description: "Check the health of published EAS Updates: crash rates, install/launch counts, unique users, payload size, and the split between embedded and OTA users per channel."
---

## eas-update-insights
> Curated from expo's skills

Check the health of published EAS Updates: crash rates, install/launch counts, unique users, payload size, and the split between embedded and OTA users per channel.

## Source
- Upstream: https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-update-insights

## How to use
该 Skill 由 hyar 跨端框架精选, 用于 Expo 项目需要评估 EAS Update 健康度、崩溃率、用户量或 OTA/embedded 分布时被 Agent 发现。若要运行包含原始资源、脚本和参考资料的完整上游工作流，请将上游 bundle 安装到当前活跃 Agent 的 skills 目录中：
``` bash
# 查看上游 README，确认准确路径
open https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-update-insights
```
然后，让 Agent 通过该 skill 的名称（eas-update-insights）来调用它，或使用该 skill frontmatter 中列出的任一触发短语来调用它。
