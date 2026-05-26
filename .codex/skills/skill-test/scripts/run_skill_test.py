#!/usr/bin/env python3
"""
Run isolated Skill tests through coco and write a structured evidence report.
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


DEFAULT_PROMPT_TYPES = ["问题解答", "问题解答", "简单操作", "复杂操作", "复杂操作"]
SUMMARY_LIMIT = 1600


@dataclass
class SkillInfo:
    name: str
    description: str
    skill_file: Path
    skill_dir: Path
    headings: list[str]


@dataclass
class TestPrompt:
    coverage_type: str
    content: str
    full_prompt: str = ""


@dataclass
class CocoResult:
    index: int
    prompt: TestPrompt
    cwd: Path
    returncode: int
    stdout: str
    stderr: str
    started_at: str
    finished_at: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Skill Test with coco.")
    parser.add_argument("--skill", required=True, help="Path to a Skill folder or SKILL.md")
    parser.add_argument("--cwd", required=True, help="Target project cwd for coco execution")
    parser.add_argument(
        "--prompt",
        action="append",
        default=[],
        help='Test prompt in "<type>::<content>" format. Can be provided multiple times.',
    )
    return parser.parse_args()


def resolve_skill(skill_path: str) -> SkillInfo:
    path = Path(skill_path).resolve()
    if not path.exists():
        raise ValueError(f"Skill path does not exist: {skill_path}")

    if path.is_dir():
        skill_file = path / "SKILL.md"
        skill_dir = path
    else:
        skill_file = path
        skill_dir = path.parent

    if skill_file.name != "SKILL.md" or not skill_file.is_file():
        raise ValueError(f"Skill path must be a Skill folder or SKILL.md: {skill_path}")

    content = skill_file.read_text(encoding="utf-8")
    name = parse_frontmatter_value(content, "name") or skill_dir.name
    description = parse_frontmatter_value(content, "description") or ""
    headings = re.findall(r"^##\s+(.+?)\s*$", content, re.MULTILINE)
    return SkillInfo(name=name, description=description, skill_file=skill_file, skill_dir=skill_dir, headings=headings)


def parse_frontmatter_value(content: str, key: str) -> str:
    match = re.match(r"^---\s*\n([\s\S]*?)\n---", content)
    if not match:
        return ""
    for line in match.group(1).splitlines():
        if line.startswith(f"{key}:"):
            return line.split(":", 1)[1].strip().strip('"').strip("'")
    return ""


def parse_prompts(raw_prompts: list[str], skill: SkillInfo) -> list[TestPrompt]:
    if not raw_prompts:
        return generate_default_prompts(skill)

    prompts = []
    for raw_prompt in raw_prompts:
        if "::" not in raw_prompt:
            raise ValueError('Custom prompts must use "<type>::<content>" format')
        coverage_type, content = raw_prompt.split("::", 1)
        coverage_type = coverage_type.strip()
        content = content.strip()
        if not coverage_type or not content:
            raise ValueError('Custom prompts must use non-empty "<type>::<content>" values')
        prompts.append(TestPrompt(coverage_type=coverage_type, content=content))
    return prompts


def generate_default_prompts(skill: SkillInfo) -> list[TestPrompt]:
    topic = skill.description or "这个 Skill 的核心能力"
    heading_hint = "、".join(skill.headings[:4]) if skill.headings else skill.name
    contents = [
        f"请解释 {skill.name} 适合在什么用户需求下触发，并说明不应该触发的边界。",
        f"请基于待测 Skill 回答：当目标项目上下文不足时，Agent 应该先做哪些确认？参考章节：{heading_hint}。",
        f"请在目标项目中完成一次最小可执行操作：读取相关上下文并输出一段符合待测 Skill 要求的简短结果，不要修改待测 Skill。",
        f"请处理一个复杂场景：用户需求同时涉及多个模块，请按待测 Skill 的流程拆分步骤、指出风险并给出验收方式。",
        f"请执行一轮复杂评审：观察目标项目上下文后，判断 {topic} 是否会诱导 Agent 猜测，并输出证据和最小修改建议。",
    ]
    return [TestPrompt(coverage_type=coverage_type, content=content) for coverage_type, content in zip(DEFAULT_PROMPT_TYPES, contents)]


def create_isolated_skill(skill: SkillInfo, target_cwd: Path, timestamp: str) -> Path:
    work_root = target_cwd / ".test" / "skill-test-work" / skill.name / timestamp / "testpath" / skill.name
    work_root.parent.mkdir(parents=True, exist_ok=True)
    if work_root.exists():
        shutil.rmtree(work_root)
    shutil.copytree(skill.skill_dir, work_root, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store"))
    return work_root / "SKILL.md"


def build_full_prompts(skill: SkillInfo, prompts: list[TestPrompt], isolated_skill_file: Path) -> None:
    for prompt in prompts:
        prompt.full_prompt = f"读取`{skill.name}`,其位于 {isolated_skill_file},完成以下需求: {prompt.content}"


def run_coco(prompts: list[TestPrompt], target_cwd: Path) -> list[CocoResult]:
    results = []
    for index, prompt in enumerate(prompts, start=1):
        started_at = now_iso()
        completed = subprocess.run(
            ["coco", prompt.full_prompt],
            cwd=target_cwd,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        finished_at = now_iso()
        results.append(
            CocoResult(
                index=index,
                prompt=prompt,
                cwd=target_cwd,
                returncode=completed.returncode,
                stdout=completed.stdout,
                stderr=completed.stderr,
                started_at=started_at,
                finished_at=finished_at,
            )
        )
    return results


def write_report(
    skill: SkillInfo,
    target_cwd: Path,
    timestamp: str,
    isolated_skill_file: Path,
    results: list[CocoResult],
) -> Path:
    report_dir = target_cwd / ".test" / "test-report" / skill.name / timestamp
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = report_dir / "report.md"
    report_path.write_text(build_report(skill, target_cwd, timestamp, isolated_skill_file, results), encoding="utf-8")
    return report_path


def build_report(
    skill: SkillInfo,
    target_cwd: Path,
    timestamp: str,
    isolated_skill_file: Path,
    results: list[CocoResult],
) -> str:
    lines = [
        "# Skill Test Report",
        "",
        "## 基本信息",
        "",
        f"- 待测 Skill 名称: `{skill.name}`",
        f"- 待测 Skill 原始路径: `{skill.skill_file}`",
        f"- 隔离 Skill 路径: `{isolated_skill_file}`",
        f"- 测试运行时间: `{timestamp}`",
        f"- 执行 cwd: `{target_cwd}`",
        "- coco 执行协议: `cd {path}` 后执行 `coco \"{prompt}\"`",
        "",
        "## Test Prompts",
        "",
    ]

    for result in results:
        lines.extend(
            [
                f"### {result.index}. {result.prompt.coverage_type}",
                "",
                f"- 测试提示词: {result.prompt.content}",
                "- 完整 prompt:",
                "",
                fenced(result.prompt.full_prompt),
                "",
            ]
        )

    lines.extend(["## Coco 反馈摘要", ""])
    for result in results:
        lines.extend(
            [
                f"### Run {result.index}: {result.prompt.coverage_type}",
                "",
                f"- 开始时间: `{result.started_at}`",
                f"- 结束时间: `{result.finished_at}`",
                f"- 实际 cwd: `{result.cwd}`",
                f"- 退出状态: {result.returncode}",
                "- stdout 摘要:",
                "",
                fenced(summarize(result.stdout)),
                "",
                "- stderr 摘要:",
                "",
                fenced(summarize(result.stderr)),
                "",
            ]
        )

    lines.extend(
        [
            "## 观察到的问题",
            "",
            "| 优先级 | 问题 | 证据 | 扣分 |",
            "| --- | --- | --- | --- |",
            "| 待评审 | 由评审 Agent 根据 coco 思考和输出补充 | 待补充 | 待补充 |",
            "",
            "## 是否通过与评分",
            "",
            "- 最终评分: 待评审 / 100",
            "- 是否通过: 待评审",
            "- 评分依据: P0 直接不通过；P1 每个扣 15 分；P2 每个扣 5 分；90 分及以上且无 P0 才通过。",
            "",
            "## 最小化修改建议",
            "",
            "- 待评审。Skill Test 只给出克制建议，不直接修改待测 Skill。",
            "",
        ]
    )
    return "\n".join(lines)


def summarize(value: str) -> str:
    if not value:
        return "(empty)"
    stripped = value.strip()
    if len(stripped) <= SUMMARY_LIMIT:
        return stripped
    return stripped[:SUMMARY_LIMIT] + "\n... [truncated]"


def fenced(value: str) -> str:
    return f"```text\n{value}\n```"


def now_iso() -> str:
    return datetime.now().astimezone().replace(microsecond=0).isoformat()


def timestamp_slug() -> str:
    return datetime.now().astimezone().strftime("%Y%m%d-%H%M%S")


def main() -> int:
    try:
        args = parse_args()
        skill = resolve_skill(args.skill)
        target_cwd = Path(args.cwd).resolve()
        if not target_cwd.is_dir():
            raise ValueError(f"--cwd must be an existing directory: {args.cwd}")

        timestamp = timestamp_slug()
        prompts = parse_prompts(args.prompt, skill)
        isolated_skill_file = create_isolated_skill(skill, target_cwd, timestamp)
        build_full_prompts(skill, prompts, isolated_skill_file)
        results = run_coco(prompts, target_cwd)
        report_path = write_report(skill, target_cwd, timestamp, isolated_skill_file, results)
        print(report_path.relative_to(target_cwd).as_posix())
        return 0
    except Exception as error:
        print(f"[skill-test] {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
