import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageDir = process.cwd();
const packageJson = JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf8'));
const workspacePackagePrefix = ['hyar-'];

const isExternal = (id) => {
  return workspacePackagePrefix.some((prefix) => id.startsWith(prefix));
};

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
      tsconfig: resolve(rootDir, 'tsconfig.base.json'),
      compilerOptions: {
        declarationDir: resolve(packageDir, 'dist'),
        rootDir: resolve(packageDir, 'src')
      }
    })
  ]
};
