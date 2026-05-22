import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const yaml = require('yaml') as {
  parse: (source: string) => unknown;
  stringify: (
    value: Record<string, unknown>,
    options?: { lineWidth?: number; sortMapEntries?: boolean }
  ) => string;
};

export const parseYaml = (source: string): unknown => {
  return yaml.parse(source);
};

export const stringifyYaml = (
  value: Record<string, unknown>,
  options?: { lineWidth?: number; sortMapEntries?: boolean }
): string => {
  return yaml.stringify(value, options);
};
