import type { Config } from 'jest';
import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>/lib/', '<rootDir>/test/'],
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'jsdom',
    setupFiles: ['jest-canvas-mock'],
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  };
};
