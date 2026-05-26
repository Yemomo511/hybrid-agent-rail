---
name: expo-curated-skills
description: 记录 Expo 官方 Skills 在 React Native 目录中的精选来源和维护边界。
keywords: Expo 官方 Skill, expo/skills, skills/react-native, Expo 精选 Skill, curated Skill
doc_type: contract
source_path: skills/react-native
---
# Expo Curated Skills

## Purpose
记录 `skills/react-native/` 下 Expo 官方 curated Skills 的来源、目录边界和更新规则，方便后续 Agent 判断何时读取或维护。

## Applies To
- 当需求涉及 Expo App 设计、原生 UI、EAS、API routes、开发客户端、Expo Modules、升级、部署或数据请求能力时。
- 当需要从 Expo 官方 `expo/skills` 同步、增删或更新 curated Skill 时。
- 当审核 `skills/react-native/` 中 Expo curated Skills 是否仍与 Expo 官方 Skills 列表保持一致时。

## Content
`skills/react-native/` 存放从 Expo 官方 `expo/skills` 精选的 Skill 文件夹。每个文件夹以 Skill 名称命名，并包含一个 `SKILL.md`，只保留触发描述、上游来源和严格的安装/调用说明，不复制完整上游 bundle 的脚本、资源或参考资料。

当前目录覆盖 GitHub `plugins/expo/skills` 中的 15 个 Expo Skills：

1. `add-app-clip`
2. `building-native-ui`
3. `eas-update-insights`
4. `expo-api-routes`
5. `expo-brownfield`
6. `expo-cicd-workflows`
7. `expo-deployment`
8. `expo-dev-client`
9. `expo-module`
10. `expo-tailwind-setup`
11. `expo-ui-jetpack-compose`
12. `expo-ui-swift-ui`
13. `native-data-fetching`
14. `upgrading-expo`
15. `use-dom`

新增或更新文件时必须使用 `.codex/skills/create-curated-skill/` 的内部模板，并运行：

```bash
node .codex/skills/create-curated-skill/validate.mjs skills/react-native/<skill-name>
```

如果需要完整上游工作流，应根据每个 curated Skill 的 `Source` URL 安装或查看 Expo 官方 bundle，而不是在本仓库重复维护上游脚本。

## Update When
- Expo 官方 `expo/skills` 的 Available Skills 或 GitHub 目录发生变化。
- Expo 官方某个 Skill 的 description、目录名或上游路径发生变化。
- `.codex/skills/create-curated-skill/` 的 curated Skill 模板或校验契约发生变化。
- `skills/react-native/` 的 Expo curated Skill 目录边界、命名规则或来源记录方式发生变化。
