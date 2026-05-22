import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type {
  HyarAgentPlatform,
  HyarOutputSkill,
  HyarTargetPlan,
  HyarWritePlan
} from '../types';

const PLATFORM_ROOTS: Record<HyarAgentPlatform, string> = {
  antigravity: '.agents/skills',
  claude: '.claude/skills',
  codex: '.codex/skills',
  cursor: '.cursor/skills',
  trae: '.trae/skills'
};

const RESOURCE_DIRS = ['scripts', 'references', 'assets'] as const;

export interface EmitProjectSkillsOptions {
  agents: HyarAgentPlatform[];
  cwd: string;
  skills: HyarOutputSkill[];
}

export type EmitProjectSkillsResult =
  | {
      ok: true;
      plan: HyarWritePlan;
    }
  | {
      ok: false;
      error: Error;
      plan: HyarWritePlan;
      rollback: {
        failed: boolean;
        manualRecoveryPaths: string[];
        rollbackDir: string;
      };
    };

interface ReplacementTarget {
  backupDir: string;
  existed: boolean;
  sourceDir: string;
  targetDir: string;
}

interface FileSnapshot {
  content?: string;
  existed: boolean;
  path: string;
}

/**
 * @description 项目级 Skill 写入器。
 * 负责按 Agent 平台目录规则生成写入计划，并用 tmp/rollback 目录完成事务式替换。
 */
export class ProjectSkillEmitter {
  async emit(
    options: EmitProjectSkillsOptions
  ): Promise<EmitProjectSkillsResult> {
    const runId = this.createRunId();
    const targets = this.buildTargets(options.cwd, options.agents);
    const plan = await this.buildWritePlan(
      options.cwd,
      runId,
      targets,
      options.skills
    );
    const tmpRoot = join(options.cwd, '.hyar/tmp', runId);
    const rollbackRoot = join(options.cwd, '.hyar/rollback', runId);
    const replacements: ReplacementTarget[] = [];
    const gitignoreSnapshot = await this.readFileSnapshot(
      join(options.cwd, '.gitignore')
    );

    try {
      await this.ensureGitignore(options.cwd);
      await this.prepareTmpArtifacts(tmpRoot, targets, options.skills);
      await mkdir(rollbackRoot, { recursive: true });

      for (const target of targets) {
        for (const skill of options.skills) {
          const targetDir = join(target.root, skill.name);
          const backupDir = join(rollbackRoot, target.relativeRoot, skill.name);
          const sourceDir = join(tmpRoot, target.relativeRoot, skill.name);
          const existed = await this.exists(targetDir);

          replacements.push({
            backupDir,
            existed,
            sourceDir,
            targetDir
          });

          if (existed) {
            await mkdir(join(backupDir, '..'), { recursive: true });
            await cp(targetDir, backupDir, { recursive: true });
          }

          await rm(targetDir, { force: true, recursive: true });
          await mkdir(join(targetDir, '..'), { recursive: true });
          await cp(sourceDir, targetDir, { recursive: true });
        }
      }

      await rm(tmpRoot, { force: true, recursive: true });
      await rm(rollbackRoot, { force: true, recursive: true });

      return {
        ok: true,
        plan
      };
    } catch (error) {
      const rollback = await this.rollback(replacements, rollbackRoot);
      await this.restoreFileSnapshot(gitignoreSnapshot);
      await rm(tmpRoot, { force: true, recursive: true });

      return {
        error: error instanceof Error ? error : new Error(String(error)),
        ok: false,
        plan,
        rollback
      };
    }
  }

  private buildTargets(
    cwd: string,
    agents: HyarAgentPlatform[]
  ): HyarTargetPlan[] {
    const byRoot = new Map<string, HyarAgentPlatform[]>();
    for (const agent of agents) {
      const relativeRoot = PLATFORM_ROOTS[agent];
      const rootAgents = byRoot.get(relativeRoot) ?? [];
      rootAgents.push(agent);
      byRoot.set(relativeRoot, rootAgents);
    }

    return [...byRoot.entries()].map(([relativeRoot, rootAgents]) => ({
      agents: rootAgents,
      relativeRoot,
      root: join(cwd, relativeRoot),
      shared: rootAgents.length > 1
    }));
  }

  private async buildWritePlan(
    cwd: string,
    runId: string,
    targets: HyarTargetPlan[],
    skills: HyarOutputSkill[]
  ): Promise<HyarWritePlan> {
    const overwrites: string[] = [];
    for (const target of targets) {
      for (const skill of skills) {
        const targetDir = join(target.root, skill.name);
        if (await this.exists(targetDir)) {
          overwrites.push(targetDir);
        }
      }
    }

    return {
      overwrites: [...new Set(overwrites)].sort((left, right) =>
        relative(cwd, left).localeCompare(relative(cwd, right))
      ),
      runId,
      targets
    };
  }

  private async prepareTmpArtifacts(
    tmpRoot: string,
    targets: HyarTargetPlan[],
    skills: HyarOutputSkill[]
  ): Promise<void> {
    for (const target of targets) {
      for (const skill of skills) {
        const artifactDir = join(tmpRoot, target.relativeRoot, skill.name);
        await mkdir(artifactDir, { recursive: true });
        await writeFile(join(artifactDir, 'SKILL.md'), skill.content, 'utf8');

        for (const resourceDir of RESOURCE_DIRS) {
          const sourceResourceDir = join(skill.sourceDir, resourceDir);
          if (await this.exists(sourceResourceDir)) {
            await cp(sourceResourceDir, join(artifactDir, resourceDir), {
              filter: (source) =>
                !source.includes('node_modules') &&
                !source.endsWith('.tmp') &&
                !source.endsWith('.DS_Store'),
              recursive: true
            });
          }
        }
      }
    }
  }

  private async rollback(
    replacements: ReplacementTarget[],
    rollbackDir: string
  ): Promise<{
    failed: boolean;
    manualRecoveryPaths: string[];
    rollbackDir: string;
  }> {
    const manualRecoveryPaths: string[] = [];

    for (const replacement of replacements.reverse()) {
      try {
        await rm(replacement.targetDir, { force: true, recursive: true });
        if (replacement.existed) {
          await mkdir(join(replacement.targetDir, '..'), { recursive: true });
          await cp(replacement.backupDir, replacement.targetDir, {
            recursive: true
          });
        }
      } catch {
        manualRecoveryPaths.push(replacement.targetDir);
      }
    }

    if (manualRecoveryPaths.length === 0) {
      await rm(rollbackDir, { force: true, recursive: true });
    }

    return {
      failed: manualRecoveryPaths.length > 0,
      manualRecoveryPaths,
      rollbackDir
    };
  }

  private async ensureGitignore(cwd: string): Promise<void> {
    const gitignore = join(cwd, '.gitignore');
    const requiredRules = ['.hyar/tmp/', '.hyar/rollback/'];
    const current = (await this.exists(gitignore))
      ? await readFile(gitignore, 'utf8')
      : '';
    const lines = current
      .split('\n')
      .filter(
        (line, index, source) => !(index === source.length - 1 && line === '')
      );
    let changed = false;

    for (const rule of requiredRules) {
      if (!lines.includes(rule)) {
        lines.push(rule);
        changed = true;
      }
    }

    if (changed || !(await this.exists(gitignore))) {
      await writeFile(gitignore, `${lines.join('\n')}\n`, 'utf8');
    }
  }

  private async readFileSnapshot(path: string): Promise<FileSnapshot> {
    if (!(await this.exists(path))) {
      return {
        existed: false,
        path
      };
    }

    return {
      content: await readFile(path, 'utf8'),
      existed: true,
      path
    };
  }

  private async restoreFileSnapshot(snapshot: FileSnapshot): Promise<void> {
    if (!snapshot.existed) {
      await rm(snapshot.path, { force: true });
      return;
    }

    await writeFile(snapshot.path, snapshot.content ?? '', 'utf8');
  }

  private async exists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  private createRunId(): string {
    return new Date().toISOString().replace(/[:.]/gu, '-');
  }
}
