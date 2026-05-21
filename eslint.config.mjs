import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const packageSourceFiles = ['package/*/src/**/*.ts'];

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**']
  },
  {
    ...js.configs.recommended,
    files: packageSourceFiles
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: packageSourceFiles
  })),
  {
    ...prettier,
    files: packageSourceFiles
  },
  {
    files: packageSourceFiles,
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  }
];
