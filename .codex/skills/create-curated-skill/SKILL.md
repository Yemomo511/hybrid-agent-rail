---
name: create-curated-skill
description: Create curated Hybrid Agent Rail Skill folders from an upstream Skill. Use when selecting an external Skill into skills/<category>/<name>/SKILL.md, copying the curated template/example, enforcing required Source metadata, or validating the strict How to use format.
---

# Create Curated Skill

## Overview

Create a curated Skill folder under `skills/` from an upstream Skill. Each curated Skill must be a folder named after the Skill and contain a `SKILL.md`. This Skill keeps the curated format stable by requiring an upstream Source, a strict How to use block, and validation before the folder is considered complete.

## Workflow

1. Read `references/curated-skill-template.md` before drafting the curated Skill.
2. Use `references/curated-skill-example.md` as the good example for final shape.
3. Create or update `skills/<category>/<skill-name>/SKILL.md`.
4. Fill only these How to use variables:
   - discovery timing summary
   - upstream URL
   - Skill name
5. Run `node .codex/skills/create-curated-skill/validate.mjs skills/<category>/<skill-name>`.
6. Fix every reported issue before considering the curated Skill complete.

## Curated Skill Contract

Every curated Skill must keep:

- folder name equal to the Skill name
- `SKILL.md` as the only required Markdown entrypoint inside the folder
- frontmatter with `name` and `description`
- optional `metadata.version` and `metadata.env` only when they add useful compatibility context
- `## <skill-name>`
- `> Curated from ...`
- `## Source`
- `- Upstream: <http(s) URL>`
- `## How to use`

The `## Source` section is required. Do not write `## Source<可选>` in curated outputs.

The How to use section must follow the template wording exactly. Only replace the discovery timing summary, upstream URL, and Skill name. Do not add extra sentences, commands, bullets, or alternate installation instructions inside that section.

## References

- `references/curated-skill-template.md`: copy this shape into `SKILL.md` when creating a curated Skill folder.
- `references/curated-skill-example.md`: use this as the concrete good example.
