export interface HyarAdapterInfo {
  name: string;
  protocol: string;
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
