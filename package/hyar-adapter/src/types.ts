export type HyarAgentPlatform =
  | 'codex'
  | 'claude'
  | 'cursor'
  | 'trae'
  | 'antigravity';

export type HyarFramework = 'react-native' | 'flutter' | 'kmp' | 'uniapp';

export interface HyarSkillMetadata {
  version?: string;
  env?: string;
}

export interface HyarSourceSkill {
  name: string;
  description: string;
  metadata: HyarSkillMetadata;
  folderName: string;
  relativeDir: string;
  skillFile: string;
  body: string;
}

export interface HyarOutputSkill {
  name: string;
  content: string;
  sourceDir: string;
}

export interface HyarScanOptions {
  frameworks: HyarFramework[];
}

export interface HyarScanError {
  code:
    | 'duplicate-skill-name'
    | 'folder-name-mismatch'
    | 'invalid-frontmatter'
    | 'invalid-metadata'
    | 'invalid-name'
    | 'missing-description'
    | 'missing-name'
    | 'no-skills-found'
    | 'resource-root-missing';
  file?: string;
  files?: string[];
  message: string;
  name?: string;
}

export type HyarScanResult =
  | {
      ok: true;
      skills: HyarSourceSkill[];
    }
  | {
      ok: false;
      errors: HyarScanError[];
    };

export interface HyarTargetPlan {
  agents: HyarAgentPlatform[];
  relativeRoot: string;
  root: string;
  shared: boolean;
}

export interface HyarWritePlan {
  overwrites: string[];
  runId: string;
  targets: HyarTargetPlan[];
}

export interface HyarInjectOptions {
  agents: HyarAgentPlatform[];
  cwd: string;
  frameworks: HyarFramework[];
}

export type HyarInjectResult =
  | {
      ok: true;
      agents: {
        scanned: number;
        supported: false;
        reason: 'agent-protocol-not-designed';
      };
      plan: HyarWritePlan;
      skills: HyarOutputSkill[];
      warnings: string[];
    }
  | {
      ok: false;
      error: Error;
      rollback?: {
        failed: boolean;
        manualRecoveryPaths: string[];
        rollbackDir: string;
      };
      warnings: string[];
    };

export interface HyarAdapterServiceOptions {
  resourceRoot?: string;
}

export const HYAR_AGENT_PLATFORMS = [
  'codex',
  'claude',
  'cursor',
  'trae',
  'antigravity'
] as const;

export const HYAR_FRAMEWORKS = [
  'react-native',
  'flutter',
  'kmp',
  'uniapp'
] as const;
