#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const DOC_TYPES = new Set([
  'knowledge',
  'contract',
  'decision',
  'usage',
  'workflow',
  'experience',
  'index',
]);

const REQUIRED_META = ['name', 'description', 'keywords', 'doc_type', 'source_path'];
const REQUIRED_SECTIONS = ['Purpose', 'Applies To', 'Content', 'Update When'];
const PLACEHOLDER_PATTERNS = [
  /<knowledge-name>/,
  /<knowledge-description>/,
  /<keywords-phrase>/,
  /<relative-source-path>/,
  /<DocName>/,
  /<--/,
  /-->/,
];

class DocumentValidator {
  /**
   * @description 校验 docs 文档是否符合模板契约。
   */
  validate(filePath) {
    const errors = [];
    const absolutePath = resolve(process.cwd(), filePath);
    const repoRelativePath = relative(process.cwd(), absolutePath);

    if (!repoRelativePath.startsWith('docs/')) {
      errors.push(`Document must be under docs/: ${repoRelativePath}`);
    }

    if (!existsSync(absolutePath)) {
      return [`Document not found: ${filePath}`];
    }

    if (!filePath.endsWith('.md')) {
      errors.push(`Document must be a Markdown file: ${filePath}`);
    }

    const content = readFileSync(absolutePath, 'utf8');
    const parsed = this.parseFrontmatter(content);
    if (!parsed) {
      return ['Document must start with YAML frontmatter delimited by ---'];
    }

    const { frontmatter, body } = parsed;
    errors.push(...this.validateMeta(frontmatter));
    errors.push(...this.validateBody(body));

    return errors;
  }

  /**
   * @description 解析轻量 YAML frontmatter。
   */
  parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) {
      return null;
    }

    const frontmatter = {};
    for (const rawLine of match[1].split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) {
        frontmatter.__invalid = `Invalid frontmatter line: ${rawLine}`;
        continue;
      }
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      frontmatter[key] = value;
    }

    return {
      frontmatter,
      body: match[2],
    };
  }

  /**
   * @description 校验文档元信息字段。
   */
  validateMeta(frontmatter) {
    const errors = [];

    if (frontmatter.__invalid) {
      errors.push(frontmatter.__invalid);
    }

    for (const key of REQUIRED_META) {
      if (!frontmatter[key]) {
        errors.push(`Missing required frontmatter field: ${key}`);
      }
    }

    if (frontmatter.doc_type && !DOC_TYPES.has(frontmatter.doc_type)) {
      errors.push(`Invalid doc_type: ${frontmatter.doc_type}`);
    }

    if (frontmatter.description && frontmatter.description.length > 100) {
      errors.push('description must not exceed 100 characters');
    }

    return errors;
  }

  /**
   * @description 校验正文标题、必需章节和模板占位符。
   */
  validateBody(body) {
    const errors = [];

    if (!/^#\s+\S.+$/m.test(body)) {
      errors.push('Missing document title heading: # <DocName>');
    }

    for (const section of REQUIRED_SECTIONS) {
      const sectionPattern = new RegExp(`^##\\s+${this.escapeRegExp(section)}\\s*$`, 'm');
      if (!sectionPattern.test(body)) {
        errors.push(`Missing required section: ## ${section}`);
      }
    }

    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(body)) {
        errors.push(`Template placeholder remains: ${pattern}`);
      }
    }

    return errors;
  }

  escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

const printUsage = () => {
  console.error('Usage: node .codex/skills/create-doc/validate.mjs docs/<document>.md');
};

const main = () => {
  const filePath = process.argv[2];
  if (!filePath) {
    printUsage();
    process.exit(1);
  }

  const validator = new DocumentValidator();
  const errors = validator.validate(filePath);

  if (errors.length > 0) {
    console.error('Document validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Document is valid: ${filePath}`);
};

main();
