import { createAdapter, type HyarAdapterInfo } from 'hyar-adapter';

export interface HyarCliRuntime {
  name: string;
  adapter: HyarAdapterInfo;
}

/**
 * @description Hybrid Agent Rail CLI 运行时描述器。
 * 负责组合 CLI 包与下游 adapter 包，给 example 或真实命令入口提供统一运行时信息。
 */
export class HyarCli {
  getRuntime(): HyarCliRuntime {
    const adapter = createAdapter();

    return {
      name: 'hyar-cli',
      adapter: adapter.getInfo()
    };
  }
}

export const describeCliRuntime = (): HyarCliRuntime => {
  return new HyarCli().getRuntime();
};
