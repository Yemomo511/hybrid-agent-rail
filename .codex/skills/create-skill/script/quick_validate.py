#!/usr/bin/env python3
"""
Validate a repo-local Skill folder.

Default mode checks generated structure and allows template placeholders.
Strict mode rejects template placeholders and unfinished sections.
"""

import argparse
import re
import sys
from pathlib import Path

ALLOWED_FRONTMATTER = {"name", "description", "metadata"}
ALLOWED_METADATA = {"version", "env"}
ALLOWED_RESOURCE_DIRS = {"scripts", "references", "assets"}
DISALLOWED_RESOURCE_DIRS = {"script", "reference", "asset"}
CURATED_SKILL_PATH_PARTS = [("skills", "flutter")]
PLACEHOLDER_PATTERNS = [
    re.compile(r"<[^>\n]+>"),
    re.compile(r"\bTODO\b", re.IGNORECASE),
    re.compile(r"\[TODO:"),
    re.compile(r"<!--\s*自己的 Skill 描述\s*-->"),
]
UPSTREAM_FORBIDDEN_WORDS = [
    "文档",
    "api",
    "模块",
    "页面",
    "参考资料",
    "reference",
    "documentation",
    "docs",
    "module",
    "page",
]


class SkillValidator:
    def validate(self, skill_dir, strict=False):
        errors = []
        resolved = Path(skill_dir).resolve()

        if not resolved.exists():
            return [f"Skill folder does not exist: {skill_dir}"]
        if not resolved.is_dir():
            return [f"Skill path must be a folder: {skill_dir}"]

        skill_file = resolved / "SKILL.md"
        if not skill_file.exists():
            return [f"Skill folder must contain SKILL.md: {resolved}"]
        if not skill_file.is_file():
            return [f"SKILL.md must be a file: {skill_file}"]

        content = skill_file.read_text(encoding="utf-8")
        curated_errors = self.validate_not_curated_skill(resolved, content)
        if curated_errors:
            return curated_errors
        parsed = self.parse_frontmatter(content)
        if not parsed:
            return ["SKILL.md must start with YAML frontmatter delimited by ---"]

        frontmatter, body = parsed
        errors.extend(self.validate_frontmatter(frontmatter, resolved.name))
        errors.extend(self.validate_body(body, frontmatter, strict))
        errors.extend(self.validate_resource_dirs(resolved))

        if strict:
            errors.extend(self.validate_no_placeholders(content))

        return errors

    def validate_not_curated_skill(self, skill_dir, content):
        errors = []
        if self.is_curated_skill_path(skill_dir):
            errors.append("create-skill must not validate or modify curated Skills; use create-curated-skill instead")
        if re.search(r"^>\s*Curated from\s+\S.+$", content, re.MULTILINE):
            errors.append("Curated Skill format detected: > Curated from ...; use create-curated-skill instead")
        return errors

    def parse_frontmatter(self, content):
        match = re.match(r"^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$", content)
        if not match:
            return None

        frontmatter = {}
        current_object_key = None
        for raw_line in match.group(1).splitlines():
            line = raw_line.strip()
            if not line:
                continue
            if ":" not in line:
                frontmatter["__invalid"] = f"Invalid frontmatter line: {raw_line}"
                continue

            is_nested = raw_line[:1].isspace()
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()

            if is_nested:
                if not current_object_key or not isinstance(frontmatter.get(current_object_key), dict):
                    frontmatter["__invalid"] = f"Nested frontmatter field must belong to metadata: {raw_line}"
                    continue
                frontmatter[current_object_key][key] = value
                continue

            current_object_key = None
            if key == "metadata":
                if value:
                    frontmatter["__invalid"] = "metadata must be an object containing optional version/env fields"
                    continue
                frontmatter[key] = {}
                current_object_key = key
                continue

            frontmatter[key] = value

        return frontmatter, match.group(2)

    def validate_frontmatter(self, frontmatter, folder_name):
        errors = []

        if frontmatter.get("__invalid"):
            errors.append(frontmatter["__invalid"])

        for key in frontmatter:
            if key != "__invalid" and key not in ALLOWED_FRONTMATTER:
                errors.append(f"Unknown frontmatter field: {key}")

        for key in ("name", "description"):
            if not frontmatter.get(key):
                errors.append(f"Missing required frontmatter field: {key}")

        name = frontmatter.get("name")
        if name:
            if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", name):
                errors.append(f"name must use lowercase letters, digits, and hyphens: {name}")
            if name != folder_name:
                errors.append(f"Skill folder name must match frontmatter name: expected {name}")

        metadata = frontmatter.get("metadata")
        if metadata is not None:
            if not isinstance(metadata, dict):
                errors.append("metadata must be an object containing optional version/env fields")
            else:
                for key in metadata:
                    if key not in ALLOWED_METADATA:
                        errors.append(f"Unknown metadata field: {key}")

        return errors

    def validate_body(self, body, frontmatter, strict):
        errors = []
        name = frontmatter.get("name")

        if name and not re.search(rf"^##\s+{re.escape(self.title_case(name))}\s*$", body, re.MULTILINE):
            if not re.search(rf"^##\s+{re.escape(name)}\s*$", body, re.MULTILINE):
                errors.append(f"Missing required title section for Skill: ## {self.title_case(name)}")

        for section in ("Overview", "When To Invoke"):
            section_body = self.extract_section(body, section)
            if section_body is None:
                errors.append(f"Missing required section: ## {section}")
            elif strict and not section_body.strip():
                errors.append(f"Section must not be empty in strict mode: ## {section}")

        errors.extend(self.validate_upstream_skill(body))
        return errors

    def validate_upstream_skill(self, body):
        errors = []
        section = self.extract_section(body, "Upstream Skill")
        if section is None:
            return errors

        upstream_lines = [
            line.strip()
            for line in section.splitlines()
            if line.strip().startswith("- Upstream:")
        ]
        if not upstream_lines:
            errors.append("Upstream Skill section must contain: - Upstream: <Skill name or Skill bundle URL>")
            return errors

        for line in upstream_lines:
            value = line.split(":", 1)[1].strip()
            lowered = value.lower()
            if not value:
                errors.append("Upstream Skill value must not be empty")
                continue
            if "<" in value or ">" in value:
                continue
            if any(word in lowered for word in UPSTREAM_FORBIDDEN_WORDS):
                errors.append("Upstream Skill must reference another Skill, not documentation/API/module/page/reference material")
            if not self.looks_like_upstream_skill(value):
                errors.append("Upstream Skill must be a concrete Skill name or Skill bundle URL")

        return errors

    def validate_resource_dirs(self, skill_dir):
        errors = []
        for child in skill_dir.iterdir():
            if not child.is_dir():
                continue
            if child.name in DISALLOWED_RESOURCE_DIRS:
                errors.append(f"Resource directory must use plural form: {child.name}/")
            elif child.name not in ALLOWED_RESOURCE_DIRS:
                errors.append(f"Unknown resource directory: {child.name}/")
        return errors

    def validate_no_placeholders(self, content):
        errors = []
        for pattern in PLACEHOLDER_PATTERNS:
            if pattern.search(content):
                errors.append(f"Template placeholder remains: {pattern.pattern}")
        return errors

    def extract_section(self, body, section_name):
        heading = re.search(rf"^##\s+{re.escape(section_name)}(?:<[^>\n]+>)?\s*$", body, re.MULTILINE)
        if not heading:
            return None
        start = heading.end()
        rest = body[start:].lstrip("\r\n")
        next_heading = re.search(r"\n##\s+", rest)
        if next_heading:
            return rest[: next_heading.start()].strip()
        return rest.strip()

    def looks_like_upstream_skill(self, value):
        if re.match(r"^[a-z0-9][a-z0-9-]*(?::[a-z0-9][a-z0-9-]*)?$", value):
            return True
        if re.match(r"^https?://\S+/(skills|skill|codex|agents)/\S+", value, re.IGNORECASE):
            return True
        return False

    def title_case(self, skill_name):
        return " ".join(word.capitalize() for word in skill_name.split("-"))

    def is_curated_skill_path(self, path):
        parts = path.resolve().parts
        for curated_parts in CURATED_SKILL_PATH_PARTS:
            for index in range(0, len(parts) - len(curated_parts) + 1):
                if parts[index : index + len(curated_parts)] == curated_parts:
                    return True
        return False


def main():
    parser = argparse.ArgumentParser(description="Validate a Skill folder.")
    parser.add_argument("skill_dir", help="Path to the Skill folder")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Reject template placeholders and unfinished generated content",
    )
    args = parser.parse_args()

    validator = SkillValidator()
    errors = validator.validate(args.skill_dir, strict=args.strict)
    if errors:
        print("Skill validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    mode = "strict" if args.strict else "default"
    print(f"Skill is valid ({mode}): {args.skill_dir}")


if __name__ == "__main__":
    main()
