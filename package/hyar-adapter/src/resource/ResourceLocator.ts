import { access, readdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @description Hyar 包内置资源定位器。
 * 负责在 npm 包运行态优先定位 `dist/skills`，并在开发仓库运行态回退到仓库根 `skills/`。
 */
export class ResourceLocator {
  constructor(private readonly overrideRoot?: string) {}

  async locateSkillsRoot(): Promise<string> {
    if (this.overrideRoot) {
      await this.assertUsableSkillsRoot(this.overrideRoot);
      return this.overrideRoot;
    }

    const moduleDir = dirname(fileURLToPath(import.meta.url));
    const candidates = [
      resolve(moduleDir, 'skills'),
      resolve(moduleDir, '../skills'),
      resolve(process.cwd(), 'skills')
    ];

    for (const candidate of candidates) {
      if (await this.isUsableSkillsRoot(candidate)) {
        return candidate;
      }
    }

    throw new Error(
      'Hyar package resource error: bundled skills directory was not found or is empty.'
    );
  }

  private async assertUsableSkillsRoot(path: string): Promise<void> {
    if (!(await this.isUsableSkillsRoot(path))) {
      throw new Error(
        `Hyar package resource error: skills directory is missing or empty: ${path}`
      );
    }
  }

  private async isUsableSkillsRoot(path: string): Promise<boolean> {
    try {
      await access(path);
      const pathStat = await stat(path);
      if (!pathStat.isDirectory()) {
        return false;
      }

      const entries = await readdir(path);
      return entries.length > 0;
    } catch {
      return false;
    }
  }
}
