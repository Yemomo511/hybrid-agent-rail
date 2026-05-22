import typescript from '@rollup/plugin-typescript';
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(packageDir, '../..');
const packageJson = JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf8'));
const workspacePackagePrefix = ['hyar-'];
const packageDependencies = Object.keys(packageJson.dependencies ?? {});

const isExternal = (id) => {
  return id.startsWith('node:') || packageDependencies.includes(id) || workspacePackagePrefix.some((prefix) => id.startsWith(prefix));
};

const copySkills = () => ({
  name: 'copy-skills',
  writeBundle() {
    const source = resolve(rootDir, 'skills');
    const target = resolve(packageDir, 'dist/skills');

    rmSync(target, {
      force: true,
      recursive: true
    });

    if (existsSync(source)) {
      cpSync(source, target, {
        recursive: true
      });
    }
  }
});

const exitAfterBundle = () => ({
  closeBundle() {
    setImmediate(() => {
      process.exit(0);
    });
  },
  name: 'exit-after-bundle'
});

export default {
  input: resolve(packageDir, 'src/index.ts'),
  external: isExternal,
  output: [
    {
      file: resolve(packageDir, packageJson.exports['.'].import),
      format: 'esm',
      sourcemap: true
    },
    {
      file: resolve(packageDir, packageJson.exports['.'].require),
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
  typescript({
    include: [resolve(packageDir, 'src/**/*.ts')],
    noForceEmit: true,
    tsconfig: resolve(rootDir, 'tsconfig.base.json'),
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        rootDir: resolve(packageDir, 'src')
      }
    }),
    copySkills(),
    exitAfterBundle()
  ]
};
