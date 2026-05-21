#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const KNOWLEDGE_PATH = 'docs/KNOWLEDGE.md';
const REQUIRED_META = ['name', 'description', 'keywords', 'doc_type'];
const ALLOWED_META = new Set(REQUIRED_META);
const DOCUMENT_PATH_PATTERN = /^docs\/([^/]+)\/doc\.md$/;
const SOURCE_LINK_PATTERN = /^([^/]+)\/doc\.md$/;

class KnowledgeValidator {
  /**
   * @description 校验 Knowledge Source 是否只记录文档 meta 信息。
   */
  validate(documentPath) {
    const errors = [];
    const knowledgeAbsolutePath = resolve(process.cwd(), KNOWLEDGE_PATH);

    if (!existsSync(knowledgeAbsolutePath)) {
      return [`Knowledge file not found: ${KNOWLEDGE_PATH}`];
    }

    const knowledgeContent = readFileSync(knowledgeAbsolutePath, 'utf8');
    const sourceContent = this.extractSource(knowledgeContent);
    if (sourceContent === null) {
      return [`Knowledge file must contain ## Source: ${KNOWLEDGE_PATH}`];
    }

    const entries = this.parseEntries(sourceContent);
    errors.push(...this.validateEntries(entries));

    if (documentPath) {
      const documentMeta = this.readDocumentMeta(documentPath);
      if (documentMeta.errors.length > 0) {
        errors.push(...documentMeta.errors);
      } else if (!this.hasMatchingEntry(entries, documentMeta.meta, documentMeta.expectedLinkTarget)) {
        errors.push(`Knowledge Source missing meta for document: ${documentPath}`);
      }
    }

    return errors;
  }

  /**
   * @description 提取 ## Source 章节内容。
   */
  extractSource(content) {
    const lines = content.split(/\r?\n/);
    const sourceIndex = lines.findIndex((line) => line.trim() === '## Source');
    if (sourceIndex === -1) {
      return null;
    }

    const sourceLines = [];
    for (let index = sourceIndex + 1; index < lines.length; index += 1) {
      if (/^##\s+/.test(lines[index])) {
        break;
      }
      sourceLines.push(lines[index]);
    }

    return sourceLines.join('\n').trim();
  }

  /**
   * @description 解析 Source 条目。
   */
  parseEntries(sourceContent) {
    const entries = [];
    let currentEntry = null;

    for (const rawLine of sourceContent.split(/\r?\n/)) {
      const line = rawLine.trimEnd();
      if (!line.trim()) {
        continue;
      }

      if (line.startsWith('- ')) {
        const linkMatch = line.match(/^- \[[^\]]+\]\(([^)]+)\)$/);
        currentEntry = {
          link: line,
          linkTarget: linkMatch ? linkMatch[1].trim() : null,
          meta: {},
          extraLines: [],
        };
        entries.push(currentEntry);
        continue;
      }

      if (!currentEntry) {
        entries.push({
          link: null,
          meta: {},
          extraLines: [line],
        });
        continue;
      }

      const metaMatch = line.match(/^\s+-\s+([^:]+):\s*(.*)$/);
      if (!metaMatch) {
        currentEntry.extraLines.push(line);
        continue;
      }

      const key = metaMatch[1].trim();
      const value = metaMatch[2].trim();
      currentEntry.meta[key] = value;
    }

    return entries;
  }

  /**
   * @description 校验 Source 条目仅包含允许的 meta。
   */
  validateEntries(entries) {
    const errors = [];

    for (const [index, entry] of entries.entries()) {
      const label = `Source entry ${index + 1}`;

      if (!entry.link || !/^- \[[^\]]+\]\([^)]+\)$/.test(entry.link)) {
        errors.push(`${label} must start with a Markdown link item`);
      } else if (!SOURCE_LINK_PATTERN.test(entry.linkTarget ?? '')) {
        errors.push(`${label} link target must match <name>/doc.md: ${entry.linkTarget}`);
      }

      for (const line of entry.extraLines) {
        errors.push(`${label} contains non-meta content: ${line.trim()}`);
      }

      for (const key of Object.keys(entry.meta)) {
        if (key === 'source_path') {
          errors.push(`${label} must not include source_path`);
        } else if (!ALLOWED_META.has(key)) {
          errors.push(`${label} contains unsupported meta field: ${key}`);
        }
      }

      for (const key of REQUIRED_META) {
        if (!entry.meta[key]) {
          errors.push(`${label} missing meta field: ${key}`);
        }
      }
    }

    return errors;
  }

  /**
   * @description 读取目标文档 frontmatter 中需要同步到 Knowledge 的 meta。
   */
  readDocumentMeta(documentPath) {
    const absolutePath = resolve(process.cwd(), documentPath);
    const repoRelativePath = relative(process.cwd(), absolutePath).split('\\').join('/');
    const pathMatch = repoRelativePath.match(DOCUMENT_PATH_PATTERN);
    const pathErrors = [];

    if (!pathMatch) {
      pathErrors.push(`Document path must match docs/<name>/doc.md: ${repoRelativePath}`);
    }

    if (!existsSync(absolutePath)) {
      return {
        errors: [...pathErrors, `Document not found: ${documentPath}`],
        meta: {},
        expectedLinkTarget: null,
      };
    }

    const content = readFileSync(absolutePath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      return {
        errors: [...pathErrors, `Document must contain frontmatter: ${documentPath}`],
        meta: {},
        expectedLinkTarget: pathMatch ? `${pathMatch[1]}/doc.md` : null,
      };
    }

    const meta = {};
    for (const rawLine of match[1].split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) {
        continue;
      }
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      if (ALLOWED_META.has(key)) {
        meta[key] = value;
      }
    }

    const errors = [];
    for (const key of REQUIRED_META) {
      if (!meta[key]) {
        errors.push(`Document missing frontmatter field for Knowledge Source: ${key}`);
      }
    }

    if (pathMatch && meta.name && pathMatch[1] !== meta.name) {
      errors.push(`Document directory name must match frontmatter name: ${pathMatch[1]} !== ${meta.name}`);
    }

    return {
      errors: [...pathErrors, ...errors],
      meta,
      expectedLinkTarget: pathMatch ? `${pathMatch[1]}/doc.md` : null,
    };
  }

  /**
   * @description 判断 Knowledge Source 是否存在完全匹配的 meta 条目。
   */
  hasMatchingEntry(entries, meta, expectedLinkTarget) {
    return entries.some(
      (entry) =>
        entry.linkTarget === expectedLinkTarget && REQUIRED_META.every((key) => entry.meta[key] === meta[key]),
    );
  }
}

const main = () => {
  const documentPath = process.argv[2];
  const validator = new KnowledgeValidator();
  const errors = validator.validate(documentPath);

  if (errors.length > 0) {
    console.error('Knowledge validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(documentPath ? `Knowledge is synchronized: ${documentPath}` : 'Knowledge is valid');
};

main();
