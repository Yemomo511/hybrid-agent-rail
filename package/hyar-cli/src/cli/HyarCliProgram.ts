import { cac } from 'cac';

import { runInitCommand } from '../parse';

/**
 * @description Hyar CLI 命令定义器。
 * 负责注册 `hyar init` 的命令、参数和入口动作，实际执行逻辑交给 parse 模块。
 */
export class HyarCliProgram {
  async run(argv: string[] = process.argv): Promise<void> {
    const cli = cac('hyar');

    cli
      .command('init', 'Inject Hyar project skills into the current project')
      .option('--agents <agents>', 'Comma-separated agent platforms')
      .option('--frameworks <frameworks>', 'Comma-separated frameworks')
      .option('--cwd <cwd>', 'Target project directory')
      .action(
        async (options: {
          agents?: string;
          cwd?: string;
          frameworks?: string;
        }) => {
          const result = await runInitCommand({
            ...options,
            interactive: !options.agents || !options.frameworks
          });

          if (!result.ok) {
            console.error(result.error.message);
            process.exitCode = 1;
            return;
          }

          console.log(
            `Injected ${result.skills.length} Hyar project skill(s).`
          );
          for (const target of result.plan.targets) {
            const shared = target.shared
              ? ` shared by ${target.agents.join(', ')}`
              : '';
            console.log(`- ${target.relativeRoot}${shared}`);
          }
        }
      );

    cli.help();
    cli.parse(argv, {
      run: false
    });
    await cli.runMatchedCommand();
  }
}
