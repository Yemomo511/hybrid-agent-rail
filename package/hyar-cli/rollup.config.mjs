import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'node:fs';
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

const typescriptPlugin = () =>
  typescript({
    include: [resolve(packageDir, 'src/**/*.ts')],
    noForceEmit: true,
    tsconfig: resolve(rootDir, 'tsconfig.base.json'),
    compilerOptions: {
      declaration: false,
      declarationMap: false,
      rootDir: resolve(packageDir, 'src')
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

export default [
  {
    external: isExternal,
    input: resolve(packageDir, 'src/index.ts'),
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
    plugins: [typescriptPlugin()]
  },
  {
    external: isExternal,
    input: resolve(packageDir, 'src/bin.ts'),
    output: {
      file: resolve(packageDir, packageJson.bin.hyar),
      format: 'esm',
      sourcemap: true
    },
    plugins: [typescriptPlugin(), exitAfterBundle()]
  }
];
