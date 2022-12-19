import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'jsdom',
    setupFiles: ['jest-canvas-mock'],
    moduleNameMapper: {
      '^lib/(.*)$': '<rootDir>/lib/$1',
    },
  };
};
