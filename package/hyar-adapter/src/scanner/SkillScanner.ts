import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';

import type {
  HyarFramework,
  HyarScanError,
  HyarScanOptions,
  HyarScanResult,
  HyarSourceSkill
} from '../types';
import { parseYaml } from '../yaml';

const FRAMEWORK_DIRS = new Set<HyarFramework>([
  'react-native',
  'flutter',
  'kmp',
  'uniapp'
]);
const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface ParsedSkillFile {
  body: string;
  frontmatter: Record<string, unknown>;
}

/**
 * @description Hyar Skill 扫描器。
 * 负责从包内 `skills/` 中识别、过滤并基础校验项目级注入所需的 Skill。
 */
export class SkillScanner {
  constructor(private readonly resourceRoot: string) {}

  async scan(options: HyarScanOptions): Promise<HyarScanResult> {
    const candidates = await this.collectCandidateDirs(options.frameworks);
    const errors: HyarScanError[] = [];
    const skills: HyarSourceSkill[] = [];

    for (const candidate of candidates) {
      const skillFile = join(candidate, 'SKILL.md');
      const parsed = await this.parseSkillFile(skillFile, errors);
      if (!parsed) {
        continue;
      }

      const folderName = basename(candidate);
      const relativeDir = this.toRelative(candidate);
      const skillErrors = this.validateSkill(
        parsed.frontmatter,
        folderName,
        skillFile
      );
      skillErrors.push(
        ...this.validateMetadata(parsed.frontmatter.metadata, skillFile)
      );
      errors.push(...skillErrors);

      if (skillErrors.length === 0) {
        const metadata = this.normalizeMetadata(parsed.frontmatter.metadata);
        skills.push({
          body: parsed.body,
          description: String(parsed.frontmatter.description),
          folderName,
          metadata,
          name: String(parsed.frontmatter.name),
          relativeDir,
          skillFile
        });
      }
    }

    errors.push(...this.findDuplicateErrors(skills));

    if (errors.length > 0) {
      return {
        errors,
        ok: false
      };
    }

    if (skills.length === 0) {
      return {
        errors: [
          {
            code: 'no-skills-found',
            message: `No Hyar skills were found for selected frameworks: ${options.frameworks.join(', ')}`
          }
        ],
        ok: false
      };
    }

    return {
      ok: true,
      skills
    };
  }

  private async collectCandidateDirs(
    frameworks: HyarFramework[]
  ): Promise<string[]> {
    const dirs: string[] = [];
    const entries = await readdir(this.resourceRoot, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const entryPath = join(this.resourceRoot, entry.name);
      if (entry.name === 'share') {
        dirs.push(...(await this.collectDirectSkillDirs(entryPath)));
        continue;
      }

      if (FRAMEWORK_DIRS.has(entry.name as HyarFramework)) {
        if (frameworks.includes(entry.name as HyarFramework)) {
          dirs.push(...(await this.collectDirectSkillDirs(entryPath)));
        }
        continue;
      }

      if (await this.hasSkillFile(entryPath)) {
        dirs.push(entryPath);
      }
    }

    return dirs.sort((left, right) =>
      this.toRelative(left).localeCompare(this.toRelative(right))
    );
  }

  private async collectDirectSkillDirs(path: string): Promise<string[]> {
    try {
      const entries = await readdir(path, { withFileTypes: true });
      const dirs: string[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        const entryPath = join(path, entry.name);
        if (await this.hasSkillFile(entryPath)) {
          dirs.push(entryPath);
        }
      }

      return dirs;
    } catch {
      return [];
    }
  }

  private async hasSkillFile(path: string): Promise<boolean> {
    try {
      const skillStat = await stat(join(path, 'SKILL.md'));
      return skillStat.isFile();
    } catch {
      return false;
    }
  }

  private async parseSkillFile(
    path: string,
    errors: HyarScanError[]
  ): Promise<ParsedSkillFile | undefined> {
    const content = await readFile(path, 'utf8');
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/u.exec(content);

    if (!match) {
      errors.push({
        code: 'invalid-frontmatter',
        file: path,
        message: `Invalid frontmatter: ${this.toRelative(path)}`
      });
      return undefined;
    }

    try {
      const frontmatter = parseYaml(match[1] ?? '');
      if (
        !frontmatter ||
        typeof frontmatter !== 'object' ||
        Array.isArray(frontmatter)
      ) {
        throw new Error('frontmatter must be an object');
      }

      return {
        body: match[2] ?? '',
        frontmatter: frontmatter as Record<string, unknown>
      };
    } catch (error) {
      errors.push({
        code: 'invalid-frontmatter',
        file: path,
        message: `Invalid frontmatter in ${this.toRelative(path)}: ${error instanceof Error ? error.message : String(error)}`
      });
      return undefined;
    }
  }

  private validateSkill(
    frontmatter: Record<string, unknown>,
    folderName: string,
    skillFile: string
  ): HyarScanError[] {
    const errors: HyarScanError[] = [];
    const name = frontmatter.name;
    const description = frontmatter.description;

    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push({
        code: 'missing-name',
        file: skillFile,
        message: `Missing required field "name": ${this.toRelative(skillFile)}`
      });
    } else {
      if (!KEBAB_CASE_PATTERN.test(name)) {
        errors.push({
          code: 'invalid-name',
          file: skillFile,
          message: `Skill name must be lowercase kebab-case: ${name}`
        });
      }

      if (name !== folderName) {
        errors.push({
          code: 'folder-name-mismatch',
          file: skillFile,
          message: `Skill name "${name}" must match folder name "${folderName}".`
        });
      }
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push({
        code: 'missing-description',
        file: skillFile,
        message: `Missing required field "description": ${this.toRelative(skillFile)}`
      });
    }

    return errors;
  }

  private normalizeMetadata(metadata: unknown): {
    env?: string;
    version?: string;
  } {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return {};
    }

    const value = metadata as Record<string, unknown>;
    return {
      env: this.toSimpleString(value.env),
      version: this.toSimpleString(value.version)
    };
  }

  private validateMetadata(
    metadata: unknown,
    skillFile: string
  ): HyarScanError[] {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return [];
    }

    const errors: HyarScanError[] = [];
    const value = metadata as Record<string, unknown>;

    for (const key of ['version', 'env']) {
      if (
        value[key] !== undefined &&
        this.toSimpleString(value[key]) === undefined
      ) {
        errors.push({
          code: 'invalid-metadata',
          file: skillFile,
          message: `metadata.${key} must be a string, number, or boolean: ${this.toRelative(skillFile)}`
        });
      }
    }

    return errors;
  }

  private toSimpleString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (['string', 'number', 'boolean'].includes(typeof value)) {
      return String(value);
    }

    return undefined;
  }

  private findDuplicateErrors(skills: HyarSourceSkill[]): HyarScanError[] {
    const byName = new Map<string, HyarSourceSkill[]>();
    for (const skill of skills) {
      const sameNameSkills = byName.get(skill.name) ?? [];
      sameNameSkills.push(skill);
      byName.set(skill.name, sameNameSkills);
    }

    return [...byName.entries()]
      .filter(([, sameNameSkills]) => sameNameSkills.length > 1)
      .map(([name, sameNameSkills]) => ({
        code: 'duplicate-skill-name',
        files: sameNameSkills.map((skill) => skill.skillFile),
        message: `Duplicate skill name: ${name}`,
        name
      }));
  }

  private toRelative(path: string): string {
    return relative(this.resourceRoot, path).split('\\').join('/');
  }
}
