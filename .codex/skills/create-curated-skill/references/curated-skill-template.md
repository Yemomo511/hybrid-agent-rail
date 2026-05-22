--- 
name: 精选的 Skill 名称
description: Skill 介绍
metadata:
  version: <可选, 填写支持的框架和对应的版本号，如 0.74 >= rn >= 0.68>
  env: <可选，填写你需要跨端环境, 如配置了Expo>
---

## <Skill Name>
> Curated from <Skill from>
<-- 一般和 description 保持一致 -->

## Source
- Upstream: <Skill Github Url， 请确保该 Skill 可被访问>

## How to use
该 Skill 由 hyar 跨端框架精选, <简要描述发现时机>。若要运行包含原始资源、脚本和参考资料的完整上游工作流，请将上游 bundle 安装到当前活跃 Agent 的 skills 目录中：
``` bash
# 查看上游 README，确认准确路径
open <Upstream Skill Url>
```
然后，让 Agent 通过该 skill 的名称（<Skill Name>）来调用它，或使用该 skill frontmatter 中列出的任一触发短语来调用它。
