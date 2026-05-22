import {
  confirm,
  intro,
  isCancel,
  multiselect,
  note,
  outro
} from '@clack/prompts';
import { access, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  HYAR_AGENT_PLATFORMS,
  HYAR_FRAMEWORKS,
  HyarAdapterService
} from 'hyar-adapter';
import type {
  HyarAgentPlatform,
  HyarFramework,
  HyarInjectResult
} from 'hyar-adapter';

const execFileAsync = promisify(execFile);

export interface InitCommandOptions {
  agents?: string;
  cwd?: string;
  frameworks?: string;
  interactive?: boolean;
  resourceRoot?: string;
}

export type InitCommandResult = HyarInjectResult;

interface InitSelection {
  agents: HyarAgentPlatform[];
  cwd: string;
  frameworks: HyarFramework[];
}

const AGENT_LABELS: Record<HyarAgentPlatform, string> = {
  antigravity: 'AntiGravity',
  claude: 'Claude Code',
  codex: 'Codex',
  cursor: 'Cursor',
  trae: 'Trae'
};

const FRAMEWORK_LABELS: Record<HyarFramework, string> = {
  flutter: 'Flutter',
  kmp: 'Kotlin Multiplatform(KMP)',
  'react-native': 'React Native',
  uniapp: 'UniApp'
};

/**
 * @description `hyar init` 命令执行器。
 * 负责解析交互/非交互配置、探测平台状态，并调用 Adapter 完成项目级 Skill 注入。
 */
export class InitCommandRunner {
  async run(options: InitCommandOptions): Promise<InitCommandResult> {
    try {
      const interactive =
        options.interactive ?? (!options.agents || !options.frameworks);
      const selection = interactive
        ? await this.collectInteractiveSelection(options)
        : this.parseNonInteractiveSelection(options);
      const cwdWarning = await this.getCwdWarning(selection.cwd);
      const platformWarnings = await this.getPlatformWarnings(selection.agents);
      const warnings = [...cwdWarning, ...platformWarnings];

      for (const warning of warnings) {
        console.warn(`Warning: ${warning}`);
      }

      const service = new HyarAdapterService({
        resourceRoot: options.resourceRoot
      });
      const result = await service.injectProjectSkills(selection);

      return result.ok
        ? {
            ...result,
            warnings: [...warnings, ...result.warnings]
          }
        : {
            ...result,
            warnings: [...warnings, ...result.warnings]
          };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error(String(error)),
        ok: false,
        warnings: []
      };
    }
  }

  private parseNonInteractiveSelection(
    options: InitCommandOptions
  ): InitSelection {
    if (!options.agents) {
      throw new Error('--agents must include at least one agent platform.');
    }
    if (!options.frameworks) {
      throw new Error('--frameworks must include at least one framework.');
    }

    const agents = this.parseList(
      options.agents,
      [...HYAR_AGENT_PLATFORMS],
      '--agents'
    );
    const frameworks = this.parseList(
      options.frameworks,
      [...HYAR_FRAMEWORKS],
      '--frameworks'
    );
    const cwd = resolve(options.cwd ?? process.cwd());

    if (agents.length === 0) {
      throw new Error('--agents must include at least one agent platform.');
    }
    if (frameworks.length === 0) {
      throw new Error('--frameworks must include at least one framework.');
    }

    return {
      agents,
      cwd,
      frameworks
    };
  }

  private async collectInteractiveSelection(
    options: InitCommandOptions
  ): Promise<InitSelection> {
    const cwd = resolve(options.cwd ?? process.cwd());
    intro('hyar init');

    const agents = await multiselect({
      message: 'Select Agent platforms',
      options: HYAR_AGENT_PLATFORMS.map((agent) => ({
        label: AGENT_LABELS[agent],
        value: agent
      })),
      required: true
    });
    if (isCancel(agents)) {
      throw new Error('hyar init cancelled.');
    }

    const frameworks = await multiselect({
      message: 'Select frameworks',
      options: HYAR_FRAMEWORKS.map((framework) => ({
        label: FRAMEWORK_LABELS[framework],
        value: framework
      })),
      required: true
    });
    if (isCancel(frameworks)) {
      throw new Error('hyar init cancelled.');
    }

    const platformWarnings = await this.getPlatformWarnings(agents);
    if (platformWarnings.length > 0) {
      note(
        platformWarnings.map((warning) => `- ${warning}`).join('\n'),
        'Warning'
      );
    }

    const shouldWrite = await confirm({
      initialValue: false,
      message: `Write Hyar project skills into ${cwd}?`
    });
    if (isCancel(shouldWrite) || !shouldWrite) {
      throw new Error('hyar init cancelled.');
    }

    outro('Writing project skills...');

    return {
      agents,
      cwd,
      frameworks
    };
  }

  private parseList<T extends string>(
    value: string,
    allowed: T[],
    flag: string
  ): T[] {
    const values = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const invalid = values.filter((item) => !allowed.includes(item as T));
    if (invalid.length > 0) {
      throw new Error(
        `${flag} contains invalid value(s): ${invalid.join(', ')}`
      );
    }

    return values as T[];
  }

  private async getCwdWarning(cwd: string): Promise<string[]> {
    try {
      const cwdStat = await stat(cwd);
      if (!cwdStat.isDirectory()) {
        throw new Error('not directory');
      }
    } catch {
      throw new Error(`--cwd does not exist or is not a directory: ${cwd}`);
    }

    try {
      await access(resolve(cwd, '.git'));
      return [];
    } catch {
      return [
        `${cwd} is not a git repository. Hyar will still write project skills.`
      ];
    }
  }

  private async getPlatformWarnings(
    agents: HyarAgentPlatform[]
  ): Promise<string[]> {
    const warnings: string[] = [];
    const detected = await Promise.all(
      agents.map(
        async (agent) => [agent, await this.isAgentDetected(agent)] as const
      )
    );

    for (const [agent, isDetected] of detected) {
      if (!isDetected) {
        warnings.push(
          `${AGENT_LABELS[agent]} was not detected on this machine. Hyar will still write ${this.getAgentRoot(agent)} for project sharing, but local verification is unavailable.`
        );
      }
    }

    return warnings;
  }

  private async isAgentDetected(agent: HyarAgentPlatform): Promise<boolean> {
    const commands: Partial<Record<HyarAgentPlatform, string[]>> = {
      antigravity: ['antigravity'],
      claude: ['claude'],
      codex: ['codex'],
      cursor: ['cursor'],
      trae: ['trae']
    };
    const command = commands[agent];
    if (!command) {
      return false;
    }

    try {
      await execFileAsync('which', command);
      return true;
    } catch {
      return false;
    }
  }

  private getAgentRoot(agent: HyarAgentPlatform): string {
    if (agent === 'codex' || agent === 'antigravity') {
      return '.agents/skills';
    }
    return `.${agent}/skills`;
  }
}

export const runInitCommand = async (
  options: InitCommandOptions
): Promise<InitCommandResult> => {
  return new InitCommandRunner().run(options);
};
