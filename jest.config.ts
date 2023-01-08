import type { Config } from 'jest';
import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest';

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'jsdom',
    setupFiles: ['jest-canvas-mock'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  };
};
