import { stat } from 'node:fs/promises';

import { SkillCoordinator } from './coordinator';
import { ProjectSkillEmitter } from './emitter';
import { ResourceLocator } from './resource';
import { SkillScanner } from './scanner';
import type {
  HyarAdapterServiceOptions,
  HyarInjectOptions,
  HyarInjectResult,
  HyarOutputSkill,
  HyarScanOptions,
  HyarScanResult,
  HyarSourceSkill
} from './types';

/**
 * @description Hyar Adapter 编排服务。
 * 负责组合资源定位、Skill 扫描、公共格式转换和项目级写入事务。
 */
export class HyarAdapterService {
  constructor(private readonly options: HyarAdapterServiceOptions = {}) {}

  async scanSkills(options: HyarScanOptions): Promise<HyarScanResult> {
    try {
      const resourceRoot = await this.locateResourceRoot();
      return new SkillScanner(resourceRoot).scan(options);
    } catch (error) {
      return {
        errors: [
          {
            code: 'resource-root-missing',
            message: error instanceof Error ? error.message : String(error)
          }
        ],
        ok: false
      };
    }
  }

  coordinateSkills(skills: HyarSourceSkill[]): HyarOutputSkill[] {
    return new SkillCoordinator().coordinate(skills);
  }

  async injectProjectSkills(
    options: HyarInjectOptions
  ): Promise<HyarInjectResult> {
    const warnings = await this.getAgentResourceWarnings();
    const cwdStat = await stat(options.cwd);
    if (!cwdStat.isDirectory()) {
      return {
        error: new Error(`Target cwd is not a directory: ${options.cwd}`),
        ok: false,
        warnings
      };
    }

    const scanResult = await this.scanSkills({
      frameworks: options.frameworks
    });
    if (!scanResult.ok) {
      return {
        error: new Error(
          `Skill scan failed. No files were written.\n${scanResult.errors.map((item) => item.message).join('\n')}`
        ),
        ok: false,
        warnings
      };
    }

    const skills = this.coordinateSkills(scanResult.skills);
    const emitResult = await new ProjectSkillEmitter().emit({
      agents: options.agents,
      cwd: options.cwd,
      skills
    });

    if (!emitResult.ok) {
      return {
        error: emitResult.error,
        ok: false,
        rollback: emitResult.rollback,
        warnings
      };
    }

    return {
      agents: {
        reason: 'agent-protocol-not-designed',
        scanned: 0,
        supported: false
      },
      ok: true,
      plan: emitResult.plan,
      skills,
      warnings
    };
  }

  private async locateResourceRoot(): Promise<string> {
    return new ResourceLocator(this.options.resourceRoot).locateSkillsRoot();
  }

  private async getAgentResourceWarnings(): Promise<string[]> {
    return [];
  }
}
