import { dirname } from 'node:path';

import type { HyarOutputSkill, HyarSourceSkill } from '../types';
import { stringifyYaml } from '../yaml';

interface RequirementLine {
  key: '版本要求' | '环境要求';
  value: string;
}

/**
 * @description 跨平台 Skill 协调器。
 * 负责将 Hyar 源 Skill 转换成各 Agent 平台共享的最低公共 Skill 结构。
 */
export class SkillCoordinator {
  coordinate(skills: HyarSourceSkill[]): HyarOutputSkill[] {
    return skills.map((skill) => {
      const requirements = this.getRequirementLines(skill);
      const description = this.appendRequirementToDescription(
        skill.description,
        requirements
      );
      const frontmatter = this.buildFrontmatter(skill, description);
      const body = this.applyPreRequirementSection(skill.body, requirements);

      return {
        content: `---\n${frontmatter}---\n\n${body.trimStart()}`,
        name: skill.name,
        sourceDir: dirname(skill.skillFile)
      };
    });
  }

  private getRequirementLines(skill: HyarSourceSkill): RequirementLine[] {
    const requirements: RequirementLine[] = [];
    if (skill.metadata.version) {
      requirements.push({
        key: '版本要求',
        value: skill.metadata.version
      });
    }

    if (skill.metadata.env) {
      requirements.push({
        key: '环境要求',
        value: skill.metadata.env
      });
    }

    return requirements;
  }

  private appendRequirementToDescription(
    description: string,
    requirements: RequirementLine[]
  ): string {
    const suffix = requirements
      .map((requirement) => `${requirement.key}: ${requirement.value}。`)
      .join('');
    return `${description}${suffix ? ` ${suffix}` : ''}`;
  }

  private buildFrontmatter(
    skill: HyarSourceSkill,
    description: string
  ): string {
    const frontmatter: Record<string, unknown> = {
      description,
      name: skill.name
    };

    const metadata: Record<string, string> = {};
    if (skill.metadata.version) {
      metadata.version = skill.metadata.version;
    }
    if (skill.metadata.env) {
      metadata.env = skill.metadata.env;
    }
    if (Object.keys(metadata).length > 0) {
      frontmatter.metadata = metadata;
    }

    return stringifyYaml(frontmatter, {
      lineWidth: 0,
      sortMapEntries: true
    });
  }

  private applyPreRequirementSection(
    body: string,
    requirements: RequirementLine[]
  ): string {
    if (requirements.length === 0) {
      return body;
    }

    const heading = '## Pre Requirement(必读)';
    const headingPattern = new RegExp(
      `^${this.escapeRegExp(heading)}\\s*$`,
      'mu'
    );
    const match = headingPattern.exec(body);

    if (!match) {
      const section = [
        heading,
        '当要求不符合时，禁止使用该 Skill。',
        ...requirements.map(
          (requirement) => `- ${requirement.key}: ${requirement.value}`
        ),
        ''
      ].join('\n');

      return `${section}\n${body.trimStart()}`;
    }

    const headingEnd = match.index + (match[0] ?? '').length;
    const sectionBodyStart = body.indexOf('\n', headingEnd) + 1;
    const nextHeadingMatch = /^##\s/mu.exec(body.slice(sectionBodyStart));
    const sectionBodyEnd = nextHeadingMatch
      ? sectionBodyStart + nextHeadingMatch.index
      : body.length;
    const nextSectionBody = this.upsertRequirementLines(
      body.slice(sectionBodyStart, sectionBodyEnd),
      requirements
    );

    return `${body.slice(0, sectionBodyStart)}${nextSectionBody}${body.slice(sectionBodyEnd)}`;
  }

  private upsertRequirementLines(
    sectionBody: string,
    requirements: RequirementLine[]
  ): string {
    const lines = sectionBody.replace(/\s+$/u, '').split('\n');
    const nextLines = lines.filter((line) => {
      return !requirements.some((requirement) =>
        line.trim().startsWith(`- ${requirement.key}:`)
      );
    });

    for (const requirement of requirements) {
      nextLines.push(`- ${requirement.key}: ${requirement.value}`);
    }

    return `${nextLines.join('\n')}\n\n`;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  }
}
