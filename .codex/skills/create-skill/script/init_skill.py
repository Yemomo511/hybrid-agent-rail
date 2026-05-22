#!/usr/bin/env python3
"""
Skill Initializer - Creates a repo-local Skill folder from the standard template.

Usage:
    init_skill.py <skill-name> --path <path> [--category <category>] [--resources scripts,references,assets] [--examples]

Examples:
    init_skill.py my-rn-skill --path skills --category react-native
    init_skill.py my-shared-skill --path skills --category share --resources references
    init_skill.py my-api-helper --path skills/kotlin --resources scripts --examples
"""

import argparse
import re
import sys
from pathlib import Path

MAX_SKILL_NAME_LENGTH = 64
ALLOWED_RESOURCES = {"scripts", "references", "assets"}
CURATED_SKILL_PATH_PARTS = [("skills", "flutter")]
CATEGORY_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

SKILL_TEMPLATE = """---
name: {skill_name}
description: <完整说明该 Skill 能做什么，以及什么时候应该使用它。请写清楚触发场景、目标文件类型、框架或任务类型。>
---

## {skill_title}

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
"""

EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
Example helper script for {skill_name}.

Replace this placeholder with deterministic logic only when this Skill truly
needs an executable helper.
"""


def main():
    print("example script for {skill_name}")


if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# Reference Documentation for {skill_title}

这里放置 Agent 需要按需读取的详细参考资料，例如 API 文档、领域规则、复杂流程或框架约束。
如果该 Skill 不需要额外资料，请删除本文件和空目录。
"""

EXAMPLE_ASSET = """# Example Asset File

这里放置最终产物会复制或使用的资产，例如模板、样板工程、图片、字体、图标或示例数据。
如果该 Skill 不需要资产，请删除本文件和空目录。
"""


def normalize_skill_name(skill_name):
    """Normalize a skill name to lowercase hyphen-case."""
    normalized = skill_name.strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    normalized = normalized.strip("-")
    normalized = re.sub(r"-{2,}", "-", normalized)
    return normalized


def normalize_category(category):
    if not category:
        return ""
    normalized = category.strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    normalized = normalized.strip("-")
    normalized = re.sub(r"-{2,}", "-", normalized)
    return normalized


def title_case_skill_name(skill_name):
    """Convert hyphenated skill name to Title Case for display."""
    return " ".join(word.capitalize() for word in skill_name.split("-"))


def parse_resources(raw_resources):
    if not raw_resources:
        return []
    resources = [item.strip() for item in raw_resources.split(",") if item.strip()]
    invalid = sorted({item for item in resources if item not in ALLOWED_RESOURCES})
    if invalid:
        allowed = ", ".join(sorted(ALLOWED_RESOURCES))
        print(f"[ERROR] Unknown resource type(s): {', '.join(invalid)}")
        print(f"        Allowed: {allowed}")
        sys.exit(1)
    deduped = []
    seen = set()
    for resource in resources:
        if resource not in seen:
            deduped.append(resource)
            seen.add(resource)
    return deduped


def create_resource_dirs(skill_dir, skill_name, skill_title, resources, include_examples):
    for resource in resources:
        resource_dir = skill_dir / resource
        resource_dir.mkdir(exist_ok=True)
        if resource == "scripts":
            if include_examples:
                example_script = resource_dir / "example.py"
                example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name), encoding="utf-8")
                example_script.chmod(0o755)
                print("[OK] Created scripts/example.py")
            else:
                print("[OK] Created scripts/")
        elif resource == "references":
            if include_examples:
                example_reference = resource_dir / "api_reference.md"
                example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title), encoding="utf-8")
                print("[OK] Created references/api_reference.md")
            else:
                print("[OK] Created references/")
        elif resource == "assets":
            if include_examples:
                example_asset = resource_dir / "example_asset.txt"
                example_asset.write_text(EXAMPLE_ASSET, encoding="utf-8")
                print("[OK] Created assets/example_asset.txt")
            else:
                print("[OK] Created assets/")


def is_curated_skill_path(path):
    parts = path.resolve().parts
    for curated_parts in CURATED_SKILL_PATH_PARTS:
        for index in range(0, len(parts) - len(curated_parts) + 1):
            if parts[index : index + len(curated_parts)] == curated_parts:
                return True
    return False


def is_skills_root(path):
    return path.name == "skills"


def resolve_output_dir(path, category):
    output_dir = Path(path).resolve()
    if is_skills_root(output_dir) and not category:
        print("[ERROR] Creating a Skill directly under skills/ is not allowed.")
        print("        Pass --category, for example: --category react-native, --category share, or --category kotlin.")
        return None
    if category and output_dir.name != category:
        output_dir = output_dir / category
    return output_dir


def init_skill(skill_name, path, category, resources, include_examples):
    """
    Initialize a new skill directory with SKILL.md and optional resources.
    """
    output_dir = resolve_output_dir(path, category)
    if not output_dir:
        return None
    if is_curated_skill_path(output_dir):
        print("[ERROR] create-skill must not create or modify curated Skills.")
        print("        Use create-curated-skill for curated folders such as skills/flutter/*.")
        return None

    skill_dir = output_dir / skill_name

    if skill_dir.exists():
        print(f"[ERROR] Skill directory already exists: {skill_dir}")
        return None

    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"[OK] Created skill directory: {skill_dir}")
    except Exception as error:
        print(f"[ERROR] Error creating directory: {error}")
        return None

    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(skill_name=skill_name, skill_title=skill_title)
    skill_md_path = skill_dir / "SKILL.md"
    try:
        skill_md_path.write_text(skill_content, encoding="utf-8")
        print("[OK] Created SKILL.md")
    except Exception as error:
        print(f"[ERROR] Error creating SKILL.md: {error}")
        return None

    if resources:
        try:
            create_resource_dirs(skill_dir, skill_name, skill_title, resources, include_examples)
        except Exception as error:
            print(f"[ERROR] Error creating resource directories: {error}")
            return None

    print(f"\n[OK] Skill '{skill_name}' initialized successfully at {skill_dir}")
    print("\nNext steps:")
    print("1. Edit SKILL.md and replace template placeholders.")
    if resources:
        if include_examples:
            print("2. Customize or delete the example files in scripts/, references/, and assets/.")
        else:
            print("2. Add only the resources this Skill truly needs.")
    else:
        print("2. Create scripts/, references/, or assets/ only if needed.")
    print("3. Run quick_validate.py in default mode for structure checks.")
    print("4. Run quick_validate.py --strict before treating the Skill as complete.")

    return skill_dir


def main():
    parser = argparse.ArgumentParser(
        description="Create a new Skill folder with SKILL.md and optional resource directories.",
    )
    parser.add_argument("skill_name", help="Skill name (normalized to hyphen-case)")
    parser.add_argument("--path", required=True, help="Output directory for the Skill")
    parser.add_argument(
        "--category",
        default="",
        help="Skill category folder when creating under skills/, for example react-native, share, dart, or kotlin",
    )
    parser.add_argument(
        "--resources",
        default="",
        help="Comma-separated list: scripts,references,assets",
    )
    parser.add_argument(
        "--examples",
        action="store_true",
        help="Create example files inside the selected resource directories",
    )
    args = parser.parse_args()

    raw_skill_name = args.skill_name
    skill_name = normalize_skill_name(raw_skill_name)
    if not skill_name:
        print("[ERROR] Skill name must include at least one letter or digit.")
        sys.exit(1)
    if len(skill_name) > MAX_SKILL_NAME_LENGTH:
        print(
            f"[ERROR] Skill name '{skill_name}' is too long ({len(skill_name)} characters). "
            f"Maximum is {MAX_SKILL_NAME_LENGTH} characters."
        )
        sys.exit(1)
    if skill_name != raw_skill_name:
        print(f"Note: Normalized skill name from '{raw_skill_name}' to '{skill_name}'.")

    raw_category = args.category
    category = normalize_category(raw_category)
    if raw_category and not category:
        print("[ERROR] Category must include at least one letter or digit.")
        sys.exit(1)
    if category and not CATEGORY_PATTERN.match(category):
        print(f"[ERROR] Category must use lowercase letters, digits, and hyphens: {category}")
        sys.exit(1)
    if raw_category and category != raw_category:
        print(f"Note: Normalized category from '{raw_category}' to '{category}'.")

    resources = parse_resources(args.resources)
    if args.examples and not resources:
        print("[ERROR] --examples requires --resources to be set.")
        sys.exit(1)

    print(f"Initializing skill: {skill_name}")
    print(f"   Location: {args.path}")
    if category:
        print(f"   Category: {category}")
    if resources:
        print(f"   Resources: {', '.join(resources)}")
        if args.examples:
            print("   Examples: enabled")
    else:
        print("   Resources: none")
    print()

    result = init_skill(skill_name, args.path, category, resources, args.examples)
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
