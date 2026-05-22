export default {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^hyar-adapter$': '<rootDir>/package/hyar-adapter/src/index.ts',
    '^hyar-cli$': '<rootDir>/package/hyar-cli/src/index.ts',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: 'tsconfig.base.json',
        useESM: true,
      },
    ],
  },
};
