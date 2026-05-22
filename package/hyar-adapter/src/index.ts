export { HyarAdapterService } from './HyarAdapterService';
export type {
  HyarAgentPlatform,
  HyarAdapterServiceOptions,
  HyarFramework,
  HyarInjectOptions,
  HyarInjectResult,
  HyarOutputSkill,
  HyarScanError,
  HyarScanOptions,
  HyarScanResult,
  HyarSourceSkill,
  HyarTargetPlan,
  HyarWritePlan
} from './types';
export { HYAR_AGENT_PLATFORMS, HYAR_FRAMEWORKS } from './types';

export interface HyarAdapterInfo {
  name: string;
  protocol: string;
}

export interface HyarAdapterPackageTestResult {
  packageName: string;
  format: string;
  ok: boolean;
}

/**
 * @description Hybrid Agent Rail 适配器。
 * 负责描述 CLI 与具体 Agent Harness 运行环境之间的最小适配信息。
 */
export class HyarAdapter {
  constructor(private readonly protocol: string = 'workspace') {}

  getInfo(): HyarAdapterInfo {
    return {
      name: 'hyar-adapter',
      protocol: this.protocol
    };
  }
}

export const createAdapter = (protocol?: string): HyarAdapter => {
  return new HyarAdapter(protocol);
};

export const runAdapterPackageTestApi = (): HyarAdapterPackageTestResult => {
  return {
    packageName: 'hyar-adapter',
    format: 'rollup',
    ok: true
  };
};
