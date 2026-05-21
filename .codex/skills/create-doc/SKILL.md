---
name: create-doc
description: Create governed documentation files for the Hybrid Agent Rail docs system. Use when adding or updating long-lived docs under docs/, synchronizing docs/KNOWLEDGE.md Source metadata, or validating docs against the repo documentation template.
---

# Create Doc

## Overview

Create long-lived documentation under `docs/<name>/doc.md` using the repo documentation contract. This skill keeps docs concise, indexable, and governed by requiring a template-backed document plus a synchronized `docs/KNOWLEDGE.md` Source entry.

## Workflow

1. Read `references/TEMPLATE.md` before drafting a new document.
2. Use `references/document-system-contract.md` as the good example when deciding what belongs in the document.
3. Create or update the target Markdown document at `docs/<name>/doc.md`.
4. Update `docs/KNOWLEDGE.md` under `## Source`; the document link must target `<name>/doc.md`.
5. Run `node .codex/skills/create-doc/validate.mjs docs/<name>/doc.md`.
6. Run `node .codex/skills/create-doc/validate-knowlegdge.mjs docs/<name>/doc.md`.
7. Fix all reported issues before considering the document complete.

## Document Rules

Every governed doc must keep the template's required frontmatter:

- `name`
- `description`
- `keywords`
- `doc_type`
- `source_path`

Every governed doc must keep the required body sections:

- `# <DocName>`
- `## Purpose`
- `## Applies To`
- `## Content`
- `## Update When`

Delete unused optional sections. Do not leave template placeholders such as `<knowledge-name>`, `<DocName>`, or `<-- ... -->` in completed docs.

Every governed doc must live at `docs/<name>/doc.md`, where `<name>` matches the document frontmatter `name`. Do not create governed docs as `docs/<name>.md`.

## Knowledge Source Rules

`docs/KNOWLEDGE.md` is an index, not a second copy of the document. Each Source item must contain only:

- document link
- `name`
- `description`
- `keywords`
- `doc_type`

The document link must use the directory format `<name>/doc.md`.

Do not include `source_path` in `docs/KNOWLEDGE.md`. `source_path` belongs only in each document's frontmatter.

## References

- `references/TEMPLATE.md`: copy this when creating a new docs document.
- `references/document-system-contract.md`: use this as the concrete good example for format and content weight.
