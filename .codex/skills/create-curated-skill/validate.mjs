#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';

const REQUIRED_META = ['name', 'description'];
const ALLOWED_META = new Set(['name', 'description', 'version', 'env']);
const PLACEHOLDER_PATTERNS = [
  /<Skill Name>/,
  /<Skill from>/,
  /<Skill Github Url/,
  /<Upstream Skill Url>/,
  /<简要描述发现时机>/,
  /<可选/,
  /<--/,
  /-->/,
];

class CuratedSkillValidator {
  /**
   * @description 校验 curated Skill 文件夹是否符合精选模板契约。
   */
  validate(inputPath) {
    const errors = [];
    const resolvedInputPath = resolve(process.cwd(), inputPath);
    const absolutePath = this.resolveSkillFile(resolvedInputPath);
    const repoRelativePath = relative(process.cwd(), absolutePath);

    if (!existsSync(absolutePath)) {
      return [`Curated Skill not found: ${inputPath}`];
    }

    if (!repoRelativePath.startsWith('skills/')) {
      errors.push(`Curated Skill must be under skills/: ${repoRelativePath}`);
    }

    if (basename(repoRelativePath) !== 'SKILL.md') {
      errors.push(`Curated Skill entrypoint must be SKILL.md: ${repoRelativePath}`);
    }

    const content = readFileSync(absolutePath, 'utf8');
    const parsed = this.parseFrontmatter(content);
    if (!parsed) {
      return ['Curated Skill must start with YAML frontmatter delimited by ---'];
    }

    const { frontmatter, body } = parsed;
    errors.push(...this.validateMeta(frontmatter, repoRelativePath));
    errors.push(...this.validateBody(body, frontmatter));
    errors.push(...this.validateNoPlaceholders(content));

    return errors;
  }

  /**
   * @description 兼容传入 Skill 文件夹或 SKILL.md 文件路径。
   */
  resolveSkillFile(inputPath) {
    if (!existsSync(inputPath)) {
      return inputPath;
    }

    if (statSync(inputPath).isDirectory()) {
      return resolve(inputPath, 'SKILL.md');
    }

    return inputPath;
  }

  /**
   * @description 解析轻量 YAML frontmatter。
   */
  parseFrontmatter(content) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
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
   * @description 校验 frontmatter 字段、命名和文件名一致性。
   */
  validateMeta(frontmatter, repoRelativePath) {
    const errors = [];

    if (frontmatter.__invalid) {
      errors.push(frontmatter.__invalid);
    }

    for (const key of Object.keys(frontmatter)) {
      if (key !== '__invalid' && !ALLOWED_META.has(key)) {
        errors.push(`Unknown frontmatter field: ${key}`);
      }
    }

    for (const key of REQUIRED_META) {
      if (!frontmatter[key]) {
        errors.push(`Missing required frontmatter field: ${key}`);
      }
    }

    if (frontmatter.name && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name)) {
      errors.push(`name must use lowercase letters, digits, and hyphens: ${frontmatter.name}`);
    }

    if (frontmatter.name) {
      const skillFolderName = basename(dirname(repoRelativePath));
      if (skillFolderName !== frontmatter.name) {
        errors.push(`Skill folder name must match frontmatter name: expected ${frontmatter.name}`);
      }
    }

    if (frontmatter.description && frontmatter.description.length < 30) {
      errors.push('description must explain the Skill and its trigger context');
    }

    return errors;
  }

  /**
   * @description 校验正文结构、必选 Source 和严格 How to use 模板。
   */
  validateBody(body, frontmatter) {
    const errors = [];
    const name = frontmatter.name;

    if (name && !new RegExp(`^##\\s+${this.escapeRegExp(name)}\\s*$`, 'm').test(body)) {
      errors.push(`Missing required title section: ## ${name}`);
    }

    if (!/^>\s+Curated from\s+\S.+$/m.test(body)) {
      errors.push('Missing curated source quote: > Curated from ...');
    }

    if (/^##\s+Source<可选>\s*$/m.test(body)) {
      errors.push('Source is required; use ## Source instead of ## Source<可选>');
    }

    if (!/^##\s+Source\s*$/m.test(body)) {
      errors.push('Missing required section: ## Source');
    }

    if (!/^##\s+How to use\s*$/m.test(body)) {
      errors.push('Missing required section: ## How to use');
    }

    const sourceUrl = this.extractSourceUrl(body);
    if (!sourceUrl) {
      errors.push('Source must contain: - Upstream: http(s)://...');
    }

    if (name && sourceUrl) {
      errors.push(...this.validateHowToUse(body, name, sourceUrl));
    }

    if (frontmatter.description && !body.includes(frontmatter.description)) {
      errors.push('Body must repeat or include the frontmatter description to avoid metadata drift');
    }

    return errors;
  }

  /**
   * @description 校验 How to use 只允许替换发现时机、URL 和 Skill Name。
   */
  validateHowToUse(body, name, sourceUrl) {
    const errors = [];
    const howToUse = this.extractSection(body, 'How to use');
    if (!howToUse) {
      return errors;
    }

    const pattern = new RegExp(
      [
        '^该 Skill 由 hyar 跨端框架精选, (.+)。若要运行包含原始资源、脚本和参考资料的完整上游工作流，请将上游 bundle 安装到当前活跃 Agent 的 skills 目录中：',
        '``` bash',
        '# 查看上游 README，确认准确路径',
        `open ${this.escapeRegExp(sourceUrl)}`,
        '```',
        `然后，让 Agent 通过该 skill 的名称（${this.escapeRegExp(name)}）来调用它，或使用该 skill frontmatter 中列出的任一触发短语来调用它。$`,
      ].join('\\n')
    );

    const match = howToUse.match(pattern);
    if (!match) {
      errors.push('How to use must match the curated template exactly; only discovery timing, URL, and Skill Name may change');
      return errors;
    }

    const discoveryTiming = match[1].trim();
    if (!discoveryTiming) {
      errors.push('How to use discovery timing summary must not be empty');
    }

    return errors;
  }

  /**
   * @description 校验模板占位符是否残留。
   */
  validateNoPlaceholders(content) {
    const errors = [];
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(content)) {
        errors.push(`Template placeholder remains: ${pattern}`);
      }
    }
    return errors;
  }

  extractSourceUrl(body) {
    const match = body.match(/^- Upstream:\s+(https?:\/\/\S+)\s*$/m);
    return match?.[1] ?? null;
  }

  extractSection(body, sectionName) {
    const headingPattern = new RegExp(`^##\\s+${this.escapeRegExp(sectionName)}\\s*$`, 'm');
    const headingMatch = body.match(headingPattern);
    if (!headingMatch || headingMatch.index === undefined) {
      return '';
    }

    const sectionStart = headingMatch.index + headingMatch[0].length;
    const afterHeading = body.slice(sectionStart).replace(/^\r?\n/, '');
    const nextHeadingMatch = afterHeading.match(/\n##\s+/);
    const sectionBody = nextHeadingMatch ? afterHeading.slice(0, nextHeadingMatch.index) : afterHeading;
    return sectionBody.trim();
  }

  escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

const printUsage = () => {
  console.error('Usage: node .codex/skills/create-curated-skill/validate.mjs skills/<category>/<skill-name>');
};

const main = () => {
  const filePath = process.argv[2];
  if (!filePath) {
    printUsage();
    process.exit(1);
  }

  const validator = new CuratedSkillValidator();
  const errors = validator.validate(filePath);

  if (errors.length > 0) {
    console.error('Curated Skill validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Curated Skill is valid: ${filePath}`);
};

main();
